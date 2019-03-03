/**
 * 메모 패드 도형
 * <p>* 도형의 위치와 크기는 옵션에 x/y/width/height 또는 x1/y1/x2/y2 중 택일하여 설정합니다.
 * @class
 * @param {Object} [options] 옵션
 * @param {AbIcons.Source} [options.source] 이미지 정보
 * @param {String} [options.name] 도형명
 * @param {Number} [options.angle] 회전 각도 (0~359)
 * @param {Number} [options.x] 도형 x좌표
 * @param {Number} [options.y] 도형 y좌표
 * @param {Number} [options.width] 도형 크기
 * @param {Number} [options.height] 도형 크기
 * @param {Number} [options.x1] 도형 시작점 X좌표
 * @param {Number} [options.y1] 도형 시작점 Y좌표
 * @param {Number} [options.x2] 도형 끝점 X좌표
 * @param {Number} [options.y2] 도형 끝점 Y좌표
 */
function AbShapeMemoPad(options){
	if (!options) options = {};
	var source = options.source || {};
	var sourceRender = source.render || {};
	var style = options.style || {};
	var strokeStyle = style.stroke || {};
	var textStyle = style.text || {};

	if (!source.data)
		throw new Error('[VECTOR-IMAGE] data is null or empty');

	if (!source.width || !source.height)
		throw new Error('[VECTOR-IMAGE] size(width, height) is not setted');

	/**
	 * 명칭
	 * @type {String}
	 * @default image
	 */
	this.name = 'memopad';		// name of shape
	/**
	 * 구분 (annotation=주석|masking=마스킹)
	 * @type {String}
	 * @default 
	 */
	this.type = 'annotation';	// annotation, masking
	/**
	 * 도형 유형 (shape|polygon|image)
	 * @type {String}
	 * @default
	 */
	this.shapeType = 'image';	// shape, polygon, image
	/**
	 * 도형 스타일 (box|line)
	 * @type {String}
	 * @default
	 */
	this.shapeStyle = 'box';	// box, line
	/**
	 * 도형 모드 (normal|private)
	 * <p>* 메모패드 등과 같은 도형의 처리를 위해 추가된 옵션으로, 값이 private 인 경우 엔진은 해당 도형 전용 편집 모드로 전환합니다.
	 * @type {String}
	 * @default
	 */
	this.editMode = 'private';
	/**
	 * 토큰 (예약)
	 * @private
	 * @type {String}
	 */
	this.token = null;			// for customize

	/**
	 * 선택 여부
	 * @private
	 * @type {Boolean}
	 */
	this.selected = false;
	/**
	 * 포커스 여부
	 * @private
	 * @type {Boolean}
	 */
	this.focused = false;

	/**
	 * 편집점 지시자 인스턴스
	 * @type {AbBoxEditIndicator}
	 */
	this.indicator = AbCommon.isDefined(AbBoxEditIndicator) ? new AbBoxEditIndicator({
		target: this,

		controls: {
			angle: false,
			leftTop: false,
			top: false,
			rightTop: false,
			left: false,
			right: false,
			leftBottom: false,
			bottom: false,
			rightBottom: false,
		},
	}) : null;

	/**
	 * 텍스트 내용
	 * <p>* 내용을 변경하면 measure()를 호출하세요
	 * @type {String}
	 */
	this.text = options.text || '';
	/**
	 * 텍스트 폭
	 * @type {Number}
	 * @private
	 */
	this.textWidth = 0;
	/**
	 * 텍스트 높이
	 * @type {Number}
	 * @private
	 */
	this.textHeight = 0;

	/**
	 * 회전 각도 (0~359)
	 * <p>* 이 도형은 회전각도를 조절할 수 없습니다.
	 * @type {Number}
	 */
	this.angle = options.angle || 0;

	/**
	 * 이미지 정보
	 * @type {AbIcons.Source}
	 */
	this.source = {
		data: source.data || '',
		width: source.width,
		height: source.height,
		
		render: {
			width: sourceRender.width || source.width,
			height: sourceRender.height || source.height
		},
	};

	if (AbCommon.allNumbers(options.x, options.y, options.width, options.height)){
		this.x = options.x;
		this.y = options.y;
		this.width = options.width;
		this.height = options.height;
	}else{
		var box = AbGraphics.box.rect(options.x1, options.y1, options.x2, options.y2);

		this.x = box.x;
		this.y = box.y;
		this.width = box.width;
		this.height = box.height;
	}

	/**
	 * 스타일 정보
	 * @type {AbShapeTextBox.Style}
	 */
	this.style = {
		stroke: {
			width: strokeStyle.width || 1,
			color: strokeStyle.color || '#5B522B',
		},

		text: {
			size: textStyle.size || '16px',
			font: textStyle.font || 'tahoma', // 맑은 고딕(Malgun Gothic), 굴림(gulim), 돋움(Dotum), Arial, Courier New, Times New Roman, Verdana, Helvetica, Tahoma
			italic: textStyle.italic || false,
			bold: textStyle.bold || false,
			cancel: textStyle.cancel || false,
			under: textStyle.under || false,
			color: textStyle.color || 'black',
			lineHeight: textStyle.lineHeight || 1.25,
			align: AbShapeTextBox.prototype.textAlign(textStyle.align, 'left'), // left, center, right, justify
		},

		color: style.color || 'rgba(254,238,176,1)' //'#FFE679',
	};
	
	// 내부 이미지 객체
	/**
	 * 이미지 로드 상태 문자열 또는 HTML 이미지 객체
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>자료형</th><th>값</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>String</td><td>loading</td><td>이미지를 로드중입니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>String</td><td>error</td><td>이미지 로드 중 오류가 발생했습니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>Image|HTMLImageElement</td><td></td><td>이미지를 준비했습니다.</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @private
	 * @type {(String|Image|HTMLImageElement)}
	 */
	this.$image = null;

	/**
	 * 도형 객체의 모드 (icon|textbox)
	 * @type {String}
	 */
	this.mode = 'icon';

	/**
	 * 메모 도형의 상태 정보
	 * @private
	 * @type {String}
	 */
	this.textboxStatus = 'ready';

	/**
	 * 메모 도형
	 * @private
	 * @type {AbShapeTextBox}
	 */
	this.textbox = new AbShapeTextBox({
		indicator: {
			controls: {
				angle: false,
				/*
				leftTop: false,
				top: false,
				rightTop: false,
				left: false,
				*/
			}
		},
	});

	this.prepare();
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeMemoPad.prototype = {
	constructor: AbShapeMemoPad,

	//-----------------------------------------------------------

	/**
	 * 현재 메모 도형이 표시되는 지 확인합니다.
	 * @return {Boolean}
	 */
	isTextBoxMode: function(){ return this.mode === 'textbox'; },

	//-----------------------------------------------------------

	// cloneShape 시 어드바이스
	/**
	 * 복제 어드바이스 정보를 가져옵니다.
	 * <p>* AbCommon.cloneShape() 시 사용됩니다.
	 * @return {AbCommon.CloneAdvice} 
	 */
	adviceClone: function(){
		return {
			//moveProps: ['$image'],
			
			customProps: ['$image', 'textbox'],
			
			custom: function(name, object){
				switch(name){
				case '$image':
					return $(object).clone().get(0);
				case 'textbox':
					return AbCommon.cloneShape(object);
				}
			},
		};
	},

	//-----------------------------------------------------------
	// 객체를 사용하기 위해 선 로드가 필요한 경우,
	// 엔진은 preload() 함수를 호출하고 대기한다.
	//-----------------------------------------------------------
	// prepare()는 객체 내부의 동기적 선행 작업을 해야 할때 사용되며,
	// preload()는 객체 내부의 비동기적 선행 작업을 해야 할때 사용된다.
	
	/**
	 * 비동기적 선행 작업을 진행합니다.
	 * <p>* 엔진은 초기화 작업 중 이 메서드의 작업이 완료될 떄까지 대기합니다.
	 * <dl>객체를 사용하기 위해 선행 준비 작업이 필요한 경우, 엔진은 preload() 함수를 호출하고 대기합니다.
	 * 	<dt>prepare()</dt><dd>객체 내부의 동기적 선행 작업을 해야 할때 사용됩니다.</dd>
	 * 	<dt>preload()</dt><dd>객체 내부의 비동기적 선행 작업을 해야 할때 사용됩니다.</dd>
	 * </dl>
	 * @param {ShapeObjectPreloadCallback} callback 콜백 함수
	 */
	preload: function(callback){
		if (this.$image || !this.source.data){
			callback('skip');
			return;
		}
		
		var renderWidth = this.source.width;
		var renderHeight = this.source.height;
		
		if (this.source.render && AbCommon.isNumber(this.source.render.width) && AbCommon.isNumber(this.source.render.height)){
			renderWidth = this.source.render.width;
			renderHeight = this.source.render.height;
		}
		
		AbCommon.loadImageExt(this.source.data, {
			width: renderWidth,
			height: renderHeight,
			
			success: function (img){
				this.$image = img;
				callback('ok');
			}.bind(this),
			
			error: function (e){
				console.log(e);
				
				this.$image = 'error';
				callback('error', e);
			}.bind(this),
		});
		
		this.$image = 'loading';
	},
	
	/**
	 * 필드 복제 전에 호출되는 메서드입니다.
	 * <p>* 이 메서드는 AbViewerEngine.createShape()에서 호출되는
	 * AbCommon.shapeProp()에서 필드를 복제 전 호출됩니다.
	 * @param {String} name 필드명
	 * @param {*} value 필드값
	 */
	cloneProperty: function(name, value){
		// 이미지 변경이 있는 지 확인하고,
		// 변경이 있다면, 내부 이미지 객체를 초기화한다.
		// 그러면, createShape() 메서드에서 preload()를 호출하고,
		// preload()에서 수정된 URL의 이미지 객체를 다시 생성할 수 있다.
		if (name === 'source.data'){
			if (value !== this.source.data)
				this.$image = null;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 도형의 스타일 편집 정보를 가져옵니다.
	 * @return {ShapeStyleEditInfo} 도형 스타일 편집 정보
	 */
	styleDesc: function(){
		return {
			select: [ 'color', 'stroke.width' ],
			descs: [
				{ name: 'color', text: '채우기색상', style: 'color', alpha: false, notset: false },
				{ name: 'stroke', text: '선 스타일', childs: [
					{ name: 'width', text: '두께', style: 'select', type: 'number', values: 'lineWidth' },
					{ name: 'color', text: '색상', style: 'color', alpha: false, notset: false },
				] },
				{ name: 'text', text: '글자 스타일', childs: [
					{ name: 'size', text: '크기', style: 'text', type: 'number-unit', unit: 'px', range: { start: 1 } },
					{ name: 'font', text: '글자모양', style: 'select', type: 'string', values: 'font' },
					{ name: 'italic', text: '기울림', style: 'check' },
					{ name: 'bold', text: '굵게', style: 'check' },
					{ name: 'under', text: '밑줄', style: 'check' },
					{ name: 'cancel', text: '취소선', style: 'check' },
					{ name: 'color', text: '색상', style: 'color', alpha: false, notset: false },
					{ name: 'lineHeight', text: '글자높이', style: 'text', type: 'number', unit: '%', range: { start: 10 } },
					{ name: 'align', text: '정렬', style: 'select', type: 'string', values: 'textAlign' },
				] },
			],
		};
	},

	//-----------------------------------------------------------

	/**
	 * 도형 준비작업을 수행합니다.
	 */
	prepare: function(){
		this.textboxStatus = 'ready';

		// 스타일 복사
		AbCommon.copyProp(this.style, this.textbox.style);

		this.textBoxPositioning();
	},
	/**
	 * 도형 정보를 초기화합니다.
	 */
	reset: function(){
		this.textbox.reset();
	},

	//-----------------------------------------------------------

	/**
	 * 도형 속성 정보를 XML 문자열로 가져옵니다.
	 * @return {String} XML 문자열
	 */
	serialize: function(){
		var serializer = new AbShapeSerializer();

		serializer.add('name', this.name);
		serializer.add('type', this.type);
		serializer.add('shapeType', this.shapeType);
		serializer.add('shapeStyle', this.shapeStyle);

		serializer.add('token', this.token);

		serializer.add('text', this.text);

		serializer.add('angle', this.angle);
		serializer.add('x', Math.round(this.x));
		serializer.add('y', Math.round(this.y));
		serializer.add('width', Math.round(this.width));
		serializer.add('height', Math.round(this.height));

		var source = serializer.addGroup('source');
		serializer.add(source, 'data', this.source.data);
		serializer.add(source, 'width', this.source.width);
		serializer.add(source, 'height', this.source.height);

		var render = serializer.addGroup(source, 'render');
		serializer.add(render, 'width', this.source.render.width);
		serializer.add(render, 'height', this.source.render.height);

		serializer.add('textPadding', this.textPadding);
		
		var style = serializer.addGroup('style');
		serializer.add(style, 'color', this.style.color);
		
		var stroke = serializer.addGroup(style, 'stroke');
		serializer.add(stroke, 'width', this.style.stroke.width);
		serializer.add(stroke, 'color', this.style.stroke.color);
		
		var text = serializer.addGroup(style, 'text');
		serializer.add(text, 'size', this.style.text.size);
		serializer.add(text, 'font', this.style.text.font);
		serializer.add(text, 'italic', this.style.text.italic);
		serializer.add(text, 'bold', this.style.text.bold);
		serializer.add(text, 'under', this.style.text.under);
		serializer.add(text, 'cancel', this.style.text.cancel);
		serializer.add(text, 'color', this.style.text.color);
		serializer.add(text, 'lineHeight', this.style.text.lineHeight);
		serializer.add(text, 'align', this.style.text.align);

		return serializer.serialize();

	},

	//-----------------------------------------------------------

	/**
	 * 메모 도형을 설정합니다.
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	createText: function (x, y){
		this.textbox.engine = this.engine;

		this.textbox.text = this.text || '';

		//this.textbox.notify('created', 0, 0, x, y);

		this.textbox.width = this.width || 0;
		this.textbox.height = this.height || 0;

		this.textbox.measure();
		//this.textbox.notify('measured');

		this.textWidth = this.textbox.textWidth;
		this.textHeight = this.textbox.textHeight;

	},

	//-----------------------------------------------------------

	/**
	 * 메모 패트 도형의 정보로 메모 도형의 위치 및 크기를 설정합니다.
	 */
	textBoxPositioning: function(){
		var c = this.center();
		var p = AbGraphics.angle.point(this.angle, c.x, c.y, this.x, this.y);

		var angle = this.angle;
		var cp = AbGraphics.angle.point(angle, 0, 0, this.width >> 1, this.height >> 1);

		c.x = p.x + cp.x;
		c.y = p.y + cp.y;

		p = AbGraphics.angle.point(-angle, c.x, c.y, p.x, p.y);

		this.textbox.setAngle(this.angle);
		this.textbox.text = this.text;
		this.textbox.x = p.x;
		this.textbox.y = p.y;
		this.textbox.width = this.width;
		this.textbox.height = this.height;
		this.textbox.textWidth = this.textWidth;
		this.textbox.textHeight = this.textHeight;
	},

	//-----------------------------------------------------------
	
	/**
	 * 도형에 전달된 Notify를 처리합니다.
	 * @param {String} cmd Command Text
	 */
	notify: function(cmd){
		//console.log('@@@@@ [MEMO][NOTIFY] ' + cmd, arguments, this);

		if (cmd == 'created'){
			this.text = '내용을 입력하세요';

			this.move(arguments[1], arguments[2]);

			//this.createText(arguments[1], arguments[2]);
		}else if (cmd == 'styling'){
			// 스타일 복사
			AbCommon.copyProp(this.style, this.textbox.style);
		}else if (cmd == 'styled'){
			//console.log('[STYLED] width=' + this.textbox.width + ', height=' + this.textbox.height);

			this.textbox.notify.apply(this.textbox, arguments);

			this.width = this.textbox.width;
			this.height = this.textbox.height;

			this.textWidth = this.textbox.textWidth;
			this.textHeight = this.textbox.textHeight;

			//console.log('\t', 'width=' + this.textbox.width + ', height=' + this.textbox.height);

		}else if (cmd == 'measured'){
			this.textbox.notify.apply(this.textbox, arguments);

			this.width = this.textbox.width;
			this.height = this.textbox.height;

			this.textWidth = this.textbox.textWidth;
			this.textHeight = this.textbox.textHeight;

		}else if (cmd == 'resized'){
			//console.log('width: ' + this.textbox.width + ', height: ' + this.textbox.height);
		}else if (cmd == 'edit.in'){
			this.textbox.engine = this.engine;
			this.mode = 'textbox';
		}else if (cmd == 'edit.out'){
			this.textbox.engine = null;
			this.mode = 'icon';
		}else if (cmd == 'page.rotate'){ // 이미지 회전
			/*
			prevPageAngle: prevAngle,
			pageAngle: page.angle,
			stepDegree: stepDegree,
			prevPagePoint: pp,
			pagePoint: cp
			*/
			
			var args = arguments[1];

			var c = this.textbox.center();
			var ns = AbGraphics.rotate.shapePosByPage(
				args.prevPageAngle, args.pageAngle, args.stepDegree,
				args.prevPagePoint.x, args.prevPagePoint.y,
				args.pagePoint.x, args.pagePoint.y,
				this.textbox.x, this.textbox.y,
				c.x, c.y);

			this.textbox.box(ns.x, ns.y, this.textbox.width, this.textbox.height);
			//this.textbox.setAngle(AbGraphics.angle.increase(this.textbox.angle, args.stepDegree));
			this.textbox.setAngle(this.angle);

			this.width = this.textbox.width;
			this.height = this.textbox.height;

			this.textWidth = this.textbox.textWidth;
			this.textHeight = this.textbox.textHeight;

			//console.log('\t[MEMO]   ', this.box());
			//console.log('\t[TEXTBOX]', this.textbox.box());
		}else if (cmd == 'history'){
			var docmd = arguments[1];
			var topic = arguments[2];
			var page = arguments[3];

			if (topic === 'update'){
				this.textBoxPositioning();
			}
		}
	},

	//-----------------------------------------------------------

	/**
	 * 도형 생성 방법을 가져옵니다.
	 * @return {String} 생성 방법, click이면 클릭 시 고정된 크기의 도형을 생성합니다.
	 */
	creationStyle: function(){ return 'click'; },

	//-----------------------------------------------------------

	/**
	 * 도형의 회전 각도를 설정합니다.
	 * @param {Number} degree 각도
	 * @param {String} [option] 값이 relative면, 다른 도형에 의해 편집되는 도형을 말합니다.
	 */
	setAngle: function (degree, option){
		//console.log('[MEMO][ANGLE] ', arguments);

		if (option === 'relative') return;

		this.angle = degree;

		this.textbox.setAngle.apply(this.textbox, arguments);
	},

	/**
	 * 도형을 이동합니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @param {Number} [increase] x, y가 증감량인지 여부
	 */
	move: function(x, y, increase){
		//console.log('[MEMO][MOVE] ', arguments);

		if (increase === true){
			this.x += x;
			this.y += y;
		}else{
			this.x = x;
			this.y = y;
		}

		this.textbox.move.apply(this.textbox, arguments);
	},

	/**
	 * 도형의 상자 크기를 설정하거나 가져옵니다.
	 * @param {Number} [x1] 좌상단 X좌표
	 * @param {Number} [y1] 좌상단 Y좌표
	 * @param {Number} [x2] 우하단 X좌표
	 * @param {Number} [y2] 우하단 Y좌표
	 * @return {2Point} 인자가 없으면 크기를 리턴합니다.
	 */
	rect: function (){
		if (arguments.length == 4){
			//console.log('[MEMO][RECT] ', arguments);

			var box = AbGraphics.box.rect(arguments[0], arguments[1], arguments[2], arguments[3]);
			this.x = box.x;
			this.y = box.y;
			//this.width = box.width;
			//this.height = box.height;

			//if (this.isTextBoxMode()) this.textbox.rect.apply(this.textbox, arguments);

			//this.textbox.move(box.x, box.y);
		}else{
			return {
				x1: this.x,
				y1: this.y,
				x2: this.x + this.source.width,
				y2: this.y + this.source.height
			};
		}
	},

	/**
	 * 도형의 상자 크기를 설정하거나 가져옵니다.
	 * @param {Number} [x] X좌표
	 * @param {Number} [y] Y좌표
	 * @param {Number} [width] 폭
	 * @param {Number} [height] 높이
	 * @return {Box} 인자가 없으면 크기를 리턴합니다.
	 */
	box: function (){
		if (arguments.length == 4){
			//console.log('[MEMO][BOX] ', arguments);

			this.x = arguments[0];
			this.y = arguments[1];
			//this.width = arguments[2];
			//this.height = arguments[3];

			//if (this.isTextBoxMode()) this.textbox.box.apply(this.textbox, arguments);
		}else{
			return {
				x: this.x,
				y: this.y,
				width: this.source.width,
				height: this.source.height
			};
		}
	},

	/**
	 * 도형의 가장 자리 좌표를 가져옵니다.
	 * @return {Point}
	 */
	center: function (){ return { x: this.x + (this.source.width >> 1), y: this.y + (this.source.height >> 1) }; },
	
	/**
	 * 도형의 최소 크기를 가져옵니다.
	 * @return {Size}
	 */
	minimum: function() { return { width: this.source.width, height: this.source.height }; },

	//-----------------------------------------------------------

	/**
	 * 도형의 여백 정보를 가져옵니다. (도형과 지시자 사이의 여백 크기)
	 * @return {Rect}
	 */
	padding: function() { return { left: 0, top: 0, right: 0, bottom: 0 }; },

	/**
	 * 도형의 상자가 대상 점/상자와 충돌하는 지 검사합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>2개</td><td>x: Number</td><td>y: Number</td><td></td><td></td><td>도형 상자와 점의 충돌 검사</td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>도형 상자와 상자의 충돌 검사</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {Number} x 대상 점의 X좌표 또는 대상 상자의 X좌표
	 * @param {Number} y 대상 점의 Y좌표 또는 대상 상자의 Y좌표
	 * @param {Number} [w] 대상 상자의 폭
	 * @param {Number} [h] 대상 상자의 높이
	 * @return {Boolean} 충돌하면 true
	 */
	contains: function(x, y, w, h){
		if (this.isTextBoxMode()){
			return this.textbox.contains.apply(this.textbox, arguments);
		}
		return this.indicator.contains.apply(this.indicator, arguments);
	},

	/**
	 * 좌표에 맞는 도형의 편집점을 가져옵니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @return {String} 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 */
	editable: function (x, y){
		if (this.isTextBoxMode()){
			this.linkStates();
			return this.textbox.editable.apply(this.textbox, arguments);
		}
		if (this.selected) return this.indicator.editable(x, y); return null;
	},

	/**
	 * 편집접에 대한 좌표를 가져옵니다.
	 * @param {String} point 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 * @return {Point} 편집점 좌표
	 */
	editPos: function (point){
		if (this.isTextBoxMode())
			return this.textbox.editPos.apply(this.textbox, arguments);
		return this.indicator.editPos(point);
	},

	/**
	 * 도형을 회전하거나 위치 및 크기를 설정합니다.
	 * @param {String} point 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 * @param {Number} px X좌표
	 * @param {Number} py Y좌표
	 * @param {String} [option] 값이 relative면, 다른 도형에 의해 편집되는 도형을 말합니다.
	 */
	resize: function (point, px, py, option){
		if (option === 'relative') return;

		//console.log('[MEMO][RESIZE] ', arguments);

		if (this.isTextBoxMode()){
			var page = this.engine.currentPage;
			var cp = AbGraphics.angle.correctDisplayCoordinate(page.angle, this.source.width, this.source.height, false);
			var r = this.textbox.resize.apply(this.textbox, arguments);
			var c = this.textbox.center();
			var p = AbGraphics.angle.point(this.textbox.angle, c.x, c.y, this.textbox.x, this.textbox.y);

			this.x = p.x + cp.x;
			this.y = p.y + cp.y;

			this.width = this.textbox.width;
			this.height = this.textbox.height;

			this.textWidth = this.textbox.textWidth;
			this.textHeight = this.textbox.textHeight;

			return r;
		}
		return this.indicator.resize(point, px, py);
	},

	/**
	 * 도형 크기를 측정합니다.
	 */
	measure: function(){
		if (this.textboxStatus === 'ready'){
			this.createText(this.x, this.y);
		}else{
			this.textbox.measure();

			this.width = this.textbox.width;
			this.height = this.textbox.height;

			this.textWidth = this.textbox.textWidth;
			this.textHeight = this.textbox.textHeight;
		}
	},

	/**
	 * 도형 객체가 라인 충돌 판정에 대한 범위를 가져옵니다.
	 * @return {Number}
	 */
	validLineDistance: function () { return this.style.stroke && this.style.stroke.width ? this.style.stroke.width: 1; },

	//-----------------------------------------------------------

	/**
	 * 사용자가 텍스트 영역을 클릭했는지 확인합니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @return {Boolean} 텍스트 영역 안이면 true
	 */
	testInlineEdit: function (ctx, x, y){
		if (this.isTextBoxMode()){
			this.textbox.engine = this.engine;

			return this.textbox.testInlineEdit.apply(this.textbox, arguments);
		}
		return false;
	},

	/**
	 * 텍스트 편집을 시작합니다.
	 * @param {AbViewerEngine} engine 엔진 인스턴스
	 */
	inlineEdit: function(engine, endEdit){
		if (this.isTextBoxMode()){
			this.textbox.inlineEdit(engine, function(cmd, status){
				if (status === 'enter'){
					this.textbox.engine = this.engine;
				}else if (status === 'measured'){
					this.text = this.textbox.text;

					this.width = this.textbox.width;
					this.height = this.textbox.height;

					this.textWidth = this.textbox.textWidth;
					this.textHeight = this.textbox.textHeight;
				}

				if (typeof endEdit == 'function') endEdit(cmd, status);
			}.bind(this));
		}
	},

	//-----------------------------------------------------------

	linkStates: function (){
		this.textbox.focused = this.focused;
		this.textbox.selected = this.selected;
	},

	//-----------------------------------------------------------

	/**
	 * 도형을 그립니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {Boolean} [direct] 생성 중 그리기 여부, true면 생성 중 그리기
	 * @param {String} [mode] 드로잉 목적입니다. <p>* null이면 화면을 말하며, 이미지 생성은 image로 입력됩니다.
	 */
	draw: function(ctx, page, direct, mode){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;

		AbShapeTool.beginRectDraw(this, ctx, page);
		
		if (this.$image && this.$image !== 'error' && this.$image !== 'loading'){
			try
			{
				ctx.drawImage(this.$image, 0, 0, this.source.width * scaleX, this.source.height * scaleY);
			}
			catch (e)
			{
				console.log('[SHAPE-IMAGE] Drawing Error');
				console.log(e);
			}
		}

		AbShapeTool.endDraw(this, ctx, false);

		if (mode !== 'image' && this.isTextBoxMode()){
			this.linkStates();
			this.textbox.draw(ctx, page);
		}
	},

	drawIndicator: function (ctx, page){
		if (!this.isTextBoxMode()) this.indicator.draw(ctx);
	},
}