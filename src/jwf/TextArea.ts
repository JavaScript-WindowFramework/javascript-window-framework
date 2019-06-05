import { Window, WINDOW_PARAMS } from "./Window";
import "./scss/TextArea.scss";
/**
 *複数行テキスト
 *
 * @export
 * @class TextArea
 * @extends {Window}
 */
export class TextArea extends Window {
  private textArea: HTMLTextAreaElement;
  public constructor(params?: WINDOW_PARAMS) {
    super(params);
    this.setJwfStyle("TextArea");
    const client = this.getClient();
    const textArea = document.createElement("textarea");
    this.textArea = textArea;
    client.appendChild(textArea);
  }
  public setText(text: string): void {
    this.textArea.value = text;
  }
  public getText(): string {
    return this.textArea.value;
  }
}
