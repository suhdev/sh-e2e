var cheerio = require('cheerio'),
	nunjucks = require('nunjucks'),
	path = require ('canonical-path'),
	_ = require('lodash'); 

var shCompiler = function(opts){
	this.engine = nunjucks.configure(path.resolve(__dirname,'..','templates'),{
		tags:{
			blockStart:'{%',
			blockEnd:'%}',
			variableStart:'{$',
			variableEnd:'$}',
			commentStart: '{#',
			commentEnd:'#}'
		}
	});
};

shCompiler.prototype = {
	compile:function(content,outFolder){
		// try{
			var self = this;
			this.sel = cheerio.load(content);
			this.suites = this.sel('[sh-e2e-suite]');
			var ttt = this.suites.map(function(e){

				var p =  self.createSuite(this,outFolder); 
				console.log(p);
			});
			// console.log(ttt);
			return content.replace(/sh\-e2e\-.*?=".*?"/g,'');
		// }catch(err){
			console.log(err); 
			console.log(err.line);
			return ''; 
		// }
	},
	createSuite:function(suite,output){
		var self = this;
		var str = '',
			tSuite = {
				suiteName:cheerio(suite).attr('sh-e2e-suite'),
				tests:[]
			};

		cheerio(suite).find('[sh-e2e-test]')
			.each(function(e){
				var test = {
					name:cheerio(this).attr('sh-e2e-test'),
					actions:[]
				}; 
				self.getTestActions(cheerio(this),test);
				// console.log(cheerio(this).contents().length);
				// var str = cheerio(this).toString(); 
				// str.replace(/sh\-e2e\-action.*?="(.*?)"/g,function(a,b,c){
				// 	test.actions.push(b.trim()); 
				// });
				/*cheerio(this).find('[sh-e2e-action*]')
					.each(function(v){
						test.actions.push(cheerio(this).attr('sh-e2e-action'));
					});*/
				tSuite.tests.push(test);
			});
		return this.engine.render('scenario.js',tSuite);
		
	},
	getTestActions:function(el,test){
		var actions = [];
		var attribs = el[0].attribs || {}; 
		var str = el.toString(), 
			cl = el.clone(), 
			cl.empty(); 
			hasActions = false; 
		// for(var key in attribs){
		// 	if (/sh\-e2e\-action.*?="(.*?)"/.test(key)){
		// 		hasActions = true;
		// 		break;
		// 	}
		// }

		 cl.toString().replace(/sh\-e2e\-action.*?="(.*?)"/g,function(a,b,c){
		 	actions.push(b.trim()); 
		 	hasActions = true;
		 });
		 if (!hasActions){
		 	var children = el.children(),
		 		childrenActions = [];

		 	for(var c =0;c<children.length;c++){
		 		childrenActions.push()
		 	}
		 }
		if (actions.length > 0){
			for(var i=0;i<actions.length;i++){
				var identifier = 'id',
					attr;
					console.log(el.attr('id'));
				if ((attr = el.attr('id'))){
					identifier = 'id';
				}else if ((attr = el.attr('name'))){
					identifier = 'name';
				}else if ((attr = el.attr('class'))){
					identifier = 'class',
					attr = attr.split(/[\s]+/).join('.');
				}
				// console.log(identifier);
				test.actions.push(this.engine.renderString('findElement("{$ by $}","{$ val $}")',{
					by:identifier,
					val:attr
				}));

				// switch (actions[i]){
				// 	case 'clickThis':
				// 	test.actions.push('driver.get("'+suhail+'")'); 
				// 	break;
				// 	case 'focusThis':
				// 	test.actions.push('driver.get("'+suhail+'")');
				// 	break;
				// 	case '':
				// 	break;
				
				// }
				// else if 
					
					// test.actions.push('browser')
				// }
			}
		}
	}
}; 

module.exports = shCompiler; 