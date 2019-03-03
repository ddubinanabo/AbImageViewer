/**
 * 형광펜 도형 스타일 정보
 * @typedef {Object} AbShapeHighlightPen.Style
 * @property {Number} width=5 펜촉의 폭
 * @property {Number} height=20 펜촉의 높이
 * @property {Number} alpha=0.65 투명도
 * @property {CSS_Color} color=rgb(255,255,0) 선 색상
 */

/**
 * 형광펜 경로 아이템 정보
 * @typedef {Object} AbShapeHighlightPen.PathPoint
 * @property {Boolean} [move] 이동 여부
 * @property {Number} x 펜촉의 폭
 * @property {Number} y 펜촉의 높이
 * @property {String} horiz 수퍙 연산자 (+|-)
 * @property {String} vert 수직 연산자 (+|-)
 */


/**
 * 형광펜 도형
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
 * @param {AbShapeHighlightPen.Style} [options.style] 스타일 정보
 * @param {Array.<Point>} [options.points] 스트로크 경로
 */
function AbShapeHighlightPen(options){
	if (!options) options = {};
	var style = options.style || {};

	/**
	 * 명칭
	 * @type {String}
	 * @default
	 */
	this.name = 'highlightpen';	// name of shape
	/**
	 * 구분 (annotation=주석|masking=마스킹)
	 * @type {String}
	 * @default 
	 */
	this.type = 'annotation';		// annotation, masking
	/**
	 * 도형 유형 (shape|polygon|image)
	 * @type {String}
	 * @default
	 */
	this.shapeType = 'shape';		// shape, polygon, image
	/**
	 * 도형 스타일 (box|line)
	 * @type {String}
	 * @default
	 */
	this.shapeStyle = 'box';		// box, line
	/**
	 * 토큰 (예약)
	 * @private
	 * @type {String}
	 */
	this.token = null;				// token for using	

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
	 * @type {AbShapeHighlightPen.Style}
	 */
	this.style = {
		width: style.width || 5,
		height: style.height || 20,
		alpha: style.alpha || 0.65,
		color: style.color || 'rgb(255,255,0)', //'#FFFF66',
	};

	// editor에 생성시 크기를 지정할 필요없음을 명시
	/**
	 * 생성 시 크기 설정 여부를 명시합니다.
	 * <p>* 엔진은 이 필드를 확인하고 값이 auto가 아니면 도형에 크기 정보를 설정합니다.
	 */
	this.creationSize = 'auto';
	// editor에 좌료를 수집해야 한다는 것을 명시
	/**
	 * 스트로크를 수집한다는 것을 명시합니다.
	 * <p>*엔진은 이 필드를 확인하고 도형에 좌표를 전달합니다.
	 * @type {Boolean}
	 */
	this.collectPoints = true;

	/**
	 * 스트로크 경로 배열
	 * @private
	 * @type {Array.<Point>}
	 */
	this.points = $.isArray(options.points) ? options.points : [];

	/**
	 * 형광펜 경로
	 * @private
	 * @type {Array.<AbShapeHighlightPen.PathPoint>}
	 */
	this.path = [];

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

AbShapeHighlightPen.prototype = {
	constructor: AbShapeHighlightPen,

	//-----------------------------------------------------------

	/**
	 * 도형의 스타일 편집 정보를 가져옵니다.
	 * @return {ShapeStyleEditInfo} 도형 스타일 편집 정보
	 */
	styleDesc: function(){
		return {
			descs: [
				{ name: 'width', text: '폭', style: 'text', type: 'number', range: { start: 3, end: 20 } },
				{ name: 'height', text: '높이', style: 'text', type: 'number', range: { start: 3, end: 40 } },
				{ name: 'alpha', text: '투명도', style: 'text', type: 'number', unit: '%', range: { start: 0, end: 100 } },
				{ name: 'color', text: '색상', style: 'color', notset: false },
			],
		};
	},

	//-----------------------------------------------------------

	/**
	 * 스트로크 경로에서 최소/최대 좌표를 계산합니다.
	 */
	prepare: function (){
		this.path.splice(0, this.path.length);

		var ws = this.style.width >> 1;
		var hs = this.style.height >> 1;
		
		var len = this.points.length, lp = null;
		if (len == 1){
			var p = this.points[0];
			this.addSinglePath(this.path, p.x, p.y, ws, hs);

			this.minPointX = this.maxPointX = p.x;
			this.minPointY = this.maxPointY = p.y;
		}else{
			for (var i=0; i < len; i++){
				var p = this.points[i];
	
				this.minPointX = i == 0 || p.x < this.minPointX ? p.x : this.minPointX;
				this.minPointY = i == 0 || p.y < this.minPointY ? p.y : this.minPointY;
				this.maxPointX = i == 0 || p.x > this.maxPointX ? p.x : this.maxPointX;
				this.maxPointY = i == 0 || p.y > this.maxPointY ? p.y : this.maxPointY;
	
				if (lp) this.addPath(this.path, lp.x, lp.y, p.x, p.y, ws, hs);
	
				lp = p;
			}
		}

		this.minPointX += this.x;
		this.minPointY += this.y;
		this.maxPointX += this.x;
		this.maxPointY += this.y;

		//console.log('[HIGHLIGHTER][PATH] C# Style');
		//var s = 'new PathPoint[] { '; for (var i=0; i < this.path.length; i++){ var p = this.path[i]; s += 'new PathPoint(' + p.x + ',' + p.y + ','+(p.move ? 'true': 'false')+'), ';  } s += '};'; console.log(s);
	},

	/**
	 * 스트로크 경로와 형광펜 경로, 최소/최대 좌표 정보를 초기화합니다.
	 */
	reset: function(){
		this.path.splice(0, this.path.length);
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
		serializer.add(style, 'width', this.style.width);
		serializer.add(style, 'height', this.style.height);
		serializer.add(style, 'alpha', this.style.alpha);

		serializer.add('points', this.points);

		return serializer.serialize();
	},


	//-----------------------------------------------------------
	
	/**
	 * 도형에 전달된 Notify를 처리합니다.
	 * <dl>Command Text
	 * 	<dt>styled</dt><dd>스타일이 변경됐습니다.</dd>
	 * </dl>
	 * @param {String} cmd Command Text (styled)
	 */
	notify: function(cmd){
		if (cmd == 'styled'){
			this.prepare();
		}
	},

	/**
	 * 스트로크 경로를 추가합니다.
	 * @private;
	 * @param {Array.<Point>} points 
	 */
	addPoints: function (points){
		var len = points.length;
		for (var i=0; i < len; i++)
			this.addPoint(points[i]);
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

		var ws = this.style.width >> 1;
		var hs = this.style.height >> 1;
		
		this.x = this.minPointX - ws;
		this.y = this.minPointY - hs;
		this.width = (this.maxPointX + ws) - this.x;
		this.height = (this.maxPointY + hs) - this.y;
		
		//console.log('[POINT] x='+x+', y='+y + ' [BOX] min(x=' + this.minPointX + ', y=' + this.minPointY+'), max(x='+this.maxPointX+', y=' + this.maxPointY+')');
		//console.log('[POINT][ADD] width=' + this.width + ', height=' + this.height);
	},

	/**
	 * 스트로크 졍로에 좌표 등록을 마칩니다.
	 */
	endPoint: function(){
		var ws = this.style.width >> 1;
		var hs = this.style.height >> 1;

		var len = this.points.length, lp = null;
		if (len == 1){
			var p = this.points[0];
			p.x -= this.minPointX;
			p.y -= this.minPointY;
		
			this.addSinglePath(this.path, p.x, p.y, ws, hs);
		}else{
			for (var i=0; i < len; i++){
				var p = this.points[i];
				p.x -= this.minPointX;
				p.y -= this.minPointY;
	
				//console.log('{ x:' + p.x + ', y:' + p.y + ' },');
	
				if (lp) this.addPath(this.path, lp.x, lp.y, p.x, p.y, ws, hs);
				lp = p;
			}
		}

		//var s = '['; for (var i=0; i < len; i++){ var p = this.points[i]; s += '{ x:' + p.x + ', y:' + p.y + ' }, ';  } s += '],'; console.log(s);
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
	/**
	 * 생성 시 최소 크기를 가져옵니다.
	 * @return {Size}
	 */
	creationMinimum: function() { return { width: 0, height: 0 }; },
	/**
	 * 도형의 최소 크기를 가져옵니다.
	 * <p>* 기본값(단위: 픽셀): 10x10
	 * @return {Size}
	 */
	minimum: function() {
		var ws = this.style.width >> 1;
		var hs = this.style.height >> 1;

		// if (this.points.length == 1){
		// 	return {
		// 		width: ws << 1,
		// 		height: hs << 1,
		// 	};
		// }else{
		// 	return {
		// 		width: ((this.maxPointX + ws) - (this.minPointX - ws)) * 0.1,
		// 		height: ((this.maxPointY + hs) - (this.minPointY - hs)) * 0.1,
		// 	};
		// }

		return {
			width: ((this.maxPointX + ws) - (this.minPointX - ws)) * 0.1,
			height: ((this.maxPointY + hs) - (this.minPointY - hs)) * 0.1,
		};
	},
	//minimum: function() { return { width: this.style.width, height: this.style.height }; },

	//-----------------------------------------------------------

	/**
	 * 도형의 여백 정보를 가져옵니다. (도형과 지시자 사이의 여백 크기)
	 * @return {Rect}
	 */
	padding: function() { return { left: 0, top: 0, right: 0, bottom: 0 }; },
	//contains: function(x, y, w, h){ return this.indicator.contains.apply(this.indicator, arguments); },
	/**
	 * 형광펜 경로가 대상 점/상자와 충돌하는 지 검사합니다.
	 * <p>* 배경색이 없는 경우, 외곽선과의 충돌을 검사합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>2개</td><td>x: Number</td><td>y: Number</td><td></td><td></td><td>형광펜 경로가 점의 충돌 검사</td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>형광펜 경로가 상자의 충돌 검사</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {Number} x 대상 점의 X좌표 또는 대상 상자의 X좌표
	 * @param {Number} y 대상 점의 Y좌표 또는 대상 상자의 Y좌표
	 * @param {Number} [w] 대상 상자의 폭
	 * @param {Number} [h] 대상 상자의 높이
	 * @return {Boolean} 충돌하면 true
	 */
	contains: function(x, y, ctx){
		var configValue = this.engine.selectionStyle(this.name);
		
		if (configValue === 'box' || arguments.length >= 4)
			return this.indicator.contains.apply(this.indicator, arguments);
			
		var ws = this.style.width >> 1;
		var hs = this.style.height >> 1;
	
		var page = this.engine.currentPage;

		var scaleX = page.scale.x, scaleY = page.scale.y;
		var rws = 0, rhs = 0, cor = false;	
		var r = AbGraphics.box.zoom((this.maxPointX + ws) - (this.minPointX - ws), (this.maxPointY + hs) - (this.minPointY - hs), this.width, this.height);
		if (r.ratioX != 1 || r.ratioY != 1){
			rws = ws * scaleX;
			rhs = hs * scaleY;
			rws = rws * r.ratioX - rws;
			rhs = rhs * r.ratioY - rhs;
			cor = AbShapeHighlightPen.CORRECT_WEIGHT;
		}
		
		var tbox = this.box();
		var tpadding = this.padding();

		tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
		tbox = page.toCanvasBox(tbox.x, tbox.y, tbox.width, tbox.height);

		var pc = page.toCanvas(x, y);
		x = pc.x; y = pc.y;
	
		if (this.angle){
			var centerX = tbox.x + (tbox.width >> 1), centerY = tbox.y + (tbox.height >> 1);
			var rpt = AbGraphics.angle.point(-this.angle, centerX, centerY, x, y);
			x = rpt.x;
			y = rpt.y;
		}

		x = Math.round(x); y = Math.round(y);

		// var display = true, paths = []; // ======[DISPLAY]========
		var display = false; // ======[NO-DISPLAY]========
		
		// if (display){ // ======[DISPLAY]========
		// 	ctx.fillStyle = 'green';
		// 	ctx.beginPath();
		// 	ctx.arc(x, y, 5, 0, 360);
		// 	ctx.fill();
		// 	ctx.closePath();
		// } // ======[DISPLAY]========

		var xc = 0, yc = 0;
		var pc = page.toCanvas(this.x + ws, this.y + hs);
		var startX = Math.round(pc.x) + rws, startY = Math.round(pc.y) + rhs;
		var path = [];
		var len = this.path.length;
		for (var i=0; i < len; i++){
			var p = this.path[i];

			if (cor){
				if (p.horiz == '+') xc = -rws; else xc = rws;
				if (p.vert == '+') yc = -rhs; else yc = rhs;
			}
			
			if (p.move){
				if (path.length > 0){
					// if (display) paths.push(path); // ======[DISPLAY]========
					if (AbGraphics.contains.polygon(path, x, y)){
						return true;
					}
				}

				path.splice(0, path.length); // ======[NO-DISPLAY]========
				// if (display) path = [];  // ======[DISPLAY]========

				p = { x: (p.x * r.ratioX) * scaleX + xc, y: (p.y * r.ratioY) * scaleY + yc };
				p.x = startX + Math.round(p.x);
				p.y = startY + Math.round(p.y);

				path.push(p);
			}else{
				p = { x: (p.x * r.ratioX) * scaleX + xc, y: (p.y * r.ratioY) * scaleY + yc };
				p.x = startX + Math.round(p.x);
				p.y = startY + Math.round(p.y);

				path.push(p);
			}
		}

		// if (display){  // ======[DISPLAY]========
		// 	if (path.length > 0)
		// 		paths.push(path);

		// 	ctx.strokeStyle = 'blue';
		// 	for (var i=0; i < paths.length; i++){
		// 		var path = paths[i];

		// 		for (var j=0; j < path.length; j++){
		// 			var p = path[j];

		// 			if (j == 0) ctx.moveTo(p.x, p.y);
		// 			else ctx.lineTo(p.x, p.y);
		// 		}
		// 	}
		// 	ctx.stroke();
		// }  // ======[DISPLAY]========
		
		return path.length > 0 && AbGraphics.contains.polygon(path, x, y);
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

	//-----------------------------------------------------------

	/**
	 * 그리기 스타일을 설정합니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 */
	drawStyle: function (ctx){
		ctx.fillStyle = this.style.color;
		ctx.lineJoin = 'round';

		ctx.globalAlpha = this.style.alpha;
	},

	/**
	 * 형광펜 경로를 추가합니다.
	 * @param {Array.<AbShapeHighlightPen.PathPoint>} path 형광펜 경로
	 * @param {Number} x 스트로크 X좌표
	 * @param {Number} y 스트로크 Y좌표
	 * @param {Number} ws 펜촉의 폭
	 * @param {Number} hs 펜촉의 높이
	 */
	addSinglePath: function(path, x, y, ws, hs){
		// ㅁ
		this.path.push({ x: x - ws, y: y - hs, move: true, horiz:'-', vert:'-' });
		this.path.push({ x: x + ws, y: y - hs, horiz:'+', vert:'-' });
		this.path.push({ x: x + ws, y: y + hs, horiz:'+', vert:'+' });
		this.path.push({ x: x - ws, y: y + hs, horiz:'-', vert:'+' });
	},

	/**
	 * 형광펜 경로를 추가합니다.
	 * @param {Array.<AbShapeHighlightPen.PathPoint>} path 형광펜 경로
	 * @param {Number} x1 스트로크 좌표1 X좌표
	 * @param {Number} y1 스트로크 좌표1 Y좌표
	 * @param {Number} x2 스트로크 좌표2 X좌표
	 * @param {Number} y2 스트로크 좌표2 Y좌표
	 * @param {Number} ws 펜촉의 폭
	 * @param {Number} hs 펜촉의 높이
	 */
	addPath: function (path, x1, y1, x2, y2, ws, hs){
		var xval = x2 - x1, yval = y2 - y1;
		var tx = 0, ty = 0;

		if (xval > 0 && yval < 0){
			// ↗
			path.push({ x: x1 - ws, y: y1 - hs, move: true, horiz:'-', vert:'-' });
			path.push({ x: x2 - ws, y: y2 - hs, horiz:'-', vert:'-' });
			path.push({ x: x2 + ws, y: y2 - hs, horiz:'+', vert:'-' });
			path.push({ x: x2 + ws, y: y2 + hs, horiz:'+', vert:'+' });
			path.push({ x: x1 + ws, y: y1 + hs, horiz:'+', vert:'+' });

			//path.push({ x: x1 + ws, y: y1 - hs });
			//path.push({ x: x1 - ws, y: y1 - hs });

			path.push({ x: x1 - ws, y: y1 + hs, horiz:'-', vert:'+' });
			path.push({ x: x1 - ws, y: y1 - hs, horiz:'-', vert:'-' });
		}else if (xval > 0 && yval == 0){
			// →
			path.push({ x: x1 - ws, y: y1 - hs, move: true, horiz:'-', vert:'-' });
			path.push({ x: x2 + ws, y: y2 - hs, horiz:'+', vert:'-' });
			path.push({ x: x2 + ws, y: y2 + hs, horiz:'+', vert:'+' });
			path.push({ x: x1 - ws, y: y1 + hs, horiz:'-', vert:'+' });
			path.push({ x: x1 - ws, y: y1 - hs, horiz:'-', vert:'-' });
		}else if (xval > 0 && yval > 0){
			// ↘
			path.push({ x: x1 - ws, y: y1 - hs, move: true, horiz:'-', vert:'-' });
			path.push({ x: x1 + ws, y: y1 - hs, horiz:'+', vert:'-' });
			path.push({ x: x2 + ws, y: y2 - hs, horiz:'+', vert:'-' });
			path.push({ x: x2 + ws, y: y2 + hs, horiz:'+', vert:'+' });
			path.push({ x: x2 - ws, y: y2 + hs, horiz:'-', vert:'+' });
			path.push({ x: x1 - ws, y: y1 + hs, horiz:'-', vert:'+' });
			path.push({ x: x1 - ws, y: y1 - hs, horiz:'-', vert:'-' });
		}else if (xval == 0 && yval > 0){
			// ↓
			path.push({ x: x1 - ws, y: y1 - hs, move: true, horiz:'-', vert:'-' });
			path.push({ x: x1 + ws, y: y1 - hs, horiz:'+', vert:'-' });
			path.push({ x: x2 + ws, y: y2 + hs, horiz:'+', vert:'+' });
			path.push({ x: x2 - ws, y: y2 + hs, horiz:'-', vert:'+' });
			path.push({ x: x1 - ws, y: y1 - hs, horiz:'-', vert:'-' });
		}else if (xval < 0 && yval > 0){
			// ↙
			path.push({ x: x1 - ws, y: y1 - hs, move: true, horiz:'-', vert:'-' });
			path.push({ x: x1 + ws, y: y1 - hs, horiz:'+', vert:'-' });
			path.push({ x: x1 + ws, y: y1 + hs, horiz:'+', vert:'+' });
			path.push({ x: x2 + ws, y: y2 + hs, horiz:'+', vert:'+' });			
			path.push({ x: x2 - ws, y: y2 + hs, horiz:'-', vert:'+' });
			path.push({ x: x2 - ws, y: y2 - hs, horiz:'-', vert:'-' });
			path.push({ x: x1 - ws, y: y1 - hs, horiz:'-', vert:'-' });
		}else if (xval < 0 && yval == 0){
			// ←	
			path.push({ x: x1 + ws, y: y1 - hs, move: true, horiz:'+', vert:'-' });
			path.push({ x: x1 + ws, y: y1 + hs, horiz:'+', vert:'+' });
			path.push({ x: x2 - ws, y: y2 + hs, horiz:'-', vert:'+' });			
			path.push({ x: x2 - ws, y: y2 - hs, horiz:'-', vert:'-' });
			path.push({ x: x1 + ws, y: y1 - hs, horiz:'+', vert:'-' });
		}else if (xval < 0 && yval < 0){
			// ↖
			path.push({ x: x1 + ws, y: y1 - hs, move: true, horiz:'+', vert:'-' });
			path.push({ x: x1 + ws, y: y1 + hs, horiz:'+', vert:'+' });
			path.push({ x: x1 - ws, y: y1 + hs, horiz:'-', vert:'+' });
			path.push({ x: x2 - ws, y: y2 + hs, horiz:'-', vert:'+' });			
			path.push({ x: x2 - ws, y: y2 - hs, horiz:'-', vert:'-' });
			path.push({ x: x2 + ws, y: y2 - hs, horiz:'+', vert:'-' });
			path.push({ x: x1 + ws, y: y1 - hs, horiz:'+', vert:'-' });
		}else if (xval == 0 && yval < 0){
			// ↑
			path.push({ x: x1 + ws, y: y1 - hs, move: true, horiz:'+', vert:'-' });
			path.push({ x: x2 + ws, y: y2 + hs, horiz:'+', vert:'+' });
			path.push({ x: x2 - ws, y: y2 + hs, horiz:'-', vert:'+' });
			path.push({ x: x1 - ws, y: y1 - hs, horiz:'-', vert:'-' });
			path.push({ x: x1 + ws, y: y1 - hs, horiz:'+', vert:'-' });
		}
	},

	/**
	 * 확대/축소에 따른 굵기 보정 여부
	 * @const
	 * @type {Boolean}
	 * @default
	 */
	CORRECT_WEIGHT: false,

	/**
	 * 도형을 그립니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {Boolean} direct 생성 중 그리기 여부, true면 생성 중 그리기
	 */
	draw: function(ctx, page, direct){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;

		var ws = this.style.width >> 1;
		var hs = this.style.height >> 1;
		var rws = 0, rhs = 0, cor = false;
	
		if (!direct){
			// 스타일만큼 증분된 위치를 조정한다.
			ctx.save();

			//-----------------------------------------------------------

			var minX = (this.minPointX - ws), minY = (this.minPointY - hs);
			var maxX = (this.maxPointX + ws), maxY =  (this.maxPointY + hs);

			var r = AbGraphics.box.zoom(maxX - minX, maxY - minY, this.width, this.height);
			if (r.ratioX != 1 || r.ratioY != 1){
				rws = ws * scaleX;
				rhs = hs * scaleY;
				rws = rws * r.ratioX - rws;
				rhs = rhs * r.ratioY - rhs;
				cor = AbShapeHighlightPen.prototype.CORRECT_WEIGHT;
			}

			//-----------------------------------------------------------
			
			var tbox = this.box();
			tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, -ws, -hs);
	
			tbox.x = tbox.x * scaleX;
			tbox.y = tbox.y * scaleY;
			tbox.width *= scaleX;
			tbox.height *= scaleY;
				
			var cx = (tbox.width >> 1), cy = (tbox.height >> 1);
			if (this.angle){
				ctx.translate(tbox.x + cx, tbox.y + cy);
				ctx.rotate(AbGraphics.angle.deg2rad(this.angle));
				ctx.translate(-cx, -cy);
			}else{
				ctx.translate(tbox.x, tbox.y);
			}

			ctx.translate(rws, rhs);
	
			//-----------------------------------------------------------
		
			scaleX *= r.ratioX;
			scaleY *= r.ratioY;
	
			//console.log('[HIGHLIGHT-PEN][RATIO] ratioX=' + r.ratioX + ', ratioY=' + r.ratioY);
		}

		this.drawStyle(ctx);

		ctx.beginPath();

		//-----------------------------------------------------------

		var path = null, len = 0, lp = null;
		var makePath = direct;
		//var makePath = true;
		if (makePath){
			path = [];

			len = this.points.length;
			for (var i=0; i < len; i++){
				var p = this.points[i];
				if (lp) this.addPath(path, lp.x, lp.y, p.x, p.y, ws, hs);
				lp = p;
			}
		}else
			path = this.path;

		//-----------------------------------------------------------

		len = path.length;
		lp = null;
		var xc = 0, yc = 0;
		for (var i=0; i < len; i++){
			var p = path[i];

			if (cor){
				if (p.horiz == '+') xc = -rws; else xc = rws;
				if (p.vert == '+') yc = -rhs; else yc = rhs;
			}

			if (p.move) ctx.moveTo(Math.round(p.x * scaleX + xc), Math.round(p.y * scaleY + yc));
			//else ctx.arcTo(lp.x, lp.y, p.x, p.y, 1);
			else ctx.lineTo(Math.round(p.x * scaleX + xc), Math.round(p.y * scaleY + yc));
			
			//if (i > 0 && p.move) break;
			//ctx.arc(p.x, p.y, 2, 0, 360);
			lp = p;
		}
		ctx.fill();
		//ctx.stroke();
		ctx.closePath();

		//-------------------------------------------------------
		// 수집된 포인트 표시

		// ctx.strokeStyle = 'blue';
		// ctx.beginPath();
		// var len = this.points.length;
		// if (len == 1){
		// 	var p = this.points[0];

		// 	ctx.fillStyle = 'blue';
		// 	ctx.arc(p.x * scaleX, p.y * scaleY, 1, 0, 360);
		// 	ctx.fill();
		// }else{
		// 	for (var i=0; i < len; i++){
		// 		var p = this.points[i];
		// 		var op = i > 0 ? this.points[i - 1] : null;
	
		// 		if (i == 0)
		// 			ctx.moveTo(p.x * scaleX, p.y * scaleY);
		// 		else{
		// 			//ctx.quadraticCurveTo(op.x + (p.x - op.x), op.y + (p.y - op.y), p.x, p.y);
		// 			//ctx.arcTo(op.x, op.y, p.x, p.y, 1);
		// 			ctx.lineTo(p.x * scaleX, p.y * scaleY);
		// 		}
		// 	}
		// 	ctx.stroke();
		// }
		// ctx.closePath();

		//-------------------------------------------------------
	
		if (!direct)
			AbShapeTool.endDraw(this, ctx);

		//-------------------------------------------------------
	
		// var ws = this.style.width >> 1;
		// var hs = this.style.height >> 1;

		// var scaleX = page.scale.x, scaleY = page.scale.y;
		// var r = AbGraphics.box.zoom((this.maxPointX + ws) - (this.minPointX - ws), (this.maxPointY + hs) - (this.minPointY - hs), this.width, this.height);
		// // scaleX *= r.ratioX;
		// // scaleY *= r.ratioY;

		// //var startX = Math.round(this.x * page.scale.x), startY = Math.round(this.y * page.scale.y);
		// var pc = page.toCanvas(this.x, this.y);
		// var startX = Math.round(pc.x + ws), startY = Math.round(pc.y + hs);
		// var path = [];
		// var paths = [];
		// var len = this.path.length;
		// for (var i=0; i < len; i++){
		// 	var p = this.path[i];
		// 	if (p.move){
		// 		if (path.length > 0){
		// 			paths.push(path);
		// 		}

		// 		path = [];

		// 		p = { x: (p.x * r.ratioX) * scaleX, y: (p.y * r.ratioY) * scaleY };
		// 		p.x = startX + Math.round(p.x);
		// 		p.y = startY + Math.round(p.y);

		// 		path.push(p);
		// 	}else{
		// 		p = { x: (p.x * r.ratioX) * scaleX, y: (p.y * r.ratioY) * scaleY };
		// 		p.x = startX + Math.round(p.x);
		// 		p.y = startY + Math.round(p.y);

		// 		path.push(p);
		// 	}
		// }

		// if (path.length > 0)
		// 	paths.push(path);

		// ctx.strokeStyle = 'red';
		// for (var i=0; i < paths.length; i++){
		// 	var path = paths[i];

		// 	for (var j=0; j < path.length; j++){
		// 		var p = path[j];

		// 		if (j == 0) ctx.moveTo(p.x, p.y);
		// 		else ctx.lineTo(p.x, p.y);				
		// 		// if (j == 0) ctx.moveTo(Math.round(p.x * scaleX), Math.round(p.y * scaleY));
		// 		// else ctx.lineTo(Math.round(p.x * scaleX), Math.round(p.y * scaleY));
		// 	}
		// }
		// ctx.stroke();

	},
}