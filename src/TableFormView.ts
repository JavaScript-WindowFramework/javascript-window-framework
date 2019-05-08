namespace JWF {
	export interface ITEM_OPTION {
		label?: string,
		type?: 'date'|'textbox' | 'checkbox' | 'select' | 'submit',
		name?: string,
		value?: string | number | boolean | Date
		link?: string
		image?: string
		image_width?: string
		events?: { [key: string]: object }
		options?: {
			name: string;
			value: string|number;
		}[]
	}
	export class TableFormView extends Window {
		table: HTMLDivElement
		items: HTMLDivElement
		footer: HTMLDivElement
		constructor(params?: WINDOW_PARAMS) {
			super(params)
			this.setJwfStyle('TableFormView')
			const table = document.createElement('div')
			this.table = table
			this.getClient().appendChild(table)

			const items = document.createElement('div')
			this.items = items
			table.appendChild(items)

			const footer = document.createElement('div')
			this.footer = footer
			this.getClient().appendChild(footer)
		}
		addItem(params: ITEM_OPTION | ITEM_OPTION[]) {
			//配列ならば分解し再入力
			if (Array.isArray(params)){
				for (const item of params)
					this.addItem(item)
				return
			}

			if (params.type === 'submit') {
				const button = document.createElement('button')
				button.textContent = params.label
				button.name = params.name
				this.footer.appendChild(button)
				if (params.events) {
					const events = params.events
					for (const key in events) {
						button.addEventListener(key, events[key] as any)
					}
				}
				return button
			} else {
				const row = document.createElement(params.type === 'checkbox' ? 'label' : 'div')

				const label = document.createElement('div')
				row.appendChild(label)
				label.innerText = params.label
				const data = document.createElement('div')
				row.appendChild(data)

				switch (params.type) {
					case 'date':
						const textDate = document.createElement('input')
						textDate.readOnly = true
						textDate.type = 'text'
						textDate.size = 10
						textDate.name = params.name || ''
						textDate.value = params.value ? (params.value as Date).toLocaleDateString():'-'
						data.appendChild(textDate)
						textDate.addEventListener('click',()=>{
							const calendar = new JWF.CalendarView({frame:true})
							calendar.addEventListener('date',(e)=>{
								textDate.value = e.date.toLocaleDateString()
							})
						})
						break
					case 'textbox':
						const textbox = document.createElement('input')
						textbox.type = 'text'
						textbox.name = params.name || ''
						textbox.value = (params.value as string) || ''
						data.appendChild(textbox)
						break
					case 'checkbox':
						const checkbox = document.createElement('input')
						checkbox.type = 'checkbox'
						checkbox.name = params.name || ''
						checkbox.checked = params.value == true
						data.appendChild(checkbox)
						break
					case 'select':
						const select = document.createElement('select')
						select.name = params.name || ''

						for (const o of params.options) {
							const option = document.createElement('option')
							option.textContent = o.name
							option.value = o.value as string
							select.appendChild(option)
						}
						data.appendChild(select)
						break
					default:
						let tag;
						if (params.link) {
							tag = document.createElement('a')
							tag.target = '_blank'
							tag.href = params.link
						} else {
							tag = document.createElement('div')
						}
						if (params.image) {
							const image = document.createElement('img')
							image.src = params.image
							if (params.image_width)
								image.style.width = params.image_width
							tag.appendChild(image)
						} else {
							tag.innerText = params.value as string
						}
						data.appendChild(tag)
						break
				}

				this.items.appendChild(row)
				return row
			}
		}
		getItem(name: string) {
			const node = this.getClient().querySelector(`[name="${name}"]`)
			return node
		}
		getParams() {
			const values: { [key: string]: string | number | boolean } = {}
			const nodes = this.items.querySelectorAll('select,input')
			for (let length = nodes.length, i = 0; i < length; ++i) {
				const v = nodes[i]
				if (v instanceof HTMLSelectElement) {
					const name = v.name
					const value = v.value
					values[name] = value
				} else if (v instanceof HTMLInputElement) {
					const name = v.name
					const value = v.type == 'checkbox' ? v.checked : v.value
					values[name] = value
				}
			}
			return values
		}
		setParams(params: { [key: string]: string | number | boolean }) {
			const nodes = this.items.querySelectorAll('select,input')
			for (let length = nodes.length, i = 0; i < length; ++i) {
				const v = nodes[i]
				if (v instanceof HTMLSelectElement) {
					const value = params[v.name]
					if (value != null)
						v.value = value.toString()

				} else if (v instanceof HTMLInputElement) {
					const value = params[v.name]
					if (value != null)
						if (v.type === 'checkbox')
							v.checked = value as boolean
						else
							v.value = value.toString()
				}
			}
		}
	}
}