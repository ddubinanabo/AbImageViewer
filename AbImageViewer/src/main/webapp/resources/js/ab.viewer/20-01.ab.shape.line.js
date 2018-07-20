function AbShapeLine(options){
	if (!options) options = {};
	var style = options.style || {};
	var headStyle = style.head || {};
	var tailStyle = style.tail || {};

	this.name = 'line';		// name of shape
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
	};

	this.prepare();
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeLine.prototype = {
	constructor: AbShapeLine,

	BRACKET_SIZE: 0.4,

	//-----------------------------------------------------------

	arrowStyle: function (style, defaultStyle){
		if (!style) return defaultStyle;

		switch (style){
		case 'trigngle': case 'diamond': case 'circle': case 'bracket': case 'none': return style;
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

	//-----------------------------------------------------------

	padding: function() { return { left: 0, top: 5, right: 0, bottom: 5 }; },
	contains: function(x, y, w, h){ return this.indicator.contains.apply(this.indicator, arguments); },
	editable: function (x, y){ if (this.selected){ return this.indicator.editable(x, y); } return null; },
	editPos: function (point){ return this.indicator.editPos(point); },
	resize: function (point, px, py){ return this.indicator.resize(point, px, py); },
	measure: function(){},

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