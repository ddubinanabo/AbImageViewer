function AbShapePen(options){
	if (!options) options = {};
	var style = options.style || {};

	this.name = 'pen';			// name of shape
	this.type = 'annotation';	// annotation, masking
	this.shapeType = 'shape';	// shape, polygon, image
	this.shapeStyle = 'box';	// box, line
	this.token = null;			// token for using	

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
		width: style.width || 1,
		color: style.color || 'rgb(41, 0, 139)',
	};

	// editor에 생성시 크기를 지정할 필요없음을 명시
	this.creationSize = 'auto';
	// editor에 좌료를 수집해야 한다는 것을 명시
	this.collectPoints = true;
	this.points = $.isArray(options.points) ? options.points : [];

	this.minPointX = this.minPointY = this.maxPointX = this.maxPointY = 0;

	// 기존에 있는 point 체크
	this.prepare();
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapePen.prototype = {
	constructor: AbShapePen,

	//-----------------------------------------------------------

	styleDesc: function(){
		return {
			descs: [
				{ name: 'width', text: '두께', style: 'select', type: 'number', values: 'lineWidth' },
				{ name: 'color', text: '색상', style: 'color', notset: false },
			],
		};
	},

	//-----------------------------------------------------------

	prepare: function (){
		var len = this.points.length;
		for (var i=0; i < len; i++){
			var p = this.points[i];

			this.minPointX = i == 0 || p.x < this.minPointX ? p.x : this.minPointX;
			this.minPointY = i == 0 || p.y < this.minPointY ? p.y : this.minPointY;
			this.maxPointX = i == 0 || p.x > this.maxPointX ? p.x : this.maxPointX;
			this.maxPointY = i == 0 || p.y > this.maxPointY ? p.y : this.maxPointY;
		}

		this.minPointX += this.x;
		this.minPointY += this.y;
		this.maxPointX += this.x;
		this.maxPointY += this.y;
	},

	reset: function(){
		this.points.splice(0, this.points.length);
		this.minPointX = this.minPointY = this.maxPointX = this.maxPointY = 0;
	},

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
		serializer.add(style, 'width', this.style.width);

		serializer.add('points', this.points);

		return serializer.serialize();
	},

	//-----------------------------------------------------------
	
	notify: function(cmd){},

	//-----------------------------------------------------------

	addPoints: function (points){
		var len = points.length;
		for (var i=0; i < len; i++)
			this.addPoint(points[i]);
		this.endPoint();
	},

	//-----------------------------------------------------------

	addPoint: function(x, y){
		var len = this.points.length;
		this.minPointX = len == 0 || x < this.minPointX ? x : this.minPointX;
		this.minPointY = len == 0 || y < this.minPointY ? y : this.minPointY;
		this.maxPointX = len == 0 || x > this.maxPointX ? x : this.maxPointX;
		this.maxPointY = len == 0 || y > this.maxPointY ? y : this.maxPointY;

		this.points.push({ x:x, y:y });
	
		this.x = this.minPointX;
		this.y = this.minPointY;
		this.width = (this.maxPointX) - this.x;
		this.height = (this.maxPointY) - this.y;

		//console.log('[POINT] x='+x+', y='+y + ' [BOX] min(x=' + this.minPointX + ', y=' + this.minPointY+'), max(x='+this.maxPointX+', y=' + this.maxPointY+')');
	},

	endPoint: function(){
		var len = this.points.length;
		for (var i=0; i < len; i++){
			var p = this.points[i];
			p.x -= this.minPointX;
			p.y -= this.minPointY;

			//console.log('{ x:' + p.x + ', y:' + p.y + ' },');
		}

		//var s = '['; for (var i=0; i < len; i++){ var p = this.points[i]; s += '{ x:' + p.x + ', y:' + p.y + ' }, ';  } s += '],'; console.log(s);
	},

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

	hasPointSize: function (){ return this.minPointX && this.minPointY && this.maxPointX && this.maxPointY; },
	hasSize: function (){ return this.x && this.y && this.width && this.height; },

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

	//-----------------------------------------------------------

	padding: function() { return { left: 0, top: 0, right: 0, bottom: 0 }; },
	//contains: function(x, y, w, h){ return this.indicator.contains.apply(this.indicator, arguments); },
	contains: function(x, y, w, h){
		var configValue = this.engine.selectionStyle(this.name);
		var len = this.points.length;

		if (configValue === 'box' || arguments.length >= 4 || len < 2)
			return this.indicator.contains.apply(this.indicator, arguments);

		var page = this.engine.currentPage;
		var tbox = this.box();
		var tpadding = this.padding();

		tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
		tbox = page.toCanvasBox(tbox.x, tbox.y, tbox.width, tbox.height);

		var pc = page.toCanvas(x, y);
		x = pc.x; y = pc.y;

		if (this.angle){
			var centerX = tbox.x + (tbox.width >> 1), centerY = tbox.y + (tbox.height >> 1);
			var r = AbGraphics.angle.point(-this.angle, centerX, centerY, x, y);
			x = r.x;
			y = r.y;
		}
	
		var scaleX = page.scale.x, scaleY = page.scale.y;
		var r = AbGraphics.box.zoom(this.maxPointX - this.minPointX, this.maxPointY - this.minPointY, this.width, this.height);
		scaleX *= r.ratioX;
		scaleY *= r.ratioY;

		var startX = tbox.x, startY = tbox.y;
		//var v = Math.round(2 * r.ratio);
		v = 3;
		var len = this.points.length;
		var lp = null;
		for (var i=0; i < len; i++){
			var p = this.points[i];
			if (lp && AbGraphics.contains.line(
						startX + Math.round(lp.x * scaleX),
						startY + Math.round(lp.y * scaleY),
						startX + Math.round(p.x * scaleX),
						startY + Math.round(p.y * scaleY), x, y, v))
				return true;
			lp = p;
		}
		return false;
	},
	editable: function (x, y){ if (this.selected){ return this.indicator.editable(x, y); } return null; },
	editPos: function (point){ return this.indicator.editPos(point); },
	resize: function (point, px, py){ return this.indicator.resize(point, px, py); },
	measure: function(){},

	//-----------------------------------------------------------

	drawStyle: function (ctx){
		ctx.strokeStyle = this.style.color;
		ctx.lineWidth = this.style.width;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
	},

	creationDraw: function (ctx, page, selection){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;

		this.drawStyle(ctx);

		ctx.beginPath();

		var len = this.points.length;
		if (len == 1){
			var e = page.toCanvas(this.points[0].x, this.points[0].y);

			ctx.fillStyle = this.style.color;
			ctx.arc(this.points[0].x * scaleX, this.points[0].y * scaleY, 1, 0, 360);
			ctx.fill();
		}else{
			this.drawStyle(ctx);

			var s = page.toCanvas(selection.prev.x, selection.prev.y);
			var e = page.toCanvas(selection.end.x, selection.end.y);

			ctx.moveTo(selection.prev.x * scaleX, selection.prev.y * scaleY, s.y);
			ctx.lineTo(selection.end.x * scaleX, selection.end.y * scaleY);
			ctx.stroke();
		}

		ctx.closePath();
	},

	draw: function(ctx, page, direct){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;
		
		if (direct)
			ctx.save();
		else{
			AbShapeTool.beginRectDraw(this, ctx, page);

			var r = AbGraphics.box.zoom(this.maxPointX - this.minPointX, this.maxPointY - this.minPointY, this.width, this.height);
			//ctx.scale(r.ratioX, r.ratioY);
			scaleX *= r.ratioX;
			scaleY *= r.ratioY;
		}

		this.drawStyle(ctx);

		ctx.beginPath();
		var len = this.points.length;
		if (len == 1){
			var p = this.points[0];

			ctx.fillStyle = this.style.color;
			ctx.arc(p.x * scaleX, p.y * scaleY, 1, 0, 360);
			ctx.fill();
		}else{
			for (var i=0; i < len; i++){
				var p = this.points[i];
				var op = i > 0 ? this.points[i - 1] : null;
	
				if (i == 0)
					ctx.moveTo(Math.round(p.x * scaleX), Math.round(p.y * scaleY));
				else{
					//ctx.quadraticCurveTo(op.x + (p.x - op.x), op.y + (p.y - op.y), p.x, p.y);
					//ctx.arcTo(op.x, op.y, p.x, p.y, 1);
					ctx.lineTo(Math.round(p.x * scaleX), Math.round(p.y * scaleY));
				}
			}
			ctx.stroke();
		}

		ctx.closePath();
	
		AbShapeTool.endDraw(this, ctx);
	},
}