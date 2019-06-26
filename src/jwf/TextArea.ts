import { Window, WINDOW_PARAMS, WINDOW_EVENT_MAP } from "./Window";
import "./scss/TextArea.scss";

export interface CustomEvent extends WINDOW_EVENT_MAP {
  updateText: [];
}

/**
 *複数行テキスト
 *
 * @export
 * @class TextArea
 * @extends {Window}
 */
export class TextArea extends Window<CustomEvent> {
  private textArea: HTMLTextAreaElement;
  public constructor(params?: WINDOW_PARAMS) {
    super(params);
    this.setJwfStyle("TextArea");
    const client = this.getClient();
    const textArea = document.createElement("textarea");
    this.textArea = textArea;
    client.appendChild(textArea);
    textArea.addEventListener("input", (): void => {
      this.callEvent("updateText");
    });
  }
  public setText(text: string): void {
    this.textArea.value = text;
  }
  public getText(): string {
    return this.textArea.value;
  }
}
