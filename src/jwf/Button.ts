/* eslint-disable @typescript-eslint/class-name-casing */
import { Window, WINDOW_EVENT_MAP } from "./Window";
export interface BUTTON_EVENT_ITEM_CLICK {
  event: Event;
  button: Button;
}
export interface ButtonEventMap extends WINDOW_EVENT_MAP {
  buttonClick: BUTTON_EVENT_ITEM_CLICK;
  buttonDblClick: BUTTON_EVENT_ITEM_CLICK;
}
/**
 *ボタン用クラス
 *
 * @export
 * @class Button
 * @extends {Window}
 */
export class Button extends Window {
  private nodeText: HTMLElement;
  private nodeValue: unknown;
  /**
   *Creates an instance of Button.
   * @param {string} [text] ボタンに設定するテキスト
   * @memberof Button
   */
  public constructor(text?: string, value?: unknown) {
    super();
    this.setAutoSize(true);
    this.setJwfStyle("Button");
    this.nodeValue = value;
    //this.setAlign('center')

    const button = document.createElement("div");
    this.getClient().appendChild(button);
    button.tabIndex = 0;

    let nodeText = document.createElement("span");
    button.appendChild(nodeText);
    this.nodeText = nodeText;
    if (text) this.setText(text);

    button.addEventListener(
      "keypress",
      (e): void => {
        if (e.keyCode !== 13)
          this.callEvent("submit", {
            event: e,
            button: this
          });
      }
    );
    button.addEventListener(
      "click",
      (e): void => {
        this.callEvent("buttonClick", {
          event: e,
          button: this
        });
        this.callEvent("submit", {
          event: e,
          button: this
        });
      }
    );
    button.addEventListener(
      "dblclick",
      (e): void => {
        this.callEvent("buttonDblClick", {
          event: e,
          button: this
        });
      }
    );
  }
  /**
   *ボタンに対してテキストを設定する
   *
   * @param {string} text
   * @memberof Button
   */
  public setText(text: string): void {
    let nodeText = this.nodeText;
    nodeText.textContent = text;
    this.layout();
  }
  /**
   *ボタンに設定したテキストを取得する
   *
   * @returns {string}
   * @memberof Button
   */
  public getText(): string | null {
    return this.nodeText.textContent;
  }
  public setAlign(style: string): void {
    let node = this.getClient();
    node.style.justifyContent = style;
  }
  public getValue(): unknown {
    return this.nodeValue;
  }
  /**
   *イベントの設定
   * 'buttonClick','buttonDblClick'
   *
   * @template K
   * @param {K} type
   * @param {(ev: ButtonEventMap[K]) => unknown} listener
   * @memberof Button
   */
  public addEventListener<K extends keyof ButtonEventMap>(
    type: K,
    listener: (ev: ButtonEventMap[K]) => unknown
  ): void {
    super.addEventListener(type, listener as (e: unknown) => unknown);
  }
}
export class ImageButton extends Window {
  private nodeImg: HTMLImageElement;
  /**
   *Creates an instance of Button.
   * @param {string} [text] ボタンに設定するテキスト
   * @memberof Button
   */
  public constructor(image: string, alt?: string) {
    super();
    this.setWidth(64);
    //this.setAutoSize(true)
    this.setJwfStyle("Button");
    //this.setAlign('center')

    const button = document.createElement("div");
    this.getClient().appendChild(button);
    button.tabIndex = 0;

    let nodeImg = document.createElement("img");
    button.appendChild(nodeImg);
    this.nodeImg = nodeImg;
    if (alt) nodeImg.alt = alt;
    nodeImg.addEventListener(
      "load",
      (): void => {
        this.layout();
      }
    );
    nodeImg.src = image;

    button.addEventListener(
      "keypress",
      (e): void => {
        if (e.keyCode !== 13) this.callEvent("submit", { event: e });
      }
    );
    button.addEventListener(
      "click",
      (e): void => {
        this.callEvent("buttonClick", { event: e });
        this.callEvent("submit", { event: e });
      }
    );
    button.addEventListener(
      "dblclick",
      (e): void => {
        this.callEvent("buttonDblClick", {
          event: e
        });
      }
    );
  }
  /**
   *ボタンに対してテキストを設定する
   *
   * @param {string} text
   * @memberof Button
   */
  public setText(text: string): void {
    this.nodeImg.alt = text;
    this.layout();
  }
  /**
   *ボタンに設定したテキストを取得する
   *
   * @returns {string}
   * @memberof Button
   */
  public getText(): string {
    return this.nodeImg.alt;
  }
  public setAlign(style: string): void {
    let node = this.getClient();
    node.style.justifyContent = style;
  }
  /**
   *イベントの設定
   * 'buttonClick','buttonDblClick'
   *
   * @template K
   * @param {K} type
   * @param {(ev: ButtonEventMap[K]) => unknown} listener
   * @memberof Button
   */
  public addEventListener<K extends keyof ButtonEventMap>(
    type: K,
    listener: (ev: ButtonEventMap[K]) => unknown
  ): void {
    super.addEventListener(type, listener as (e: unknown) => unknown);
  }
}
