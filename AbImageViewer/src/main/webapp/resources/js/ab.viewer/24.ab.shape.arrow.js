/**
 * 상자 도형 스타일 정보
 * @typedef {Object} AbShapeArrow.Style
 * @property {CSS_Color} color=#FF0000 선 색상
 * @property {Number} width=1 선 굵기
 * @property {String} dots=solid 선 무늬 (solid|dash|dot|dash-dot|dash-dot-dot)<p>* 참고: {@link AbShapeStyler#getDefaultValues}
 * @property {Object} head 화살표 머리 설정
 * @property {Number} head.size=14 화살표 머리 크기
 * @property {String} head.style=triangle 화살표 머리 모양 (triangle|diamond|circle|bracket|none)<p>* 참고: {@link AbShapeStyler#getDefaultValues}
 * @property {Object} tail 화살표 꼬리 설정
 * @property {Object} tail.size=14 화살표 꼬리 크기
 * @property {Object} tail.style=none 화살표 꼬리 모양 (triangle|diamond|circle|bracket|none)<p>* 참고: {@link AbShapeStyler#getDefaultValues}
 */

/**
 * 화살표 도형
* <p>* 선의 두 점은 옵션에 x/y/width/height 또는 x1/y1/x2/y2 중 택일하여 설정합니다.
  * @class
 * @param {Object} [options] 옵션
 * @param {Number} [options.x] 시작점 x좌표
 * @param {Number} [options.y] 시작점 y좌표
 * @param {Number} [options.width] 폭
 * @param {Number} [options.height] 높이
 * @param {Number} [options.x1] 시작점 X좌표
 * @param {Number} [options.y1] 시작점 Y좌표
 * @param {Number} [options.x2] 끝점 X좌표
 * @param {Number} [options.y2] 끝점 Y좌표
 * @param {AbShapeArrow.Style} [options.style] 스타일 정보
 */
function AbShapeArrow(options){
	if (!options) options = {};
	var style = options.style || {};
	var headStyle = style.head || {};
	var tailStyle = style.tail || {};

	/**
	 * 명칭
	 * @type {String}
	 * @default
	 */
	this.name = 'arrow';		// name of shape
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
	this.shapeStyle = 'line';	// box, line
	/**
	 * 토큰 (예약)
	 * @private
	 * @type {String}
	 */
	this.token = null;			// token for using	
	
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
	 * @type {AbLineEditIndicator}
	 */
	this.indicator = AbCommon.isDefined(AbLineEditIndicator) ? new AbLineEditIndicator({ target: this }) : null;

	if (AbCommon.allNumbers(options.x, options.y, options.width, options.height)){
		this.x1 = options.x;
		this.y1 = options.y;
		this.x2 = options.x + options.width;
		this.y2 = options.y + options.height;
	}else{
		this.x1 = options.x1;
		this.y1 = options.y1;
		this.x2 = options.x2;
		this.y2 = options.y2;
	}

	/**
	 * 회전 각도 (0~359)
	 * @type {Number}
	 */
	this.angle = 0;
	//console.log('[INIT][ANGLE] ' + this.angle);

	/**
	 * 스타일 정보
	 * @type {AbShapeArrow.Style}
	 */
	this.style = {
		width: style.width || 1,
		color: style.color || '#FF0000', //'#840200',
		dots: AbGraphics.canvas.dashStyle(style.dots, 'solid'), // solid, dash, dot, dash-dot, dash-dot-dot
		head: {
			//size: headStyle.size || 14 ,
			size: (headStyle.size || 14),
			style: this.arrowStyle(headStyle.style, 'triangle'), // triangle, diamond, circle, bracket, none
		},
		tail: {
			//size: tailStyle.size || 14,
			size: (tailStyle.size || 14),
			style: this.arrowStyle(tailStyle.style, 'none'), // triangle, diamond, circle, bracket, none
		},
	};

	this.prepare();
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeArrow.prototype = {
	constructor: AbShapeArrow,

	/**
	 * &lt; 모양의 크기
	 * @const
	 * @type {Number}
	 */
	BRACKET_SIZE: 0.4,

	//-----------------------------------------------------------

	/**
	 * 화살표 모양을 검증합니다
	 * @param {String} style 화살표 모양
	 * @param {String} defaultStyle 기본 화살표 모양<p>* 화살표 모양이 설정되지 않았거나 (triangle|diamond|circle|bracket|none)와 일치하지 않으면 설정됩니다.
	 * @return {String} 화살표 모양
	 */
	arrowStyle: function (style, defaultStyle){
		if (!style) return defaultStyle;

		switch (style){
		case 'triangle': case 'diamond': case 'circle': case 'bracket': case 'none': return style;
		}
		return defaultStyle;
	},

	//-----------------------------------------------------------

	/**
	 * 도형의 스타일 편집 정보를 가져옵니다.
	 * @return {ShapeStyleEditInfo} 도형 스타일 편집 정보
	 */
	styleDesc: function(){
		return {
			descs: [
				{ name: 'width', text: '두께', style: 'text', type: 'number-unit', range: { start: 1 } },
				{ name: 'color', text: '색상', style: 'color', notset: false },
				{ name: 'dots', text: '무늬', style: 'select', values: 'dots' },
				{ name: 'head', text: '머리', childs: [
					{ name: 'size', text: '크기', style: 'text', type: 'number', range: { start: 8, end: 30 } },
					{ name: 'style', text: '스타일', style: 'select', values: 'arrow' },
				] },
				{ name: 'tail', text: '꼬리', childs: [
					{ name: 'size', text: '크기', style: 'text', type: 'number', range: { start: 8, end: 30 } },
					{ name: 'style', text: '스타일', style: 'select', values: 'arrow' },
				] },
			],
		};
	},

	//-----------------------------------------------------------

	/**
	 * 선의 회전 각도를 계산합니다.
	 */
	prepare: function (){
		var center = this.center();
		this.angle = AbGraphics.angle.toShapeAngle(AbGraphics.angle.get(center.x, center.y, this.x2, this.y2));		
	},
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
		serializer.add('x1', this.round(this.x1));
		serializer.add('y1', this.round(this.y1));
		serializer.add('x2', this.round(this.x2));
		serializer.add('y2', this.round(this.y2));
		
		var style = serializer.addGroup('style');
		serializer.add(style, 'color', this.style.color);
		serializer.add(style, 'width', this.style.width);
		serializer.add(style, 'dots', this.style.dots);
		
		var head = serializer.addGroup(style, 'head');
		serializer.add(head, 'size', this.style.head.size);
		serializer.add(head, 'style', this.style.head.type);
		
		var tail = serializer.addGroup(style, 'tail');
		serializer.add(tail, 'size', this.style.tail.size);
		serializer.add(tail, 'style', this.style.tail.style);

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
	 * <p>* 회전 각도에 따라 두 점의 위치를 계산합니다.
	 * @param {Number} degree 각도
	 */
	setAngle: function (degree){
		var incAngle = degree - this.angle;
		this.angle = degree;

		var center = this.center();
		var p = AbGraphics.angle.point(incAngle, center.x, center.y, this.x1, this.y1);
		this.x1 = p.x;
		this.y1 = p.y;
		p = AbGraphics.angle.point(incAngle, center.x, center.y, this.x2, this.y2);
		this.x2 = p.x;
		this.y2 = p.y;
	},

	/**
	 * 도형을 이동합니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @param {Number} [increase] x, y가 증감량인지 여부
	 */
	move: function(x, y, increase){
		if (!increase){
			x = x - this.x1;
			y = y - this.y1;
		}
		this.x1 += x;
		this.y1 += y;
		this.x2 += x;
		this.y2 += y;
	},

	/**
	 * 두 점의 좌표를 설정하거나 가져옵니다.
	 * @param {Number} [x1] 좌상단 X좌표
	 * @param {Number} [y1] 좌상단 Y좌표
	 * @param {Number} [x2] 우하단 X좌표
	 * @param {Number} [y2] 우하단 Y좌표
	 * @return {2Point} 인자가 없으면 크기를 리턴합니다.
	 */
	rect: function (){
		if (arguments.length == 4){
			var x1 = arguments[0], y1 = arguments[1], x2 = arguments[2], y2 = arguments[3];
			
			this.x1 = x1;
			this.y1 = y1;
			this.x2 = x2;
			this.y2 = y2;

			var center = this.center();
			this.angle = AbGraphics.angle.toShapeAngle(AbGraphics.angle.get(center.x, center.y, this.x2, this.y2));
			//console.log('[RECT][ANGLE] ' + this.angle);					
		}else{
			return {
				x1: this.x1,
				y1: this.y1,
				x2: this.x2,
				y2: this.y2
			};
		}
	},

	/**
	 * 두 점을 상자 크기로 설정하거나 가져옵니다.
	 * @param {Number} [x] X좌표
	 * @param {Number} [y] Y좌표
	 * @param {Number} [width] 폭
	 * @param {Number} [height] 높이
	 * @return {Box} 인자가 없으면 크기를 리턴합니다.
	 */
	box: function (){
		if (arguments.length == 4){
			var x = arguments[0], y = arguments[1], w = arguments[2], h = arguments[3];

			this.x1 = x;
			this.y1 = y;
			this.x2 = this.x1 + w;
			this.y2 = this.y1 + h;

			var center = this.center();
			this.angle = AbGraphics.angle.toShapeAngle(AbGraphics.angle.get(center.x, center.y, this.x2, this.y2));
			//console.log('[BOX][ANGLE] ' + this.angle);					
		}else{
			return AbGraphics.box.rect(this.x1, this.y1, this.x2, this.y2);
		}
	},

	/**
	 * 도형의 가장 자리 좌표를 가져옵니다.
	 * @return {Point}
	 */
	center: function (){ return { x: this.x1 + ((this.x2 - this.x1) / 2), y: this.y1 + ((this.y2 - this.y1) / 2) }; },
	/**
	 * 복구 최소 크기를 가져옵니다.
	 * <p>* 복구 크기는 도형 추가 중 배경을 복구하는 영역의 크기를 말합니다.
	 * @return {Size} 크기
	 */
	restoreMinimumSize: function() {
		var siz = this.controlSize() << 1;
		//return AbGraphics.box.inflate(box.x, box.y, box.width, box.height, this.style.head.size, this.style.head.size);
		return { width: siz, height: siz };
	},

	//-----------------------------------------------------------

	/**
	 * 도형의 여백 정보를 가져옵니다. (도형과 지시자 사이의 여백 크기)
	 * @return {Rect}
	 */
	padding: function() {
		var pad = this.controlSize() >> 1;
		return { left: 0, top: pad, right: 0, bottom: pad };
	},
	/**
	 * 선과 대상 점/상자와 충돌하는 지 검사합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>2개</td><td>x: Number</td><td>y: Number</td><td></td><td></td><td>선과 점의 충돌 검사</td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>선과 상자의 충돌 검사</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {Number} x 대상 점의 X좌표 또는 대상 상자의 X좌표
	 * @param {Number} y 대상 점의 Y좌표 또는 대상 상자의 Y좌표
	 * @param {Number} [w] 대상 상자의 폭
	 * @param {Number} [h] 대상 상자의 높이
	 * @return {Boolean} 충돌하면 true
	 */
	contains: function(x, y, w, h){ return this.indicator.contains.apply(this.indicator, arguments); },
	/**
	 * 좌표에 맞는 도형의 편집점을 가져옵니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @return {String} 편집점 (A|LC|RC)
	 */
	editable: function (x, y){ if (this.selected){ return this.indicator.editable(x, y); } return null; },
	/**
	 * 편집접에 대한 좌표를 가져옵니다.
	 * @param {String} point 편집점 (A|LC|RC)
	 * @return {Point} 편집점 좌표
	 */
	editPos: function (point){ return this.indicator.editPos(point); },
	/**
	 * 선을 회전하거나 위치를 설정합니다.
	 * @param {String} point 편집점 (A|LC|RC)
	 * @param {Number} px X좌표
	 * @param {Number} py Y좌표
	 */
	resize: function (point, px, py){ return this.indicator.resize(point, px, py); },
	/**
	 * 도형 크기를 측정합니다.
	 */
	measure: function(){
		this.indicator.selectionStyle = this.engine.selectionStyle(this.name);
		this.indicator.selectionDrawStyle = this.engine.config('shape.selection.lineDrawStyle');
	},

	//-----------------------------------------------------------

	/**
	 * 화살표 머리의 크기를 가져옵니다.
	 * @return {Number}
	 */
	headSize: function() { return this.style.head.type != 'none' ? this.style.head.size : 0; },
	/**
	 * 화살표 꼬리의 크기를 가져옵니다.
	 * @return {Number}
	 */
	tailSize: function() { return this.style.tail.type != 'none' ? this.style.tail.size : 0; },
	/**
	 * 화살표 모양의 크기를 가져옵니다.
	 * @return {Number}
	 */
	controlSize: function() {
		var page = this.engine ? this.engine.currentPage : null;
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;

		var lineWidth = this.style.width;
		var headSize = this.headSize();
		if (headSize){
			headSize += lineWidth;
		}
		// switch (this.style.head.type){
		// case 'triangle': headSize += lineWidth;
		// }

		var tailSize = this.tailSize();
		if (tailSize){
			tailSize += lineWidth;
		}
		return Math.max(headSize, tailSize) * scaleX;
	},

	//-----------------------------------------------------------

	/**
	 * @private
	 * @param {*} x 
	 */
	round: function (x){ return Math.round(x); },

	//-----------------------------------------------------------

	/**
	 * 화살표 드로잉 정보
	 * @typedef {Object} AbShapeArrow.ArrowDrawInfo
	 * @property {2Point} lineRect 두 점 좌표
	 * @property {AbShapeArrow.CornerInfo} lineCorners 코너 정보
	 * @property {Number} distance 거리
	 * @property {String} style 화살표 모양
	 * @property {Number} size 화살표 크기
	 * @property {Number} lineWidth 선 굵기
	 * @property {Number} rad 선의 각도
	 * @property {Number} x X좌표
	 * @property {Number} y Y좌표
	 */

	/**
	 * 도형의 코너 정보
	 * @typedef {Object} AbShapeArrow.CornerInfo
	 * @property {Number} thickness 두께
	 * @property {Number} distance 거리
	 * @property {Number} rad 라디안 각도
	 * @property {Number} radWide 90도 라디안 각도 
	 * @property {2Point} rect 두 점 좌표
	 * @property {Point} leftTop 상자의 좌상단 좌표
	 * @property {Point} rightTop 상자의 우상단 좌표
	 * @property {Point} rightBottom 상자의 우하단 좌표
	 * @property {Point} leftBottom 상자의 좌하단 좌표
	 */

	/**
	 * 화살표 머리의 클립 영역의 경로를 생성합니다.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbShapeArrow.ArrowDrawInfo} d 화살표 드로잉 정보
	 */
	clipHeadArrow: function(ctx, d){
		var style = d.style;
		var halfSize = d.size ? d.size / 2 : 0;

		var points = [];

		if (style === 'triangle' || style === 'bracket'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - d.size,  d.y - halfSize);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - d.size,  d.y + halfSize);

			var s1 = AbGraphics.intersects.lines(p1.x, p1.y, p2.x, p2.y, d.lineCorners.leftTop.x, d.lineCorners.leftTop.y, d.lineCorners.rightTop.x, d.lineCorners.rightTop.y);
			var s2 = AbGraphics.intersects.lines(p2.x, p2.y, p3.x, p3.y, d.lineCorners.leftBottom.x, d.lineCorners.leftBottom.y, d.lineCorners.rightBottom.x, d.lineCorners.rightBottom.y);

			// ctx.moveTo(this.round(p1.x), this.round(p1.y));
			// ctx.lineTo(this.round(p2.x), this.round(p2.y));
			// //ctx.lineTo(this.round(s2.x), this.round(s2.y));

			// ctx.moveTo(d.lineCorners.leftTop.x, d.lineCorners.leftTop.y);
			// ctx.lineTo(d.lineCorners.rightTop.x, d.lineCorners.rightTop.y);

			points.push(s1);
			points.push(p2);
			points.push(s2);
		} else if (style === 'diamond' || style === 'circle'){
			var p1 = AbGraphics.rotate.point(d.rad, d.lineCorners.rightTop.x, d.lineCorners.rightTop.y, d.lineCorners.rightTop.x - halfSize,  d.lineCorners.rightTop.y);
			var p2 = AbGraphics.rotate.point(d.rad, d.lineCorners.rightBottom.x, d.lineCorners.rightBottom.y, d.lineCorners.rightBottom.x - halfSize,  d.lineCorners.rightBottom.y);

			// ctx.moveTo(this.round(p1.x), this.round(p1.y));
			// ctx.lineTo(this.round(p2.x), this.round(p2.y));

			points.push(p1);
			points.push(p2);
		}else{
			points.push(d.lineCorners.rightTop);
			points.push(d.lineCorners.rightBottom);
		}

		return points;
	},

	//-----------------------------------------------------------

	/**
	 * 화살표 꼬리의 클립 영역의 경로를 생성합니다.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbShapeArrow.ArrowDrawInfo} d 화살표 드로잉 정보
	 */
	clipTailArrow: function(ctx, d){
		var style = d.style;
		var halfSize = d.size ? d.size / 2 : 0;
		var clipAdjustSize = 0;

		var points = [];

		if (style === 'triangle' || style === 'bracket'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + d.size,  d.y - halfSize);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + d.size,  d.y + halfSize);

			var s1 = AbGraphics.intersects.lines(p1.x, p1.y, p2.x, p2.y, d.lineCorners.leftTop.x, d.lineCorners.leftTop.y, d.lineCorners.rightTop.x, d.lineCorners.rightTop.y);
			var s2 = AbGraphics.intersects.lines(p2.x, p2.y, p3.x, p3.y, d.lineCorners.leftBottom.x, d.lineCorners.leftBottom.y, d.lineCorners.rightBottom.x, d.lineCorners.rightBottom.y);

			// ctx.lineTo(this.round(s1.x), this.round(s1.y));
			// ctx.lineTo(this.round(p2.x), this.round(p2.y));
			// ctx.lineTo(this.round(s2.x), this.round(s2.y));

			points.push(s2);
			points.push(p2);
			points.push(s1);
		} else if (style === 'diamond' || style === 'circle'){
			var p1 = AbGraphics.rotate.point(d.rad, d.lineCorners.leftTop.x, d.lineCorners.leftTop.y, d.lineCorners.leftTop.x + halfSize,  d.lineCorners.leftTop.y);
			var p2 = AbGraphics.rotate.point(d.rad, d.lineCorners.leftBottom.x, d.lineCorners.leftBottom.y, d.lineCorners.leftBottom.x + halfSize,  d.lineCorners.leftBottom.y);

			// ctx.moveTo(this.round(p1.x), this.round(p1.y));
			// ctx.lineTo(this.round(p2.x), this.round(p2.y));

			points.push(p2);
			points.push(p1);
		}else{
			points.push(d.lineCorners.leftBottom);
			points.push(d.lineCorners.leftTop);
		}

		return points;
	},

	//-----------------------------------------------------------

	/**
	 * 화살표 머리를 그립니다.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbShapeArrow.ArrowDrawInfo} d 화살표 드로잉 정보
	 */
	drawHeadArrow: function(ctx, d){
		var style = d.style;
		var halfSize = d.size ? d.size / 2 : 0;

		if (style === 'triangle'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - d.size,  d.y - halfSize);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - d.size,  d.y + halfSize);

			ctx.moveTo(this.round(d.x), this.round(d.y));
			ctx.lineTo(this.round(p1.x), this.round(p1.y));
			ctx.lineTo(this.round(p2.x), this.round(p2.y));
			ctx.lineTo(this.round(p3.x), this.round(p3.y));
			ctx.lineTo(this.round(p1.x), this.round(p1.y));

			return {
				full: AbGraphics.rotate.pointByDistance(d.rad, d.size),
				half: AbGraphics.rotate.pointByDistance(d.rad, halfSize)
			};
		} else if (style === 'diamond'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - d.size,  d.y);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - halfSize,  d.y - halfSize);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p4 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - halfSize,  d.y + halfSize);

			ctx.moveTo(this.round(p1.x), this.round(p1.y));
			ctx.lineTo(this.round(p2.x), this.round(p2.y));
			ctx.lineTo(this.round(p3.x), this.round(p3.y));
			ctx.lineTo(this.round(p4.x), this.round(p4.y));
			ctx.lineTo(this.round(p1.x), this.round(p1.y));

			return {
				full: AbGraphics.rotate.pointByDistance(d.rad, d.size),
				half: AbGraphics.rotate.pointByDistance(d.rad, halfSize)
			};
		} else if (style === 'circle'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - halfSize, d.y);

			ctx.moveTo(this.round(p1.x + halfSize), this.round(p1.y));
			ctx.arc(this.round(p1.x), this.round(p1.y), halfSize, 0, 360);

			return {
				full: AbGraphics.rotate.pointByDistance(d.rad, d.size),
				half: AbGraphics.rotate.pointByDistance(d.rad, halfSize)
			};
		} else if (style === 'bracket'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - d.size,  d.y - halfSize);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - d.size,  d.y + halfSize);
			var p4 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - (d.size * AbShapeArrow.prototype.BRACKET_SIZE),  d.y);

			ctx.moveTo(this.round(d.x), this.round(d.y));
			ctx.lineTo(this.round(p1.x), this.round(p1.y));
			ctx.lineTo(this.round(p2.x), this.round(p2.y));
			ctx.lineTo(this.round(p3.x), this.round(p3.y));
			ctx.lineTo(this.round(p4.x), this.round(p4.y));
			ctx.lineTo(this.round(p1.x), this.round(p1.y));

			return {
				full: AbGraphics.rotate.pointByDistance(d.rad, d.size),
				half: AbGraphics.rotate.pointByDistance(d.rad, (d.size * AbShapeArrow.prototype.BRACKET_SIZE)),
			};
		}

		return {
			clip: { x: 0, y: 0 },
			full: { x: 0, y: 0 },
			half: { x: 0, y: 0 }
		};
	},

	//-----------------------------------------------------------

	/**
	 * 화살표 꼬리를 그립니다.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbShapeArrow.ArrowDrawInfo} d 화살표 드로잉 정보
	 */
	drawTailArrow: function(ctx, d){
		var style = d.style;
		var halfSize = d.size ? d.size / 2 : 0;

		if (style === 'triangle'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + d.size,  d.y - halfSize);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + d.size,  d.y + halfSize);

			ctx.moveTo(this.round(d.x), this.round(d.y));
			ctx.lineTo(this.round(p1.x), this.round(p1.y));
			ctx.lineTo(this.round(p2.x), this.round(p2.y));
			ctx.lineTo(this.round(p3.x), this.round(p3.y));
			ctx.lineTo(this.round(p1.x), this.round(p1.y));

			return {
				full: AbGraphics.rotate.pointByDistance(d.rad, d.size),
				half: AbGraphics.rotate.pointByDistance(d.rad, halfSize)
			};
		} else if (style === 'diamond'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + d.size,  d.y);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + halfSize,  d.y - halfSize);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p4 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + halfSize,  d.y + halfSize);

			ctx.moveTo(this.round(p1.x), this.round(p1.y));
			ctx.lineTo(this.round(p2.x), this.round(p2.y));
			ctx.lineTo(this.round(p3.x), this.round(p3.y));
			ctx.lineTo(this.round(p4.x), this.round(p4.y));
			ctx.lineTo(this.round(p1.x), this.round(p1.y));

			return {
				full: AbGraphics.rotate.pointByDistance(d.rad, d.size),
				half: AbGraphics.rotate.pointByDistance(d.rad, halfSize)
			};
		} else if (style === 'circle'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + halfSize, d.y);

			ctx.moveTo(this.round(p1.x + halfSize), this.round(p1.y));
			ctx.arc(this.round(p1.x), this.round(p1.y), halfSize, 0, 360);

			return {
				full: AbGraphics.rotate.pointByDistance(d.rad, d.size),
				half: AbGraphics.rotate.pointByDistance(d.rad, halfSize)
			};
		} else if (style === 'bracket'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + d.size,  d.y - halfSize);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + d.size,  d.y + halfSize);
			var p4 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + (d.size * AbShapeArrow.prototype.BRACKET_SIZE),  d.y);

			ctx.moveTo(this.round(d.x), this.round(d.y));
			ctx.lineTo(this.round(p1.x), this.round(p1.y));
			ctx.lineTo(this.round(p2.x), this.round(p2.y));
			ctx.lineTo(this.round(p3.x), this.round(p3.y));
			ctx.lineTo(this.round(p4.x), this.round(p4.y));
			ctx.lineTo(this.round(p1.x), this.round(p1.y));

			return {
				full: AbGraphics.rotate.pointByDistance(d.rad, d.size),
				half: AbGraphics.rotate.pointByDistance(d.rad, (d.size * AbShapeArrow.prototype.BRACKET_SIZE)),
			};
		}
		
		return {
			clip: { x: 0, y: 0 },
			full: { x: 0, y: 0 },
			half: { x: 0, y: 0 }
		};
	},

	//-----------------------------------------------------------

	/**
	 * 코너 정보를 계산합니다.
	 * @private
	 * @param {Number} x1 시작점 X좌표
	 * @param {Number} y1 시작점 Y좌표
	 * @param {Number} x2 끝점 X좌표
	 * @param {Number} y2 끝점 Y좌표
	 * @param {Number} thickness 두께
	 */
	corners: function (x1, y1, x2, y2, thickness){
		var trect = { x1: x1, y1: y1, x2: x2, y2: y2 };

		var rad = AbGraphics.angle.radian90(trect.x1, trect.y1, trect.x2, trect.y2);
		var d = AbGraphics.distance(trect.x1, trect.y1, trect.x2, trect.y2);
		var pend = AbGraphics.rotate.point(-rad, trect.x1, trect.y1, trect.x2, trect.y2);

		var half = thickness / 2;
		x1 = trect.x1;
		y1 = trect.y1 - half;
		x2 = pend.x;
		y2 = pend.y + half;

		var lt = AbGraphics.rotate.point(rad, trect.x1, trect.y1, x1, y1);		
		var rt = AbGraphics.rotate.point(rad, trect.x1, trect.y1, x2, y1);
		var rb = AbGraphics.rotate.point(rad, trect.x1, trect.y1, x2, y2);
		var lb = AbGraphics.rotate.point(rad, trect.x1, trect.y1, x1, y2);

		var radwide = AbGraphics.angle.radian90(lt.x, lt.y, lb.x, lb.y);

		return {
			thickness: thickness,

			distance: d,

			rad: rad,
			radWide: radwide,

			rect: trect,

			leftTop: lt,
			rightTop: rt,
			rightBottom: rb,
			leftBottom: lb,
		};
	},

	/**
	 * 클리핑 정보가 필요한지 확인합니다.
	 * @private
	 */
	wannaClip: function(){ return this.style.width > 1; },

	/**
	 * 선을 그립니다.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbShapeArrow.CornerInfo} c 코너 정보
	 * @param {*} rdots Dash 스타일 배열 ({@link AbGraphics.canvas.makeDash}를 참고하세요)
	 */
	drawLine: function(ctx, c, rdots){
		//if (c.thickness <= 1){
		if (!this.wannaClip()){
			if (rdots && rdots.length)
				ctx.setLineDash(rdots);
			
			ctx.beginPath();
			ctx.moveTo(Math.round(c.rect.x1), Math.round(c.rect.y1));
			ctx.lineTo(Math.round(c.rect.x2), Math.round(c.rect.y2));
			ctx.stroke();
			ctx.closePath();			
		}else{
			var dotLen = rdots && rdots.length > 1 ? rdots.length : 0;
			//dotLen = 0;
			if (dotLen){
				dotLen = dotLen - (rdots.length % 2);

				var x = c.leftTop.x, y = c.leftTop.y;
				var patd = 0;

				ctx.beginPath();

				for (var d = 0; d < c.distance; d += patd){
					patd = 0;
					for (var i=0; i < dotLen; i+=2){
						var pat = rdots[i];
						var spc = rdots[i + 1];
		
						var p = AbGraphics.rotate.pointByDistance(c.rad, pat);
						var pw = AbGraphics.rotate.pointByDistance(c.radWide, c.thickness);

						ctx.moveTo(this.round(x), this.round(y));
						ctx.lineTo(this.round(x + p.x), this.round(y + p.y));
						ctx.lineTo(this.round(x + p.x + pw.x), this.round(y + p.y + pw.y));
						ctx.lineTo(this.round(x + pw.x), this.round(y + pw.y));
						ctx.lineTo(this.round(x), this.round(y));

						p = AbGraphics.rotate.pointByDistance(c.rad, pat + spc);

						x = x + p.x;
						y = y + p.y;

						patd += pat + spc;
					}
				}

				ctx.fill();
				ctx.closePath();
			}else{
				ctx.beginPath();
				ctx.moveTo(this.round(c.leftTop.x), this.round(c.leftTop.y));
				ctx.lineTo(this.round(c.rightTop.x), this.round(c.rightTop.y));
				ctx.lineTo(this.round(c.rightBottom.x), this.round(c.rightBottom.y));
				ctx.lineTo(this.round(c.leftBottom.x), this.round(c.leftBottom.y));
				ctx.lineTo(this.round(c.leftTop.x), this.round(c.leftTop.y));
				ctx.fill();
				ctx.closePath();
			}
		}		
	},

	//-----------------------------------------------------------

	/**
	 * 도형을 그립니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {Boolean} direct 생성 중 그리기 여부, true면 생성 중 그리기
	 */
	draw: function(ctx, page, direct){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;
		
		ctx.save();

		var x1 = this.x1 * scaleX, y1 = this.y1 * scaleY;
		var x2 = this.x2 * scaleX, y2 = this.y2 * scaleY;
		var lineWidth = this.style.width * scaleX;
		var headSize = this.headSize() * scaleX;
		var tailSize = this.tailSize() * scaleX;
		
		if (lineWidth < 1) lineWidth = 1;

		var distance = AbGraphics.distance(x1, y1, x2, y2);
		
		var cx = ((x2 - x1) >> 1), cy = ((y2 - y1) >> 1);
		ctx.translate(x1 + cx, y1 + cy);

		//var cx = 0, cy = 0;
		//ctx.translate(x1 + cx, y1 + cy);

		var cx2 = x1 + cx, cy2 = y1 + cy;
		var rad = AbGraphics.angle.radian90(x1, y1, x2, y2);
		
		//console.log('[RAD]' + rad + ', angle=' + AbGraphics.angle.rad2deg(rad) + ', distance=' + distance + ', angle2=' + AbGraphics.angle.get(x1, y1, x2, y2));

		// 필터링된 라인 그리기
		var rhead = null, rtail = null;
		var rdots = null;
		var ox1 = x1, oy1 = y1, ox2 = x2, oy2 = y2;

		if (this.style.dots){
			rdots = AbGraphics.canvas.makeDash(this.style.dots);
			if (rdots && rdots.length){
				var rlen = rdots.length;
				for (var i=0; i < rlen; i++) rdots[i] = rdots[i] * scaleX;
			}
		}

		//-----------------------------------------------------------

		var lineRect = {
			x1: ox1 - cx2,
			y1: oy1 - cy2,
			x2: ox2 - cx2,
			y2: oy2 - cy2,
		};
		var CORRECT_LINE_CLIP = 2;

		var clipCorners = this.corners(lineRect.x1, lineRect.y1, lineRect.x2, lineRect.y2, lineWidth + CORRECT_LINE_CLIP);

		//-----------------------------------------------------------

		if (this.wannaClip()){
			ctx.save();
			ctx.beginPath();

			var points = [];

			var chead = this.clipHeadArrow(ctx, {
				lineRect: lineRect,
				lineCorners: clipCorners,
				distance: distance,
				style: this.style.head.style,
				size: headSize + lineWidth,
				lineWidth: lineWidth,
				rad: rad,
				x: ox2 - cx2,
				y: oy2 - cy2,
			});

			var ctail = this.clipTailArrow(ctx, {
				lineRect: lineRect,
				lineCorners: clipCorners,
				distance: distance,
				style: this.style.tail.style,
				size: tailSize + lineWidth,
				lineWidth: lineWidth,
				rad: rad,
				x: ox1 - cx2,
				y: oy1 - cy2,
			});

			Array.prototype.push.apply(points, chead);
			Array.prototype.push.apply(points, ctail);

			//-----------------------------------------------------------

			for (var i=0; i < points.length; i++){
				if (i == 0) ctx.moveTo(this.round(points[i].x), this.round(points[i].y));
				else ctx.lineTo(this.round(points[i].x), this.round(points[i].y));
			}

			//-----------------------------------------------------------

			//ctx.fill();
			ctx.clip();
		}

		//-----------------------------------------------------------
		// draw clipped line

		var c = this.corners(lineRect.x1, lineRect.y1, lineRect.x2, lineRect.y2, lineWidth);

		ctx.fillStyle = this.style.color;
		ctx.strokeStyle = this.style.color;

		this.drawLine(ctx, c, rdots);

		//-----------------------------------------------------------

		if (this.wannaClip())
			ctx.restore();

		//-----------------------------------------------------------

		ctx.fillStyle = this.style.color;
		ctx.strokeStyle = this.style.color;

		// head arrow
		ctx.beginPath();
		rhead = this.drawHeadArrow(ctx, {
			distance: distance,
			style: this.style.head.style,
			size: headSize + lineWidth,
			lineWidth: lineWidth,
			rad: rad,
			x: ox2 - cx2,
			y: oy2 - cy2,
		});
		ctx.fill();
		ctx.closePath();

		// tail arrow
		ctx.beginPath();
		rtail = this.drawTailArrow(ctx, {
			distance: distance,
			style: this.style.tail.style,
			size: tailSize + lineWidth,
			lineWidth: lineWidth,
			rad: rad,
			x: ox1 - cx2,
			y: oy1 - cy2,
		});
		ctx.fill();
		ctx.closePath();

		AbShapeTool.endDraw(this, ctx);
	},

}