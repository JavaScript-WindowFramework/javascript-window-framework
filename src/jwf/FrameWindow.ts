import { WINDOW_PARAMS, Window } from "./Window";

/**
 *フレームウインドウクラス
 *
 * @export
 * @class FrameWindow
 * @extends {Window}
 */
export class FrameWindow extends Window {
  public constructor(param?: WINDOW_PARAMS) {
    let p = { frame: true, title: true, layer: 10 };
    if (param) Object.assign(p, param);
    super(p);
    this.setOverlap(true);
  }
}
