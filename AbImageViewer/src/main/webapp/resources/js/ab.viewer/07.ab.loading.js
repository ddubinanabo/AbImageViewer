/**
 * 로더 제어 툴
 * <p>AbLoadingController를 생성합니다.
 * @namespace
 */
var AbLoading = {
	/**
	 * 로더 제어 객체를 가져옵니다.
	 * @memberof AbLoading
	 * @param {Object} [options] 옵션
	 * @param {String} [options.text] 로더에 표시할 내용
	 * @param {String} [options.html] 로더에 표시할 내용 (HTML)
	 */
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

/**
 * 로더 컨트롤러
 * @class
 * @param {Object} [options] 옵션
 * @param {String} [options.selector] 로더 UI의 선택자
 * @param {String} [options.text] 로더에 표시할 내용
 * @param {String} [options.html] 로더에 표시할 내용 (HTML)
 */
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

	/**
	 * 로더를 화면에 표시합니다
	 */
	show: function(){
		this.e.show();
	},
	
	/**
	 * 로더를 화면에서 숨깁니다.
	 */
	hide: function(){
		this.e.hide();
	},
};