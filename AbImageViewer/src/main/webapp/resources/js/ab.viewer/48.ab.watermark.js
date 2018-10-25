/**
 * 워터마크 관리자 옵저버 리스너
 * @callback AbWaterMark.ObserveListenFunction
 * @param {AbWaterMark} sendor Notify한 객체
 * @param {String} topic 토픽
 * @param {*} value 값
 */

 /**
 * 워터마크 관리자 옵저버 리스너 객체
 * @typedef AbWaterMark.ObserveListenObject
 * @property {AbWaterMark.ObserveListenFunction} waterMarkNotify 리스너 메서드
 */

/**
 * 워터마크 관리자 옵저브 리스너
 * @typedef {(AbWaterMark.ObserveListenFunction|AbWaterMark.ObserveListenObject)}
 * AbWaterMark.ObserveListener 
 */

/**
 * 위치
 * <p>* 형식: HORIZ + " " + VERT
 * <ul>
 * 	<li>HORIZ
 * 	<table>
 * 	<thead>
 * 	<tr><th>값</th><th>설명</th></tr>
 * 	</thead>
 * 	<tbody>
 * 	<tr><td>left</td><td>왼쪽</td></tr>
 * 	<tr><td>center</td><td>중앙</td></tr>
 * 	<tr><td>right</td><td>오른쪽</td></tr>
 * 	</tbody>
 * 	</table>
 * 	</li>
 * 	<li>VERT
 * 	<table>
 * 	<thead>
 * 	<tr><th>값</th><th>설명</th></tr>
 * 	</thead>
 * 	<tbody>
 * 	<tr><td>top</td><td>상단</td></tr>
 * 	<tr><td>middle</td><td>중단</td></tr>
 * 	<tr><td>bottom</td><td>하단</td></tr>
 * 	</tbody>
 * 	</table>
 * 	</li>
 * </ul>
 * @typedef {String} AbWaterMark.Position
 */

/**
 * 워터마크 관리자
 * @class
 * @param {Object} [options] 옵션
 * @param {AbWaterMark.Position} [options.position] 위치
 * @param {Number} [options.angle=0] 회전 각도 (0~359)
 * @param {Number} [options.alpha=0.1] 투명도 (0~1)
 * @param {Number} [options.ratio=0.5] {@link AbPage|페이지} 이미지의 크기 대비 워터마크의 비율 (0~1)
 * @param {Rect} [options.margin] 마진
 * @param {Object} [options.style] 스타일 정보
 * @param {Object} [options.style.text] 글꼴 스타일 정보
 * @param {Length_Value} [options.style.text.size=64px] 글꼴 크기
 * @param {String} [options.style.text.font=tahoma] 글꼴
 * @param {Boolean} [options.style.text.italic=false] 기울림꼴 설정
 * @param {Boolean} [options.style.text.bold=false] 굵게 설정
 * @param {CSS_Color} [options.style.text.color=black] 색상 설정
 * @param {Number} [options.style.text.lineHeight=1.25] 줄 높이 설정
 */
function AbWaterMark(options){
	if (!options) options = {};
	var style = options.style || {};
	var boxStyle = style;
	var strokeStyle = boxStyle.stroke || {};
	var textStyle = style.text || {};

	/**
	 * 워터마크 소스
	 * @type {(String|Image|HTMLImageElement)}
	 * @private
	 */
	this.$source = null;
	/**
	 * 상태 정보 (ready|loading|loaded)
	 * @type {String}
	 * @private
	 */
	this.$status = 'ready'; // ready/loading/loaded
	/**
	 * 워터마크 타입 (text|image)
	 * @type {String}
	 * @private
	 */
	this.$type = 'text';	// text, image

	//-----------------------------------------------------------

	/**
	 * 위치 정보
	 * @type {AbWaterMark.Position}
	 * @private
	 */
	this.$position = options.position || 'center middle';	// left/center/right top/middle/bottom
	/**
	 * 회전 각도 (0~359)
	 * @type {Number}
	 * @private
	 */
	this.$angle = options.angle || 0;	// degree
	/**
	 * 투명도 (0~1)
	 * @type {Number}
	 * @private
	 */
	this.$alpha = options.alpha || 0.1;	// 0 ~ 1
	/**
	 * 투명도
	 * @type {Number}
	 * @private
	 */
	this.$ratio = AbCommon.isNumber(options.ratio) ? options.ratio : AbWaterMark.prototype.DEFAULT_RATIO; // 0 ~ 1
	/**
	 * 마진
	 * @type {Number}
	 * @private
	 */
	this.$margin = options.margin || { left: 0, top: 0, right: 0, bottom: 0 };
	/**
	 * 스타일 정보
	 * @type {Number}
	 * @property {Length_Value} size=64px 글꼴 크기
	 * @property {String} font=tahoma 글꼴
	 * @property {Boolean} italic=false 기울림꼴 설정
	 * @property {Boolean} bold=false 굵게 설정
	 * @property {CSS_Color} color=black 색상 설정
	 * @property {Number} lineHeight=1.25 줄 높이 설정
	 * @private
	 */
	this.$style = {
		text: {
			size: textStyle.size || '64px',
			font: textStyle.font || 'tahoma',
			italic: textStyle.italic || false,
			bold: textStyle.bold || false,
			color: textStyle.color || 'black',
			lineHeight: textStyle.lineHeight || 1.25,	
		},
	};

	//-----------------------------------------------------------

	/**
	 * 옵저브 리스너 목록
	 * @type {Array.<AbWaterMark.ObserveListener>}
	 * @private
	 */
	this.observers = [];
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbWaterMark.prototype = {
	constructor: AbWaterMark,

	//-----------------------------------------------------------

	DEFAULT_RATIO: 0.5,

	//-----------------------------------------------------------

	/**
	 * 옵저버 리스너를 등록합니다.
	 * @param {AbWaterMark.ObserveListener} observer 리스너
	 */
	observe: function(observer){ this.observers.push(observer); },
	/**
	 * 옵저버 리스너를 제거합니다.
	 * @param {AbWaterMark.ObserveListener} observer 리스너
	 */
	stopObserve: function(observer){
		var idx = this.observers.indexOf(observer);
		if (idx >= 0) this.observers.splice(idx, 1);
	},
	
	/**
	 * 등록된 옵저버에 Notify합니다.
	 * @param {String} topic 토픽
	 * @param {String} [value] 값
	 */
	notifyObservers: function(topic, value, element){
		this.exec(function(){
			var len = this.observers.length;
			for (var i=0; i < len; i++){
				var o = this.observers[i];

				if (typeof o == 'function')
					o(this, topic, value, element);
				else if (typeof o.waterMarkNotify == 'function')
					o.waterMarkNotify(this, topic, value, element);
			}
		});
	},

	//-----------------------------------------------------------

	/**
	 * 태스크 큐에 실행 함수를 등록합니다.
	 * @private
	 * @param {Function} func 실행 함수
	 * @param {Number} [delay=0] 실행 대기 시간
	 */
	exec: function(func, delay){
		if (!delay) delay = 0;
		setTimeout(func.bind(this), delay);
		//func.call(this);
	},

	//-----------------------------------------------------------

	/**
	 * 스타일 정보를 설정합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>3개</td><td>type: String</td><td>excludes: Array.&lt;String&gt;</td><td>obj: Object.&lt;String, *&gt;</td><td></td><td>obj 객체의 필드들을 스타일 필드로 복사합니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>type: String</td><td>excludes: Array.&lt;String&gt;</td><td>name: String</td><td>value: *</td><td>스타일의 name 필드를 value로 변경합니다.</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @private
	 * @param {String} type 스타일 필드명
	 * @param {Array.<String>} excludes 제외 필드 목록
	 * @param {(Object.<String,*>|String)} [args0] 객체 또는 필드명
	 * @param {*} [args1] 필드값
	 */
	$styling: function(type, excludes){
		var style = type == 'box' ? this.$style.box : type == 'stroke' ? this.$style.box.stroke : this.$style.text;
		var arg0 = null;
		if (arguments.length == 3){
			arg0 = arguments[2];
			if (AbCommon.isString(arg0)){
				if ($.inArray(arg0, excludes)>=0)
					return null;

				return style[arg0];
			}

			for (var p in arg0){
				if (arg0.hasOwnProperty(p) && $.inArray(p, excludes) < 0)
					style[p] = arg0[p];
			}
		}else if (arguments.length == 4){
			arg0 = arguments[2];
			var arg1 = arguments[3];

			style[arg0] = arg1;
		}
	},

	//-----------------------------------------------------------

	// /**
	//  * box 스타일을 설정합니다.
	//  * @ignore
	//  * @param {(Object.<String,*>|String)} 0 필드명 또는 객체
	//  * @param {*} [1] 필드값
	//  * 
	//  * @example <caption>겍체로 설정</caption>
	//  * waterMark.boxStyle({
	//  * 	color: 'red',
	//  * 	width: 2
	//  * });
	//  * 
	//  * @example <caption>필드별 설정</caption>
	//  * waterMark.boxStyle ('color', 'red');
	//  * waterMark.boxStyle ('width', 2);
	//  */
	// boxStyle: function (){
	// 	if (arguments.length == 1) return this.$styling('box', ['stroke'], arguments[0]);
	// 	else if (arguments.length == 2) return this.$styling('box', ['stroke'], arguments[0], arguments[1]);
	// },

	// /**
	//  * box의 외곽선 스타일을 설정합니다.
	//  * @ignore
	//  * @param {(Object.<String,*>|String)} 0 필드명 또는 객체
	//  * @param {*} [1] 필드값
	//  * 
	//  * @example <caption>겍체로 설정</caption>
	//  * waterMark.strokeStyle({
	//  * 	color: 'red',
	//  * 	width: 2
	//  * });
	//  * 
	//  * @example <caption>필드별 설정</caption>
	//  * waterMark.strokeStyle ('color', 'red');
	//  * waterMark.strokeStyle ('width', 2);
	//  */
	// strokeStyle: function (){
	// 	if (arguments.length == 1) return this.$styling('stroke', [], arguments[0]);
	// 	else if (arguments.length == 2) return this.$styling('stroke', [], arguments[0], arguments[1]);
	// },

	/**
	 * text 스타일을 설정합니다.
	 * @param {(Object.<String,*>|String)} 0 필드명 또는 객체
	 * @param {*} [1] 필드값
	 * 
	 * @example <caption>겍체로 설정</caption>
	 * waterMark.textStyle({
	 * 	font: 'verdana',
	 * 	bold: true
	 * });
	 * 
	 * @example <caption>필드별 설정</caption>
	 * waterMark.textStyle ('font', 'verdana');
	 * waterMark.textStyle ('bold', true);
	 */
	textStyle: function (){
		if (arguments.length == 1) return this.$styling('text', [], arguments[0]);
		else if (arguments.length == 2) return this.$styling('text', [], arguments[0], arguments[1]);
	},

	//-----------------------------------------------------------

	/**
	 * {@link AbPage|페이지} 이미지 크기 대비 워터마크의 비율을 설정하거나 가져옵니다.
	 * @param {Number} [value] 비율 (0~1)
	 * @return {Number} 비율
	 */
	ratio: function (value){
		if (arguments.length)
			this.$ratio = AbCommon.isNumber(value) ? value : AbWaterMark.prototype.DEFAULT_RATIO;
		return this.$ratio;
	},

	/**
	 * 회전 각도를 설정하거나 가져옵니다.
	 * @param {Number} [angle] 회전 각도 (0~359)
	 * @return {Number} 회전 각도
	 */
	angle: function (angle){
		if (arguments.length)
			this.$angle = AbGraphics.angle.increase(this.$angle, angle);
		return this.$angle;
	},

	/**
	 * 투명도를 설정하거나 가져옵니다.
	 * @param {Number} [angle] 투명도 (0~1)
	 * @return {Number} 투명도
	 */
	alpha: function (alpha){
		if (arguments.length)
			this.$alpha = alpha;
		return this.$alpha;
	},
	
	/**
	 * 위치를 설정하거나 가져옵니다.
	 * @param {AbWaterMark.Position} [angle] 위치
	 * @return {AbWaterMark.Position} 위치
	 */
	position: function (value){
		if (arguments.length)
			this.$position = value;
		return this.$position;
	},
	
	/**
	 * 마진을 설정하거나 가져옵니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>0개</td><td></td><td></td><td></td><td></td><td>마진을 가져옵니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>1개</td><td>margin: {@link Rect}</td><td></td><td></td><td></td><td>마진을 설정합니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>top: Number</td><td>right: Number</td><td>bottom: Number</td><td>left: Number</td><td>마진을 설정합니다.</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {(Rect|Number)} [0] {@link Rect} 또는 위쪽 여백
	 * @param {Number} [1] 오른쪽 여백
	 * @param {Number} [2] 아래쪽 여백
	 * @param {Number} [3] 왼쪽 여백
	 * @return {Rect} 마진
	 */
	margin: function (){
		if (arguments.length == 1){
			this.$margin = arguments[0];
		}else if (arguments.length == 4){
			this.$margin.top = arguments[0];
			this.$margin.right = arguments[1];
			this.$margin.bottom = arguments[2];
			this.$margin.left = arguments[3];
		}
		return this.$margin;
	},

	//-----------------------------------------------------------

	/**
	 * 워터마크 소스를 가져옵니다.
	 * @return {(String|Image|HTMLImageElement)}
	 */
	source: function() { return this.$source; },
	/**
	 * 워터마크 타입을 가져옵니다. (text|image)
	 * @return {String}
	 */
	type: function() { return this.$type; },
	/**
	 * 상태 정보를 가져옵니다. (ready|loading|loaded)
	 * @return {String}
	 */
	status: function() { return this.$status; },

	//-----------------------------------------------------------

	/**
	 * render를 Notify 합니다.
	 */
	render: function(){
		this.notifyObservers('render');
	},

	/**
	 * error를 Notify 합니다.
	 * @param {Error} e Error 객체
	 */
	error: function(e){
		console.log('[WATERMARK] ' + e);
		this.notifyObservers('error', e);
	},

	//-----------------------------------------------------------

	/**
	 * 워터마크를 문자열로 설정합니다.
	 * <p>* render를 Notify 합니다.
	 * @param {String} value 표시 문자열
	 */
	text: function(value){
		this.$source = value;
		this.$type = 'text';
		this.$status = 'loaded';

		this.render();
	},

	/**
	 * 워터마크를 이미지로 설정합니다.
	 * <p>* render를 Notify 합니다.
	 * @param {(Image|HTMLImageElement|AbImage|String)} value 이미지 객체 또는 이미지 URL
	 * @return {Promise} Promise 객체
	 * 
	 * @example <caption>이미지 URL</caption>
	 * promise = waterMark.image('img/watermark.png');
	 * 
	 * @example <caption>Image 객체</caption>
	 * var wimg = new Image();
	 * wimg.src = 'img/watermark.png';
	 * promise = waterMark.image(wimg);
	 * 
	 * @example <caption>HTMLImageElement 객체</caption>
	 * var wimg = $('<img/>');
	 * wimg.attr('src', 'img/watermark.png');
	 * promise = waterMark.image(wimg.get(0));
	 * 
	 * @example <caption>AbImage 객체</caption>
	 * var wimg = new AbImage({ image: 'img/watermark.png' });
	 * promise = waterMark.image(wimg);
	 */
	image: function(value){
		this.$source = null;
		this.$type = 'image';
		this.$status = 'loading';
		
		return new Promise(function (resolve, reject){
			if (value instanceof AbImage){
				value.image()
					.then(function (e){
						this.$source = e;
						this.$status = 'loaded';

						this.render();
						
						resolve();
					}.bind(this))
					.catch(function(e){
						this.error(e);
					}.bind(this));
			}else if (value instanceof Image){
				this.$source = value;
				this.$status = 'loaded';

				this.render();
				
				resolve();
			}else if (AbCommon.isString(value)){
				AbCommon.loadImage(value)
					.then(function (e){
						this.$source = e;
						this.$status = 'loaded';

						this.render();
						
						resolve();
					}.bind(this))
					.catch(function (e){
						this.error(e);
					}.bind(this));
			}else{
				this.$status = 'loaded';

				this.render();
				
				resolve();
			}
		}.bind(this));
	},

	//-----------------------------------------------------------

	/**
	 * 워터마크를 그릴 수 있는 지 확인합니다.
	 * @return {Boolean}
	 */
	drawable: function(){ return this.$source && this.$status == 'loaded'; },

	//-----------------------------------------------------------

	/**
	 * 텍스트 내용 크기 측정 결과
	 * @typedef {Object} AbWaterMark.MeasureTextResult
	 * @property {Array.<String>} lines 라인별 텍스트
	 * @property {Number} width 폭
	 * @property {Number} height 높이
	 * @property {Array.<Number>} lineWidths 라인별 텍스트 폭
	 * @property {Number} lineHeight 줄 높이 (=style.text.lineHeight)
	 */

	/**
	 * 텍스트 내용의 크기를 측정합니다.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {String} text 텍스트 내용
	 * @return {AbWaterMark.MeasureTextResult} 측정 결과
	 */
	measure: function(ctx, text){
		var a = text.replace(/\r/g, '').split('\n');
		var cnt = a.length, lineSize = [], w = 0, h = 0;
		var px = AbCss.pixel(this.$style.text.size);
		var lineHeight = px * this.$style.text.lineHeight;

		for (var i=0; i < cnt; i++){
			var line = a[i];

			var tm = ctx.measureText(line);
			txtWidth = Math.round(tm.width);
			lineSize.push(txtWidth);

			if (i == 0 || w < txtWidth) w = txtWidth;
			h += lineHeight;
		}

		return {
			lines: a,
			width: w,
			height: h,
			lineWidths: lineSize,
			lineHeight: lineHeight
		};
	},

	//-----------------------------------------------------------

	/**
	 * 텍스트 스타일을 설정합니다.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 */
	setFontSyle: function (ctx){
		var style = this.$style.text;
		
		var font = '';
		if (style.italic) font += 'italic ';
		if (style.bold) font += '700 ';
		if (style.size) font += style.size + ' ';
		if (style.font) font += style.font + ' ';

		ctx.lineWidth = 1;
		ctx.font = $.trim(font);
		//ctx.textBaseline = 'hanging';
		ctx.textBaseline = 'top';
	},

	//-----------------------------------------------------------

	/**
	 * 캔버스 크기 정보
	 * @typedef {Object} AbWaterMark.CanvasSize
	 * @property {Size} source 이미지의 크기
	 * @property {Size} view 뷰 화면의 크기
	 */

	/**
	 * 워터마크를 그립니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>3개</td><td>ctx: CanvasRenderingContext2D</td><td>scale: Number</td><td>canvas: {@link AbWaterMark.CanvasSize}</td><td></td><td></td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>ctx: CanvasRenderingContext2D</td><td>scale: Number</td><td>width: Number</td><td>height: Number</td><td></td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {Number} scale 확대/축소 비율
	 * @param {(Number|AbWaterMark.CanvasSize)} canvas 폭 또는 캔버스 크기 정보
	 * @param {Number} [height] 높이
	 */
	draw: function (ctx, scale, canvas){
		var drawable = false;
		
		if (arguments.length == 3)
			drawable = canvas && canvas.source && canvas.view && canvas.source.width && canvas.source.height && canvas.view.width && canvas.view.height;
		else if (arguments.length == 4){
			drawable = canvas && AbCommon.isNumber(canvas) && AbCommon.isNumber(arguments[3]);

			if (drawable)
				canvas = {
					source: { width: canvas, height: arguments[3] },
					view: { width: canvas, height: arguments[3] },
				};
		}

		if (drawable && this.drawable()){
			if (!AbCommon.isSetted(scale)) scale = 1;
		
			ctx.save();
			ctx.globalAlpha = this.$alpha;

			var m = null, mw = 0, mh = 0;
			var fr = null;
			var b = null;

			if (this.$type === 'text'){
				this.setFontSyle(ctx);

				m = this.measure(ctx, this.$source);
				mw = m.width * scale;
				mh = m.height * scale;
			}else if (this.$type === 'image'){
				mw = this.$source.width * scale;
				mh = this.$source.height * scale;
			}

			if (this.$angle)
				b = AbGraphics.angle.bounds(this.$angle, 0, 0, mw, mh);

			if (this.$ratio > 0){
				if (this.$type === 'text'){
				}

				var r = null;
				
				if (b != null)
					r = AbGraphics.box.zoom(b.width, b.height, canvas.source.width * this.$ratio, canvas.source.height * this.$ratio);
				else
					r = AbGraphics.box.zoom(mw, mh, canvas.source.width * this.$ratio, canvas.source.height * this.$ratio);

				fr = r;
				mw = mw * r.ratio;
				mh = mh * r.ratio;
			}

			var x = 0, y = 0;
			var pos = this.$position.split(' ');

			switch (pos[0]){
			case 'left':
				x = this.$margin.left;
				break;
			case 'center':
				x = (canvas.view.width - mw) >> 1;
				break;
			case 'right':
				x = width - mw - this.$margin.right;
				break;
			}
	
			switch (pos[1]){
			case 'top':
				y = this.$margin.top;
				break;
			case 'middle':
				y = (canvas.view.height - mh) >> 1;
				break;
			case 'bottom':
				y = height - mh - this.$margin.bottom;
				break;
			}

			if (this.$angle){
				var cpx = x + (mw >> 1), cpy = y + (mh >> 1);

				ctx.translate(cpx, cpy);
				ctx.rotate(AbGraphics.angle.deg2rad(this.$angle));
				ctx.translate(-cpx, -cpy);
			}

			if (this.$type === 'text'){
				var r = scale * fr.ratio;
				ctx.scale(r, r);

				x = x / r;
				y = y / r;
				
				// ctx.fillStyle = 'gold';
				// ctx.fillRect(x, y, m.width, m.height);

				ctx.fillStyle = this.$style.text.color;
				var cnt = m.lines.length;
				for (var i=0; i < cnt; i++){
					ctx.fillText(m.lines[i], x, y + (i * m.lineHeight));
				}

			}else if (this.$type === 'image'){
				ctx.drawImage(this.$source, x, y, mw, mh);
			}

			ctx.restore();
		}
	},
};