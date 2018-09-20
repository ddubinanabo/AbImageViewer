function AbThumbnailGenerator(options){
	if (!options) options = {};

	var lSize = options.limit && options.limit.width && options.limit.height;

	this.limit = {
		width: lSize ? options.limit.width : AbThumbnailGenerator.prototype.MAX_WIDTH,
		height: lSize ? options.limit.height : AbThumbnailGenerator.prototype.MAX_HEIGHT
	};

	var bSize = options.width && options.height;

	this.source = {
		width: bSize ? options.width : this.limit.width,
		height: bSize ? options.height : this.limit.height
	};

	this.ratio = 1;
	this.calcRatio();
	
	var canvas = $('<canvas width="'+this.source.width+'" height="'+this.source.height+'"/>');
	this.context = canvas.get(0).getContext('2d');

	//-----------------------------------------------------------
	// Custom Image Rendering

	// var imgCanvas = $('<canvas/>');
	// this.imgContext = imgCanvas.get(0).getContext('2d');	
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbThumbnailGenerator.prototype = {
	constructor: AbThumbnailGenerator,

	//-----------------------------------------------------------

	MAX_WIDTH: 120,
	MAX_HEIGHT: 120,

	//-----------------------------------------------------------
	
	width: function (){ return this.context.canvas.width; },
	height: function (){ return this.context.canvas.height; },
	
	size: function (){
		return {
			width: this.context.canvas.width,
			height: this.context.canvas.height,
		};
	},

	//-----------------------------------------------------------

	calcRatio: function (){
		var r = AbGraphics.box.zoom(this.source.width, this.source.height, this.limit.width, this.limit.height);
		this.ratio = r.ratio;
	},

	resizeLimit: function(w, h){
		this.limit.width = w;
		this.limit.height = h;

		this.calcRatio();
	},

	resize: function(w, h){
		this.source.width = w;
		this.source.height = h;

		this.calcRatio();

		this.context.canvas.width = Math.round(w * this.ratio);
		this.context.canvas.height = Math.round(h * this.ratio);

		//-----------------------------------------------------------
		// Custom Image Rendering

		// this.imgContext.canvas.width = w;
		// this.imgContext.canvas.height = h;
	},

	draw: function (image){
		var ctx = this.context;
		var w = ctx.canvas.width, h = ctx.canvas.height;

		//AbGraphics.canvas.imageSmoothing(ctx, true);
		ctx.drawImage(image, 0, 0, w, h);

		//-----------------------------------------------------------
		// Hermite

		// this.imgContext.drawImage(image, 0, 0);
		// AbGraphics.image.hermite(this.imgContext.canvas, w, h, true);

		// ctx.drawImage(this.imgContext.canvas, 0, 0);
	
		//-----------------------------------------------------------
		// Bicubic/Bilinear

		// this.imgContext.drawImage(image, 0, 0);
		// var src = this.imgContext.getImageData(0, 0, this.imgContext.canvas.width, this.imgContext.canvas.height);
		// var dest = this.context.createImageData(w, h);

		// //AbGraphics.image.bicubic(src, dest, this.ratio);
		// AbGraphics.image.bilinear(src, dest, this.ratio);

		// ctx.putImageData(dest, 0, 0);
	},

	toImage: function (type){
		return AbGraphics.canvas.toImage(this.context, type);
	},

	generate: function (image, type){
		this.draw(image);
		return this.toImage(type);
	},
};
