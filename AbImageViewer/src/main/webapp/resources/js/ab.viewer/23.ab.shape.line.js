/**
 * 상자 도형 스타일 정보
 * @typedef {Object} AbShapeLine.Style
 * @property {CSS_Color} color=#FF0000 선 색상
 * @property {Number} width=1 선 굵기
 * @property {String} dots=solid 선 무늬 (solid|dash|dot|dash-dot|dash-dot-dot)<p>* 참고: {@link AbShapeStyler#getDefaultValues}
 */

/**
 * 선 도형
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
 * @param {AbShapeLine.Style} [options.style] 스타일 정보
 */
function AbShapeLine(options){
	if (!options) options = {};
	var style = options.style || {};
	var headStyle = style.head || {};
	var tailStyle = style.tail || {};

	/**
	 * 명칭
	 * @type {String}
	 * @default
	 */
	this.name = 'line';		// name of shape
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

	var lw = style.width || 1;

	/**
	 * 스타일 정보
	 * @type {AbShapeLine.Style}
	 */
	this.style = {
		width: lw,
		color: style.color || '#FF0000', //'#840200',
		dots: AbGraphics.canvas.dashStyle(style.dots, 'solid'), // solid, dash, dot, dash-dot, dash-dot-dot
	};

	this.prepare();
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeLine.prototype = {
	constructor: AbShapeLine,

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
		serializer.add('x1', Math.round(this.x1));
		serializer.add('y1', Math.round(this.y1));
		serializer.add('x2', Math.round(this.x2));
		serializer.add('y2', Math.round(this.y2));
		
		var style = serializer.addGroup('style');
		serializer.add(style, 'color', this.style.color);
		serializer.add(style, 'width', this.style.width);
		serializer.add(style, 'dots', this.style.dots);

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

	//-----------------------------------------------------------

	/**
	 * 도형의 여백 정보를 가져옵니다. (도형과 지시자 사이의 여백 크기)
	 * @return {Rect}
	 */
	padding: function() {
		var page = this.engine ? this.engine.currentPage : null;
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;

		var pad = (this.style.width >> 1) * scaleX;
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
		
		if (lineWidth < 1) lineWidth = 1;

		var distance = AbGraphics.distance(x1, y1, x2, y2);
		
		var cx = ((x2 - x1) >> 1), cy = ((y2 - y1) >> 1);
		ctx.translate(x1 + cx, y1 + cy);
		//if (this.angle) ctx.rotate(AbGraphics.angle.deg2rad(this.angle));

		var cx2 = x1 + cx, cy2 = y1 + cy;
		var rad = AbGraphics.angle.radian90(x1, y1, x2, y2);
		
		//console.log('[RAD]' + rad + ', angle=' + AbGraphics.angle.rad2deg(rad) + ', distance=' + distance + ', angle2=' + AbGraphics.angle.get(x1, y1, x2, y2));

		ctx.fillStyle = this.style.color;
		ctx.strokeStyle = this.style.color;
		ctx.lineWidth = lineWidth;
		ctx.lineCap = 'butt';

		// calc for line
		x1 -= cx2;
		y1 -= cy2;
		x2 -= cx2;
		y2 -= cy2;

		if (this.style.dots){
			var r = AbGraphics.canvas.makeDash(this.style.dots);
			if (r && r.length){
				var rlen = r.length;
				for (var i=0; i < rlen; i++) r[i] = r[i] * scaleX;
			}

			if (r.length)
				ctx.setLineDash(r);
		}

		// line
		ctx.beginPath();
		ctx.moveTo(Math.round(x1), Math.round(y1));
		ctx.lineTo(Math.round(x2), Math.round(y2));
		ctx.stroke();
		ctx.closePath();

		//-----------------------------------------------------------
		// DEBUG
		//-----------------------------------------------------------

		if (false){
			var x1 = this.x1 * scaleX, y1 = this.y1 * scaleY + 5;
			var x2 = this.x2 * scaleX, y2 = this.y2 * scaleY + 5;
	
			x1 -= cx2;
			y1 -= cy2;
			x2 -= cx2;
			y2 -= cy2;
	
			ctx.strokeStyle = 'green';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(Math.round(x1), Math.round(y1));
			ctx.lineTo(Math.round(x2), Math.round(y2));
			ctx.stroke();
			ctx.closePath();
		}


		AbShapeTool.endDraw(this, ctx);
	},
}