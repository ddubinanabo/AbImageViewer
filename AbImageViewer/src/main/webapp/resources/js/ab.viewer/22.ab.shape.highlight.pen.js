function AbShapeHighlightPen(options){
	if (!options) options = {};
	var style = options.style || {};

	this.name = 'highlightpen';	// name of shape
	this.type = 'annotation';		// annotation, masking
	this.shapeType = 'shape';		// shape, polygon, image
	this.shapeStyle = 'box';		// box, line
	this.token = null;				// token for using	

	this.selected = false;
	this.focused = false;

	this.indicator = AbCommon.isDefined(AbBoxEditIndicator) ? new AbBoxEditIndicator({ target: this }) : null;

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

	this.style = {
		width: style.width || 5,
		height: style.height || 20,
		alpha: style.alpha || 0.65,
		color: style.color || 'rgb(255,255,0)', //'#FFFF66',
	};

	// editor에 생성시 크기를 지정할 필요없음을 명시
	this.creationSize = 'auto';
	// editor에 좌료를 수집해야 한다는 것을 명시
	this.collectPoints = true;
	this.points = $.isArray(options.points) ? options.points : [];
	this.path = [];

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

	reset: function(){
		this.path.splice(0, this.path.length);
		this.points.splice(0, this.points.length);
		this.minPointX = this.minPointY = this.maxPointX = this.maxPointY = 0;
	},

	//-----------------------------------------------------------

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
	
	notify: function(cmd){
		if (cmd == 'styled'){
			this.prepare();
		}
	},

	addPoints: function (points){
		var len = points.length;
		for (var i=0; i < len; i++)
			this.addPoint(points[i]);
		this.endPoint();
	},

	//-----------------------------------------------------------

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

	setAngle: function (degree){ this.angle = degree; },

	move: function(x, y, increase){
		if (increase === true){
			this.x += x;
			this.y += y;
		}else{
			this.x = x;
			this.y = y;
		}
	},

	hasPointSize: function (){ return this.minPointX && this.minPointY && this.maxPointX && this.maxPointY; },
	hasSize: function (){ return this.x && this.y && this.width && this.height; },

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

	center: function (){ return { x: this.x + (this.width >> 1), y: this.y + (this.height >> 1) }; },
	creationMinimum: function() { return { width: 0, height: 0 }; },
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

	padding: function() { return { left: 0, top: 0, right: 0, bottom: 0 }; },
	//contains: function(x, y, w, h){ return this.indicator.contains.apply(this.indicator, arguments); },
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
	editable: function (x, y){ if (this.selected){ return this.indicator.editable(x, y); } return null; },
	editPos: function (point){ return this.indicator.editPos(point); },
	resize: function (point, px, py){ return this.indicator.resize(point, px, py); },
	measure: function(){},

	//-----------------------------------------------------------

	drawStyle: function (ctx){
		ctx.fillStyle = this.style.color;
		ctx.lineJoin = 'round';

		ctx.globalAlpha = this.style.alpha;
	},

	addSinglePath: function(path, x, y, ws, hs){
		// ㅁ
		this.path.push({ x: x - ws, y: y - hs, move: true, horiz:'-', vert:'-' });
		this.path.push({ x: x + ws, y: y - hs, horiz:'+', vert:'-' });
		this.path.push({ x: x + ws, y: y + hs, horiz:'+', vert:'+' });
		this.path.push({ x: x - ws, y: y + hs, horiz:'-', vert:'+' });
	},

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

	CORRECT_WEIGHT: false,

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