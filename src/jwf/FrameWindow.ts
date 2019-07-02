import { WINDOW_PARAMS, BaseView, WINDOW_EVENT_MAP } from "./BaseView";

/**
 *フレームウインドウクラス
 *
 * @export
 * @class FrameWindow
 * @extends {BaseView}
 */
export class FrameWindow<
  T extends WINDOW_EVENT_MAP = WINDOW_EVENT_MAP
> extends BaseView<T> {
  public constructor(param?: WINDOW_PARAMS) {
    let p = { frame: true, title: true, layer: 10 };
    if (param) Object.assign(p, param);
    super(p);
    this.setOverlap(true);
  }
}
