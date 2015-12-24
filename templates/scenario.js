var webdriver = require('selenium-webdriver'); 
var driver = (new webdriver).Builder().withCapabilities(webdrivier.Capabilities.chrome()).build(); 
findElement(by,id){
	return driver.findElement(webdriver.By[by](id));
}
describe('{$ suiteName $}', function() {
	
	{% for test in tests %}
	it('{$ test.name $}',function(){

	{% for action in test.actions %}
		{$ action $}
	{% endfor %}
	});
	{% endfor %}


});