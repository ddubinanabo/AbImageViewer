function AbShapeRectangle(options){
	if (!options) options = {};
	var style = options.style || {};
	var strokeStyle = style.stroke || {};

	this.name = 'rectangle';	// name of shape
	this.type = 'annotation';	// annotation, masking
	this.shapeType = 'shape';	// shape, polygon, image
	this.shapeStyle = 'box';	// box, line
	this.token = null;			// for customize

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
		stroke: {
			width: AbCommon.isNumber(strokeStyle.width) ? strokeStyle.width : 1,
			color: strokeStyle.color || '#41719C', //'#840200',
		},

		color: AbCommon.isDefined(style.color) ? style.color : 'rgba(91,155,213,0.8)', //'#FF0000',
	};
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeRectangle.prototype = {
	constructor: AbShapeRectangle,

	//-----------------------------------------------------------

	styleDesc: function(){
		return {
			select: [ 'color', 'stroke.width' ],
			descs: [
				{ name: 'color', text: '채우기색상', style: 'color' },
				{ name: 'stroke', text: '선 스타일', childs: [
					{ name: 'width', text: '두께', style: 'select', type: 'number', values: 'lineWidth' },
					{ name: 'color', text: '색상', style: 'color', alpha: false },
				] },
			],
		};
	},

	//-----------------------------------------------------------

	prepare: function(){},
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

		return serializer.serialize();
	},

	//-----------------------------------------------------------
	
	notify: function(cmd){},

	//-----------------------------------------------------------

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
	minimum: function() { return { width: 10, height: 10 }; },

	//-----------------------------------------------------------

	padding: function() { return { left: 0, top: 0, right: 0, bottom: 0 }; },
	contains: function(x, y, w, h){
		//var rgb = this.style.color ? AbCss.color(this.style.color) : [0,0,0,0];
		if (this.style.color)
			return this.indicator.contains.apply(this.indicator, arguments);
		else
			return this.indicator.containsSide.apply(this.indicator, arguments);
	},
	editable: function (x, y){ if (this.selected) return this.indicator.editable(x, y); return null; },
	editPos: function (point){ return this.indicator.editPos(point); },
	resize: function (point, px, py){ return this.indicator.resize(point, px, py); },
	measure: function(){},
	validLineDistance: function () { return this.style.stroke && this.style.stroke.width ? this.style.stroke.width: 1; },

	//-----------------------------------------------------------

	draw: function(ctx, page, direct){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;

		AbShapeTool.beginRectDraw(this, ctx, page);
		
		if (this.style.color){
			ctx.fillStyle = this.style.color;
			ctx.fillRect(0, 0, this.width * scaleX, this.height * scaleY);
		}

		if (this.style.stroke && this.style.stroke.width && this.style.stroke.color){
			ctx.strokeStyle = this.style.stroke.color;
			ctx.lineWidth = this.style.stroke.width;

			ctx.strokeRect(0, 0, this.width * scaleX, this.height * scaleY);
		}
		
		AbShapeTool.endDraw(this, ctx);
	},
}