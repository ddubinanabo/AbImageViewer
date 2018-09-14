var AbLoading = {
	get: function(options){
		if (!options) options = {};
		
		return new AbLoadingController({
			selector: '#server-loading',
			text: options.text || '',
			html: options.html || ''
		});
	},
};

//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

var AbLoadingController = function(options){
	if (!options) options = {};
	
	this.e = $(options.selector);
	this.etext = this.e.find('[pl-topic="text"]');
	
	if (options.html)
		this.etext.html(options.html);
	else if (options.text)
		this.etext.text(options.text);
};

//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbLoadingController.prototype = {
	constructor: AbLoadingController,

	//-----------------------------------------------------------

	show: function(){
		this.e.show();
	},
	
	hide: function(){
		this.e.hide();
	},
};