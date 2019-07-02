/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable no-dupe-class-members */
import "./scss/Window.scss";
import { WindowManager } from "./WindowManager";
import { FrameWindow } from "./FrameWindow";

//各サイズ
const FRAME_SIZE = 10; //フレーム枠のサイズ
const TITLE_SIZE = 24; //タイトルバーのサイズ

/**
 *位置設定用
 *
 * @export
 * @interface Point
 */
export interface Point {
  x: number;
  y: number;
}
/**
 * サイズ設定用
 */
export interface Size {
  width: number;
  height: number;
}

/**
 *カスタムイベント用
 *
 * @export
 * @interface JWFEvent
 * @extends {Event}
 */
export interface JWFEvent extends Event {
  params: unknown;
}

/**
 * ドラッグドロップ機能用
 *
 * @export
 * @interface MovePoint
 * @param {Point} basePoint クリック基準位置
 * @param {Point} nowPoint 移動位置位置
 * @param {Point} nodePoint ノード初期位置
 * @param {Size} nodeSize ノード初期サイズ
 */
export interface MovePoint {
  event: MouseEvent | TouchEvent;
  basePoint: Point;
  nowPoint: Point;
  nodePoint: Point;
  nodeSize: Size;
}
export declare class MoveElement extends HTMLDivElement {
  public addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions
  ): void;
  public addEventListener(
    type: string,
    listener: (e: JWFEvent) => unknown
  ): void;
}
/**
 *ウインドウノードにWindowの参照を持たせる
 *
 * @interface JNode
 * @extends {HTMLElement}
 */
export declare interface JNode extends MoveElement {
  Jwf: BaseView; //ノードを保持しているWindow
}

/**
 *ウインドウ管理用基本データ
 *
 * @interface JDATA
 */
export interface JDATA {
  x: number;
  y: number;
  width: number;
  height: number;
  frameSize: number;
  titleSize: number;
  redraw: boolean;
  parent: BaseView | null;
  orderTop: boolean;
  orderLayer: number;
  layoutFlag: boolean;
  clientArea: HTMLElement | null;
  style: string | null;
  visible: boolean;
  minimize: boolean;
  normalX: number;
  normalY: number;
  normalWidth: number;
  normalHeight: number;
  margin: { x1: number; y1: number; x2: number; y2: number };
  padding: { x1: number; y1: number; x2: number; y2: number };
  moveable: boolean;
  reshow: boolean;
  animation: { [key: string]: string };
  animationEnable: boolean;
  noActive: boolean;
  autoSizeNode: HTMLElement | null;
  instructionSize: { width: number; height: number };
}

export interface WINDOW_EVENT_MAP {
  [key: string]: unknown[];
  active: [{ active: boolean }];
  measure: [];
  closed: [];
  layout: [];
  layouted: [];
  visibled: [{ visible: boolean }];
}

/**
 *ウインドウ作成用パラメータ
 * frame Frameを作成するか
 * title タイトルバーを表示するか
 * layer 重ね合わせ順序
 * overlap 領域をはみ出して表示するか
 * @export
 * @interface WINDOW_PARAMS
 */
export interface WINDOW_PARAMS {
  frame?: boolean;
  title?: boolean;
  layer?: number;
  overlap?: boolean;
  visible?: boolean;
}
export interface WindowRemover{
  remove:()=>void;
}
/**
 *ウインドウ基本クラス
 *
 * @export
 * @class Window
 */
export class BaseView<T extends WINDOW_EVENT_MAP = WINDOW_EVENT_MAP> {
  private removers:WindowRemover[] = [];
  private listeners: {
    [key: string]: unknown[];
  } = {};
  private hNode: JNode;
  private JData: JDATA = {
    x: 0,
    y: 0,
    width: 400,
    height: 300,
    frameSize: 0,
    titleSize: 0,
    redraw: true,
    parent: null,
    orderTop: false,
    orderLayer: 0,
    layoutFlag: false,
    clientArea: null,
    style: null,
    visible: true,
    minimize: false,
    normalX: 0,
    normalY: 0,
    normalWidth: 0,
    normalHeight: 0,
    margin: { x1: 0, y1: 0, x2: 0, y2: 0 },
    padding: { x1: 0, y1: 0, x2: 0, y2: 0 },
    moveable: false,
    reshow: true,
    noActive: false,
    animation: {},
    animationEnable: true,
    autoSizeNode: null,
    instructionSize: { width: -1, height: -1 }
  };
  /**
   * Creates an instance of Window.
   * @param {{ frame?: boolean, title?: boolean, layer?: number}} [params] ウインドウ作成用パラメータ
   * {	frame?:boolean,
   * 		title?:boolean,
   * 		layer?:number
   * }
   * @memberof Window
   */
  public constructor(params?: WINDOW_PARAMS) {
    //ウインドウ用ノードの作成
    let hNode = document.createElement("DIV") as JNode;
    hNode.Jwf = this;
    this.hNode = hNode;
    hNode.dataset.jwf = "Window";
    //位置を絶対位置指定
    hNode.style.zIndex = "10000";
    hNode.style.position = "absolute";
    hNode.style.visibility = "hidden";
    //クライアント領域を作成
    var client = document.createElement("div");
    this.JData.clientArea = client;
    client.dataset.jwfType = "client";
    hNode.appendChild(client);
    //パラメータに従いウインドウの作成
    if (params) {
      if (params.frame) {
        this.addFrame(params.title == null ? true : params.title);
        if (params.layer == null) this.setOrderLayer(10);
        if (params.overlap == null) this.setOverlap(true);
        this.JData.animation["show"] = "JWFFrameShow 0.5s ease 0s 1 normal";
        this.JData.animation["close"] = "JWFclose 0.2s ease 0s 1 forwards";
        this.JData.animation["maximize"] =
          "JWFmaximize 0.2s ease 0s 1 forwards";
        this.JData.animation["minimize"] =
          "JWFminimize 0.2s ease 0s 1 forwards";
        this.JData.animation["maxrestore"] =
          "JWFmaxrestore 0.2s ease 0s 1 forwards";
        this.JData.animation["restore"] = "JWFrestore 0.2s ease 0s 1 forwards";
      }
      if (params.layer) {
        this.setOrderLayer(params.layer);
      }
      if (params.overlap) {
        this.setOverlap(params.overlap);
      }
      if (params.visible === false) {
        this.hNode.style.visibility = "hidden";
        this.JData.visible = false;
      }
    }

    hNode.addEventListener("animationend", (): void => {
      this.layout();
    });

    //移動に備えて、必要な情報を収集
    hNode.addEventListener("touchstart", this.onMouseDown.bind(this), {
      passive: false
    });
    hNode.addEventListener("mousedown", this.onMouseDown.bind(this));
    hNode.addEventListener("move", this.onMouseMove.bind(this));
    //タイトルバーアイコンの機能設定
    hNode.addEventListener("JWFclose", this.close.bind(this));
    hNode.addEventListener("JWFmax", this.setMaximize.bind(this, true));
    hNode.addEventListener("JWFnormal", this.setMaximize.bind(this, false));
    hNode.addEventListener("JWFmin", this.setMinimize.bind(this, true));
    hNode.addEventListener("JWFrestore", this.setMinimize.bind(this, false));
    //ノードを本文へ追加
    document.body.appendChild(hNode);
    //表示
    this.show(true);
    //更新要求
    this.layout();
    //新規ウインドウをフォアグラウンドにする
    this.foreground(false);
  }
  public setOverlap(flag: boolean): void {
    this.hNode.style.position = flag ? "fixed" : "absolute";
  }
  public isOverlap(): boolean {
    return this.hNode.style.position === "fixed";
  }
  public setJwfStyle(style: string): void {
    this.getClient().dataset.jwfStyle = style;
  }
  public getJwfStyle(): string | null {
    return this.getNode().dataset.jwfStyle || null;
  }
  //フレーム追加処理
  private addFrame(titleFlag: boolean): void {
    this.getClient().dataset.jwfClient="true";
    this.hNode.dataset.jwfType = "Frame";
    //タイトルの設定
    this.JData.titleSize = titleFlag ? TITLE_SIZE : 0;
    this.hNode.style.minHeight = this.JData.titleSize + "px";
    //各パーツのスタイル設定
    let frameStyles = [
      [
        "border",
        "cursor:n-resize; left:0px;top:-{0}px;right:0px;height:{0}px;"
      ], //上
      [
        "border",
        "cursor:e-resize; top:0px;right:-{0}px;bottom:0px;width:{0}px;"
      ], //右
      [
        "border",
        "cursor:s-resize; left:0px;right:0px;height:{0}px;bottom:-{0}px;"
      ], //下
      [
        "border",
        "cursor:w-resize; top:0px;left:-{0}px;bottom:0px;width:{0}px;"
      ], //左
      [
        "border",
        "cursor:nw-resize;left:-{0}px;top:-{0}px;width:{0}px;height:{0}px;"
      ], //左上
      [
        "border",
        "cursor:ne-resize;right:-{0}px;top:-{0}px;width:{0}px;height:{0}px;"
      ], //右上
      [
        "border",
        "cursor:sw-resize;left:-{0}px;bottom:-{0}px;width:{0}px;height:{0}px;"
      ], //左下
      [
        "border",
        "cursor:se-resize;right:-{0}px;bottom:-{0}px;width:{0}px;height:{0}px;"
      ], //右下
      ["title", "left:0px;top:0px;right:0px;height:{1}px"] //タイトル
    ];

    //フレームクリックイベントの処理
    function onFrame(this: HTMLElement): void {
      if (WindowManager.frame == null)
        WindowManager.frame =
          this.dataset.index != null ? parseInt(this.dataset.index) : null;
      //EDGEはここでイベントを止めないとテキスト選択が入る
      //if (WindowManager.frame < 9)
      //	if (e.preventDefault) e.preventDefault(); else e.returnValue = false
    }
    //フレームとタイトル、クライアント領域の作成
    for (let i = 0; i < frameStyles.length; i++) {
      let frame = document.createElement("div");
      frame.style.cssText = frameStyles[i][1]
        .replace(/\{0\}/g, FRAME_SIZE.toString())
        .replace(/\{1\}/g, this.JData.titleSize.toString());
      frame.dataset.index = i.toString();
      frame.dataset.jwfType = frameStyles[i][0];
      this.hNode.appendChild(frame);

      frame.addEventListener("touchstart", onFrame, { passive: false });
      frame.addEventListener(
        "touchend",
        function(): void {
          WindowManager.frame = null;
        },
        { passive: false }
      );
      frame.addEventListener("mousedown", onFrame, false);
      frame.addEventListener(
        "mouseup",
        function(): void {
          WindowManager.frame = null;
        },
        false
      );
    }
    this.JData.frameSize = 1;
    this.getClient().style.top = this.JData.titleSize + "px";
    let node = this.hNode;
    //タイトルバーの作成
    let title = node.childNodes[9];
    let titleText = WindowManager.createElement("div", {
      dataset: { jwfType: "text" }
    });
    title.appendChild(titleText);
    //アイコンの作成
    let icons = ["min", "max", "close"];
    for (let index in icons) {
      let icon = WindowManager.createElement("div", {
        style: {
          width: this.JData.titleSize + "px",
          height: this.JData.titleSize + "px"
        },
        dataset: { jwfType: "icon", jwfKind: icons[index] }
      });
      title.appendChild(icon);
      icon.addEventListener("click", function(): void {
        WindowManager.callEvent(node, "JWF" + this.dataset.jwfKind);
      });
    }
  }

  private onMouseDown(e: MouseEvent | TouchEvent): boolean | undefined {
    if (WindowManager.moveNode == null) {
      this.foreground();
      WindowManager.moveNode = this.hNode;
      let p = WindowManager.getPos(e);
      WindowManager.baseX = p.x;
      WindowManager.baseY = p.y;
      WindowManager.nodeX = this.getPosX();
      WindowManager.nodeY = this.getPosY();
      WindowManager.nodeWidth = this.getWidth();
      WindowManager.nodeHeight = this.getHeight();
      e.stopPropagation();
      return false;
    } else {
      e.preventDefault();
    }
  }
  private onMouseMove(e: JWFEvent): void {
    if (WindowManager.frame == null) return;

    let p = e.params as MovePoint;
    let x = this.getPosX();
    let y = this.getPosY();

    let width = this.getWidth();
    let height = this.getHeight();

    //選択されている場所によって挙動を変える
    let frameIndex = WindowManager.frame;
    switch (frameIndex) {
      case 0: //上
        y = p.nodePoint.y + p.nowPoint.y - p.basePoint.y;
        height = WindowManager.nodeHeight - (p.nowPoint.y - p.basePoint.y);
        break;
      case 1: //右
        width = WindowManager.nodeWidth + (p.nowPoint.x - p.basePoint.x);
        break;
      case 2: //下
        height = WindowManager.nodeHeight + (p.nowPoint.y - p.basePoint.y);
        break;
      case 3: //左
        x = p.nodePoint.x + p.nowPoint.x - p.basePoint.x;
        width = WindowManager.nodeWidth - (p.nowPoint.x - p.basePoint.x);
        break;
      case 4: //左上
        x = p.nodePoint.x + p.nowPoint.x - p.basePoint.x;
        y = p.nodePoint.y + p.nowPoint.y - p.basePoint.y;
        width = WindowManager.nodeWidth - (p.nowPoint.x - p.basePoint.x);
        height = WindowManager.nodeHeight - (p.nowPoint.y - p.basePoint.y);
        break;
      case 5: //右上
        y = p.nodePoint.y + p.nowPoint.y - p.basePoint.y;
        width = WindowManager.nodeWidth + (p.nowPoint.x - p.basePoint.x);
        height = WindowManager.nodeHeight - (p.nowPoint.y - p.basePoint.y);
        break;
      case 6: //左下
        x = p.nodePoint.x + p.nowPoint.x - p.basePoint.x;
        width = WindowManager.nodeWidth - (p.nowPoint.x - p.basePoint.x);
        height = WindowManager.nodeHeight + (p.nowPoint.y - p.basePoint.y);
        break;
      case 7: //右下
        width = WindowManager.nodeWidth + (p.nowPoint.x - p.basePoint.x);
        height = WindowManager.nodeHeight + (p.nowPoint.y - p.basePoint.y);
        break;
      case 8: //タイトル
        x = p.nodePoint.x + p.nowPoint.x - p.basePoint.x;
        y = p.nodePoint.y + p.nowPoint.y - p.basePoint.y;
        break;
      default:
        //クライアント領域
        if (!this.JData.moveable) break;
    }
    //位置とサイズの設定
    this.setPos(x, y);
    this.setSize(width, height);
    //移動フレーム処理時はイベントを止める
    if (frameIndex < 9 || this.JData.moveable) {
      p.event.preventDefault();
      try {
        const selection = window.getSelection();
        if (selection) selection.removeAllRanges();
      } catch (e) {
        //
      }
    }
  }
  public addRemover(...remover:WindowRemover[]):void{
    if(!remover)
      return;
    const removers = this.removers;
    for(const r of remover){
      if(removers.indexOf(r) === -1)
        removers.push(r);
    }
  }
  /**
   *イベントの受け取り
   *
   * @param {string} type イベントタイプ
   * @param {*} listener コールバックリスナー
   * @memberof Window
   */
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  addEventListener<K extends keyof T>(
    name: K,
    proc: (...params: T[K]) => void
  ): void {
    const listener = this.listeners[name as string];
    if (!listener) {
      this.listeners[name as string] = [proc];
      return;
    }
    if (listener.indexOf(proc) >= 0) return;
    listener.push(proc);
  }

  /**
   *イベントの削除
   *
   * @template K
   * @param {(K | string)} type イベントタイプ
   * @param {(this: BaseView, ev: WINDOW_EVENT_MAP[K]) => unknown} listener コールバックリスナー
   * @memberof Window
   */
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  removeEventListener<K extends keyof T>(
    name: K & string,
    proc: (...params: T[K]) => void
  ): void {
    const listener = this.listeners[name];
    if (!listener) {
      this.listeners[name as string] = [proc];
      return;
    }
    const index = listener.indexOf(proc);
    if (index < 0) return;
    listener.splice(index, 1);
  }

  //
  /**
   *イベントの要求
   *
   * @param {string} type イベントタイプ
   * @param {*} params パラメータ
   * @memberof Window
   */
  public callEvent<K extends keyof T>(name: K, ...params: T[K]): void {
    const listener = this.listeners[name as string];
    if (listener) {
      for (const proc of listener) {
        (proc as ((...params: T[K]) => unknown))(...params);
      }
    }
  }
  /**
   *ウインドウのノードを得る
   *
   * @returns {HTMLElement} ウインドウノード
   * @memberof Window
   */
  public getNode(): JNode {
    return this.hNode;
  }
  /**
   *ウインドウの移動
   *
   * @param {number} x
   * @param {number} y
   * @memberof Window
   */
  public movePos(x: number, y: number): void {
    this.JData.x = this.JData.x + x;
    this.JData.y = this.JData.y + y;
    this.layout();
  }
  public setNoActive(flag: boolean): void {
    this.JData.noActive = flag;
  }
  /**
   *ウインドウの位置設定
   *引数を省略した場合は親のサイズを考慮して中央へ
   * @param {number} [x]
   * @param {number} [y]
   * @memberof Window
   */
  public setPos(x?: number, y?: number): void {
    if (x == null) {
      let parentWidth = this.getParentWidth2();
      let width = this.getWidth();
      if (parentWidth < width) x = 0;
      else x = (parentWidth - width) / 2;
      const parent = this.getParent();
      if (this.getNode().style.position === "fixed" && parent)
        x += parent.getPosX();
    }
    if (y == null) {
      let parentHeight = this.getParentHeight2();
      let height = this.getHeight();
      if (parentHeight < height) y = 0;
      else y = (parentHeight - height) / 2;
      const parent = this.getParent();
      if (this.getNode().style.position === "fixed" && parent)
        y += parent.getPosY();
    }
    if (this.JData.x === x && this.JData.y === y) return;
    this.JData.x = x;
    this.JData.y = y;
    this.layout();
  }
  public getNearFrame(): FrameWindow | null {
    let win: FrameWindow | null = this;
    do {
      if (win.hNode.dataset.jwfType === "Frame") return win;
    } while ((win = win.getParent() as FrameWindow));
    return null;
  }
  /**
   *X座標の設定
   *
   * @param {number} x
   * @memberof Window
   */
  public setPosX(x: number): void {
    if (this.JData.x === x) return;
    this.JData.x = x;
    this.layout();
  }
  /**
   *Y座標の設定
   *
   * @param {number} y
   * @memberof Window
   */
  public setPosY(y: number): void {
    if (this.JData.x === y) return;
    this.JData.y = y;
    this.layout();
  }
  /**
   *親ウインドウの取得
   *
   * @returns {BaseView} 親ウインドウ
   * @memberof Window
   */
  public getParent(): BaseView | null {
    return this.JData.parent;
  }
  /**
   *クライアント領域のドラッグによる移動の許可
   *
   * @param {boolean} moveable true:許可 false:不許可
   * @memberof Window
   */
  public setMoveable(moveable: boolean): void {
    this.JData.moveable = moveable;
  }

  /**
   *X座標を返す
   *
   * @returns {number}
   * @memberof Window
   */
  public getPosX(): number {
    return this.JData.x;
  }
  /**
   *Y座標を返す
   *
   * @returns {number}
   * @memberof Window
   */
  public getPosY(): number {
    return this.JData.y;
  }
  /**
   *ウインドウの幅を返す
   *
   * @returns
   * @memberof Window
   */
  public getWidth(): number {
    return this.JData.width;
  }
  /**
   *ウインドウの高さを返す
   *
   * @returns
   * @memberof Window
   */
  public getHeight(): number {
    return this.JData.height;
  }
  /**
   *ウインドウサイズの設定
   *
   * @param {number} width
   * @param {number} height
   * @memberof Window
   */
  public setSize(width: number, height: number): void {
    if (this.JData.width === width && this.JData.height === height) return;

    const parent = this.getParent();
    if (parent) {
      parent.layout();
    }
    this.JData.width = width;
    this.JData.height = height;
    this.layout();
  }
  /**
   *ウインドウの幅の設定
   *
   * @param {number} width
   * @memberof Window
   */
  public setWidth(width: number): void {
    if (this.JData.width === width) return;
    this.JData.width = width;
    this.layout();
    const parent = this.getParent();
    if (parent) parent.layout();
  }

  /**
   *ウインドウの高さの設定
   *
   * @param {number} height
   * @memberof Window
   */
  public setHeight(height: number): void {
    if (this.JData.height === height) return;
    this.JData.height = height;
    const parent = this.getParent();
    if (parent) parent.layout();
  }

  /**
   * クライアント領域のpadding設定
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @memberof Window
   */

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  setPadding(x1: number, y1: number, x2: number, y2: number): void;
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  setPadding(all: number): void;
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  setPadding(p1: number, p2?: number, p3?: number, p4?: number): void {
    if (typeof p2 === "undefined") {
      this.JData.padding.x1 = p1;
      this.JData.padding.y1 = p1;
      this.JData.padding.x2 = p1;
      this.JData.padding.y2 = p1;
    } else if (typeof p3 !== "undefined" && typeof p4 !== "undefined") {
      this.JData.padding.x1 = p1;
      this.JData.padding.y1 = p2;
      this.JData.padding.x2 = p3;
      this.JData.padding.y2 = p4;
    }
  }
  /**
   *配置時のマージン設定
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @memberof Window
   */
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  setMargin(x1: number, y1: number, x2: number, y2: number): void;
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  setMargin(all: number): void;
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  setMargin(p1: number, p2?: number, p3?: number, p4?: number): void {
    if (typeof p2 === "undefined") {
      this.JData.margin.x1 = p1;
      this.JData.margin.y1 = p1;
      this.JData.margin.x2 = p1;
      this.JData.margin.y2 = p1;
    } else if (typeof p3 !== "undefined" && typeof p4 !== "undefined") {
      this.JData.margin.x1 = p1;
      this.JData.margin.y1 = p2;
      this.JData.margin.x2 = p3;
      this.JData.margin.y2 = p4;
    }
  }
  /**
   *ウインドウの可視状態の取得
   *
   * @returns {boolean}
   * @memberof Window
   */
  public isVisible(): boolean {
    if (!this.JData.visible) return false;
    let parent = this.getParent();
    if (!parent) return false;
    while ((parent = parent.getParent())) {
      if (!parent.isVisible()) return false;
    }
    return true;
  }

  /**
   *ウインドウの可視状態の設定
   *
   * @param {boolean} flag
   * @memberof Window
   */
  public setVisible(flag: boolean): void {
    const node = this.getNode();
    if (!node.parentNode) {
      document.body.appendChild(node);
    } else if (this.JData.visible === flag) return;
    if (flag) this.hNode.style.visibility = "";

    if (flag) {
      node.style.display = "";
      const animation = this.JData.animationEnable
        ? this.JData.animation["show"]
        : "";
      const animationEnd = (): void => {
        this.callEvent("visibled", { visible: true });
        node.removeEventListener("animationend", animationEnd);
        node.style.animation = "";
        node.style.display = "";
      };
      if (animation) {
        node.addEventListener("animationend", animationEnd);
        node.style.animation = animation;
      } else {
        node.style.animation = "";
        animationEnd.bind(node)();
      }
    } else {
      const animationEnd = (): void => {
        let nodes = (node.querySelectorAll(
          '[data-jwf="Window"]'
        ) as unknown) as JNode[];
        let count = nodes.length;
        for (let i = 0; i < count; i++) {
          nodes[i].Jwf.layout();
        }
        node.style.display = "none";
        node.removeEventListener("animationend", animationEnd);
        node.style.animation = "";
        this.callEvent("visibled", { visible: false });
      };
      const animation = this.JData.animationEnable
        ? this.JData.animation["close"]
        : "";
      const parent = this.getParent();
      if (animation && parent && parent.isVisible()) {
        node.addEventListener("animationend", animationEnd);
        node.style.animation = animation;
      } else {
        animationEnd.bind(node)();
      }
    }
    this.JData.visible = flag;
    const parent = this.getParent();
    if (parent) parent.layout();
  }
  /**
   *ウインドウの重ね合わせを最上位に設定
   *
   * @param {boolean} flag
   * @memberof Window
   */
  public setOrderTop(flag: boolean): void {
    this.JData.orderTop = flag;
    const parent = this.getParent();
    if (parent) parent.layout();
  }
  /**
   *ウインドウの重ね合わせ順位の設定
   *値が大きいほど上位
   * @param {number} level デフォルト:0 FrameWindow:10
   * @memberof Window
   */
  public setOrderLayer(level: number): void {
    this.JData.orderLayer = level;
  }
  /**
   *レイアウトの再構成要求
   *
   * @memberof Window
   */
  public layout(): void {
    if (this.JData.layoutFlag) return;
    this.JData.layoutFlag = true;
    this.JData.redraw = true;
    WindowManager.layout(false);
    this.JData.layoutFlag = false;
  }
  /**
   *ウインドウをアクティブにする(重ね合わせ順序は変更しない)
   *
   * @param {boolean} [flag]
   * @memberof Window
   */
  public active(flag?: boolean): void {
    if (!this.JData.noActive)
      this.getNode().dataset.jwfActive =
        flag || flag == null ? "true" : "false";
  }

  /**
   *親のクライアント領域を返す
   *
   * @returns
   * @memberof Window
   */
  public getParentWidth(): number {
    const node = this.hNode;
    if (node.style.position === "fixed") return window.innerWidth;
    let parent = node.parentNode as JNode;
    if (parent.Jwf) return parent.Jwf.getWidth();
    return parent.offsetWidth;
  }
  public getParentWidth2(): number {
    let parent = this.getParent();
    if (parent) return parent.getWidth();
    return window.innerWidth;
  }
  /**
   *親のクライアント領域を返す
   *
   * @returns
   * @memberof Window
   */
  public getParentHeight(): number {
    const node = this.hNode;
    if (node.style.position === "fixed") return window.innerHeight;
    let parent = node.parentNode as JNode;
    if (parent.Jwf) return parent.Jwf.getHeight();
    return parent.offsetHeight;
  }
  public getParentHeight2(): number {
    let parent = this.getParent();
    if (parent) return parent.getHeight();
    return window.innerHeight;
  }
  /**
   *子ウインドウのサイズを再計算
   *
   * @param {boolean} flag true:強制再計算 false:必要があれば再計算
   * @returns {boolean} 再計算の必要を行ったかどうか
   * @memberof Window
   */
  public onMeasure(flag: boolean): boolean {
    const jdata = this.JData;
    //表示状態の更新
    if (jdata.reshow || flag) {
      jdata.reshow = false;
      if (jdata.visible) {
        this.hNode.style.visibility = "";

        const animation = jdata.animationEnable ? jdata.animation["show"] : "";
        if (animation) this.hNode.style.animation = animation;
      }
    }

    let client = this.getClient();
    // for (let i = 0, length = client.childNodes.length; i < length; i++) {
    //   let node = client.childNodes[i] as JNode;
    //   if (node.dataset && node.dataset.jwf === "Window")
    //     flag = node.Jwf.onMeasure(flag) || flag;
    // }
    // if (!flag && !jdata.redraw) return false;

    if (!this.isAutoSize()) return false;

    this.callEvent("measure");
    //client.style.position = "static";
    if (jdata.instructionSize.width >= 0)
      client.style.width = jdata.instructionSize.width + "px";
    else client.style.removeProperty("widht");
    if (jdata.instructionSize.height >= 0)
      client.style.height = jdata.instructionSize.height + "px";
    else client.style.removeProperty("height");

    let width = 0;
    let height = 0;
    const childNodes = client.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i--) {
      const child = childNodes[i] as HTMLElement;
      const style = window.getComputedStyle(child);
      width = Math.max(
        width,
        child.offsetLeft +
          child.offsetWidth +
          parseInt(style.marginRight as string)
      );
      height = Math.max(
        height,
        child.offsetTop +
          child.offsetHeight +
          parseInt(style.marginBottom as string)
      );
    }

    const clientWidth = this.getClientWidth();
    const clientHeight = this.getClientHeight();

    //client.style.position = "absolute";

    if (
      (jdata.instructionSize.width !== -1 && width > clientWidth) ||
      (jdata.instructionSize.height !== -1 && height > clientHeight) ||
      (jdata.instructionSize.width === -1 && width !== clientWidth) ||
      (jdata.instructionSize.height === -1 && height !== clientHeight)
    ) {
      this.setClientSize(width, height);
      // console.log("0 %d/%d %d/%d", width, clientWidth, height, clientHeight);
      // this.setClientSize(width, height);
      // const clientWidth2 = this.getClientWidth();
      // const clientHeight2 = this.getClientHeight();
      //  console.log("1 %d/%d %d/%d", width, clientWidth2, height, clientHeight2);
      return true;
    }

    return false;
  }
  /**
   *位置やサイズの確定処理
   *非同期で必要なときに呼び出されるので、基本的には直接呼び出さないこと
   * @param {boolean} flag true:強制 false:必要なら
   * @memberof Window
   */
  public onLayout(flag: boolean): void {
    if (flag || this.JData.redraw) {
      const JData = this.JData;
      if (this.isOverlap()) {
        const pwidth = window.innerWidth;
        const pheight = window.innerHeight;
        if (JData.width > pwidth) JData.width = pwidth;
        if (JData.height > pheight) JData.height = pheight;

        if (JData.x < 0) JData.x = 0;
        if (JData.y < 0) JData.y = 0;
        if (JData.x + JData.width > pwidth) JData.x = pwidth - JData.width;
        if (JData.y + JData.height > pheight) JData.y = pheight - JData.height;
      }

      //this.onMeasure(false); //直下の子リスト
      if (this.hNode.dataset.jwfStat == "maximize") {
        this.setPos(0, 0);
        this.setSize(this.getParentWidth(), this.getParentHeight());
      }

      this.hNode.style.left = this.JData.x + "px";
      this.hNode.style.top = this.JData.y + "px";
      this.hNode.style.width = this.JData.width + "px";
      this.hNode.style.height = this.JData.height + "px";
      flag = true;
      this.callEvent("layout");
    }

    let client = this.getClient();
    let nodes: JNode[] = [];
    for (let i = 0; i < client.childNodes.length; i++) {
      let node = client.childNodes[i] as HTMLElement | JNode;
      if ("Jwf" in node && node.dataset && node.dataset.jwf === "Window")
        nodes.push(node);
    }
    let count = nodes.length;

    //配置順序リスト
    nodes.sort(function(anode: JNode, bnode: JNode): number {
      const priority: { [key: string]: number } = {
        top: 10,
        bottom: 10,
        left: 8,
        right: 8,
        client: 5
      };
      const a = anode.Jwf.JData.style as string;
      const b = bnode.Jwf.JData.style as string;
      return priority[b] - priority[a];
    });
    //let retry;
    //do {
    //retry = false;
    const padding = this.JData.padding;
    let width = this.getClientWidth();
    let height = this.getClientHeight();
    let x1 = padding.x1;
    let y1 = padding.y1;
    let x2 = x1 + width;
    let y2 = y1 + height;

    for (let i = 0; i < count; i++) {
      let child: JNode = nodes[i];
      let win = child.Jwf;
      if (child.dataset.visible === "false") continue;

      const jdata = win.JData;
      const margin = jdata.margin;
      let px1 = x1 + margin.x1;
      let py1 = y1 + margin.y1;
      let px2 = x2 - margin.x2;
      let py2 = y2 - margin.y2;
      let width = -1;
      let height = -1;
      switch (jdata.style) {
        case "top":
          width = px2 - px1;
          win.setPos(px1, py1);
          win.setWidth(width);
          y1 += win.getHeight() + margin.y1 + margin.y2;
          break;
        case "bottom":
          width = px2 - px1;
          win.setPos(px1, py2 - win.getHeight());
          win.setWidth(width);
          y2 = py2 - win.getHeight() - margin.y1;
          break;
        case "left":
          height = y2 - y1;
          win.setPos(px1, py1);
          win.setHeight(height);
          x1 += win.getWidth() + margin.x1 + margin.x2;
          break;
        case "right":
          height = py2 - py1;
          win.setPos(px2 - win.getWidth(), py1);
          win.setHeight(height);
          x2 = px2 - win.getWidth() - margin.x2;
          break;
        case "client":
          width = px2 - px1;
          height = py2 - py1;
          win.setPos(px1, py1);
          win.setSize(width, height);
          break;
      }
      jdata.instructionSize = { width, height };
      win.onMeasure(false);
      //if (win.onMeasure(false)) retry = true;
      win.onLayout(flag);
    }
    //} while (retry);
    this.orderSort(client);
    if (this.JData.redraw || flag) this.callEvent("layouted");
    this.JData.redraw = false;
  }
  private orderSort(client: HTMLElement): boolean {
    let nodes: JNode[] = [];
    for (let i = 0; i < client.childNodes.length; i++) {
      let node = client.childNodes[i] as HTMLElement | JNode;
      if ("Jwf" in node && node.dataset && node.dataset.jwf === "Window")
        nodes.push(node);
    }
    //重ね合わせソート
    nodes.sort(function(anode: JNode, bnode: JNode): number {
      const a = anode.Jwf.JData;
      const b = bnode.Jwf.JData;
      if (a.orderTop) return 1;
      if (b.orderTop) return -1;
      let layer = a.orderLayer - b.orderLayer;
      if (layer) return layer;
      const aIndex = anode.style.zIndex ? parseInt(anode.style.zIndex) : 0;
      const bIndex = bnode.style.zIndex ? parseInt(bnode.style.zIndex) : 0;
      const aOrder = anode.dataset.order === "true" ? 10000 : 0;
      const bOrder = bnode.dataset.order === "true" ? 10000 : 0;
      return aIndex + aOrder - (bIndex + bOrder);
    });
    let flag = false;
    //Zオーダーの再附番
    for (let i = 0; i < nodes.length; i++) {
      const index = i.toString();
      const node = nodes[i];
      node.dataset.order = "";
      if (node.style.zIndex !== index) {
        flag = true;
        node.style.zIndex = index;
      }
    }
    //順位が変わったので更新要求
    if (flag) this.layout();
    return flag;
  }
  /**
   *ウインドウの表示/非表示
   *
   * @param {boolean} flag true:表示 false:非表示
   * @memberof Window
   */
  public show(flag: boolean): void {
    if (flag == null || flag) {
      this.hNode.style.zIndex = "10000";
      this.JData.reshow = true;
    } else {
      this.hNode.style.visibility = "hidden";
    }
  }
  /**
   *ウインドウの重ね合わせ順位を上位に持って行く
   *
   * @param {boolean} [flag] ウインドウをアクティブにするかどうか
   * @memberof Window
   */
  public foreground(flag?: boolean): void {
    if (this.JData.noActive) return;
    //親をフォアグラウンドに設定
    let activeNodes = new Set<HTMLElement>();
    let p = this.hNode;
    do {
      if ((flag || flag == null) && p.dataset) {
        activeNodes.add(p);
        p.dataset.jwfActive = "true";
        p.dataset.order = "true";
        if (p.Jwf) p.Jwf.callEvent("active", { active: true });
      }
      this.orderSort(p);
    } while ((p = p.parentNode as JNode));

    if (flag || flag == null) {
      var activeWindows = document.querySelectorAll(
        '[data-jwf="Window"][data-jwf-active="true"]'
      );
      for (let i = 0, l = activeWindows.length; i < l; i++) {
        let w = activeWindows[i] as JNode;
        if (!activeNodes.has(w)) {
          w.dataset.jwfActive = "false";
          w.Jwf.callEvent("active", { active: false });
        }
      }
    }
  }

  /**
   *クライアント領域のスクロールの可否
   *
   * @param {boolean} flag
   * @memberof Window
   */
  public setScroll(flag: boolean): void {
    this.getClient().style.overflow = flag ? "auto" : "hidden";
  }
  /**
   *クライアント領域のスクロールが有効かどうか
   *
   * @returns {boolean}
   * @memberof Window
   */
  public isScroll(): boolean {
    return this.getClient().style.overflow === "auto";
  }
  /**
   *ウインドウを閉じる
   *
   * @memberof Window
   */
  public close(): void {
    const that = this;
    function animationEnd(this: HTMLElement): void {
      let nodes: NodeListOf<JNode> = this.querySelectorAll(
        '[data-jwf="Window"]'
      );
      let count = nodes.length;
      for (let i = 0; i < count; i++) {
        nodes[i].Jwf.layout();
      }
      if (this.parentNode) this.parentNode.removeChild(this);
      this.removeEventListener("animationend", animationEnd);
      //終了処理のコールバック
      const remoers = that.removers;
      for(const remover of remoers){
        remover.remove();
      }
      that.callEvent("closed");
    }
    const animation = this.JData.animationEnable
      ? this.JData.animation["close"]
      : null;
    if (animation) {
      this.hNode.addEventListener("animationend", animationEnd);
      this.hNode.style.animation = animation;
    } else {
      animationEnd.bind(this.hNode)();
    }
  }
  /**
   *アニメーションの設定
   *
   * @param {string} name アニメーション名
   * @param {string} value アニメーションパラメータ
   * @memberof Window
   */
  public setAnimation(name: string, value: string): void {
    this.JData.animation[name] = value;
  }
  /**
   *絶対位置の取得
   *
   * @returns
   * @memberof Window
   */
  public getAbsX(): number {
    let px = this.JData.x;
    let parent: BaseView | null = this;
    while ((parent = parent.getParent())) {
      px += this.getClient().offsetLeft + parent.getClientX() + parent.JData.x;
    }
    return px;
  }
  /**
   *絶対位置の取得
   *
   * @returns
   * @memberof Window
   */
  public getAbsY(): number {
    var py = this.JData.y;
    var parent: BaseView | null = this;
    while ((parent = parent.getParent())) {
      py += this.getClient().offsetTop + parent.getClientX() + parent.JData.y;
    }
    return py;
  }

  /**
   *クライアントノードを返す
   * @returns {HTMLElement}
   * @memberof Window
   */
  public getClient(): HTMLElement {
    return this.JData.clientArea as HTMLElement;
  }
  /**
   *クライアント領域の基準位置を返す
   *
   * @returns
   * @memberof Window
   */
  public getClientX(): number {
    return this.JData.padding.x1;
  }

  /**
   *クライアント領域の基準位置を返す
   *
   * @returns
   * @memberof Window
   */
  public getClientY(): number {
    return this.JData.padding.y1;
  }

  /**
   *クライアントサイズを元にウインドウサイズを設定
   *
   * @param {number} width
   * @param {number} height
   * @memberof Window
   */
  public setClientSize(width: number, height: number): void {
    this.setSize(
      width +
        this.JData.frameSize * 2 +
        this.JData.padding.x1 +
        this.JData.padding.x2,
      height +
        this.JData.frameSize * 2 +
        this.JData.padding.y1 +
        this.JData.padding.y2 +
        this.JData.titleSize
    );
  }

  /**
   *クライアントサイズを元にウインドウサイズを設定
   *
   * @param {number} width
   * @memberof Window
   */
  public setClientWidth(width: number): void {
    this.setWidth(
      width +
        this.JData.frameSize * 2 +
        this.JData.padding.x1 +
        this.JData.padding.x2
    );
  }
  /**
   *クライアントサイズを元にウインドウサイズを設定
   *
   * @param {number} height
   * @memberof Window
   */
  public setClientHeight(height: number): void {
    this.setWidth(
      height +
        this.JData.frameSize * 2 +
        this.JData.padding.y1 +
        this.JData.padding.y2 +
        this.JData.titleSize
    );
  }
  /**
   *クライアントサイズを取得
   *
   * @returns {number}
   * @memberof Window
   */
  public getClientWidth(): number {
    return (
      this.getWidth() -
      this.JData.frameSize * 2 -
      this.JData.padding.x1 -
      this.JData.padding.x2
    );
  }
  /**
   *クライアントサイズを取得
   *
   * @returns {number}
   * @memberof Window
   */
  public getClientHeight(): number {
    return (
      this.getHeight() -
      this.JData.frameSize * 2 -
      this.JData.padding.y1 -
      this.JData.padding.y2 -
      this.JData.titleSize
    );
  }

  /**
   *子ノードの追加
   *
   * @param {BaseView} child 子ウインドウ
   * @param {('left' | 'right' | 'top' | 'bottom' | 'client' | null)} [style] ドッキング位置
   * @memberof Window
   */
  public addFrameChild(
    child: BaseView,
    style?: "left" | "right" | "top" | "bottom" | "client" | null
  ): void {
    const frame = this.getNearFrame();
    if (frame) frame.addChild(child, style);
  }
  public addChild(
    child: BaseView,
    style?: "left" | "right" | "top" | "bottom" | "client" | null
  ): void {
    if (style) child.setChildStyle(style);
    child.JData.parent = this;
    this.getClient().appendChild(child.hNode);
    this.layout();
  }

  /**
   *ドッキングスタイルの設定
   *
   * @param {('left' | 'right' | 'top' | 'bottom' | 'client' | null)} style ドッキング位置
   * @memberof Window
   */
  public setChildStyle(
    style: "left" | "right" | "top" | "bottom" | "client" | null
  ): void {
    this.JData.style = style;
    let parent = this.getParent();
    if (parent) parent.layout();
  }
  /**
   *子ウインドウを全て切り離す
   *
   * @memberof Window
   */
  public removeChildAll(): void {
    var client = this.getClient();
    var childList = client.childNodes;
    for (var i = childList.length - 1; i >= 0; i--) {
      var child = childList[i] as JNode;
      if (child.dataset.jwf === "Window") {
        child.Jwf.JData.parent = null;
        client.removeChild(child);
      }
    }
    this.layout();
  }

  /**
   *子ウインドウを切り離す
   *
   * @param {BaseView} child
   * @returns
   * @memberof Window
   */
  public removeChild(child: BaseView): void {
    if (child.getParent() !== this) return;
    child.JData.parent = null;
    this.getClient().removeChild(child.hNode);
    this.layout();
  }
  /**
   *自動サイズ調整の状態を取得
   *
   * @returns
   * @memberof Window
   */
  public isAutoSize(): boolean {
    return this.getClient().dataset.scale === "auto";
  }
  /**
   *自動サイズ調整を設定
   *
   * @param {boolean} scale
   * @memberof Window
   */
  public setAutoSize(scale: boolean): void {
    this.getClient().dataset.scale = scale ? "auto" : "";
  }
  /**
   *タイトル設定
   *
   * @param {string} title
   * @memberof Window
   */
  public setTitle(title: string): void {
    if (this.hNode.childNodes[9]) {
      this.hNode.childNodes[9].childNodes[0].textContent = title;
    }
  }
  /**
   *タイトル取得
   *
   * @returns {string}
   * @memberof Window
   */
  public getTitle(): string {
    if (this.hNode.childNodes[9]) {
      return this.hNode.childNodes[9].childNodes[0].textContent || "";
    }
    return "";
  }

  /**
   *ウインドウの最大化
   *
   * @param {boolean} flag
   * @memberof Window
   */
  public setMaximize(flag: boolean): void {
    let that = this;
    function animationEnd(this: HTMLElement): void {
      this.style.minWidth = null;
      this.style.minHeight = that.JData.titleSize + "px";
      this.removeEventListener("animationend", animationEnd);
    }
    if (this.hNode.dataset.jwfStat != "maximize") {
      this.JData.normalX = this.JData.x;
      this.JData.normalY = this.JData.y;
      this.JData.normalWidth = this.JData.width;
      this.JData.normalHeight = this.JData.height;
      this.hNode.dataset.jwfStat = "maximize";
      this.hNode.style.minWidth = this.JData.width + "px";
      this.hNode.style.minHeight = this.JData.height + "px";
      const animation = this.JData.animationEnable
        ? this.JData.animation["maximize"]
        : "";
      this.hNode.style.animation = animation;
      if (animation) this.hNode.addEventListener("animationend", animationEnd);
      else animationEnd.bind(this.hNode)();
    } else {
      this.JData.x = this.JData.normalX;
      this.JData.y = this.JData.normalY;
      this.JData.width = this.JData.normalWidth;
      this.JData.height = this.JData.normalHeight;
      this.hNode.dataset.jwfStat = "normal";
      const animation = this.JData.animationEnable
        ? this.JData.animation["maxrestore"]
        : "";
      this.hNode.style.animation = animation;
    }
    if (flag) {
      let icon = this.hNode.querySelector(
        "*>[data-jwf-type=title]>[data-jwf-type=icon][data-jwf-kind=max]"
      ) as HTMLElement;
      if (icon) icon.dataset.jwfKind = "normal";
    } else {
      let icon = this.hNode.querySelector(
        "*>[data-jwf-type=title]>[data-jwf-type=icon][data-jwf-kind=normal]"
      ) as HTMLElement;
      if (icon) icon.dataset.jwfKind = "max";
    }

    this.layout();
  }

  /**
   *ウインドウの最小化
   *
   * @param {boolean} flag
   * @memberof Window
   */
  public setMinimize(flag: boolean): void {
    var that = this;
    this.hNode.addEventListener("animationend", function(): void {
      that.layout();
    });
    if (this.hNode.dataset.jwfStat != "minimize") {
      //client.style.animation="Jwfminimize 0.2s ease 0s 1 forwards"
      const animation = this.JData.animationEnable
        ? this.JData.animation["minimize"]
        : "";
      this.hNode.style.animation = animation;
      this.hNode.dataset.jwfStat = "minimize";
    } else {
      //client.style.animation="Jwfrestore 0.2s ease 0s 1 backwards"
      const animation = this.JData.animationEnable
        ? this.JData.animation["restore"]
        : "";
      this.hNode.style.animation = animation;
      this.hNode.dataset.jwfStat = "normal";
    }
    if (flag) {
      let icon = this.hNode.querySelector(
        "*>[data-jwf-type=title]>[data-jwf-type=icon][data-jwf-kind=min]"
      ) as HTMLElement;
      icon.dataset.jwfKind = "restore";
    } else {
      let icon = this.hNode.querySelector(
        "*>[data-jwf-type=title]>[data-jwf-type=icon][data-jwf-kind=restore]"
      ) as HTMLElement;
      icon.dataset.jwfKind = "min";
    }
    this.JData.minimize = flag;
    this.layout();
  }
}
