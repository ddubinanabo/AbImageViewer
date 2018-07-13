function AbShapeEllipse(options){
	if (!options) options = {};
	var style = options.style || {};
	var strokeStyle = style.stroke || {};

	this.name = 'ellipse';		// name of shape
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
		stroke: {
			width: AbCommon.isNumber(strokeStyle.width) ? strokeStyle.width : 1,
			color: strokeStyle.color || '#41719C',
		},

		color: AbCommon.isDefined(style.color) ? style.color : 'rgba(91,155,213,0.8)',
	};

	//-----------------------------------------------------------

	this.points = [];

	//-----------------------------------------------------------

	this.prepare();
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeEllipse.prototype = {
	constructor: AbShapeEllipse,

	//-----------------------------------------------------------

	styleDesc: function(){
		return {
			select: [ 'color', 'stroke.width' ],
			descs: [
				{ name: 'color', text: '채우기색상', style: 'color' },
				{ name: 'stroke', text: '선 스타일', childs: [
					{ name: 'width', text: '두께', style: 'select', type: 'number', values: 'lineWidth' },
					{ name: 'color', text: '색상', style: 'color', alpha: false },
				] },
			],
		};
	},

	//-----------------------------------------------------------

	prepare: function (){
		if (!this.style.color)
			this.path(this.points, this.width, this.height);
		else
			this.points.splice(0, this.points.length);
	},

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
		
		if (this.style.stroke){
			var stroke = serializer.addGroup(style, 'stroke');
			serializer.add(stroke, 'width', this.style.stroke.width);
			serializer.add(stroke, 'color', this.style.stroke.color);	
		}
		return serializer.serialize();
	},

	//-----------------------------------------------------------
	
	notify: function(cmd){
		if (cmd == 'styled'){
			this.prepare();
		}
	},

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

			var changed = box.width != this.width || box.height != this.height;

			this.x = box.x;
			this.y = box.y;
			this.width = box.width;
			this.height = box.height;

			if (changed) this.prepare();
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

			var changed = arguments[2] != this.width || arguments[3] != this.height;

			this.x = arguments[0];
			this.y = arguments[1];
			this.width = arguments[2];
			this.height = arguments[3];

			if (changed) this.prepare();
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
	contains: function(x, y, w, h){
		if (arguments.length < 4 && !this.style.color){			
			return this.hitTest(x, y, w);
		}
		return this.indicator.contains.apply(this.indicator, arguments);
	},
	editable: function (x, y){ if (this.selected){ return this.indicator.editable(x, y); } return null; },
	editPos: function (point){ return this.indicator.editPos(point); },
	resize: function (point, px, py){ return this.indicator.resize(point, px, py); },
	measure: function(){},

	//-----------------------------------------------------------

	hitTest: function(x, y, ctx){
		var page = this.engine.currentPage;

		var tbox = this.box();
		var tpadding = this.padding();

		tbox = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, tpadding);
		tbox = page.toCanvasBox(tbox);

		var pc = page.toCanvas(x, y);
		x = pc.x; y = pc.y;
		
		if (this.angle){
			var centerX = tbox.x + (tbox.width >> 1), centerY = tbox.y + (tbox.height >> 1);
			var r = AbGraphics.angle.point(-this.angle, centerX, centerY, x, y);
			x = r.x;
			y = r.y;
		}

		//-------------------------------------------------------
		// 클릭한 포인트 표시

		// ctx.fillStyle = 'red';
		// ctx.beginPath();
		// ctx.moveTo(x, y);
		// ctx.arc(x, y, 5, 0, 360);
		// ctx.fill();
		// ctx.closePath();

		//-------------------------------------------------------

		var scaleX = page.scale.x, scaleY = page.scale.y;
		var len = this.points.length;
		for(var i = 1; i < len; i ++){
			var p1x = tbox.x + this.points[i-1].x * scaleX;
			var p1y = tbox.y + this.points[i-1].y * scaleY;
			var p2x = tbox.x + this.points[i].x * scaleX;
			var p2y = tbox.y + this.points[i].y * scaleY;

			//-------------------------------------------------------
			// 수집된 포인트 표시
			
			// ctx.fillStyle = 'blue';
			// ctx.beginPath();
			// ctx.moveTo(p2x, p2y);
			// ctx.arc(p2x, p2y, 5, 0, 360);
			// ctx.fill();
			// ctx.closePath();

		//-------------------------------------------------------
			
			var trueDistance = AbGraphics.distance(p1x, p1y, p2x, p2y);
			var testDistance1 = AbGraphics.distance(p1x, p1y, x, y);
			var testDistance2 = AbGraphics.distance(x, y, p2x, p2y);

			// the distance is exactly same if the point is on the straight line
			var r = Math.abs(trueDistance - (testDistance1 + testDistance2));
			//console.log('[ELLIPSE] r=' + r);
			if(r < 0.3)
				return true;
		}
		return false;
	},

	path: function (points, w, h, ctx){
		var x = 0, y = 0;
		var ox = (w / 2) * AbGraphics.curve.KAPPA; // control point offset horizontal
		var oy = (h / 2) * AbGraphics.curve.KAPPA; // control point offset vertical
		var xe = x + w;           // x-end
		var ye = y + h;           // y-end
		var xm = x + w / 2;       // x-middle
		var ym = y + h / 2;       // y-middle

		points.splice(0, points.length);

		AbGraphics.curve.path(points, x, ym, x, ym - oy, xm - ox, y, xm, y);
		AbGraphics.curve.path(points, xm, y, xm + ox, y, xe, ym - oy, xe, ym);
		AbGraphics.curve.path(points, xe, ym, xe, ym + oy, xm + ox, ye, xm, ye);
		AbGraphics.curve.path(points, xm, ye, xm - ox, ye, x, ym + oy, x, ym);

		// for(var i = 0; i < points.length; i ++){
		// 	var dp = points[i];
		// 	ctx.fillStyle = "#0000ff";
		// 	ctx.arc(dp.x, dp.y, 5, 0, Math.PI*2);
		// 	ctx.fill();
		// }
	},

	ellipse: function(ctx, x, y, w, h) {
		var ox = (w / 2) * AbGraphics.curve.KAPPA; // control point offset horizontal
		var oy = (h / 2) * AbGraphics.curve.KAPPA; // control point offset vertical
		var xe = x + w;           // x-end
		var ye = y + h;           // y-end
		var xm = x + w / 2;       // x-middle
		var ym = y + h / 2;       // y-middle

		ctx.moveTo(x, ym);
		ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
		ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
		ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	},

	draw: function(ctx, page, direct){
		var scaleX = page ? page.scale.x : 1, scaleY = page ? page.scale.y : 1;

		AbShapeTool.beginRectDraw(this, ctx, page);
		
		if (this.style.color){
			ctx.fillStyle = this.style.color;
			ctx.beginPath();
			this.ellipse(ctx, 0, 0, this.width * scaleX, this.height * scaleY);
			ctx.fill();
			ctx.closePath();
		}

		if (this.style.stroke && this.style.stroke.width && this.style.stroke.color){
			ctx.strokeStyle = this.style.stroke.color;
			ctx.lineWidth = this.style.stroke.width;

			ctx.beginPath();
			this.ellipse(ctx, 0, 0, this.width * scaleX, this.height * scaleY);
			ctx.stroke();
			ctx.closePath();
		}
	
		AbShapeTool.endDraw(this, ctx);
	},
}