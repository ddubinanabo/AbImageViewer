function AbPage(options){
	if (!options) options = {};
	var scaleOption = options.scale || {};

	this.loader = options.loader;

	this.uid = options.uid || AbCommon.uuid();
	this.status = options.hasOwnProperty('status') ? options.status : AbPage.prototype.LOADED;
	this.error = null;

	this.angle = options.angle || 0;

	this.x = options.x || 0;
	this.y = options.y || 0;
	this.width = options.width || 0;
	this.height = options.height || 0;
	// 화면 맞춤 (in=전체, horiz=가로, vert=세로)
	this.fitTo = 'in';

	this.scale = {
		x: !scaleOption.x || scaleOption.x <= 0 ? 1 : scaleOption.x,
		y: !scaleOption.y || scaleOption.y <= 0 ? 1 : scaleOption.y
	};

	this.source = options.source || null;

	this.shapes = [];
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbPage.prototype = {
	constructor: AbPage,

	//-----------------------------------------------------------

	STATUS_TABLE: ['ready', 'loading', 'loaded', 'error'],

	READY: 0,
	LOADING: 1,
	LOADED: 2,
	ERROR: 3,

	//-----------------------------------------------------------

	dispose: function(){
		if (this.source && AbCommon.isFunction(this.source.dispose))
			this.source.dispose();

		this.loader = null;
		this.source = null;

		var siz = this.shapes.length;
		for (var i=0; i < siz; i++)
			if (AbCommon.isFunction(this.shapes[i].dispose))
				this.shapes[i].dispose();

		this.shapes.splice(0, this.shapes.length);
	},

	//-----------------------------------------------------------

	isLoading: function () { return this.status == AbPage.prototype.LOADING; },
	isError: function() { return this.status == AbPage.prototype.ERROR; },

	editable: function() { return this.status == AbPage.prototype.LOADED; },
	statusText: function (){ return AbPage.prototype.STATUS_TABLE[this.status]; },
	hasImageInfo: function (){ return this.source && this.source.info && this.source.info.data; },
	hasShapes: function () { return this.shapes.length > 0; },

	//-----------------------------------------------------------

	// 섬네일만 로드된 경우
	isReadyImage: function (){
		return !this.error && !this.source.hasImage() && this.source.imgInfo.url;
	},

	//-----------------------------------------------------------

	infoType: function() { return this.source && this.source.info ? this.source.info.type : null; },
	info: function() { return this.hasImageInfo() ? this.source.info.data : null; },
	decoder: function() { return this.source && this.source.info ? this.source.info.decoder : null; },

	//-----------------------------------------------------------

	sourceSize: function(){
		return this.source;
	},

	image: function(){
		if (this.source instanceof AbImage){
			if (this.source.hasImage())
				return this.source.imageElement();
			else if (this.source.hasThumbnail())
				return this.source.thumbnailElement();
			return null;
		}
		return this.source;
	},

	thumbnail: function(){
		if (this.source instanceof AbImage){
			if (this.source.hasThumbnail())
				return this.source.thumbnailElement();
		}
		return null;
	},

	originThumbnail: function(){
		if (this.source instanceof AbImage){
			if (this.source.hasThumbnail())
				return this.source.originThumbnailElement();
		}
		return null;
	},

	//-----------------------------------------------------------

	transformed: function (){ return this.x != 0 || this.y != 0 || this.scaled(); },
	scaled: function(){ return this.scale.x != 1 || this.scale.y != 1; },

	toCanvas: function (x, y){
		return {
			x: (x * this.scale.x) + this.x,
			y: (y * this.scale.y) + this.y,
		};
	},

	fromCanvas: function (canvasX, canvasY){
		return {
			x: (canvasX - this.x) / this.scale.x,
			y: (canvasY - this.y) / this.scale.y,
		};
	},

	toCanvasBox: function(){
		var box = null;
		if (arguments.length == 1)
			box = arguments[0];
		else if (arguments.length == 4)
			box = {
				x: arguments[0],
				y: arguments[1],
				width: arguments[2],
				height: arguments[3],
			};
		if (!box) return;

		var s = this.toCanvas(box.x, box.y);
		var e = this.toCanvas(box.x + box.width, box.y + box.height);

		return {
			x: s.x,
			y: s.y,
			width: e.x - s.x,
			height: e.y - s.y
		};
	},

	fromCanvasBox: function(){
		var box = null;
		if (arguments.length == 1)
			box = arguments[0];
		else if (arguments.length == 4)
			box = {
				x: arguments[0],
				y: arguments[1],
				width: arguments[2],
				height: arguments[3],
			};
		if (!box) return;

		var s = this.fromCanvas(box.x, box.y);
		var e = this.fromCanvas(box.x + box.width, box.y + box.height);

		return {
			x: s.x,
			y: s.y,
			width: e.x - s.x,
			height: e.y - s.y
		};
	},

	toCanvasRect: function(){
		var rect = null;
		if (arguments.length == 1)
			rect = arguments[0];
		else if (arguments.length == 4)
			rect = {
				x1: arguments[0],
				y1: arguments[1],
				x2: arguments[2],
				y2: arguments[3],
			};
		if (!rect) return;

		var s = this.toCanvas(rect.x1, rect.y1);
		var e = this.toCanvas(rect.x2, rect.y2);

		return {
			x1: s.x,
			y1: s.y,
			x2: e.x,
			y2: e.y
		};
	},

	fromCanvasRect: function(){
		var rect = null;
		if (arguments.length == 1)
			rect = arguments[0];
		else if (arguments.length == 4)
			rect = {
				x1: arguments[0],
				y1: arguments[1],
				x2: arguments[2],
				y2: arguments[3],
			};
		if (!rect) return;

		var s = this.fromCanvas(rect.x1, rect.y1);
		var e = this.fromCanvas(rect.x2, rect.y2);

		return {
			x1: s.x,
			y1: s.y,
			x2: e.x,
			y2: e.y
		};
	},

	//-----------------------------------------------------------

	drawShapes: function (ctx, drawIndicator){
		if (!AbCommon.isBool(drawIndicator)) drawIndicator = true;

		var len = this.shapes.length;
		var sels = [], fsel = null;
		var bak = { selected: false, focused: false };
		for (var i=0; i < len; i++){
			var s = this.shapes[i];
			if (s.focused)
				fsel = s;
			else if (s.selected)
				sels.push(s);

			if (drawIndicator === false){
				bak.selected = s.selected;
				bak.focused = s.focused;

				s.selected = false;
				s.focused = false;
			}

			s.draw(ctx, this);

			if (drawIndicator === false){
				s.selected = bak.selected;
				s.focused = bak.focused;
			}
		}
		if (sels.length && drawIndicator){
			for (var i = sels.length - 1; i >= 0; i--)
				sels[i].indicator.draw(ctx);
		}

		if (fsel && drawIndicator){
			fsel.indicator.draw(ctx);
		}
	},

	drawOrigin: function(ctx, scale){
		var scaleX = this.scale.x, scaleY = this.scale.y;

		this.scale.x = this.scale.y = scale;

		this.drawShapes(ctx, false);

		this.scale.x = scaleX;
		this.scale.y = scaleY;
	},
};
