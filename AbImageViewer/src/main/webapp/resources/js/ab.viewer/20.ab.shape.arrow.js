function AbShapeArrow(options){
	if (!options) options = {};
	var style = options.style || {};
	var headStyle = style.head || {};
	var tailStyle = style.tail || {};

	this.name = 'arrow';		// name of shape
	this.type = 'annotation';	// annotation, masking
	this.shapeType = 'shape';	// shape, polygon, image
	this.shapeStyle = 'line';	// box, line
	this.token = null;			// token for using	
	
	this.selected = false;
	this.focused = false;

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

	this.angle = 0;
	//console.log('[INIT][ANGLE] ' + this.angle);

	var lw = style.width || 1;

	this.style = {
		width: lw,
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

	BRACKET_SIZE: 0.4,

	//-----------------------------------------------------------

	arrowStyle: function (style, defaultStyle){
		if (!style) return defaultStyle;

		switch (style){
		case 'triangle': case 'diamond': case 'circle': case 'bracket': case 'none': return style;
		}
		return defaultStyle;
	},

	//-----------------------------------------------------------

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

	prepare: function (){
		var center = this.center();
		this.angle = AbGraphics.angle.toShapeAngle(AbGraphics.angle.get(center.x, center.y, this.x2, this.y2));		
	},
	reset: function(){},

	//-----------------------------------------------------------

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
		
		var head = serializer.addGroup(style, 'head');
		serializer.add(head, 'size', this.style.head.size);
		serializer.add(head, 'style', this.style.head.type);
		
		var tail = serializer.addGroup(style, 'tail');
		serializer.add(tail, 'size', this.style.tail.size);
		serializer.add(tail, 'style', this.style.tail.style);

		return serializer.serialize();
	},

	//-----------------------------------------------------------
	
	notify: function(cmd){},

	//-----------------------------------------------------------

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

	center: function (){ return { x: this.x1 + ((this.x2 - this.x1) / 2), y: this.y1 + ((this.y2 - this.y1) / 2) }; },
	restoreMinimumSize: function() {
		var siz = this.controlSize();
		//return AbGraphics.box.inflate(box.x, box.y, box.width, box.height, this.style.head.size, this.style.head.size);
		return { width: siz, height: siz };
	},

	//-----------------------------------------------------------

	padding: function() {
		var siz = this.controlSize();
		return { left: 0, top: siz >> 1, right: 0, bottom: siz >> 1 };
	},
	contains: function(x, y, w, h){ return this.indicator.contains.apply(this.indicator, arguments); },
	editable: function (x, y){ if (this.selected){ return this.indicator.editable(x, y); } return null; },
	editPos: function (point){ return this.indicator.editPos(point); },
	resize: function (point, px, py){ return this.indicator.resize(point, px, py); },
	measure: function(){},

	//-----------------------------------------------------------

	headSize: function() { return this.style.head.type != 'none' ? this.style.head.size : 0; },
	tailSize: function() { return this.style.tail.type != 'none' ? this.style.tail.size : 0; },
	controlSize: function() {
		var headSize = this.headSize();
		var tailSize = this.tailSize();
		return headSize > tailSize ? headSize : tailSize;
	},

	//-----------------------------------------------------------

	drawHeadArrow: function(ctx, d){
		var style = d.style;
		var halfSize = d.size ? d.size / 2 : 0;

		if (style === 'triangle'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - d.size,  d.y - halfSize);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - d.size,  d.y + halfSize);

			ctx.beginPath();
			ctx.lineTo(Math.round(p1.x), Math.round(p1.y));
			ctx.lineTo(Math.round(p2.x), Math.round(p2.y));
			ctx.lineTo(Math.round(p3.x), Math.round(p3.y));
			ctx.fill();		
			ctx.closePath();

			return AbGraphics.rotate.pointByDistance(d.rad, d.size);
		} else if (style === 'diamond'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - d.size,  d.y);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - halfSize,  d.y - halfSize);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p4 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - halfSize,  d.y + halfSize);

			ctx.beginPath();
			ctx.lineTo(Math.round(p1.x), Math.round(p1.y));
			ctx.lineTo(Math.round(p2.x), Math.round(p2.y));
			ctx.lineTo(Math.round(p3.x), Math.round(p3.y));
			ctx.lineTo(Math.round(p4.x), Math.round(p4.y));
			ctx.fill();		
			ctx.closePath();

			return AbGraphics.rotate.pointByDistance(d.rad, d.size);
		} else if (style === 'circle'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - halfSize, d.y);

			ctx.beginPath();
			ctx.arc(Math.round(p1.x), Math.round(p1.y), halfSize, 0, 360);
			ctx.fill();		
			ctx.closePath();

			return AbGraphics.rotate.pointByDistance(d.rad, d.size);
		} else if (style === 'bracket'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - d.size,  d.y - halfSize);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - d.size,  d.y + halfSize);
			var p4 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x - (d.size * AbShapeArrow.prototype.BRACKET_SIZE),  d.y);

			ctx.beginPath();
			ctx.lineTo(Math.round(p1.x), Math.round(p1.y));
			ctx.lineTo(Math.round(p2.x), Math.round(p2.y));
			ctx.lineTo(Math.round(p3.x), Math.round(p3.y));
			ctx.lineTo(Math.round(p4.x), Math.round(p4.y));
			ctx.fill();		
			ctx.closePath();

			return AbGraphics.rotate.pointByDistance(d.rad, (d.size * AbShapeArrow.prototype.BRACKET_SIZE));
		}

		return { x: 0, y: 0 };
	},

	//-----------------------------------------------------------

	drawTailArrow: function(ctx, d){
		var style = d.style;
		var halfSize = d.size ? d.size / 2 : 0;

		if (style === 'triangle'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + d.size,  d.y - halfSize);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + d.size,  d.y + halfSize);

			ctx.beginPath();
			ctx.lineTo(Math.round(p1.x), Math.round(p1.y));
			ctx.lineTo(Math.round(p2.x), Math.round(p2.y));
			ctx.lineTo(Math.round(p3.x), Math.round(p3.y));
			ctx.fill();		
			ctx.closePath();

			return AbGraphics.rotate.pointByDistance(d.rad, d.size);
		} else if (style === 'diamond'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + d.size,  d.y);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + halfSize,  d.y - halfSize);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p4 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + halfSize,  d.y + halfSize);

			ctx.beginPath();
			ctx.lineTo(Math.round(p1.x), Math.round(p1.y));
			ctx.lineTo(Math.round(p2.x), Math.round(p2.y));
			ctx.lineTo(Math.round(p3.x), Math.round(p3.y));
			ctx.lineTo(Math.round(p4.x), Math.round(p4.y));
			ctx.fill();		
			ctx.closePath();

			return AbGraphics.rotate.pointByDistance(d.rad, d.size);
		} else if (style === 'circle'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + halfSize, d.y);

			ctx.beginPath();
			ctx.arc(Math.round(p1.x), Math.round(p1.y), halfSize, 0, 360);
			ctx.fill();		
			ctx.closePath();

			return AbGraphics.rotate.pointByDistance(d.rad, d.size);
		} else if (style === 'bracket'){
			var p1 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + d.size,  d.y - halfSize);
			var p2 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x,  d.y);
			var p3 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + d.size,  d.y + halfSize);
			var p4 = AbGraphics.rotate.point(d.rad, d.x, d.y, d.x + (d.size * AbShapeArrow.prototype.BRACKET_SIZE),  d.y);

			ctx.beginPath();
			ctx.lineTo(Math.round(p1.x), Math.round(p1.y));
			ctx.lineTo(Math.round(p2.x), Math.round(p2.y));
			ctx.lineTo(Math.round(p3.x), Math.round(p3.y));
			ctx.lineTo(Math.round(p4.x), Math.round(p4.y));
			ctx.fill();		
			ctx.closePath();

			return AbGraphics.rotate.pointByDistance(d.rad, (d.size * AbShapeArrow.prototype.BRACKET_SIZE));
		}
		return { x: 0, y: 0 };
	},

	//-----------------------------------------------------------

	draw: function(ctx, page, direct){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;
		
		ctx.save();

		var x1 = this.x1 * scaleX, y1 = this.y1 * scaleY;
		var x2 = this.x2 * scaleX, y2 = this.y2 * scaleY;

		var distance = AbGraphics.distance(x1, y1, x2, y2);
		
		var cx = ((x2 - x1) >> 1), cy = ((y2 - y1) >> 1);
		ctx.translate(x1 + cx, y1 + cy);
		//if (this.angle) ctx.rotate(AbGraphics.angle.deg2rad(this.angle));

		var cx2 = x1 + cx, cy2 = y1 + cy;
		var rad = AbGraphics.angle.radian90(x1, y1, x2, y2);
		
		//console.log('[RAD]' + rad + ', angle=' + AbGraphics.angle.rad2deg(rad) + ', distance=' + distance + ', angle2=' + AbGraphics.angle.get(x1, y1, x2, y2));

		ctx.fillStyle = this.style.color;
		ctx.strokeStyle = this.style.color;
		ctx.lineWidth = this.style.width;
		ctx.lineCap = 'butt';
		
		// head arrow
		var r = this.drawHeadArrow(ctx, {
			distance: distance,
			style: this.style.head.style,
			size: this.headSize(),
			rad: rad,
			x: x2 - cx2,
			y: y2 - cy2,
		});

		x2 = x2 - r.x;
		y2 = y2 - r.y;
		
		// tail arrow
		r = this.drawTailArrow(ctx, {
			distance: distance,
			style: this.style.tail.style,
			size: this.tailSize(),
			rad: rad,
			x: x1 - cx2,
			y: y1 - cy2,
		});

		x1 = x1 + r.x;
		y1 = y1 + r.y;

		// calc for line
		x1 -= cx2;
		y1 -= cy2;
		x2 -= cx2;
		y2 -= cy2;

		if (this.style.dots){
			var r = AbGraphics.canvas.makeDash(this.style.dots);
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