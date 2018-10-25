/**
 * 섬네일 이미지 생성기
 * @class
 * @param {Object} [options] 옵션
 * @param {Size} [options.limit] 최대 크기 설정
 */
function AbThumbnailGenerator(options){
	if (!options) options = {};

	var lSize = options.limit && options.limit.width && options.limit.height;

	/**
	 * 최대 이미지 크기
	 * @type {Size}
	 */
	this.limit = {
		width: lSize ? options.limit.width : AbThumbnailGenerator.prototype.MAX_WIDTH,
		height: lSize ? options.limit.height : AbThumbnailGenerator.prototype.MAX_HEIGHT
	};

	var bSize = options.width && options.height;

	/**
	 * 이미지 크기
	 */
	this.source = {
		width: bSize ? options.width : this.limit.width,
		height: bSize ? options.height : this.limit.height
	};

	/**
	 * 이미지 비율
	 * @type {Number}
	 */
	this.ratio = 1;
	this.calcRatio();
	
	var canvas = $('<canvas width="'+this.source.width+'" height="'+this.source.height+'"/>');
	/**
	 * 이미지 버퍼 (Canvas 2D Context)
	 * @type {CanvasRenderingContext2D}
	 */
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

	/**
	 * 기본 최대 이미지 폭
	 * @type {Number}
	 * @const
	 * @static
	 * @default
	 */
	MAX_WIDTH: 120,
	/**
	 * 기본 최대 이미지 높이
	 * @type {Number}
	 * @const
	 * @static
	 * @default
	 */
	MAX_HEIGHT: 120,

	//-----------------------------------------------------------
	
	/**
	 * 버퍼의 폭을 가져옵니다.
	 * @return {Number}
	 */
	width: function (){ return this.context.canvas.width; },
	/**
	 * 버퍼의 높이를 가져옵니다.
	 * @return {Number}
	 */
	height: function (){ return this.context.canvas.height; },
	
	/**
	 * 버퍼의 크기를 가져옵니다.
	 * @return {Size}
	 */
	size: function (){
		return {
			width: this.context.canvas.width,
			height: this.context.canvas.height,
		};
	},

	//-----------------------------------------------------------

	/**
	 * 비율을 계산합니다.
	 * @private
	 */
	calcRatio: function (){
		var r = AbGraphics.box.zoom(this.source.width, this.source.height, this.limit.width, this.limit.height);
		this.ratio = r.ratio;
	},

	/**
	 * 최대 이미지 크기를 설정합니다.
	 * @param {Number} w 최대 이미지 폭
	 * @param {Number} h 최대 이미지 높이
	 */
	resizeLimit: function(w, h){
		this.limit.width = w;
		this.limit.height = h;

		this.calcRatio();
	},

	/**
	 * 리사이징을 수행합니다.
	 * @param {Number} w 이미지 폭
	 * @param {Number} h 이미지 높이
	 */
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

	/**
	 * 이미지를 버퍼에 그립니다.
	 * @private
	 * @param {CanvasImageSource} image 이미지 객체
	 */
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

	/**
	 * 버퍼를 이미지로 변환합니다.
	 * @private
	 * @param {String} [type] 이미지 타입 (jpeg|jpg|png)
	 * @return {String} DATA URL 형식 문자열
	 */
	toImage: function (type){
		return AbGraphics.canvas.toImage(this.context, type);
	},

	/**
	 * 섬네일 이미지를 생성합니다.
	 * @param {CanvasImageSource} image 이미지 객체
	 * @param {String} [type] 이미지 타입 (jpeg|jpg|png)
	 * @return {String} DATA URL 형식 문자열
	 */
	generate: function (image, type){
		this.draw(image);
		return this.toImage(type);
	},
};
