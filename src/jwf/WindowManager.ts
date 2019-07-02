import { MovePoint, JNode, Point } from "./BaseView";

/**
 * ウインドウ等総合管理クラス
 *
 * @export
 * @class Jwf
 */
export class WindowManager {
  public static nodeX: number;
  public static nodeY: number;
  public static baseX: number;
  public static baseY: number;
  public static nodeWidth: number;
  public static nodeHeight: number;
  public static moveNode: HTMLElement | null = null;
  public static frame: number | null = null;
  private static layoutForced: boolean;
  private static layoutHandler: number | null;

  /**
   * マウスとタッチイベントの座標取得処理
   * @param  {MouseEvent|TouchEvent} e
   * @returns {Point} マウスの座標
   */
  public static getPos(e: MouseEvent | TouchEvent): Point {
    let p: Point;
    if (
      (e as TouchEvent).targetTouches &&
      (e as TouchEvent).targetTouches.length
    ) {
      let touch = (e as TouchEvent).targetTouches[0];
      p = { x: touch.pageX, y: touch.pageY };
    } else {
      p = { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    }
    return p;
  }
  /**
   * 対象ノードに対して移動を許可し、イベントを発生させる
   *
   * @static
   * @param {HTMLElement} node
   * @memberof Jwf
   */
  public static enableMove(node: HTMLElement): void {
    function mouseDown(e: MouseEvent | TouchEvent): boolean {
      if (WindowManager.moveNode == null) {
        WindowManager.moveNode = node;
        let p = WindowManager.getPos(e);
        WindowManager.baseX = p.x;
        WindowManager.baseY = p.y;
        WindowManager.nodeX = node.offsetLeft;
        WindowManager.nodeY = node.offsetTop;
        WindowManager.nodeWidth = node.clientWidth;
        WindowManager.nodeHeight = node.clientWidth;
        e.preventDefault();
        return false;
      }
      return true;
    }
    node.addEventListener("touchstart", mouseDown, { passive: false });
    node.addEventListener("mousedown", mouseDown);
  }
  /**
   * ノードに対してイベントを発生させる
   *
   * @static
   * @param {HTMLElement} node 対象ノード
   * @param {string} ename イベント名
   * @param {*} [params] イベント発生時にevent.paramsの形で送られる
   * @memberof Jwf
   */
  public static callEvent(
    node: HTMLElement,
    ename: string,
    params?: unknown
  ): void {
    node.dispatchEvent(WindowManager.createEvent(ename, params));
  }
  /**
   *イベントを作成する
   *
   * @static
   * @param {string} ename イベント名
   * @param {*} [params] イベント発生時にevent.paramsの形で送られる
   * @returns {Event} 作成したイベント
   * @memberof Jwf
   */

  private static createEvent(ename: string, params?: unknown): Event {
    let event: CustomEvent & { params?: unknown };
    try {
      event = new CustomEvent(ename);
    } catch (e) {
      event = document.createEvent("CustomEvent");
      event.initCustomEvent(ename, false, false, null);
    }
    if (params) event.params = params;
    return event;
  }
  /**
   *ノードを作成する
   *
   * @static
   * @param {string} tagName タグ名
   * @param {*} [params] タグパラメータ
   * @returns {HTMLElement} 作成したノード
   * @memberof Jwf
   */
  public static createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    params?: object
  ): HTMLElementTagNameMap[K] {
    let tag: HTMLElementTagNameMap[K] = document.createElement(tagName);
    if (params) {
      for (let index in params) {
        let p = params[index as keyof object];
        if (typeof p == "object" && p) {
          for (let index2 of Object.keys(p))
            tag[index as keyof typeof tag][index2 as keyof object] =
              p[index2 as keyof object];
        } else
          tag[index as keyof typeof tag] = p as typeof tag[keyof typeof tag];
      }
    }
    return tag;
  }
  /**
   *ウインドウレイアウトの更新要求
   *実際の処理は遅延非同期で行われる
   *
   * @static
   * @param {boolean} flag	true:全Window強制更新 false:更新の必要があるWindowのみ更新
   * @memberof Jwf
   */
  public static layout(flag: boolean): void {
    WindowManager.layoutForced = WindowManager.layoutForced || flag;
    if (!WindowManager.layoutHandler) {
      //タイマーによる遅延実行
      WindowManager.layoutHandler = window.setTimeout(function(): void {
        WindowManager.layoutHandler = null;
        let nodes = document.querySelectorAll("[data-jwf=Window]");
        let count = nodes.length;
        for (let i = 0; i < count; i++) {
          let node = nodes[i] as JNode;
          if (!node.Jwf.getParent())
            node.Jwf.onMeasure(WindowManager.layoutForced);
          node.Jwf.onLayout(WindowManager.layoutForced);
        }

        WindowManager.layoutForced = false;
      }, 0);
    }
  }
}
function deactive(): void {
  let activeWindows = document.querySelectorAll(
    '[data-jwf="Window"][data-jwf-active="true"]'
  );
  for (let i = 0, l = activeWindows.length; i < l; i++) {
    let w = activeWindows[i] as JNode;
    w.dataset.jwfActive = "false";
    w.Jwf.callEvent("active", { active: false });
  }
}
function mouseDown(e: MouseEvent | TouchEvent): boolean {
  let node = e.target as HTMLElement;
  do {
    if (node.dataset && node.dataset.jwf === "Window") {
      return true;
    }
  } while ((node = node.parentNode as HTMLElement));
  deactive();
  return false;
}

//マウスが離された場合に選択をリセット
function mouseUp(): void {
  WindowManager.moveNode = null;
  WindowManager.frame = null;
}
//マウス移動時の処理
function mouseMove(e: MouseEvent | TouchEvent): void {
  if (WindowManager.moveNode) {
    let node = WindowManager.moveNode; //移動中ノード
    let p = WindowManager.getPos(e); //座標の取得
    let params: MovePoint = {
      event: e,
      nodePoint: { x: WindowManager.nodeX, y: WindowManager.nodeY },
      basePoint: { x: WindowManager.baseX, y: WindowManager.baseY },
      nowPoint: { x: p.x, y: p.y },
      nodeSize: { width: node.clientWidth, height: node.clientHeight }
    };
    WindowManager.callEvent(node, "move", params);
  }
}
//各イベント設定
addEventListener("resize", function(): void {
  WindowManager.layout(true);
});
addEventListener("mouseup", mouseUp, false);
addEventListener("touchend", mouseUp, { passive: false });
addEventListener("mousemove", mouseMove, false);
addEventListener("touchmove", mouseMove, { passive: false });
addEventListener("touchstart", mouseDown, { passive: false });
addEventListener("mousedown", mouseDown, false);
