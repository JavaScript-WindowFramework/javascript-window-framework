export function Sleep(timeout: number): Promise<void> {
  return new Promise((resolv): void => {
    setTimeout((): void => {
      resolv();
    }, timeout);
  });
}
export class TimerProc {
  private proc: () => void;
  private handle?: number;
  private timeout: number;
  public constructor(proc: () => void, timeout: number) {
    this.proc = proc;
    this.timeout = timeout;
  }
  public call(timeout?: number): void {
    if (this.handle) {
      window.clearTimeout(this.handle);
    }
    this.handle = window.setTimeout((): void => {
      this.handle = 0;
      this.proc();
    }, timeout || this.timeout);
  }
}
//---------------------------------------
//書式付文字列生成
//	引数	format,・・・
//	戻り値	生成文字列
export function sprintf(format: string, ...args: unknown[]): string {
  if (args[0] == null) return "";
  let paramIndex = 0;
  let dest = "";
  for (let i = 0; format.charAt(i); i++) {
    if (format.charAt(i) == "%") {
      let flagZero = false;
      let num = 0;
      i++;
      if (format.charAt(i) == "0") {
        flagZero = true;
        i++;
      }
      for (; format.charAt(i) >= "0" && format.charAt(i) <= "9"; i++) {
        num *= 10;
        num += parseInt(format.charAt(i));
      }
      let work;
      let len;
      switch (format.charAt(i)) {
        case "s":
          work = String(args[paramIndex++]);
          len = num - work.length;
          dest += work;
          len = num - work.length;
          if (len > 0) {
            for (let j = 0; j < len; j++) dest += " ";
          }
          break;
        case "d":
          work = String(args[paramIndex++]);
          len = num - work.length;
          if (len > 0) {
            let j;
            let c;
            if (flagZero) c = "0";
            else c = " ";
            for (j = 0; j < len; j++) dest += c;
          }
          dest += work;
      }
    } else dest += format.charAt(i);
  }
  return dest;
}
