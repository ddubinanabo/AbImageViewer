/*
Source: https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Colors/Color_picker_tool
*/

function AbColorPicker (options){
	if(!options) options = {};

	//-----------------------------------------------------------

	this.viewStyle = options.viewStyle || 'window';

	//-----------------------------------------------------------

	this.token = options.token || null;

	//-----------------------------------------------------------

	this.selector = options.selector || '#picker';
	this.e = $(this.selector);
	this.epicker = this.e.find('.ui-color-picker');
	this.esample = this.e.find('.sample-boxes');
	this.euser = this.e.find('.user-boxes');

	//-----------------------------------------------------------

	this.pickingArea = null;
	this.picker = null;

	this.hueArea = null;
	this.huePicker = null;

	this.alphaArea = null;
	this.alphaMask = null;
	this.alphaPicker = null;

	this.previewColor = null;

	//-----------------------------------------------------------

	this.userBoxIndex = -1;

	//-----------------------------------------------------------

	this.color = {
		type: 'RGB',

		h: 0, s: 0, l: 0, v: 0,
		r: 0, g: 0, b: 0, a: 1,

		locka: false,
		bka: 1,

		set: function(){
			if (arguments.length == 1 && typeof arguments[0] == 'string'){
				var rgb = AbCss.color(arguments[0]);

				if (rgb){
					if (rgb.length == 4){
						if (this.locka !== false)
							this.bka = rgb[3];

						this.rgb(rgb[0],rgb[1],rgb[2],this.locka === false ? rgb[3] : this.locka);
					}else
						this.rgb(rgb[0],rgb[1],rgb[2],1);
				}				
			}else{
				switch(arguments[0]){
				case 'HSL':
					this.hsl(arguments[1],arguments[2],arguments[3]);
					break;
				case 'HSV':
					this.hsv(arguments[1],arguments[2],arguments[3]);
					break;
				case 'RGB':
					if (arguments.length == 5){
						if (this.locka !== false)
							this.bka = arguments[4];
						
						this.rgb(arguments[1],arguments[2],arguments[3],this.locka === false ? arguments[4] : this.locka);
					}else
						this.rgb(arguments[1],arguments[2],arguments[3]);
					break;
				}
			}
		},

		hsl: function (){
			if (arguments.length){
				this.type = 'HSL';
				this.h = arguments[0]; this.s = arguments[1]; this.l = arguments[2];

				this.from('HSL');
			}
			return { h: this.h, s: this.s, l: this.l };
		},
		hsv: function (){
			if (arguments.length){
				this.type = 'HSV';
				this.h = arguments[0]; this.s = arguments[1]; this.v = arguments[2];

				this.from('HSV');
			}
			return { h: this.h, s: this.s, v: this.v };
		},
		rgb: function (){
			if (arguments.length){
				this.type = 'RGB';
				this.r = arguments[0]; this.g = arguments[1]; this.b = arguments[2];
				if (arguments.length >= 4) {
					if (this.locka !== false)
						this.bka = arguments[3];
					this.a = this.locka === false ? arguments[3] : this.locka;
				}else this.a = 1;

				this.from('RGB');
			}
			return { r: this.r, g: this.g, b: this.b, a: this.a };
		},

		from: function (type){
			var tmp = null, rgb = null;
			switch(type){
			case 'HSL':
				rgb = AbColor.hsv2rgb(this.h, this.s / 100, this.l / 100);
				tmp = AbColor.rgb2hsv(rgb[0], rgb[1], rgb[2]);
				//this.h = tmp[0]; this.s = tmp[1] * 100;
				this.v = this.round(tmp[2] * 100);
		
				this.r = this.round(rgb[0]); this.g = this.round(rgb[1]); this.b = this.round(rgb[2]);
				break;
			case 'HSV':
				rgb = AbColor.hsv2rgb(this.h, this.s / 100, this.v / 100);
				tmp = AbColor.rgb2hsl(rgb[0], rgb[1], rgb[2]);
				//this.h = tmp[0]; this.s = tmp[1] * 100;
				this.l = this.round(tmp[2] * 100);
	
				this.r = this.round(rgb[0]); this.g = this.round(rgb[1]); this.b = this.round(rgb[2]);
				break;
			case 'RGB':
				tmp = AbColor.rgb2hsl(this.r, this.g, this.b);
				//this.h = this.round(tmp[0]); this.s = this.round(tmp[1] * 100);
				this.l = this.round(tmp[2] * 100);

				tmp = AbColor.rgb2hsv(this.r, this.g, this.b);
				this.h = this.round(tmp[0]); this.s = this.round(tmp[1] * 100); this.v = this.round(tmp[2] * 100);
				break;
			}
		},

		round: function (x) { return Math.round(x); },

		hex: function (){
			var rgb = this.rgb();
			return AbCss.hex(rgb.r, rgb.g, rgb.b);
		},

		color: function (){
			var rgb = this.rgb();
			if (this.a | 0 === 1)
				return AbCss.hex(rgb.r, rgb.g, rgb.b);
			return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ',' + this.a + ')';
		},
	};

	//-----------------------------------------------------------

	this.createPickingArea();
	this.createHueArea();

	this.topics = {};

	this.newInputComponent('H', 'hue', this.inputChangeHue.bind(this));
	this.newInputComponent('S', 'saturation', this.inputChangeSaturation.bind(this));
	this.newInputComponent('V', 'value', this.inputChangeValue.bind(this));

	this.createAlphaArea();

	this.newInputComponent('R', 'red', this.inputChangeRed.bind(this));
	this.newInputComponent('G', 'green', this.inputChangeGreen.bind(this));
	this.newInputComponent('B', 'blue', this.inputChangeBlue.bind(this));

	this.createPreviewBox();

	this.newInputComponent('투명도', 'alpha', this.inputChangeAlpha.bind(this));
	this.newInputComponent('hexa', 'hexa', this.inputChangeHexa.bind(this));

	this.generateColorBoxes();

	this.attachControlPanelEvents();

	this.observers = [];

	if (options.color){
		if (typeof options.color == 'string'){
			this.setColor(options.color);
		}else if (typeof options.color.type == 'string' && $.isArray(options.color.value)){
			var a = [options.color.type];
			Array.prototype.push.apply(a, options.color.value);
			this.setColor.apply(this, a);
		}
	}else{
		this.setColor();
	}
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbColorPicker.prototype = {
	constructor: AbColorPicker,

	//-----------------------------------------------------------

	COLORS: {
		white: '#FFFFFF',
		silver:'#c0c0c0',
		gray:'#808080',
		black: '#000000',
		red:'#ff0000',
		maroon:'#800000',
		yellow:'#ffff00',
		olive:'#808000',
		lime:'#00ff00',
		green:'#008000',
		aqua:'#00ffff',
		teal:'#008080',
		blue:'#0000ff',
		navy:'#000080',
		pink:'#ffc0cb',
		fuchsia:'#ff00ff',
		purple:'#800080',
		mediumpurple:'#9370db',
	},

	NUMS_USER_BOX: 14,

	//-----------------------------------------------------------

	observe: function(observer){ this.observers.push(observer); },
	stopObserve: function(observer){ this.observers.remove(observer); },
	
	notifyObservers: function(topic, value){
		setTimeout(function(){
			var len = this.observers.length;
			for (var i=0; i < len; i++){
				var o = this.observers[i];

				if (typeof o == 'function')
					o(this, topic, value, this.token);
				else if (typeof o.notify == 'function')
					o.notify(this, topic, value, this.token);
		}}.bind(this), 0);
	},

	//-----------------------------------------------------------

	has: function (e) { return this.e.has(e).length > 0; },

	opened: function(){ return this.e.css('visibility') == 'visible'; },
	
	boundBox: function(){ return AbCommon.getBounds(this.e.get(0)); },
	size: function() { return { width: this.e.width(), height: this.e.height() }; },

	open: function (x, y, zIndex){
		if (this.viewStyle === 'window'){
			if (typeof zIndex != 'number') zIndex = 100;
			this.e.css({
				left: x,
				top: y,
				zIndex: zIndex,
				visibility: 'visible'
			});

			this.notifyObservers('open');
		}
	},

	close: function (){
		if (this.viewStyle === 'window' && this.opened()){
			this.e.css({
				zIndex: -1,
				visibility: 'hidden'
			});

			this.notifyObservers('close');
		}
	},

	confirm: function (notset){
		if (notset){
			this.notifyObservers('color', null);
			this.close();
			return;
		}

		var color = this.color.color();
		var boxes = this.cmd('color', this.euser);
		if (boxes.length){
			var divElement = null, box = null, c = null;
			var len = boxes.length;
			for (var i=0; i < len; i++){
				divElement = boxes.get(i);
				box = $(divElement);
				c = box.attr('color');
				if (!c){
					box.attr('color', color);
					box = box.children();
					box.css('background-color', color);

					this.notifyObservers('color', color);
					this.close();
					return;
				}else if (c == color){
					this.notifyObservers('color', color);
					this.close();
					return;
				}
			}

			this.userBoxIndex++;
			if (this.userBoxIndex >= this.NUMS_USER_BOX)
				this.userBoxIndex = 0;

			divElement = boxes.get(this.userBoxIndex);
			box = $(divElement);
			box.attr('color', color);
			box = box.children();
			box.css('background-color', color);

			this.notifyObservers('color', color);
			this.close();
		}
	},

	//-----------------------------------------------------------

	lockAlpha: function(){
		if (arguments.length && (typeof arguments[0] == 'boolean' || (typeof arguments[0] == 'number' && arguments[0] >= 0 && arguments[0] <= 1))){
			this.color.locka = arguments[0];
			
			if (this.color.locka !== false){
				this.color.bka = this.color.a;
				this.color.a = this.color.locka;
			}else{
				this.color.a = this.color.bka;
			}

			this.updateAlphaPicker();
			this.notify('alpha', this.color.a);

			var e = this.topics['alpha'];
			if (e) e.attr('readonly', this.color.locka !== false);
		}
		return this.color.locka;
	},

	enabledNotset: true,

	enableNotset: function(){
		if (arguments.length){
			this.enabledNotset = arguments[0];

			if (this.enabledNotset) this.cmd('notset').show();
			else this.cmd('notset').hide();
		}
		return this.enabledNotset;
	},

	//-----------------------------------------------------------

	cmd: function (name, e){ if (!e) e = this.e; return e.find('[cmd="'+name+'"]'); },

	attachControlPanelEvents: function (){
		this.cmd('ok').click(this, function(e){
			e.data.confirm();
		});

		this.cmd('cancel').click(this, function(e){
			e.data.close();
		});

		this.cmd('notset').click(this, function(e){
			e.data.confirm(true);
		});
	},

	generateColorBoxes: function (){
		// create smaple color boxes
		if (this.esample.length){
			for (var p in this.COLORS){
				var c = this.COLORS[p];

				var box = $('<div class="box" cmd="color"/>');
				box.attr('color', c);
				box.css('background-color', c);

				this.esample.append(box);
			}
		}

		// create user box
		if (this.euser.length){
			for (var i=0; i < this.NUMS_USER_BOX; i++){
				var box = $('<div class="box" cmd="color"/>');
				var inbox = $('<div/>');
				
				box.append(inbox);
				this.euser.append(box);
			}
		}

		this.cmd('color').click(this, function (e){
			var color = $(this).attr('color');
			if (color)
				e.data.setColor(color);
		});
	},

	//-----------------------------------------------------------

	setMouseTracking: function (e, callback){
		e.mousedown({ self: this, e: e, callback: callback}, function (e){
			e.data.callback(e);

			//console.log('[MOUSE][MOVE]');

			$(document).bind('mousemove', { self: e.data.self, e: e.data.e }, e.data.callback);
		});

		$(document).mouseup({ self: this, e: e, callback: callback}, function (e){
			//console.log('[MOUSE][UP]');
			$(document).unbind('mousemove', e.data.callback);
		});
	},

	createPickingArea: function() {
		var area = $('<div/>');
		var picker = $('<div/>');

		area.addClass('picking-area');
		picker.addClass('picker');

		this.pickingArea = area;
		this.picker = picker;

		this.setMouseTracking(area, this.updateColor.bind(this));

		area.append(picker);
		this.epicker.append(area);
	},

	createHueArea: function() {
		var area = $('<div/>');
		var picker = $('<div/>');

		area.addClass('hue');
		picker.addClass('slider-picker');

		this.hueArea = area;
		this.huePicker = picker;

		this.setMouseTracking(area, this.updateHueSlider.bind(this));

		area.append(picker);
		this.epicker.append(area);
	},

	createAlphaArea: function() {
		var area = $('<div/>');
		var mask = $('<div/>');
		var picker = $('<div/>');

		area.addClass('alpha');
		mask.addClass('alpha-mask');
		picker.addClass('slider-picker');

		this.alphaArea = area;
		this.alphaMask = mask;
		this.alphaPicker = picker;

		this.setMouseTracking(area, this.updateAlphaSlider.bind(this));

		area.append(mask);
		mask.append(picker);
		this.epicker.append(area);
	},

	createPreviewBox: function(e) {
		var previewBox = $('<div/>');
		var previewColor = $('<div/>');

		previewBox.addClass('preview');
		previewColor.addClass('preview-color');

		this.previewColor = previewColor;

		previewBox.append(previewColor);
		this.epicker.append(previewBox);
	},

	newInputComponent: function (title, topic, onChangeFunc) {
		var wrapper = $('<div/>');
		var input = $('<input type="text"/>');
		var info = $('<span/>');

		wrapper.addClass('input');
		wrapper.attr('data-topic', topic);
		
		info.text(title);
		info.addClass('name');

		wrapper.append(info);
		wrapper.append(input);

		this.epicker.append(wrapper);

		input.change(this, onChangeFunc);
		input.click(this, function(e) {
			this.select();
		});

		this.topics[topic] = input;

		return wrapper;
	},

	notify: function (topic, value){
		if (this.topics[topic]){
			this.topics[topic].val(value);
		}
	},

	/*************************************************************************/
	//					Updates properties of UI elements
	/*************************************************************************/

	updateColor: function (e) {
		var offset = this.pickingArea.offset();

		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;
		var picker_offset = 5;

		// width and height should be the same
		var size = this.pickingArea.width();

		if (x > size) x = size;
		if (y > size) y = size;
		if (x < 0) x = 0;
		if (y < 0) y = 0;

		var value = 100 - (y * 100 / size) | 0;
		var saturation = x * 100 / size | 0;

		this.color.hsv(this.color.h, saturation, value);

		this.picker.css('left', x - picker_offset);
		this.picker.css('top', y - picker_offset);

		this.updateAlphaGradient();
		this.updatePreviewColor();

		this.notify('value', value);
		this.notify('saturation', saturation);

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);
		this.notify('hexa', this.color.hex());
	},

	updateHueSlider: function(e) {
		var offset = this.hueArea.offset();

		var x = e.pageX - offset.left;
		var width = this.hueArea.width();

		if (x < 0) x = 0;
		if (x > width) x = width;

		// TODO 360 => 359
		var hue = ((359 * x) / width) | 0;
		// if (hue === 360) hue = 359;

		this.updateSliderPosition(this.huePicker, x);

		this.setHue(hue);
	},

	updateAlphaSlider: function(e) {
		if (this.color.locka !== false)
			return;

		var offset = this.alphaArea.offset();

		var x = e.pageX - offset.left;
		var width = this.alphaArea.width();

		if (x < 0) x = 0;
		if (x > width) x = width;

		this.color.a = (x / width).toFixed(2);

		this.updateSliderPosition(this.alphaPicker, x);
		this.updatePreviewColor();

		this.notify('alpha', this.color.a);
	},

	/*************************************************************************/
	//						Update background colors
	/*************************************************************************/

	updatePickerBackground: function() {
		var rgb = AbColor.hsv2rgb(this.color.h, 1, 1);
		this.pickingArea.css('background-color', AbCss.hex(rgb[0], rgb[1], rgb[2]));
	},

	updateAlphaGradient: function() {
		this.alphaMask.css('background-color', this.color.hex());
	},

	updatePreviewColor: function() {
		//this.previewColor.css('background-color', this.color.color());
		var c = this.color.color();
		//console.log('[PREVIEW] ' + c);

		this.previewColor.css('background-color', c);
	},

	setHue: function(value) {
		if (typeof(value) !== 'number' || isNaN(value) === true ||
			value < 0 || value > 359)
			return;
		
		this.color.h = value;
		this.color.from('HSV');

		this.updatePickerBackground();
		this.updateAlphaGradient();
		this.updatePreviewColor();

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);
		this.notify('hexa', this.color.hex());
		this.notify('hue', this.color.h);

	},

	// Updates when one of Saturation/Value/Lightness changes
	updateSLV: function() {
		this.updatePickerPosition();
		this.updateAlphaGradient();
		this.updatePreviewColor();

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);
		this.notify('hexa', this.color.hex());
	},

	/*************************************************************************/
	//				Update positions of various UI elements
	/*************************************************************************/

	updatePickerPosition: function() {
		var size = this.pickingArea.width();
		var value = 0;
		var offset = 5;

		value = this.color.v;

		var x = (this.color.s * size / 100) | 0;
		var y = size - (value * size / 100) | 0;

		this.picker.css('left', x - offset);
		this.picker.css('top', y - offset);
	},

	updateSliderPosition: function(e, pos) {
		e.css('left', Math.max(pos - 3, -2));
	},

	updateHuePicker: function() {
		var size = this.hueArea.width();
		var offset = 1;
		var pos = (this.color.h * size / 360 ) | 0;

		this.huePicker.css('left', pos - offset);
	},

	updateAlphaPicker: function() {
		var size = this.alphaArea.width();
		var offset = 1;
		var pos = (this.color.a * size) | 0;

		this.alphaPicker.css('left', pos - offset);
		this.updatePreviewColor();
	},

	/*************************************************************************/
	//							Set Picker Properties
	/*************************************************************************/

	getColor: function () { return this.color.color(); },

	setColor: function() {
		if (arguments.length)
			this.color.set.apply(this.color,arguments);

		this.updateHuePicker();
		this.updatePickerPosition();
		this.updatePickerBackground();
		this.updateAlphaPicker();
		this.updateAlphaGradient();
		this.updatePreviewColor();

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);

		this.notify('hue', this.color.h);
		this.notify('saturation', this.color.s);
		this.notify('value', this.color.v);

		this.notify('alpha', this.color.a);
		this.notify('hexa', this.color.hex());
	},

	/*************************************************************************/
	//						Update input elements
	/*************************************************************************/

	isValidRGBValue: function(value) {
		return (typeof(value) === 'number' && isNaN(value) === false &&
			value >= 0 && value <= 255);
	},

	isValidHueValue: function(value) {
		return (typeof(value) === 'number' && isNaN(value) === false &&
			value >= 0 && value <= 359);
	},

	isValidPercentValue: function(value) {
		return (typeof(value) === 'number' && isNaN(value) === false &&
			value >= 0 && value <= 100);
	},

	inputChangeHue: function(e) {
		var value = parseInt(e.target.value);
		if (!this.isValidHueValue(value)){
			e.target.value = this.color.h;
			return;
		}
		
		this.setHue(value);
		this.updateHuePicker();
	},

	inputChangeSaturation: function(e) {
		var value = parseInt(e.target.value);
		if (!this.isValidPercentValue(value)){
			e.target.value = this.color.s;
			return;
		}

		this.color.s = value;
		this.color.from('HSV');

		this.updateSLV();
	},

	inputChangeValue: function(e) {
		var value = parseInt(e.target.value);
		if (!this.isValidPercentValue(value)){
			e.target.value = this.color.v;
			return;
		}

		this.color.v = value;
		this.color.from('HSV');
		
		this.updateSLV();
	},

	inputChangeRed: function(e) {
		var value = parseInt(e.target.value);
		if (!this.isValidPercentValue(value)){
			e.target.value = this.color.r;
			return;
		}
		
		this.color.r = value;
		this.color.from('RGB');
		
		this.setColor();
	},

	inputChangeGreen: function(e) {
		var value = parseInt(e.target.value);
		if (!this.isValidPercentValue(value)){
			e.target.value = this.color.g;
			return;
		}
		
		this.color.g = value;
		this.color.from('RGB');
		
		this.setColor();
	},

	inputChangeBlue: function(e) {
		var value = parseInt(e.target.value);
		if (!this.isValidPercentValue(value)){
			e.target.value = this.color.b;
			return;
		}
		
		this.color.b = value;
		this.color.from('RGB');
		
		this.setColor();
	},

	inputChangeAlpha: function(e) {
		if (this.color.locka !== false){
			e.target.value = this.color.a;
			return;
		}

		var value = parseFloat(e.target.value);

		if (typeof value === 'number' && isNaN(value) === false &&
			value >= 0 && value <= 1)
			this.color.a = value.toFixed(2);

		e.target.value = this.color.a;

		this.updateAlphaPicker();
	},

	inputChangeHexa: function(e) {
		var value = e.target.value;

		var rgb = AbCss.color(value);
		if (rgb){
			if (rgb.length == 4)
				this.color.rgb(rgb[0],rgb[1],rgb[2],rgb[3]);
			else
				this.color.rgb(rgb[0],rgb[1],rgb[2],1);
			this.setColor();
		}else{
			e.target.value = this.color.hex();
		}
	},

	/*************************************************************************/
	//							Tool
	/*************************************************************************/

};