interface FunctionData {
  name: string;
  params: unknown[];
}
interface FunctionSet {
  functions: FunctionData[];
  promise: { [key: string]: Function };
  array: boolean;
}

interface AdapterFormat {
  globalHash: string | null; //ブラウザ共通セッションキー
  sessionHash: string | null; //タブ用セッションキー
  functions: //命令格納用
  {
    function: string; //命令
    params: unknown[]; //パラメータ
  }[];
}

export interface AdapterResult {
  value: { [keys: string]: unknown } | null;
  error: string | null;
}

/**
 *Ajax通信用アダプタ
 *
 * @export
 * @class Adapter
 */
export class Adapter {
  private handle: number | null;
  private scriptUrl: string;
  private keyName: string;
  private functionSet: FunctionSet[] = [];

  /**
   *Creates an instance of Adapter.
   * @param {string} [scriptUrl] 通信先アドレス
   * @param {string} [keyName] セッション情報記憶用キー
   * @memberof Adapter
   */
  public constructor(scriptUrl?: string, keyName?: string) {
    this.scriptUrl = scriptUrl || "./";
    this.keyName = (keyName || "") + "Session";
    this.handle = null;
  }
  public getKeyName(): string {
    return this.keyName;
  }

  /**
   *複数のファンクションの実行
   *
   * @param {FunctionData[][]} functions
   * @returns {Promise<any>}
   * @memberof Adapter
   */
  public exec(functions: FunctionData[][]): Promise<never[]>;
  /**
   *単一ファンクションの実行
   *
   * @param {string} funcName ファンクション名
   * @param {...unknown[]} params パラメータ
   * @returns {Promise<any>}
   * @memberof Adapter
   */
  // eslint-disable-next-line no-dupe-class-members
  public exec(funcName: string, ...params: unknown[]): Promise<never>;
  // eslint-disable-next-line no-dupe-class-members
  public exec(v1: FunctionData[][] | string, ...v2: unknown[]): Promise<never> {
    let functionSet: FunctionSet;
    if (Array.isArray(v1)) {
      const functions: FunctionData[] = [];
      for (let func of v1 as unknown[][]) {
        functions.push({
          name: func[0] as string,
          params: func.slice(1)
        });
      }
      functionSet = {
        functions: functions,
        promise: {},
        array: true
      };
    } else {
      functionSet = {
        functions: [{ name: v1, params: v2 }],
        promise: {},
        array: false
      };
    }

    const promise = new Promise((resolve, reject): void => {
      functionSet.promise.resolve = resolve;
      functionSet.promise.reject = reject;
    });
    this.functionSet.push(functionSet);
    this.callSend();
    return promise as Promise<never>;
  }
  private callSend(): void {
    if (!this.handle) {
      this.handle = window.setTimeout((): void => {
        this.send();
      }, 0);
    }
  }
  private send(): void {
    this.handle = null;
    const globalHash = localStorage.getItem(this.keyName);
    const sessionHash = sessionStorage.getItem(this.keyName);
    const functionSet = this.functionSet;
    this.functionSet = [];
    const params: AdapterFormat = {
      globalHash: globalHash,
      sessionHash: sessionHash,
      functions: []
    };
    for (let funcs of functionSet) {
      for (let func of funcs.functions)
        params.functions.push({
          function: func.name,
          params: func.params
        });
    }
    Adapter.sendJson(
      this.scriptUrl + "?cmd=exec",
      params,
      (res: {
        globalHash: string;
        sessionHash: string;
        results: AdapterResult[];
      }): void => {
        if (res == null) {
          for (let funcs of functionSet) {
            // eslint-disable-next-line no-console
            console.error("通信エラー");
            funcs.promise.reject("通信エラー");
          }
        } else {
          if (res.globalHash)
            localStorage.setItem(this.keyName, res.globalHash);
          if (res.sessionHash)
            sessionStorage.setItem(this.keyName, res.sessionHash);
          const results = res.results;
          let index = 0;
          for (let funcs of functionSet) {
            const length = funcs.functions.length;
            if (funcs.array) {
              const values = [];
              for (let i = index; i < length; i++) {
                if (results[i].error) {
                  // eslint-disable-next-line no-console
                  console.error(results[i].error);
                  funcs.promise.reject(results[i].error);
                  break;
                }
                values.push(results[i].value);
              }
              funcs.promise.resolve(values);
            } else {
              const result = results[index];
              // eslint-disable-next-line no-console
              if (result.error) console.error(result.error);
              else funcs.promise.resolve(result.value);
            }
            index += length;
          }
        }
      }
    );
  }
  public static sendJsonAsync(
    url: string,
    data?: unknown,
    headers?: { [key: string]: string }
  ): Promise<unknown> {
    return new Promise((resolve): void => {
      Adapter.sendJson(
        url,
        data,
        (value: unknown): void => {
          resolve(value);
        },
        headers
      );
    });
  }
  private static sendJson(
    url: string,
    data: unknown,
    proc: Function,
    headers?: { [key: string]: string }
  ): void {
    const req = new XMLHttpRequest();

    //ネイティブでJSON変換が可能かチェック
    var jsonFlag = false;
    try {
      req.responseType = "json";
    } catch (e) {
      jsonFlag = true;
    }
    if (proc == null) {
      req.open("POST", url, false);
      return JSON.parse(req.responseText);
    } else {
      req.onreadystatechange = function(): void {
        if (req.readyState == 4) {
          var obj = null;
          try {
            if (jsonFlag)
              //JSON変換の仕分け
              obj = JSON.parse(req.response);
            else obj = req.response;
          } catch (e) {
            proc(null);
            return;
          }
          proc(obj);
        }
      };
    }
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/json");
    if (headers) {
      for (let index in headers) {
        const value = sessionStorage.getItem(headers[index]);
        if (value) req.setRequestHeader(index, value);
      }
    }
    req.send(data == null ? null : JSON.stringify(data));
  }
  public upload(buffer: Blob, funcName: string, ...params: unknown[]) {
    return new Promise((resolve, reject) => {
      //ハッシュデータの読み出し
      const globalHash = localStorage.getItem(this.keyName);
      const sessionHash = sessionStorage.getItem(this.keyName);
      const adapterFormat: AdapterFormat = {
        globalHash: globalHash,
        sessionHash: sessionHash,
        functions: [
          {
            function: funcName,
            params
          }
        ]
      };
      const proc = (res: {
        globalHash: string;
        sessionHash: string;
        results: AdapterResult[];
      }) => {
        if (res == null) {
          // eslint-disable-next-line no-console
          console.error("通信エラー");
          reject("通信エラー");
        } else {
          if (res.globalHash)
            localStorage.setItem(this.keyName, res.globalHash);
          if (res.sessionHash)
            sessionStorage.setItem(this.keyName, res.sessionHash);
          if (res.results && res.results.length) {
            const result = res.results[0];
            if (result.error) reject(result.error);
            else resolve(result.value);
          } else {
            resolve(null);
          }
        }
      };
      //ファイルデータの送信
      Adapter.sendFile(this.scriptUrl + "?cmd=upload", buffer, proc, {
        params: JSON.stringify(adapterFormat)
      });
    });
  }
  public static sendFile(
    url: string,
    buffer: Blob,
    proc: (result: never) => void,
    params: { [key: string]: string | number }
  ) {
    //GETパラメータの構築
    let urlParam = "";
    if (params) {
      for (const key of Object.keys(params)) {
        if (urlParam.length) urlParam += "&";
        urlParam +=
          encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      }
      url += url.indexOf("?") >= 0 ? "&" : "?";
      url += urlParam;
    }
    //データ送信
    const req = new XMLHttpRequest();
    try {
      req.open("POST", url, true);
      req.setRequestHeader("Content-Type", "application/octet-stream");
      req.send(buffer);
    } catch (e) {
      alert(e);
      return null;
    }
    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        proc(JSON.parse(req.response) as never);
      }
    };

    return req;
  }
}
