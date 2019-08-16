import { TextInputWindow } from "./TextInputWindow";
import { PanelControl, PanelCreateParam } from "./PanelControl";
import { WINDOW_EVENT_MAP, BaseView } from "../BaseView";

export interface CustomEvent extends WINDOW_EVENT_MAP {
  updateText: [];
  insertFile: [{ fileList: FileList; enter: boolean }];
}

export class EditableView extends BaseView<CustomEvent> {
  private htmlArea: HTMLDivElement;
  private panel?: HTMLElement;
  private keepRange?: Range;
  public constructor() {
    super();
    this.setJwfStyle("EditableView");
    this.addPanel();
    const htmlArea = document.createElement("div");
    this.htmlArea = htmlArea;
    htmlArea.contentEditable = "true";
    htmlArea.style.width = "100%";
    htmlArea.style.height = "100%";
    this.getClient().appendChild(htmlArea);
    htmlArea.addEventListener("paste", e => {
      if (!e.clipboardData) return;
      if (e.clipboardData.files.length) {
        const params = { fileList: e.clipboardData.files, enter: false };
        this.callEvent("insertFile", params);
        if (!params.enter) this.insertImage(e.clipboardData.files);
      } else {
        let text = e.clipboardData.getData("text/plain");
        text = text.replace(/(["&'<>\n\t ])/g, ch => {
          const convert = {
            '"': "&quot;",
            "&": "&amp;",
            "'": "&#39;",
            "<": "&lt;",
            ">": "&gt;",
            "\n": "<br>",
            " ": "&nbsp;",
            "\t": "&nbsp;&nbsp;&nbsp;&nbsp;"
          };
          return convert[ch as keyof typeof convert];
        });
        document.execCommand("insertHtml", false, text);
      }
      e.preventDefault();
      this.callEvent("updateText");
    });
    htmlArea.addEventListener("input", () => {
      this.callEvent("updateText");
    });
    htmlArea.addEventListener("blur", () => {
      const select = document.getSelection();
      if (!select) return;
      this.keepRange = select.getRangeAt(0);
    });
    //ドラッグドロップの許可
    htmlArea.ondragover = function(e) {
      e.preventDefault();
    };
    htmlArea.addEventListener("drop", e => {
      if (e.dataTransfer) {
        const params = { fileList: e.dataTransfer.files, enter: false };
        this.callEvent("insertFile", params);
      }
      e.preventDefault();
    });
  }
  public insertImage(files: FileList) {
    //画像ファイルならDataURLに変換して貼り付ける
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.indexOf("image") != -1) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          document.execCommand("insertImage", false, reader.result as string);
          this.callEvent("updateText");
        };
      }
    }
  }
  public insertNode(node: HTMLElement) {
    document.execCommand("insertHTML", false, node.outerHTML);
  }
  public getHtml() {
    return this.htmlArea.innerHTML;
  }
  public setHtml(value: string) {
    this.htmlArea.innerHTML = value;
  }
  private addPanel() {
    const client = this.getClient();
    const panel = document.createElement("div");
    this.panel = panel;
    client.appendChild(panel);
    PanelControl.createControl(panel, {
      label: "解除",
      event: () => {
        document.execCommand("removeFormat");
        this.callEvent("updateText");
      }
    });
    PanelControl.createControl(panel, {
      label: "文字色",
      type: "color",
      value:{r:0,g:0,b:0},
      event: node => {
        if (node && node.style.background) {
          this.setRange();
          document.execCommand("foreColor", false, node.style.background);
        }
      }
    });
    PanelControl.createControl(panel, {
      label: "背景色",
      value:{r:200,g:200,b:200},
      type: "color",
      event: node => {
        if (node && node.style.background) {
          this.setRange();
          document.execCommand("backColor", false, node.style.background);
        }
      }
    });
    PanelControl.createControl(panel, {
      label: "太字",
      event: () => {
        document.execCommand("bold");
        this.callEvent("updateText");
      }
    });
    PanelControl.createControl(panel, {
      label: "斜体",
      event: () => {
        document.execCommand("italic");
        this.callEvent("updateText");
      }
    });
    PanelControl.createControl(panel, {
      label: "下線",
      event: () => {
        document.execCommand("underline");
        this.callEvent("updateText");
      }
    });
    PanelControl.createControl(panel, {
      label: "消線",
      event: () => {
        document.execCommand("strikeThrough");
        this.callEvent("updateText");
      }
    });
    PanelControl.createControl(panel, {
      type: "select",
      label: "サイズ",
      option: [
        { label: "サイズ" },
        { label: "1" },
        { label: "2" },
        { label: "3" },
        { label: "4" },
        { label: "5" },
        { label: "6" },
        { label: "7" }
      ],
      event: node => {
        const select = node as HTMLSelectElement;
        if (select.value !== "サイズ") {
          document.execCommand("fontSize", false, select.value as string);
          this.callEvent("updateText");
          select.value = "サイズ";
        }
      }
    });
    PanelControl.createControl(panel, {
      label: "リンク",
      event: () => {
        this.createLink();
      }
    });
    PanelControl.createControl(panel, {
      label: "CODE",
      event: () => {
        this.setPGCode();
      }
    });
    PanelControl.createControl(panel, {
      label: "PLAIN",
      event: () => {
        this.setPGCode(true);
      }
    });
  }
  public createControl(param: PanelCreateParam) {
    if (this.panel) PanelControl.createControl(this.panel, param);
  }
  public setPGCode(plain?: boolean) {
    const select = document.getSelection();
    if (!select) return;
    const range = select.getRangeAt(0);
    const text = select.toString().replace(/["&'<>\n]/g, function(ch) {
      const convert = {
        "</div>": "<br>\n",
        "\n": "<br>\n",
        '"': "&quot;",
        "&": "&amp;",
        "'": "&#39;",
        "<": "&lt;",
        ">": "&gt;"
      };
      return convert[ch as keyof typeof convert];
    });
    range.deleteContents();
    range.insertNode(
      range.createContextualFragment(
        `<br><div class='code${plain ? 2 : ""}'>${text}</div><br>`
      )
    );
    this.callEvent("updateText");
  }
  public createLink() {
    const select = document.getSelection();
    if (!select) return;
    const range = select.getRangeAt(0);
    const input = new TextInputWindow({
      title: "リンク作成",
      message: "リンク先の入力",
      label: "URL",
      event: value => {
        select.removeAllRanges();
        select.addRange(range);
        document.execCommand("createLink", undefined, value);
        if (select.anchorNode && select.anchorNode.parentElement) {
          const parent = select.anchorNode.parentElement as HTMLAnchorElement;
          parent.target = "_blank";
        }
        input.close();
      }
    });
  }
  public setRange() {
    if (this.keepRange) {
      const select = document.getSelection();
      if (!select) return;
      select.removeAllRanges();
      select.addRange(this.keepRange);
    }
  }
}
