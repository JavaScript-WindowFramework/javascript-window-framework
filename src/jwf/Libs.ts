export function Sleep(timeout: number): Promise<void> {
	return new Promise((resolv) => {
		setTimeout(() => {
			resolv()
		}, timeout)
	})
}
//---------------------------------------
//書式付文字列生成
//	引数	format,・・・
//	戻り値	生成文字列
export function sprintf(format: string, ...args) {
	if (args[0] == null)
		return '';
	var paramIndex = 0;
	var dest = "";
	for (var i = 0; format.charAt(i); i++) {
		if (format.charAt(i) == '%') {
			var flagZero = false;
			var num = 0;
			i++;
			if (format.charAt(i) == '0') {
				flagZero = true;
				i++
			}
			for (; format.charAt(i) >= '0' && format.charAt(i) <= '9'; i++) {
				num *= 10;
				num += parseInt(format.charAt(i));
			}
			switch (format.charAt(i)) {
				case 's':
					var work = String(args[paramIndex++]);
					var len = num - work.length;
					dest += work;
					var len = num - work.length;
					if (len > 0) {
						for (j = 0; j < len; j++)
							dest += ' ';
					}
					break;
				case 'd':
					var work = String(args[paramIndex++]);
					var len = num - work.length;
					if (len > 0) {
						var j;
						var c;
						if (flagZero)
							c = '0';
						else
							c = ' ';
						for (j = 0; j < len; j++)
							dest += c;
					}
					dest += work;
			}
		}
		else
			dest += format.charAt(i);
	}
	return dest;
}
