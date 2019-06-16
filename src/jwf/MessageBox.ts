/* eslint-disable @typescript-eslint/class-name-casing */
import { WINDOW_EVENT_MAP, Window } from "./Window";
import { Button } from "./Button";
import { FrameWindow } from "./FrameWindow";
import "./scss/MessageBox.scss";

export interface MessageBoxEventMap extends WINDOW_EVENT_MAP {
  buttonClick: unknown;
}
export class MessageBox extends FrameWindow {
  private label: Window;
  public constructor(
    title: string,
    msg: string,
    buttons?: [string,unknown][]
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
      buttons = [[ "OK",true ]];
    }
    for (let i=buttons.length-1;i>=0;i--) {
      const buttonData = buttons[i];
      const b = new Button(buttonData[0], buttonData[1]);
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
    type: K|string,
    listener: (this:Window,ev: MessageBoxEventMap[K]) => void
  ): void {
    super.addEventListener(type, listener as (e: unknown) => unknown);
  }
  public setText(text: string): void {
    this.label.getClient().innerText = text;
  }
}
