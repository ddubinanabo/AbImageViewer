/**
 * 상자형 도형 편집 지시자 스타일 정보
 * @typedef {Object} AbBoxEditIndicator.Style
 * @property {Object} default 기본 스타일 설정
 * @property {String} default.color=rgba(0,191,255,1) 선 색상
 * @property {Number} default.width=1 선 굵기
 * @property {Object} default.control 편집점 스타일 설정
 * @property {String} default.control.color=rgba(153,204,255,1) 편집점 색상
 * @property {Number} default.control.size=10 편집점 크기
 * @property {Object} default.control.stroke 편집점 외곽선 스타일 설정
 * @property {String} default.control.stroke.color=rgba(70,130,180,1) 편집점 외곽선 색상
 * @property {Number} default.control.stroke.width=1 편집점 외곽선 굵기
 * @property {Object} focus 포커스 스타일 설정
 * @property {String} focus.color=rgba(95,212,251,1) 선 색상
 * @property {Number} focus.width=1 선 굵기
 * @property {Object} focus.control 편집점 스타일 설정
 * @property {String} focus.control.color=rgba(201,228,252,1) 편집점 색상
 * @property {Number} focus.control.size=10 편집점 크기
 * @property {Object} focus.control.stroke 편집점 외곽선 스타일 설정
 * @property {String} focus.control.stroke.color=rgba(127,172,209,1) 편집점 외곽선 색상
 * @property {Number} focus.control.stroke.width=1 편집점 외곽선 굵기
 */

/**
 * 상자형 도형 편집 지시자 스타일 정보
 * @typedef {Object} AbBoxEditIndicator.Controls
 * @property {Boolean} angle=true 회전 편집점 사용 여부
 * @property {Number} angleDistance=30 도형과 회전 편집점의 거리
 * @property {Boolean} leftTop=true 좌상단 편집점 사용 여부
 * @property {Boolean} top=true 중상단 편집점 사용여부
 * @property {Boolean} rightTop=true 우상단 편집점 사용여부
 * @property {Boolean} left=true 좌중단 편집점 사용여부
 * @property {Boolean} right=true 우중단 편집점 사용여부
 * @property {Boolean} leftBottom=true 좌하단 편집점 사용여부
 * @property {Boolean} bottom=true 중하단 편집점 사용여부
 * @property {Boolean} rightBottom=true 우하단 편집점 사용여부
 */

/**
 * 상자형 도형 편집 지시자
 * @class
 * @param {Object} [options] 옵션
 * @param {ShapeObject} [options.target=null] 대상 도형 객체를 설정합니다.
 * @param {Object} [options.controls] 편집점 위치 사용 설정
 * @param {Boolean} [options.controls.angle=true] 회전 편집점 사용 여부
 * @param {Number} [options.controls.angleDistance=30] 도형과 회전 편집점의 거리
 * @param {Boolean} [options.controls.leftTop=true] 좌상단 편집점 사용 여부
 * @param {Boolean} [options.controls.top=true] 중상단 편집점 사용여부
 * @param {Boolean} [options.controls.rightTop=true] 우상단 편집점 사용여부
 * @param {Boolean} [options.controls.left=true] 좌중단 편집점 사용여부
 * @param {Boolean} [options.controls.right=true] 우중단 편집점 사용여부
 * @param {Boolean} [options.controls.leftBottom=true] 좌하단 편집점 사용여부
 * @param {Boolean} [options.controls.bottom=true] 중하단 편집점 사용여부
 * @param {Boolean} [options.controls.rightBottom=true] 우하단 편집점 사용여부
 * @param {AbBoxEditIndicator.Style} [options.controls.style] 스타일 설정
 */
function AbBoxEditIndicator(options){
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
		 * 좌상단 편집점 사용 여부
		 */
		leftTop: controls.leftTop || true,
		/**
		 * 중상단 편집점 사용여부
		 */
		top: controls.top || true,
		/**
		 * 우상단 편집점 사용여부
		 */
		rightTop: controls.rightTop || true,
		/**
		 * 좌중단 편집점 사용여부
		 */
		left: controls.left || true,
		/**
		 * 우중단 편집점 사용여부
		 */
		right: controls.right || true,
		/**
		 * 좌하단 편집점 사용여부
		 */
		leftBottom: controls.leftBottom || true,
		/**
		 * 중하단 편집점 사용여부
		 */
		bottom: controls.bottom || true,
		/**
		 * 우하단 편집점 사용여부
		 */
		rightBottom: controls.rightBottom || true,
	};

	var style = controls.style || {};
	var defaultStyle = style.default || {};
	var focusStyle = style.focus || {};
	var defaultControlStyle = defaultStyle.control || {};
	var defaultControlStrokeStyle = defaultControlStyle.stroke || {};
	var focusControlStyle = focusStyle.control || {};
	var focusControlStrokeStyle = focusControlStyle.stroke || {};

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

AbBoxEditIndicator.prototype = {
	constructor: AbBoxEditIndicator,

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
		var page = this.target.engine.currentPage;
		var tbox = this.target.box();
		var tpadding = this.target.padding() || { left: 0, top: 0, right: 0, bottom: 0 };

		if (arguments.length >= 4){
			var pc = page.toCanvasBox(x, y, w, h);
			x = pc.x; y = pc.y; w = pc.width; h = pc.height;

			if (this.target.angle){
				tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
				tbox = page.toCanvasBox(tbox);

				var b = AbGraphics.angle.bounds(this.target.angle, tbox.x, tbox.y, tbox.width, tbox.height);

				return AbGraphics.contains.box(x, y, w, h, b.x, b.y, b.width, b.height);
			}else{
				tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
				tbox = page.toCanvasBox(tbox);

				return AbGraphics.contains.box(x, y, w, h, tbox.x, tbox.y, tbox.width, tbox.height);
			}
		}else{

			//console.log('[CONTAINS][POINT][ORIGIN] x=' + x + ', y=' + y + ', box(x1='+tbox.x+',y1='+tbox.y+',x2='+(tbox.x+tbox.width)+',y2='+(tbox.y+tbox.height));
			
			tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
			tbox = page.toCanvasBox(tbox);

			var pc = page.toCanvas(x, y);
			x = pc.x; y = pc.y;

			if (this.target.angle){
				var centerX = tbox.x + (tbox.width >> 1), centerY = tbox.y + (tbox.height >> 1);
				
				pc = AbGraphics.angle.point(-this.target.angle, centerX, centerY, x, y);
				x = pc.x;
				y = pc.y;
			}

			//console.log('[CONTAINS][POINT] x=' + x + ', y=' + y + ', box(x1='+tbox.x+',y1='+tbox.y+',x2='+(tbox.x+tbox.width)+',y2='+(tbox.y+tbox.height));
			
			return AbGraphics.contains.box(tbox.x, tbox.y, tbox.width, tbox.height, x, y);
		}
	},

	/**
	 * 도형의 상자의 면과 대상 점/상자와의 충돌을 검사합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>2개</td><td>x: Number</td><td>y: Number</td><td></td><td></td><td>도형 상자 면과 점의 충돌 검사</td>
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
	containsSide: function(x, y, w, h){
		var page = this.target.engine.currentPage;
		var tbox = this.target.box();
		var tpadding = this.target.padding() || { left: 0, top: 0, right: 0, bottom: 0 };

		if (arguments.length >= 4){
			var pc = page.toCanvasBox(x, y, w, h);
			x = pc.x; y = pc.y; w = pc.width; h = pc.height;

			if (this.target.angle){
				tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
				tbox = page.toCanvasBox(tbox);

				var b = AbGraphics.angle.bounds(this.target.angle, tbox.x, tbox.y, tbox.width, tbox.height);

				return AbGraphics.contains.box(x, y, w, h, b.x, b.y, b.width, b.height);
			}else{
				tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
				tbox = page.toCanvasBox(tbox);

				return AbGraphics.contains.box(x, y, w, h, tbox.x, tbox.y, tbox.width, tbox.height);
			}
		}else{
			tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
			tbox = page.toCanvasBox(tbox);

			var pc = page.toCanvas(x, y);
			x = pc.x; y = pc.y;

			if (this.target.angle){
				var centerX = tbox.x + (tbox.width >> 1), centerY = tbox.y + (tbox.height >> 1);
				var r = AbGraphics.angle.point(-this.target.angle, centerX, centerY, x, y);
				x = r.x;
				y = r.y;
			}
			
			var validPointRadius = AbCommon.hasValidLineDistance(this.target) ? this.target.validLineDistance() : 1;
			if (validPointRadius < 1) validPointRadius = 1;

			// top
			if (AbGraphics.contains.line(tbox.x, tbox.y, tbox.x + tbox.width, tbox.y, x, y, validPointRadius)) return true;
			// right
			if (AbGraphics.contains.line(tbox.x + tbox.width, tbox.y, tbox.x + tbox.width, tbox.y + tbox.height, x, y, validPointRadius)) return true;
			// bottom
			if (AbGraphics.contains.line(tbox.x, tbox.y + tbox.height, tbox.x + tbox.width, tbox.y + tbox.height, x, y, validPointRadius)) return true;
			// left
			if (AbGraphics.contains.line(tbox.x, tbox.y, tbox.x, tbox.y + tbox.height, x, y, validPointRadius)) return true;

			return false;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 좌표에 맞는 도형의 편집점을 가져옵니다.
	 * @param {Number} px X좌표
	 * @param {Number} py Y좌표
	 * @param {CanvasRenderingContext2D} [ctx] Canvas 2D Context
	 * @return {String} 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 */
	editable: function (px, py, ctx){
		var page = this.target.engine.currentPage;
		var tbox = this.target.box();
		var tpadding = this.target.padding() || { left: 0, top: 0, right: 0, bottom: 0 };

		tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
		tbox = page.toCanvasBox(tbox.x, tbox.y, tbox.width, tbox.height);

		var hw = tbox.width >> 1, hh = tbox.height >> 1;
		var x = tbox.x, y = tbox.y, w = tbox.width, h = tbox.height;
		var centerX = tbox.x + hw, centerY = tbox.y + hh;

		if (this.target.angle){
			// if (ctx){
			// 	ctx.fillStyle = 'blue';
			// 	ctx.beginPath();
			// 	ctx.arc(centerX, centerY, 5, 0, 360);
			// 	ctx.fill();
			// 	ctx.closePath();

			// 	ctx.strokeStyle = 'blue';
			// 	var s = page.toCanvas(this.target.x, this.target.y);
			// 	var e = page.toCanvas(this.target.x + this.target.width, this.target.y + this.target.height);
			// 	ctx.strokeRect(s.x, s.y, e.x - s.x, e.y - s.y);
			// }

			var pc = page.toCanvas(px, py);

			// if (ctx){
			// 	var page = this.target.engine.currentPage;
			// 	//var spos = page.toCanvas(center.x, center.y);
	
			// 	ctx.fillStyle = 'magenta';
			// 	ctx.beginPath();
			// 	ctx.arc(pc.x, pc.y, 5, 0, 360);
			// 	ctx.fill();
			// 	ctx.closePath();
			// }

			pc = AbGraphics.angle.point(-this.target.angle, centerX, centerY, pc.x, pc.y);
			px = pc.x;
			py = pc.y;
		}else{
			var pc = page.toCanvas(px, py);
			px = pc.x;
			py = pc.y;
		}

		// if (ctx){
		// 	ctx.fillStyle = 'red';
		// 	ctx.beginPath();
		// 	ctx.arc(px, py, 5, 0, 360);
		// 	ctx.fill();
		// 	ctx.closePath();
		// }
	
		if (this.controls.leftTop && this.containsControl(x, y, px, py)) return 'LT';
		if (this.controls.top && this.containsControl(x + hw, y, px, py)) return 'CT';
		if (this.controls.rightTop && this.containsControl(x + w, y, px, py)) return 'RT';
		if (this.controls.left && this.containsControl(x, y + hh, px, py)) return 'LC';
		if (this.controls.right && this.containsControl(x + w, y + hh, px, py)) return 'RC';
		if (this.controls.leftBottom && this.containsControl(x, y + h, px, py)) return 'LB';
		if (this.controls.bottom && this.containsControl(x + hw, y + h, px, py)) return 'CB';
		if (this.controls.rightBottom && this.containsControl(x + w, y + h, px, py)) return 'RB';

		if (this.controls.angle && this.controls.angleDistance){
			if (this.containsControl(x + hw, y - this.controls.angleDistance, px, py)) return 'A';
		}
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
	 * @param {String} point 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 * @return {Point} 편집점 좌표
	 */
	editPos: function (point){
		var page = this.target.engine.currentPage;
		var tbox = this.target.box();
		var tpadding = this.target.padding() || { left: 0, top: 0, right: 0, bottom: 0 };
		tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
		tbox = page.toCanvasBox(tbox);
	
		var hw = tbox.width >> 1, hh = tbox.height >> 1;
		switch(point){
		case 'A':
			var engineScale = AbCommon.engineScale(this.target);
			return { x: tbox.x + hw, y: tbox.y - (this.controls.angle && this.controls.angleDistance ? this.controls.angleDistance / engineScale.y : 0) };
		case 'LT': return { x: tbox.x, y: tbox.y };
		case 'CT': return { x: tbox.x + hw, y: tbox.y };
		case 'RT': return { x: tbox.x + tbox.width, y: tbox.y };
		case 'LC': return { x: tbox.x, y: tbox.y + hh };
		case 'RC': return { x: tbox.x + tbox.width, y: tbox.y + hh };
		case 'LB': return { x: tbox.x, y: tbox.y + tbox.height };
		case 'CB': return { x: tbox.x + hw, y: tbox.y + tbox.height };
		case 'RB': return { x: tbox.x + tbox.width, y: tbox.y + tbox.height };
		}
	},

	/**
	 * 도형을 회전하거나 위치 및 크기를 설정합니다.
	 * @param {String} point 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
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
		
		var pc = page.toCanvas(px, py);
		px = pc.x;
		py = pc.y;
	
		if (point == 'A'){
			//var radian = AbGraphics.angle.radian(centerX, centerY, px, py);
			//var rangle = AbGraphics.angle.rad2deg(radian);

			var angle = AbGraphics.angle.get(centerX, centerY, px, py);
			var incAngle = angle - this.target.angle;

			this.target.setAngle(angle);
			//console.log('[ANGLE] ' + this.target.angle + ', [ORIGIN] ' + rangle);

			return incAngle;
		}else{
			var x1 = tbox.x, y1 = tbox.y, x2 = tbox.x + tbox.width, y2 = tbox.y + tbox.height;
			var hw = (tbox.width >> 1), hh = (tbox.height >> 1);

			var unrotatedPx = AbGraphics.angle.point(-this.target.angle, centerX, centerY, px, py);
			px = unrotatedPx.x;
			py = unrotatedPx.y;

			switch(point){
			case 'LT':
				x1 = px;
				y1 = py;
				break;
			case 'CT':
				y1 = py;
				break;
			case 'RT':
				x2 = px;
				y1 = py;
				break;
			case 'LC':
				x1 = px;
				break;
			case 'RC':
				x2 = px;
				break;
			case 'LB':
				x1 = px;
				y2 = py;
				break;
			case 'CB':
				y2 = py;
				break;
			case 'RB':
				x2 = px;
				y2 = py;
				break;
			}

			var cr = true;
			//var rwidth = Math.abs(x2 - x1), rheight = Math.abs(y2 - y1);
			var rwidth = x2 - x1, rheight = y2 - y1;
			if (AbCommon.supportResizable(this.target)){
				var r = this.target.resizable(rwidth / page.scale.x, rheight / page.scale.y);
				r.width *= page.scale.x;
				r.height *= page.scale.y;

				cr = r.result;
				rwidth = r.width;
				rheight = r.height;
				// if (cr === false) { rwidth = r.width; rheight = r.height; }
				// else if (cr === 'h' || cr === 'H') { rwidth = r.width; }
				// else if (cr === 'v' || cr === 'V') { rheight = r.height; }
			}else{
				var minW = 1, minH = 1;
				if (AbCommon.hasMinimum(this.target)){
					var m = this.target.minimum();

					//console.log('[LIMIT][M] width=' + m.width + ', height=' + m.height);

					minW = m.width * page.scale.x;
					minH = m.height * page.scale.y;
				}

				var overX = rwidth < minW;
				var overY = rheight < minH;
	
				rwidth = minW;
				rheight = minH;

				if (overX && overY) { cr = false; }
				else if (overX) { cr = 'h'; }
				else if (overY) { cr = 'v'; }
			}

			//console.log('[LIMIT]['+point+'] cr=' + cr + ', rwidth=' + rwidth + ', rheight=' + rheight + ', m-width=' + (x2 - x1) + ', m-height=' + (y2 - y1));

			if (cr === false){
				switch(point){
				case 'LT':
					x1 = x2 - rwidth;
					y1 = y2 - rheight;
					break;
				case 'CT':
					x2 = x1 + rwidth;
					y1 = y2 - rheight;
					break;
				case 'RT':
					x2 = x1 + rwidth;
					y1 = y2 - rheight;
					break;
				case 'LC':
					x1 = x2 - rwidth;
					y2 = y1 + rheight;
					break;
				case 'RC':
					x2 = x1 + rwidth;
					y2 = y1 + rheight;
					break;
				case 'LB':
					x1 = x2 - rwidth;
					y2 = y1 + rheight;
					break;
				case 'CB':
					x2 = x1 + rwidth;
					y2 = y1 + rheight;
					break;
				case 'RB':
					x2 = x1 + rwidth;
					y2 = y1 + rheight;
					break;
				}
			}else if (cr === 'h' || cr === 'H'){
				switch(point){
				case 'LT':
					x1 = x2 - rwidth;
					break;
				case 'CT':
					x2 = x1 + rwidth;
					break;
				case 'RT':
					x2 = x1 + rwidth;
					break;
				case 'LC':
					x1 = x2 - rwidth;
					break;
				case 'RC':
					x2 = x1 + rwidth;
					break;
				case 'LB':
					x1 = x2 - rwidth;
					break;
				case 'CB':
					x2 = x1 + rwidth;
					break;
				case 'RB':
					x2 = x1 + rwidth;
					break;
				}
			}else if (cr === 'v' || cr === 'V'){
				switch(point){
				case 'LT':
					y1 = y2 - rheight;
					break;
				case 'CT':
					y1 = y2 - rheight;
					break;
				case 'RT':
					y1 = y2 - rheight;
					break;
				case 'LC':
					y2 = y1 + rheight;
					break;
				case 'RC':
					y2 = y1 + rheight;
					break;
				case 'LB':
					y2 = y1 + rheight;
					break;
				case 'CB':
					y2 = y1 + rheight;
					break;
				case 'RB':
					y2 = y1 + rheight;
					break;
				}
			}
		
			var box = this.correct(point, x1, y1, x2 - x1, y2 - y1, tbox);

			// //var angle = AbGraphics.angle.toShapeAngle(AbGraphics.angle.get(box.x, box.y, box.x + box.width, box.y));
			// var angle = this.target.angle;
			// if (y2 < y1) angle += 180;
			// console.log('[RESIZE][ANGLE] ' + angle + ', current=' + this.target.angle);

			box = page.fromCanvasBox(box);
			
			this.target.box(box.x, box.y, box.width, box.height);

			return unrotatedPx;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 위치 및 크기를 보정한다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>인자4</th><th>인자5</th><th>인자6</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>3개</td><td>point: String</td><td>box: {@link Box}</td><td>origin: {@link Size}|{@link Box}|{@link HTMLBounds}</td><td></td><td></td><td></td><td></td><td></td>
	 * </tr>
	 * <tr>
	 * 	<td>4개</td><td>point: String</td><td>box: {@link Box}</td><td>originWidth: Number</td><td>originHeight: Number</td><td></td><td></td><td></td><td></td>
	 * </tr>
	 * <tr>
	 * 	<td>6개</td><td>point: String</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>origin: {@link Size}|{@link Box}|{@link HTMLBounds}</td><td></td><td></td>
	 * </tr>
	 * <tr>
	 * 	<td>7개</td><td>point: String</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>originWidth: Number</td><td>originHeight: Number</td><td></td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {String} 0 편집점
	 * @param {(Number|Box)} 1 X좌표 또는 {@link Box}
	 * @param {(Number|Size|Box|HTMLBounds)} 2 Y좌표 또는 폭 또는 {@link Size} 또는 {@link Box} 또는 {@link HTMLBounds}
	 * @param {Number} [3] 높이 또는 폭
	 * @param {Number} [4] 높이
	 * @param {(Number|Size|Box|HTMLBounds)} [5] 폭 또는 {@link Size} 또는 {@link Box} 또는 {@link HTMLBounds}
	 * @param {Number} [6] 높이
	 * @return {Box} 보정된 크기
	 */
	correct: function (){
		var x = 0, y = 0, w = 0, h = 0;
		var ow = 0, oh = 0, point = null;
		if (arguments.length == 3){
			point = arguments[0];
			x = arguments[1].x;
			y = arguments[1].y;
			w = arguments[1].width;
			h = arguments[1].height;
			ow = arguments[2].width;
			oh = arguments[2].height;
		}else if (arguments.length == 4){
			point = arguments[0];
			x = arguments[1].x;
			y = arguments[1].y;
			w = arguments[1].width;
			h = arguments[1].height;
			ow = arguments[2];
			oh = arguments[3];
		}else if (arguments.length == 6){
			point = arguments[0];
			x = arguments[1];
			y = arguments[2];
			w = arguments[3];
			h = arguments[4];
			ow = arguments[5].width;
			oh = arguments[5].height;			
		}else if (arguments.length == 7){
			point = arguments[0];
			x = arguments[1];
			y = arguments[2];
			w = arguments[3];
			h = arguments[4];
			ow = arguments[5];
			oh = arguments[6];			
		}else
			return null;
		
		var hw = (ow >> 1), hh = (oh >> 1);
		var xval = w - ow;
		var yval = h - oh;

		// 보정 작업
		switch(point){
		case 'LT':
			hw += xval;
			hh += yval;
			break;
		case 'RT':
			hh += yval;
			break;
		case 'CT':
			hh += yval;
			break;
		case 'LC':
		case 'LB':
			hw += xval;
			break;
		}

		// var engineScale = AbCommon.engineScale(this.target);
		// hw *= engineScale.x;
		// hh *= engineScale.y;

		// w *= engineScale.x;
		// h *= engineScale.y;

		var sr = AbGraphics.angle.point(this.target.angle, hw, hh, 0, 0);		
		var pr = AbGraphics.angle.point(this.target.angle, (w >> 1), (h >> 1), 0, 0);
		x -= pr.x - sr.x;
		y -= pr.y - sr.y;
		
		return {
			x: x,
			y: y,
			width: w,
			height: h
		};
	},

	//-----------------------------------------------------------

	/**
	 * 편집점을 그립니다.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @param {String} [type=box] 편집점 타입 (circle|box)
	 */
	drawControl: function (ctx, x, y, type){
		if (!type) type = 'box';

		var style = this.target.focused ? this.style.focus : this.style.default;

		var size = style.control.size;
		var halfsiz = size >> 1;

		if (type == 'circle'){
			if (style.control.color){
				ctx.beginPath();
				ctx.arc(x, y, halfsiz, 0, 360);
				ctx.fill();
				ctx.closePath();
			}

			if (style.control.stroke.color && style.control.stroke.width){
				ctx.beginPath();
				ctx.arc(x, y, halfsiz, 0, 360);
				ctx.stroke();
				ctx.closePath();
			}
		}else{
			if (style.control.color)
				ctx.fillRect(x - halfsiz, y - halfsiz, size, size);

			if (style.control.stroke.color && style.control.stroke.width)
				ctx.strokeRect(x - halfsiz, y - halfsiz, size, size);
		}
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
	 * 편집점 지시자를 그립니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 */
	draw: function(ctx){
		var tbox = this.targetScaledBox();
		var tpadding = this.target.padding() || { left: 0, top: 0, right: 0, bottom: 0 };	
		var angle = this.target.angle;
		var style = this.target.focused ? this.style.focus : this.style.default;

		ctx.save();

		//angle = 0;
		var cx = (tbox.width >> 1), cy = (tbox.height >> 1);
		if (this.target.angle){
			ctx.translate(tbox.x + cx, tbox.y + cy);
			ctx.rotate(AbGraphics.angle.deg2rad(this.target.angle));
			ctx.translate(-(tpadding.left + cx), -(tpadding.top + cy));
		}else{
			ctx.translate(tbox.x - tpadding.left, tbox.y - tpadding.top);
		}

		tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
		cx = (tbox.width >> 1), cy = (tbox.height >> 1);
		
		ctx.strokeStyle = style.color;
		ctx.lineWidth = style.width;

		ctx.strokeRect(0, 0, tbox.width, tbox.height);

		ctx.strokeStyle = style.control.stroke.color;
		ctx.lineWidth = style.control.stroke.width;
		ctx.fillStyle = style.control.color;

		if (this.controls.angle && this.controls.angleDistance){
			if (this.controls.angleDistance){
				ctx.beginPath();
				ctx.moveTo(cx, 0);
				ctx.lineTo(cx, -this.controls.angleDistance);
				ctx.stroke();
			}
			this.drawControl(ctx, cx, -this.controls.angleDistance, 'circle');
		}

		if (this.controls.leftTop) this.drawControl(ctx, 0, 0);
		if (this.controls.top) this.drawControl(ctx, cx, 0);
		if (this.controls.rightTop) this.drawControl(ctx, tbox.width, 0);
		if (this.controls.left) this.drawControl(ctx, 0, cy);
		if (this.controls.right) this.drawControl(ctx, tbox.width, cy);
		if (this.controls.leftBottom) this.drawControl(ctx, 0, tbox.height);
		if (this.controls.bottom) this.drawControl(ctx, cx, tbox.height);
		if (this.controls.rightBottom) this.drawControl(ctx, tbox.width, tbox.height);
		
		ctx.restore();
	},
}