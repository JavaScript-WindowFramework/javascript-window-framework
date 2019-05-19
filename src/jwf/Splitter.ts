import { Window,MovePoint } from "./Window"


/**
 *分割ウインドウ用クラス
 *
 * @export
 * @class Splitter
 * @extends {Window}
 */

export declare var SPLIT_TYPE:'ns' | 'sn' | 'ew' | 'we'


export class Splitter extends Window {

	drawerMode = false
	drawerModeNow = false
	splitterMoving = false
	splitterThick = 10
	splitterPos = 100
	splitterType:string = 'we'
	splitter: Window
	childList: Window[] = []
	drawerWidth =  0
	pos = 0
	type: typeof SPLIT_TYPE = 'we'
	menuIcon:HTMLDivElement

	/**
	 *Creates an instance of Splitter.
	 * @param {number} [splitPos]
	 * @param {('ns'|'sn'|'ew'|'we')} [splitType] 分割領域のタイプ
	 * @memberof Splitter
	 */
	constructor(splitPos?: number, splitType?: typeof SPLIT_TYPE) {
		super()
		this.setJwfStyle('SplitterView')
		this.setSize(640, 480)
		if (splitPos != null)
			this.splitterPos = splitPos
		if (splitType != null) {
			this.splitterType = splitType
		}
		const client = this.getClient()
		client.dataset.splitterType = this.splitterType
		this.childList = [new Window(), new Window()]
		super.addChild(this.childList[0])
		super.addChild(this.childList[1])


		const icon = document.createElement('div')
		this.menuIcon = icon
		icon.dataset.kind = 'SplitterMenu'
		icon.style.display = 'none'
		client.appendChild(icon)
		icon.addEventListener('click', () => {
			const child0 = this.childList[0]
			this.childList[0].addEventListener('visibled', e => {
				if (e.visible) {
					this.splitter.setVisible(true)
				}
			})

			child0.setVisible(true)
			child0.active(true)
			icon.style.display = 'none'
		})

		let splitter = new Window()
		this.splitter = splitter
		splitter.setJwfStyle('Splitter')
		splitter.setOrderTop(true)
		splitter.setNoActive(true)
		super.addChild(splitter)

		let handle: NodeJS.Timer|null = null
		splitter.getNode().addEventListener("move", (e: any)=> {

			let p = e.params as MovePoint
			let width = this.getClientWidth()
			let height = this.getClientHeight()
			let splitterThick = this.splitterThick
			let x = p.nodePoint.x + p.nowPoint.x - p.basePoint.x
			let y = p.nodePoint.y + p.nowPoint.y - p.basePoint.y
			switch (this.getClient().dataset.splitterType) {
				case "ns":
					this.splitterPos = y
					break
				case "sn":
					this.splitterPos = height - (y + splitterThick)
					break
				case "we":
					this.splitterPos = x
					break
				case "ew":
					this.splitterPos = width - (x + splitterThick)
					break

			}
			this.splitterMoving = true
			if (handle)
				clearTimeout(handle)
			handle = setTimeout(()=> { handle = null; this.splitterMoving = false; this.layout() }, 2000)
			this.layout()

		})
		this.addEventListener("layout", () => {
			const child0 = this.childList[0]
			const child1 = this.childList[1]

			const active = (e: { active: boolean })=> {
				if (!e.active) {
					splitter.setVisible(false)
					child0.setVisible(false)
					this.menuIcon.style.display = 'block'
				}
			}

			//動的分割機能の処理
			if (this.drawerMode && !this.splitterMoving) {
				const type = this.splitterType
				const dsize = this.drawerWidth + this.splitterPos
				const ssize = type === 'ew' || type === 'we' ? this.getWidth() : this.getHeight()
				if (!this.drawerModeNow) {
					if (dsize > 0 && ssize < dsize) {
						this.drawerModeNow = true
						child1.setChildStyle('client')
						child0.setOrderTop(true)
						this.splitter.setVisible(false)
						child0.getNode().style.backgroundColor = 'rgba(255,255,255,0.8)'
						child0.addEventListener('active', active)
						child0.setAnimation('show', this.splitterType + 'DrawerShow 0.5s ease 0s normal')
						child0.setAnimation('close', this.splitterType + 'DrawerClose 0.5s ease 0s normal')
						child0.active()
						child0.setVisible(false)
						this.menuIcon.style.display = 'block'
					}
				} else {
					if (dsize > 0 && ssize >= dsize) {
						this.drawerModeNow = false
						child0.removeEventListener('active', active)
						child1.setChildStyle(null)
						child0.setOrderTop(false)
						child0.setVisible(true)
						this.splitter.setVisible(true)
						this.menuIcon.style.display = 'none'
					}
				}
			}

			let width = this.getClientWidth()
			let height = this.getClientHeight()
			let splitterThick = this.splitterThick
			let splitterPos = this.splitterPos

			if (splitterPos < 0)
				splitterPos = 0
			switch (this.splitterType) {
				case "we":
					if (splitterPos >= width - splitterThick)
						splitterPos = width - splitterThick - 1
					splitter.setSize(splitterThick, height)
					splitter.setPos(splitterPos, 0)
					child0.setPos(0, 0)
					child0.setSize(splitter.getPosX(), height)
					child1.setPos(splitterPos + splitterThick, 0)
					child1.setSize(width - (splitterPos + splitterThick), height)
					break
				case "ew":
					if (splitterPos >= width - splitterThick)
						splitterPos = width - splitterThick - 1
					let p = width - splitterPos - splitterThick
					splitter.setSize(splitterThick, height)
					splitter.setPos(p, 0)
					child1.setPos(0, 0)
					child1.setSize(p, height)
					child0.setPos(p + splitterThick, 0)
					child0.setSize(splitterPos, height)
					break
				case "ns":
					if (splitterPos >= height - splitterThick)
						splitterPos = height - splitterThick - 1
					splitter.setSize(width, splitterThick)
					splitter.setPos(0, splitterPos)
					child0.setPos(0, 0)
					child0.setSize(width, splitterPos)
					child1.setPos(0, splitterPos + splitterThick)
					child1.setSize(width, height - (splitterPos + splitterThick))
					break
				case "sn":
					if (splitterPos >= height - splitterThick)
						splitterPos = height - splitterThick - 1
					splitter.setSize(width, splitterThick)
					p = height - splitterPos - splitterThick
					splitter.setPos(0, p)
					child1.setPos(0, 0)
					child1.setSize(width, p)
					child0.setPos(0, p + splitterThick)
					child0.setSize(width, splitterPos)
					break
			}
			this.splitterPos = splitterPos
		})
	}

	/**
	 *子ウインドウの追加
	 *
	 * @param {number} index 追加位置
	 * @param {Window} child 追加ウインドウ
	 * @param {('left' | 'right' | 'top' | 'bottom' | 'client' | null)} [arrgement] ドッキングタイプ
	 * @memberof Splitter
	 */
	addChild(index:number|Window, child:Window|any, arrgement?: 'left' | 'right' | 'top' | 'bottom' | 'client' | null): void {
		this.childList[index as number].addChild(child, arrgement)
	}
	/**
	 *子ウインドウを切り離す
	 *
	 * @param {number} index 削除位置
	 * @param {Window} [child] 削除ウインドウ
	 * @memberof Splitter
	 */
	removeChild(index: number|Window, child?: Window): void {
		if (child == null)
			return
		this.childList[index as number].removeChild(child)
	}
	/**
	 *子ウインドウを全て切り離す
	 *
	 * @param {number} [index] 削除位置
	 * @memberof Splitter
	 */
	removeChildAll(index?: number): void {
		if (index == null)
			return
		this.childList[index].removeChildAll()
	}
	/**
	 *分割バーの位置設定
	 *
	 * @param {number} pos
	 * @param {('ns'|'sn'|'ew'|'we')} [type]
	 * @memberof Splitter
	 */
	setSplitterPos(pos: number, type?: 'ns' | 'sn' | 'ew' | 'we') {
		if (pos != null)
			this.pos = pos
		if (type) {
			this.type = type
		}

		this.splitterPos = this.pos
		if (this.type != null) {
			this.getClient().dataset.splitterType = this.type
			this.splitterType = this.type
		}
		this.layout()
	}
	/**
	 *動的バーの設定
	 *
	 * @param {boolean} flag true:有効 false:無効
	 * @memberof Splitter
	 */
	setOverlay(flag: boolean, size?: number) {
		if (flag) {
			this.drawerMode = true
			this.drawerWidth = size != null ? size : 0
		}
		this.layout()
	}
	/**
	 *子ウインドウの取得
	 *
	 * @param {number} index 位置
	 * @returns {Window} 子ウインドウ
	 * @memberof Splitter
	 */
	getChild(index: number): Window {
		return this.childList[index]
	}

}
