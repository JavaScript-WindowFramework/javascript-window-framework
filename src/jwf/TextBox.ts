import { BaseView } from "./BaseView";
import "./scss/TextBox.scss";
/**
 *テキストボックス
 *
 * @class TextBox
 * @extends {JSW.Window}
 */
export class TextBox extends BaseView {
  private nodeLabel: HTMLElement;
  private nodeText: HTMLInputElement;
  public constructor(params?: {
    text?: string;
    label?: string;
    type?: string;
    image?: string;
  }) {
    super();

    this.setJwfStyle("TextBox");
    this.setAutoSize(true);
    let client = this.getClient();
    let node = document.createElement("div");
    client.appendChild(node);

    let img = document.createElement("img");
    if (params && params.image) img.src = params.image;

    node.appendChild(img);

    let textArea = document.createElement("div");
    node.appendChild(textArea);

    let nodeLabel = document.createElement("div");
    textArea.appendChild(nodeLabel);
    this.nodeLabel = nodeLabel;
    if (params && params.label) nodeLabel.textContent = params.label;

    let nodeText = document.createElement("input");
    if (params && params.type) nodeText.type = params.type;
    textArea.appendChild(nodeText);
    this.nodeText = nodeText;

    nodeText.addEventListener("keydown", (e): void => {
      if (e.keyCode == 13) this.callEvent("enter", e);
    });

    if (params && params.text) this.setText(params.text);
  }

  public setText(text: string): void {
    let nodeText = this.nodeText;
    nodeText.value = text;
    const parent = this.getParent();
    if (parent) parent.layout();
  }
  public getText(): string {
    return this.nodeText.value;
  }
  public setLabel(text: string): void {
    let node = this.nodeLabel;
    node.textContent = text;
  }
  public getLabel(): string {
    return this.nodeLabel.textContent || "";
  }
  public getTextNode(): HTMLInputElement {
    return this.nodeText;
  }
  public focus(): void {
    this.nodeText.focus();
  }
}
