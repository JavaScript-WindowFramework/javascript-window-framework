import "./scss/Panel.scss";
import { BaseView } from "./BaseView";
/**
 *パネル用クラス
 *
 * @export
 * @class Panel
 * @extends {BaseView}
 */
export class Panel extends BaseView {
  public constructor() {
    super();
    this.setJwfStyle("Panel");
    this.setHeight(40);
    this.setPadding(2);
  }
}
