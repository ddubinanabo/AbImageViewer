var AbGraphics = {
	dpi: function () { return 72; },

	cursor: function(dir, angle){
		if (!angle) angle = 0;

		// ↑ ↓
		if ((angle >= 0 && angle <= 22) || (angle >= 338 && angle <= 360) || (angle >= 158 && angle <= 202)){
			switch (dir){
			case 'A': return 'crosshair';
			case 'LT': return 'nwse-resize';
			case 'CT': return 'ns-resize';
			case 'RT': return 'nesw-resize';
			case 'LC': return 'ew-resize';
			case 'RC': return 'ew-resize';
			case 'LB': return 'nesw-resize';
			case 'CB': return 'ns-resize';
			case 'RB': return 'nwse-resize';
			}	
		}
		// ↗ ↙
		else if ((angle >= 23 && angle <= 67) || (angle >= 203 && angle <= 247)){
			switch (dir){
			case 'A': return 'crosshair';
			case 'LT': return 'ns-resize';
			case 'CT': return 'nesw-resize';
			case 'RT': return 'ew-resize';
			case 'LC': return 'nwse-resize';
			case 'RC': return 'nwse-resize';
			case 'LB': return 'ew-resize';
			case 'CB': return 'nesw-resize';
			case 'RB': return 'ns-resize';
			}	
		}
		// → ←
		else if ((angle >= 68 && angle <= 112) || (angle >= 248 && angle <= 292)){
			switch (dir){
			case 'A': return 'crosshair';
			case 'LT': return 'nesw-resize';
			case 'CT': return 'ew-resize';
			case 'RT': return 'nwse-resize';
			case 'LC': return 'ns-resize';
			case 'RC': return 'ns-resize';
			case 'LB': return 'nwse-resize';
			case 'CB': return 'ew-resize';
			case 'RB': return 'nesw-resize';
			}		
		}
		// ↖ ↘
		else if ((angle >= 113 && angle <= 157) || (angle >= 293 && angle <= 337)){
			switch (dir){
			case 'A': return 'crosshair';
			case 'LT': return 'ew-resize';
			case 'CT': return 'nwse-resize';
			case 'RT': return 'ns-resize';
			case 'LC': return 'nesw-resize';
			case 'RC': return 'nesw-resize';
			case 'LB': return 'ns-resize';
			case 'CB': return 'nwse-resize';
			case 'RB': return 'ew-resize';
			}
		}
		return 'default';
	},

	distance: function (x1, y1, x2, y2){
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	},

	rect: function (x1, y1, x2, y2){
		var tx1 = Math.min(x1, x2);
		var ty1 = Math.min(y1, y2);
		var tx2 = Math.max(x1, x2);
		var ty2 = Math.max(y1, y2);

		return { x1: tx1, y1: ty1, x2: tx2, y2: ty2 };
	},

	size: {

		maximum: function (){
			if (arguments.length == 2){
				return {
					width: Math.max(arguments[0].width, arguments[1].width),
					height: Math.max(arguments[0].height, arguments[1].height)
				};	
			}else if (arguments.length == 3){
				return {
					width: Math.max(arguments[0], arguments[2].width),
					height: Math.max(arguments[1], arguments[2].height)
				};	
			}
			return {
				width: Math.max(arguments[0], arguments[2]),
				height: Math.max(arguments[1], arguments[3])
			};
		},
	
		minimum: function (){
			if (arguments.length == 2){
				return {
					width: Math.min(arguments[0].width, arguments[1].width),
					height: Math.min(arguments[0].height, arguments[1].height)
				};	
			}else if (arguments.length == 3){
				return {
					width: Math.min(arguments[0], arguments[2].width),
					height: Math.min(arguments[1], arguments[2].height)
				};	
			}
			return {
				width: Math.min(arguments[0], arguments[2]),
				height: Math.min(arguments[1], arguments[3])
			};
		},	
	},

	curve: {
		KAPPA: .5522848,

		// sx, sy: start point
		// cp1x, cp1y: first control point
		// cp2x, cp2y: second control point
		// ex, ey: end point
		path: function(points, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey){
			// bezier functions
			function b0(t) { return Math.pow(1 - t, 3); };
			function b1(t) { return t * Math.pow(1 - t, 2) * 3; };
			function b2(t) { return (1 - t) * Math.pow(t, 2) * 3; };
			function b3(t) { return Math.pow(t, 3); };
			function getPointOnBezier(sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey, t){
				// the cubic bezier formula is b(t) = p0*(1-t)^3 + p1*3t(1-t)^2 + p2*3(1-t)t^2 + p3*t^3
				return {
					x: sx * b0(t) + cp1x * b1(t) + cp2x * b2(t) + ex * b3(t),
					y: sy * b0(t) + cp1y * b1(t) + cp2y * b2(t) + ey * b3(t)
				};
			};
			function bd0(t) { return 3 * Math.pow(1-t, 2); };
			function bd1(t) { return 6 * (1-t) * t; };
			function bd2(t) { return 3 * Math.pow(t, 2); };
			function getSlopeOfTangentLine(sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey, t){
				// the derivative of the bezier formula	is b'(t) = 3(1-t)^2(p1-p0) + 6(1-t)t(p2-p1) + 3t^2(p3-p2)
				return
					(bd0(t) * (cp1x-sx) + bd1(t) * (cp2x-cp1x) + bd2(t) * (ex-cp2x)) /
					(bd0(t) * (cp1y-sy) + bd1(t) * (cp2y-cp1y) + bd2(t) * (ey-cp2y));
			};
			// utils
			function sign(n){ return n ? n < 0 ? -1 : 1 : 0; }
					
			function divideCurveRecursively(points, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey, t1, t2){
				var prevD = getSlopeOfTangentLine(sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey, t1);
				var currentD = getSlopeOfTangentLine(sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey, t2);
				var dDiff = Math.abs(Math.abs(prevD)-Math.abs(currentD));
				var mDiff = t2-t1;
				var middleT = t1 + mDiff / 2;
					
				if(mDiff > 0.05 && (sign(prevD) !== sign(currentD) || dDiff > 0.2)){
					divideCurveRecursively(points, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey, t1, middleT);
					divideCurveRecursively(points, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey, middleT, t2);
				}
				else
					points.push(getPointOnBezier(sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey, t1));
			}

			for(var i = 0.1; i <= 1.0; i += 0.1){
				divideCurveRecursively(points, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey, i-0.1, i);	
			}
			points.push({ x: ex, y: ey });
		},
	},

	box: {
		rect: function(x1, y1, x2, y2){
			if (!x1) x1 = 0;
			if (!y1) y1 = 0;
			if (!x2) x2 = 0;
			if (!y2) y2 = 0;

			var tx1 = Math.min(x1, x2);
			var ty1 = Math.min(y1, y2);
			var tx2 = Math.max(x1, x2);
			var ty2 = Math.max(y1, y2);
	
			return { x: tx1, y: ty1, width: tx2 - tx1, height: ty2 - ty1 };
		},
		
		inflate: function (x, y, w, h){
			var left = 0, top = 0, right = 0, bottom = 0;
			if (arguments.length == 5){
				var o = arguments[4];
				if (typeof o == 'number'){
					left = top = right = bottom = o;
				}else if (o.width || o.height){
					left = right = o.width;
					top = bottom = o.height;	
				}else{
					top = o.top;
					right = o.right;
					bottom = o.bottom;
					left = o.left;
				}
			}else if (arguments.length == 6) {
				left = right = arguments[4];
				top = bottom = arguments[5];
			} else if (arguments.length == 8) {
				top = arguments[4];
				right = arguments[5];
				bottom = arguments[6];
				left = arguments[7];
			}

			return {
				x: x - left,
				y: y - top,
				width: w + (left + right),
				height: h + (top + bottom)
			};
		},
		
		expand: function (x, y, w, h, siz, ysiz){
			if (arguments.length <= 5) ysiz = siz;
			return {
				x: x - siz,
				y: y - ysiz,
				width: w + (siz << 1),
				height: h + (ysiz << 1)
			};
		},

		zoom: function (srcWidth, srcHeight, limitWidth, limitHeight){
			var ratioX = limitWidth / srcWidth;
			var ratioY = limitHeight / srcHeight;

			return {
				ratio: ratioX > ratioY ? ratioY : ratioX,
				ratioX: ratioX,
				ratioY: ratioY
			};
		},

		limit: function (srcWidth, srcHeight, limitWidth, limitHeight){
			var bOverX = ( limitWidth < srcWidth ), bOverY = ( limitHeight < srcHeight );
			if ( bOverX || bOverY ) {
				var ratioX = ( limitWidth / srcWidth );
				var ratioY = ( limitHeight / srcHeight );
				var ratio = ratioX > ratioY ? ratioY : ratioX;
				
				return {
					width : parseInt (srcWidth * ratio),
					height : parseInt (srcHeight * ratio),
					ratio : ratio, direct : ratioX > ratioY ? 'Y' : 'X',
					ratioX : ratioX,
					ratioY : ratioY
				};
			}
			else
				return null;
		},

	},

	oppositeRedimStatus: function (redimStatus){
		if (redimStatus == null) redimStatus = 'LT';

		switch (redimStatus)
		{
			case 'LT': return 'RB';
			case 'CT': return 'CB';
			case 'RT': return 'LB';
			case 'LC': return 'RC';
			case 'CC': return 'CC';
			case 'RC': return 'LC';
			case 'LB': return 'RT';
			case 'CB': return 'CT';
			case 'RB': return 'LT';
		}
		return redimStatus;
	},

	contains: {
		line: function (x1, y1, x2, y2, x, y, validPointRadius){
			return this.lineCircle(x1, y1, x2, y2, x, y, validPointRadius);
		},

		lineCircle: function (x1, y1, x2, y2, x, y, radius){
			var lp = this.linePoint(x1, y1, x2, y2, x, y);
			var bX = x2 - x1, bY = y2 - y1;
			
			var d2 = Math.pow(x1 + lp.p.x - x, 2) + Math.pow(y1 + lp.p.y - y, 2);
			var plen2 = Math.pow(x1 + lp.p.x - x1, 2) + Math.pow(y1 + lp.p.y - y1, 2);
			var blen2 = bX * bX + bY * bY;
			var ptimd = lp.p.x * bX + lp.p.y * bY;

			var dist1 = Math.pow(x - x1, 2) + Math.pow(y - y1, 2);
			var dist2 = Math.pow(x - x2, 2) + Math.pow(y - y2, 2);
		   
			//console.log('[LINE] plen2=' + plen2 + ', blen2=' + blen2 + ', ptimd='+ptimd+', d2=' + d2 + ', dist1=' + dist1 + ', dist2=' + dist2);

			return d2 <= radius * radius && plen2 <= blen2 && ptimd >= 0 || dist1 <= radius || dist2 <= radius;
		},
		
		lineMDistance: function (x1, y1, x2, y2, x, y){
			var aX = x - x1, aY = y - y1;
			var bX = x2 - x1, bY = y2 - y1;
			var pX = (aX * bX + aY * bY) / (bX * bX + bY * bY) * bX;
			var pY = (aX * bX + aY * bY) / (bX * bX + bY * bY) * bY;
			var mX = aX - pX, mY = aY - pY;

			return AbGraphics.distance(x1, y1, mX + x1, mY + y1);
		},

		linePoint: function (x1, y1, x2, y2, x, y){
			var aX = x - x1, aY = y - y1;
			var bX = x2 - x1, bY = y2 - y1;
			var pX = (aX * bX + aY * bY) / (bX * bX + bY * bY) * bX;
			var pY = (aX * bX + aY * bY) / (bX * bX + bY * bY) * bY;
			var mX = aX - pX, mY = aY - pY;

			return {
				x: mX,
				y: mY,
				p : {
					x: pX,
					y: pY
				},
			};
		},
		
		line2: function (x1, y1, x2, y2, x, y){
			var a0 = AbGraphics.distance(x, y, x1, y1) + AbGraphics.distance(x, y, x2, y2);
			var a1 = AbGraphics.distance(x2, y2, x1, y1);
			return Math.abs(a1 - a0);
		},

		rect: function(x1, y1, x2, y2, x, y, dx, dy){
			if (arguments.length == 8)
				return ((((x1 <= x) && (dx2 <=x2)) && (y1 <= y)) && (dy2 <= y2));
			return ((((x1 <= x) && (x < x2)) && (y1 <= y)) && (y < y2));
		},

		box: function(x, y, width, height, dx, dy, dwidth, dheight){
			if (arguments.length == 8)
				return ((((x <= dx) && ((dx + dwidth) <= (x + width))) && (y <= dy)) && ((dy + dheight) <= (y + height)));
			return ((((x <= dx) && (dx < (x + width))) && (y <= dy)) && (dy < (y + height)));
		},

		polygon: function(points, x, y){
			var len = points.length;
			if (len == 0) return false;
			if (len == 1 && points[0].x == x && points[0].y == y) return true;
			if (len == 2)
				return this.line(points[0].x, points[0].y, points[1].x, points[1].y, x, y, 1);

			var cnt = 0, inter = 0;
			var p1 = points[0], p2 = null;
			for (var i=1; i <= len; i++){
				p2 = points[i % len];

				if (y > Math.min(p1.y, p2.y)){
					if (y <= Math.max(p1.y, p2.y)){
						if (x <= Math.max(p1.x, p2.x)){
							if (p1.y != p2.y){
								inter = (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;
								if (p1.x == p2.x || x <= inter)
									cnt++;
							}
						}
					}
				}
				p1 = p2;
			}
			return cnt % 2 != 0;
		},

		polygonScale: function(points, x, y, scaleX, scaleY){
			if (!scaleX) scaleX = 1;
			if (!scaleY) scaleY = 1;

			var len = points.length;
			if (len == 0) return false;
			if (len == 1 && points[0].x * scaleX == x && points[0].y * scaleY == y) return true;
			if (len == 2)
				return this.line(points[0].x * scaleX, points[0].y * scaleY, points[1].x * scaleX, points[1].y * scaleY, x, y, 1);

			var cnt = 0, inter = 0;
			var p2 = null, p2x = null, p2y = null;
			var p1x = points[0].x * scaleX, p1y = points[0].y * scaleY;
			for (var i=1; i <= len; i++){
				var p2 = points[i % len];
				p2x = p2.x * scaleX;
				p2y = p2.y * scaleY;

				if (y > Math.min(p1y, p2y)){
					if (y <= Math.max(p1y, p2y)){
						if (x <= Math.max(p1x, p2x)){
							if (p1y != p2y){
								inter = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x;
								if (p1x == p2x || x <= inter)
									cnt++;
							}
						}
					}
				}
				p1x = p2x;
				p1y = p2y;
			}
			return cnt % 2 != 0;
		},
	},

	angle: {
		RAD90: 1.5707963267948966,

		deg2rad: function (degree){ return Math.PI / 180 * degree; },
		rad2deg: function (radian){ return radian * 180 / Math.PI; },

		increase: function(degree, value){
			degree = (degree + value) % 360;
			if (degree < 0)
				degree = 360 + degree;
			return degree;
		},

		// 두 점 사이의 각도
		radian: function (cx, cy, px, py){ return Math.atan2((px - cx), (py - cy)); },

		// 두 점 사이의 각도
		radian90: function (cx, cy, px, py){ return this.RAD90 - Math.atan2((px - cx), (py - cy)); },

		// 두 점 사이의 각도
		get: function (cx, cy, px, py){
			var radian = Math.atan2((px - cx), (py - cy));
			var angle = 180 - (radian * 180 / Math.PI) % 360;
			if (angle < 0) angle = 360 + angle;
			return angle;
		},

		direction: function (degree){
			return {
				x: -Math.sin( Math.PI / 180 * degree),
				y: Math.cos( Math.PI / 180 * degree)
			};
		},

		point: function (degree, cx, cy, x, y){
			var radian = Math.PI / 180 * degree;
			return AbGraphics.rotate.point(radian, cx, cy, x, y);
		},

		rect: function (degree, cx, cy, x1, y1, x2, y2){
			var radian = Math.PI / 180 * degree;
			return AbGraphics.rotate.rect(radian, cx, cy, x1, y1, x2, y2);
		},

		halfBounds: function(degree, cx, cy, hw, hh){
			var radian = Math.PI / 180 * degree;
			return AbGraphics.rotate.halfBounds(radian, cx, cy, hw, hh);
		},

		bounds: function(degree, x, y, w, h){
			var radian = Math.PI / 180 * degree;
			return AbGraphics.rotate.bounds(radian, x, y, w, h);
		},

		corners: function(degree, cx, cy, x1, y1, x2, y2){
			var radian = Math.PI / 180 * degree;
			return AbGraphics.rotate.corners(radian, cx, cy, x1, y1, x2, y2);
		},

		// (0,0) 좌표로 회전한 좌표를 화면 기준 (0,0) 좌표가 기준이 되도록 보정치 계산
		correctDisplayCoordinate: function(degree, w, h, reverse){
			var radian = Math.PI / 180 * degree;
			return AbGraphics.rotate.correctDisplayCoordinate(radian, w, h, reverse);
		},
	
		//-----------------------------------------------------------
		
		toShapeAngle: function (degree){
			var angle = (degree - 90) % 360;
			if (angle < 0) angle = 360 + angle;
			return angle;
		},
		fromShapeAngle: function (degree){ return (degree + 90) % 360; },
	},

	rotate: {
		point: function (radian, cx, cy, x, y){
			var cv = Math.cos(radian), sv = Math.sin(radian);
			return {
				x: (x - cx) * cv - (y - cy) * sv + cx,
				y: (x - cx) * sv + (y - cy) * cv + cy
			};
		},

		rect: function (radian, cx, cy, x1, y1, x2, y2){
			var s = this.point(radian, cx, cy, x1, y1);
			var e = this.point(radian, cx, cy, x2, y2);
			return {
				x1: s.x,
				y1: s.y,
				x2: e.x,
				y2: e.y
			};
		},

		halfBounds: function(radian, cx, cy, hw, hh){
			var x1 = hw, y1 = -hh;
			var x2 = hw, y2 = hh;

			var cv = Math.cos(radian), sv = Math.sin(radian);
			var fx1 = x1 * cv - y1 * sv;
			var fy1 = x1 * sv + y1 * cv;
			var fx2 = x2 * cv - y2 * sv;
			var fy2 = x2 * sv + y2 * cv;

			var ex = Math.max(Math.abs(fx1), Math.abs(fx2));
			var ey = Math.max(Math.abs(fy1), Math.abs(fy2));

			return { x: ex, y: ey };
		},

		bounds: function(radian, x, y, w, h){
			var hw = w >> 1, hh = h >> 1;
			var cx = x + hw, cy = y + hh;
			var x1 = hw, y1 = -hh;
			var x2 = hw, y2 = hh;

			var cv = Math.cos(radian), sv = Math.sin(radian);
			var fx1 = x1 * cv - y1 * sv;
			var fy1 = x1 * sv + y1 * cv;
			var fx2 = x2 * cv - y2 * sv;
			var fy2 = x2 * sv + y2 * cv;

			var ex = Math.max(Math.abs(fx1), Math.abs(fx2));
			var ey = Math.max(Math.abs(fy1), Math.abs(fy2));

			x1 = hw - ex;
			y1 = hh - ey;
			x2 = hw + ex;
			y2 = hh + ey;

			return {
				x: x + x1,
				y: y + y1,
				width: x2 - x1,
				height: y2 - y1
			};
		},

		corners: function(radian, cx, cy, x1, y1, x2, y2){
			var a = [
				this.point(radian, cx, cy, x1, y1), // Left Top
				this.point(radian, cx, cy, x2, y1), // Right Top
				this.point(radian, cx, cy, x2, y2), // Right Bottom
				this.point(radian, cx, cy, x1, y2), // Left Bottom
			];

			var minX = null, minY = null, maxX = null, maxY = null;
			var left = null, top = null, right = null, bottom = null;
			for (var i=0; i < a.length; i++){
				var p = a[i];

				if (i == 0){
					minX = maxY = p.x;
					minY = maxY = p.y;
					left = top = right = bottom = p;
				}else{
					if (minX > p.x) minX = p.x;
					if (maxX < p.x) maxX = p.x;
					if (minY > p.y) minY = p.y;
					if (maxY < p.y) maxY = p.y;

					if (left.x > p.x) left = p;
					if (right.x < p.x) right = p;
					if (top.y > p.y) top = p;
					if (bottom.y < p.y) bottom = p;
				}
			}

			return {
				leftTop: a[0],
				rightTop: a[1],
				rightBottom: a[2],
				leftBottom: a[3],

				left: left,
				top: top,
				right: right,
				bottom: bottom,

				min: { x: minX, y: minY },
				max: { x: maxX, y: maxY }
			};
		},

		HALF_PI : Math.PI / 2,

		// (0,0) 좌표로 회전한 좌표를 화면 기준 (0,0) 좌표가 기준이 되도록 보정치 계산
		correctDisplayCoordinate: function(radian, w, h, reverse){
			if (!AbCommon.isBool(reverse)) reverse = true;

			var cs = AbGraphics.rotate.corners(radian, 0, 0, 0, 0, w, h);
			var xgap = 0, ygap = 0;

			if (radian >= 0 && radian < this.HALF_PI){ // 0 ~ 90도
				xgap = cs.leftBottom.x - cs.leftTop.x;
			}else if (radian >= this.HALF_PI && radian < Math.PI){ // 90 ~ 180도
				xgap = cs.rightBottom.x - cs.leftTop.x;
				ygap = cs.leftBottom.y - cs.leftTop.y;
			}else if (radian >= Math.PI && radian < Math.PI + this.HALF_PI){ // 180 ~ 270도
				xgap = cs.rightTop.x - cs.leftTop.x;
				ygap = cs.rightBottom.y - cs.leftTop.y;
			}else if (radian >= Math.PI + this.HALF_PI){ // 270도 이상
				ygap = cs.rightTop.y - cs.leftTop.y;
			}
			
			// if (pageAngle >= 0 && pageAngle < 90){
			// 	xgap = cs.leftBottom.x - cs.leftTop.x;
			// }else if (pageAngle >= 90 && pageAngle < 180){
			// 	xgap = cs.rightBottom.x - cs.leftTop.x;
			// 	ygap = cs.leftBottom.y - cs.leftTop.y;
			// }else if (pageAngle >= 180 && pageAngle < 270){
			// 	xgap = cs.rightTop.x - cs.leftTop.x;
			// 	ygap = cs.rightBottom.y - cs.leftTop.y;
			// }else if (pageAngle >= 270){
			// 	ygap = cs.rightTop.y - cs.leftTop.y;
			// }

			if (reverse)
				return AbGraphics.rotate.point(-radian, 0, 0, xgap, ygap);
			return {
				x: xgap,
				y: ygap
			};
		},

		pointByDistance: function (radian, distance){
			return {
				x: distance * Math.cos(radian),
				y: distance * Math.sin(radian)
			};
		},
	},

	canvas: {
		imageSmoothing: function(ctx, value){
			ctx.imageSmoothingEnabled = value;
			ctx.mozImageSmoothingEnabled = value;
			ctx.webkitImageSmoothingEnabled = value;
			ctx.msImageSmoothingEnabled = value;
	
			ctx.imageSmoothingQuality = 'high';

			return ctx;
		},

		createContext: function (w, h){
			var canvas = null;
			if (AbCommon.isNumber(w) && AbCommon.isNumber(h))
				canvas = $('<canvas width="'+w+'" height="'+h+'"/>');
			else
				canvas = $('<canvas/>');
			var ctx = canvas.get(0).getContext('2d');
			return ctx;
		},

		toImage: function (ctx, type){
			switch (type){
			case 'jpg': case 'jpeg': type = 'image/jpeg'; break;
			default: type = 'image/png'; break;
			}
			return ctx.canvas.toDataURL(type, 1);	
		},

		toBlob: function (ctx, type){
			if (!AbCommon.isSetted(type)) type = 'image/png';

			return new Promise(function (resolve, reject){
				var callback = function (blob){
					resolve(blob);
				};

				if (ctx.canvas.toBlob){
					try
					{
						ctx.canvas.toBlob(callback, type);
					}
					catch (e)
					{
						reject(e);
					}
				}else{
					reject(new Error('Not support toBlob'));
				}
			});
		},

		renderImage: function (imgElement, type){
			var ctx = this.createContext(imgElement.width, imgElement.height);
			ctx.drawImage(imgElement, 0, 0);
			return this.toImage(ctx, type);
		},

		DASH_SIZ: 8,
		DOT_SIZ: 4,
		SPACE_SIZ: 4,

		dashStyle: function (style, defaultStyle){
			if (!style) return defaultStyle;
	
			switch (style){
			case 'solid': case 'dash': case 'dot': case 'dash-dot': case 'dash-dot-dot': return style;
			}
			return defaultStyle;
		},
	
		makeDash: function(s){
			var r = [];
			if (!s) return r;
			
			var a = s.toLowerCase().split('-');
			var len = a.length;
			for (var i=0; i < len; i++){
				var siz = 0;
				switch (a[i]){
				case 'dash': siz = this.DASH_SIZ; break;
				case 'dot': siz = this.DOT_SIZ; break;
				}
				if (siz > 0){
					r.push(siz);
					r.push(this.SPACE_SIZ);
				}
			}
			return r;
		},

		measureText: function (ctx, lineHeight, cache, text){
			var e1 = cache['$measureElement1'];
			var e2 = cache['$measureElement2'];
			if (!e1){
				e1 = $('<div/>');
				e1.css({
					position: 'absolute',
					padding: '0',
					margin: '0',
					// top: 10,
					// left: 10,
					// zIndex: 100,
					// background: 'red',
					// color: 'white',
					top: -10000,
					left: -10000,
					zIndex: -1,
					visibility: 'hidden'
				});
				cache['$measureElement1'] = e1;
			}
			if (!e2){
				e2 = $('<div/>');
				e2.css({
					position: 'absolute',
					padding: '0',
					margin: '0',
					// top: 100,
					// left: 10,
					// zIndex: 100,
					// background: 'red',
					// color: 'white',
					top: -10000,
					left: -10000,
					zIndex: -1,
					visibility: 'hidden'
				});
				cache['$measureElement2'] = e2;
			}

			e1.css('font', ctx.font);
			if (lineHeight)
				e1.css('line-height', (lineHeight * 100) + '%');
			e1.text(text);

			e2.css('font', ctx.font);
			e2.text(text);

			var ebody = $(document.body);

			ebody.append(e1);
			ebody.append(e2);

			var element = e1.length ? e1.get(0) : null;
			var size1 = element ? { width: element.offsetWidth, height: element.offsetHeight } : { width: 0, height: 0 };

			element = e2.length ? e2.get(0) : null;
			var size2 = element ? { width: element.offsetWidth, height: element.offsetHeight } : { width: 0, height: 0 };

			//e1.detach();
			//e2.detach();

			return {
				width: size1.width,
				height: size1.height,
				contentWidth: size2.width,
				contentHeight: size2.height,
			};
		},
	},

	image: {
		bilinear: function(srcImg, destImg, scale){
			// compute vector index from matrix one
			function ivect(ix, iy, w) {
				// byte array, r,g,b,a
				return((ix + w * iy) * 4);
			}
		
			// c.f.: wikipedia english article on bilinear interpolation
			// taking the unit square, the inner loop looks like this
			// note: there's a function call inside the double loop to this one
			// maybe a performance killer, optimize this whole code as you need
			function inner(f00, f10, f01, f11, x, y) {
				var un_x = 1.0 - x; var un_y = 1.0 - y;
				return (f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y);
			}
		
			var i, j;
			var iyv, iy0, iy1, ixv, ix0, ix1;
			var idxD, idxS00, idxS10, idxS01, idxS11;
			var dx, dy;
			var r, g, b, a;
			for (i = 0; i < destImg.height; ++i) {
				iyv = i / scale;
				iy0 = Math.floor(iyv);
				// Math.ceil can go over bounds
				iy1 = ( Math.ceil(iyv) > (srcImg.height-1) ? (srcImg.height-1) : Math.ceil(iyv) );
				for (j = 0; j < destImg.width; ++j) {
					ixv = j / scale;
					ix0 = Math.floor(ixv);
					// Math.ceil can go over bounds
					ix1 = ( Math.ceil(ixv) > (srcImg.width-1) ? (srcImg.width-1) : Math.ceil(ixv) );
					idxD = ivect(j, i, destImg.width);
					// matrix to vector indices
					idxS00 = ivect(ix0, iy0, srcImg.width);
					idxS10 = ivect(ix1, iy0, srcImg.width);
					idxS01 = ivect(ix0, iy1, srcImg.width);
					idxS11 = ivect(ix1, iy1, srcImg.width);
					// overall coordinates to unit square
					dx = ixv - ix0; dy = iyv - iy0;
					// I let the r, g, b, a on purpose for debugging
					r = inner(srcImg.data[idxS00], srcImg.data[idxS10],
					srcImg.data[idxS01], srcImg.data[idxS11], dx, dy);
					destImg.data[idxD] = r;
		
					g = inner(srcImg.data[idxS00+1], srcImg.data[idxS10+1],
					srcImg.data[idxS01+1], srcImg.data[idxS11+1], dx, dy);
					destImg.data[idxD+1] = g;
		
					b = inner(srcImg.data[idxS00+2], srcImg.data[idxS10+2],
					srcImg.data[idxS01+2], srcImg.data[idxS11+2], dx, dy);
					destImg.data[idxD+2] = b;
		
					a = inner(srcImg.data[idxS00+3], srcImg.data[idxS10+3],
					srcImg.data[idxS01+3], srcImg.data[idxS11+3], dx, dy);
					destImg.data[idxD+3] = a;
				}
			}
		},

		bicubic: function(srcImg, destImg, scale){
			// compute vector index from matrix one
			function ivect(ix, iy, w) {
			// byte array, r,g,b,a
				return((ix + w * iy) * 4);
			}

			/* Yay, hoisting! */
			function TERP(t, a, b, c, d){
				return 0.5 * (c - a + (2.0*a - 5.0*b + 4.0*c - d + (3.0*(b - c) + d - a)*t)*t)*t + b;
			}
		
			function BicubicInterpolation(x, y, values){
				var i0, i1, i2, i3;
		
				i0 = TERP(x, values[0][0], values[1][0], values[2][0], values[3][0]);
				i1 = TERP(x, values[0][1], values[1][1], values[2][1], values[3][1]);
				i2 = TERP(x, values[0][2], values[1][2], values[2][2], values[3][2]);
				i3 = TERP(x, values[0][3], values[1][3], values[2][3], values[3][3]);
				return TERP(y, i0, i1, i2, i3);
			};
		
			var i, j;
			var dx, dy;
			var repeatX, repeatY;
			var offset_row0, offset_row1, offset_row2, offset_row3;
			var offset_col0, offset_col1, offset_col2, offset_col3;
			var red_pixels, green_pixels, blue_pixels, alpha_pixels;
		
			for (i = 0; i < destImg.height; ++i) {
				iyv = i / scale;
				iy0 = Math.floor(iyv);
		
				// We have to special-case the pixels along the border and repeat their values if neccessary
				repeatY = 0;
				if(iy0 < 1) repeatY = -1;
				else if(iy0 > srcImg.height - 3) repeatY = iy0 - (srcImg.height - 3);
		
				for (j = 0; j < destImg.width; ++j) {
					ixv = j / scale;
					ix0 = Math.floor(ixv);
		
					// We have to special-case the pixels along the border and repeat their values if neccessary
					repeatX = 0;
					if(ix0 < 1) repeatX = -1;
					else if(ix0 > srcImg.width - 3) repeatX = ix0 - (srcImg.width - 3);
		
					offset_row1 = ((iy0)   * srcImg.width + ix0) * 4;
					offset_row0 = repeatY < 0 ? offset_row1 : ((iy0-1) * srcImg.width + ix0) * 4;
					offset_row2 = repeatY > 1 ? offset_row1 : ((iy0+1) * srcImg.width + ix0) * 4;
					offset_row3 = repeatY > 0 ? offset_row2 : ((iy0+2) * srcImg.width + ix0) * 4;
		
					offset_col1 = 0;
					offset_col0 = repeatX < 0 ? offset_col1 : -4;
					offset_col2 = repeatX > 1 ? offset_col1 : 4;
					offset_col3 = repeatX > 0 ? offset_col2 : 8;
		
					//Each offset is for the start of a row's red pixels
					red_pixels = [[srcImg.data[offset_row0+offset_col0], srcImg.data[offset_row1+offset_col0], srcImg.data[offset_row2+offset_col0], srcImg.data[offset_row3+offset_col0]],
								  [srcImg.data[offset_row0+offset_col1], srcImg.data[offset_row1+offset_col1], srcImg.data[offset_row2+offset_col1], srcImg.data[offset_row3+offset_col1]],
								  [srcImg.data[offset_row0+offset_col2], srcImg.data[offset_row1+offset_col2], srcImg.data[offset_row2+offset_col2], srcImg.data[offset_row3+offset_col2]],
								  [srcImg.data[offset_row0+offset_col3], srcImg.data[offset_row1+offset_col3], srcImg.data[offset_row2+offset_col3], srcImg.data[offset_row3+offset_col3]]];
					offset_row0++;
					offset_row1++;
					offset_row2++;
					offset_row3++;
					//Each offset is for the start of a row's green pixels
					green_pixels = [[srcImg.data[offset_row0+offset_col0], srcImg.data[offset_row1+offset_col0], srcImg.data[offset_row2+offset_col0], srcImg.data[offset_row3+offset_col0]],
								  [srcImg.data[offset_row0+offset_col1], srcImg.data[offset_row1+offset_col1], srcImg.data[offset_row2+offset_col1], srcImg.data[offset_row3+offset_col1]],
								  [srcImg.data[offset_row0+offset_col2], srcImg.data[offset_row1+offset_col2], srcImg.data[offset_row2+offset_col2], srcImg.data[offset_row3+offset_col2]],
								  [srcImg.data[offset_row0+offset_col3], srcImg.data[offset_row1+offset_col3], srcImg.data[offset_row2+offset_col3], srcImg.data[offset_row3+offset_col3]]];
					offset_row0++;
					offset_row1++;
					offset_row2++;
					offset_row3++;
					//Each offset is for the start of a row's blue pixels
					blue_pixels = [[srcImg.data[offset_row0+offset_col0], srcImg.data[offset_row1+offset_col0], srcImg.data[offset_row2+offset_col0], srcImg.data[offset_row3+offset_col0]],
								  [srcImg.data[offset_row0+offset_col1], srcImg.data[offset_row1+offset_col1], srcImg.data[offset_row2+offset_col1], srcImg.data[offset_row3+offset_col1]],
								  [srcImg.data[offset_row0+offset_col2], srcImg.data[offset_row1+offset_col2], srcImg.data[offset_row2+offset_col2], srcImg.data[offset_row3+offset_col2]],
								  [srcImg.data[offset_row0+offset_col3], srcImg.data[offset_row1+offset_col3], srcImg.data[offset_row2+offset_col3], srcImg.data[offset_row3+offset_col3]]];
					offset_row0++;
					offset_row1++;
					offset_row2++;
					offset_row3++;
					//Each offset is for the start of a row's alpha pixels
					alpha_pixels =[[srcImg.data[offset_row0+offset_col0], srcImg.data[offset_row1+offset_col0], srcImg.data[offset_row2+offset_col0], srcImg.data[offset_row3+offset_col0]],
								  [srcImg.data[offset_row0+offset_col1], srcImg.data[offset_row1+offset_col1], srcImg.data[offset_row2+offset_col1], srcImg.data[offset_row3+offset_col1]],
								  [srcImg.data[offset_row0+offset_col2], srcImg.data[offset_row1+offset_col2], srcImg.data[offset_row2+offset_col2], srcImg.data[offset_row3+offset_col2]],
								  [srcImg.data[offset_row0+offset_col3], srcImg.data[offset_row1+offset_col3], srcImg.data[offset_row2+offset_col3], srcImg.data[offset_row3+offset_col3]]];
		
					// overall coordinates to unit square
					dx = ixv - ix0; dy = iyv - iy0;
		
					idxD = ivect(j, i, destImg.width);
		
					destImg.data[idxD] = BicubicInterpolation(dx, dy, red_pixels);
		
					destImg.data[idxD+1] =  BicubicInterpolation(dx, dy, green_pixels);
		
					destImg.data[idxD+2] = BicubicInterpolation(dx, dy, blue_pixels);
		
					destImg.data[idxD+3] = BicubicInterpolation(dx, dy, alpha_pixels);
				}
			}
		},

		/**
		* Hermite resize - fast image resize/resample using Hermite filter. 1 cpu version!
		* 
		* @param {HtmlElement} canvas
		* @param {int} width
		* @param {int} height
		* @param {boolean} resize_canvas if true, canvas will be resized. Optional.
		*/
		hermite: function(canvas, width, height, resize_canvas) {
			var width_source = canvas.width;
			var height_source = canvas.height;
			width = Math.round(width);
			height = Math.round(height);
			
			var ratio_w = width_source / width;
			var ratio_h = height_source / height;
			var ratio_w_half = Math.ceil(ratio_w / 2);
			var ratio_h_half = Math.ceil(ratio_h / 2);
			
			var ctx = canvas.getContext('2d');
			var img = ctx.getImageData(0, 0, width_source, height_source);
			var img2 = ctx.createImageData(width, height);
			var data = img.data;
			var data2 = img2.data;
			
			for (var j = 0; j < height; j++) {
				for (var i = 0; i < width; i++) {
					var x2 = (i + j * width) * 4;
					var weight = 0;
					var weights = 0;
					var weights_alpha = 0;
					var gx_r = 0;
					var gx_g = 0;
					var gx_b = 0;
					var gx_a = 0;
					var center_y = (j + 0.5) * ratio_h;
					var yy_start = Math.floor(j * ratio_h);
					var yy_stop = Math.ceil((j + 1) * ratio_h);

					for (var yy = yy_start; yy < yy_stop; yy++) {
						var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
						var center_x = (i + 0.5) * ratio_w;
						var w0 = dy * dy; //pre-calc part of w
						var xx_start = Math.floor(i * ratio_w);
						var xx_stop = Math.ceil((i + 1) * ratio_w);

						for (var xx = xx_start; xx < xx_stop; xx++) {
							var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
							var w = Math.sqrt(w0 + dx * dx);
							if (w >= 1) {
								//pixel too far
								continue;
							}
							//hermite filter
							weight = 2 * w * w * w - 3 * w * w + 1;
							var pos_x = 4 * (xx + yy * width_source);
							//alpha
							gx_a += weight * data[pos_x + 3];
							weights_alpha += weight;
							//colors
							if (data[pos_x + 3] < 255)
							weight = weight * data[pos_x + 3] / 250;
							gx_r += weight * data[pos_x];
							gx_g += weight * data[pos_x + 1];
							gx_b += weight * data[pos_x + 2];
							weights += weight;
						}
					}
					data2[x2] = gx_r / weights;
					data2[x2 + 1] = gx_g / weights;
					data2[x2 + 2] = gx_b / weights;
					data2[x2 + 3] = gx_a / weights_alpha;
				}
			}

			//clear and resize canvas
			if (resize_canvas === true) {
				canvas.width = width;
				canvas.height = height;
			} else {
				ctx.clearRect(0, 0, width_source, height_source);
			}
			
			//draw
			ctx.putImageData(img2, 0, 0);
		},
	},
};