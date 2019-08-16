import { FrameWindow } from "../FrameWindow";
import { TextBox } from "../TextBox";
import { Label } from "../Label";
import { Button } from "../Button";

export class TextInputWindow extends FrameWindow {
  private msg:Label
  private text:TextBox;
  public constructor(params: {
    title?: string;
    message?: string;
    label?: string;
    value?: string;
    event?: (value: string) => void;
  }) {
    super();
    this.setSize(300, 180);
    this.setPos();
    this.setPadding(10);
    if (params.title) this.setTitle(params.title);
    const msg = new Label(params.label || "");
    this.msg = msg;
    this.addChild(msg, "top");

    const text = new TextBox({
      label: params.value || "",
      text: params.value || ""
    });
    this.text = text;
    text.addEventListener("enter", () => {
      if (params.event) params.event(text.getText());
    });
    this.addChild(text, "top");

    const okButton = new Button("OK");
    this.addChild(okButton, "top");
    okButton.addEventListener("buttonClick", async () => {
      if (params.event) params.event(text.getText());
    });
    const cancelButton = new Button("Cancel");
    this.addChild(cancelButton, "top");
    cancelButton.addEventListener("buttonClick", () => {
      this.close();
    });
    this.addEventListener("layouted", () => {
      text.focus();
    });
    this.active();
  }
  public setMessage(message:string):void{
    this.msg.setText(message);
  }
  public getValue(){
    return this.text.getText();
  }
}
