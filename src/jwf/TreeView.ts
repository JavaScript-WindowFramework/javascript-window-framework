/* eslint-disable @typescript-eslint/class-name-casing */
import { Window, WINDOW_EVENT_MAP, WINDOW_PARAMS } from "./Window";
import "./scss/TreeView.scss";

export interface TREEVIEW_EVENT_SELECT {
  item: TreeItem;
}
export interface TREEVIEW_EVENT_DROP {
  item: TreeItem;
  event: DragEvent;
}
export interface TREEVIEW_EVENT_DRAG_START {
  item: TreeItem;
  event: DragEvent;
}
export interface TREEVIEW_EVENT_OPEN {
  item: TreeItem;
  opened: boolean;
}
export interface TreeViewEventMap extends WINDOW_EVENT_MAP {
  itemOpen: TREEVIEW_EVENT_OPEN;
  itemSelect: TREEVIEW_EVENT_SELECT;
  itemDblClick: TREEVIEW_EVENT_SELECT;
  itemDrop: TREEVIEW_EVENT_DROP;
  itemDragStart: TREEVIEW_EVENT_DRAG_START;
}
type TreeItemElement = HTMLDivElement & {
  treeItem?: TreeItem;
};
/**
 *
 *
 * @export
 * @class TreeItem
 */
export class TreeItem {
  private hNode: TreeItemElement;
  private childNode: HTMLElement;
  private opened: boolean = true;
  private body: HTMLElement;
  private value: unknown;
  private keys: { [key: string]: unknown } = {};
  /**
   *Creates an instance of TreeItem.
   * @param {string} [label]
   * @param {boolean} [opened]
   * @memberof TreeItem
   */
  public constructor(label?: string, opened?: boolean) {
    let hNode = document.createElement("div") as TreeItemElement;
    this.hNode = hNode;
    hNode.treeItem = this;
    hNode.dataset.kind = "TreeItem";
    let row1 = document.createElement("div");
    row1.dataset.kind = "TreeRow";
    hNode.appendChild(row1);
    row1.addEventListener(
      "click",
      (): void => {
        this.selectItem();
      }
    );
    row1.addEventListener(
      "dblclick",
      (): void => {
        const treeView = this.getTreeView();
        if (treeView) treeView.callEvent("itemDblClick", { item: this });
      }
    );
    row1.addEventListener(
      "dragstart",
      (e): void => {
        const treeView = this.getTreeView();
        if (treeView)
          treeView.callEvent("itemDragStart", { item: this, event: e });
      }
    );
    row1.addEventListener(
      "dragleave",
      (): void => {
        row1.dataset.drag = "";
      }
    );
    row1.addEventListener(
      "dragenter",
      (e): void => {
        row1.dataset.drag = "over";
        e.preventDefault();
      }
    );
    row1.addEventListener(
      "dragover",
      (e): void => {
        //row1.dataset.drag = 'over'
        e.preventDefault();
      }
    );
    row1.addEventListener(
      "drop",
      (e): void => {
        const treeView = this.getTreeView();
        if (treeView) treeView.callEvent("itemDrop", { event: e, item: this });
        row1.dataset.drag = "";
        e.preventDefault();
      }
    );
    let icon = document.createElement("div");
    icon.dataset.kind = "TreeIcon";
    row1.appendChild(icon);
    icon.addEventListener(
      "click",
      (e): void => {
        this.openItem(!this.opened);
        e.preventDefault();
        e.stopPropagation();
      }
    );

    let body = document.createElement("div");
    this.body = body;
    row1.appendChild(body);
    body.textContent = label != null ? label : "";
    body.draggable = true;

    let row2 = document.createElement("div");
    row2.dataset.kind = "TreeRow";
    hNode.appendChild(row2);
    let child = document.createElement("div");
    this.childNode = child;
    child.dataset.kind = "TreeChild";
    row2.appendChild(child);

    this.openItem(opened ? true : false);
  }
  /**
   *アイテムのノードを返す
   *
   * @returns {HTMLElement}
   * @memberof TreeItem
   */
  public getNode(): HTMLElement {
    return this.hNode;
  }
  /**
   *アイテムのラベル部分のノードを返す
   *
   * @returns {HTMLElement}
   * @memberof TreeItem
   */
  public getBody(): HTMLElement {
    return this.body;
  }
  /**
   *アイテムに対してキーを関連付ける
   *
   * @param {string} name
   * @param {*} value
   * @memberof TreeItem
   */
  public setKey(name: string, value: unknown): void {
    this.keys[name] = value;
  }
  /**
   *アイテムのキーを取得する
   *
   * @param {string} name
   * @returns
   * @memberof TreeItem
   */
  public getKey(name: string): unknown {
    return this.keys[name];
  }
  /**
   *アイテムを追加する
   *
   * @param {*} [label] ラベル
   * @param {boolean} [opened] オープン状態
   * @returns {TreeItem} 追加したアイテム
   * @memberof TreeItem
   */
  public addItem(
    label?: string | [string, unknown],
    opened?: boolean
  ): TreeItem {
    let name: string;
    let value = null;
    if (label instanceof Array) {
      name = label[0];
      value = label[1];
    } else {
      name = label || "";
    }
    let item = new TreeItem(name, opened);
    if (value != null) item.setItemValue(value);
    this.childNode.appendChild(item.getNode());
    this.openItem(this.opened, false);
    return item;
  }
  /**
   *子アイテムを全てクリア
   *
   * @memberof TreeItem
   */
  public clearItem(): void {
    let childs = this.childNode.childNodes;
    while (childs.length) {
      this.childNode.removeChild(childs[0]);
    }
    this.openItem(this.opened);
  }
  /**
   *自分自身を親から切り離す
   *
   * @memberof TreeItem
   */
  public removeItem(): void {
    let treeView = this.getTreeView();
    if (treeView && this !== treeView.getRootItem() && this.hNode.parentNode)
      this.hNode.parentNode.removeChild(this.hNode);
  }
  /**
   *子アイテムの数を返す
   *
   * @returns {number}
   * @memberof TreeItem
   */
  public getChildCount(): number {
    return this.childNode.childElementCount;
  }
  /**
   *アイテムに関連付ける値を設定
   *
   * @param {*} value
   * @memberof TreeItem
   */
  public setItemValue(value: unknown): void {
    this.value = value;
  }
  /**
   *アイテムに関連付けた値を取得
   *
   * @returns {*}
   * @memberof TreeItem
   */
  public getItemValue(): unknown {
    return this.value;
  }
  /**
   *アイテムのラベルを設定
   *
   * @param {string} value
   * @memberof TreeItem
   */
  public setItemText(value: string): void {
    this.body.textContent = value;
  }
  /**
   *アイテムのラベルを取得
   *
   * @returns {string}
   * @memberof TreeItem
   */
  public getItemText(): string {
    return this.body.textContent || "";
  }
  /**
   *子アイテムを取得
   *
   * @param {number} index
   * @returns {TreeItem}
   * @memberof TreeItem
   */
  public getChildItem(index: number): TreeItem {
    const node = this.childNode.childNodes[index] as TreeItemElement;
    return node.treeItem as TreeItem;
  }
  /**
   *親アイテムを取得
   *
   * @returns {TreeItem}
   * @memberof TreeItem
   */
  public getParentItem(): TreeItem | null {
    let parent: HTMLElement = this.hNode.parentNode as HTMLElement;
    if (!parent) return null;
    parent = parent.parentNode as HTMLElement;
    if (!parent) return null;
    parent = parent.parentNode as HTMLElement;
    if (parent && parent.dataset.kind === "TreeItem") {
      const treeNode = parent as TreeItemElement;
      return treeNode.treeItem ? treeNode.treeItem : null;
    }
    return null;
  }
  /**
   *自分を含めた階層から値を参照してアイテムを探す
   *
   * @param {*} value
   * @returns {TreeItem}
   * @memberof TreeItem
   */
  public findItemFromValue(value: unknown): TreeItem | null {
    if (this.getItemValue() == value) return this;
    const nodes = this.childNode.childNodes;
    const count = nodes.length;
    for (let i = 0; i < count; i++) {
      const node = nodes[i] as TreeItemElement;
      const child = node.treeItem;
      if (child) {
        const f = child.findItemFromValue(value);
        if (f != null) return f;
      }
    }
    return null;
  }
  /**
   *ツリーを展開する
   *
   * @param {boolean} opened
   * @param {boolean} [anime]
   * @memberof TreeItem
   */
  public openItem(opened: boolean, anime?: boolean): void {
    let flag = this.opened !== opened;
    this.opened = opened;
    if (this.getChildCount() == 0) this.hNode.dataset.stat = "alone";
    else {
      this.hNode.dataset.stat = opened ? "open" : "close";
      if (opened) {
        const items = this.hNode.querySelectorAll(
          "[data-kind=TreeItem][data-stat=open] > [data-kind=TreeRow]:nth-child(2) > [data-kind=TreeChild] > [data-kind=TreeItem]"
        );
        for (let i = 0; i < items.length; i++) {
          const n = items[i] as HTMLElement;
          n.style.animation = "treeOpen 0.3s ease 0s 1 normal";
          n.style.display = "block";
        }
      } else {
        const items = this.childNode.querySelectorAll("[data-kind=TreeItem]");
        for (let i = 0; i < items.length; i++) {
          const n = items[i] as HTMLElement;
          if (anime === false) n.style.animation = "treeClose forwards";
          else n.style.animation = "treeClose 0.8s ease 0s 1 forwards";
        }
      }
    }
    if (flag) {
      let treeView = this.getTreeView();
      if (treeView)
        treeView.callEvent("itemOpen", { item: this, opened: opened });
    }
  }
  /**
   *アイテムを選択する
   *
   * @memberof TreeItem
   */
  public selectItem(scroll?: boolean): void {
    let treeView = this.getTreeView();
    if (treeView) treeView.selectItem(this, scroll);
  }
  /**
   *所属先のTreeViewを返す
   *
   * @returns {TreeView}
   * @memberof TreeItem
   */
  public getTreeView(): TreeView | null {
    let node: HTMLElement | null = this.hNode;
    while (node && node.dataset.jwfStyle !== "TreeView")
      node = node.parentElement;
    if (node) {
      const treeView = (node as HTMLElement & { treeView?: TreeView }).treeView;
      return treeView ? treeView : null;
    }
    return null;
  }
}

/**
 *TreeView用クラス
 *
 * @export
 * @class TreeView
 * @extends {Window}
 */
export class TreeView extends Window {
  private mRootItem: TreeItem;
  private mSelectItem: TreeItem | null = null;
  /**
   *Creates an instance of TreeView.
   * @memberof TreeView
   */
  public constructor(params?: WINDOW_PARAMS) {
    super(params);
    let client = this.getClient() as HTMLDivElement & {
      treeView?: TreeView;
    };
    client.dataset.jwfStyle = "TreeView";
    client.treeView = this;

    let item = new TreeItem("root", true);
    this.mRootItem = item;
    client.appendChild(item.getNode());
  }

  /**
   * 設定されている相対を条件にアイテムを検索
   *
   * @param {*} value
   * @returns {TreeItem}
   * @memberof TreeView
   */
  public findItemFromValue(value: unknown): TreeItem | null {
    return this.mRootItem.findItemFromValue(value);
  }
  /**
   *最上位のアイテムを返す
   *
   * @returns {TreeItem}
   * @memberof TreeView
   */
  public getRootItem(): TreeItem {
    return this.mRootItem;
  }
  /**
   *最上位の子としてアイテムを追加する
   *
   * @param {*} [label]
   * @param {boolean} [opened]
   * @returns {TreeItem}
   * @memberof TreeView
   */
  public addItem(
    label?: string | [string, unknown],
    opened?: boolean
  ): TreeItem {
    return this.mRootItem.addItem(label, opened);
  }
  /**
   *アイテムを全て削除する
   *
   * @memberof TreeView
   */
  public clearItem(): void {
    this.mRootItem.clearItem();
    this.mRootItem.setItemText("root");
    this.mRootItem.setItemValue(null);
  }
  /**
   *アイテムを選択する
   *子アイテムが使用するので基本的には直接呼び出さない
   * @param {TreeItem} item 選択するアイテム
   * @memberof TreeView
   */
  public selectItem(item: TreeItem, scroll?: boolean): void {
    const that = this;
    function animationEnd(this: HTMLElement): void {
      this.removeEventListener("animationend", animationEnd);
      that
        .getClient()
        .scrollTo(0, item.getNode().offsetTop - that.getClientHeight() / 2);
    }

    if (this.mSelectItem !== item) {
      if (this.mSelectItem) this.mSelectItem.getNode().dataset.select = "false";
      item.getNode().dataset.select = "true";
      this.mSelectItem = item;

      item.openItem(true);
      let parent: TreeItem | null = item;
      while ((parent = parent.getParentItem())) {
        parent.openItem(true);
      }
      if (scroll) {
        this.getClient().scrollTo(
          0,
          item.getNode().offsetTop - this.getClientHeight() / 2
        );
        item.getNode().addEventListener("animationend", animationEnd);
      }
    }
    this.callEvent("itemSelect", { item: item });
  }
  /**
   * 設定されている値を条件にアイテムを選択
   *
   * @param {*} value
   * @memberof TreeView
   */
  public selectItemFromValue(value: unknown): void {
    let item = this.mRootItem.findItemFromValue(value);
    if (item) item.selectItem();
  }
  /**
   *選択されているアイテムを返す
   *
   * @returns 選択されているアイテム
   * @memberof TreeView
   */
  public getSelectItem(): TreeItem | null {
    return this.mSelectItem;
  }
  /**
   *選択されているアイテムの値を返す
   *
   * @returns
   * @memberof TreeView
   */
  public getSelectItemValue(): unknown {
    if (!this.mSelectItem) return null;
    return this.mSelectItem.getItemValue();
  }

  /**
   *アイテムツリーが展開されら発生する
   *
   * @param {'itemOpen'} type
   * @param {(event:TREEVIEW_EVENT_OPEN)=>void} callback
   * @memberof TreeView
   */
  /**
   *アイテムが選択されたら発生
   *
   * @param {'itemSelect'} type
   * @param {(event:TREEVIEW_EVENT_SELECT)=>void} callback
   * @memberof TreeView
   */
  /**
   *アイテムにドラッグドロップされたら発生
   *
   * @param {'itemDrop'} type
   * @param {(event: TREEVIEW_EVENT_DROP) => void} callback
   * @memberof TreeView
   */

  public addEventListener<K extends keyof TreeViewEventMap>(
    type: K|string,
    listener: (ev: TreeViewEventMap[K]) => unknown
  ): void {
    super.addEventListener(type, listener as (e: unknown) => unknown);
  }
}
