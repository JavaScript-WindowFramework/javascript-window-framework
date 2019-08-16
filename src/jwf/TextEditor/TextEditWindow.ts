import "./scss/TextEditWindow.scss";
import { EditableView } from "./EditableView";
import { PanelCreateParam } from "./PanelControl";
import { FrameWindow } from "../FrameWindow";
import { TimerProc } from "../Libs";
import { TextArea } from "../TextArea";
import { Splitter } from "../Splitter";

/**
 *
 *
 * @export
 * @class TextEditWindow
 * @extends {JWF.FrameWindow}
 */
export class TextEditWindow extends FrameWindow {
  private htmlTimer: TimerProc;
  private textTimer: TimerProc;
  private editableView:EditableView;
  private textArea:TextArea;

  public constructor() {
    super();

    this.setJwfStyle("TextEditWindow");
    this.setSize(800, 600);

    const splitter = new Splitter();
    this.addChild(splitter, "client");
    splitter.setSplitterPos(600);
    this.setPos();

    const editableView = new EditableView();
    this.editableView = editableView;
    splitter.addChild(0, editableView, "client");
    editableView.addEventListener("updateText", () => {
      this.htmlTimer.call();
    });

    const textArea = new TextArea();
    this.textArea = textArea;
    splitter.addChild(1, textArea, "client");
    textArea.addEventListener("updateText", () => {
      this.textTimer.call();
    });

    //時間差更新処理
    this.htmlTimer = new TimerProc(() => {
      textArea.setText(editableView.getHtml());
    }, 500);
    this.textTimer = new TimerProc(() => {
      editableView.setHtml(textArea.getText());
    }, 500);
  }
  public setHtml(value:string){
    this.textArea.setText(value);
    this.editableView.setHtml(value);
  }
  public getHtml(){
    return this.textArea.getText();
  }
  public createControl(param:PanelCreateParam){
     this.editableView.createControl(param);
  }
  public getEditableView(){
    return this.editableView;
  }
  public insertNode(node: HTMLElement) {
    this.editableView.insertNode(node);
  }
  public setRange(){
    this.editableView.setRange();
  }
}
