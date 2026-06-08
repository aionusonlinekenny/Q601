#!/usr/bin/env python
"""
Game Translation + Sprite Editor
Tabs: Config (config.nncc) | Equipment Items | Prop Items | Sprites
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
import re
import shutil
import os
from pathlib import Path

try:
    from PIL import Image, ImageTk
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

_CHINESE_RE = re.compile(r"[一-鿿㐀-䶿]")


def has_chinese(s):
    return bool(_CHINESE_RE.search(str(s)))


def truncate(s, max_len=80):
    s = str(s).replace("\r\n", " ").replace("\n", " ")
    return (s[:max_len - 1] + "…") if len(s) > max_len else s


# ---------------------------------------------------------------------------
class TranslationEditor:
    def __init__(self, root):
        self.root = root
        self.root.title("Game Translation + Sprite Editor")
        self.root.geometry("1280x860")
        self.root.minsize(900, 600)

        # Translation tab state
        self.config_path = None
        self.equip_path  = None
        self.props_path  = None
        self.config_data = None
        self.equip_data  = None
        self.props_data  = None
        self.config_current_section  = None
        self.config_filtered_indices = []
        self.equip_filtered_ids = []
        self.props_filtered_ids = []

        # Sprite tab state
        self.sprite_folder      = None
        self.sprite_json_files  = []        # list of Path
        self.sprite_atlas_img   = None      # PIL Image (current atlas)
        self.sprite_atlas_path  = None      # Path to PNG file
        self.sprite_list        = []        # [(name, x, y, w, h), …]
        self.sprite_format      = None      # "frames" | "subtexture" | "actor"
        self.sprite_json_data   = None      # raw parsed JSON
        self._sprite_tk_img     = None      # PhotoImage (prevent GC)
        self._sprite_full_tk_img = None

        self._build_ui()

    # -----------------------------------------------------------------------
    # UI
    # -----------------------------------------------------------------------
    def _build_ui(self):
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=4, pady=4)

        self.tab_config  = ttk.Frame(self.notebook)
        self.tab_equip   = ttk.Frame(self.notebook)
        self.tab_props   = ttk.Frame(self.notebook)
        self.tab_sprite  = ttk.Frame(self.notebook)

        self.notebook.add(self.tab_config,  text="Config (config.nncc)")
        self.notebook.add(self.tab_equip,   text="Equipment Items")
        self.notebook.add(self.tab_props,   text="Prop Items")
        self.notebook.add(self.tab_sprite,  text="Sprites")

        self._build_config_tab()
        self._build_item_tab(self.tab_equip, "equip", "equipItem.json")
        self._build_item_tab(self.tab_props, "props", "propsItem.json")
        self._build_sprite_tab()

        self.status_var = tk.StringVar(value="Use Browse to open a file.")
        ttk.Label(self.root, textvariable=self.status_var,
                  relief=tk.SUNKEN, anchor=tk.W, padding=(6, 2)
                  ).pack(side=tk.BOTTOM, fill=tk.X)

    # --- Config tab ---------------------------------------------------------
    def _build_config_tab(self):
        tab = self.tab_config

        bar1 = ttk.Frame(tab)
        bar1.pack(side=tk.TOP, fill=tk.X, padx=4, pady=(4, 0))
        ttk.Label(bar1, text="File:").pack(side=tk.LEFT)
        self.config_path_var = tk.StringVar(value="(no file loaded)")
        ttk.Entry(bar1, textvariable=self.config_path_var, state="readonly",
                  width=60).pack(side=tk.LEFT, padx=(4, 4), fill=tk.X, expand=True)
        ttk.Button(bar1, text="Browse…", command=self._config_browse).pack(side=tk.LEFT)
        ttk.Button(bar1, text="Reload",  command=self._config_reload).pack(side=tk.LEFT, padx=(4, 0))
        ttk.Button(bar1, text="Save",    command=self._config_save).pack(side=tk.LEFT, padx=(4, 0))

        bar2 = ttk.Frame(tab)
        bar2.pack(side=tk.TOP, fill=tk.X, padx=4, pady=(2, 0))
        self.config_search_var = tk.StringVar()
        self.config_search_var.trace_add("write", lambda *_: self._config_apply_filter())
        ttk.Label(bar2, text="Search:").pack(side=tk.LEFT)
        ttk.Entry(bar2, textvariable=self.config_search_var, width=30
                  ).pack(side=tk.LEFT, padx=(2, 8))
        self.config_filter_var = tk.StringVar(value="All")
        cb = ttk.Combobox(bar2, textvariable=self.config_filter_var,
                          values=["All", "Has Chinese", "No Chinese"],
                          width=14, state="readonly")
        cb.pack(side=tk.LEFT)
        cb.bind("<<ComboboxSelected>>", lambda _: self._config_apply_filter())

        paned = ttk.PanedWindow(tab, orient=tk.HORIZONTAL)
        paned.pack(fill=tk.BOTH, expand=True, padx=4, pady=4)

        lf = ttk.Frame(paned, width=220)
        lf.pack_propagate(False)
        paned.add(lf, weight=1)
        ttk.Label(lf, text="Sections", font=("TkDefaultFont", 9, "bold")
                  ).pack(anchor=tk.W, padx=4, pady=(4, 0))
        self.config_section_lb = tk.Listbox(lf, exportselection=False, activestyle="dotbox")
        sc = ttk.Scrollbar(lf, orient=tk.VERTICAL, command=self.config_section_lb.yview)
        self.config_section_lb.configure(yscrollcommand=sc.set)
        sc.pack(side=tk.RIGHT, fill=tk.Y)
        self.config_section_lb.pack(fill=tk.BOTH, expand=True, padx=(4, 0), pady=4)
        self.config_section_lb.bind("<<ListboxSelect>>", self._config_section_selected)

        rf = ttk.Frame(paned)
        paned.add(rf, weight=4)
        cols = ("index", "value", "chinese")
        self.config_tree = ttk.Treeview(rf, columns=cols, show="headings", height=18)
        self.config_tree.heading("index",   text="Index")
        self.config_tree.heading("value",   text="Value")
        self.config_tree.heading("chinese", text="Chinese?")
        self.config_tree.column("index",   width=55,  anchor=tk.CENTER)
        self.config_tree.column("value",   width=600)
        self.config_tree.column("chinese", width=70,  anchor=tk.CENTER)
        self.config_tree.tag_configure("chinese", background="#FFF3CD")
        sy = ttk.Scrollbar(rf, orient=tk.VERTICAL,   command=self.config_tree.yview)
        sx = ttk.Scrollbar(rf, orient=tk.HORIZONTAL, command=self.config_tree.xview)
        self.config_tree.configure(yscrollcommand=sy.set, xscrollcommand=sx.set)
        sy.pack(side=tk.RIGHT, fill=tk.Y)
        self.config_tree.pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        sx.pack(side=tk.TOP, fill=tk.X)
        self.config_tree.bind("<<TreeviewSelect>>", self._config_row_selected)

        ef = ttk.LabelFrame(rf, text="Edit Value", padding=4)
        ef.pack(fill=tk.X, pady=(4, 0))
        self.config_edit_text = tk.Text(ef, height=5, wrap=tk.WORD, font=("TkFixedFont", 10))
        es = ttk.Scrollbar(ef, orient=tk.VERTICAL, command=self.config_edit_text.yview)
        self.config_edit_text.configure(yscrollcommand=es.set)
        es.pack(side=tk.RIGHT, fill=tk.Y)
        self.config_edit_text.pack(fill=tk.BOTH, expand=True)

        br = ttk.Frame(rf)
        br.pack(fill=tk.X, pady=(2, 0))
        self.config_pos_label = ttk.Label(br, text="", foreground="gray")
        self.config_pos_label.pack(side=tk.LEFT, padx=4)
        ttk.Button(br, text="Apply Change", command=self._config_apply_edit
                   ).pack(side=tk.RIGHT, padx=4)

    # --- Item tab (shared) --------------------------------------------------
    def _build_item_tab(self, parent, prefix, default_filename):
        bar1 = ttk.Frame(parent)
        bar1.pack(side=tk.TOP, fill=tk.X, padx=4, pady=(4, 0))
        ttk.Label(bar1, text="File (s1):").pack(side=tk.LEFT)
        path_var = tk.StringVar(value="(no file loaded)")
        setattr(self, f"{prefix}_path_var", path_var)
        ttk.Entry(bar1, textvariable=path_var, state="readonly",
                  width=55).pack(side=tk.LEFT, padx=(4, 4), fill=tk.X, expand=True)
        ttk.Button(bar1, text="Browse…",
                   command=lambda p=prefix, fn=default_filename: self._item_browse(p, fn)
                   ).pack(side=tk.LEFT)
        ttk.Button(bar1, text="Reload",
                   command=lambda p=prefix: self._item_reload(p)
                   ).pack(side=tk.LEFT, padx=(4, 0))
        ttk.Button(bar1, text="Save (+ mirror s2/s3)",
                   command=lambda p=prefix: self._item_save(p)
                   ).pack(side=tk.LEFT, padx=(4, 0))

        bar2 = ttk.Frame(parent)
        bar2.pack(side=tk.TOP, fill=tk.X, padx=4, pady=(2, 0))
        search_var = tk.StringVar()
        filter_var = tk.StringVar(value="All")
        setattr(self, f"{prefix}_search_var", search_var)
        setattr(self, f"{prefix}_filter_var", filter_var)
        ttk.Label(bar2, text="Search:").pack(side=tk.LEFT)
        ttk.Entry(bar2, textvariable=search_var, width=30
                  ).pack(side=tk.LEFT, padx=(2, 8))
        search_var.trace_add("write", lambda *_, p=prefix: self._item_apply_filter(p))
        cb = ttk.Combobox(bar2, textvariable=filter_var,
                          values=["All", "Has Chinese", "No Chinese"],
                          width=14, state="readonly")
        cb.pack(side=tk.LEFT)
        cb.bind("<<ComboboxSelected>>", lambda _, p=prefix: self._item_apply_filter(p))

        paned = ttk.PanedWindow(parent, orient=tk.HORIZONTAL)
        paned.pack(fill=tk.BOTH, expand=True, padx=4, pady=4)

        lf = ttk.Frame(paned, width=240)
        lf.pack_propagate(False)
        paned.add(lf, weight=1)
        ttk.Label(lf, text="Items (ID: Name)", font=("TkDefaultFont", 9, "bold")
                  ).pack(anchor=tk.W, padx=4, pady=(4, 0))
        lb = tk.Listbox(lf, exportselection=False, activestyle="dotbox", font=("TkFixedFont", 9))
        sc = ttk.Scrollbar(lf, orient=tk.VERTICAL, command=lb.yview)
        lb.configure(yscrollcommand=sc.set)
        sc.pack(side=tk.RIGHT, fill=tk.Y)
        lb.pack(fill=tk.BOTH, expand=True, padx=(4, 0), pady=4)
        setattr(self, f"{prefix}_item_lb", lb)
        lb.bind("<<ListboxSelect>>", lambda e, p=prefix: self._item_lb_selected(p))

        rf = ttk.Frame(paned)
        paned.add(rf, weight=4)
        cols = ("id", "name", "description", "chinese")
        tree = ttk.Treeview(rf, columns=cols, show="headings", height=18)
        tree.heading("id",          text="ID")
        tree.heading("name",        text="Name")
        tree.heading("description", text="Description")
        tree.heading("chinese",     text="Chinese?")
        tree.column("id",          width=80,  anchor=tk.CENTER)
        tree.column("name",        width=200)
        tree.column("description", width=420)
        tree.column("chinese",     width=70,  anchor=tk.CENTER)
        tree.tag_configure("chinese", background="#FFF3CD")
        sy = ttk.Scrollbar(rf, orient=tk.VERTICAL,   command=tree.yview)
        sx = ttk.Scrollbar(rf, orient=tk.HORIZONTAL, command=tree.xview)
        tree.configure(yscrollcommand=sy.set, xscrollcommand=sx.set)
        sy.pack(side=tk.RIGHT, fill=tk.Y)
        tree.pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        sx.pack(side=tk.TOP, fill=tk.X)
        tree.bind("<<TreeviewSelect>>", lambda e, p=prefix: self._item_row_selected(p))
        setattr(self, f"{prefix}_tree", tree)

        ef = ttk.LabelFrame(rf, text="Edit Name / Description", padding=4)
        ef.pack(fill=tk.X, pady=(4, 0))
        ef.columnconfigure(1, weight=1)

        ttk.Label(ef, text="Name:").grid(row=0, column=0, sticky=tk.NW, padx=(0, 4))
        nt = tk.Text(ef, height=2, wrap=tk.WORD, font=("TkFixedFont", 10))
        ns = ttk.Scrollbar(ef, orient=tk.VERTICAL, command=nt.yview)
        nt.configure(yscrollcommand=ns.set)
        ns.grid(row=0, column=2, sticky=tk.NS)
        nt.grid(row=0, column=1, sticky=tk.EW, pady=(0, 4))
        setattr(self, f"{prefix}_name_text", nt)

        ttk.Label(ef, text="Desc:").grid(row=1, column=0, sticky=tk.NW, padx=(0, 4))
        dt = tk.Text(ef, height=3, wrap=tk.WORD, font=("TkFixedFont", 10))
        ds = ttk.Scrollbar(ef, orient=tk.VERTICAL, command=dt.yview)
        dt.configure(yscrollcommand=ds.set)
        ds.grid(row=1, column=2, sticky=tk.NS)
        dt.grid(row=1, column=1, sticky=tk.EW)
        setattr(self, f"{prefix}_desc_text", dt)

        br = ttk.Frame(rf)
        br.pack(fill=tk.X, pady=(2, 0))
        pl = ttk.Label(br, text="", foreground="gray")
        pl.pack(side=tk.LEFT, padx=4)
        setattr(self, f"{prefix}_pos_label", pl)
        ttk.Button(br, text="Apply Change",
                   command=lambda p=prefix: self._item_apply_edit(p)
                   ).pack(side=tk.RIGHT, padx=4)

    # --- Sprite tab ---------------------------------------------------------
    def _build_sprite_tab(self):
        tab = self.tab_sprite

        if not PIL_AVAILABLE:
            msg = ttk.Frame(tab)
            msg.place(relx=0.5, rely=0.5, anchor=tk.CENTER)
            ttk.Label(msg, text="Pillow library is required for the Sprites tab.",
                      font=("TkDefaultFont", 13, "bold")).pack(pady=(0, 8))
            ttk.Label(msg, text="Install it with:  pip install Pillow",
                      font=("TkFixedFont", 11)).pack()
            return

        # Toolbar
        bar = ttk.Frame(tab)
        bar.pack(side=tk.TOP, fill=tk.X, padx=4, pady=(4, 0))
        ttk.Button(bar, text="Browse Folder…",
                   command=self._sprite_browse_folder).pack(side=tk.LEFT)
        self.sprite_folder_var = tk.StringVar(value="(no folder selected)")
        ttk.Entry(bar, textvariable=self.sprite_folder_var, state="readonly",
                  width=55).pack(side=tk.LEFT, padx=(6, 4), fill=tk.X, expand=True)
        ttk.Button(bar, text="Browse JSON file…",
                   command=self._sprite_browse_file).pack(side=tk.LEFT, padx=(0, 4))

        # Action toolbar
        bar2 = ttk.Frame(tab)
        bar2.pack(side=tk.TOP, fill=tk.X, padx=4, pady=(2, 2))
        ttk.Button(bar2, text="Extract Selected",
                   command=self._sprite_extract_selected).pack(side=tk.LEFT, padx=(0, 4))
        ttk.Button(bar2, text="Extract All",
                   command=self._sprite_extract_all).pack(side=tk.LEFT, padx=(0, 4))
        ttk.Button(bar2, text="Import (Replace Selected)…",
                   command=self._sprite_import).pack(side=tk.LEFT, padx=(0, 4))
        ttk.Button(bar2, text="Save Atlas PNG",
                   command=self._sprite_save_atlas).pack(side=tk.LEFT, padx=(0, 12))
        self.sprite_info_var = tk.StringVar(value="")
        ttk.Label(bar2, textvariable=self.sprite_info_var,
                  foreground="gray").pack(side=tk.LEFT)

        # Three-pane layout: file list | sprite list | preview
        paned = ttk.PanedWindow(tab, orient=tk.HORIZONTAL)
        paned.pack(fill=tk.BOTH, expand=True, padx=4, pady=4)

        # Left: JSON file list
        lf = ttk.Frame(paned, width=200)
        lf.pack_propagate(False)
        paned.add(lf, weight=1)
        ttk.Label(lf, text="JSON files", font=("TkDefaultFont", 9, "bold")
                  ).pack(anchor=tk.W, padx=4, pady=(4, 0))
        self.sprite_file_lb = tk.Listbox(lf, exportselection=False,
                                          activestyle="dotbox", font=("TkFixedFont", 9))
        sc1 = ttk.Scrollbar(lf, orient=tk.VERTICAL, command=self.sprite_file_lb.yview)
        self.sprite_file_lb.configure(yscrollcommand=sc1.set)
        sc1.pack(side=tk.RIGHT, fill=tk.Y)
        self.sprite_file_lb.pack(fill=tk.BOTH, expand=True, padx=(4, 0), pady=4)
        self.sprite_file_lb.bind("<<ListboxSelect>>", self._sprite_file_selected)

        # Middle: sprite name list
        mf = ttk.Frame(paned, width=220)
        mf.pack_propagate(False)
        paned.add(mf, weight=1)
        ttk.Label(mf, text="Sprites", font=("TkDefaultFont", 9, "bold")
                  ).pack(anchor=tk.W, padx=4, pady=(4, 0))
        # Search box for sprites
        sf = ttk.Frame(mf)
        sf.pack(fill=tk.X, padx=4, pady=(2, 0))
        self.sprite_search_var = tk.StringVar()
        self.sprite_search_var.trace_add("write", lambda *_: self._sprite_apply_filter())
        ttk.Entry(sf, textvariable=self.sprite_search_var,
                  width=20).pack(fill=tk.X)
        self.sprite_name_lb = tk.Listbox(mf, exportselection=False,
                                          activestyle="dotbox", font=("TkFixedFont", 9))
        sc2 = ttk.Scrollbar(mf, orient=tk.VERTICAL, command=self.sprite_name_lb.yview)
        self.sprite_name_lb.configure(yscrollcommand=sc2.set)
        sc2.pack(side=tk.RIGHT, fill=tk.Y)
        self.sprite_name_lb.pack(fill=tk.BOTH, expand=True, padx=(4, 0), pady=(2, 4))
        self.sprite_name_lb.bind("<<ListboxSelect>>", self._sprite_name_selected)

        # Right: preview canvas
        rf = ttk.Frame(paned)
        paned.add(rf, weight=3)

        # Atlas thumbnail at top
        self.sprite_atlas_frame = ttk.LabelFrame(rf, text="Atlas", padding=2)
        self.sprite_atlas_frame.pack(fill=tk.X, padx=2, pady=(2, 0))
        self.sprite_atlas_canvas = tk.Canvas(self.sprite_atlas_frame,
                                              height=120, bg="#222", highlightthickness=0)
        self.sprite_atlas_canvas.pack(fill=tk.X)

        # Sprite preview below
        pv_frame = ttk.LabelFrame(rf, text="Sprite Preview", padding=2)
        pv_frame.pack(fill=tk.BOTH, expand=True, padx=2, pady=(4, 2))
        self.sprite_canvas = tk.Canvas(pv_frame, bg="#333", highlightthickness=0)
        sv = ttk.Scrollbar(pv_frame, orient=tk.VERTICAL,   command=self.sprite_canvas.yview)
        sh = ttk.Scrollbar(pv_frame, orient=tk.HORIZONTAL, command=self.sprite_canvas.xview)
        self.sprite_canvas.configure(yscrollcommand=sv.set, xscrollcommand=sh.set)
        sv.pack(side=tk.RIGHT,   fill=tk.Y)
        sh.pack(side=tk.BOTTOM,  fill=tk.X)
        self.sprite_canvas.pack(fill=tk.BOTH, expand=True)

    # -----------------------------------------------------------------------
    # Browse helpers
    # -----------------------------------------------------------------------
    def _config_browse(self):
        path = filedialog.askopenfilename(
            title="Open config.nncc",
            filetypes=[("Game config", "*.nncc"), ("JSON files", "*.json"), ("All files", "*.*")]
        )
        if path:
            self.config_path = Path(path)
            self.config_path_var.set(str(self.config_path))
            self._config_reload()

    def _item_browse(self, prefix, default_filename):
        path = filedialog.askopenfilename(
            title=f"Open {default_filename}",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        if path:
            p = Path(path)
            setattr(self, f"{prefix}_path", p)
            getattr(self, f"{prefix}_path_var").set(str(p))
            self._item_reload(prefix)

    # -----------------------------------------------------------------------
    # Config logic
    # -----------------------------------------------------------------------
    def _config_reload(self):
        if not self.config_path:
            messagebox.showinfo("No File", "Click Browse… to select config.nncc first.")
            return
        try:
            with open(self.config_path, "r", encoding="utf-8") as f:
                self.config_data = json.load(f)
        except Exception as e:
            messagebox.showerror("Load Error", f"Cannot load config.nncc:\n{e}")
            return
        self.config_section_lb.delete(0, tk.END)
        for section in sorted(self.config_data.keys()):
            self.config_section_lb.insert(tk.END, section)
        self.config_current_section = None
        self._config_clear_tree()
        self.status_var.set(f"Loaded {self.config_path.name} — {len(self.config_data)} sections.")

    def _config_section_selected(self, _event=None):
        sel = self.config_section_lb.curselection()
        if not sel:
            return
        self.config_current_section = self.config_section_lb.get(sel[0])
        self._config_apply_filter()

    def _config_apply_filter(self):
        if self.config_data is None or self.config_current_section is None:
            return
        section = self.config_current_section
        items  = self.config_data.get(section, [])
        search = self.config_search_var.get().strip().lower()
        flt    = self.config_filter_var.get()
        self.config_filtered_indices = []
        for i, item in enumerate(items):
            text = str(item)
            if search and search not in text.lower():
                continue
            ch = has_chinese(text)
            if flt == "Has Chinese" and not ch:
                continue
            if flt == "No Chinese" and ch:
                continue
            self.config_filtered_indices.append(i)
        self._config_populate_tree(section, items)

    def _config_populate_tree(self, section, items):
        self._config_clear_tree()
        for i in self.config_filtered_indices:
            item = items[i]
            ch  = has_chinese(str(item))
            tag = ("chinese",) if ch else ()
            self.config_tree.insert("", tk.END, iid=str(i),
                                    values=(i, truncate(str(item)), "Yes" if ch else ""),
                                    tags=tag)
        n_ch = sum(1 for it in items if has_chinese(str(it)))
        self.status_var.set(
            f"Section '{section}': {len(items)} items, {n_ch} Chinese  |  "
            f"Showing {len(self.config_filtered_indices)}"
        )

    def _config_clear_tree(self):
        for row in self.config_tree.get_children():
            self.config_tree.delete(row)
        self.config_edit_text.delete("1.0", tk.END)
        self.config_pos_label.configure(text="")

    def _config_row_selected(self, _event=None):
        sel = self.config_tree.selection()
        if not sel:
            return
        idx = int(sel[0])
        if self.config_data is None or self.config_current_section is None:
            return
        item = self.config_data[self.config_current_section][idx]
        self.config_edit_text.delete("1.0", tk.END)
        self.config_edit_text.insert("1.0", json.dumps(item, ensure_ascii=False, indent=2)
                                     if isinstance(item, list) else str(item))
        self.config_pos_label.configure(
            text=f"Section: {self.config_current_section}  |  Index: {idx}")

    def _config_apply_edit(self):
        sel = self.config_tree.selection()
        if not sel:
            messagebox.showwarning("No Selection", "Select a row first.")
            return
        idx = int(sel[0])
        if self.config_data is None or self.config_current_section is None:
            return
        raw = self.config_edit_text.get("1.0", tk.END).strip()
        try:
            new_val = json.loads(raw)
        except json.JSONDecodeError:
            new_val = raw
        self.config_data[self.config_current_section][idx] = new_val
        ch  = has_chinese(str(new_val))
        tag = ("chinese",) if ch else ()
        self.config_tree.item(str(idx),
                              values=(idx, truncate(str(new_val)), "Yes" if ch else ""),
                              tags=tag)
        self.status_var.set(f"Updated [{self.config_current_section}][{idx}] — unsaved.")

    def _config_save(self):
        if self.config_data is None:
            messagebox.showwarning("Nothing Loaded", "No data to save.")
            return
        try:
            with open(self.config_path, "w", encoding="utf-8") as f:
                json.dump(self.config_data, f, ensure_ascii=False, separators=(",", ":"))
            self.status_var.set(f"Saved → {self.config_path}")
        except Exception as e:
            messagebox.showerror("Save Error", str(e))

    # -----------------------------------------------------------------------
    # Item logic (shared)
    # -----------------------------------------------------------------------
    def _get_item_data(self, prefix):
        return self.equip_data if prefix == "equip" else self.props_data

    def _set_item_data(self, prefix, data):
        if prefix == "equip":
            self.equip_data = data
        else:
            self.props_data = data

    def _get_filtered_ids(self, prefix):
        return self.equip_filtered_ids if prefix == "equip" else self.props_filtered_ids

    def _set_filtered_ids(self, prefix, ids):
        if prefix == "equip":
            self.equip_filtered_ids = ids
        else:
            self.props_filtered_ids = ids

    def _item_reload(self, prefix):
        path = getattr(self, f"{prefix}_path", None)
        if not path:
            messagebox.showinfo("No File", "Click Browse… to select a file first.")
            return
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            messagebox.showerror("Load Error", f"Cannot load {path.name}:\n{e}")
            return
        self._set_item_data(prefix, data)
        self._item_apply_filter(prefix)
        n_ch = sum(
            1 for v in data.values()
            if has_chinese(v.get("property", {}).get("name", ""))
            or has_chinese(v.get("property", {}).get("description", ""))
        )
        self.status_var.set(f"Loaded {path.name} — {len(data)} items, {n_ch} Chinese.")

    def _item_apply_filter(self, prefix):
        data = self._get_item_data(prefix)
        if data is None:
            return
        search = getattr(self, f"{prefix}_search_var").get().strip().lower()
        flt    = getattr(self, f"{prefix}_filter_var").get()
        ids = []
        for item_id, entry in data.items():
            prop = entry.get("property", {})
            name = str(prop.get("name", ""))
            desc = str(prop.get("description", ""))
            if search and search not in f"{item_id} {name} {desc}".lower():
                continue
            ch = has_chinese(name) or has_chinese(desc)
            if flt == "Has Chinese" and not ch:
                continue
            if flt == "No Chinese" and ch:
                continue
            ids.append(item_id)
        self._set_filtered_ids(prefix, ids)
        self._item_populate_list(prefix)
        self._item_populate_tree(prefix)

    def _item_populate_list(self, prefix):
        lb   = getattr(self, f"{prefix}_item_lb")
        data = self._get_item_data(prefix)
        ids  = self._get_filtered_ids(prefix)
        lb.delete(0, tk.END)
        if data is None:
            return
        for item_id in ids:
            prop = data[item_id].get("property", {})
            name = prop.get("name", "")
            ch   = has_chinese(name) or has_chinese(prop.get("description", ""))
            lb.insert(tk.END, ("* " if ch else "  ") + f"{item_id}: {name[:28]}")

    def _item_populate_tree(self, prefix):
        tree = getattr(self, f"{prefix}_tree")
        data = self._get_item_data(prefix)
        ids  = self._get_filtered_ids(prefix)
        for row in tree.get_children():
            tree.delete(row)
        if data is None:
            return
        for item_id in ids:
            prop = data[item_id].get("property", {})
            name = str(prop.get("name", ""))
            desc = str(prop.get("description", ""))
            ch   = has_chinese(name) or has_chinese(desc)
            tag  = ("chinese",) if ch else ()
            tree.insert("", tk.END, iid=item_id,
                        values=(item_id, truncate(name, 45), truncate(desc, 75),
                                "Yes" if ch else ""),
                        tags=tag)

    def _item_lb_selected(self, prefix):
        lb  = getattr(self, f"{prefix}_item_lb")
        sel = lb.curselection()
        if not sel:
            return
        ids = self._get_filtered_ids(prefix)
        if sel[0] >= len(ids):
            return
        item_id = ids[sel[0]]
        tree = getattr(self, f"{prefix}_tree")
        try:
            tree.selection_set(item_id)
            tree.see(item_id)
        except tk.TclError:
            pass
        self._item_load_edit(prefix, item_id)

    def _item_row_selected(self, prefix):
        tree = getattr(self, f"{prefix}_tree")
        sel  = tree.selection()
        if not sel:
            return
        item_id = sel[0]
        ids = self._get_filtered_ids(prefix)
        if item_id in ids:
            lb  = getattr(self, f"{prefix}_item_lb")
            idx = ids.index(item_id)
            lb.selection_clear(0, tk.END)
            lb.selection_set(idx)
            lb.see(idx)
        self._item_load_edit(prefix, item_id)

    def _item_load_edit(self, prefix, item_id):
        data = self._get_item_data(prefix)
        if data is None or item_id not in data:
            return
        prop = data[item_id].get("property", {})
        name = str(prop.get("name", ""))
        desc = str(prop.get("description", ""))
        nt = getattr(self, f"{prefix}_name_text")
        dt = getattr(self, f"{prefix}_desc_text")
        pl = getattr(self, f"{prefix}_pos_label")
        nt.delete("1.0", tk.END); nt.insert("1.0", name)
        dt.delete("1.0", tk.END); dt.insert("1.0", desc)
        pl.configure(text=f"Item ID: {item_id}")

    def _item_apply_edit(self, prefix):
        tree = getattr(self, f"{prefix}_tree")
        sel  = tree.selection()
        if not sel:
            messagebox.showwarning("No Selection", "Select a row first.")
            return
        item_id = sel[0]
        data = self._get_item_data(prefix)
        if data is None or item_id not in data:
            return
        nt = getattr(self, f"{prefix}_name_text")
        dt = getattr(self, f"{prefix}_desc_text")
        new_name = nt.get("1.0", tk.END).rstrip("\n")
        new_desc = dt.get("1.0", tk.END).rstrip("\n")
        data[item_id].setdefault("property", {})
        data[item_id]["property"]["name"]        = new_name
        data[item_id]["property"]["description"] = new_desc
        ch  = has_chinese(new_name) or has_chinese(new_desc)
        tag = ("chinese",) if ch else ()
        tree.item(item_id,
                  values=(item_id, truncate(new_name, 45), truncate(new_desc, 75),
                          "Yes" if ch else ""),
                  tags=tag)
        lb  = getattr(self, f"{prefix}_item_lb")
        ids = self._get_filtered_ids(prefix)
        if item_id in ids:
            li = ids.index(item_id)
            lb.delete(li)
            lb.insert(li, ("* " if ch else "  ") + f"{item_id}: {new_name[:28]}")
            lb.selection_set(li)
        self.status_var.set(f"Updated {item_id} — unsaved.")

    def _item_save(self, prefix):
        data = self._get_item_data(prefix)
        if data is None:
            messagebox.showwarning("Nothing Loaded", "No data loaded.")
            return
        path = getattr(self, f"{prefix}_path", None)
        if not path:
            messagebox.showwarning("No File", "No file path known.")
            return
        try:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
        except Exception as e:
            messagebox.showerror("Save Error", str(e))
            return
        copied, failed = [], []
        for zone in ("my_s2", "my_s3"):
            dest = Path(str(path).replace("my_s1", zone))
            if dest == path:
                continue
            try:
                if dest.parent.exists():
                    shutil.copy2(path, dest)
                    copied.append(zone)
                else:
                    failed.append(f"{zone} (folder not found)")
            except Exception as e:
                failed.append(f"{zone} ({e})")
        msg = f"Saved → {path}"
        if copied:
            msg += f"  |  Mirrored to: {', '.join(copied)}"
        if failed:
            msg += f"  |  Could not mirror: {', '.join(failed)}"
        self.status_var.set(msg)

    # -----------------------------------------------------------------------
    # Sprite logic
    # -----------------------------------------------------------------------
    def _sprite_browse_folder(self):
        folder = filedialog.askdirectory(title="Select folder containing JSON + PNG sprite files")
        if not folder:
            return
        self.sprite_folder = Path(folder)
        self.sprite_folder_var.set(str(self.sprite_folder))
        files = sorted(self.sprite_folder.glob("*.json"))
        self.sprite_json_files = files
        self.sprite_file_lb.delete(0, tk.END)
        for f in files:
            self.sprite_file_lb.insert(tk.END, f.name)
        self.status_var.set(f"Folder: {self.sprite_folder}  |  {len(files)} JSON files found.")
        # Clear sprite list and preview
        self.sprite_name_lb.delete(0, tk.END)
        self.sprite_list = []
        self._sprite_clear_preview()

    def _sprite_browse_file(self):
        path = filedialog.askopenfilename(
            title="Open sprite JSON file",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        if not path:
            return
        p = Path(path)
        self.sprite_folder = p.parent
        self.sprite_folder_var.set(str(self.sprite_folder))
        # Load folder list and pre-select this file
        files = sorted(self.sprite_folder.glob("*.json"))
        self.sprite_json_files = files
        self.sprite_file_lb.delete(0, tk.END)
        for f in files:
            self.sprite_file_lb.insert(tk.END, f.name)
        # Select the browsed file
        if p in files:
            idx = files.index(p)
            self.sprite_file_lb.selection_set(idx)
            self.sprite_file_lb.see(idx)
        self._sprite_load_json(p)

    def _sprite_file_selected(self, _event=None):
        sel = self.sprite_file_lb.curselection()
        if not sel or sel[0] >= len(self.sprite_json_files):
            return
        json_path = self.sprite_json_files[sel[0]]
        self._sprite_load_json(json_path)

    def _sprite_load_json(self, json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            messagebox.showerror("Load Error", f"Cannot parse {json_path.name}:\n{e}")
            return

        self.sprite_json_data = data
        fmt = self._sprite_detect_format(data)
        self.sprite_format = fmt

        # Find paired PNG
        png_path = self._sprite_find_png(json_path, data)
        if png_path is None or not png_path.exists():
            messagebox.showwarning(
                "PNG Not Found",
                f"Could not find paired PNG for {json_path.name}.\n"
                f"Expected: {png_path}"
            )
            self.sprite_atlas_img  = None
            self.sprite_atlas_path = None
        else:
            try:
                self.sprite_atlas_img  = Image.open(png_path).convert("RGBA")
                self.sprite_atlas_path = png_path
            except Exception as e:
                messagebox.showerror("PNG Error", f"Cannot open {png_path.name}:\n{e}")
                self.sprite_atlas_img  = None
                self.sprite_atlas_path = None

        # Extract sprite list
        self.sprite_list = self._sprite_extract_list(data, fmt)
        self._sprite_populate_list()

        # Draw atlas thumbnail
        self._sprite_draw_atlas_thumb()

        n = len(self.sprite_list)
        png_name = png_path.name if png_path else "N/A"
        self.status_var.set(
            f"{json_path.name}  |  Format: {fmt}  |  {n} sprites  |  Atlas: {png_name}"
        )

    def _sprite_detect_format(self, data):
        if "frames" in data and isinstance(data.get("frames"), dict):
            return "frames"
        if "SubTexture" in data and isinstance(data.get("SubTexture"), list):
            return "subtexture"
        if "res" in data and "mc" in data:
            return "actor"
        return "unknown"

    def _sprite_find_png(self, json_path, data):
        # Try JSON-specified path first
        for key in ("file", "imagePath", "image"):
            val = data.get(key)
            if val:
                candidate = json_path.parent / val
                if candidate.exists():
                    return candidate
        # Fall back to same basename with .png
        return json_path.with_suffix(".png")

    def _sprite_extract_list(self, data, fmt):
        sprites = []
        if fmt == "frames":
            for name, fr in data.get("frames", {}).items():
                x = fr.get("x", 0)
                y = fr.get("y", 0)
                w = fr.get("w", fr.get("width",  0))
                h = fr.get("h", fr.get("height", 0))
                sprites.append((name, x, y, w, h))
        elif fmt == "subtexture":
            for st in data.get("SubTexture", []):
                name = st.get("name", "?")
                x = st.get("x", 0)
                y = st.get("y", 0)
                w = st.get("width",  st.get("w", 0))
                h = st.get("height", st.get("h", 0))
                sprites.append((name, x, y, w, h))
        elif fmt == "actor":
            for name, r in data.get("res", {}).items():
                x = r.get("x", 0)
                y = r.get("y", 0)
                w = r.get("w", r.get("width",  0))
                h = r.get("h", r.get("height", 0))
                sprites.append((name, x, y, w, h))
        return sprites

    def _sprite_populate_list(self):
        self.sprite_name_lb.delete(0, tk.END)
        search = self.sprite_search_var.get().strip().lower()
        self._sprite_filtered = []
        for entry in self.sprite_list:
            name = entry[0]
            if search and search not in name.lower():
                continue
            self._sprite_filtered.append(entry)
            self.sprite_name_lb.insert(tk.END, f"{name}  ({entry[3]}×{entry[4]})")
        self._sprite_clear_preview()

    def _sprite_apply_filter(self):
        if not self.sprite_list:
            return
        self._sprite_populate_list()

    def _sprite_name_selected(self, _event=None):
        sel = self.sprite_name_lb.curselection()
        if not sel:
            return
        entry = self._sprite_filtered[sel[0]]
        name, x, y, w, h = entry
        self.sprite_info_var.set(f"{name}  x={x} y={y} w={w} h={h}")
        self._sprite_show_preview(x, y, w, h)
        # Highlight on atlas thumb
        self._sprite_draw_atlas_thumb(highlight=(x, y, w, h))

    def _sprite_show_preview(self, x, y, w, h):
        if self.sprite_atlas_img is None:
            self._sprite_clear_preview()
            return
        if w <= 0 or h <= 0:
            self._sprite_clear_preview()
            return
        crop = self.sprite_atlas_img.crop((x, y, x + w, y + h))
        # Scale up small sprites for visibility (max 4× or 400px)
        scale = max(1, min(4, 400 // max(w, h, 1)))
        if scale > 1:
            crop = crop.resize((w * scale, h * scale), Image.NEAREST)
        self._sprite_tk_img = ImageTk.PhotoImage(crop)
        c = self.sprite_canvas
        c.delete("all")
        c.configure(scrollregion=(0, 0, crop.width, crop.height))
        c.create_image(0, 0, anchor=tk.NW, image=self._sprite_tk_img)

    def _sprite_draw_atlas_thumb(self, highlight=None):
        c = self.sprite_atlas_canvas
        c.delete("all")
        if self.sprite_atlas_img is None:
            return
        # Fit atlas into 120px height, up to 800px wide
        aw, ah = self.sprite_atlas_img.size
        max_h = 116
        max_w = c.winfo_width() or 800
        scale = min(max_h / ah, max_w / aw, 1.0)
        tw = max(1, int(aw * scale))
        th = max(1, int(ah * scale))
        thumb = self.sprite_atlas_img.resize((tw, th), Image.LANCZOS)
        self._sprite_full_tk_img = ImageTk.PhotoImage(thumb)
        c.configure(width=tw)
        c.create_image(0, 0, anchor=tk.NW, image=self._sprite_full_tk_img)
        if highlight:
            hx, hy, hw, hh = highlight
            c.create_rectangle(
                int(hx * scale), int(hy * scale),
                int((hx + hw) * scale), int((hy + hh) * scale),
                outline="#FF4444", width=2
            )

    def _sprite_clear_preview(self):
        self.sprite_canvas.delete("all")
        self.sprite_info_var.set("")
        self._sprite_tk_img = None

    def _sprite_get_selected_entry(self):
        sel = self.sprite_name_lb.curselection()
        if not sel:
            return None
        filtered = getattr(self, "_sprite_filtered", [])
        if sel[0] >= len(filtered):
            return None
        return filtered[sel[0]]

    def _sprite_crop(self, entry):
        name, x, y, w, h = entry
        if self.sprite_atlas_img is None:
            return None, name
        return self.sprite_atlas_img.crop((x, y, x + w, y + h)), name

    # --- Extract ------------------------------------------------------------
    def _sprite_extract_selected(self):
        entry = self._sprite_get_selected_entry()
        if entry is None:
            messagebox.showwarning("No Selection", "Select a sprite first.")
            return
        crop, name = self._sprite_crop(entry)
        if crop is None:
            messagebox.showwarning("No Atlas", "Load a sprite atlas first.")
            return
        safe_name = re.sub(r'[\\/:*?"<>|]', "_", name)
        out = filedialog.asksaveasfilename(
            title="Save sprite as PNG",
            initialfile=f"{safe_name}.png",
            defaultextension=".png",
            filetypes=[("PNG", "*.png")]
        )
        if out:
            crop.save(out)
            self.status_var.set(f"Extracted → {out}")

    def _sprite_extract_all(self):
        if not self.sprite_list:
            messagebox.showwarning("No Sprites", "No sprite data loaded.")
            return
        if self.sprite_atlas_img is None:
            messagebox.showwarning("No Atlas", "Load a sprite atlas first.")
            return
        out_dir = filedialog.askdirectory(title="Select output folder for extracted sprites")
        if not out_dir:
            return
        out_path = Path(out_dir)
        count = 0
        errors = 0
        for entry in self.sprite_list:
            name, x, y, w, h = entry
            if w <= 0 or h <= 0:
                continue
            crop = self.sprite_atlas_img.crop((x, y, x + w, y + h))
            safe_name = re.sub(r'[\\/:*?"<>|]', "_", name)
            try:
                crop.save(out_path / f"{safe_name}.png")
                count += 1
            except Exception:
                errors += 1
        msg = f"Extracted {count} sprites → {out_path}"
        if errors:
            msg += f"  ({errors} errors)"
        self.status_var.set(msg)
        messagebox.showinfo("Done", msg)

    # --- Import (Replace) ---------------------------------------------------
    def _sprite_import(self):
        entry = self._sprite_get_selected_entry()
        if entry is None:
            messagebox.showwarning("No Selection", "Select a sprite to replace first.")
            return
        if self.sprite_atlas_img is None:
            messagebox.showwarning("No Atlas", "Load a sprite atlas first.")
            return
        name, x, y, w, h = entry
        src = filedialog.askopenfilename(
            title=f"Import replacement PNG for '{name}'",
            filetypes=[("PNG files", "*.png"), ("All files", "*.*")]
        )
        if not src:
            return
        try:
            new_img = Image.open(src).convert("RGBA")
        except Exception as e:
            messagebox.showerror("Image Error", f"Cannot open image:\n{e}")
            return

        if new_img.size != (w, h):
            # Step 1: crop to visible (non-transparent) content bounding box.
            alpha = new_img.split()[3]
            bbox = alpha.getbbox()  # None if fully transparent
            if bbox and bbox != (0, 0, new_img.width, new_img.height):
                new_img = new_img.crop(bbox)
            # Step 2: resize the cropped object directly to the sprite slot.
            # Slight aspect-ratio stretch is acceptable — the image was drawn
            # for this specific slot anyway.
            new_img = new_img.resize((w, h), Image.LANCZOS)

        # Paste into atlas
        self.sprite_atlas_img.paste(new_img, (x, y))
        # Refresh preview
        self._sprite_show_preview(x, y, w, h)
        self._sprite_draw_atlas_thumb(highlight=(x, y, w, h))
        self.status_var.set(
            f"Replaced '{name}' at ({x},{y}) {w}×{h} — click Save Atlas PNG to write to disk."
        )

    # --- Save atlas ---------------------------------------------------------
    def _sprite_save_atlas(self):
        if self.sprite_atlas_img is None:
            messagebox.showwarning("No Atlas", "No atlas image loaded.")
            return
        if self.sprite_atlas_path is None:
            out = filedialog.asksaveasfilename(
                title="Save atlas PNG",
                defaultextension=".png",
                filetypes=[("PNG", "*.png")]
            )
            if not out:
                return
            self.sprite_atlas_path = Path(out)
        try:
            self.sprite_atlas_img.save(self.sprite_atlas_path)
            self.status_var.set(f"Atlas saved → {self.sprite_atlas_path}")
        except Exception as e:
            messagebox.showerror("Save Error", str(e))


# ---------------------------------------------------------------------------
def main():
    root = tk.Tk()
    style = ttk.Style()
    try:
        style.theme_use("clam")
    except tk.TclError:
        pass
    style.configure("Treeview", rowheight=22)
    style.configure("Treeview.Heading", font=("TkDefaultFont", 9, "bold"))
    TranslationEditor(root)
    root.mainloop()


if __name__ == "__main__":
    main()
