function AbWaterMark(options){
	if (!options) options = {};
	var style = options.style || {};
	var boxStyle = style;
	var strokeStyle = boxStyle.stroke || {};
	var textStyle = style.text || {};

	this.$source = null;
	this.$status = 'ready'; // ready/loading/loaded
	this.$type = 'text';	// text, image

	//-----------------------------------------------------------

	this.$position = options.position || 'center middle';	// left/center/right top/middle/bottom
	this.$angle = options.angle || 0;	// degree
	this.$alpha = options.alpha || 0.1;	// 0 ~ 1
	this.$ratio = AbCommon.isNumber(options.ratio) ? options.ratio : AbWaterMark.prototype.DEFAULT_RATIO; // 0 ~ 1
	this.$margin = options.margin || { left: 0, top: 0, right: 0, bottom: 0 };
	this.$style = {
		text: {
			size: textStyle.size || '64px',
			font: textStyle.font || 'tahoma',
			italic: textStyle.italic || false,
			bold: textStyle.bold || false,
			color: textStyle.color || 'black',
			lineHeight: textStyle.lineHeight || 1.25,	
		},
	};

	//-----------------------------------------------------------

	this.observers = [];
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbWaterMark.prototype = {
	constructor: AbWaterMark,

	//-----------------------------------------------------------

	DEFAULT_RATIO: 0.5,

	//-----------------------------------------------------------

	observe: function(observer){ this.observers.push(observer); },
	stopObserve: function(observer){
		var idx = this.observers.indexOf(observer);
		if (idx >= 0) this.observers.splice(idx, 1);
	},
	
	notifyObservers: function(topic, value, element){
		this.exec(function(){
			var len = this.observers.length;
			for (var i=0; i < len; i++){
				var o = this.observers[i];

				if (typeof o == 'function')
					o(this, topic, value, element);
				else if (typeof o.waterMarkNotify == 'function')
					o.waterMarkNotify(this, topic, value, element);
			}
		});
	},

	//-----------------------------------------------------------

	exec: function(func, delay){
		if (!delay) delay = 0;
		setTimeout(func.bind(this), delay);
		//func.call(this);
	},

	//-----------------------------------------------------------

	$styling: function(type, excludes){
		var style = type == 'box' ? this.$style.box : type == 'stroke' ? this.$style.box.stroke : this.$style.text;
		var arg0 = null;
		if (arguments.length == 3){
			arg0 = arguments[2];
			if (AbCommon.isString(arg0)){
				if ($.inArray(arg0, excludes)>=0)
					return null;

				return style[arg0];
			}

			for (var p in arg0){
				if (arg0.hasOwnProperty(p) && $.inArray(p, excludes) < 0)
					style[p] = arg0[p];
			}
		}else if (arguments.length == 4){
			arg0 = arguments[2];
			var arg1 = arguments[3];

			style[arg0] = arg1;
		}
	},

	//-----------------------------------------------------------

	boxStyle: function (){
		if (arguments.length == 1) return this.$styling('box', ['stroke'], arguments[0]);
		else if (arguments.length == 2) return this.$styling('box', ['stroke'], arguments[0], arguments[1]);
	},

	strokeStyle: function (){
		if (arguments.length == 1) return this.$styling('stroke', [], arguments[0]);
		else if (arguments.length == 2) return this.$styling('stroke', [], arguments[0], arguments[1]);
	},

	textStyle: function (){
		if (arguments.length == 1) return this.$styling('text', [], arguments[0]);
		else if (arguments.length == 2) return this.$styling('text', [], arguments[0], arguments[1]);
	},

	//-----------------------------------------------------------

	ratio: function (value){
		if (arguments.length)
			this.$ratio = AbCommon.isNumber(value) ? value : AbWaterMark.prototype.DEFAULT_RATIO;
		return this.$ratio;
	},

	angle: function (angle){
		if (arguments.length)
			this.$angle = AbGraphics.angle.increase(this.$angle, angle);
		return this.$angle;
	},

	alpha: function (alpha){
		if (arguments.length)
			this.$alpha = alpha;
		return this.$alpha;
	},
	
	position: function (value){
		if (arguments.length)
			this.$position = value;
		return this.$position;
	},
	
	margin: function (){
		if (arguments.length == 1){
			this.$margin = arguments[0];
		}else if (arguments.length == 4){
			this.$margin.left = arguments[0];
			this.$margin.top = arguments[1];
			this.$margin.right = arguments[2];
			this.$margin.bottom = arguments[3];
		}
		return this.$margin;
	},

	//-----------------------------------------------------------

	source: function() { return this.$source; },
	type: function() { return this.$type; },
	status: function() { return this.$status; },

	//-----------------------------------------------------------

	render: function(){
		this.notifyObservers('render');
	},

	error: function(e){
		console.log('[WATERMARK] ' + e);
		this.notifyObservers('error', e);
	},

	//-----------------------------------------------------------

	text: function(value){
		this.$source = value;
		this.$type = 'text';
		this.$status = 'loaded';

		this.render();
	},

	image: function(value){
		this.$source = null;
		this.$type = 'image';
		this.$status = 'loading';

		if (value instanceof AbImage){
			value.image()
				.then(function (e){
					this.$source = e;
					this.$status = 'loaded';

					this.render();
				}.bind(this))
				.catch(function(e){
					this.error(e);
				}.bind(this));
		}else if (value instanceof Image){
			this.$source = value;
			this.$status = 'loaded';

			this.render();
		}else if (AbCommon.isString(value)){
			AbCommon.loadImage(value)
				.then(function (e){
					this.$source = e;
					this.$status = 'loaded';

					this.render();
				}.bind(this))
				.catch(function (e){
					this.error(e);
				}.bind(this));
		}else{
			this.$status = 'loaded';

			this.render();
		}
	},

	//-----------------------------------------------------------

	drawable: function(){ return this.$source && this.$status == 'loaded'; },

	//-----------------------------------------------------------

	measure: function(ctx, text){
		var a = text.replace(/\r/g, '').split('\n');
		var cnt = a.length, lineSize = [], w = 0, h = 0;
		var px = AbCss.pixel(this.$style.text.size);
		var lineHeight = px * this.$style.text.lineHeight;

		for (var i=0; i < cnt; i++){
			var line = a[i];

			var tm = ctx.measureText(line);
			txtWidth = Math.round(tm.width);
			lineSize.push(txtWidth);

			if (i == 0 || w < txtWidth) w = txtWidth;
			h += lineHeight;
		}

		return {
			lines: a,
			width: w,
			height: h,
			lineWidths: lineSize,
			lineHeight: lineHeight
		};
	},

	//-----------------------------------------------------------

	setFontSyle: function (ctx){
		var style = this.$style.text;
		
		var font = '';
		if (style.italic) font += 'italic ';
		if (style.bold) font += '700 ';
		if (style.size) font += style.size + ' ';
		if (style.font) font += style.font + ' ';

		ctx.lineWidth = 1;
		ctx.font = $.trim(font);
		//ctx.textBaseline = 'hanging';
		ctx.textBaseline = 'top';
	},

	//-----------------------------------------------------------

	draw: function (ctx, scale, canvas){
		var drawable = false;
		
		if (arguments.length == 3)
			drawable = canvas && canvas.source && canvas.view && canvas.source.width && canvas.source.height && canvas.view.width && canvas.view.height;
		else if (arguments.length == 4){
			drawable = canvas && AbCommon.isNumber(canvas) && AbCommon.isNumber(arguments[3]);

			if (drawable)
				canvas = {
					source: { width: canvas, height: arguments[3] },
					view: { width: canvas, height: arguments[3] },
				};
		}

		if (drawable && this.drawable()){
			if (!AbCommon.isSetted(scale)) scale = 1;
		
			ctx.save();
			ctx.globalAlpha = this.$alpha;

			var m = null, mw = 0, mh = 0;
			var fr = null;
			var b = null;

			if (this.$type === 'text'){
				this.setFontSyle(ctx);

				m = this.measure(ctx, this.$source);
				mw = m.width * scale;
				mh = m.height * scale;
			}else if (this.$type === 'image'){
				mw = this.$source.width * scale;
				mh = this.$source.height * scale;
			}

			if (this.$angle)
				b = AbGraphics.angle.bounds(this.$angle, 0, 0, mw, mh);

			if (this.$ratio > 0){
				if (this.$type === 'text'){
				}

				var r = null;
				
				if (b != null)
					r = AbGraphics.box.zoom(b.width, b.height, canvas.source.width * this.$ratio, canvas.source.height * this.$ratio);
				else
					r = AbGraphics.box.zoom(mw, mh, canvas.source.width * this.$ratio, canvas.source.height * this.$ratio);

				fr = r;
				mw = mw * r.ratio;
				mh = mh * r.ratio;
			}

			var x = 0, y = 0;
			var pos = this.$position.split(' ');

			switch (pos[0]){
			case 'left':
				x = this.$margin.left;
				break;
			case 'center':
				x = (canvas.view.width - mw) >> 1;
				break;
			case 'right':
				x = width - mw - this.$margin.right;
				break;
			}
	
			switch (pos[1]){
			case 'top':
				y = this.$margin.top;
				break;
			case 'middle':
				y = (canvas.view.height - mh) >> 1;
				break;
			case 'bottom':
				y = height - mh - this.$margin.bottom;
				break;
			}

			if (this.$angle){
				var cpx = x + (mw >> 1), cpy = y + (mh >> 1);

				ctx.translate(cpx, cpy);
				ctx.rotate(AbGraphics.angle.deg2rad(this.$angle));
				ctx.translate(-cpx, -cpy);
			}

			if (this.$type === 'text'){
				var r = scale * fr.ratio;
				ctx.scale(r, r);

				x = x / r;
				y = y / r;
				
				// ctx.fillStyle = 'gold';
				// ctx.fillRect(x, y, m.width, m.height);

				ctx.fillStyle = this.$style.text.color;
				var cnt = m.lines.length;
				for (var i=0; i < cnt; i++){
					ctx.fillText(m.lines[i], x, y + (i * m.lineHeight));
				}

			}else if (this.$type === 'image'){
				ctx.drawImage(this.$source, x, y, mw, mh);
			}

			ctx.restore();
		}
	},
};