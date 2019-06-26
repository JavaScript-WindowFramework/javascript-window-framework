import { Window } from "./Window";
import "./scss/SelectBox.scss";

export class SelectBox extends Window {
  private select: HTMLSelectElement;
  public constructor(option: {
    name?: string;
    options: { label: string; value: string | number | boolean }[];
    event?: { [key: string]: () => void };
  }) {
    super();

    this.setJwfStyle("SelectBox");
    this.setSize(80, 0);
    this.setAutoSize(true);

    let node = this.getClient();
    let select = document.createElement("select");
    this.select = select;
    select.name = name;

    const options = option.options;
    for (const o of options) {
      const opNode = document.createElement("option");
      opNode.textContent = o.label;
      opNode.value = o.value as string;
      select.appendChild(opNode);
    }
    node.appendChild(select);
    const event = option.event;
    if (event) {
      for (const key of Object.keys(event)) {
        const proc = event[key as keyof typeof event];
        select.addEventListener(key, proc);
      }
    }
  }
  public getValue() {
    return this.select.value;
  }
}
