function AbBoxEditIndicator(options){
	if (!options) options = {};

	//-----------------------------------------------------------

	this.target = options.target || null;

	//-----------------------------------------------------------

	var controls = options.controls || {};

	this.controls = {
		angle: controls.angle || true,
		angleDistance: controls.angleDistance || 30,

		leftTop: controls.leftTop || true,
		top: controls.top || true,
		rightTop: controls.rightTop || true,
		left: controls.left || true,
		right: controls.right || true,
		leftBottom: controls.leftBottom || true,
		bottom: controls.bottom || true,
		rightBottom: controls.rightBottom || true,
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

AbBoxEditIndicator.prototype = {
	constructor: AbBoxEditIndicator,

	//-----------------------------------------------------------

	$$CLONE: true, // AbCommon.cloneShape() 호출 시 이 클래스를 복사할 지 여부, true면 객체 복사 실행, false면 참조
	$$CHAIN: 'target',  // AbCommon.cloneShape() 호출 시 이 클래스의 프로퍼티에 대상자를 연결하지 여부, 값이 있으면 해당 값이 가르키는 프로퍼티로 대상자를 연결한다

	//-----------------------------------------------------------

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

	containsControl: function (x, y, px, py){
		var style = this.target.focused ? this.style.focus : this.style.default;
		var strokeWidth = style.control.stroke.width;

		var size = style.control.size;
		var halfsiz = size >> 1;

		var box = AbGraphics.box.inflate(x - halfsiz, y - halfsiz, size, size, strokeWidth);

		return AbGraphics.contains.box(box.x, box.y, box.width, box.height, px, py);
	},

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
			var angle = AbGraphics.angle.get(centerX, centerY, px, py);
			var incAngle = angle - this.target.angle;

			this.target.setAngle(angle);
			console.log('[ANGLE] ' + this.target.angle);

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

	correct: function (){
		var x = 0, y = 0, w = 0, h = 0;
		var ow = 0, oh = 0, point = null;
		if (arguments.length == 3){
			point = arguments[0];
			x = arguments[0];
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

	targetScaledBox: function (){
		var tbox = this.target.box();

		var engineScale = AbCommon.engineScale(this.target);
		tbox.x *= engineScale.x;
		tbox.y *= engineScale.y;
		tbox.width *= engineScale.x;
		tbox.height *= engineScale.y;

		return tbox;
	},

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