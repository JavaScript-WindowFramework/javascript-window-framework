/// <reference path="./Window.ts" />
namespace JWF {
	export interface CALENDARVIEW_EVENT_DATE_CLICK {
		value: any
	}
	export interface CalendarViewEventMap extends WINDOW_EVENT_MAP {
		"date": CALENDARVIEW_EVENT_DATE_CLICK
	}
	export class CalendarView extends Window {
		titleCell: HTMLTableDataCellElement
		dateCells: HTMLTableDataCellElement[]
		calendarDate: Date = new Date()
		startDate: Date
		endDate: Date
		holidays:{[keys:string]:string} = {}
		selects: { [keys: string]: boolean } = {}
		constructor() {
			super()
			this.setJwfStyle('CalendarView')
			const weekString = "日月火水木金土";

			const client = this.getClient()
			const table = document.createElement("table");
			client.appendChild(table);

			//月表示
			const titleLine = table.insertRow(-1);
			const prev = titleLine.insertCell(-1);
			prev.innerText = "←";
			prev.addEventListener("click", ()=>{
				this.moveMonth(-1)
			});
			const titleCell = titleLine.insertCell(-1)
			this.titleCell = titleCell
			titleCell.colSpan = 5

			const next = titleLine.insertCell(-1);
			next.innerText = "→";
			next.addEventListener("click", () => {
				this.moveMonth(1)
			});
			this.dateCells = []

			const that = this
			for (let j = 0; j < 7; j++) {
				const line = table.insertRow(-1);
				for (let i = 0; i < 7; i++) {
					const cell = line.insertCell(-1)
					if (j == 0)
						cell.innerHTML = weekString.substr(i, 1);
					else {
						cell.addEventListener('click', function(){
							that.onCellClick(this as HTMLDivElement)
						})
						this.dateCells.push(cell)

						const day = document.createElement("div");
						cell.appendChild(day);
						const dayText = document.createElement("div");
						cell.appendChild(dayText);
						const select = document.createElement("div");
						cell.appendChild(select);

					}
				}
			}
			this.redraw()
		}
		moveMonth(month){
			var date = this.calendarDate;
			this.calendarDate = new Date(date.getFullYear(), date.getMonth() + month)
			this.redraw()
		}

		redraw() {
			const calendarDate = this.calendarDate
			const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
			this.titleCell.innerText = JWF.sprintf("%d年%d月", date.getFullYear(), date.getMonth() + 1);

			date.setDate(date.getDate() - date.getDay());
			const dateStart = new Date(date.getTime());
			this.startDate = dateStart;
			this.endDate = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate() + 42);

			const dateCells = this.dateCells
			for (let i = 0; i < 42; i++) {
				const cell = dateCells[i]
				const day = cell.childNodes[0] as HTMLDivElement
				const text = cell.childNodes[1] as HTMLDivElement
				day.innerText = date.getDate().toString();
				(cell as any).date = new Date(date)
				date.setDate(date.getDate() + 1)
				cell.dataset.select = this.selects[date.toDateString()]?'true':''

				const holiday = this.holidays[date.toDateString()]
				if (holiday){
					text.style.visibility = 'visible'
					text.innerText = holiday
				}else{
					text.style.visibility = 'hidden'
					text.innerText = ''
				}
			}
			//getHoliday(dateStart);
		}
		setHoliday(date:Date,text:string){
			this.holidays[date.toDateString()] = text
		}
		setSelect(date: Date,value:boolean=true){
			if(value)
				this.selects[date.toDateString()] = true
			else
				delete this.selects
		}
		private onCellClick(cell: HTMLDivElement) {
			console.log((cell as any).date.toDateString())
		}
		addEventListener<K extends keyof CalendarViewEventMap>(type: K, listener: (ev: CalendarViewEventMap[K]) => any): void {
			super.addEventListener(type as any, listener)
		}
	}

}