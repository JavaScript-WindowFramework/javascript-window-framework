import { BaseView } from "./BaseView";
import "./scss/Label.scss";
export class Label extends BaseView {
  private node:HTMLElement;
  private nodeText: HTMLSpanElement;
  public constructor(text?: string) {
    super();
    this.setJwfStyle("Label");
    const client = this.getClient();
    const node = document.createElement("div");
    this.node = node;
    client.appendChild(node);

    let nodeText = document.createElement("span");
    node.appendChild(nodeText);
    this.nodeText = nodeText;

    if (text) this.setText(text);

    this.setAutoSize(true);
  }
  public setFontSize(size: number): void {
    let nodeText = this.nodeText;
    nodeText.style.fontSize = size + "px";
    this.layout();
  }
  public setText(text: string): void {
    let nodeText = this.nodeText;
    nodeText.innerText = text;
  }
  public getText(): string | null {
    return this.nodeText.innerText;
  }
  public getTextNode(): HTMLSpanElement {
    return this.nodeText;
  }
  public setAlign(style: string): void {
    let node = this.node;
    node.style.justifyContent = style;
  }
}
