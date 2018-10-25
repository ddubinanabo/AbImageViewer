
/**
 * 선형 도형 편집 지시자 스타일 정보
 * @typedef {Object} AbLineEditIndicator.Controls
 * @property {Boolean} angle=true 회전 편집점 사용 여부
 * @property {Number} angleDistance=30 도형과 회전 편집점의 거리
 * @property {Boolean} left=true 시작점 편집점 사용여부
 * @property {Boolean} right=true 끝점 편집점 사용여부
 */


/**
 * 선형 도형 편집 지시자
 * @class
 * @param {Object} [options] 옵션
 * @param {ShapeObject} [options.target=null] 대상 도형 객체를 설정합니다.
 * @param {Object} [options.controls] 편집점 위치 사용 설정
 * @param {Boolean} [options.controls.angle=true] 회전 편집점 사용 여부
 * @param {Number} [options.controls.angleDistance=30] 도형과 회전 편집점의 거리
 * @param {Boolean} [options.controls.left=true] 좌중단 편집점 사용여부
 * @param {Boolean} [options.controls.right=true] 우중단 편집점 사용여부
 * @param {AbBoxEditIndicator.Style} [options.controls.style] 스타일 설정
 */
function AbLineEditIndicator(options){
	if (!options) options = {};

	//-----------------------------------------------------------

	/**
	 * 대상 도형 객체
	 * @type {ShapeObject}
	 */
	this.target = options.target || null;

	//-----------------------------------------------------------

	var controls = options.controls || {};

	/**
	 * 편집점 사용 여부
	 * @type {AbBoxEditIndicator.Controls}
	 */
	this.controls = {
		/**
		 * 회전 편집점 사용 여부
		 */
		angle: controls.angle || true,
		/**
		 * 도형과 회전 편집점의 거리
		 */
		angleDistance: controls.angleDistance || 30,

		/**
		 * 시작점 편집점 사용여부
		 */
		left: controls.left || true,
		/**
		 * 끝점 편집점 사용여부
		 */
		right: controls.right || true,
	};

	var style = controls.style || {};
	var defaultStyle = style.default || {};
	var focusStyle = style.focus || {};
	var defaultControlStyle = defaultStyle.control || {};
	var defaultControlStrokeStyle = defaultControlStyle.stroke || {};
	var focusControlStyle = focusStyle.control || {};
	var focusControlStrokeStyle = focusControlStyle.stroke || {};
	
	/**
	 * 도형 선택 방식 (box|path)
	 * <dl>
	 * 	<dt>path</dt><dd>도형의 모양을 클릭해야 선택됩니다.</dd>
	 * 	<dt>box</dt><dd>도형의 영역을 클릭해야 선택됩니다.</dd>
	 * </dl>
	 * @type {String}
	 * @default
	 */
	this.selectionStyle = 'path';

	/**
	 * 스타일 정보
	 * @type {AbBoxEditIndicator.Style}
	 */
	this.style = {
		/**
		 * 기본 스타일
		 */
		default: {
			/**
			 * 편집점 스타일
			 */
			control: {
				/**
				 * 편집점 외곽선 스타일
				 */
				stroke: {
					color: focusControlStrokeStyle.color || 'rgba(127,172,209,1)', //'rgba(70,130,180,.6)', //'#6DA3CF', //'#3372A6', //'#266599', //'#BC719B', // '#4787C7', // '#4682B4',
					width: focusControlStrokeStyle.width || 1,
				},
		
				color: focusControlStyle.color || 'rgba(201,228,252,1)', //'rgba(153,204,255,.3)', //'#AED6FF', //'#74A8DC', //'#5497D9', //'#FF99D3', // '#389CFF', // '#99CCFF',	
				size: focusControlStyle.size || 10,
			},
	
			color: focusStyle.color || 'rgba(95,212,251,1)', //'rgba(0,191,255,.8)', //'#28C9FF', //'#00A9E1', //'#008DBC', //'#BC719B', // '#4787C7', // '#00BFFF',
			width: focusStyle.width || 1,							
		},
	
		/**
		 * 포커스 스타일
		 */
		focus: {
			/**
			 * 편집점 스타일
			 */
			control: {
				/**
				 * 편집점 외곽선 스타일
				 */
				stroke: {
					color: defaultControlStrokeStyle.color || 'rgba(70,130,180,1)', //'#4682B4',
					width: defaultControlStrokeStyle.width || 1,
				},
		
				color: defaultControlStyle.color || 'rgba(153,204,255,1)', //'#99CCFF',	
				size: defaultControlStyle.size || 10,
			},
	
			color: defaultStyle.color || 'rgba(0,191,255,1)', //'#00BFFF',
			width: defaultStyle.width || 1,	
		}
	};
};

//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbLineEditIndicator.prototype = {
	constructor: AbLineEditIndicator,

	//-----------------------------------------------------------

	/**
	 * 도형 객체 복제 시 복제/참조 여부
	 * <p>* AbCommon.cloneShape() 호출 시 이 객체를 복제할 지 여부로, true면 객체 복재를 false면 참조합니다.
	 * @type {Boolean}
	 * @default
	 */
	$$CLONE: true,
	/**
	 * 도형 객체 복제 시 도형 객체 참조 필드
	 * <p>* AbCommon.cloneShape() 호출 시 이 객체의 $$CHAIN 필드에 도형 객체를 참조합니다.
	 * @type {String}
	 * @default
	 */
	$$CHAIN: 'target',

	//-----------------------------------------------------------

	/**
	 * 도형의 코너 정보
	 * @typedef {Object} AbLineEditIndicator.CornerInfo
	 * @property {Number} rad 라디안 각도
	 * @property {Number} radWide 라디안 각도 
	 * @property {Number} cx 중심점 X좌표
	 * @property {Number} cy 중심점 Y좌표
	 * @property {Point} leftTop 상자의 좌상단 좌표
	 * @property {Point} rightTop 상자의 우상단 좌표
	 * @property {Point} rightBottom 상자의 우하단 좌표
	 * @property {Point} leftBottom 상자의 좌하단 좌표
	 * @property {Point} centerTop 중상단 좌표
	 * @property {Point} left 좌중단 좌표
	 * @property {Point} right 우중단 좌표
	 * @property {Point} anglePoint 회전 편집점 좌표
	 */

	/**
	 * 도형의 코너 정보를 가져옵니다.
	 * @private
	 * @param {Boolean} [translate=truie] 좌표 이동 여부
	 * @return {AbLineEditIndicator.CornerInfo} 코너 정보
	 */
	corners: function (translate){
		if (!AbCommon.isBool(translate)) translate = true;

		var page = this.target.engine.currentPage;
		var trect = this.target.rect();
		trect = page.toCanvasRect(trect);

		if (translate){
			var cx = ((trect.x2 - trect.x1) >> 1), cy = ((trect.y2 - trect.y1) >> 1);
			var cx2 = trect.x1 + cx, cy2 = trect.y1 + cy;
	
			trect.x1 -= cx2;
			trect.y1 -= cy2;
			trect.x2 -= cx2;
			trect.y2 -= cy2;
		}

		var tpadding = this.target.padding() || { left: 0, top: 0, right: 0, bottom: 0 };

		var rad = AbGraphics.angle.radian90(trect.x1, trect.y1, trect.x2, trect.y2);
		var d = AbGraphics.distance(trect.x1, trect.y1, trect.x2, trect.y2);
		var pend = AbGraphics.rotate.point(-rad, trect.x1, trect.y1, trect.x2, trect.y2);

		var x1 = trect.x1 - tpadding.left, y1 = trect.y1 - tpadding.top;
		var x2 = pend.x + tpadding.right, y2 = pend.y + tpadding.bottom;

		var lt = AbGraphics.rotate.point(rad, trect.x1, trect.y1, x1, y1);		
		var rt = AbGraphics.rotate.point(rad, trect.x1, trect.y1, x2, y1);
		var rb = AbGraphics.rotate.point(rad, trect.x1, trect.y1, x2, y2);
		var lb = AbGraphics.rotate.point(rad, trect.x1, trect.y1, x1, y2);

		var p = AbGraphics.rotate.pointByDistance(rad, d / 2);
		var ct = {
			x: lt.x + p.x,
			y: lt.y + p.y
		};

		var radwide = AbGraphics.angle.radian90(lt.x, lt.y, lb.x, lb.y);
		d = AbGraphics.distance(lt.x, lt.y, lb.x, lb.y);
		p = AbGraphics.rotate.pointByDistance(radwide, d / 2);
		var l = {
			x: lt.x + p.x,
			y: lt.y + p.y
		};

		d = AbGraphics.distance(rt.x, rt.y, rb.x, rb.y);
		p = AbGraphics.rotate.pointByDistance(radwide, d / 2);
		var r = {
			x: rt.x + p.x,
			y: rt.y + p.y
		};

		var a = null;
		if (this.controls.angle && this.controls.angleDistance){
			p = AbGraphics.rotate.pointByDistance(rad + AbGraphics.angle.RAD90 * 3, this.controls.angleDistance);
			a = {
				x: ct.x + p.x,
				y: ct.y + p.y
			};
		}

		return {
			rad: rad,
			radWide: radwide,
			cx: trect.x1,
			cy: trect.y1,

			leftTop: lt,
			rightTop: rt,
			rightBottom: rb,
			leftBottom: lb,

			centerTop: ct,
			left: l,
			right: r,

			anglePoint: a
		};
	},

	//-----------------------------------------------------------
	
	/**
	 * selectionStyle에 따라 도형의 선/상자와 대상 점/상자와 충돌하는 지 검사합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>2개</td><td>x: Number</td><td>y: Number</td><td></td><td></td><td>도형 선/상자와 점의 충돌 검사</td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>도형 선/상자와 상자의 충돌 검사</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {Number} x 대상 점의 X좌표 또는 대상 상자의 X좌표
	 * @param {Number} y 대상 점의 Y좌표 또는 대상 상자의 Y좌표
	 * @param {Number} [w] 대상 상자의 폭
	 * @param {Number} [h] 대상 상자의 높이
	 */
	contains: function (x, y, w, h){
		if (this.selectionStyle === 'box')
			return this.containsBox.apply(this, arguments);
		return this.containsLine.apply(this, arguments);
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
	 * 	<td>2개</td><td>x: Number</td><td>y: Number</td><td></td><td></td><td>도형과 점의 충돌 검사</td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>도형과 상자의 충돌 검사</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {Number} x 대상 점의 X좌표 또는 대상 상자의 X좌표
	 * @param {Number} y 대상 점의 Y좌표 또는 대상 상자의 Y좌표
	 * @param {Number} [w] 대상 상자의 폭
	 * @param {Number} [h] 대상 상자의 높이
	 * @return {Boolean} 충돌하면 true
	 */
	containsLine: function(x, y, w, h){
		var page = this.target.engine.currentPage;
		var tpadding = this.target.padding() || { left: 0, top: 0, right: 0, bottom: 0 };

		if (arguments.length >= 4){	
			var pc = page.toCanvasBox(x, y, w, h);
			x = pc.x; y = pc.y; w = pc.width; h = pc.height;

			var tbox = this.target.box();
			tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
			tbox = page.toCanvasBox(tbox);
			
			return AbGraphics.contains.box(x, y, w, h, tbox.x, tbox.y, tbox.width, tbox.height);
		}else{
			var trect = this.target.rect();
			trect = page.toCanvasRect(trect);

			var pc = page.toCanvas(x, y);
			x = pc.x; y = pc.y;

			var validPointRadius = AbCommon.hasValidLineDistance(this.target) ? this.target.validLineDistance() : (tpadding.top + tpadding.bottom) >> 1;
			if (validPointRadius < 1) validPointRadius = 1;
			var d = AbGraphics.contains.line(trect.x1, trect.y1, trect.x2, trect.y2, x, y, validPointRadius);
			return d;
		}
	},

	/**
	 * 상자와 대상 점/상자와 충돌하는 지 검사합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>2개</td><td>x: Number</td><td>y: Number</td><td></td><td></td><td>도형 상자과 점의 충돌 검사</td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>도형 상자과 상자의 충돌 검사</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {Number} x 대상 점의 X좌표 또는 대상 상자의 X좌표
	 * @param {Number} y 대상 점의 Y좌표 또는 대상 상자의 Y좌표
	 * @param {Number} [w] 대상 상자의 폭
	 * @param {Number} [h] 대상 상자의 높이
	 * @return {Boolean} 충돌하면 true
	 */
	containsBox: function(x, y, w, h){
		var page = this.target.engine.currentPage;
		var tpadding = this.target.padding() || { left: 0, top: 0, right: 0, bottom: 0 };

		if (arguments.length >= 4){	
			var pc = page.toCanvasBox(x, y, w, h);
			x = pc.x; y = pc.y; w = pc.width; h = pc.height;

			var tbox = this.target.box();
			tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
			tbox = page.toCanvasBox(tbox);
			
			return AbGraphics.contains.box(x, y, w, h, tbox.x, tbox.y, tbox.width, tbox.height);
		}else{
			var tbox = this.target.box();
			tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
			tbox = page.toCanvasBox(tbox);

			var pc = page.toCanvas(x, y);
			x = pc.x; y = pc.y;

			return AbGraphics.contains.box(tbox.x, tbox.y, tbox.width, tbox.height, x, y);
		}
	},

	//-----------------------------------------------------------

	/**
	 * 좌표에 맞는 도형의 편집점을 가져옵니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @return {String} 편집점 (A|LC|RC)
	 */
	editable: function (px, py){
		var page = this.target.engine.currentPage;
		var c = this.corners(false);
		
		var pc = page.toCanvas(px, py);
		px = pc.x;
		py = pc.y;
	
		if (this.controls.left && this.containsControl(c.left.x, c.left.y, px, py)) return 'LC';
		if (this.controls.right && this.containsControl(c.right.x, c.right.y, px, py)) return 'RC';
		
		if (c.anglePoint && this.containsControl(c.anglePoint.x, c.anglePoint.y, px, py)) return 'A';
	},

	//-----------------------------------------------------------

	/**
	 * 편집점과 충돌하는 지 검사합니다.
	 * @private
	 * @param {Number} x 편집점의 X좌표
	 * @param {Number} y 편집점의 Y좌표
	 * @param {Number} px X좌표
	 * @param {Number} py Y좌표
	 * @return {Boolean} 충돌하면 true
	 */
	containsControl: function (x, y, px, py){
		var style = this.target.focused ? this.style.focus : this.style.default;
		var strokeWidth = style.control.stroke.width;

		var size = style.control.size;
		var halfsiz = size >> 1;

		var box = AbGraphics.box.inflate(x - halfsiz, y - halfsiz, size, size, strokeWidth);

		return AbGraphics.contains.box(box.x, box.y, box.width, box.height, px, py);
	},

	/**
	 * 편집접에 대한 좌표를 가져옵니다.
	 * @param {String} point 편집점 (A|LC|RC)
	 * @return {Point} 편집점 좌표
	 */
	editPos: function (point){
		var c = this.corners(false);

		switch(point){
		case 'A':
			var engineScale = AbCommon.engineScale(this.target);
			return { x: c.anglePoint ? c.anglePoint.x : 0, y: c.anglePoint ? c.anglePoint.y / engineScale.y : 0 };
		case 'LC': return { x: c.left.x, y: c.left.y };
		case 'RC': return { x: c.right.x, y: c.right.y };
		}
	},

	/**
	 * 도형을 회전하거나 위치 및 크기를 설정합니다.
	 * @param {String} point 편집점 (A|LC|RC)
	 * @param {Number} px X좌표
	 * @param {Number} py Y좌표
	 */
	resize: function (point, px, py){
		if (!point)
			return;

		var page = this.target.engine.currentPage;

		var tbox = this.target.box();
		tbox = page.toCanvasBox(tbox.x, tbox.y, tbox.width, tbox.height);

		var centerX = tbox.x + (tbox.width >> 1), centerY = tbox.y + (tbox.height >> 1);

		var trect = this.target.rect();
		trect = page.toCanvasRect(trect);
		
		var pc = page.toCanvas(px, py);
		px = pc.x;
		py = pc.y;
		
		if (point == 'A'){
			var angle = AbGraphics.angle.get(centerX, centerY, px, py);
			var incAngle = angle - this.target.angle;

			this.target.angle = angle;
			//console.log('[ANGLE] ' + angle + ', INC=' + incAngle);

			var p = AbGraphics.angle.rect(incAngle, centerX, centerY, trect.x1, trect.y1, trect.x2, trect.y2);

			p = page.fromCanvasRect(p.x1, p.y1, p.x2, p.y2);
			this.target.rect(p.x1, p.y1, p.x2, p.y2);

			return incAngle;
		}else{
			var x1 = trect.x1, y1 = trect.y1, x2 = trect.x2, y2 = trect.y2;

			var unrotatedPx = AbGraphics.angle.point(-this.target.angle, centerX, centerY, px, py);

			switch(point){
			case 'LC':
				x1 = px;
				y1 = py;
				break;
			case 'RC':
				x2 = px;
				y2 = py;
				break;
			}

			// target의 rect()와 box()에서 angle 게산을 해야 한다.
			trect = page.fromCanvasRect(x1, y1, x2, y2);
			this.target.rect(trect.x1, trect.y1, trect.x2, trect.y2);
			
			//this.target.angle = AbGraphics.angle.toShapeAngle(AbGraphics.angle.get(x1, y1, x2, y2));
			//console.log('[ANGLE] ' + this.target.angle);

			return unrotatedPx;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 편집점을 그립니다.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @param {String} [type=box] 편집점 타입 (circle|box)
	 * @param {Number} radian 회전 라디안 각도
	 */
	drawControl: function (ctx, x, y, type, radian){
		if (!type) type = 'box';

		var style = this.target.focused ? this.style.focus : this.style.default;

		var size = style.control.size;
		var halfsiz = size >> 1;

		ctx.save();
		ctx.translate(x, y);
		if (radian)
			ctx.rotate(radian);

		if (type == 'circle'){
			if (style.control.color){
				ctx.beginPath();
				ctx.arc(0, 0, halfsiz, 0, 360);
				ctx.fill();
				ctx.closePath();
			}

			if (style.control.stroke.color && style.control.stroke.width){
				ctx.beginPath();
				ctx.arc(0, 0, halfsiz, 0, 360);
				ctx.stroke();
				ctx.closePath();
			}
		}else{
			if (style.control.color)
				ctx.fillRect(-halfsiz, -halfsiz, size, size);

			if (style.control.stroke.color && style.control.stroke.width)
				ctx.strokeRect(-halfsiz, -halfsiz, size, size);
		}

		ctx.restore();
	},

	/**
	 * 도형의 확대/축소된 크기를 가져옵니다.
	 * @private
	 * @return {Box} 크기
	 */
	targetScaledBox: function (){
		var tbox = this.target.box();

		var engineScale = AbCommon.engineScale(this.target);
		tbox.x *= engineScale.x;
		tbox.y *= engineScale.y;
		tbox.width *= engineScale.x;
		tbox.height *= engineScale.y;

		return tbox;
	},

	/**
	 * 도형의 확대/축소된 크기의 좌상단, 우하단 좌표를 가져옵니다.
	 * @private
	 * @return {2Point} 좌상단, 우하단 좌표
	 */
	targetScaledRect: function (){
		var trect = this.target.rect();

		var engineScale = AbCommon.engineScale(this.target);
		trect.x1 *= engineScale.x;
		trect.y1 *= engineScale.y;
		trect.x2 *= engineScale.x;
		trect.y2 *= engineScale.y;

		return trect;
	},
	
	/**
	 * 편집점 지시자를 그립니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 */
	draw: function(ctx){
		if (this.selectionDrawStyle === 'box')
			this.drawBox(ctx);
		else
			this.drawLine(ctx);
	},

	/**
	 * 선 모양의 편집점 지시자를 그립니다.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 */
	drawLine: function(ctx){
		ctx.save();

		//angle = 0;
		var trect = this.targetScaledRect();
		var angle = this.target.angle;

		var cx = ((trect.x2 - trect.x1) >> 1), cy = ((trect.y2 - trect.y1) >> 1);
		ctx.translate(trect.x1 + cx, trect.y1 + cy);

		var c = this.corners();

		var style = this.target.focused ? this.style.focus : this.style.default;	

		ctx.strokeStyle = style.color;
		ctx.lineWidth = style.width;

		ctx.beginPath();
		ctx.moveTo(c.leftTop.x, c.leftTop.y);
		ctx.lineTo(c.rightTop.x, c.rightTop.y);
		ctx.lineTo(c.rightBottom.x, c.rightBottom.y);
		ctx.lineTo(c.leftBottom.x, c.leftBottom.y);
		ctx.lineTo(c.leftTop.x, c.leftTop.y);
		ctx.stroke();
		ctx.closePath();

		ctx.strokeStyle = style.control.stroke.color;
		ctx.lineWidth = style.control.stroke.width;
		ctx.fillStyle = style.control.color;

		if (c.anglePoint){
			ctx.beginPath();
			ctx.moveTo(c.centerTop.x, c.centerTop.y);
			ctx.lineTo(c.anglePoint.x, c.anglePoint.y);
			ctx.stroke();
			this.drawControl(ctx, c.anglePoint.x, c.anglePoint.y, 'circle');
		}

		if (this.controls.left) this.drawControl(ctx, c.left.x, c.left.y, 'box', c.radWide);
		if (this.controls.right) this.drawControl(ctx, c.right.x, c.right.y, 'box', c.radWide);
		
		ctx.restore();
	},
	
	/**
	 * 상자 모양의 편집점 지시자를 그립니다.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 */
	drawBox: function(ctx){
		ctx.save();

		//angle = 0;
		var trect = this.targetScaledRect();
		var tbox = this.targetScaledBox();
		var tpadding = this.target.padding() || { left: 0, top: 0, right: 0, bottom: 0 };
		var angle = this.target.angle;

		var cx = ((trect.x2 - trect.x1) >> 1), cy = ((trect.y2 - trect.y1) >> 1);
		ctx.translate(trect.x1 + cx, trect.y1 + cy);

		var c = this.corners();

		var style = this.target.focused ? this.style.focus : this.style.default;	

		ctx.strokeStyle = style.color;
		ctx.lineWidth = style.width;

		tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
		cx = (tbox.width >> 1), cy = (tbox.height >> 1);
		
		ctx.strokeRect(-cx, -cy, tbox.width, tbox.height);

		ctx.strokeStyle = style.control.stroke.color;
		ctx.lineWidth = style.control.stroke.width;
		ctx.fillStyle = style.control.color;

		if (c.anglePoint){
			ctx.beginPath();
			ctx.moveTo(c.centerTop.x, c.centerTop.y);
			ctx.lineTo(c.anglePoint.x, c.anglePoint.y);
			ctx.stroke();
			this.drawControl(ctx, c.anglePoint.x, c.anglePoint.y, 'circle');
		}

		if (this.controls.left) this.drawControl(ctx, c.left.x, c.left.y, 'box', c.radWide);
		if (this.controls.right) this.drawControl(ctx, c.right.x, c.right.y, 'box', c.radWide);
		
		ctx.restore();
	},
}