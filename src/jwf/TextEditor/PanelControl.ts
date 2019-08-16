
import { Color, ColorPickerWindow } from "../ColorPickerView";
import { sprintf } from "../Libs";

export interface PanelCreateParam {
  type?: string;
  label: string;
  value?: string | boolean | Color;
  name?: string;
  option?: {
    label: string;
    value?: string;
  }[];
  size?: number;
  event?: (node?: HTMLElement,value?:unknown) => void;
}

export class PanelControl {
  public static setControlValue(
    target: HTMLElement,
    name: string,
    value: string | number|boolean
  ) {
    const node = target.querySelector(`[name="${name}"]`) as
      | HTMLInputElement
      | HTMLSelectElement;
    if (!node) return;
    if (node instanceof HTMLInputElement)
      if (node.type === "checkbox") node.checked = !!value;
    node.value = value.toString();
  }
  public static getControlValue(target: HTMLElement, name: string) {
    const node = target.querySelector(`[name="${name}"]`) as
      | HTMLInputElement
      | HTMLSelectElement;
    if (!node) return null;
    if (node instanceof HTMLInputElement)
      if (node.type === "checkbox") return node.checked;
    return node.value;
  }
  public static createControl(target: HTMLElement, param: PanelCreateParam) {
    switch (param.type) {
      default: {
        let button = document.createElement("button");
        button.name = param.name || "";
        button.innerText = param.label;
        button.addEventListener("click", () => {
          if (param.event) param.event(button);
        });
        target.appendChild(button);
        break;
      }
      case "text": {
        const area = document.createElement("label");
        area.dataset.editControl = "";
        target.appendChild(area);
        const text = document.createTextNode(param.label);
        area.appendChild(text);
        break;
      }
      case "check":
        {
          const area = document.createElement("label");
          area.dataset.editControl = "";
          target.appendChild(area);
          const text = document.createTextNode(param.label);
          area.appendChild(text);
          let check = document.createElement("input");
          check.name = param.name || "";
          check.type = "checkbox";
          if (param.value) check.checked = !!param.value;
          area.appendChild(check);
        }
        break;
      case "color":
        {
          let button = document.createElement("button");
          button.name = param.name || "";
          button.innerText = param.label;
          target.appendChild(button);
          let colorArea = document.createElement("div");
          colorArea.style.margin = "0.2em";
          colorArea.style.width = "1.5em";
          colorArea.style.height = "1.5em";
          colorArea.style.userSelect = "false";
          colorArea.style.border = "solid 1px";
          target.appendChild(colorArea);

          let value: Color = param.value as Color;
          if (!value) value = { r: 255, g: 255, b: 255 };

          const setColor = (color: Color) => {
            colorArea.style.background = sprintf(
              "rgb(%d,%d,%d)",
              color.r,
              color.g,
              color.b
            );
          };

          button.addEventListener("click", () => {
            const colorPicker = new ColorPickerWindow();
            colorPicker.setPos();
            colorPicker.addEventListener("color", color => {
              setColor(color);
              value = color;
            });
          });
          colorArea.addEventListener("click", (e) => {
            if(param.event)
              param.event(colorArea,value);
              e.preventDefault();
          });
          setColor(value);
        }
        break;
      case "input": {
        const area = document.createElement("label");
        area.dataset.editControl = "";
        target.appendChild(area);
        const text = document.createTextNode(param.label);
        area.appendChild(text);
        const input = document.createElement("input");
        input.name = param.name || "";
        if (typeof param.value === "string") input.value = param.value;
        if (param.size) input.size = param.size;
        area.appendChild(input);
        input.addEventListener("click", () => {
          if (param.event) param.event(input);
        });
        break;
      }
      case "select": {
        const select = document.createElement("select");
        select.name = param.name || "";
        //area.dataset.editControl = "";
        target.appendChild(select);
        const options = param.option;
        if (options) {
          for (const o of options) {
            const option = document.createElement("option");
            option.label = o.label;
            option.innerText = o.value || o.label;
            select.appendChild(option);
          }
        }
        select.addEventListener("change", () => {
          if (param.event) param.event(select);
        });
        break;
      }
    }
  }
}
