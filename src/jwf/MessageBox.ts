/* eslint-disable @typescript-eslint/class-name-casing */
import { WINDOW_EVENT_MAP, Window } from "./Window";
import { Button } from "./Button";
import { FrameWindow } from "./FrameWindow";
export interface MESSAGEBOX_EVENT_ITEM_CLICK {
  value: unknown;
}
export interface MessageBoxEventMap extends WINDOW_EVENT_MAP {
  buttonClick: MESSAGEBOX_EVENT_ITEM_CLICK;
}
export class MessageBox extends FrameWindow {
  private label: Window;
  public constructor(
    title: string,
    msg: string,
    buttons?: { [key: string]: unknown }
  ) {
    super();
    this.setJwfStyle("MessageBox");
    this.setSize(300, 200);
    this.setPos();
    this.setTitle(title);
    this.active();
    this.setPadding(10, 10, 10, 10);

    const label = new Window();
    this.label = label;
    label.setJwfStyle("MessageBoxLabel");
    this.addChild(label, "client");
    if (msg) label.getClient().innerText = msg;
    const that = this;
    if (!buttons) {
      buttons = { OK: true };
    }
    for (let name in buttons) {
      const b = new Button(name, buttons[name]);
      b.setAlign("center");
      this.addChild(b, "bottom");
      b.addEventListener(
        "buttonClick",
        function(this: Button): void {
          that.callEvent("buttonClick", this.getValue());
          that.close();
        }.bind(b)
      );
    }
  }
  public addEventListener<K extends keyof MessageBoxEventMap>(
    type: K,
    listener: (ev: MessageBoxEventMap[K]) => void
  ): void {
    super.addEventListener(type, listener as (e: unknown) => unknown);
  }
  public setText(text: string): void {
    this.label.getClient().innerText = text;
  }
}
