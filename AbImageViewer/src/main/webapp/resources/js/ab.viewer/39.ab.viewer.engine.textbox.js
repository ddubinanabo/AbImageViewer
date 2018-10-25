/**
 * 엔진 텍스트 입력상자 관리자
 * @class
 * @param {Object} options 옵션
 * @param {AbViewerEngine} options.engine 엔진 인스턴스
 */
function AbViewerEngineTextBox(options){
	if (!options) options = {};

	/**
	 * 엔진 인스턴스
	 * @type {AbViewerEngine}
	 */
	this.engine = options.engine || this;
	/**
	 * textArea HTML 엘리먼트 jQuery 객체
	 * @type {jQueryObject}
	 */
	this.e = null;
};

AbViewerEngineTextBox.prototype = {
	constructor: AbViewerEngineTextBox,

	/**
	 * 속성을 설정하거나 가져옵니다.
	 * <p>* 자세한 내용은 {@link https://api.jquery.com/attr/|jQuery API 문서}를 참고하세요
	 * @see {@link http://api.jquery.com/attr/} jQuery attr()
	 * @param {String} name 속성명
	 * @param {String} [value] 설정할 속성값
	 * @return {String} 속성값
	 */
	attr: function(){ return this.e.attr.apply(this.e, arguments); },
	/**
	 * 프로퍼티를 설정하거나 가져옵니다.
	 * <p>* 자세한 내용은 {@link https://api.jquery.com/prop/|jQuery API 문서}를 참고하세요
	 * @see {@link https://api.jquery.com/prop/} jQuery prop()
	 * @param {String} name 프로퍼티명
	 * @param {String} [value] 설정할 프로퍼티값
	 * @return {String} 프로퍼티값
	 */
	prop: function(){ return this.e.prop.apply(this.e, arguments); },
	/**
	 * 이벤트 리스너를 등록합니다.
	 * <p>* 자세한 내용은 {@link https://api.jquery.com/on/|jQuery API 문서}를 참고하세요
	 * @see {@link https://api.jquery.com/on/} jQuery on()
	 * @param {String} 0 이벤트명
	 * @param {(String|jQueryEventHandler)} [1] 리스너에 전달할 데이터 또는 리스너
	 * @param {jQueryEventHandler} [2] 리스너
	 */
	on: function(){ return this.e.on.apply(this.e, arguments); },
	/**
	 * 이벤트 리스너를 제거합니다.
	 * <p>* 자세한 내용은 {@link https://api.jquery.com/off/|jQuery API 문서}를 참고하세요
	 * @see {@link https://api.jquery.com/off/} jQuery off()
	 * @param {String} 0 이벤트명
	 * @param {jQueryEventHandler} [1] 리스너
	 */
	off: function(){ return this.e.off.apply(this.e, arguments); },
	/**
	 * 스타일을 설정하거나 가져옵니다.
	 * <p>* 자세한 내용은 {@link https://api.jquery.com/css/|jQuery API 문서}를 참고하세요
	 * @see {@link https://api.jquery.com/css/} jQuery css()
	 * @param {(String|Object)} 0 스타일명 또는 스타일 객체
	 * @param {(String|Number|Function)} [1] 설정할 스타일값
	 * @return {(String|Number)} 스타일값
	 */
	css: function(){ return this.e.css.apply(this.e, arguments); },
	/**
	 * 값을 설정하거나 가져옵니다.
	 * <p>* 자세한 내용은 {@link https://api.jquery.com/val/|jQuery API 문서}를 참고하세요
	 * @see {@link https://api.jquery.com/val/} jQuery val()
	 * @param {(String|Number|Array|Function)} [0] 설정할 값
	 * @return {(String)} 값
	 */
	val: function(){ return this.e.val.apply(this.e, arguments); },

	/**
	 * 입력상자의 크기를 설정합니다.
	 * @param {*} x 
	 * @param {*} y 
	 * @param {*} width 
	 * @param {*} height 
	 */
	box: function (x, y, width, height){
		var page = this.engine.currentPage;

		var canvasPoint = page.toCanvas(x, y);
		var screenPoint = this.engine.canvas2screen(canvasPoint);

		x = screenPoint.x;
		y = screenPoint.y;

		var angle = parseFloat(this.e.attr('s-angle'));

		var transform = '';

		//transform = 'translate('+(-page.x)+'px, '+(-page.y)+'px) ';

		//transform += 'rotate(5deg) ';
		//transform += 'scale(1.2,1) ';
		if (angle) transform += 'rotate('+angle+'deg) ';

		if (page.scaled()){
			var hw = (width / 2), hsw = (width * page.scale.x) / 2;
			var hh = (height / 2), hsh = (height * page.scale.y) / 2;

			x -= (hw - hsw);
			y -= (hh - hsh);

			transform += 'scale('+page.scale.x+','+page.scale.y+') ';
		}

		this.e.css('transform', transform);
		this.e.css('-webkit-transform', transform);
		this.e.css('-moz-transform', transform);
		
		this.e.css('left', x);
		this.e.css('top', y);
		this.e.css('width', width);
		this.e.css('height', height);
	},

	/**
	 * 입력상자를 화면에 표시합니다.
	 * @param {*} x 
	 * @param {*} y 
	 * @param {*} width 
	 * @param {*} height 
	 * @param {*} angle 
	 */
	show: function(x, y, width, height, angle){
		if (!angle) angle = 0;

		var page = this.engine.currentPage;

		var canvasPoint = page.toCanvas(x, y);
		var screenPoint = this.engine.canvas2screen(canvasPoint);

		x = screenPoint.x;
		y = screenPoint.y;

		this.e.attr('s-w', width);
		this.e.attr('s-h', height);
		this.e.attr('s-angle', angle);

		var transform = '';

		//transform = 'translate('+(-page.x)+'px, '+(-page.y)+'px) ';

		//transform += 'rotate(5deg) ';
		//transform += 'scale(1.2,1) ';
		if (angle) transform += 'rotate('+angle+'deg) ';

		if (page.scaled()){
			var hw = (width / 2), hsw = (width * page.scale.x) / 2;
			var hh = (height / 2), hsh = (height * page.scale.y) / 2;

			x -= (hw - hsw);
			y -= (hh - hsh);

			transform += 'scale('+page.scale.x+','+page.scale.y+') ';
		}

		this.e.css('transform', transform);
		this.e.css('-webkit-transform', transform);
		this.e.css('-moz-transform', transform);
		
		if (arguments.length == 2 || arguments.length == 3){
			this.e.css('left', x);
			this.e.css('top', y);
		}else if (arguments.length >=4){
			this.e.css('left', x);
			this.e.css('top', y);
			this.e.css('width', width);
			this.e.css('height', height);
		}

		this.e.css({
			zIndex: 0,
			visibility: 'visible'
		});

		var textElement = this.e.get(0);

		// IE 11에서는 효과 없음
		//textElement.focus({ preventScroll : true });

		// selection을 이용한 포커싱 (focus 되는 엘리멘트로 이동하지 않는다.)
		textElement.select();
		if (textElement.setSelectionRange)
			textElement.setSelectionRange(0, 0);
		else if (textElement['createTextRange']) {
			var range = textElement['createTextRange']();
			range.moveStart('character', startIndex);
			range.moveEnd('character', endIndex);
			range.select();
		}
	},

	/**
	 * 입력상자를 숨깁니다.
	 */
	hide: function(){
		this.e.blur();
		this.e.css({
			zIndex: -1,
			visibility: 'hidden'
		});
	},

	/**
	 * 입력상자를 생성합니다.
	 */
	generate: function (){
		this.e = $('<textarea placeholder="내용을 입력하세요" wrap="soft" spellcheck="false"></textarea>');
		this.e.css('line-height', '1.2');
		this.e.css('border', '0 none white');
		this.e.css('padding', '0');
		this.e.css('outline', 'none');
		this.e.css('IME-MODE', 'active');
		this.e.css('overflow', 'hidden');
		this.e.css('resize', 'none');
		this.e.css('position', 'absolute');
		this.e.css('visibility', 'hidden');
		this.e.css('z-index', '-1');
		this.e.css('-webkit-user-drag', 'none');
		this.e.css('-webkit-font-smoothing', 'antialiased');
		this.e.css('-moz-osx-font-smoothing', 'grayscale');
		this.e.keydown(this, function (event){
			event.stopPropagation(); // 현재 이벤트가 상위로 전파되지 않도록 중단한다.
			event.stopImmediatePropagation(); // 현재 이벤트가 상위뿐 아니라 현재 레벨에 걸린 다른 이벤트도 동작하지 않도록 중단한다.			
		});
	},
};