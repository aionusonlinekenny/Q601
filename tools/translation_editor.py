#!/usr/bin/env python
"""
Game Translation Editor
A desktop GUI for reviewing and editing translated strings in PHP mobile game config files.
"""

import tkinter as tk
from tkinter import ttk, messagebox
import json
import re
import shutil
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE = Path(__file__).parent.parent  # /home/user/Q601

CONFIG_PATH = BASE / "MYH5/my_web/myh5_cilent/v1.1.9.1/resource/data/config.nncc"

EQUIP_PATHS = {
    "s1": BASE / "MYH5/my_s1/conf/item/equipItem.json",
    "s2": BASE / "MYH5/my_s2/conf/item/equipItem.json",
    "s3": BASE / "MYH5/my_s3/conf/item/equipItem.json",
}

PROPS_PATHS = {
    "s1": BASE / "MYH5/my_s1/conf/item/propsItem.json",
    "s2": BASE / "MYH5/my_s2/conf/item/propsItem.json",
    "s3": BASE / "MYH5/my_s3/conf/item/propsItem.json",
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
_CHINESE_RE = re.compile(r"[一-鿿㐀-䶿]")


def has_chinese(s: object) -> bool:
    return bool(_CHINESE_RE.search(str(s)))


def truncate(s: str, max_len: int = 80) -> str:
    s = str(s).replace("\r\n", " ").replace("\n", " ")
    if len(s) > max_len:
        return s[:max_len - 1] + "…"
    return s


# ---------------------------------------------------------------------------
# Main application
# ---------------------------------------------------------------------------
class TranslationEditor:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("Game Translation Editor")
        self.root.geometry("1200x800")
        self.root.minsize(1000, 700)

        # In-memory data stores
        self.config_data: dict | None = None        # full config.nncc dict
        self.equip_data: dict | None = None         # full equipItem.json dict
        self.props_data: dict | None = None         # full propsItem.json dict

        # Current state for config tab
        self.config_current_section: str | None = None
        self.config_filtered_indices: list[int] = []  # indices into section list

        # Current state for item tabs
        self.equip_filtered_ids: list[str] = []
        self.props_filtered_ids: list[str] = []

        self._build_ui()
        self._bind_tab_change()

    # -----------------------------------------------------------------------
    # UI Construction
    # -----------------------------------------------------------------------

    def _build_ui(self):
        # Notebook tabs
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=4, pady=4)

        self.tab_config = ttk.Frame(self.notebook)
        self.tab_equip = ttk.Frame(self.notebook)
        self.tab_props = ttk.Frame(self.notebook)

        self.notebook.add(self.tab_config, text="Config (config.nncc)")
        self.notebook.add(self.tab_equip, text="Equipment Items")
        self.notebook.add(self.tab_props, text="Prop Items")

        self._build_config_tab()
        self._build_item_tab(
            parent=self.tab_equip,
            prefix="equip",
            paths=EQUIP_PATHS,
        )
        self._build_item_tab(
            parent=self.tab_props,
            prefix="props",
            paths=PROPS_PATHS,
        )

        # Global status bar
        self.status_var = tk.StringVar(value="Ready. Select a tab to load data.")
        status_bar = ttk.Label(self.root, textvariable=self.status_var,
                               relief=tk.SUNKEN, anchor=tk.W, padding=(6, 2))
        status_bar.pack(side=tk.BOTTOM, fill=tk.X)

    # --- Config tab ---------------------------------------------------------

    def _build_config_tab(self):
        tab = self.tab_config

        # Toolbar
        toolbar = ttk.Frame(tab)
        toolbar.pack(side=tk.TOP, fill=tk.X, padx=4, pady=(4, 0))

        self.config_search_var = tk.StringVar()
        self.config_search_var.trace_add("write", lambda *_: self._config_apply_filter())
        ttk.Label(toolbar, text="Search:").pack(side=tk.LEFT)
        ttk.Entry(toolbar, textvariable=self.config_search_var, width=28).pack(side=tk.LEFT, padx=(2, 8))

        self.config_filter_var = tk.StringVar(value="All")
        filter_cb = ttk.Combobox(toolbar, textvariable=self.config_filter_var,
                                 values=["All", "Has Chinese", "No Chinese"],
                                 width=14, state="readonly")
        filter_cb.pack(side=tk.LEFT, padx=(0, 8))
        filter_cb.bind("<<ComboboxSelected>>", lambda _e: self._config_apply_filter())

        ttk.Button(toolbar, text="Reload", command=self._config_reload).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="Save", command=self._config_save).pack(side=tk.LEFT, padx=2)

        # PanedWindow: left=section list, right=entries
        paned = ttk.PanedWindow(tab, orient=tk.HORIZONTAL)
        paned.pack(fill=tk.BOTH, expand=True, padx=4, pady=4)

        # --- Left panel: section list
        left_frame = ttk.Frame(paned, width=260)
        left_frame.pack_propagate(False)
        paned.add(left_frame, weight=1)

        ttk.Label(left_frame, text="Sections", font=("TkDefaultFont", 9, "bold")).pack(anchor=tk.W, padx=4, pady=(4, 0))
        self.config_section_lb = tk.Listbox(left_frame, exportselection=False, activestyle="dotbox")
        sect_scroll = ttk.Scrollbar(left_frame, orient=tk.VERTICAL, command=self.config_section_lb.yview)
        self.config_section_lb.configure(yscrollcommand=sect_scroll.set)
        sect_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        self.config_section_lb.pack(fill=tk.BOTH, expand=True, padx=(4, 0), pady=4)
        self.config_section_lb.bind("<<ListboxSelect>>", self._config_section_selected)

        # --- Right panel: entry table + edit area
        right_frame = ttk.Frame(paned)
        paned.add(right_frame, weight=4)

        # Treeview
        cols = ("index", "value", "chinese")
        self.config_tree = ttk.Treeview(right_frame, columns=cols, show="headings", height=18)
        self.config_tree.heading("index", text="Index")
        self.config_tree.heading("value", text="Value")
        self.config_tree.heading("chinese", text="Chinese?")
        self.config_tree.column("index", width=55, minwidth=40, anchor=tk.CENTER)
        self.config_tree.column("value", width=620, minwidth=200)
        self.config_tree.column("chinese", width=70, minwidth=60, anchor=tk.CENTER)
        self.config_tree.tag_configure("chinese", background="#FFF3CD")

        tree_scroll_y = ttk.Scrollbar(right_frame, orient=tk.VERTICAL, command=self.config_tree.yview)
        tree_scroll_x = ttk.Scrollbar(right_frame, orient=tk.HORIZONTAL, command=self.config_tree.xview)
        self.config_tree.configure(yscrollcommand=tree_scroll_y.set, xscrollcommand=tree_scroll_x.set)

        tree_scroll_y.pack(side=tk.RIGHT, fill=tk.Y)
        self.config_tree.pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        tree_scroll_x.pack(side=tk.TOP, fill=tk.X)

        self.config_tree.bind("<<TreeviewSelect>>", self._config_row_selected)

        # Edit area
        edit_frame = ttk.LabelFrame(right_frame, text="Edit Value", padding=4)
        edit_frame.pack(fill=tk.X, padx=0, pady=(4, 0))

        self.config_edit_text = tk.Text(edit_frame, height=5, wrap=tk.WORD,
                                        font=("TkFixedFont", 10))
        edit_scroll = ttk.Scrollbar(edit_frame, orient=tk.VERTICAL, command=self.config_edit_text.yview)
        self.config_edit_text.configure(yscrollcommand=edit_scroll.set)
        edit_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        self.config_edit_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        btn_row = ttk.Frame(right_frame)
        btn_row.pack(fill=tk.X, pady=(2, 0))
        self.config_pos_label = ttk.Label(btn_row, text="", foreground="gray")
        self.config_pos_label.pack(side=tk.LEFT, padx=4)
        ttk.Button(btn_row, text="Apply Change", command=self._config_apply_edit).pack(side=tk.RIGHT, padx=4)

    # --- Item tab (shared for equip and props) --------------------------------

    def _build_item_tab(self, parent: ttk.Frame, prefix: str, paths: dict):
        """Build an equipment or props tab. prefix is 'equip' or 'props'."""

        # Toolbar
        toolbar = ttk.Frame(parent)
        toolbar.pack(side=tk.TOP, fill=tk.X, padx=4, pady=(4, 0))

        search_var = tk.StringVar()
        filter_var = tk.StringVar(value="All")

        setattr(self, f"{prefix}_search_var", search_var)
        setattr(self, f"{prefix}_filter_var", filter_var)

        ttk.Label(toolbar, text="Search:").pack(side=tk.LEFT)
        search_entry = ttk.Entry(toolbar, textvariable=search_var, width=28)
        search_entry.pack(side=tk.LEFT, padx=(2, 8))
        search_var.trace_add("write", lambda *_: self._item_apply_filter(prefix))

        filter_cb = ttk.Combobox(toolbar, textvariable=filter_var,
                                 values=["All", "Has Chinese", "No Chinese"],
                                 width=14, state="readonly")
        filter_cb.pack(side=tk.LEFT, padx=(0, 8))
        filter_cb.bind("<<ComboboxSelected>>", lambda _e: self._item_apply_filter(prefix))

        ttk.Button(toolbar, text="Reload",
                   command=lambda p=prefix: self._item_reload(p)).pack(side=tk.LEFT, padx=2)
        ttk.Button(toolbar, text="Save",
                   command=lambda p=prefix, ps=paths: self._item_save(p, ps)).pack(side=tk.LEFT, padx=2)

        # PanedWindow
        paned = ttk.PanedWindow(parent, orient=tk.HORIZONTAL)
        paned.pack(fill=tk.BOTH, expand=True, padx=4, pady=4)

        # --- Left panel: item list
        left_frame = ttk.Frame(paned, width=260)
        left_frame.pack_propagate(False)
        paned.add(left_frame, weight=1)

        ttk.Label(left_frame, text="Items (ID: Name)", font=("TkDefaultFont", 9, "bold")).pack(
            anchor=tk.W, padx=4, pady=(4, 0))
        item_lb = tk.Listbox(left_frame, exportselection=False, activestyle="dotbox",
                             font=("TkFixedFont", 9))
        item_scroll = ttk.Scrollbar(left_frame, orient=tk.VERTICAL, command=item_lb.yview)
        item_lb.configure(yscrollcommand=item_scroll.set)
        item_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        item_lb.pack(fill=tk.BOTH, expand=True, padx=(4, 0), pady=4)

        setattr(self, f"{prefix}_item_lb", item_lb)
        item_lb.bind("<<ListboxSelect>>",
                     lambda e, p=prefix: self._item_lb_selected(p))

        # --- Right panel
        right_frame = ttk.Frame(paned)
        paned.add(right_frame, weight=4)

        # Treeview
        cols = ("id", "name", "description", "chinese")
        tree = ttk.Treeview(right_frame, columns=cols, show="headings", height=18)
        tree.heading("id", text="ID")
        tree.heading("name", text="Name")
        tree.heading("description", text="Description")
        tree.heading("chinese", text="Chinese?")
        tree.column("id", width=80, minwidth=60, anchor=tk.CENTER)
        tree.column("name", width=200, minwidth=100)
        tree.column("description", width=400, minwidth=150)
        tree.column("chinese", width=70, minwidth=60, anchor=tk.CENTER)
        tree.tag_configure("chinese", background="#FFF3CD")

        tree_sy = ttk.Scrollbar(right_frame, orient=tk.VERTICAL, command=tree.yview)
        tree_sx = ttk.Scrollbar(right_frame, orient=tk.HORIZONTAL, command=tree.xview)
        tree.configure(yscrollcommand=tree_sy.set, xscrollcommand=tree_sx.set)

        tree_sy.pack(side=tk.RIGHT, fill=tk.Y)
        tree.pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        tree_sx.pack(side=tk.TOP, fill=tk.X)

        tree.bind("<<TreeviewSelect>>", lambda e, p=prefix: self._item_row_selected(p))
        setattr(self, f"{prefix}_tree", tree)

        # Edit area — two labeled fields
        edit_frame = ttk.LabelFrame(right_frame, text="Edit Name / Description", padding=4)
        edit_frame.pack(fill=tk.X, padx=0, pady=(4, 0))

        edit_frame.columnconfigure(1, weight=1)

        ttk.Label(edit_frame, text="Name:").grid(row=0, column=0, sticky=tk.NW, padx=(0, 4))
        name_text = tk.Text(edit_frame, height=2, wrap=tk.WORD, font=("TkFixedFont", 10))
        name_scroll = ttk.Scrollbar(edit_frame, orient=tk.VERTICAL, command=name_text.yview)
        name_text.configure(yscrollcommand=name_scroll.set)
        name_scroll.grid(row=0, column=2, sticky=tk.NS)
        name_text.grid(row=0, column=1, sticky=tk.EW, pady=(0, 4))
        setattr(self, f"{prefix}_name_text", name_text)

        ttk.Label(edit_frame, text="Description:").grid(row=1, column=0, sticky=tk.NW, padx=(0, 4))
        desc_text = tk.Text(edit_frame, height=3, wrap=tk.WORD, font=("TkFixedFont", 10))
        desc_scroll = ttk.Scrollbar(edit_frame, orient=tk.VERTICAL, command=desc_text.yview)
        desc_text.configure(yscrollcommand=desc_scroll.set)
        desc_scroll.grid(row=1, column=2, sticky=tk.NS)
        desc_text.grid(row=1, column=1, sticky=tk.EW)
        setattr(self, f"{prefix}_desc_text", desc_text)

        btn_row = ttk.Frame(right_frame)
        btn_row.pack(fill=tk.X, pady=(2, 0))
        pos_label = ttk.Label(btn_row, text="", foreground="gray")
        pos_label.pack(side=tk.LEFT, padx=4)
        setattr(self, f"{prefix}_pos_label", pos_label)
        ttk.Button(btn_row, text="Apply Change",
                   command=lambda p=prefix: self._item_apply_edit(p)).pack(side=tk.RIGHT, padx=4)

    # -----------------------------------------------------------------------
    # Tab change binding — lazy load
    # -----------------------------------------------------------------------

    def _bind_tab_change(self):
        self.notebook.bind("<<NotebookTabChanged>>", self._on_tab_changed)

    def _on_tab_changed(self, _event=None):
        idx = self.notebook.index(self.notebook.select())
        if idx == 0 and self.config_data is None:
            self._config_reload()
        elif idx == 1 and self.equip_data is None:
            self._item_reload("equip")
        elif idx == 2 and self.props_data is None:
            self._item_reload("props")

    # -----------------------------------------------------------------------
    # Config tab logic
    # -----------------------------------------------------------------------

    def _config_reload(self):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                self.config_data = json.load(f)
        except Exception as e:
            messagebox.showerror("Load Error", f"Cannot load config.nncc:\n{e}")
            return

        self.config_section_lb.delete(0, tk.END)
        for section in sorted(self.config_data.keys()):
            self.config_section_lb.insert(tk.END, section)

        self.config_current_section = None
        self._config_clear_tree()
        n_sections = len(self.config_data)
        self.status_var.set(f"config.nncc loaded — {n_sections} sections.")

    def _config_section_selected(self, _event=None):
        sel = self.config_section_lb.curselection()
        if not sel:
            return
        section = self.config_section_lb.get(sel[0])
        self.config_current_section = section
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
            chinese = has_chinese(text)
            if flt == "Has Chinese" and not chinese:
                continue
            if flt == "No Chinese" and chinese:
                continue
            self.config_filtered_indices.append(i)

        self._config_populate_tree(section, items)

    def _config_populate_tree(self, section: str, items: list):
        self._config_clear_tree()
        for i in self.config_filtered_indices:
            item = items[i]
            val_str = truncate(str(item))
            chinese = has_chinese(str(item))
            tag = ("chinese",) if chinese else ()
            self.config_tree.insert("", tk.END, iid=str(i),
                                    values=(i, val_str, "Yes" if chinese else ""),
                                    tags=tag)

        n_total = len(items)
        n_chinese = sum(1 for it in items if has_chinese(str(it)))
        self.status_var.set(
            f"Section '{section}': {n_total} items, {n_chinese} have Chinese  |  "
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
        iid = sel[0]
        idx = int(iid)
        section = self.config_current_section
        if section is None or self.config_data is None:
            return
        item = self.config_data[section][idx]

        self.config_edit_text.delete("1.0", tk.END)
        self.config_edit_text.insert("1.0", json.dumps(item, ensure_ascii=False))
        self.config_pos_label.configure(text=f"Section: {section}  |  Index: {idx}")

    def _config_apply_edit(self):
        sel = self.config_tree.selection()
        if not sel:
            messagebox.showwarning("No Selection", "Select a row first.")
            return
        idx = int(sel[0])
        section = self.config_current_section
        if section is None or self.config_data is None:
            return

        raw = self.config_edit_text.get("1.0", tk.END).strip()
        try:
            new_val = json.loads(raw)
        except json.JSONDecodeError:
            # Treat as plain string if JSON parse fails
            new_val = raw

        self.config_data[section][idx] = new_val

        # Refresh the treeview row
        val_str = truncate(str(new_val))
        chinese = has_chinese(str(new_val))
        tag = ("chinese",) if chinese else ()
        self.config_tree.item(str(idx), values=(idx, val_str, "Yes" if chinese else ""), tags=tag)
        self.status_var.set(f"Updated section '{section}' index {idx}. (Unsaved)")

    def _config_save(self):
        if self.config_data is None:
            messagebox.showwarning("Nothing Loaded", "No config data to save.")
            return
        try:
            with open(CONFIG_PATH, "w", encoding="utf-8") as f:
                json.dump(self.config_data, f, ensure_ascii=False, separators=(",", ":"))
            self.status_var.set(f"Saved config.nncc — {CONFIG_PATH}")
        except Exception as e:
            messagebox.showerror("Save Error", f"Cannot save config.nncc:\n{e}")

    # -----------------------------------------------------------------------
    # Item tab logic (shared for equip and props)
    # -----------------------------------------------------------------------

    def _get_item_data(self, prefix: str) -> dict | None:
        return self.equip_data if prefix == "equip" else self.props_data

    def _set_item_data(self, prefix: str, data: dict):
        if prefix == "equip":
            self.equip_data = data
        else:
            self.props_data = data

    def _get_filtered_ids(self, prefix: str) -> list[str]:
        return self.equip_filtered_ids if prefix == "equip" else self.props_filtered_ids

    def _set_filtered_ids(self, prefix: str, ids: list[str]):
        if prefix == "equip":
            self.equip_filtered_ids = ids
        else:
            self.props_filtered_ids = ids

    def _item_reload(self, prefix: str):
        paths = EQUIP_PATHS if prefix == "equip" else PROPS_PATHS
        path = paths["s1"]
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            messagebox.showerror("Load Error", f"Cannot load {path.name}:\n{e}")
            return
        self._set_item_data(prefix, data)
        self._item_apply_filter(prefix)
        n_total = len(data)
        n_chinese = sum(
            1 for v in data.values()
            if has_chinese(v.get("property", {}).get("name", ""))
            or has_chinese(v.get("property", {}).get("description", ""))
        )
        self.status_var.set(f"{path.name} loaded — {n_total} items, {n_chinese} have Chinese.")

    def _item_apply_filter(self, prefix: str):
        data = self._get_item_data(prefix)
        if data is None:
            return
        search_var: tk.StringVar = getattr(self, f"{prefix}_search_var")
        filter_var: tk.StringVar = getattr(self, f"{prefix}_filter_var")
        search = search_var.get().strip().lower()
        flt = filter_var.get()

        filtered_ids = []
        for item_id, entry in data.items():
            prop = entry.get("property", {})
            name = str(prop.get("name", ""))
            desc = str(prop.get("description", ""))
            combined = f"{item_id} {name} {desc}".lower()

            if search and search not in combined:
                continue
            chinese = has_chinese(name) or has_chinese(desc)
            if flt == "Has Chinese" and not chinese:
                continue
            if flt == "No Chinese" and chinese:
                continue
            filtered_ids.append(item_id)

        self._set_filtered_ids(prefix, filtered_ids)
        self._item_populate_list(prefix)
        self._item_populate_tree(prefix)

    def _item_populate_list(self, prefix: str):
        lb: tk.Listbox = getattr(self, f"{prefix}_item_lb")
        data = self._get_item_data(prefix)
        filtered_ids = self._get_filtered_ids(prefix)
        lb.delete(0, tk.END)
        if data is None:
            return
        for item_id in filtered_ids:
            prop = data[item_id].get("property", {})
            name = prop.get("name", "")
            chinese = has_chinese(name) or has_chinese(prop.get("description", ""))
            marker = "* " if chinese else "  "
            lb.insert(tk.END, f"{marker}{item_id}: {name[:30]}")

    def _item_populate_tree(self, prefix: str):
        tree: ttk.Treeview = getattr(self, f"{prefix}_tree")
        data = self._get_item_data(prefix)
        filtered_ids = self._get_filtered_ids(prefix)
        for row in tree.get_children():
            tree.delete(row)
        if data is None:
            return
        for item_id in filtered_ids:
            prop = data[item_id].get("property", {})
            name = str(prop.get("name", ""))
            desc = str(prop.get("description", ""))
            chinese = has_chinese(name) or has_chinese(desc)
            tag = ("chinese",) if chinese else ()
            tree.insert("", tk.END, iid=item_id,
                        values=(item_id, truncate(name, 50), truncate(desc, 80),
                                "Yes" if chinese else ""),
                        tags=tag)

    def _item_lb_selected(self, prefix: str):
        lb: tk.Listbox = getattr(self, f"{prefix}_item_lb")
        sel = lb.curselection()
        if not sel:
            return
        filtered_ids = self._get_filtered_ids(prefix)
        if sel[0] >= len(filtered_ids):
            return
        item_id = filtered_ids[sel[0]]
        # Sync treeview selection
        tree: ttk.Treeview = getattr(self, f"{prefix}_tree")
        try:
            tree.selection_set(item_id)
            tree.see(item_id)
        except tk.TclError:
            pass
        self._item_load_edit(prefix, item_id)

    def _item_row_selected(self, prefix: str):
        tree: ttk.Treeview = getattr(self, f"{prefix}_tree")
        sel = tree.selection()
        if not sel:
            return
        item_id = sel[0]
        # Sync listbox selection
        filtered_ids = self._get_filtered_ids(prefix)
        if item_id in filtered_ids:
            lb: tk.Listbox = getattr(self, f"{prefix}_item_lb")
            idx = filtered_ids.index(item_id)
            lb.selection_clear(0, tk.END)
            lb.selection_set(idx)
            lb.see(idx)
        self._item_load_edit(prefix, item_id)

    def _item_load_edit(self, prefix: str, item_id: str):
        data = self._get_item_data(prefix)
        if data is None or item_id not in data:
            return
        prop = data[item_id].get("property", {})
        name = str(prop.get("name", ""))
        desc = str(prop.get("description", ""))

        name_text: tk.Text = getattr(self, f"{prefix}_name_text")
        desc_text: tk.Text = getattr(self, f"{prefix}_desc_text")
        pos_label: ttk.Label = getattr(self, f"{prefix}_pos_label")

        name_text.delete("1.0", tk.END)
        name_text.insert("1.0", name)
        desc_text.delete("1.0", tk.END)
        desc_text.insert("1.0", desc)
        pos_label.configure(text=f"Item ID: {item_id}")

    def _item_apply_edit(self, prefix: str):
        tree: ttk.Treeview = getattr(self, f"{prefix}_tree")
        sel = tree.selection()
        if not sel:
            messagebox.showwarning("No Selection", "Select a row first.")
            return
        item_id = sel[0]
        data = self._get_item_data(prefix)
        if data is None or item_id not in data:
            return

        name_text: tk.Text = getattr(self, f"{prefix}_name_text")
        desc_text: tk.Text = getattr(self, f"{prefix}_desc_text")

        new_name = name_text.get("1.0", tk.END).rstrip("\n")
        new_desc = desc_text.get("1.0", tk.END).rstrip("\n")

        data[item_id].setdefault("property", {})
        data[item_id]["property"]["name"] = new_name
        data[item_id]["property"]["description"] = new_desc

        # Refresh treeview row
        chinese = has_chinese(new_name) or has_chinese(new_desc)
        tag = ("chinese",) if chinese else ()
        tree.item(item_id,
                  values=(item_id, truncate(new_name, 50), truncate(new_desc, 80),
                          "Yes" if chinese else ""),
                  tags=tag)

        # Refresh listbox entry
        lb: tk.Listbox = getattr(self, f"{prefix}_item_lb")
        filtered_ids = self._get_filtered_ids(prefix)
        if item_id in filtered_ids:
            list_idx = filtered_ids.index(item_id)
            marker = "* " if chinese else "  "
            lb.delete(list_idx)
            lb.insert(list_idx, f"{marker}{item_id}: {new_name[:30]}")
            lb.selection_set(list_idx)

        self.status_var.set(f"Updated item {item_id}. (Unsaved)")

    def _item_save(self, prefix: str, paths: dict):
        data = self._get_item_data(prefix)
        if data is None:
            messagebox.showwarning("Nothing Loaded", "No data loaded to save.")
            return
        primary = paths["s1"]
        try:
            with open(primary, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
        except Exception as e:
            messagebox.showerror("Save Error", f"Cannot save {primary.name}:\n{e}")
            return

        # Mirror to s2 and s3
        copied = []
        failed = []
        for server in ("s2", "s3"):
            dest = paths[server]
            try:
                if dest.parent.exists():
                    shutil.copy2(primary, dest)
                    copied.append(server)
                else:
                    failed.append(f"{server} (dir missing)")
            except Exception as e:
                failed.append(f"{server} ({e})")

        msg = f"Saved {primary.name} to s1"
        if copied:
            msg += f", copied to: {', '.join(copied)}"
        if failed:
            msg += f"  |  Could not copy to: {', '.join(failed)}"
        self.status_var.set(msg)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    root = tk.Tk()

    # Style tweaks
    style = ttk.Style()
    try:
        style.theme_use("clam")
    except tk.TclError:
        pass
    style.configure("Treeview", rowheight=22)
    style.configure("Treeview.Heading", font=("TkDefaultFont", 9, "bold"))

    app = TranslationEditor(root)

    # Load the first tab (config) immediately on startup
    app._config_reload()

    root.mainloop()


if __name__ == "__main__":
    main()
