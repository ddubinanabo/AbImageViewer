function AbImage(options){
	if (!options) options = {};

	this.width = options.width || 0;
	this.height = options.height || 0;

	//-----------------------------------------------------------

	this.info = options.info || null;

	//-----------------------------------------------------------

	var src = AbCommon.isString(options.image) ? options.image : null;
	var element = !AbCommon.isString(options.image) && options.image ? options.image : null;

	this.imgInfo = {
		loaded: AbCommon.isSetted(element),
		url: src,
		element: element,
	};

	//-----------------------------------------------------------

	src = AbCommon.isString(options.thumbnail) ? options.thumbnail : null;
	element = !AbCommon.isString(options.thumbnail) && options.thumbnail ? options.thumbnail : null;

	this.thumbInfo = {
		loaded: AbCommon.isSetted(element),
		url: src,
		element: element,
		originElement: element,
	};
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbImage.prototype = {
	constructor: AbImage,

	//-----------------------------------------------------------

	dispose: function (){
		this.info = null;

		this.imgInfo.url = null;
		this.imgInfo.element = null;

		this.thumbInfo.url = null;
		this.thumbInfo.element = null;
		this.thumbInfo.originElement = null;
	},

	//-----------------------------------------------------------

	existSize: function () { return this.width && this.height; },

	hasImage: function (){ return this.imgInfo.loaded; },
	hasThumbnail: function (){ return this.thumbInfo.loaded; },

	//-----------------------------------------------------------

	imageUrl: function() { return this.imgInfo.url; },
	thumbnailUrl: function() { return this.thumbInfo.url; },

	//-----------------------------------------------------------
	
	getImage: function(imgdat, recordOrigin){
		if (imgdat.loaded){
			return new Promise(function (resolve, reject){
				resolve({ image: imgdat.element, loaded: false });
			});
		}

		return AbCommon.loadImage(imgdat.url)
			.then(function (e){
				imgdat.loaded = true;
				imgdat.element = e;
				
				return new Promise(function (resolve, reject){
					if (recordOrigin){
						AbCommon.loadImage(imgdat.url)
							.then(function(eorigin){
								imgdat.originElement = eorigin;
								
								resolve({ image: imgdat.element, loaded: true});
							})
							.catch(function(e){
								reject(e);
							});
					}else{
						resolve({ image: imgdat.element, loaded: true});
					}
				});
//
//				if (recordOrigin){
//					var imgsrc = AbCommon.createImage();
//					imgsrc.src = imgdat.url;
//
//					imgdat.originElement = imgsrc;
//				}
//
//				return new Promise(function (resolve, reject){
//					resolve({ image: imgdat.element, loaded: true});
//				});
			});
	},

	//-----------------------------------------------------------

	imageElement: function() { return this.imgInfo.element; },
	thumbnailElement: function() { return this.thumbInfo.element; },
	originThumbnailElement: function() { return this.thumbInfo.originElement; },

	//-----------------------------------------------------------

	image: function(){
		return this.getImage(this.imgInfo)
			.then(function (e){
				// if (e.loaded && !this.existSize()){
				// 	this.width = e.image.width;
				// 	this.height = e.image.height;
				// }

				this.width = e.image.width;
				this.height = e.image.height;

				var existSize = this.existSize();

				return new Promise(function (resolve, reject){
					if (existSize){
						setTimeout(resolve.bind(null, e.image), 0);
					}else{
						setTimeout(reject.bind(null, new Error('It is not an image file')), 0);
					}
				});
			}.bind(this));
	},

	thumbnail: function(){ return this.getImage(this.thumbInfo, true); },

	//-----------------------------------------------------------

	generateThumbnail: function(){
		var w = 0, h = 0, gen = null;
		if (arguments.length == 3){
			w = arguments[0];
			h = arguments[1];
			gen = arguments[3];
		}else if (arguments.length == 2){
			w = arguments[0];
			h = arguments[1];
		}else{
			gen = arguments[0];
		}

		if (!gen && (!w || !h))
			throw 'invalid usage!!';

		return this.image()
			.then(function (e){
				if (!gen) gen = new AbThumbnailGenerator({ limit: { width: w, height: h } });
				else if (w || h) gen.resizeLimit(w, h);

				gen.resize(this.width, this.height);

				var decoder = this.info ? this.info.decoder : null;
				
				var data = gen.generate(e, decoder);

				return this.setThumbnailData(data);
				
				/*
				var img = AbCommon.createImage();
				img.src = data;

				this.thumbInfo.loaded = true;
				this.thumbInfo.element = img;
				this.thumbInfo.url = data;

				return new Promise(function (resolve, reject){
					setTimeout(resolve.bind(null, { element: img, data: data }), 0);
					
				});
				*/
			}.bind(this));
	},

	setThumbnailData: function (imageData){
		if (this.thumbInfo.loaded){
			var img = this.thumbInfo.element;
			img.src = imageData;

			return new Promise(function (resolve, reject){
				setTimeout(resolve.bind(null, { element: img, data: img.src }), 0);
			});
		}else{
			var img = AbCommon.createImage();
			img.src = imageData;

			var imgsrc = AbCommon.createImage();
			imgsrc.src = imageData;

			this.thumbInfo.loaded = true;
			this.thumbInfo.element = img;
			this.thumbInfo.url = imageData;
			this.thumbInfo.originElement = imgsrc;

			return new Promise(function (resolve, reject){
				setTimeout(resolve.bind(null, { element: img, data: img.src }), 0);
				
			});
		}
	},
};
