/// <reference path="./Window.ts" />

namespace JWF{
	/**
	 *パネル用クラス
	 *
	 * @export
	 * @class Panel
	 * @extends {Window}
	 */
	export class Panel extends Window {
		constructor() {
			super()
			this.setJwfStyle('Panel')
			this.setHeight(32)
		}
	}
}