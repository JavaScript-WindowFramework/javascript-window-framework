/* eslint-disable @typescript-eslint/class-name-casing */
import { Window, WINDOW_PARAMS, WINDOW_EVENT_MAP } from "./Window";
import "./scss/CalendarView.scss";
import * as Libs from "./Libs";
export interface CALENDARVIEW_EVENT_DATE_CLICK {
  date: Date;
}
export interface CalendarViewEventMap extends WINDOW_EVENT_MAP {
  date: CALENDARVIEW_EVENT_DATE_CLICK;
}
export class CalendarView extends Window {
  private titleCell: HTMLTableDataCellElement;
  private dateCells: (HTMLTableDataCellElement & { date?: Date })[];
  private calendarDate: Date = new Date();
  private startDate: Date | null = null;
  private endDate: Date | null = null;
  private holidays: { [keys: string]: string } = {};
  private selects: { [keys: string]: boolean } = {};
  public constructor(p?: WINDOW_PARAMS) {
    super(p);
    this.setJwfStyle("CalendarView");
    const weekString = "日月火水木金土";

    const client = this.getClient();
    const table = document.createElement("table");
    client.appendChild(table);

    //月表示
    const titleLine = table.insertRow(-1);
    const prev = titleLine.insertCell(-1);
    prev.innerText = "←";
    prev.addEventListener(
      "click",
      (): void => {
        this.moveMonth(-1);
      }
    );
    const titleCell = titleLine.insertCell(-1);
    this.titleCell = titleCell;
    titleCell.colSpan = 5;

    const next = titleLine.insertCell(-1);
    next.innerText = "→";
    next.addEventListener(
      "click",
      (): void => {
        this.moveMonth(1);
      }
    );
    this.dateCells = [];

    const that = this;
    for (let j = 0; j < 7; j++) {
      const line = table.insertRow(-1);
      for (let i = 0; i < 7; i++) {
        const cell = line.insertCell(-1);
        if (j == 0) cell.innerHTML = weekString.substr(i, 1);
        else {
          cell.addEventListener("click", function(): void {
            that.onCellClick(this as HTMLDivElement);
          });
          this.dateCells.push(cell);

          const day = document.createElement("div");
          cell.appendChild(day);
          const dayText = document.createElement("div");
          cell.appendChild(dayText);
          const select = document.createElement("div");
          cell.appendChild(select);
        }
      }
    }
    this.redraw();
  }
  public moveMonth(month: number): void {
    var date = this.calendarDate;
    this.calendarDate = new Date(date.getFullYear(), date.getMonth() + month);
    this.redraw();
  }

  public redraw(): void {
    const calendarDate = this.calendarDate;
    const date = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      1
    );
    this.titleCell.innerText = Libs.sprintf(
      "%d年%d月",
      date.getFullYear(),
      date.getMonth() + 1
    );

    date.setDate(date.getDate() - date.getDay());
    const dateStart = new Date(date.getTime());
    this.startDate = dateStart;
    this.endDate = new Date(
      dateStart.getFullYear(),
      dateStart.getMonth(),
      dateStart.getDate() + 42
    );

    const dateCells = this.dateCells;
    for (let i = 0; i < 42; i++) {
      const cell = dateCells[i];
      const day = cell.childNodes[0] as HTMLDivElement;
      const text = cell.childNodes[1] as HTMLDivElement;
      day.innerText = date.getDate().toString();
      cell.date = new Date(date);
      cell.dataset.select = this.selects[date.toDateString()] ? "true" : "";

      const holiday = this.holidays[date.toDateString()];
      if (holiday) {
        text.style.visibility = "visible";
        text.innerText = holiday;
      } else {
        text.style.visibility = "hidden";
        text.innerText = "";
      }
      date.setDate(date.getDate() + 1);
    }
    //getHoliday(dateStart);
  }
  public setHoliday(date: Date, text: string): void {
    this.holidays[date.toDateString()] = text;
  }
  public setSelect(date: Date, value: boolean = true): void {
    if (value) this.selects[date.toDateString()] = true;
    else delete this.selects;
    this.redraw();
  }
  private onCellClick(cell: HTMLDivElement & { date?: Date }): void {
    if (cell.date) this.callEvent("date", { date: cell.date });
  }
  public addEventListener<K extends keyof CalendarViewEventMap>(
    type: K,
    listener: (ev: CalendarViewEventMap[K]) => unknown
  ): void {
    super.addEventListener(type, listener as (e: unknown) => unknown);
  }
  public callEvent<K extends keyof CalendarViewEventMap>(
    type: K,
    param: CalendarViewEventMap[K]
  ): void {
    super.callEvent(type, param);
  }
}
