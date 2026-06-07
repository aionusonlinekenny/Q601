#!/usr/bin/env python
"""
Game Translation Editor
Browse and edit translated strings in config.nncc, equipItem.json, propsItem.json
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
import re
import shutil
import os
from pathlib import Path

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
        self.root.title("Game Translation Editor")
        self.root.geometry("1200x820")
        self.root.minsize(900, 600)

        # Active file paths (set when user browses)
        self.config_path = None
        self.equip_path = None   # always s1
        self.props_path = None   # always s1

        # In-memory data
        self.config_data = None
        self.equip_data = None
        self.props_data = None

        self.config_current_section = None
        self.config_filtered_indices = []
        self.equip_filtered_ids = []
        self.props_filtered_ids = []

        self._build_ui()

    # -----------------------------------------------------------------------
    # UI
    # -----------------------------------------------------------------------
    def _build_ui(self):
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=4, pady=4)

        self.tab_config = ttk.Frame(self.notebook)
        self.tab_equip  = ttk.Frame(self.notebook)
        self.tab_props  = ttk.Frame(self.notebook)

        self.notebook.add(self.tab_config, text="Config (config.nncc)")
        self.notebook.add(self.tab_equip,  text="Equipment Items")
        self.notebook.add(self.tab_props,  text="Prop Items")

        self._build_config_tab()
        self._build_item_tab(self.tab_equip, "equip", "equipItem.json")
        self._build_item_tab(self.tab_props, "props", "propsItem.json")

        self.status_var = tk.StringVar(value="Use Browse to open a file.")
        ttk.Label(self.root, textvariable=self.status_var,
                  relief=tk.SUNKEN, anchor=tk.W, padding=(6, 2)
                  ).pack(side=tk.BOTTOM, fill=tk.X)

    # --- Config tab ---------------------------------------------------------
    def _build_config_tab(self):
        tab = self.tab_config

        # Toolbar row 1: file path
        bar1 = ttk.Frame(tab)
        bar1.pack(side=tk.TOP, fill=tk.X, padx=4, pady=(4, 0))

        ttk.Label(bar1, text="File:").pack(side=tk.LEFT)
        self.config_path_var = tk.StringVar(value="(no file loaded)")
        ttk.Entry(bar1, textvariable=self.config_path_var, state="readonly",
                  width=60).pack(side=tk.LEFT, padx=(4, 4), fill=tk.X, expand=True)
        ttk.Button(bar1, text="Browse…", command=self._config_browse).pack(side=tk.LEFT)
        ttk.Button(bar1, text="Reload",  command=self._config_reload).pack(side=tk.LEFT, padx=(4, 0))
        ttk.Button(bar1, text="Save",    command=self._config_save).pack(side=tk.LEFT, padx=(4, 0))

        # Toolbar row 2: search / filter
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

        # PanedWindow
        paned = ttk.PanedWindow(tab, orient=tk.HORIZONTAL)
        paned.pack(fill=tk.BOTH, expand=True, padx=4, pady=4)

        # Left: section list
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

        # Right: tree + edit
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
        # Toolbar row 1: file path
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

        # Toolbar row 2: search / filter
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

        # PanedWindow
        paned = ttk.PanedWindow(parent, orient=tk.HORIZONTAL)
        paned.pack(fill=tk.BOTH, expand=True, padx=4, pady=4)

        # Left: item list
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

        # Right: tree + edit
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

        # Edit area
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
        items = self.config_data.get(section, [])
        search = self.config_search_var.get().strip().lower()
        flt = self.config_filter_var.get()

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
            ch = has_chinese(str(item))
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
        ch = has_chinese(str(new_val))
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
            ch = has_chinese(name) or has_chinese(prop.get("description", ""))
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

        # Try to mirror to s2/s3 by substituting my_s1 → my_s2 / my_s3
        copied, failed = [], []
        for zone in ("my_s2", "my_s3"):
            dest = Path(str(path).replace("my_s1", zone))
            if dest == path:
                continue  # path didn't contain my_s1
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
