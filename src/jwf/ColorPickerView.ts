/**
 *カラーピッカー表示用
 *
 */

import "./scss/ColorPickerView.scss";
import { WINDOW_EVENT_MAP, BaseView } from "./BaseView";
import { FrameWindow } from "./FrameWindow";
import { sprintf } from "./Libs";

export interface Color {
  r: number;
  g: number;
  b: number;
}
interface CustomEvent extends WINDOW_EVENT_MAP {
  color: [Color];
}

export class ColorView extends BaseView<CustomEvent> {
  private triangleCanvas: HTMLCanvasElement;
  private trianglePoinst: { x: number; y: number }[] = [];
  private targetSize = 40;
  private triangleSize: number = 1;
  private canvasTarget: HTMLCanvasElement;
  private canvasLevel: HTMLCanvasElement;
  private color = { r: 255, g: 255, b: 255 };
  private color2 = { r: 255, g: 255, b: 255 };
  public constructor() {
    super();
    this.setSize(300, 300);
    const client = this.getClient();
    const targetSize = this.targetSize;

    const triangleCanvas = document.createElement("canvas");
    this.triangleCanvas = triangleCanvas;
    triangleCanvas.style.position = "absolute";
    client.appendChild(triangleCanvas);

    triangleCanvas.addEventListener("mousemove", e => {
      if (e.buttons == 0) return;
      this.setTriangleColor(e);
    });

    const canvasTarget = document.createElement("canvas");
    this.canvasTarget = canvasTarget;
    canvasTarget.style.position = "absolute";
    client.appendChild(canvasTarget);

    canvasTarget.addEventListener("click", () => {
      this.callEvent("color", this.color2);
    });

    const canvasLevel = document.createElement("canvas");
    this.canvasLevel = canvasLevel;
    canvasLevel.style.position = "absolute";
    client.appendChild(canvasLevel);

    canvasLevel.addEventListener("mousemove", e => {
      if (e.buttons == 0 || !(e.target instanceof HTMLCanvasElement)) return;
      const rect = e.target.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const color = this.color;
      const color2 = this.color2;
      color2.r = this.getColorLevel(mouseY, color.r);
      color2.g = this.getColorLevel(mouseY, color.g);
      color2.b = this.getColorLevel(mouseY, color.b);
      this.setTarget();
    });

    this.addEventListener("layouted", () => {
      const width = this.getClientWidth();
      const height = this.getClientHeight();

      canvasTarget.width = targetSize;
      canvasTarget.height = targetSize;

      canvasLevel.style.top = targetSize + "px";
      canvasLevel.width = targetSize;
      canvasLevel.height = height - targetSize;
      canvasLevel.style.marginRight = "2px";

      triangleCanvas.style.left = targetSize + "px";
      triangleCanvas.width = width - targetSize;
      triangleCanvas.height = height;

      this.drawTriangle();
      this.setLevel();
    });
  }
  private getColorLevel(py: number, color: number) {
    const length = this.canvasLevel.height / 2;
    const level = ((py - length) / length) * 1.1;
    let value: number;
    if (level < 0) {
      value = Math.floor(255 * -level + color * (1 + level));
    } else {
      value = Math.floor(color * (1 - level));
    }
    if (value < 0) value = 0;
    else if (value > 255) value = 255;
    return value;
  }
  private setTriangleColor(e: MouseEvent) {
    if (!e.target) return;
    const trianglePoinst = this.trianglePoinst;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const r = this.getColor(
      mouseX,
      mouseY,
      trianglePoinst[0].x,
      trianglePoinst[0].y
    );
    const g = this.getColor(
      mouseX,
      mouseY,
      trianglePoinst[1].x,
      trianglePoinst[1].y
    );
    const b = this.getColor(
      mouseX,
      mouseY,
      trianglePoinst[2].x,
      trianglePoinst[2].y
    );
    this.setLevel(r, g, b);
  }
  private setTarget() {
    const canvasTarget = this.canvasTarget;
    const ctx = canvasTarget.getContext("2d");
    if (!ctx) return;
    const color2 = this.color2;
    ctx.fillStyle =
      "rgb(" +
      (255 - color2.r) +
      "," +
      (255 - color2.g) +
      "," +
      (255 - color2.b) +
      ")";
    ctx.fillRect(0, 0, canvasTarget.width, canvasTarget.height);
    ctx.fillStyle = "rgb(" + color2.r + "," + color2.g + "," + color2.b + ")";
    ctx.fillRect(2, 2, canvasTarget.width - 4, canvasTarget.height - 4);
  }
  private setLevel(r?: number, g?: number, b?: number) {
    const color = this.color;
    if (r === undefined || g === undefined || b === undefined) {
      r = color.r;
      g = color.g;
      b = color.b;
    } else {
      this.color = { r, g, b };
      this.color2 = { r, g, b };
    }
    const canvasLevel = this.canvasLevel;
    const ctxLevel = canvasLevel.getContext("2d");
    if (!ctxLevel) return false;
    const grad = ctxLevel.createLinearGradient(0, canvasLevel.height, 0, 0);
    grad.addColorStop(0 + (1 - 1 / 1.1), "rgb(0,0,0)");
    grad.addColorStop(0.5, "rgb(" + r + "," + g + "," + b + ")");
    grad.addColorStop(1 - (1 - 1 / 1.1), "rgb(255,255,255)");
    ctxLevel.fillStyle = grad;
    ctxLevel.fillRect(0, 0, canvasLevel.width, canvasLevel.height);

    this.setTarget();
  }
  private getColor(px: number, py: number, cx: number, cy: number) {
    let value = Math.floor(
      (1 -
        Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2)) /
          this.triangleSize) *
        255 *
        1.1
    );
    if (value < 0) value = 0;
    else if (value > 255) value = 255;
    return value;
  }
  private drawTriangle() {
    const triangleCanvas = this.triangleCanvas;
    const targetSize = this.targetSize;
    //クライアントサイズの取得
    let width = this.getClientWidth() - targetSize;
    let height = this.getClientHeight();
    //キャンバスサイズの修正
    triangleCanvas.width = width;
    triangleCanvas.height = height;

    const ctx = triangleCanvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    //トライアングルサイズの補正
    const triangle = Math.min(width, height) * 0.95;
    this.triangleSize = triangle;
    width = triangle;
    height = triangle;

    const x = (triangleCanvas.width - width) / 2;
    const y = (triangleCanvas.height - height) / 2;
    const trianglePoinst = [
      { x: x + width / 2, y },
      { x, y: y + height },
      { x: x + width, y: y + height }
    ];
    this.trianglePoinst = trianglePoinst;
    const color = [
      ["RGBA(255,0,0,255)", "RGBA(0,0,0,255)"],
      ["RGBA(0,255,0,255)", "RGBA(0,0,0,255)"],
      ["RGBA(0,0,255,255)", "RGBA(0,0,0,255)"]
    ];
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 3; i++) {
      const i0 = i % 3;
      const i1 = (i + 1) % 3;
      const i2 = (i + 2) % 3;
      /* 三角形を描く */
      const grad = ctx.createLinearGradient(
        trianglePoinst[i0].x,
        trianglePoinst[i0].y,
        (trianglePoinst[i1].x + trianglePoinst[i2].x) / 2,
        (trianglePoinst[i1].y + trianglePoinst[i2].y) / 2
      );
      grad.addColorStop(0, color[i][0]);
      grad.addColorStop(1 / 1.1, color[i][1]);
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(trianglePoinst[i0].x, trianglePoinst[i0].y);
      ctx.lineTo(trianglePoinst[i1].x, trianglePoinst[i1].y);
      ctx.lineTo(trianglePoinst[i2].x, trianglePoinst[i2].y);
      ctx.closePath();
      /* 三角形を塗りつぶす */
      ctx.fill();
    }
  }
}

export class ColorPickerWindow extends FrameWindow<CustomEvent> {
  private cell?: HTMLElement;
  private colorsArea :HTMLElement;
  private colorValues : Color[];
  private inputs:HTMLInputElement[];
  public getStrageName(name: string) {
    return (location.hostname || "") + (location.pathname || "") + name;
  }
  public constructor() {
    super();
    this.setJwfStyle("ColorPickerWindow");
    this.setSize(400, 300);
    this.setTitle("Color Picker");
    const colorView = new ColorView();
    this.addChild(colorView, "client");

    const colorValues = JSON.parse(
      localStorage.getItem(this.getStrageName("Colors")) || "[]"
    );
    this.colorValues = colorValues;
    const colorSelector = new BaseView();
    colorSelector.setJwfStyle("ColorSelector");
    colorSelector.setWidth(120);
    this.addChild(colorSelector, "left");

    const client = colorSelector.getClient();

    const inputArea = document.createElement("div");
    let input = document.createElement("input");
    inputArea.appendChild(input);
    input = document.createElement("input");
    inputArea.appendChild(input);
    input = document.createElement("input");
    inputArea.appendChild(input);
    client.appendChild(inputArea);
    const inputs = (inputArea.childNodes as unknown) as HTMLInputElement[];
    this.inputs = inputs;

    const colorsArea = document.createElement("div");
    this.colorsArea = colorsArea;
    colorsArea.dataset.type = "colors";
    for (let i = 0; i < 40; i++) {
      const cell = document.createElement("div");
      colorsArea.appendChild(cell);
      const c = document.createElement("div");
      cell.appendChild(c);
      if (colorValues[i]) c.style.backgroundColor = this.getRGB(colorValues[i]);
      else c.style.backgroundColor = this.getRGB({r:255,g:255,b:255});

      cell.addEventListener("click", () => {
        this.selectCell(i);
        this.callEvent("color",this.colorValues[i]);
      });
    }
    client.appendChild(colorsArea);

    this.selectCell(0);

    colorView.addEventListener("color", color => {
      const cell = this.cell;
      if(!cell)
        return;
      const c = cell.childNodes[0] as HTMLElement;
      const index = cell.dataset.index as string;
      colorValues[parseInt(index)] = color;
      c.style.backgroundColor = this.getRGB(color);
      localStorage.setItem(
        this.getStrageName("Colors"),
        JSON.stringify(colorValues)
      );
      this.selectCell(parseInt(index));
    });
  }
  public getRGB(color: Color) {
    return sprintf("rgb(%d,%d,%d)", color.r, color.g, color.b);
  }
  public selectCell(index: number) {
    const colorsArea = this.colorsArea;
    const cell = colorsArea.childNodes[index] as HTMLElement;
    if(!cell)
      return;
    if(this.cell)
      this.cell.dataset.active = "false";
    cell.dataset.index = index.toString();
    cell.dataset.active = "true";
    this.cell = cell;

    const color = this.colorValues[index];
    const inputs = this.inputs;
    if (color) {
      inputs[0].value = color.r.toString();
      inputs[1].value = color.g.toString();
      inputs[2].value = color.b.toString();
    } else {
      inputs[0].value = "255";
      inputs[1].value = "255";
      inputs[2].value = "255";
    }
  }
}
