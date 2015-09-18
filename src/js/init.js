var everythingLoaded = setInterval(function () {
	if (/loaded|complete/.test(document.readyState)) {
		clearInterval(everythingLoaded);
		initialize();
	}
},10);

everythingLoaded;
var initialize;

initialize = function () {

	//Initialize here

};
