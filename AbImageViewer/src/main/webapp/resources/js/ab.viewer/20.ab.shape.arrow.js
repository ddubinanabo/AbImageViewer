function AbShapeArrow(options){
	if (!options) options = {};
	var style = options.style || {};
	var headStyle = style.head || {};

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

	this.style = {
		width: style.width || 1,
		color: style.color || '#FF0000', //'#840200',
		head: {
			size: headStyle.size || 14,
		}
	};

	this.prepare();
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeArrow.prototype = {
	constructor: AbShapeArrow,

	//-----------------------------------------------------------

	styleDesc: function(){
		return {
			descs: [
				{ name: 'width', text: '두께', style: 'select', type: 'number', values: 'lineWidth' },
				{ name: 'color', text: '색상', style: 'color', notset: false },
				{ name: 'head', text: '', childs: [
					{ name: 'size', text: '크기', style: 'text', type: 'number', range: { start: 8, end: 30 } },
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
		
		var head = serializer.addGroup(style, 'head');
		serializer.add(head, 'size', this.style.head.size);

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
		//return AbGraphics.box.inflate(box.x, box.y, box.width, box.height, this.style.head.size, this.style.head.size);
		return { width: this.style.head.size, height: this.style.head.size };
	},

	//-----------------------------------------------------------

	padding: function() { return { left: 0, top: this.style.head.size >> 1, right: 0, bottom: this.style.head.size >> 1 }; },
	contains: function(x, y, w, h){ return this.indicator.contains.apply(this.indicator, arguments); },
	editable: function (x, y){ if (this.selected){ return this.indicator.editable(x, y); } return null; },
	editPos: function (point){ return this.indicator.editPos(point); },
	resize: function (point, px, py){ return this.indicator.resize(point, px, py); },
	measure: function(){},

	//-----------------------------------------------------------

	draw: function(ctx, page, direct){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;
		
		ctx.save();

		var headSize = this.style.head.size;
		var halfHeadSize = headSize / 2;

		var x1 = this.x1 * scaleX, y1 = this.y1 * scaleY;
		var x2 = this.x2 * scaleX, y2 = this.y2 * scaleY;

		var distance = AbGraphics.distance(x1, y1, x2, y2);
		
		var cx = ((x2 - x1) >> 1), cy = ((y2 - y1) >> 1);
		ctx.translate(x1 + cx, y1 + cy);
		//if (this.angle) ctx.rotate(AbGraphics.angle.deg2rad(this.angle));

		var cx2 = x1 + cx, cy2 = y1 + cy;
		var rad = AbGraphics.angle.radian90(x1, y1, x2, y2);
		
		//console.log('[RAD]' + rad + ', angle=' + AbGraphics.angle.rad2deg(rad) + ', distance=' + distance + ', angle2=' + AbGraphics.angle.get(x1, y1, x2, y2));

		var pend = AbGraphics.rotate.pointByDistance(rad, distance - headSize);
		var ox2 = x2, oy2 = y2;

		x2 = x1 + pend.x;
		y2 = y1 + pend.y;

		x1 -= cx2;
		y1 -= cy2;
		x2 -= cx2;
		y2 -= cy2;

		ox2 -= cx2;
		oy2 -= cy2;

		ctx.fillStyle = this.style.color;
		ctx.strokeStyle = this.style.color;
		ctx.lineWidth = this.style.width;

		// line
		ctx.beginPath();
		ctx.moveTo(Math.round(x1), Math.round(y1));
		ctx.lineTo(Math.round(x2), Math.round(y2));
		ctx.stroke();
		ctx.closePath();
		
		// arrow
		var p1 = AbGraphics.rotate.point(rad, ox2, oy2, ox2 - headSize,  oy2 - halfHeadSize);
		var p2 = AbGraphics.rotate.point(rad, ox2, oy2, ox2,  oy2);
		var p3 = AbGraphics.rotate.point(rad, ox2, oy2, ox2 - headSize,  oy2 + halfHeadSize);

		/*
		var p1 = { x: ox2 - headSize,  y: oy2 - halfHeadSize };
		var p2 = { x: ox2,  y: oy2 };
		var p3 = { x: ox2 - headSize,  y: oy2 + halfHeadSize };
		*/

		ctx.beginPath();
		ctx.lineTo(Math.round(p1.x), Math.round(p1.y));
		ctx.lineTo(Math.round(p2.x), Math.round(p2.y));
		ctx.lineTo(Math.round(p3.x), Math.round(p3.y));
		ctx.fill();		
		ctx.closePath();
	
		AbShapeTool.endDraw(this, ctx);
	},
}