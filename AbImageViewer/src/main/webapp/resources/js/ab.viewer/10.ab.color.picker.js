/*
Source: https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Colors/Color_picker_tool
*/

//----------------------------------------------------------------------------------------------------------
// Notify Arguments 정의
//----------------------------------------------------------------------------------------------------------

/**
 * Notify Arguments
 * @typedef {Object} AbColorPicker.NotifyStylekArgs
 * @property {Boolean} changed 변경 여부
 * @property {*} [value] 스타일 값
 */

//----------------------------------------------------------------------------------------------------------
// 기타
//----------------------------------------------------------------------------------------------------------

/**
 * 색상 선택기 초기 색상 타입
 * <p>* RGB, HSL, HSV 중 택일
 * @typedef {String} AbColorPicker.ColorType
 */

/**
 * 색상 선택기 초기 색상 정보
 * @typedef {Object} AbColorPicker.ColorInitial
 * @property {AbColorPicker.ColorType} type 색상 타입
 * @property {(RGB_Array|HSV_Array|HSL_Array)} value
 */

/**
 * 색상 선택기 옵저브 리슨 함수
 * @callback AbColorPicker.ObserveListenFunction
 * @param {AbColorPicker} sendor Notify한 객체
 * @param {String} topic 토픽
 * @param {String} [value] 값
 * @param {*} [token] 토큰
 */

 /**
 * 색상 선택기 옵저브 리슨 객체
 * @typedef AbColorPicker.ObserveListenObject
 * @property {AbColorPicker.ObserveListenFunction} notify 리스너 메서드
 */

 /**
 * 색상 선택기 옵저버 리스너
 * @typedef {(AbColorPicker.ObserveListenFunction|AbColorPicker.ObserveListenObject)}
 * AbColorPicker.ObserveListener
 */

//----------------------------------------------------------------------------------------------------------
// 색상 선택기
//----------------------------------------------------------------------------------------------------------

/**
 * 색상 선택기
 * <p>* 이 툴은 MDN의 Color picker tool({@link https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Colors/Color_picker_tool})을 변형했습니다.
 * @class
 * @source https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Colors/Color_picker_tool
 * @see {@link https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Colors/Color_picker_tool} MDN 참고 자료
 * @param {Object} [options] 옵션
 * @param {String} [options.viewStyle] 표시 스타일 (window=창 형태, fix=다른 UI에 삽입되는 형태)
 * @param {*} [options.token] Notify 시 전달할 데이터
 * @param {Object} [options.selector=#picker] 색상 선택기 HTML 엘리먼트 선택자
 * @param {(String|AbColorPicker.ColorInitial)} [options.color] 초기 색상 정보 (문자열이면 {@link HEX_Color})
 */
function AbColorPicker (options){
	if(!options) options = {};

	//-----------------------------------------------------------

	/**
	 * 표시 스타일 (window=창 형태, fix=다른 UI에 삽입되는 형태)
	 * @type {String}
	 */
	this.viewStyle = options.viewStyle || 'window';

	//-----------------------------------------------------------

	/**
	 * Notify 시 전달할 데이터
	 * @type {*}
	 */
	this.token = options.token || null;

	//-----------------------------------------------------------

	/**
	 * 색상 선택기 HTML 엘리먼트 선택자
	 * @type {String}
	 */
	this.selector = options.selector || '#picker';
	/**
	 * 색상 선택기 jQueryObject
	 * @type {jQueryObject}
	 */
	this.e = $(this.selector);
	this.epicker = this.e.find('.ui-color-picker');
	this.esample = this.e.find('.sample-boxes');
	this.euser = this.e.find('.user-boxes');

	//-----------------------------------------------------------

	this.pickingArea = null;
	this.picker = null;

	this.hueArea = null;
	this.huePicker = null;

	this.alphaArea = null;
	this.alphaMask = null;
	this.alphaPicker = null;

	this.previewColor = null;

	//-----------------------------------------------------------

	/**
	 * 사용자 선택 색상 인덱스
	 * @private
	 */
	this.userBoxIndex = -1;

	//-----------------------------------------------------------

	/**
	 * 색상 정보
	 * @private
	 */
	this.color = {
		type: 'RGB',

		h: 0, s: 0, l: 0, v: 0,
		r: 0, g: 0, b: 0, a: 1,

		locka: false,
		bka: 1,

		/**
		 * 색상을 설정합니다.
		 * <table>
		 * <thead>
		 * <tr>
		 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>인자4</th><th>비고</th>
		 * </tr>
		 * </thead>
		 * <tbody>
		 * <tr>
		 * 	<td>1개</td><td>color: {@link HEX_Color}</td><td></td><td></td><td></td><td></td><td>RGB 색상 설정</td>
		 * </tr>
		 * <tr>
		 * 	<td>4개</td><td>&quot;HSL&quot;</td><td>h: Number</td><td>s: Number</td><td>l: Number</td><td></td><td>HSL 색상 설정</td>
		 * </tr>
		 * <tr>
		 * 	<td>4개</td><td>&quot;HSV&quot;</td><td>h: Number</td><td>s: Number</td><td>v: Number</td><td></td><td>HSV 색상 설정</td>
		 * </tr>
		 * <tr>
		 * 	<td>4개</td><td>&quot;RGB&quot;</td><td>r: Number</td><td>g: Number</td><td>b: Number</td><td></td><td>RGB 색상 설정</td>
		 * </tr>
		 * <tr>
		 * 	<td>5개</td><td>&quot;RGB&quot;</td><td>r: Number</td><td>g: Number</td><td>b: Number</td><td>a: Number</td><td>RGBA 색상 설정</td>
		 * </tr>
		 * </tbody>
		 * </table>
		 * @param {(HEX_Color|AbColorPicker.ColorType)} 0 색상 또는 색상 타입
		 * @param {Number} [1] (R|H)
		 * @param {Number} [2] (G|S)
		 * @param {Number} [3] (B|V|L)
		 * @param {Number} [4] 알파 (RGB 타입만 해당)
		 */
		set: function(){
			if (arguments.length == 1 && typeof arguments[0] == 'string'){
				var rgb = AbCss.color(arguments[0]);

				if (rgb){
					if (rgb.length == 4){
						if (this.locka !== false)
							this.bka = rgb[3];

						this.rgb(rgb[0],rgb[1],rgb[2],this.locka === false ? rgb[3] : this.locka);
					}else
						this.rgb(rgb[0],rgb[1],rgb[2],1);
				}				
			}else{
				switch(arguments[0]){
				case 'HSL':
					this.hsl(arguments[1],arguments[2],arguments[3]);
					break;
				case 'HSV':
					this.hsv(arguments[1],arguments[2],arguments[3]);
					break;
				case 'RGB':
					if (arguments.length == 5){
						if (this.locka !== false)
							this.bka = arguments[4];
						
						this.rgb(arguments[1],arguments[2],arguments[3],this.locka === false ? arguments[4] : this.locka);
					}else
						this.rgb(arguments[1],arguments[2],arguments[3]);
					break;
				}
			}
		},

		hsl: function (){
			if (arguments.length){
				this.type = 'HSL';
				this.h = arguments[0]; this.s = arguments[1]; this.l = arguments[2];

				this.from('HSL');
			}
			return { h: this.h, s: this.s, l: this.l };
		},
		hsv: function (){
			if (arguments.length){
				this.type = 'HSV';
				this.h = arguments[0]; this.s = arguments[1]; this.v = arguments[2];

				this.from('HSV');
			}
			return { h: this.h, s: this.s, v: this.v };
		},
		rgb: function (){
			if (arguments.length){
				this.type = 'RGB';
				this.r = arguments[0]; this.g = arguments[1]; this.b = arguments[2];
				if (arguments.length >= 4) {
					if (this.locka !== false)
						this.bka = arguments[3];
					this.a = this.locka === false ? arguments[3] : this.locka;
				}else this.a = 1;

				this.from('RGB');
			}
			return { r: this.r, g: this.g, b: this.b, a: this.a };
		},

		from: function (type){
			var tmp = null, rgb = null;
			switch(type){
			case 'HSL':
				rgb = AbColor.hsv2rgb(this.h, this.s / 100, this.l / 100);
				tmp = AbColor.rgb2hsv(rgb[0], rgb[1], rgb[2]);
				//this.h = tmp[0]; this.s = tmp[1] * 100;
				this.v = this.round(tmp[2] * 100);
		
				this.r = this.round(rgb[0]); this.g = this.round(rgb[1]); this.b = this.round(rgb[2]);
				break;
			case 'HSV':
				rgb = AbColor.hsv2rgb(this.h, this.s / 100, this.v / 100);
				tmp = AbColor.rgb2hsl(rgb[0], rgb[1], rgb[2]);
				//this.h = tmp[0]; this.s = tmp[1] * 100;
				this.l = this.round(tmp[2] * 100);
	
				this.r = this.round(rgb[0]); this.g = this.round(rgb[1]); this.b = this.round(rgb[2]);
				break;
			case 'RGB':
				tmp = AbColor.rgb2hsl(this.r, this.g, this.b);
				//this.h = this.round(tmp[0]); this.s = this.round(tmp[1] * 100);
				this.l = this.round(tmp[2] * 100);

				tmp = AbColor.rgb2hsv(this.r, this.g, this.b);
				this.h = this.round(tmp[0]); this.s = this.round(tmp[1] * 100); this.v = this.round(tmp[2] * 100);
				break;
			}
		},

		round: function (x) { return Math.round(x); },

		hex: function (){
			var rgb = this.rgb();
			return AbCss.hex(rgb.r, rgb.g, rgb.b);
		},

		color: function (){
			var rgb = this.rgb();
			if (this.a | 0 === 1)
				return AbCss.hex(rgb.r, rgb.g, rgb.b);
			return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ',' + this.a + ')';
		},
	};

	//-----------------------------------------------------------

	this.createPickingArea();
	this.createHueArea();

	this.topics = {};

	this.newInputComponent('H', 'hue', this.inputChangeHue.bind(this));
	this.newInputComponent('S', 'saturation', this.inputChangeSaturation.bind(this));
	this.newInputComponent('V', 'value', this.inputChangeValue.bind(this));

	this.createAlphaArea();

	this.newInputComponent('R', 'red', this.inputChangeRed.bind(this));
	this.newInputComponent('G', 'green', this.inputChangeGreen.bind(this));
	this.newInputComponent('B', 'blue', this.inputChangeBlue.bind(this));

	this.createPreviewBox();

	this.newInputComponent('투명도', 'alpha', this.inputChangeAlpha.bind(this));
	this.newInputComponent('hexa', 'hexa', this.inputChangeHexa.bind(this));

	this.generateColorBoxes();

	this.attachControlPanelEvents();

	/**
	 * 옵저버 리스너 목록
	 * @private
	 * @type {Array.<AbColorPicker.ObserveListener>}
	 */
	this.observers = [];

	if (options.color){
		if (typeof options.color == 'string'){
			this.setColor(options.color);
		}else if (typeof options.color.type == 'string' && $.isArray(options.color.value)){
			var a = [options.color.type];
			Array.prototype.push.apply(a, options.color.value);
			this.setColor.apply(this, a);
		}
	}else{
		this.setColor();
	}
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbColorPicker.prototype = {
	constructor: AbColorPicker,

	//-----------------------------------------------------------

	/**
	 * 기본 색상 테이블
	 * <dl>
	 * <dt>white</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #FFFFFF;">&nbsp;</div> #FFFFFF</dd>
	 * <dt>silver</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #c0c0c0;">&nbsp;</div> #c0c0c0</dd>
	 * <dt>gray</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #808080;">&nbsp;</div> #808080</dd>
	 * <dt>black</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #000000;">&nbsp;</div> #000000</dd>
	 * <dt>red</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #ff0000;">&nbsp;</div> #ff0000</dd>
	 * <dt>maroon</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #800000;">&nbsp;</div> #800000</dd>
	 * <dt>yellow</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #ffff00;">&nbsp;</div> #ffff00</dd>
	 * <dt>olive</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #808000;">&nbsp;</div> #808000</dd>
	 * <dt>lime</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #00ff00;">&nbsp;</div> #00ff00</dd>
	 * <dt>green</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #008000;">&nbsp;</div> #008000</dd>
	 * <dt>aqua</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #00ffff;">&nbsp;</div> #00ffff</dd>
	 * <dt>teal</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #008080;">&nbsp;</div> #008080</dd>
	 * <dt>blue</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #0000ff;">&nbsp;</div> #0000ff</dd>
	 * <dt>navy</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #000080;">&nbsp;</div> #000080</dd>
	 * <dt>pink</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #ffc0cb;">&nbsp;</div> #ffc0cb</dd>
	 * <dt>fuchsia</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #ff00ff;">&nbsp;</div> #ff00ff</dd>
	 * <dt>purple</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #800080;">&nbsp;</div> #800080</dd>
	 * <dt>mediumpurple</dt><dd><div style="display:inline-block; width: 30px; height: 30px; border: 1px solid #efefef; background-color: #9370db;">&nbsp;</div> #9370db</dd>
	 * </dl>
	 * @const
	 */
	COLORS: {
		white: '#FFFFFF',
		silver:'#c0c0c0',
		gray:'#808080',
		black: '#000000',
		red:'#ff0000',
		maroon:'#800000',
		yellow:'#ffff00',
		olive:'#808000',
		lime:'#00ff00',
		green:'#008000',
		aqua:'#00ffff',
		teal:'#008080',
		blue:'#0000ff',
		navy:'#000080',
		pink:'#ffc0cb',
		fuchsia:'#ff00ff',
		purple:'#800080',
		mediumpurple:'#9370db',
	},

	NUMS_USER_BOX: 14,

	//-----------------------------------------------------------

	/**
	 * 옵저버 리스너를 등록합니다.
	 * @param {AbColorPicker.ObserveListener} observer 리스너
	 */
	observe: function(observer){ this.observers.push(observer); },
	/**
	 * 옵저버 리스너를 제거합니다.
	 * @param {AbColorPicker.ObserveListener} observer 리스너
	 */
	stopObserve: function(observer){ this.observers.remove(observer); },
	
	/**
	 * 등록된 옵저버에 Notify합니다.
	 * @private
	 * @param {String} topic 토픽
	 * @param {String} [value] 값
	 */
	notifyObservers: function(topic, value){
		setTimeout(function(){
			var len = this.observers.length;
			for (var i=0; i < len; i++){
				var o = this.observers[i];

				if (typeof o == 'function')
					o(this, topic, value, this.token);
				else if (typeof o.notify == 'function')
					o.notify(this, topic, value, this.token);
		}}.bind(this), 0);
	},

	//-----------------------------------------------------------

	/**
	 * 색상 선택기 엘리먼트가 e에 포함되는 지 확인합니다.
	 * @param {jQueryObject} e 엘리먼트 jQueryObject
	 * @return {Boolean} 포함되면 true
	 */
	has: function (e) { return this.e.has(e).length > 0; },

	/**
	 * 색상 선택기 화면이 표시되는 지 확인합니다.
	 * @return {Boolean} 표시되면 true
	 */
	opened: function(){ return this.e.css('visibility') == 'visible'; },
	
	/**
	 * 색상 선택기 화면의 위치와 크기를 가져옵니다.
	 * @return {HTMLBounds} 화면 위치와 크기
	 */
	boundBox: function(){ return AbCommon.getBounds(this.e.get(0)); },
	/**
	 * 색상 선택기 화면의 크기를 가져옵니다.
	 * @return {Size} 화면 크기
	 */
	size: function() { return { width: this.e.width(), height: this.e.height() }; },

	/**
	 * 색상 선택기 화면을 표시합니다.
	 * <p>* viewStyle이 window 인 경우에만 수행합니다.
	 * @param {Number} x 절대 X좌표
	 * @param {Number} y 절대 Y좌표
	 * @param {Number} [zIndex=100] z위치
	 */
	open: function (x, y, zIndex){
		if (this.viewStyle === 'window'){
			if (typeof zIndex != 'number') zIndex = 100;
			this.e.css({
				left: x,
				top: y,
				zIndex: zIndex,
				visibility: 'visible'
			});

			this.notifyObservers('open');
		}
	},

	/**
	 * 색상 선택기 화면을 숨깁니다.
	 * <p>* viewStyle이 window 인 경우에만 수행합니다.
	 */
	close: function (){
		if (this.viewStyle === 'window' && this.opened()){
			this.e.css({
				zIndex: -1,
				visibility: 'hidden'
			});

			this.notifyObservers('close');
		}
	},

	/**
	 * 색상 선택 완료 처리
	 * @private
	 * @param {Boolean} notset 색상이 없는 지 여부
	 */
	confirm: function (notset){
		if (notset){
			this.notifyObservers('color', null);
			this.close();
			return;
		}

		var color = this.color.color();
		var boxes = this.cmd('color', this.euser);
		if (boxes.length){
			var divElement = null, box = null, c = null;
			var len = boxes.length;
			for (var i=0; i < len; i++){
				divElement = boxes.get(i);
				box = $(divElement);
				c = box.attr('color');
				if (!c){
					box.attr('color', color);
					box = box.children();
					box.css('background-color', color);

					this.notifyObservers('color', color);
					this.close();
					return;
				}else if (c == color){
					this.notifyObservers('color', color);
					this.close();
					return;
				}
			}

			this.userBoxIndex++;
			if (this.userBoxIndex >= this.NUMS_USER_BOX)
				this.userBoxIndex = 0;

			divElement = boxes.get(this.userBoxIndex);
			box = $(divElement);
			box.attr('color', color);
			box = box.children();
			box.css('background-color', color);

			this.notifyObservers('color', color);
			this.close();
		}
	},

	//-----------------------------------------------------------

	/**
	 * 알파값을 고정 하거나 고정된 알파값을 가져옵니다.
	 * @param {(Boolean|Number)} [value] 고정 알파값 또는 고정 여부
	 * @return {(Boolean|Number)} 고정된 알파값
	 * 
	 * @example <caption>알파를 고정할 때</caption>
	 * lockAlpha(0.5);
	 * 
	 * @example <caption>알파를 고정 해제할 때</caption>
	 * lockAlpha(false);
	 * 
	 * @example <caption>알파 고정값 확인</caption>
	 * var locked = lockAlpha() !== flase;
	 */
	lockAlpha: function(){
		if (arguments.length && (typeof arguments[0] == 'boolean' || (typeof arguments[0] == 'number' && arguments[0] >= 0 && arguments[0] <= 1))){
			this.color.locka = arguments[0];
			
			if (this.color.locka !== false){
				this.color.bka = this.color.a;
				this.color.a = this.color.locka;
			}else{
				this.color.a = this.color.bka;
			}

			this.updateAlphaPicker();
			this.notify('alpha', this.color.a);

			var e = this.topics['alpha'];
			if (e) e.attr('readonly', this.color.locka !== false);
		}
		return this.color.locka;
	},

	/**
	 * 색상없음 버튼 활성화 여부
	 * @private
	 * @type {Boolean}
	 * @default
	 */
	enabledNotset: true,

	/**
	 * 색상없음 버튼 활성화 여부를 설정하거나 가져옵니다.
	 * @param {Boolean} value 활성화 여부
	 * @return {Boolean} 활성화 여부
	 */
	enableNotset: function(){
		if (arguments.length){
			this.enabledNotset = arguments[0];

			if (this.enabledNotset) this.cmd('notset').show();
			else this.cmd('notset').hide();
		}
		return this.enabledNotset;
	},

	//-----------------------------------------------------------

	/**
	 * cmd 속성이 있는 엘리먼트를 탐색합니다.
	 * @private
	 * @param {String} name cmd명
	 * @param {jQueryObject} e 상위 엘리먼트 jQueryObject
	 * @return {jQueryObject} 엘리먼트 jQueryObject
	 */
	cmd: function (name, e){ if (!e) e = this.e; return e.find('[cmd="'+name+'"]'); },

	/**
	 * 버튼 이벤트를 처리합니다.
	 * @private
	 */
	attachControlPanelEvents: function (){
		this.cmd('ok').click(this, function(e){
			e.data.confirm();
		});

		this.cmd('cancel').click(this, function(e){
			e.data.close();
		});

		this.cmd('notset').click(this, function(e){
			e.data.confirm(true);
		});
	},

	/**
	 * 기본/사용자 선택 색상 버튼을 생성합니다.
	 * @private
	 */
	generateColorBoxes: function (){
		// create smaple color boxes
		if (this.esample.length){
			for (var p in this.COLORS){
				var c = this.COLORS[p];

				var box = $('<div class="box" cmd="color"/>');
				box.attr('color', c);
				box.css('background-color', c);

				this.esample.append(box);
			}
		}

		// create user box
		if (this.euser.length){
			for (var i=0; i < this.NUMS_USER_BOX; i++){
				var box = $('<div class="box" cmd="color"/>');
				var inbox = $('<div/>');
				
				box.append(inbox);
				this.euser.append(box);
			}
		}

		this.cmd('color').click(this, function (e){
			var color = $(this).attr('color');
			if (color)
				e.data.setColor(color);
		});
	},

	//-----------------------------------------------------------

	/**
	 * 마우스 트래킹을 설정합니다.
	 * @private
	 * @param {jQueryObject} e 트래킹 영역 엘리먼트 jQueryObject
	 * @param {jQueryEventHandler} callback 이벤트 핸들러
	 */
	setMouseTracking: function (e, callback){
		e.mousedown({ self: this, e: e, callback: callback}, function (e){
			e.data.callback(e);

			//console.log('[MOUSE][MOVE]');

			$(document).bind('mousemove', { self: e.data.self, e: e.data.e }, e.data.callback);
		});

		$(document).mouseup({ self: this, e: e, callback: callback}, function (e){
			//console.log('[MOUSE][UP]');
			$(document).unbind('mousemove', e.data.callback);
		});
	},

	/**
	 * 색상 선택 영역을 생성합니다.
	 * @private
	 */
	createPickingArea: function() {
		var area = $('<div/>');
		var picker = $('<div/>');

		area.addClass('picking-area');
		picker.addClass('picker');

		this.pickingArea = area;
		this.picker = picker;

		this.setMouseTracking(area, this.updateColor.bind(this));

		area.append(picker);
		this.epicker.append(area);
	},

	/**
	 * HUE 색상 선택 영역을 생성합니다
	 * @private
	 */
	createHueArea: function() {
		var area = $('<div/>');
		var picker = $('<div/>');

		area.addClass('hue');
		picker.addClass('slider-picker');

		this.hueArea = area;
		this.huePicker = picker;

		this.setMouseTracking(area, this.updateHueSlider.bind(this));

		area.append(picker);
		this.epicker.append(area);
	},

	/**
	 * 알파 색상 선택 영역을 생성합니다.
	 * @private
	 */
	createAlphaArea: function() {
		var area = $('<div/>');
		var mask = $('<div/>');
		var picker = $('<div/>');

		area.addClass('alpha');
		mask.addClass('alpha-mask');
		picker.addClass('slider-picker');

		this.alphaArea = area;
		this.alphaMask = mask;
		this.alphaPicker = picker;

		this.setMouseTracking(area, this.updateAlphaSlider.bind(this));

		area.append(mask);
		mask.append(picker);
		this.epicker.append(area);
	},

	/**
	 * 색상 미리보기를 생성합니다.
	 * @private
	 */
	createPreviewBox: function() {
		var previewBox = $('<div/>');
		var previewColor = $('<div/>');

		previewBox.addClass('preview');
		previewColor.addClass('preview-color');

		this.previewColor = previewColor;

		previewBox.append(previewColor);
		this.epicker.append(previewBox);
	},

	/**
	 * 입력 상자를 생성합니다.
	 * @private
	 * @param {String} title 타이틀
	 * @param {String} topic 토픽
	 * @param {jQueryEventHandler} onChangeFunc 이벤트 핸들러
	 * @return {jQueryObject} 생성된 입력 상자 영역
	 */
	newInputComponent: function (title, topic, onChangeFunc) {
		var wrapper = $('<div/>');
		var input = $('<input type="text"/>');
		var info = $('<span/>');

		wrapper.addClass('input');
		wrapper.attr('data-topic', topic);
		
		info.text(title);
		info.addClass('name');

		wrapper.append(info);
		wrapper.append(input);

		this.epicker.append(wrapper);

		input.change(this, onChangeFunc);
		input.click(this, function(e) {
			this.select();
		});

		this.topics[topic] = input;

		return wrapper;
	},

	/**
	 * 입력 상자에 데이터를 넣습니다.
	 * @private
	 * @param {String} topic 토픽
	 * @param {(Number|String)} value 데이터
	 */
	notify: function (topic, value){
		if (this.topics[topic]){
			this.topics[topic].val(value);
		}
	},

	/*************************************************************************/
	//					Updates properties of UI elements
	/*************************************************************************/

	/**
	 * 색상을 업데이트 합니다.
	 * @private
	 * @param {jQueryEventObject} e jQuery 이벤트 객체
	 */
	updateColor: function (e) {
		var offset = this.pickingArea.offset();

		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;
		var picker_offset = 5;

		// width and height should be the same
		var size = this.pickingArea.width();

		if (x > size) x = size;
		if (y > size) y = size;
		if (x < 0) x = 0;
		if (y < 0) y = 0;

		var value = 100 - (y * 100 / size) | 0;
		var saturation = x * 100 / size | 0;

		this.color.hsv(this.color.h, saturation, value);

		this.picker.css('left', x - picker_offset);
		this.picker.css('top', y - picker_offset);

		this.updateAlphaGradient();
		this.updatePreviewColor();

		this.notify('value', value);
		this.notify('saturation', saturation);

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);
		this.notify('hexa', this.color.hex());
	},

	/**
	 * HUE 색상을 업데이트합니다.
	 * @private
	 * @param {jQueryEventHandler} e jQuery 이벤트 객체
	 */
	updateHueSlider: function(e) {
		var offset = this.hueArea.offset();

		var x = e.pageX - offset.left;
		var width = this.hueArea.width();

		if (x < 0) x = 0;
		if (x > width) x = width;

		// TODO 360 => 359
		var hue = ((359 * x) / width) | 0;
		// if (hue === 360) hue = 359;

		this.updateSliderPosition(this.huePicker, x);

		this.setHue(hue);
	},

	/**
	 * 알파 색상을 업데이트합니다.
	 * @private
	 * @param {jQueryEventHandler} e jQuery 이벤트 객체
	 */
	updateAlphaSlider: function(e) {
		if (this.color.locka !== false)
			return;

		var offset = this.alphaArea.offset();

		var x = e.pageX - offset.left;
		var width = this.alphaArea.width();

		if (x < 0) x = 0;
		if (x > width) x = width;

		this.color.a = (x / width).toFixed(2);

		this.updateSliderPosition(this.alphaPicker, x);
		this.updatePreviewColor();

		this.notify('alpha', this.color.a);
	},

	/*************************************************************************/
	//						Update background colors
	/*************************************************************************/

	/**
	 * 색상 선택 영역의 배경을 업데이트합니다.
	 * @private
	 */
	updatePickerBackground: function() {
		var rgb = AbColor.hsv2rgb(this.color.h, 1, 1);
		this.pickingArea.css('background-color', AbCss.hex(rgb[0], rgb[1], rgb[2]));
	},

	/**
	 * 알파 선택 영역의 배경을 업데이트합니다.
	 * @private
	 */
	updateAlphaGradient: function() {
		this.alphaMask.css('background-color', this.color.hex());
	},

	/**
	 * 색상 미리보기 영역의 색상을 업데이트 합니다.
	 * @private
	 */
	updatePreviewColor: function() {
		//this.previewColor.css('background-color', this.color.color());
		var c = this.color.color();
		//console.log('[PREVIEW] ' + c);

		this.previewColor.css('background-color', c);
	},

	/**
	 * HUE 색상을 설정합니다.
	 * @private
	 * @param {Number} value 색상
	 */
	setHue: function(value) {
		if (typeof(value) !== 'number' || isNaN(value) === true ||
			value < 0 || value > 359)
			return;
		
		this.color.h = value;
		this.color.from('HSV');

		this.updatePickerBackground();
		this.updateAlphaGradient();
		this.updatePreviewColor();

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);
		this.notify('hexa', this.color.hex());
		this.notify('hue', this.color.h);

	},

	/**
	 * Updates when one of Saturation/Value/Lightness changes
	 * @private
	 */
	updateSLV: function() {
		this.updatePickerPosition();
		this.updateAlphaGradient();
		this.updatePreviewColor();

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);
		this.notify('hexa', this.color.hex());
	},

	/*************************************************************************/
	//				Update positions of various UI elements
	/*************************************************************************/

	/**
	 * 색상 선택자를 업데이트합니다.
	 * @private
	 */
	updatePickerPosition: function() {
		var size = this.pickingArea.width();
		var value = 0;
		var offset = 5;

		value = this.color.v;

		var x = (this.color.s * size / 100) | 0;
		var y = size - (value * size / 100) | 0;

		this.picker.css('left', x - offset);
		this.picker.css('top', y - offset);
	},

	/**
	 * 슬라이더의 위치를 변경합니다.
	 * @private
	 * @param {jQueryObject} e 
	 * @param {Number} pos
	 */
	updateSliderPosition: function(e, pos) {
		e.css('left', Math.max(pos - 3, -2));
	},

	/**
	 * HUE 선택자를 업데이트합니다.
	 * @private
	 */
	updateHuePicker: function() {
		var size = this.hueArea.width();
		var offset = 1;
		var pos = (this.color.h * size / 360 ) | 0;

		this.huePicker.css('left', pos - offset);
	},

	/**
	 * 알파 선택자를 업데이트합니다.
	 * @private
	 */
	updateAlphaPicker: function() {
		var size = this.alphaArea.width();
		var offset = 1;
		var pos = (this.color.a * size) | 0;

		this.alphaPicker.css('left', pos - offset);
		this.updatePreviewColor();
	},

	/*************************************************************************/
	//							Set Picker Properties
	/*************************************************************************/

	/**
	 * 현재 설정된 색상을 가져옵니다.
	 * @return {RGBA_Color_Function} 색상
	 */
	getColor: function () { return this.color.color(); },

	/**
	 * 색상을 설정합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>인자4</th><th>비고</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>1개</td><td>color: {@link HEX_Color}</td><td></td><td></td><td></td><td></td><td>RGB 색상 설정</td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>&quot;HSL&quot;</td><td>h: Number</td><td>s: Number</td><td>l: Number</td><td></td><td>HSL 색상 설정</td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>&quot;HSV&quot;</td><td>h: Number</td><td>s: Number</td><td>v: Number</td><td></td><td>HSV 색상 설정</td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>&quot;RGB&quot;</td><td>r: Number</td><td>g: Number</td><td>b: Number</td><td></td><td>RGB 색상 설정</td>
	 * </tr>
	 * <tr>
	 * 	<td>5개</td><td>&quot;RGB&quot;</td><td>r: Number</td><td>g: Number</td><td>b: Number</td><td>a: Number</td><td>RGBA 색상 설정</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {(HEX_Color|AbColorPicker.ColorType)} 0 색상 또는 색상 타입
	 * @param {Number} [1] (R|H)
	 * @param {Number} [2] (G|S)
	 * @param {Number} [3] (B|V|L)
	 * @param {Number} [4] 알파 (RGB 타입만 해당)
	 */
	setColor: function() {
		if (arguments.length)
			this.color.set.apply(this.color,arguments);

		this.updateHuePicker();
		this.updatePickerPosition();
		this.updatePickerBackground();
		this.updateAlphaPicker();
		this.updateAlphaGradient();
		this.updatePreviewColor();

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);

		this.notify('hue', this.color.h);
		this.notify('saturation', this.color.s);
		this.notify('value', this.color.v);

		this.notify('alpha', this.color.a);
		this.notify('hexa', this.color.hex());
	},

	/*************************************************************************/
	//						Update input elements
	/*************************************************************************/

	/**
	 * 값이 RGB 범위 내인지 검사합니다.
	 * @private
	 * @param {Number} value 값
	 */
	isValidRGBValue: function(value) {
		return (typeof(value) === 'number' && isNaN(value) === false &&
			value >= 0 && value <= 255);
	},

	/**
	 * 값이 HUE 범위 내인지 검사합니다.
	 * @private
	 * @param {Number} value 값
	 */
	isValidHueValue: function(value) {
		return (typeof(value) === 'number' && isNaN(value) === false &&
			value >= 0 && value <= 359);
	},

	/**
	 * 값이 퍼센트 범위 내인지 검사합니다.
	 * @private
	 * @param {NumBer} value 값
	 */
	isValidPercentValue: function(value) {
		return (typeof(value) === 'number' && isNaN(value) === false &&
			value >= 0 && value <= 100);
	},

	/**
	 * HUE 입력 내용을 UI에 반영합니다.
	 * @private
	 * @param {jQueryEventObject} e jQuery 이벤트 객체
	 */
	inputChangeHue: function(e) {
		var value = parseInt(e.target.value);
		if (!this.isValidHueValue(value)){
			e.target.value = this.color.h;
			return;
		}
		
		this.setHue(value);
		this.updateHuePicker();
	},

	/**
	 * Saturation 입력 내용을 UI에 반영합니다.
	 * @private
	 * @param {jQueryEventObject} e jQuery 이벤트 객체
	 */
	inputChangeSaturation: function(e) {
		var value = parseInt(e.target.value);
		if (!this.isValidPercentValue(value)){
			e.target.value = this.color.s;
			return;
		}

		this.color.s = value;
		this.color.from('HSV');

		this.updateSLV();
	},

	/**
	 * Value 입력 내용을 UI에 반영합니다.
	 * @private
	 * @param {jQueryEventObject} e jQuery 이벤트 객체
	 */
	inputChangeValue: function(e) {
		var value = parseInt(e.target.value);
		if (!this.isValidPercentValue(value)){
			e.target.value = this.color.v;
			return;
		}

		this.color.v = value;
		this.color.from('HSV');
		
		this.updateSLV();
	},

	/**
	 * Red 입력 내용을 UI에 반영합니다.
	 * @private
	 * @param {jQueryEventObject} e jQuery 이벤트 객체
	 */
	inputChangeRed: function(e) {
		var value = parseInt(e.target.value);
		if (!this.isValidPercentValue(value)){
			e.target.value = this.color.r;
			return;
		}
		
		this.color.r = value;
		this.color.from('RGB');
		
		this.setColor();
	},

	/**
	 * Green 입력 내용을 UI에 반영합니다.
	 * @private
	 * @param {jQueryEventObject} e jQuery 이벤트 객체
	 */
	inputChangeGreen: function(e) {
		var value = parseInt(e.target.value);
		if (!this.isValidPercentValue(value)){
			e.target.value = this.color.g;
			return;
		}
		
		this.color.g = value;
		this.color.from('RGB');
		
		this.setColor();
	},

	/**
	 * Blue 입력 내용을 UI에 반영합니다.
	 * @private
	 * @param {jQueryEventObject} e jQuery 이벤트 객체
	 */
	inputChangeBlue: function(e) {
		var value = parseInt(e.target.value);
		if (!this.isValidPercentValue(value)){
			e.target.value = this.color.b;
			return;
		}
		
		this.color.b = value;
		this.color.from('RGB');
		
		this.setColor();
	},

	/**
	 * Alpha 입력 내용을 UI에 반영합니다.
	 * @private
	 * @param {jQueryEventObject} e jQuery 이벤트 객체
	 */
	inputChangeAlpha: function(e) {
		if (this.color.locka !== false){
			e.target.value = this.color.a;
			return;
		}

		var value = parseFloat(e.target.value);

		if (typeof value === 'number' && isNaN(value) === false &&
			value >= 0 && value <= 1)
			this.color.a = value.toFixed(2);

		e.target.value = this.color.a;

		this.updateAlphaPicker();
	},

	/**
	 * {@link HEX_Color} 입력 내용을 UI에 반영합니다.
	 * @private
	 * @param {jQueryEventObject} e jQuery 이벤트 객체
	 */
	inputChangeHexa: function(e) {
		var value = e.target.value;

		var rgb = AbCss.color(value);
		if (rgb){
			if (rgb.length == 4)
				this.color.rgb(rgb[0],rgb[1],rgb[2],rgb[3]);
			else
				this.color.rgb(rgb[0],rgb[1],rgb[2],1);
			this.setColor();
		}else{
			e.target.value = this.color.hex();
		}
	},

	/*************************************************************************/
	//							Tool
	/*************************************************************************/

};