import { Window } from "./Window";
import "./scss/CheckBox.scss";

export class CheckBox extends Window {
  private nodeText: HTMLSpanElement;
  private nodeCheck: HTMLInputElement;
  public constructor(params?: { text?: string; checked?: boolean }) {
    super();

    this.setJwfStyle("CheckBox");
    this.setAutoSize(true);

    const client = this.getClient();

    const node = document.createElement("div");
    client.appendChild(node);

    const textArea = document.createElement("label");
    node.appendChild(textArea);

    const nodeCheck = document.createElement("input");
    this.nodeCheck = nodeCheck;
    nodeCheck.type = "checkbox";
    textArea.appendChild(nodeCheck);
    if (params && params.checked != null) nodeCheck.checked = params.checked;

    const nodeText = document.createElement("span");
    this.nodeText = nodeText;
    textArea.appendChild(nodeText);

    if (params && params.text) this.setText(params.text);
  }
  public isCheck(): boolean {
    return this.nodeCheck.checked;
  }
  public setCheck(check: boolean): void {
    this.nodeCheck.checked = check;
  }
  public setText(text: string): void {
    const nodeText = this.nodeText;
    nodeText.textContent = text;
  }
  public getText(): string | null {
    const nodeText = this.nodeText;
    return nodeText.textContent;
  }

  public getTextNode(): HTMLSpanElement {
    return this.nodeText;
  }
}
