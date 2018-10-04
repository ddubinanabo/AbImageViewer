function AbShapeStamp(options){
	if (!options) options = {};
	var style = options.style || {};
	var strokeStyle = style.stroke || {};

	this.name = 'stamp';		// name of shape
	this.type = 'annotation';	// annotation, masking
	this.shapeType = 'shape';	// shape, polygon, image
	this.shapeStyle = 'box';	// box, line
	this.token = null;			// for customize
	var textPadding = { left: 6, top: 6, right: 6, bottom: 6 };

	this.selected = false;
	this.focused = false;

	this.indicator = AbCommon.isDefined(AbBoxEditIndicator) ? new AbBoxEditIndicator({ target: this }) : null;

	this.angle = options.angle || 0;
	this.textPadding = {
		left: textPadding.left,
		top: textPadding.top,
		right: textPadding.right,
		bottom: textPadding.bottom,

		horiz: function() { return this.left + this.right; },
		vert: function() { return this.top + this.bottom; },
	};

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

	this.extra = {
		borderWidth: 6, // pixel
		fontWeight: 700,
		lineHeight: 1.13,
		fontSizeFraction: 0.222,
		font: 'Times New Roman', // 맑은 고딕(Malgun Gothic), 굴림(gulim), 돋움(Dotum), Arial, Courier New, Times New Roman, Verdana, Helvetica, Tahoma
		fontSize: 40, // pixel
	};

	this.style = {
		color: AbCommon.isDefined(style.color) ? style.color : 'rgba(255,0,0,1)', //'#FF0000',
		text: AbCommon.isString(style.text) ? style.text : 'APPROVE',
	};
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeStamp.prototype = {
	constructor: AbShapeStamp,

	//-----------------------------------------------------------

	styleDesc: function(){
		return {
			descs: [
				{ name: 'color', text: '채우기색상', style: 'color', notset: false, },
				{ name: 'text', text: '내용', style: 'text', trim: true, notempty: true, size: 10 },
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
		serializer.add(style, 'text', this.style.text);

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
	contains: function(x, y, w, h){ return this.indicator.contains.apply(this.indicator, arguments); },
	editable: function (x, y){ if (this.selected) return this.indicator.editable(x, y); return null; },
	editPos: function (point){ return this.indicator.editPos(point); },
	resize: function (point, px, py){ return this.indicator.resize(point, px, py); },
	measure: function(){},
	validLineDistance: function () { return this.style.stroke && this.style.stroke.width ? this.style.stroke.width: 1; },

	//-----------------------------------------------------------

	measureText: function (ctx, text){
		var fontSize = this.extra.fontSize;
		ctx.font = this.extra.fontWeight + ' ' + fontSize + 'px ' + this.extra.font;
		//ctx.font = fontSize + 'px ' + this.extra.font;
		ctx.textBaseline = 'alphabetic';

		//console.log('[FONT-SIZE]' + fontSize);

		return { width: ctx.measureText(text).width, height: fontSize * this.extra.lineHeight };
	},

	drawStamp: function (ctx, x, y, w, h){
		var text = this.style.text;

		ctx.save();

		var gap = this.extra.borderWidth;
		var hgap = gap / 2;
		var padLeft = this.textPadding.left, padRight = this.textPadding.right;
		var padTop = this.textPadding.top, padBottom = this.textPadding.bottom;
	
		var inx = hgap + padLeft;
		var iny = hgap + padTop;
		var horiz = (gap + (padLeft + padRight)), vert = (gap + (padTop + padBottom));
	
		var r = this.measureText(ctx, text);
		var textWidth = r.width, textHeight = r.height;
		
		var zr = AbGraphics.box.zoom(textWidth + horiz, textHeight + vert, w, h);
		var rx = zr.ratioX;
		var ry = zr.ratioY;

		//console.log('[RATIO] (' + rx + ', ' + ry + ') text(' + textWidth + ', ' + textHeight + ') box(' + w + ', ' + h + ') font=' + ctx.font);

		var fontSize = this.extra.fontSize;
		var lineHeight = this.extra.lineHeight;
		var fontSizeFraction = this.extra.fontSizeFraction;

		var textHeight = fontSize * lineHeight;

		ctx.translate(x, y);
		ctx.scale(rx, ry);

		ctx.lineWidth = gap;
		ctx.strokeRect(hgap, hgap, (w / rx) - gap, (h / ry) - gap);

		ctx.translate(inx, iny);

		var txtx = 0;
		var txty = 0;
		txty += textHeight;
		txty -= textHeight * fontSizeFraction;

		ctx.translate(txtx, txty);

		ctx.fillText(text, 0, 0);
		ctx.restore();
	},

	//-----------------------------------------------------------

	draw: function(ctx, page, direct){
		var scale = page ? page.scale.x : 1;

		//var mx = this.measureText(ctx, this.style.text, 1); this.width = mx.width + this.textPadding.horiz() + this.extra.borderWidth; this.height = mx.height + this.textPadding.vert() + this.extra.borderWidth;
		//this.width *= 2; this.height *= 2;

		//var mx = this.measureText(ctx, this.style.text, 1);

		AbShapeTool.beginRectDraw(this, ctx, page);

		ctx.fillStyle = this.style.color;
		ctx.strokeStyle = this.style.color;

		ctx.scale(scale, scale);

		this.drawStamp(ctx, 0, 0, this.width, this.height);

		AbShapeTool.endDraw(this, ctx);
	},
}