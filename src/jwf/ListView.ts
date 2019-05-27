/* eslint-disable @typescript-eslint/class-name-casing */
import {
  Window,
  JWFEvent,
  MovePoint,
  WINDOW_PARAMS,
  WINDOW_EVENT_MAP,
  MoveElement
} from "./Window";
import { WindowManager } from "./WindowManager";

export interface LISTVIEW_EVENT_ITEM_CLICK {
  itemIndex: number;
  subItemIndex: number;
  event: MouseEvent;
}
export interface LISTVIEW_EVENT_DRAG_START {
  itemIndex: number;
  subItemIndex: number;
  event: DragEvent;
}
export interface ListViewEventMap extends WINDOW_EVENT_MAP {
  itemClick: LISTVIEW_EVENT_ITEM_CLICK;
  itemDblClick: LISTVIEW_EVENT_ITEM_CLICK;
  itemDragStart: LISTVIEW_EVENT_DRAG_START;
}
/**
 *ListView用クラス
 *
 * @export
 * @class ListView
 * @extends {Window}
 */
export class ListView extends Window {
  private headers: HTMLElement;
  private resizers: HTMLElement;
  private itemArea: HTMLElement;
  private overIndex: number = -1;
  private lastIndex: number = 0;
  private selectIndexes: number[] = [];
  private sortIndex: number = -1;
  private sortVector: boolean = false;
  private columnWidth: number[] = [];
  private columnAutoIndex: number = -1;
  private areaWidth: number = 0;

  /**
   *Creates an instance of ListView.
   * @param {*} [params] ウインドウ作成パラメータ
   * @memberof ListView
   */
  public constructor(params?: WINDOW_PARAMS) {
    super(params);
    const that = this;
    var client = this.getClient();
    client.dataset.jwfStyle = "ListView";

    var headerBack = document.createElement("div");
    headerBack.dataset.kind = "ListHeaderBack";
    client.appendChild(headerBack);

    var headerArea = document.createElement("div");
    headerArea.dataset.kind = "ListHeaderArea";
    client.appendChild(headerArea);

    var resizers = document.createElement("div");
    this.resizers = resizers;
    resizers.dataset.kind = "ListResizers";
    headerArea.appendChild(resizers);

    var headers = document.createElement("div");
    this.headers = headers;
    headers.dataset.kind = "ListHeaders";
    headerArea.appendChild(headers);

    var itemArea = document.createElement("div");
    itemArea.dataset.kind = "ListItemArea";
    this.itemArea = itemArea;
    client.appendChild(itemArea);

    client.addEventListener("scroll", function(): void {
      itemArea.style.left = this.scrollLeft + "px";
      if (itemArea.childElementCount) {
        let column = itemArea.childNodes[0] as HTMLElement;
        column.style.marginLeft = -this.scrollLeft + "px";
        headerBack.style.marginLeft = this.scrollLeft + "px";
      }
    });

    client.addEventListener("dragover", function(e): void {
      e.preventDefault();
    });
    client.addEventListener("drop", function(e): void {
      that.callEvent("itemDrop", { itemIndex: -1, subItemIndex: -1, event: e });
      e.preventDefault();
    });
  }
  /**
   *カラムのサイズを設定
   *
   * @param {number} index
   * @param {number} size
   * @memberof ListView
   */
  public setColumnWidth(index: number, size: number): void {
    this.columnWidth[index] = size;
    (this.headers.children[index] as HTMLElement).style.width = size + "px";
    this.resize();
  }
  /**
   *カラムのスタイルを設定
   *
   * @param {number} col カラム番号
   * @param {('left'|'right'|'center')} style スタイル
   * @memberof ListView
   */
  public setColumnStyle(col: number, style: "left" | "right" | "center"): void {
    let columns = this.itemArea.childNodes as NodeListOf<HTMLElement>;
    let column = columns[col];
    column.style.justifyContent = style;
  }
  /**
   *カラムのスタイルを複数設定
   *
   * @param {(('left' | 'right' | 'center')[])} styles スタイル
   * @memberof ListView
   */
  public setColumnStyles(styles: ("left" | "right" | "center")[]): void {
    let columns = this.itemArea.childNodes as NodeListOf<
      HTMLElement & { vector: typeof styles[0] }
    >;
    for (let i = 0, l = styles.length; i < l; i++) {
      let column = columns[i];
      column.vector = styles[i];
    }
  }
  /**
   *ヘッダを追加
   *配列にすると複数追加でき、さらに配列を含めるとサイズが指定できる
   * @param {(string|(string|[string,number])[])} labels ラベル | [ラベル,ラベル,・・・] | [[ラベル,幅],[ラベル,幅],・・・]
   * @param {number} [size] 幅
   * @memberof ListView
   */
  public addHeader(
    label: string | (string | [string, number])[],
    size?: number
  ): void {
    var headers = this.headers;

    let labels: (string | [string, number])[] = [];
    if (label instanceof Array) labels = label;
    else labels = [label];

    for (let i = 0, l = labels.length; i < l; i++) {
      let label = labels[i];
      let text: string;
      let width = size;
      if (label instanceof Array) {
        text = label[0];
        width = label[1];
      } else {
        text = label;
      }

      var index = headers.childElementCount;
      var header = document.createElement("div");
      headers.appendChild(header);
      header.textContent = text;
      if (width != null) {
        this.columnWidth[index] = width;
        header.style.width = width + "px";
      } else {
        this.columnWidth[index] = header.offsetWidth;
      }

      let that = this;
      //ヘッダが押されたらソート処理
      header.addEventListener("click", function(): void {
        let j;
        for (j = 0; j < headers.childElementCount; j++) {
          if (headers.childNodes[j] === this) break;
        }
        let sort = true;
        if (that.sortIndex === j) sort = !that.sortVector;
        that.sortItem(j, sort);
      });

      var itemArea = this.itemArea;
      var column = document.createElement("div");
      column.dataset.kind = "ListColumn";
      this.itemArea.appendChild(column);

      //リサイズバーの設定
      var resizers = this.resizers;
      let resize: MoveElement = document.createElement("div");
      resize.dataset.index = index.toString();
      resizers.appendChild(resize);
      WindowManager.enableMove(resize);
      resize.addEventListener("move", function(
        this: HTMLElement,
        e: JWFEvent
      ): void {
        const index = this.dataset.index ? parseInt(this.dataset.index) : 0;
        let p = e.params as MovePoint;
        let x = p.nodePoint.x + p.nowPoint.x - p.basePoint.x;
        let h = headers.childNodes[index] as HTMLElement;
        let width = x - h.offsetLeft;
        h.style.width = width + "px";
        that.columnWidth[index] = width;

        for (
          let i = index, length = resizers.childElementCount;
          i < length;
          i++
        ) {
          let node = headers.children[i] as HTMLElement;
          var r = resizers.childNodes[i] as HTMLElement;
          r.style.left = node.offsetLeft + node.offsetWidth + "px";

          let column = itemArea.children[i] as HTMLElement;
          column.style.width =
            node.clientLeft + node.offsetWidth - column.clientLeft + "px";
        }
      });
    }
  }

  /**
   *アイテムのソートを行う
   *
   * @param {number} [index] カラム番号
   * @param {boolean} [order] 方向 true:昇順 false:降順
   * @memberof ListView
   */
  public sortItem(index?: number, order?: boolean): void {
    this.clearSelectItem();

    if (index != null) {
      this.sortIndex = index;
      order = order == null ? true : order;
      this.sortVector = order;
      var headers = this.headers;
      for (let i = 0, length = headers.childElementCount; i < length; i++) {
        let node = headers.childNodes[i] as HTMLElement;
        if (index === i) node.dataset.sort = order ? "asc" : "desc";
        else node.dataset.sort = "";
        // eslint-disable-next-line no-self-assign
        node.className = node.className; //IE11対策
      }
    }

    index = this.sortIndex;
    order = this.sortVector;
    let columns = this.itemArea.childNodes;
    let column = columns[index];
    let items: NodeListOf<ChildNode & { keyValue?: number | string }> =
      column.childNodes;
    //ソートリストの作成
    let sortList = [];
    for (let i = 0, length = items.length; i < length; i++) {
      sortList.push(i);
    }
    sortList.sort(function(a, b): number {
      let v1 = typeof items[a].keyValue || items[a].textContent || "";
      let v2 = typeof items[b].keyValue || items[b].textContent || "";
      return (v1 > v2 ? 1 : -1) * (order ? 1 : -1);
    });
    //ソート処理
    for (let i = 0, length = columns.length; i < length; i++) {
      let column = columns[i] as HTMLElement;
      //子ノードの保存と削除
      let items = [];
      while (column.childElementCount) {
        items.push(column.childNodes[0]);
        column.removeChild(column.childNodes[0]);
      }
      //子ノードの再追加
      for (let j = 0, length = sortList.length; j < length; j++) {
        column.appendChild(items[sortList[j]]);
      }
    }
  }
  /**
   *アイテムを選択する
   *すでにある選択は解除される
   * @param {(number | number[])} index レコード番号
   * @memberof ListView
   */
  public selectItem(index: number | number[]): void {
    this.clearSelectItem();
    this.addSelectItem(index);
  }
  /**
   *アイテムの選択を全て解除する
   *
   * @memberof ListView
   */
  public clearSelectItem(): void {
    let columns = this.itemArea.childNodes;
    for (let i = 0, length = columns.length; i < length; i++) {
      let column = columns[i];
      for (let j = 0, l = this.selectIndexes.length; j < l; j++) {
        let node = column.childNodes[this.selectIndexes[j]] as HTMLElement;
        node.dataset.itemSelect = "false";
        // eslint-disable-next-line no-self-assign
        node.className = node.className; //IE11対策
      }
    }
    this.selectIndexes = [];
  }
  /**
   *アイテムの選択を追加する
   *
   * @param {(number | number[])} index レコード番号
   * @memberof ListView
   */
  public addSelectItem(index: number | number[]): void {
    let indexes = (index instanceof Array ? index : [index]) as number[];
    Array.prototype.push.apply(this.selectIndexes, indexes);

    let columns = this.itemArea.childNodes;
    for (let i = 0, length = columns.length; i < length; i++) {
      let column = columns[i];

      for (let j = 0, l = this.selectIndexes.length; j < l; j++) {
        let node = column.childNodes[this.selectIndexes[j]] as HTMLElement;
        node.dataset.itemSelect = "true";
        // eslint-disable-next-line no-self-assign
        node.className = node.className; //IE11対策
      }
    }
  }
  /**
   *アイテムの選択を解除する
   *
   * @param {(number | number[])} index レコード番号
   * @memberof ListView
   */
  public delSelectItem(index: number | number[]): void {
    let indexes = (typeof index === "object" ? index : [index]) as number[];
    let columns = this.itemArea.childNodes;
    for (let i = 0, length = columns.length; i < length; i++) {
      let column = columns[i];

      for (let j = 0, l = indexes.length; j < l; j++) {
        let node = column.childNodes[indexes[j]] as HTMLElement;
        node.dataset.itemSelect = "false";
        // eslint-disable-next-line no-self-assign
        node.className = node.className; //IE11対策
      }
    }
    let newIndexes = [];
    for (let j = 0, l = this.selectIndexes.length; j < l; j++) {
      let index = this.selectIndexes[j];
      if (indexes.indexOf(index) < 0) newIndexes.push(index);
    }
    this.selectIndexes = newIndexes;
  }
  /**
   *アイテムの数を返す
   *
   * @returns {number} アイテム数
   * @memberof ListView
   */
  public getItemCount(): number {
    if (this.itemArea.childElementCount === 0) return 0;
    return (this.itemArea.childNodes[0] as HTMLElement).childElementCount;
  }
  /**
   *アイテムが選択されているか返す
   *
   * @param {number} index レコード番号
   * @returns {boolean}
   * @memberof ListView
   */
  public isSelectItem(index: number): boolean {
    return this.selectIndexes.indexOf(index) >= 0;
  }
  private static getIndexOfNode(node: HTMLElement): number {
    if (node.parentNode)
      return ([] as HTMLElement[]).slice
        .call(node.parentNode.childNodes)
        .indexOf(node);
    return -1;
  }
  /**
   *アイテムを全て削除する
   *
   * @memberof ListView
   */
  public clearItem(): void {
    this.selectIndexes = [];
    let columns = this.itemArea.childNodes;
    for (let i = 0, length = columns.length; i < length; i++) {
      let column = columns[i] as HTMLElement;
      while (column.childElementCount) column.removeChild(column.childNodes[0]);
    }
  }
  /**
   *対象セルのノードを取得
   *
   * @param {number} row
   * @param {number} col
   * @returns
   * @memberof ListView
   */
  public getCell(
    row: number,
    col: number
  ): HTMLElement & { value?: unknown } | null {
    let columns = this.itemArea.childNodes;
    let column = columns[col];
    if (column == null) return null;
    return column.childNodes[row] as HTMLElement;
  }
  /**
   *アイテムに値を設定する
   *
   * @param {number} index レコード番号
   * @param {*} value 値
   * @memberof ListView
   */
  public setItemValue(index: number, value: unknown): void {
    let cell = this.getCell(index, 0);
    if (cell) cell.value = value;
  }
  /**
   *アイテムの値を取得する
   *
   * @param {number} index レコード番号
   * @returns 値
   * @memberof ListView
   * @returns {string} アイテムに設定されている値
   */
  public getItemValue(index: number): unknown {
    let cell = this.getCell(index, 0);
    if (cell) return cell.value;
    return null;
  }
  /**
   *アイテムのテキスト内容を取得
   *
   * @param {number} row 行
   * @param {number} col 列
   * @returns {string} アイテムに設定されているテキスト
   * @memberof ListView
   */
  public getItemText(row: number, col: number): string | null {
    let cell = this.getCell(row, col);
    if (cell) return cell.textContent;
    return null;
  }
  /**
   *最初に選択されているアイテムを返す
   *
   * @returns {number} 選択されているアイテム番号(見つからなかったら-1)
   * @memberof ListView
   */
  public getSelectItem(): number {
    for (let index of this.selectIndexes) {
      return index;
    }
    return -1;
  }
  /**
   *選択されている値を全て取得する
   *
   * @returns {unknown[]} 選択されているアイテムの値
   * @memberof ListView
   */
  public getSelectValues(): unknown[] {
    let values = [];
    for (let index of this.selectIndexes) {
      values.push(this.getItemValue(index));
    }
    return values;
  }
  /**
   *指定行のセルノードを返す
   *
   * @param {number} row
   * @returns
   * @memberof ListView
   */
  public getLineCells(row: number): HTMLElement[] {
    let cells: HTMLElement[] = [];
    let columns = this.itemArea.childNodes;
    for (let i = 0, length = columns.length; i < length; i++) {
      let column = columns[i] as HTMLElement;
      cells.push(column.childNodes[row] as HTMLElement);
    }
    return cells;
  }
  /**
   *アイテムを追加する
   *アイテムはテキストかノードが指定できる
   *配列を渡した場合は、複数追加となる
   * @param {(string|(string|HTMLElement)[])} value テキストもしくはノード
   * @returns
   * @memberof ListView
   */
  public addItem(
    value: string | number | HTMLElement | ((string | number | HTMLElement)[]),
    itemValue?: unknown
  ): number {
    const vector: { [key: string]: string } = {
      left: "flex-start",
      center: "center",
      right: "flex-end"
    };
    let that = this;
    let columns = this.itemArea.childNodes as NodeListOf<HTMLElement>;
    for (let i = 0, length = columns.length; i < length; i++) {
      let column = columns[i] as HTMLElement & { vector?: string };
      let cell = document.createElement("div");
      cell.draggable = true;
      cell.dataset.kind = "ListCell";

      if (column.vector) cell.style.justifyContent = vector[column.vector];
      column.appendChild(cell);
      cell.addEventListener("mouseover", function(): void {
        let index = ListView.getIndexOfNode(this);
        for (let i = 0, length = columns.length; i < length; i++) {
          let column = columns[i];
          if (
            that.overIndex != null &&
            that.overIndex >= 0 &&
            that.overIndex < column.childElementCount
          ) {
            let node = column.childNodes[that.overIndex] as HTMLElement;
            node.dataset.itemHover = "false";
            // eslint-disable-next-line no-self-assign
            node.className = node.className; //IE対策
          }
          let node2 = column.childNodes[index] as HTMLElement;
          node2.dataset.itemHover = "true";
          // eslint-disable-next-line no-self-assign
          node2.className = node2.className; //IE対策
        }
        that.overIndex = index;
      });
      cell.addEventListener("dragstart", function(e): void {
        let index = ListView.getIndexOfNode(this);
        let index2 = ListView.getIndexOfNode(this.parentNode as HTMLElement);
        that.callEvent("itemDragStart", {
          itemIndex: index,
          subItemIndex: index2,
          event: e
        });
      });
      cell.addEventListener("dragleave", function(): void {
        let index = ListView.getIndexOfNode(this);
        let cells = that.getLineCells(index);
        for (let cell of cells) {
          cell.dataset.drag = "";
          // eslint-disable-next-line no-self-assign
          cell.className = cell.className; //IE対策
        }
      });
      cell.addEventListener("dragenter", function(e): void {
        let index = ListView.getIndexOfNode(this);
        let cells = that.getLineCells(index);
        for (let cell of cells) {
          cell.dataset.drag = "over";
          // eslint-disable-next-line no-self-assign
          cell.className = cell.className; //IE対策
        }
        e.preventDefault();
      });
      cell.addEventListener("dragover", function(e): void {
        e.preventDefault();
      });
      cell.addEventListener("drop", function(e): void {
        let index = ListView.getIndexOfNode(this);
        let index2 = ListView.getIndexOfNode(this.parentNode as HTMLElement);
        let cells = that.getLineCells(index);
        for (let cell of cells) {
          cell.dataset.drag = "over";
          // eslint-disable-next-line no-self-assign
          cell.className = cell.className; //IE対策
        }
        that.callEvent("itemDrop", {
          itemIndex: index,
          subItemIndex: index2,
          event: e
        });
        e.preventDefault();
      });
      cell.addEventListener("dragstart", function(e): void {
        let index = ListView.getIndexOfNode(this);
        let index2 = ListView.getIndexOfNode(this.parentNode as HTMLElement);
        that.callEvent("itemDragStart", {
          itemIndex: index,
          subItemIndex: index2,
          event: e
        });
      });
      cell.addEventListener("click", function(e): void {
        let index = ListView.getIndexOfNode(this);
        let index2 = ListView.getIndexOfNode(this.parentNode as HTMLElement);
        if (e.ctrlKey) {
          if (!that.isSelectItem(index)) that.addSelectItem(index);
          else that.delSelectItem(index);
        } else if (e.shiftKey) {
          let indexes = [] as number[];
          let s = Math.min(that.lastIndex, index);
          let e = Math.max(that.lastIndex, index);
          for (let i = s; i <= e; i++) indexes.push(i);
          that.selectItem(indexes);
        } else that.selectItem(index);
        that.lastIndex = index;

        that.callEvent("itemClick", {
          itemIndex: index,
          subItemIndex: index2,
          event: e
        });
      });
      cell.addEventListener("dblclick", function(e): void {
        let index = ListView.getIndexOfNode(this);
        let index2 = ListView.getIndexOfNode(this.parentNode as HTMLElement);
        that.callEvent("itemDblClick", {
          itemIndex: index,
          subItemIndex: index2,
          event: e
        });
      });
    }
    if (columns.length === 0) return -1;
    let index = columns[0].childNodes.length - 1;
    if (value instanceof Array) {
      for (let i = 0, l = value.length; i < l; i++) {
        this.setItem(index, i, value[i]);
      }
    } else this.setItem(index, 0, value);
    if (itemValue) this.setItemValue(index, itemValue);

    if (this.areaWidth !== this.itemArea.clientWidth) {
      this.areaWidth = this.itemArea.clientWidth;
      this.resize();
    }
    return index;
  }
  /**
   *ソート用のキーを設定する
   *
   * @param {number} row レコード番号
   * @param {number} column カラム番号
   * @param {*} value キー
   * @returns
   * @memberof ListView
   */
  public setSortKey(row: number, column: number, value: unknown): boolean {
    let c = this.itemArea.childNodes[column];
    if (c == null) return false;
    let r = c.childNodes[row] as ChildNode & { keyValue?: unknown };
    if (r == null) return false;
    r.keyValue = value;
    return true;
  }
  /**
   *ソート用のキーをまとめて設定する
   *
   * @param {number} row レコード番号
   * @param {unknown[]} values キー配列
   * @memberof ListView
   */
  public setSortKeys(row: number, values: unknown[]): void {
    for (let i = 0, l = values.length; i < l; i++) {
      let c = this.itemArea.childNodes[i];
      if (c == null) break;
      let r = c.childNodes[row] as ChildNode & { keyValue?: unknown };
      if (r == null) break;
      r.keyValue = values[i];
    }
  }
  /**
   *アイテムを書き換える
   *
   * @param {number} row レコード番号
   * @param {number} column カラム番号
   * @param {(string|HTMLElement)} value テキストもしくはノード
   * @returns
   * @memberof ListView
   */
  public setItem(
    row: number,
    column: number,
    value: string | number | HTMLElement
  ): boolean {
    let c = this.itemArea.childNodes[column];
    if (c == null) return false;
    let r = c.childNodes[row];
    if (r == null) return false;
    if (!(value instanceof HTMLElement)) {
      var item = document.createElement("div");
      item.textContent = value.toString();
      r.appendChild(item);
    } else {
      r.appendChild(value);
    }
    return true;
  }
  /**
   *ヘッダに合わせてカラムサイズを調整する
   *基本的には直接呼び出さない
   * @memberof ListView
   */
  protected resize(): void {
    var headers = this.headers;
    var resizers = this.resizers;
    var itemArea = this.itemArea;
    var lmitWidth = itemArea.clientWidth;
    for (let i = 0, length = headers.childNodes.length; i < length; i++) {
      lmitWidth -= this.columnWidth[i];
    }
    const autoIndex = this.columnAutoIndex;
    for (let i = 0, length = headers.childNodes.length; i < length; i++) {
      let node = headers.childNodes[i] as HTMLElement;
      let resize = resizers.childNodes[i] as HTMLElement;
      let column = itemArea.children[i] as HTMLElement;
      let width = this.columnWidth[i];
      if (autoIndex === i || (autoIndex === -1 && i === length - 1))
        width += lmitWidth;
      node.style.width = width + "px";
      resize.style.left =
        node.offsetLeft + width - resize.offsetWidth / 2 + "px";
      column.style.width = width + "px";
    }
  }
  public onLayout(flag: boolean): void {
    super.onLayout(flag);
    this.resize();
  }

  public addEventListener<K extends keyof ListViewEventMap>(
    type: K,
    listener: (ev: ListViewEventMap[K]) => unknown
  ): void {
    super.addEventListener(type, listener);
  }
}
