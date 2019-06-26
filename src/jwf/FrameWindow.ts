import { WINDOW_PARAMS, Window, WINDOW_EVENT_MAP } from "./Window";

/**
 *フレームウインドウクラス
 *
 * @export
 * @class FrameWindow
 * @extends {Window}
 */
export class FrameWindow<
  T extends WINDOW_EVENT_MAP = WINDOW_EVENT_MAP
> extends Window<T> {
  public constructor(param?: WINDOW_PARAMS) {
    let p = { frame: true, title: true, layer: 10 };
    if (param) Object.assign(p, param);
    super(p);
    this.setOverlap(true);
  }
}
