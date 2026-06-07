# 牌位資料轉換 · Dharma Jewel Converter

一個**單一檔案、離線**的瀏覽器小工具，將亡者名冊（Excel）轉換為含稱謂、敬／拜分類與民國日期的牌位／超薦格式。
無需安裝，適用於 Windows 7 ～ 11（以及 Mac／Linux）；資料完全留在本機，不會上傳。

A single-file, offline browser tool that converts a deceased-persons roster (Excel) into a 牌位/超薦
memorial format — with relationship titles, a 敬/拜 classification, and 民國 (ROC-era) dates in Chinese
numerals. No installation; runs in any modern browser on Windows 7–11; all data stays on the local machine.

## 使用方式 · Usage

1. 下載 **`牌位轉換工具.html`**（單一檔案，已內含程式庫）。
2. 用瀏覽器開啟（Chrome／Firefox／Edge 皆可，直接雙擊即可）。
3. 視需要在上方面板調整設定（會自動儲存於本機瀏覽器）：
   - **亡者稱謂 → 敬／拜 分類**：每個稱謂對應「敬」或「拜」；載入名冊時會自動補上檔案中出現的新稱謂。
   - **特殊稱謂 → 姓名**：無府姓／名字的集合牌位（如三合一）對應的展開文字。
   - **欄位設定**：來源檔案的欄位標題（通常不需更動）。
4. 將名冊拖入下方，按 **轉換並下載**。

## 輸出 · Output

單一工作表「牌位」，欄位：

| 陽上姓名 | 亡者稱謂 | 敬/拜 | 姓名 | 生 | 歿 |
|---|---|---|---|---|---|

- **姓名**：中文為 `府姓+名字`（如 陳文雄）；英文為 `名字 府姓`（如 John Smith）。無姓名的集合牌位則取稱謂本身或特殊展開文字。
- **生／歿**：依年號（民國／民國(農)／民國前(農)）輸出民國日期，數字為國字；缺漏的部分以「吉」表示（如 `生於民國三十年吉月吉日`）。集合牌位不輸出日期。

## 檔案 · Files

| 檔案 | 說明 |
|---|---|
| `牌位轉換工具.html` | **正式工具**（已內嵌程式庫的單一檔案）— 直接用這個。 |
| `converter.html` | 可編輯的原始碼（以 `<script src>` 載入 `xlsx.full.min.js`）。 |
| `xlsx.full.min.js` | [SheetJS](https://sheetjs.com) 程式庫（Apache-2.0）。 |
| `測試名冊.xlsx` | 範例名冊（虛構姓名）。 |

## 重新建置單一檔案 · Rebuild the single file

修改 `converter.html` 後，用 Node 將程式庫以 base64 內嵌、產生 `牌位轉換工具.html`：

```bash
node -e '
const fs=require("fs");
const html=fs.readFileSync("converter.html","utf8");
const lib=fs.readFileSync("xlsx.full.min.js","utf8");
const tag="<script src=\"./xlsx.full.min.js\"></script>";
const b64=Buffer.from(lib,"utf8").toString("base64");
const loader="<script id=\"__xlsxlib\" type=\"application/octet-stream\">"+b64+"</"+"script>\n"+
  "<script>(function(){var b=document.getElementById(\"__xlsxlib\").textContent.replace(/\\s+/g,\"\");"+
  "var bin=atob(b),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);"+
  "(0,eval)(new TextDecoder(\"utf-8\").decode(u));})();</"+"script>";
fs.writeFileSync("牌位轉換工具.html", html.replace(tag, loader));
console.log("rebuilt 牌位轉換工具.html");
'
```

> base64 內嵌可避免瀏覽器把程式庫中的 `<script`／`<!--` 字串誤判，確保單一檔案在 `file://` 下穩定載入。

## 授權 · License

包含 [SheetJS Community Edition](https://github.com/SheetJS/sheetjs)（Apache-2.0）。
