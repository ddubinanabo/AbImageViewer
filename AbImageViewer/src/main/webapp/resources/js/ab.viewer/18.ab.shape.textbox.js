function AbShapeTextBox(options){
	if (!options) options = {};
	var style = options.style || {};
	var strokeStyle = style.stroke || {};
	var textStyle = style.text || {};
	var textPadding = options.textPadding || { left: 2, top: 2, right: 2, bottom: 2 };

	this.name = 'textbox';		// name of shape
	this.type = 'annotation';	// annotation, masking
	this.shapeType = 'shape';	// shape, polygon, image
	this.shapeStyle = 'box';	// box, line
	this.token = null;			// token for using	

	this.selected = false;
	this.focused = false;

	this.indicator = AbCommon.isDefined(AbBoxEditIndicator) ? new AbBoxEditIndicator({ target: this }) : null;

	this.text = options.text || '';
	this.textWidth = 0;
	this.textHeight = 0;
	this.textEditMode = false;
	this.textPadding = {
		left: textPadding.left,
		top: textPadding.top,
		right: textPadding.right,
		bottom: textPadding.bottom,

		horiz: function() { return this.left + this.right; },
		vert: function() { return this.top + this.bottom; },
	};
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
			width: strokeStyle.width || 1,
			color: strokeStyle.color || '#5B522B',
		},

		text: {
			size: textStyle.size || '16px',
			font: textStyle.font || 'tahoma',
			italic: textStyle.italic || false,
			bold: textStyle.bold || false,
			color: textStyle.color || 'black',
			lineHeight: textStyle.lineHeight || 1.25,
		},

		color: style.color || 'rgba(254,238,176,1)' //'#FFE679',
	};
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeTextBox.prototype = {
	constructor: AbShapeTextBox,

	//-----------------------------------------------------------

	styleDesc: function(){
		return {
			select: [ 'color', 'stroke.width' ],
			descs: [
				{ name: 'color', text: '채우기색상', style: 'color', alpha: false, notset: false },
				{ name: 'stroke', text: '선 스타일', childs: [
					{ name: 'width', text: '두께', style: 'select', type: 'number', values: 'lineWidth' },
					{ name: 'color', text: '색상', style: 'color', alpha: false },
				] },
				{ name: 'text', text: '글자 스타일', childs: [
					{ name: 'size', text: '크기', style: 'select', unit: 'px', values: 'fontSize' },
					{ name: 'font', text: '글자모양', style: 'select', type: 'string', values: 'font' },
					{ name: 'italic', text: '기울림', style: 'check' },
					{ name: 'bold', text: '굵게', style: 'check' },
					{ name: 'color', text: '색상', style: 'color', alpha: false, notset: false },
					{ name: 'lineHeight', text: '글자높이', style: 'text', type: 'number', unit: '%', range: { start: 10 } },
				] },
			],
		};
	},
	
	//-----------------------------------------------------------

	prepare: function(){},
	reset: function(){
		this.text = '';
	},

	//-----------------------------------------------------------

	serialize: function(){
		var serializer = new AbShapeSerializer();

		serializer.add('name', this.name);
		serializer.add('type', this.type);
		serializer.add('shapeType', this.shapeType);
		serializer.add('shapeStyle', this.shapeStyle);

		serializer.add('token', this.token);

		serializer.add('text', this.text);

		serializer.add('angle', this.angle);
		serializer.add('x', Math.round(this.x));
		serializer.add('y', Math.round(this.y));
		serializer.add('width', Math.round(this.width));
		serializer.add('height', Math.round(this.height));

		serializer.add('textPadding', this.textPadding);
		
		var style = serializer.addGroup('style');
		serializer.add(style, 'color', this.style.color);
		
		var stroke = serializer.addGroup(style, 'stroke');
		serializer.add(stroke, 'width', this.style.stroke.width);
		serializer.add(stroke, 'color', this.style.stroke.color);
		
		var text = serializer.addGroup(style, 'text');
		serializer.add(text, 'size', this.style.text.size);
		serializer.add(text, 'font', this.style.text.font);
		serializer.add(text, 'italic', this.style.text.italic);
		serializer.add(text, 'bold', this.style.text.bold);
		serializer.add(text, 'color', this.style.text.color);
		serializer.add(text, 'lineHeight', this.style.text.lineHeight);

		return serializer.serialize();
	},

	//-----------------------------------------------------------

	notify: function(cmd){
		if (cmd == 'created'){
			this.text = '내용을 입력하세요';

			if (arguments.length == 5){
				var x1 = arguments[1];
				var y1 = arguments[2];
				var x2 = arguments[3];
				var y2 = arguments[4];

				this.move(x2, y2);
			}
		}else if (cmd == 'measured'){
			var gap = this.style.stroke.width << 1;
			var w = this.textWidth << 1;
			var h = this.textHeight << 1;
			this.size(w + this.textPadding.horiz() + gap, h + this.textPadding.vert() + gap);
			this.measure();
		}else if (cmd == 'styled'){
			var gap = this.style.stroke.width << 1;
			this.size(this.textWidth + this.textPadding.horiz() + gap, this.textHeight + this.textPadding.vert() + gap);
		}
	},

	//-----------------------------------------------------------

	creationStyle: function(){ return 'click'; },

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
			this.box(box.x, box.y, box.width, box.height);
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
			var x = arguments[0];
			var y = arguments[1];
			var width = arguments[2];
			var height = arguments[3];

			var isSameSize = this.width == width && this.height == height;

			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;

			if (!isSameSize) this.measure();
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
	minimum: function(){ return { width: 50, height: 50 }; },
	//minimum: function(){ return  this.measureSize(null, 10, this.text); },

	//-----------------------------------------------------------

	resizable: function (width, height){
		var m = this.measureSize(null, width, this.text);
		var textSize = AbGraphics.size.minimum(this.textWidth, this.textHeight, m);
		var mbox = AbGraphics.size.maximum(textSize.width + this.textPadding.horiz(), textSize.height + this.textPadding.vert(), this.minimum());

		var overW = mbox.width > width;
		var overH = mbox.height > height;

		var result = true;
		if (overW && overH) result = false;
		else if (overW) result = 'h';
		else if (overH) result = 'v';

		return { result: result, width: mbox.width, height: mbox.height };
	},

	//-----------------------------------------------------------

	padding: function() { return { left: 0, top: 0, right: 0, bottom: 0 }; },
	contains: function(x, y, w, h){ return this.indicator.contains.apply(this.indicator, arguments); },
	editable: function (x, y){ if (this.selected) return this.indicator.editable.apply(this.indicator, arguments); return null; },
	editPos: function (point){ return this.indicator.editPos.apply(this.indicator, arguments); },
	resize: function (point, px, py){ return this.indicator.resize.apply(this.indicator, arguments); },
	measure: function(){ return this.measureSize(null, this.width, this.text); },

	//-----------------------------------------------------------

	size: function (width, height){
		if (arguments.length){
			var page = this.engine.currentPage;
			var pos = page.toCanvas(this.x, this.y);
			var siz = { width: this.width * page.scale.x, height: this.height * page.scale.y };
			var newsiz = { width: width * page.scale.x, height: height * page.scale.y };
			
			//var crbox = this.indicator.correct('RB', this.x, this.y, width, height, this.width, this.height);
			var crbox = this.indicator.correct('RB', pos.x, pos.y, newsiz.width, newsiz.height, siz.width, siz.height);
			pos = page.fromCanvas(crbox.x, crbox.y);

			this.x = pos.x;
			this.y = pos.y;
			this.width = crbox.width / page.scale.x;
			this.height = crbox.height / page.scale.y;
			
			// this.x = crbox.x;
			// this.y = crbox.y;
			// this.width = crbox.width;
			// this.height = crbox.height;

			return;
		}
		return { width: this.width, height: this.height };
	},

	measureSize: function(ctx, width, text){
		var ctx = null;
		if (ctx == null && this.engine) ctx = this.engine.context;
		if (!ctx) return null;

		ctx.save();
		this.setTextSyle(ctx);
		
		var textPadding = this.textPadding;
		var gap = this.style.stroke.width;
		var px = AbCss.pixel(this.style.text.size);
		var lineHeight = px * this.style.text.lineHeight;

		var r = this.wrapMeasureText(ctx, text, width - textPadding.horiz() - (gap << 1), lineHeight);

		ctx.restore();

		r.changed = this.textWidth != r.width && this.textHeight != r.height;

		this.textWidth = r.width;
		this.textHeight = r.height;

		return r;
	},

	//-----------------------------------------------------------

	testInlineEdit: function (ctx, x, y){
		if (this.angle){
			var center = this.center();
			var r = AbGraphics.angle.point(-this.angle, center.x, center.y, x, y);
			x = r.x;
			y = r.y;
		}

		var gap = this.style.stroke.width;
		var textPadding = this.textPadding;
		return AbGraphics.contains.box(this.x + textPadding.left + gap, this.y + textPadding.top + gap, this.textWidth, this.textHeight, x, y);
	},

	inlineEdit: function(engine, endEdit){
		var textbox = engine.textbox;

		textbox.on('focusout', { engine: engine, shape: this, textbox: textbox }, function (e){
			var element = $(this);
			var s = e.data.shape;

			s.text = element.val();
			textbox.off();
			textbox.hide();

			s.measure();

			if (s.width < s.textWidth || s.height < s.textHeight){
				var gap = s.style.stroke.width;
				s.size(s.textWidth + s.textPadding.horiz() + gap, s.textHeight + s.textPadding.vert() + gap);
			}

			s.textEditMode = false;

			// end record history
			e.data.engine.history.end(e.data.engine);

			e.data.engine.render();	
		});

		textbox.on('input', { engine: engine, shape: this, textbox: textbox }, function (e){
			var element = $(this);
			var s = e.data.shape;

			var w = null, h = null;
			if (this.scrollWidth > element.width())
				w = this.scrollWidth;
			if (this.scrollHeight > element.height())
				h = this.scrollHeight;

			var left = s.textPadding.left + s.style.stroke.width;
			var top = s.textPadding.top + s.style.stroke.width;
			var horiz = s.textPadding.horiz() + (s.style.stroke.width << 1);
			var vert = s.textPadding.vert() + (s.style.stroke.width << 1);

			var pc = { x: w ? w : s.width, y: h ? h : s.height };
			
			if (w != null && h != null){
				// element.width(w);
				// element.height(h);
				
				s.size(pc.x, pc.y);

				var x = s.x + left;
				var y = s.y + top;
		
				//e.data.textbox.move(x, y);
				e.data.textbox.box(s.x, s.y, s.width, s.height);

				e.data.engine.render();
			}else if (w != null){
				//element.width(w);
				s.size(pc.x, pc.y);

				var x = s.x + left;
				var y = s.y + top;
		
				//e.data.textbox.move(x, y);
				e.data.textbox.box(s.x, s.y, s.width, s.height);

				e.data.engine.render();
			}else if (h != null){
				//element.height(h);
				s.size(pc.x, pc.y);

				var x = s.x + left;
				var y = s.y + top;
		
				//e.data.textbox.move(x, y);

				e.data.textbox.box(s.x + left, s.y + top, s.width - horiz, s.height - vert);

				e.data.engine.render();
			}
		});

		var px = AbCss.pixel(this.style.text.size); 
		var rgb = AbCss.color(this.style.color);
		if (rgb.length == 4 && rgb[3] < 1){
			console.log('[RGB] ' + rgb);

			var hsv = AbColor.rgb2hsv(rgb[0], rgb[1], rgb[2]);
			console.log('[RGB -> HSV] ' + hsv);

			hsv[1] = rgb[3] * hsv[1];
			console.log('[MODIFIED HSV] ' + hsv);

			var rgb = AbColor.hsv2rgb(hsv[0], hsv[1], hsv[2]);
			console.log('[HSV -> RGB] ' + rgb);
		}

		textbox.attr('modified-size', 'false');
		textbox.val(this.text);
		textbox.css({
			// paddingLeft: this.textPadding.left,
			// paddingTop: this.textPadding.top,
			// paddingRight: this.textPadding.right,
			// paddingBottom: this.textPadding.bottom,
			background: 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')', //this.style.color,
			color: this.style.text.color,
			fontFamily: this.style.text.font,
			fontSize: px + 'px',
			lineHeight: (this.style.text.lineHeight * 100) + '%'
		});

		if (this.style.text.italic)
			textbox.css('font-style', 'italic');

		if (this.style.text.bold)
			textbox.css('font-weight', '700');

		var gap = this.style.stroke.width;

		// begin record history
		engine.history.begin('shape', 'update', engine, ['angle', 'x', 'y', 'width', 'height', 'textWidth', 'textHeight', 'text']);
		
		this.textEditMode = true;
		
		// 스크롤바를 없애기 위해 폭/높이에 (gap<<1)을 더하지 않음
		textbox.show(
			this.x + this.textPadding.left + gap, this.y + this.textPadding.top + gap,
			this.width - this.textPadding.horiz() - (gap<<1), this.height - this.textPadding.vert() - (gap<<1), this.angle);
	},

	//-----------------------------------------------------------

	wrapMeasureText: function (ctx, text, maxWidth, lineHeight, scaleX){
		if (!scaleX) scaleX = 1;
		maxWidth = Math.round(maxWidth);

		var lineSize = [], w = 0, h = 0;
		var lines = text.split('\n');
		var lineLen = lines.length, tm = null, testLine = null, line = null, words = null, n = 0, txtWidth = 0;
		for (var iline=0; iline < lineLen; iline++){
			words = lines[iline].split(' ');

			line = '';
			for(n = 0; n < words.length; n++) {
				testLine = line + (line.length ? ' ' : '') + words[n];
				tm = ctx.measureText(testLine);
				txtWidth = Math.round(tm.width * scaleX);
	
				if (txtWidth > maxWidth && n > 0) {
					tm = ctx.measureText(line);
					txtWidth = Math.round(tm.width * scaleX);
					if (w == 0 || w < txtWidth) w = txtWidth;
					lineSize.push(txtWidth);

					h += lineHeight;
					line = words[n];
				}else {
					line = testLine;
				}
			}
			if (line){
				tm = ctx.measureText(line);
				txtWidth = Math.round(tm.width * scaleX);
				if (w == 0 || w < txtWidth) w = txtWidth;
					lineSize.push(txtWidth);
			
				h += lineHeight;
			}
		}

		return {
			width: w,
			height: h,
			lines: lineSize
		};
	},

	wrapText: function(ctx, text, x, y, maxWidth, lineHeight, scaleX) {
		if (!scaleX) scaleX = 1;
		maxWidth = Math.round(maxWidth);

		var lines = text.split('\n');
		var lineLen = lines.length, tm = null, testLine = null, line = null, words = null, n = 0, txtWidth = 0;
		for (var iline=0; iline < lineLen; iline++){
			words = lines[iline].split(' ');

			line = '';
			for(n = 0; n < words.length; n++) {
				testLine = line + (line.length ? ' ' : '') + words[n];
				tm = ctx.measureText(testLine);
				txtWidth = Math.round(tm.width * scaleX);
	
				if (txtWidth > maxWidth && n > 0) {
					ctx.fillText(line, x, y);
					y += lineHeight;
					line = words[n];
				}else {
					line = testLine;
				}
			}
			if (line){
				ctx.fillText(line, x, y);
				y += lineHeight;
			}
		}
	},

	//-----------------------------------------------------------

	setTextSyle: function (ctx){
		var style = this.style.text;
		
		var font = '';
		if (style.italic) font += 'italic ';
		if (style.bold) font += '700 ';
		if (style.size) font += style.size + ' ';
		if (style.font) font += style.font + ' ';

		var engineScale = this.engine.currentPage.scale;

		ctx.lineWidth = 1;
		ctx.fillStyle = style.color;
		ctx.strokeStyle = style.color;
		ctx.font = $.trim(font);
		ctx.scale(engineScale.x, engineScale.y);
		//ctx.textBaseline = 'hanging';
		ctx.textBaseline = 'top';
	},

	draw: function(ctx, page, direct){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;
		
		AbShapeTool.beginRectDraw(this, ctx, page);

		var drawWidth = this.width * scaleX;
		var drawHeight = this.height * scaleY;
		
		if (this.style.color){
			ctx.fillStyle = this.style.color;
			ctx.fillRect(0, 0, drawWidth, drawHeight);
		}

		if (this.style.stroke.width && this.style.stroke.color){
			ctx.strokeStyle = this.style.stroke.color;
			ctx.lineWidth = this.style.stroke.width;

			ctx.strokeRect(0, 0, drawWidth, drawHeight);
		}

		var gap = this.style.stroke.width;
		var textPadding = this.textPadding;
		var hs = textPadding.horiz();

		this.setTextSyle(ctx);

		//var tm = ctx.measureText(this.text);
		//ctx.strokeText(this.text, textPadding.left, textPadding.top + tm.height);
		//ctx.fillText(this.text, textPadding.left, textPadding.top);

		if (!this.textEditMode){
			var px = AbCss.pixel(this.style.text.size);
			var lineHeight = px * this.style.text.lineHeight;

			this.wrapText(ctx, this.text, textPadding.left + gap, textPadding.top + gap, this.width - hs - (gap << 1), lineHeight);
		}

		//-------------------------

		// var r = this.wrapMeasureText(ctx, this.text, this.width - textPadding.horiz(), lineHeight);
		// ctx.strokeStyle = 'blue';
		// ctx.fillStyle = 'blue';
		// //ctx.arc(0, 0, 300, 0, 360);
		// ctx.lineWidth = 1;
		// ctx.strokeRect(textPadding.left, textPadding.top, r.width, r.height);
		// ctx.fillStyle = 'cyan';
		// ctx.font = '700 16px tahoma';
		// ctx.fillText('text(width='+r.width+', height='+r.height+')', 0, textPadding.top + this.style.stroke.width + r.height + 5);

		// console.log('[INLINE][TEST] width=' + this.width + ', textWidth=' + r.width + ', textHeight=' + r.height + ', lines=' + r.lines);

		//-------------------------

		// ctx.strokeStyle = 'red';
		// ctx.fillStyle = 'red';
		// ctx.lineWidth = 1;
		// ctx.strokeRect(textPadding.left + gap, textPadding.top + gap, this.textWidth, this.textHeight);
		// ctx.scale(0.7, 1.2);
		// ctx.fillStyle = 'cyan';
		// ctx.font = '700 16px tahoma';
		// ctx.fillText('text(width='+this.textWidth+', height='+this.textHeight+')', 0, textPadding.top + gap + this.textHeight + 5);

		//console.log('[INLINE][DRAW] width=' + this.width + ', textWidth(Measured)=' + this.textHeight);

		//-------------------------
		
		AbShapeTool.endDraw(this, ctx);

		//-------------------------

		// ctx.strokeStyle = 'red';
		// ctx.fillStyle = 'red';
		// ctx.arc(0, 0, 200, 0, 360);
		// ctx.fill();

		// var page = this.engine.currentPage;
		// var tbox = this.box();
		// var tpadding = this.padding();

		// tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
			
		// //tbox = AbCommon.pageCoordinate(this, tbox.x, tbox.y, tbox.width, tbox.height);

		// //tbox = page.toCanvasBox(tbox);
		// ctx.strokeRect(tbox.x, tbox.y, tbox.width, tbox.height);
		// tbox = page.toCanvasBox(tbox);
		// var b = AbGraphics.angle.bounds(this.angle, tbox.x, tbox.y, tbox.width, tbox.height);
		// ctx.strokeStyle = 'cyan';
		// ctx.strokeRect(b.x, b.y, b.width, b.height);
	},
}