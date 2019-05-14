import { Window } from "./Window"


export class CheckBox extends Window {
	nodeText: HTMLSpanElement
	nodeCheck: HTMLInputElement
	constructor(params?: { text?: string, checked?: boolean }) {
		super()

		this.setJwfStyle('CheckBox')
		this.setAutoSize(true)

		let node = this.getClient()
		let textArea = document.createElement('label')
		node.appendChild(textArea)

		let nodeCheck = document.createElement('input')
		this.nodeCheck = nodeCheck
		nodeCheck.type = 'checkbox'
		textArea.appendChild(nodeCheck)
		if (params && params.checked != null)
			nodeCheck.checked = params.checked

		let nodeText = document.createElement('span')
		this.nodeText = nodeText
		textArea.appendChild(nodeText)

		if (params && params.text)
			this.setText(params.text)

	}
	isCheck(): boolean {
		return this.nodeCheck.checked
	}
	setCheck(check: boolean) {
		this.nodeCheck.checked = check
	}
	setText(text: string) {
		const nodeText = this.nodeText
		nodeText.textContent = text
	}
	getText(): string|null {
		const nodeText = this.nodeText
		return nodeText.textContent
	}

	getTextNode() {
		return this.nodeText
	}
}
