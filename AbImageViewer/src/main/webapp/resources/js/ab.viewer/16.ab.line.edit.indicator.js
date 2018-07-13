function AbLineEditIndicator(options){
	if (!options) options = {};

	//-----------------------------------------------------------

	this.target = options.target || null;

	//-----------------------------------------------------------

	var controls = options.controls || {};

	this.controls = {
		angle: controls.angle || true,
		angleDistance: controls.angleDistance || 30,

		left: controls.left || true,
		right: controls.right || true,
	};

	var style = controls.style || {};
	var defaultStyle = style.default || {};
	var focusStyle = style.focus || {};
	var defaultControlStyle = defaultStyle.control || {};
	var defaultControlStrokeStyle = defaultControlStyle.stroke || {};
	var focusControlStyle = focusStyle.control || {};
	var focusControlStrokeStyle = focusControlStyle.stroke || {};

	this.style = {
		default: {
			control: {
				stroke: {
					color: focusControlStrokeStyle.color || '#BC719B', // '#4787C7', // '#4682B4',
					width: focusControlStrokeStyle.width || 1,
				},
		
				color: focusControlStyle.color || '#FF99D3', // '#389CFF', // '#99CCFF',	
				size: focusControlStyle.size || 10,
			},
	
			color: focusStyle.color || '#BC719B', // '#4787C7', // '#00BFFF',
			width: focusStyle.width || 1,							
		},

		focus: {
			control: {
				stroke: {
					color: defaultControlStrokeStyle.color || '#4682B4',
					width: defaultControlStrokeStyle.width || 1,
				},
		
				color: defaultControlStyle.color || '#99CCFF',	
				size: defaultControlStyle.size || 10,
			},
	
			color: defaultStyle.color || '#00BFFF',
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

	$$CLONE: true, // AbCommon.cloneShape() 호출 시 이 클래스를 복사할 지 여부, true면 객체 복사 실행, false면 참조
	$$CHAIN: 'target',  // AbCommon.cloneShape() 호출 시 이 클래스의 프로퍼티에 대상자를 연결하지 여부, 값이 있으면 해당 값이 가르키는 프로퍼티로 대상자를 연결한다

	//-----------------------------------------------------------
	
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

	contains: function(x, y, w, h){
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

	//-----------------------------------------------------------

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

	containsControl: function (x, y, px, py){
		var style = this.target.focused ? this.style.focus : this.style.default;
		var strokeWidth = style.control.stroke.width;

		var size = style.control.size;
		var halfsiz = size >> 1;

		var box = AbGraphics.box.inflate(x - halfsiz, y - halfsiz, size, size, strokeWidth);

		return AbGraphics.contains.box(box.x, box.y, box.width, box.height, px, py);
	},

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
			console.log('[ANGLE] ' + angle + ', INC=' + incAngle);

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

	targetScaledRect: function (){
		var trect = this.target.rect();

		var engineScale = AbCommon.engineScale(this.target);
		trect.x1 *= engineScale.x;
		trect.y1 *= engineScale.y;
		trect.x2 *= engineScale.x;
		trect.y2 *= engineScale.y;

		return trect;
	},

	draw: function(ctx){
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
}