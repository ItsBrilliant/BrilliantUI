h = require('../node_modules/html-to-text/lib/html-to-text.js');
var x = Math.random();
console.log(x)
var s = "Some text that is actually a string";
var html = "<div><span>Some text that is in html</span></div>";
var text = h.htmlToText(s);
var html_text = h.htmlToText(html)
console.log(text)
console.log(html_text)
