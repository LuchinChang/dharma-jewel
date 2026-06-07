/* Build the single-file deployable 牌位轉換工具.html from source.
 *
 * Embeds the SheetJS library as base64 inside converter.html. base64 is used
 * (rather than pasting the JS inline) because the library contains "<script"
 * and "<!--" substrings that would otherwise confuse the HTML parser's
 * script-data state machine and break loading from a file:// page.
 *
 * Usage:  node build.js
 * No dependencies — Node core only. xlsx.full.min.js must be present.
 */
"use strict";
var fs = require("fs");

var SRC = "converter.html";
var LIB = "xlsx.full.min.js";
var OUT = "牌位轉換工具.html";
var TAG = '<script src="./xlsx.full.min.js"></script>';

var html = fs.readFileSync(SRC, "utf8");
var lib = fs.readFileSync(LIB, "utf8");

if (html.indexOf(TAG) === -1) {
  console.error("build: could not find the external <script src> tag in " + SRC);
  process.exit(1);
}

var b64 = Buffer.from(lib, "utf8").toString("base64");
var loader =
  '<script id="__xlsxlib" type="application/octet-stream">' + b64 + "</" + "script>\n" +
  "<script>(function(){" +
  'var b=document.getElementById("__xlsxlib").textContent.replace(/\\s+/g,"");' +
  "var bin=atob(b),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);" +
  '(0,eval)(new TextDecoder("utf-8").decode(u));' +
  "})();</" + "script>";

var out = html.replace(TAG, loader);
if (out.indexOf(TAG) !== -1) {
  console.error("build: the external tag was still present after inlining");
  process.exit(1);
}

fs.writeFileSync(OUT, out);
console.log("build: wrote " + OUT + " (" + out.length + " chars)");
