/**
 * 상자 도형 스타일 정보
 * @typedef {Object} AbShapeRectangle.Style
 * @property {CSS_Color} color=rgba(91,155,213,0.8) 배경 색상
 * @property {Object} stroke 외곽선 스타일 설정
 * @property {CSS_Color} stroke.color=#41719C 선 색상
 * @property {Number} stroke.width=1 선 굵기
 */

/**
 * 상자 도형
 * <p>* 도형의 위치와 크기는 옵션에 x/y/width/height 또는 x1/y1/x2/y2 중 택일하여 설정합니다.
 * @class
 * @param {Object} [options] 옵션
 * @param {Number} [options.angle] 회전 각도 (0~359)
 * @param {Number} [options.x] 도형 x좌표
 * @param {Number} [options.y] 도형 y좌표
 * @param {Number} [options.width] 도형 크기
 * @param {Number} [options.height] 도형 크기
 * @param {Number} [options.x1] 도형 시작점 X좌표
 * @param {Number} [options.y1] 도형 시작점 Y좌표
 * @param {Number} [options.x2] 도형 끝점 X좌표
 * @param {Number} [options.y2] 도형 끝점 Y좌표
 * @param {AbShapeRectangle.Style} [options.style] 스타일 정보
 */
function AbShapeRectangle(options){
	if (!options) options = {};
	var style = options.style || {};
	var strokeStyle = style.stroke || {};

	/**
	 * 명칭
	 * @type {String}
	 * @default
	 */
	this.name = 'rectangle';	// name of shape
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
	this.shapeType = 'shape';	// shape, polygon, image
	/**
	 * 도형 스타일 (box|line)
	 * @type {String}
	 * @default
	 */
	this.shapeStyle = 'box';	// box, line
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
	this.indicator = AbCommon.isDefined(AbBoxEditIndicator) ? new AbBoxEditIndicator({ target: this }) : null;

	/**
	 * 회전 각도 (0~359)
	 * @type {Number}
	 */
	this.angle = options.angle || 0;

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
	 * @type {AbShapeRectangle.Style}
	 */
	this.style = {
		stroke: {
			width: AbCommon.isNumber(strokeStyle.width) ? strokeStyle.width : 1,
			color: strokeStyle.color || '#41719C', //'#840200',
		},

		color: AbCommon.isDefined(style.color) ? style.color : 'rgba(91,155,213,0.8)', //'#FF0000',
	};
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeRectangle.prototype = {
	constructor: AbShapeRectangle,

	//-----------------------------------------------------------

	/**
	 * 도형의 스타일 편집 정보를 가져옵니다.
	 * @return {ShapeStyleEditInfo} 도형 스타일 편집 정보
	 */
	styleDesc: function(){
		return {
			select: [ 'color', 'stroke.width' ],
			descs: [
				{ name: 'color', text: '채우기색상', style: 'color' },
				{ name: 'stroke', text: '선 스타일', childs: [
					{ name: 'width', text: '두께', style: 'select', type: 'number', values: 'lineWidth' },
					{ name: 'color', text: '색상', style: 'color', alpha: false, notset: false },
				] },
			],
		};
	},

	//-----------------------------------------------------------

	/**
	 * 도형 준비작업을 수행합니다.
	 */
	prepare: function(){},
	/**
	 * 도형 정보를 초기화합니다.
	 */
	reset: function(){},

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

		serializer.add('angle', this.angle);
		serializer.add('x', Math.round(this.x));
		serializer.add('y', Math.round(this.y));
		serializer.add('width', Math.round(this.width));
		serializer.add('height', Math.round(this.height));

		var style = serializer.addGroup('style');
		serializer.add(style, 'color', this.style.color);
		
		if (this.style.stroke){
			var stroke = serializer.addGroup(style, 'stroke');
			serializer.add(stroke, 'width', this.style.stroke.width);
			serializer.add(stroke, 'color', this.style.stroke.color);
		}

		return serializer.serialize();
	},

	//-----------------------------------------------------------
	
	/**
	 * 도형에 전달된 Notify를 처리합니다.
	 * @param {String} cmd Command Text
	 */
	notify: function(cmd){},

	//-----------------------------------------------------------

	/**
	 * 도형의 회전 각도를 설정합니다.
	 * @param {Number} degree 각도
	 */
	setAngle: function (degree){ this.angle = degree; },

	/**
	 * 도형을 이동합니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @param {Number} [increase] x, y가 증감량인지 여부
	 */
	move: function(x, y, increase){
		if (increase === true){
			this.x += x;
			this.y += y;
		}else{
			this.x = x;
			this.y = y;
		}
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
			var box = AbGraphics.box.rect(arguments[0], arguments[1], arguments[2], arguments[3]);
			this.x = box.x;
			this.y = box.y;
			this.width = box.width;
			this.height = box.height;
		}else{
			return {
				x1: this.x,
				y1: this.y,
				x2: this.x + this.width,
				y2: this.y + this.height
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
			this.x = arguments[0];
			this.y = arguments[1];
			this.width = arguments[2];
			this.height = arguments[3];
		}else{
			return {
				x: this.x,
				y: this.y,
				width: this.width,
				height: this.height
			};
		}
	},

	/**
	 * 도형의 가장 자리 좌표를 가져옵니다.
	 * @return {Point}
	 */
	center: function (){ return { x: this.x + (this.width >> 1), y: this.y + (this.height >> 1) }; },
	/**
	 * 도형의 최소 크기를 가져옵니다.
	 * <p>* 기본값(단위: 픽셀): 10x10
	 * @return {Size}
	 */
	minimum: function() { return { width: 10, height: 10 }; },

	//-----------------------------------------------------------

	/**
	 * 도형의 여백 정보를 가져옵니다. (도형과 지시자 사이의 여백 크기)
	 * @return {Rect}
	 */
	padding: function() { return { left: 0, top: 0, right: 0, bottom: 0 }; },

	/**
	 * 도형의 상자가 대상 점/상자와 충돌하는 지 검사합니다.
	 * <p>* 배경색이 없는 경우, 외곽선과의 충돌을 검사합니다.
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
		var configValue = this.engine.selectionStyle(this.name);
		
		if (configValue === 'box'){
			return this.indicator.contains.apply(this.indicator, arguments);
		}else{
			if (this.style.color)
				return this.indicator.contains.apply(this.indicator, arguments);
			else
				return this.indicator.containsSide.apply(this.indicator, arguments);
		}
	},

	/**
	 * 좌표에 맞는 도형의 편집점을 가져옵니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @return {String} 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 */
	editable: function (x, y){ if (this.selected) return this.indicator.editable(x, y); return null; },

	/**
	 * 편집접에 대한 좌표를 가져옵니다.
	 * @param {String} point 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 * @return {Point} 편집점 좌표
	 */
	editPos: function (point){ return this.indicator.editPos(point); },

	/**
	 * 도형을 회전하거나 위치 및 크기를 설정합니다.
	 * @param {String} point 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 * @param {Number} px X좌표
	 * @param {Number} py Y좌표
	 */
	resize: function (point, px, py){ return this.indicator.resize(point, px, py); },

	/**
	 * 도형 크기를 측정합니다.
	 */
	measure: function(){},

	/**
	 * 도형 객체가 라인 충돌 판정에 대한 범위를 가져옵니다.
	 * @return {Number}
	 */
	validLineDistance: function () { return this.style.stroke && this.style.stroke.width ? this.style.stroke.width: 1; },

	//-----------------------------------------------------------

	/**
	 * 도형을 그립니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {Boolean} direct 생성 중 그리기 여부, true면 생성 중 그리기
	 */
	draw: function(ctx, page, direct){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;

		AbShapeTool.beginRectDraw(this, ctx, page);
		
		if (this.style.color){
			ctx.fillStyle = this.style.color;
			ctx.fillRect(0, 0, this.width * scaleX, this.height * scaleY);
		}

		if (this.style.stroke && this.style.stroke.width && this.style.stroke.color){
			ctx.strokeStyle = this.style.stroke.color;
			ctx.lineWidth = this.style.stroke.width;

			ctx.strokeRect(0, 0, this.width * scaleX, this.height * scaleY);
		}
		
		AbShapeTool.endDraw(this, ctx);
	},
}