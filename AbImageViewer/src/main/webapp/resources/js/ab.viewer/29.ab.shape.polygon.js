/**
 * 펜 도형 스타일 정보
 * @typedef {Object} AbShapePolygon.Style
 * @property {CSS_Color} color=rgb(41,0,139) 선 색상
 * @property {Number} width=1 선 굵기
 */

/**
 * 펜 도형
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
 * @param {AbShapePolygon.Style} [options.style] 스타일 정보
 * @param {Array.<Point>} [options.points] 스트로크 경로
 */
function AbShapePolygon(options){
	if (!options) options = {};
	var style = options.style || {};
	var strokeStyle = style.stroke || {};

	/**
	 * 명칭
	 * @type {String}
	 * @default
	 */
	this.name = 'polygon';			// name of shape
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
	this.shapeType = 'polygon';	// shape, polygon, image
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
	 * @type {AbPolygonEditIndicator}
	 */
	this.indicator = AbCommon.isDefined(AbPolygonEditIndicator) ? new AbPolygonEditIndicator({ target: this }) : null;

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
	 * @type {AbShapePen.Style}
	 */
	this.style = {
		//width: style.width || 1,
		//color: style.color || 'rgb(41,0,139)',

		stroke: {
			width: AbCommon.isNumber(strokeStyle.width) ? strokeStyle.width : 1,
			color: strokeStyle.color || '#41719C', //'#840200',
		},

		color: AbCommon.isDefined(style.color) ? style.color : 'rgba(91,155,213,0.8)', //'#FF0000',
	};

	// editor에 생성시 크기를 지정할 필요없음을 명시
	/**
	 * 생성 시 크기 설정 여부를 명시합니다.
	 * <p>* 엔진은 이 필드를 확인하고 값이 auto가 아니면 도형에 크기 정보를 설정합니다.
	 */
	this.creationSize = 'auto';
	// editor에 좌료를 수집해야 한다는 것을 명시
	/**
	 * 라인을 수집한다는 것을 명시합니다.
	 * <p>*엔진은 이 필드를 확인하고 도형에 좌표를 전달합니다.
	 * @type {Boolean}
	 */
	this.collectLines = true;

	/**
	 * 스트로크 경로 배열
	 * @private
	 * @type {Array.<Point>}
	 */
	this.points = $.isArray(options.points) ? options.points : [];

	/**
	 * 최소/최대 좌표
	 * @private
	 */
	this.minPointX = this.minPointY = this.maxPointX = this.maxPointY = 0;

	// 기존에 있는 point 체크
	this.prepare();
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapePolygon.prototype = {
	constructor: AbShapePolygon,

	//-----------------------------------------------------------

	/**
	 * 도형의 스타일 편집 정보를 가져옵니다.
	 * @return {ShapeStyleEditInfo} 도형 스타일 편집 정보
	 */
	styleDesc: function(){
		return {
			// descs: [
			// 	{ name: 'width', text: '두께', style: 'select', type: 'number', values: 'lineWidth' },
			// 	{ name: 'color', text: '색상', style: 'color', notset: false },
			// ],

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
	 * 스트로크 경로에서 최소/최대 좌표를 계산합니다.
	 */
	prepare: function (){
		var len = this.points.length;
		for (var i=0; i < len; i++){
			var p = this.points[i];

			this.minPointX = i == 0 || p.x < this.minPointX ? p.x : this.minPointX;
			this.minPointY = i == 0 || p.y < this.minPointY ? p.y : this.minPointY;
			this.maxPointX = i == 0 || p.x > this.maxPointX ? p.x : this.maxPointX;
			this.maxPointY = i == 0 || p.y > this.maxPointY ? p.y : this.maxPointY;
		}

		this.minPointX += this.x;
		this.minPointY += this.y;
		this.maxPointX += this.x;
		this.maxPointY += this.y;
	},

	/**
	 * 스트로크 경로와 최소/최대 좌표 정보를 초기화합니다.
	 */
	reset: function(){
		this.points.splice(0, this.points.length);
		this.minPointX = this.minPointY = this.maxPointX = this.maxPointY = 0;
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

		serializer.add('points', this.points);

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
	 * 스트로크 경로를 추가합니다.
	 * @private;
	 * @param {Array.<Point>} points 
	 */
	addPoints: function (points){
		var len = points.length;
		for (var i=0; i < len; i++)
			this.addPoint(points[i].x, points[i].y);
		this.endPoint();
	},

	//-----------------------------------------------------------

	/**
	 * 좌표를 스트로크 경로에 추가합니다.
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	addPoint: function(x, y){
		var len = this.points.length;
		this.minPointX = len == 0 || x < this.minPointX ? x : this.minPointX;
		this.minPointY = len == 0 || y < this.minPointY ? y : this.minPointY;
		this.maxPointX = len == 0 || x > this.maxPointX ? x : this.maxPointX;
		this.maxPointY = len == 0 || y > this.maxPointY ? y : this.maxPointY;

		this.points.push({ x:x, y:y });
	
		this.x = this.minPointX;
		this.y = this.minPointY;
		this.width = (this.maxPointX) - this.x;
		this.height = (this.maxPointY) - this.y;

		//console.log('[POINT] x='+x+', y='+y + ' [BOX] min(x=' + this.minPointX + ', y=' + this.minPointY+'), max(x='+this.maxPointX+', y=' + this.maxPointY+')');
	},

	/**
	 * 스트로크 졍로에 좌표 등록을 마칩니다.
	 */
	endPoint: function(){
		var len = this.points.length;
		for (var i=0; i < len; i++){
			var p = this.points[i];
			p.x -= this.minPointX;
			p.y -= this.minPointY;

			//console.log('{ x:' + p.x + ', y:' + p.y + ' },');
		}

		//var s = '['; for (var i=0; i < len; i++){ var p = this.points[i]; s += '{ x:' + p.x + ', y:' + p.y + ' }, ';  } s += '],'; console.log(s);

		//console.log('[END POINT] minX=' + this.minPointX + ', minY=' + this.minPointY);
	},

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
	 * 스트로크 경로의 크기가 있는 지 확인합니다.
	 * @return {Boolean}
	 */
	hasPointSize: function (){ return this.minPointX && this.minPointY && this.maxPointX && this.maxPointY; },
	/**
	 * 도형의 크기가 있는 지 확인합니다.
	 * @return {Boolean}
	 */
	hasSize: function (){ return this.x && this.y && this.width && this.height; },

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

	//-----------------------------------------------------------

	/**
	 * 드로잉용 여백 정보를 가져옵니다.
	 * <p>* 드로잉 시에만 적용되는 도형과 지시자 사이의 여백 크기입니다.
	 * <p>* 지시자가 드로잉시에 호출됩니다.
	 * @return {Rect}
	 */
	drawPadding: function() {
		var configValue = this.engine.selectionStyle(this.name);

		var half = 0;
		var lineWidth = this.style.stroke.width || 0;
		half = lineWidth > 0 ? (lineWidth / 2) : 0;
		if (half < 0) half = 0;

		return { left: half, top: half, right: half, bottom: half };
	},

	/**
	 * 도형의 여백 정보를 가져옵니다. (도형과 지시자 사이의 여백 크기)
	 * @return {Rect}
	 */
	padding: function() {
		var configValue = this.engine.selectionStyle(this.name);

		var half = 0;
		if (configValue === 'box'){
			var page = this.engine ? this.engine.currentPage : null;
			var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;
	
			var lineWidth = this.style.stroke.width || 0;
			half = lineWidth > 0 ? (lineWidth / scaleX / 2) : 0;
			if (half < 0) half = 0;
		}

		return { left: half, top: half, right: half, bottom: half };
	},

	//contains: function(x, y, w, h){ return this.indicator.contains.apply(this.indicator, arguments); },
	/**
	 * 도형의 스트로크가 대상 점/상자와 충돌하는 지 검사합니다.
	 * <p>* 배경색이 없는 경우, 외곽선과의 충돌을 검사합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>2개</td><td>x: Number</td><td>y: Number</td><td></td><td></td><td>도형 스트로크가 점의 충돌 검사</td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>도형 스트로크가 상자의 충돌 검사</td>
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
		var len = this.points.length;

		if (configValue === 'box' || arguments.length >= 4 || len < 2)
			return this.indicator.contains.apply(this.indicator, arguments);

		return this.containsPath(x, y);
	},

	/**
	 * 그래픽 경로와 점이 충돌하는 지 검사합니다.
	 * @param {Number} x 점의 X좌표
	 * @param {Number} y 점의 Y좌표
	 * @return {Boolean} 충돌하면 true
	 */
	containsPath: function (x, y){
		var len = this.points.length;

		var page = this.engine.currentPage;
		var tbox = this.box();
		var tpadding = this.padding();

		tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
		tbox = page.toCanvasBox(tbox.x, tbox.y, tbox.width, tbox.height);

		var pc = page.toCanvas(x, y);
		x = pc.x; y = pc.y;

		if (this.angle){
			var centerX = tbox.x + (tbox.width >> 1), centerY = tbox.y + (tbox.height >> 1);
			var r = AbGraphics.angle.point(-this.angle, centerX, centerY, x, y);
			x = r.x;
			y = r.y;
		}
	
		var scaleX = page.scale.x, scaleY = page.scale.y;
		var r = AbGraphics.box.zoom(this.maxPointX - this.minPointX, this.maxPointY - this.minPointY, this.width, this.height);
		scaleX *= r.ratioX;
		scaleY *= r.ratioY;

		var startX = tbox.x, startY = tbox.y;

		if (this.style.color){
			return AbGraphics.contains.polygonScale(this.points, x, y, scaleX, scaleY, startX, startY);
		}

		//var v = Math.round(2 * r.ratio);
		v = 3 + (this.style.stroke.width || 0);
		var lp = null, p = null;
		for (var i=0; i < len; i++){
			p = this.points[i];
			if (lp && AbGraphics.contains.line(
						startX + Math.round(lp.x * scaleX),
						startY + Math.round(lp.y * scaleY),
						startX + Math.round(p.x * scaleX),
						startY + Math.round(p.y * scaleY), x, y, v))
				return true;
			lp = p;
		}

		lp = this.points[len - 1];
		p = this.points[0];

		if (AbGraphics.contains.line(
			startX + Math.round(lp.x * scaleX),
			startY + Math.round(lp.y * scaleY),
			startX + Math.round(p.x * scaleX),
			startY + Math.round(p.y * scaleY), x, y, v))
			return true;

		return false;
	},

	/**
	 * 좌표에 맞는 도형의 편집점을 가져옵니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @return {String} 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 */
	editable: function (x, y){ if (this.selected){ return this.indicator.editable(x, y); } return null; },
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
	 * 좌표 수집을 종료해야 하는 지 판단합니다.
	 * <p>* 시작점과 동일하면 수집 종료
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @return {Boolean} 종료해야 하면 true
	 */
	isEndPoint: function (x, y){
		if (!this.points.length) return false;

		var pt = this.points[0];
		return Math.abs(pt.x - x) < 1 && Math.abs(pt.y - y) < 1;
	},

	//-----------------------------------------------------------

	/**
	 * 그리기 스타일을 설정합니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 */
	drawStyle: function (ctx){
		ctx.strokeStyle = this.style.stroke.color;
		ctx.lineWidth = this.style.stroke.width;

		if (this.style.color){
			ctx.fillStyle = this.style.color;
		}

		//ctx.strokeStyle = 'red';
		//ctx.lineWidth = 1;

		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
	},

	/**
	 * 생성 중 도형을 그립니다.
	 * <p>* 마지막 좌표와 마지막의 이전 좌표를 선으로 그립니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {AbViewerEngineSelection} selection 엔진 선택영역 정보
	 */
	creationDraw: function (ctx, page, selection){
		if (!this.points.length)
			return;

		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;
		var strokeSize = this.style ? this.style.stroke.width : 1;

		this.drawStyle(ctx);

		ctx.beginPath();

		var items = [], box = null;

		var len = this.points.length, sp = null, ep = null;
		for (var i=1; i < len; i++){
			sp = this.points[i - 1];
			ep = this.points[i];
	
			ctx.moveTo(sp.x * scaleX, sp.y * scaleY);
			ctx.lineTo(ep.x * scaleX, ep.y * scaleY);
			ctx.stroke();

			box = AbGraphics.box.rect(sp.x, sp.y, ep.x, ep.y);
			items.push(AbGraphics.box.inflate(box.x, box.y, box.width, box.height, strokeSize));
		}

		sp = this.points[this.points.length - 1];
		ep = selection.end;

		ctx.moveTo(sp.x * scaleX, sp.y * scaleY);
		ctx.lineTo(ep.x * scaleX, ep.y * scaleY);
		ctx.stroke();

		ctx.closePath();

		box = AbGraphics.box.rect(sp.x, sp.y, ep.x, ep.y);
		items.push(AbGraphics.box.inflate(box.x, box.y, box.width, box.height, strokeSize));

		//-----------------------------------------------------------

		return {
			forcibly: true,
			items: items
		};
	},

	/**
	 * 도형을 그립니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {Boolean} direct 생성 중 그리기 여부, true면 생성 중 그리기
	 */
	draw: function(ctx, page, direct){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;
		
		if (direct)
			ctx.save();
		else{
			AbShapeTool.beginRectDraw(this, ctx, page);

			var r = AbGraphics.box.zoom(this.maxPointX - this.minPointX, this.maxPointY - this.minPointY, this.width, this.height);
			//ctx.scale(r.ratioX, r.ratioY);
			scaleX *= r.ratioX;
			scaleY *= r.ratioY;
		}

		this.drawStyle(ctx);

		ctx.beginPath();
		var len = this.points.length;
		if (len == 1){
			var p = this.points[0];

			ctx.fillStyle = this.style.stroke.color;
			ctx.arc(p.x * scaleX, p.y * scaleY, 1, 0, 360);
			ctx.fill();
		}else{
			for (var i=0; i < len; i++){
				var p = this.points[i];
				var op = i > 0 ? this.points[i - 1] : null;
	
				if (i == 0)
					ctx.moveTo(Math.round(p.x * scaleX), Math.round(p.y * scaleY));
				else{
					//ctx.quadraticCurveTo(op.x + (p.x - op.x), op.y + (p.y - op.y), p.x, p.y);
					//ctx.arcTo(op.x, op.y, p.x, p.y, 1);
					ctx.lineTo(Math.round(p.x * scaleX), Math.round(p.y * scaleY));
				}
			}
		}

		ctx.closePath();

		if (this.style.color)
			ctx.fill();		
		
		ctx.stroke();
	
		AbShapeTool.endDraw(this, ctx);
	},
}