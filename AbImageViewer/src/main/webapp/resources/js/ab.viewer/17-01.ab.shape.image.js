function AbShapeImage(options){
	if (!options) options = {};
	var source = options.source || {};
	var style = options.style || {};
	var strokeStyle = style.stroke || {};

	if (!source.data)
		throw new Error('[VECTOR-IMAGE] data is null or empty');

		if (!source.width || !source.height)
		throw new Error('[VECTOR-IMAGE] size(width, height) is not setted');

	this.name = options.name || 'image';		// name of shape
	this.type = 'annotation';	// annotation, masking
	this.shapeType = 'image';	// shape, polygon, image
	this.shapeStyle = 'box';	// box, line
	this.token = null;			// for customize

	this.selected = false;
	this.focused = false;

	this.indicator = AbCommon.isDefined(AbBoxEditIndicator) ? new AbBoxEditIndicator({ target: this }) : null;

	this.angle = options.angle || 0;

	this.source = {
		data: source.data || '',
		width: source.width,
		height: source.height,
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

	this.style = {
	};
	
	if (this.source.data){
		var img = new Image();
		img.onerror = function(e){
			this.$image = 'error';
			console.log(e);
		}
		img.src = this.source.data;
		
		this.$image = img;
		
//		AbCommon.loadImage(this.source.data)
//			.then(function (e){
//				this.$image = e;
//				if (this.engine)
//					this.engine.render();
//			}.bind(this))
//			.catch(function (e){
//				this.$image = 'error';
//	
//				console.log(e);
//			}.bind(this));
	}
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeImage.prototype = {
	constructor: AbShapeImage,

	//-----------------------------------------------------------

	styleDesc: function(){
		return {
			select: [],
			descs: [],
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

		var source = serializer.addGroup('source');
		serializer.add(source, 'data', this.source.data);
		serializer.add(source, 'width', this.source.width);
		serializer.add(source, 'height', this.source.height);

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

	// cloneShape 시 어드바이스
	adviceClone: function(){
		return {
			moveProps: ['$image'],
		};
	},

	//-----------------------------------------------------------

	draw: function(ctx, page, direct){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;

		AbShapeTool.beginRectDraw(this, ctx, page);

		if (this.$image){
			if (this.$image !== 'error' && this.$image !== 'loading'){
				try
				{
					ctx.drawImage(this.$image, 0, 0, this.width * scaleX, this.height * scaleY);
				}
				catch (e)
				{
					console.log(e);
				}
			}
		}else{
			this.$image = 'loading';

			AbCommon.loadImage(this.source.data)
				.then(function (e){
					this.$image = e;
					if (this.engine)
						this.engine.render();
				}.bind(this))
				.catch(function (e){
					this.$image = 'error';

					console.log(e);
				}.bind(this));
		}
		
		AbShapeTool.endDraw(this, ctx);
	},
}