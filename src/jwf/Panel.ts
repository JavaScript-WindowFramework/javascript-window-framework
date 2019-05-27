import { Window } from "./Window";
/**
 *パネル用クラス
 *
 * @export
 * @class Panel
 * @extends {Window}
 */
export class Panel extends Window {
  public constructor() {
    super();
    this.setJwfStyle("Panel");
    this.setHeight(32);
  }
}
