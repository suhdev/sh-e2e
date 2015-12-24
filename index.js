var Compiler = require('./src/compiler'); 

var comp = new Compiler(); 

var content = comp.compile('<div sh-e2e-suite="action1"><div sh-e2e-test="test1"><div id="test" sh-e2e-action="clickThis"><div sh-e2e-action="browser.cleeickThis()"></div></div><div sh-e2e-action="browser.clickeThis()"></div></div></div>');
console.log(content);

