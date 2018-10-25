/**
 * 비율 계산 결과 정보
 * @typedef {Object} RatioResult
 * @property {Number} ratio 비율
 * @property {Number} ratioX 횡축 비율
 * @property {Number} ratioY 종축 비율
 */

 /**
 * 제한 비율 계산 결과 정보
 * @typedef {Object} LimitRatioResult
 * @property {Number} ratio 비율
 * @property {Number} ratioX 횡축 비율
 * @property {Number} ratioY 종축 비율
 * @property {Number} width 제한 폭에 맞는 폭
 * @property {Number} height 제한 폭에 맞는 높이
 */

/**
 * 그래픽 관련 도구
 * @namespace
 */
var AbGraphics = {

	/**
	 * 기본 DPI를 가져옵니다.
	 * @memberof AbGraphics
	 */
	dpi: function () { return 72; },

	/**
	 * 도형의 각도와 편집점에 맞는 커서를 가져옵니다.
	 * @memberof AbGraphics
	 * @param {String} dir 편집점
	 * @param {Number} angle 도형의 각도
	 * @return {String} 커서명
	 */
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

	/**
	 * 두 점 사이의 거리를 계산합니다.
	 * @memberof AbGraphics
	 * @param {Number} x1 첫번째 점의 X좌표
	 * @param {Number} y1 첫번째 점의 Y좌표
	 * @param {Number} x2 두번째 점의 X좌표
	 * @param {Number} y2 두번째 점의 Y좌표
	 * @return {Number} 거리
	 */
	distance: function (x1, y1, x2, y2){
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	},

	/**
	 * 두 점의 최소 X/Y 좌표를 구합니다.
	 * @memberof AbGraphics
	 * @param {Number} x1 첫번째 점의 X좌표
	 * @param {Number} y1 첫번째 점의 Y좌표
	 * @param {Number} x2 두번째 점의 X좌표
	 * @param {Number} y2 두번째 점의 Y좌표
	 * @return {2Point} x1/y1=최소값, x2/y2=최대값
	 */
	rect: function (x1, y1, x2, y2){
		var tx1 = Math.min(x1, x2);
		var ty1 = Math.min(y1, y2);
		var tx2 = Math.max(x1, x2);
		var ty2 = Math.max(y1, y2);

		return { x1: tx1, y1: ty1, x2: tx2, y2: ty2 };
	},

	/**
	 * 크기 관련 도구
	 * @memberof AbGraphics
	 * @namespace
	 */
	size: {

		/**
		 * 두 크기 정보에서 큰 값을 가져옵니다.
		 * <table>
		 * <thead>
		 * <tr>
		 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th>
		 * </tr>
		 * </thead>
		 * <tbody>
		 * <tr>
		 * 	<td>2개</td><td>size: {@link Size}</td><td>size: {@link Size}</td><td></td><td></td>
		 * </tr>
		 * <tr>
		 * 	<td>3개</td><td>width: Number</td><td>height: Number</td><td>size: {@link Size}</td><td></td>
		 * </tr>
		 * <tr>
		 * 	<td>4개</td><td>width: Number</td><td>height: Number</td><td>width: Number</td><td>height: Number</td>
		 * </tr>
		 * </tbody>
		 * </table>
		 * @memberof AbGraphics.size
		 * @param {(HTMLBounds|Size|Box|Number)} 0 인자가 2개일 때 width 필드가 있는 객체, 3, 4개 일때는 숫자(폭을 의미)
		 * @param {(HTMLBounds|Size|Box|Number)} 1 인자가 2개일 때 height 필드가 있는 객체, 3, 4개 일때는 숫자(높이를 의미)
		 * @param {(HTMLBounds|Size|Box|Number)} [2] 인자가 3개일 때 width, height 필드가 있는 객체, 4개 일때는 숫자(폭을 의미)
		 * @param {Number} [3] 인자가 4개 일때 숫자(높이를 의미)
		 * @return {Size} 큰 폭과 큰 높이 정보
		 */
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
	
		/**
		 * 두 크기 정보에서 작은 값을 가져옵니다.
		 * <table>
		 * <thead>
		 * <tr>
		 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th>
		 * </tr>
		 * </thead>
		 * <tbody>
		 * <tr>
		 * 	<td>2개</td><td>size: {@link Size}</td><td>size: {@link Size}</td><td></td><td></td>
		 * </tr>
		 * <tr>
		 * 	<td>3개</td><td>width: Number</td><td>height: Number</td><td>size: {@link Size}</td><td></td>
		 * </tr>
		 * <tr>
		 * 	<td>4개</td><td>width: Number</td><td>height: Number</td><td>width: Number</td><td>height: Number</td>
		 * </tr>
		 * </tbody>
		 * </table>
		 * @memberof AbGraphics.size
		 * @param {(HTMLBounds|Size|Box|Number)} 0 인자가 2개일 때 width 필드가 있는 객체, 3, 4개 일때는 숫자(폭을 의미)
		 * @param {(HTMLBounds|Size|Box|Number)} 1 인자가 2개일 때 height 필드가 있는 객체, 3, 4개 일때는 숫자(높이를 의미)
		 * @param {(HTMLBounds|Size|Box|Number)} [2] 인자가 3개일 때 width, height 필드가 있는 객체, 4개 일때는 숫자(폭을 의미)
		 * @param {Number} [3] 인자가 4개 일때 숫자(높이를 의미)
		 * @return {Size} 작은 폭과 작은 높이 정보
		 */
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

	/**
	 * 곡선 관련 도구
	 * @memberof AbGraphics
	 * @namespace
	 */
	curve: {
		/**
		 * KAPPA 계수
		 * @memberof AbGraphics.curve
		 * @const
		 * @type {Number}
		 * @default
		 */
		KAPPA: .5522848,

		// sx, sy: start point
		// cp1x, cp1y: first control point
		// cp2x, cp2y: second control point
		// ex, ey: end point

		/**
		 * 곡선의 경로를 작성하여 포인트 배열에 적재합니다.
		 * @memberof AbGraphics.curve
		 * @param {Array.<Point>} points 포인트 배열
		 * @param {Number} sx start point
		 * @param {Number} sy start point
		 * @param {Number} cp1x first control point
		 * @param {Number} cp1y first control point
		 * @param {Number} cp2x second control point
		 * @param {Number} cp2y second control point
		 * @param {Number} ex end point
		 * @param {Number} ey end point
		 */
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

	/**
	 * 상자 관련 도구
	 * @memberof AbGraphics
	 * @namespace
	 */
	box: {
		/**
		 * 2개의 좌표로 Box 객체를 생성합니다.
		 * @memberof AbGraphics.box
		 * @param {Number} x1 좌표1의 X좌표
		 * @param {Number} y1 좌표1의 Y좌표
		 * @param {Number} x2 좌표2의 X좌표
		 * @param {Number} y2 좌표2의 Y좌표
		 * @return {Box} Box 객체
		 */
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
		
		/**
		 * 상자를 확장합니다.
		 * <p>인자 수와 인자 타입에 따라 다음과 같이 활용됩니다.
		 * <table>
		 * <thead>
		 * <tr>
		 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>인자4</th><th>인자5</th><th>인자6</th><th>인자7</th><th>적용면</td>
		 * </tr>
		 * </thead>
		 * <tbody>
		 * <tr>
		 * 	<td>5개 (1)</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>length: Number</td><td></td><td></td><td></td><td>상,하,좌,우</td>
		 * </tr>
		 * <tr>
		 * 	<td>5개 (2)</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>size: {@link Size}</td><td></td><td></td><td></td><td>size.width=좌/우, size.height=상/하</td>
		 * </tr>
		 * <tr>
		 * 	<td>5개 (3)</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>rect: {@link Rect}</td><td></td><td></td><td></td><td>rect.top=상, rect.right=우, rect.bottom=하, rect.left=좌</td>
		 * </tr>
		 * <tr>
		 * 	<td>6개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>horiz: Number</td><td>vert: Number</td><td></td><td></td><td>horiz=좌/우, vert=상/하</td>
		 * </tr>
		 * <tr>
		 * 	<td>8개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>top: Number</td><td>right: Number</td><td>bottom: Number</td><td>left: Number</td><td>top=상, right=우, bottom=하, left=좌</td>
		 * </tr>
		 * </tbody>
		 * </table>
		 * @memberof AbGraphics.box
		 * @param {Number} 0 X좌표
		 * @param {Number} 1 Y좌표
		 * @param {Number} 2 폭
		 * @param {Number} 3 높이
		 * @param {(Number|Rect|Size)} [4] 확장량, 인자 수에 따라 전체/왼쪽 오른쪽 면/윗면에 적용됩니다.
		 * @param {Number} [5] 확장량, 인자 수에 따라 위아래 면/오른쪽 면에 적용됩니다.
		 * @param {Number} [6] 확장량, 아래 면에 적용됩니다.
		 * @param {Number} [7] 확장량, 왼쪽 면에 적용됩니다.
		 * @return {Box} 확장된 상자 정보
		 */
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
		
		/**
		 * 상자를 확장합니다.
		 * @memberof AbGraphics.box
		 * @param {Number} x X좌표
		 * @param {Number} y Y좌표
		 * @param {Number} w 폭
		 * @param {Number} h 높이
		 * @param {Number} siz 확장량, 인자가 5개면 상하좌우면에 적용되고, ysiz가 설정되면 좌우면에만 적용됩니다.
		 * @param {Number} [ysiz] 상하면 확장량
		 * @return {Box} 확장된 상자 정보
		 */
		expand: function (x, y, w, h, siz, ysiz){
			if (arguments.length <= 5) ysiz = siz;
			return {
				x: x - siz,
				y: y - ysiz,
				width: w + (siz << 1),
				height: h + (ysiz << 1)
			};
		},

		/**
		 * 제한 크기에 맞는 비율을 계산합니다.
		 * @memberof AbGraphics.box
		 * @param {Number} srcWidth 폭
		 * @param {Number} srcHeight 높이
		 * @param {Number} limitWidth 제한 폭
		 * @param {Number} limitHeight 제한 높이
		 * @return {RatioResult} 비율 계산 결과 정보
		 */
		zoom: function (srcWidth, srcHeight, limitWidth, limitHeight){
			var ratioX = limitWidth / srcWidth;
			var ratioY = limitHeight / srcHeight;

			return {
				ratio: ratioX > ratioY ? ratioY : ratioX,
				ratioX: ratioX,
				ratioY: ratioY
			};
		},

		/**
		 * 제한 크기에 맞는 비율을 계산합니다.
		 * <p>* 주어진 크기가 제한 크기보다 큰 경우에만 비율을 계산하며, 제한 크기보다 작은 경우는 null을 리턴합니다.
		 * @memberof AbGraphics.box
		 * @param {Number} srcWidth 폭
		 * @param {Number} srcHeight 높이
		 * @param {Number} limitWidth 제한 폭
		 * @param {Number} limitHeight 제한 높이
		 * @return {(null|LimitRatioResult)} 제한 비율 계산 결과 정보
		 */
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

	/**
	 * 편집점의 반대 위치를 가져옵니다.
	 * @memberof AbGraphics
	 * @param {String} redimStatus=LT 편집점
	 * @return {String} 반대 위치
	 */
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

	/**
	 * 교차점 관련 도구
	 * @memberof AbGraphics
	 * @namespace
	 */
	intersects: {
		/**
		 * 두 선이 교차하는 점을 계산합니다.
		 * @memberof AbGraphics.intersects
		 * @param {Number} line1StartX 선1의 시작점중 X좌표 
		 * @param {Number} line1StartY 선1의 시작점중 Y좌표 
		 * @param {Number} line1EndX 선1의 끝점중 X좌표 
		 * @param {Number} line1EndY 선1의 끝점중 Y좌표 
		 * @param {Number} line2StartX 선2의 시작점중 X좌표 
		 * @param {Number} line2StartY 선2의 시작점중 Y좌표 
		 * @param {Number} line2EndX 선2의 끝점중 X좌표 
		 * @param {Number} line2EndY 선2의 끝점중 Y좌표 
		 * @return {Point} 교차점 좌표
		 */
		lines: function(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY){
			// if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
			var denominator, a, b, numerator1, numerator2, result = {
				x: null,
				y: null,
				onLine1: false,
				onLine2: false
			};
			denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
			if (denominator == 0) {
				return result;
			}
			a = line1StartY - line2StartY;
			b = line1StartX - line2StartX;
			numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
			numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
			a = numerator1 / denominator;
			b = numerator2 / denominator;

			// if we cast these lines infinitely in both directions, they intersect here:
			result.x = line1StartX + (a * (line1EndX - line1StartX));
			result.y = line1StartY + (a * (line1EndY - line1StartY));
			/*
			// it is worth noting that this should be the same as:
			x = line2StartX + (b * (line2EndX - line2StartX));
			y = line2StartX + (b * (line2EndY - line2StartY));
			*/
			// if line1 is a segment and line2 is infinite, they intersect if:
			if (a > 0 && a < 1) {
				result.onLine1 = true;
			}
			// if line2 is a segment and line1 is infinite, they intersect if:
			if (b > 0 && b < 1) {
				result.onLine2 = true;
			}
			// if line1 and line2 are segments, they intersect if both of the above are true
			return result;
		},
	},

	/**
	 * 충돌 검사 관련 도구
	 * @memberof AbGraphics
	 * @namespace
	 */
	contains: {
		/**
		 * 선과 점이 충돌하는 지 검사합니다.
		 * @memberof AbGraphics.contains
		 * @param {Number} x1 선 시작점 중 X좌표
		 * @param {Number} y1 선 시작점 중 X좌표
		 * @param {Number} x2 선 끝점 중 X좌표
		 * @param {Number} y2 선 끝점 중 X좌표
		 * @param {Number} x 점 X좌표
		 * @param {Number} y 점 Y좌표
		 * @param {Number} validPointRadius 허용 반경, 반경 내에 점이 위치하면 충돌한 것으로 인정합니다.
		 * @return {Boolean} 충돌하면 true
		 */
		line: function (x1, y1, x2, y2, x, y, validPointRadius){
			return this.lineCircle(x1, y1, x2, y2, x, y, validPointRadius);
		},
		
		/**
		 * 선과 점이 충돌하는 지 검사합니다.
		 * <p>* 사용안함
		 * @private
		 * @memberof AbGraphics.contains
		 * @param {Number} x1 선 시작점 중 X좌표
		 * @param {Number} y1 선 시작점 중 X좌표
		 * @param {Number} x2 선 끝점 중 X좌표
		 * @param {Number} y2 선 끝점 중 X좌표
		 * @param {Number} x 점 X좌표
		 * @param {Number} y 점 Y좌표
		 */
		line2: function (x1, y1, x2, y2, x, y){
			var a0 = AbGraphics.distance(x, y, x1, y1) + AbGraphics.distance(x, y, x2, y2);
			var a1 = AbGraphics.distance(x2, y2, x1, y1);
			return Math.abs(a1 - a0);
		},

		/**
		 * 선과 원이 충돌하는 지 검사합니다.
		 * @memberof AbGraphics.contains
		 * @param {Number} x1 선 시작점 중 X좌표
		 * @param {Number} y1 선 시작점 중 X좌표
		 * @param {Number} x2 선 끝점 중 X좌표
		 * @param {Number} y2 선 끝점 중 X좌표
		 * @param {Number} x 원의 중심 X좌표
		 * @param {Number} y 원의 중심 Y좌표
		 * @param {Number} radius 원의 반지름
		 * @return {Boolean} 충돌하면 true
		 */
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
	
		/**
		 * @private
		 * @memberof AbGraphics.contains
		 * @param {Number} x1 선 시작점 중 X좌표
		 * @param {Number} y1 선 시작점 중 X좌표
		 * @param {Number} x2 선 끝점 중 X좌표
		 * @param {Number} y2 선 끝점 중 X좌표
		 * @param {Number} x 점 X좌표
		 * @param {Number} y 점 Y좌표
		 * @return {AbGraphics.contains.Point} 선과 점사이의 좌표 계산 결과
		 */
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
	
		/**
		 * 선과 점 사이의 거리를 계산합니다.
		 * <p>* 사용안함
		 * @private
		 * @memberof AbGraphics.contains
		 * @param {Number} x1 
		 * @param {Number} y1 
		 * @param {Number} x2 
		 * @param {Number} y2 
		 * @param {Number} x 
		 * @param {Number} y 
		 */
		lineMDistance: function (x1, y1, x2, y2, x, y){
			var aX = x - x1, aY = y - y1;
			var bX = x2 - x1, bY = y2 - y1;
			var pX = (aX * bX + aY * bY) / (bX * bX + bY * bY) * bX;
			var pY = (aX * bX + aY * bY) / (bX * bX + bY * bY) * bY;
			var mX = aX - pX, mY = aY - pY;

			return AbGraphics.distance(x1, y1, mX + x1, mY + y1);
		},

		/**
		 * 상자와 대상 점/상자의 충돌을 검사합니다.
		 * <table>
		 * <thead>
		 * <tr>
		 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>인자4</th><th>인자5</th><th>인자6</th><th>인자7</th>
		 * </tr>
		 * </thead>
		 * <tbody>
		 * <tr>
		 * 	<td>6개</td><td>x1: Number</td><td>y1: Number</td><td>x2: Number</td><td>y2: Number</td><td>x: Number</td><td>y: Number</td><td></td><td></td>
		 * </tr>
		 * <tr>
		 * 	<td>8개</td><td>x1: Number</td><td>y1: Number</td><td>x2: Number</td><td>y2: Number</td><td>dx1: Number</td><td>dy1: Number</td><td>dx2: Number</td><td>dy2: Number</td>
		 * </tr>
		 * </tbody>
		 * </table>
		 * @memberof AbGraphics.contains
		 * @param {Number} x1 상자의 좌상단 X좌표
		 * @param {Number} y1 상자의 좌상단 Y좌표
		 * @param {Number} x2 상자의 우하단 X좌표
		 * @param {Number} y2 상자의 우하단 Y좌표
		 * @param {Number} x 대상 점의 X좌표 또는 대상 상자의 좌상단 X좌표
		 * @param {Number} y 대상 점의 Y좌표 또는 대상 상자의 좌상단 Y좌표
		 * @param {Number} [dx] 대상 상자의 우하단 X좌표
		 * @param {Number} [dy] 대상 상자의 우하단 Y좌표
		 * @return {Boolean} 충돌하면 true
		 */
		rect: function(x1, y1, x2, y2, x, y, dx, dy){
			if (arguments.length == 8)
				return ((((x1 <= x) && (dx2 <=x2)) && (y1 <= y)) && (dy2 <= y2));
			return ((((x1 <= x) && (x < x2)) && (y1 <= y)) && (y < y2));
		},

		/**
		 * 상자와 대상 점/상자의 충돌을 검사합니다.
		 * <table>
		 * <thead>
		 * <tr>
		 * 	<th>인자 수</th><th>인자0</th><th>인자1</th><th>인자2</th><th>인자3</th><th>인자4</th><th>인자5</th><th>인자6</th><th>인자7</th>
		 * </tr>
		 * </thead>
		 * <tbody>
		 * <tr>
		 * 	<td>6개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>dx: Number</td><td>dy: Number</td><td></td><td></td>
		 * </tr>
		 * <tr>
		 * 	<td>8개</td><td>x: Number</td><td>y: Number</td><td>width: Number</td><td>height: Number</td><td>dx: Number</td><td>dy: Number</td><td>dwidth: Number</td><td>dheight: Number</td>
		 * </tr>
		 * </tbody>
		 * </table>
		 * @memberof AbGraphics.contains
		 * @param {Number} x 상자의 X좌표
		 * @param {Number} y 상자의 Y좌표
		 * @param {Number} width 상자의 폭
		 * @param {Number} height 상자의 높이
		 * @param {Number} dx 대상 점의 X좌표 또는 대상 상자의 X좌표
		 * @param {Number} dy 대상 점의 X좌표 또는 대상 상자의 X좌표
		 * @param {Number} [dwidth] 대상 상자의 폭
		 * @param {Number} [dheight] 대상 상자의 높이
		 * @return {Boolean} 충돌하면 true
		 */
		box: function(x, y, width, height, dx, dy, dwidth, dheight){
			if (arguments.length == 8)
				return ((((x <= dx) && ((dx + dwidth) <= (x + width))) && (y <= dy)) && ((dy + dheight) <= (y + height)));
			return ((((x <= dx) && (dx < (x + width))) && (y <= dy)) && (dy < (y + height)));
		},

		/**
		 * 다각형과 점이 충돌하는 지 검사합니다.
		 * @memberof AbGraphics.contains
		 * @param {Array.<Point>} points 다각형 포인트 배열
		 * @param {Number} x 점의 x좌표
		 * @param {Number} y 점의 y좌표
		 * @return {Boolean} 충돌하면 true
		 */
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

		/**
		 * 확대/축소된 다각형과 점이 충돌하는 지 검사합니다.
		 * @memberof AbGraphics.contains
		 * @param {Array.<Point>} points 다각형 포인트 배열
		 * @param {Number} x 점의 x좌표
		 * @param {Number} y 점의 y좌표
		 * @param {Number} scaleX X축 비율
		 * @param {Number} scaleY Y축 비율
		 * @return {Boolean} 충돌하면 true
		 */
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

	/**
	 * 각도 관련 도구
	 * @memberof AbGraphics
	 * @namespace
	 */
	angle: {
		/**
		 * 90도 라디안
		 * @memberof AbGraphics.angle
		 * @const
		 * @type {Number}
		 * @default
		 */
		RAD90: 1.5707963267948966,

		/**
		 * degree 각도를 라디안 각도로 환산합니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} degree degree 값
		 * @return {Number} 라디안 값
		 */
		deg2rad: function (degree){ return Math.PI / 180 * degree; },
		/**
		 * 라디안 각도를 degree 각도로 환산합니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} radian 라디안 값
		 * @return {Number} degree 값
		 */
		rad2deg: function (radian){ return radian * 180 / Math.PI; },

		/**
		 * 각도를 증감합니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} degree degree 값
		 * @param {Number} value 증감량(degree 값)
		 * @return {Number} degree 값
		 */
		increase: function(degree, value){
			degree = (degree + value) % 360;
			if (degree < 0)
				degree = 360 + degree;
			return degree;
		},

		// 두 점 사이의 각도
		/**
		 * 두 점 사이의 각도를 라디안 단위로 계산합니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} cx 기준점의 x좌표
		 * @param {Number} cy 기준점의 y좌표
		 * @param {Number} px 점의 x좌표
		 * @param {Number} py 점의 y좌표
		 * @return {Number} 라디안 값
		 */
		radian: function (cx, cy, px, py){ return Math.atan2((px - cx), (py - cy)); },

		// 두 점 사이의 각도
		/**
		 * 두 점 사이의 각도의 90도를 라디안 단위로 계산합니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} cx 기준점의 x좌표
		 * @param {Number} cy 기준점의 y좌표
		 * @param {Number} px 점의 x좌표
		 * @param {Number} py 점의 y좌표
		 * @return {Number} 라디안 값
		 */
		radian90: function (cx, cy, px, py){ return this.RAD90 - Math.atan2((px - cx), (py - cy)); },

		// 두 점 사이의 각도
		/**
		 * 두 점 사이의 각도를 degree 단위로 계산합니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} cx 기준점의 x좌표
		 * @param {Number} cy 기준점의 y좌표
		 * @param {Number} px 점의 x좌표
		 * @param {Number} py 점의 y좌표
		 * @return {Number} degree 값
		 */
		get: function (cx, cy, px, py){
			var radian = Math.atan2((px - cx), (py - cy));
			var angle = 180 - (radian * 180 / Math.PI) % 360;
			if (angle < 0) angle = 360 + angle;
			return angle;
		},

		/**
		 * (0,0) 좌표를 기준으로 degree 각도의 점 좌표를 계산합니다.
		 * <p>* 회전 방향을 가늠하는 용도로 쓰입니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} degree degree 값
		 * @return {Point} 점 좌표
		 */
		direction: function (degree){
			return {
				x: -Math.sin( Math.PI / 180 * degree),
				y: Math.cos( Math.PI / 180 * degree)
			};
		},

		/**
		 * (cx,cy) 좌표를 기준으로 (x,y) 좌표를 각도만큼 회전합니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} degree 각도
		 * @param {Number} cx 기준 x좌표
		 * @param {Number} cy 기준 y좌표
		 * @param {Number} x x좌표
		 * @param {Number} y y좌표
		 * @return {Point} 회전된 좌표
		 */
		point: function (degree, cx, cy, x, y){
			var radian = Math.PI / 180 * degree;
			return AbGraphics.rotate.point(radian, cx, cy, x, y);
		},

		/**
		 * (cx,cy) 좌표를 기준으로 상자를 각도만큼 회전합니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} degree 각도
		 * @param {Number} cx 기준 x좌표
		 * @param {Number} cy 기준 y좌표
		 * @param {Number} x1 상자의 좌상단 x좌표
		 * @param {Number} y1 상자의 우하단 y좌표
		 * @param {Number} x2 상자의 좌상단 x좌표
		 * @param {Number} y2 상자의 우하단 y좌표
		 * @return {Rect} 회전된 상자 정보
		 */
		rect: function (degree, cx, cy, x1, y1, x2, y2){
			var radian = Math.PI / 180 * degree;
			return AbGraphics.rotate.rect(radian, cx, cy, x1, y1, x2, y2);
		},

		/**
		 * 회전된 절반 크기의 bounds를 계산합니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} degree 각도
		 * @param {Number} cx 기준 x좌표
		 * @param {Number} cy 기준 y좌표
		 * @param {Number} hw 절반 크기 폭
		 * @param {Number} hh 절반 크기 높이
		 */
		halfBounds: function(degree, cx, cy, hw, hh){
			var radian = Math.PI / 180 * degree;
			return AbGraphics.rotate.halfBounds(radian, cx, cy, hw, hh);
		},

		/**
		 * 회전된 상자의 bounds를 계산합니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} degree 각도
		 * @param {Number} x x좌표
		 * @param {Number} y y좌표
		 * @param {Number} w 폭
		 * @param {Number} h 높이
		 * @return {Box} 회전된 상자의 위치 및 크기
		 */
		bounds: function(degree, x, y, w, h){
			var radian = Math.PI / 180 * degree;
			return AbGraphics.rotate.bounds(radian, x, y, w, h);
		},

		/**
		 * (cx, cy) 좌표를 기준으로 회전한 상자의 코너 정보를 계산합니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} degree 각도
		 * @param {Number} cx 기준 x좌표
		 * @param {Number} cy 기준 y좌표
		 * @param {Number} x1 상자의 좌상단 x좌표
		 * @param {Number} y1 상자의 좌상단 y좌표
		 * @param {Number} x2 상자의 우하단 x좌표
		 * @param {Number} y2 상자의 우하단 y좌표
		 * @return {AbGraphics.rotate.RotatedBoxCorner} 회전된 상자의 코너 정보
		 */
		corners: function(degree, cx, cy, x1, y1, x2, y2){
			var radian = Math.PI / 180 * degree;
			return AbGraphics.rotate.corners(radian, cx, cy, x1, y1, x2, y2);
		},

		// 
		/**
		 * (0,0) 좌표를 기준으로 회전한 좌표를 화면 기준 (0,0) 좌표가 기준이 되도록 보정치를 계산합니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} degree 각도
		 * @param {Number} w 폭
		 * @param {Number} h 높이
		 * @param {Boolean} [reverse=true] 보정치 만큼 역회전합니다.
		 */
		correctDisplayCoordinate: function(degree, w, h, reverse){
			var radian = Math.PI / 180 * degree;
			return AbGraphics.rotate.correctDisplayCoordinate(radian, w, h, reverse);
		},
	
		//-----------------------------------------------------------
		
		/**
		 * 도형 중상단을 기준으로 한 각도를 계산합니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} degree 각도
		 * @return {Number} 도형 중상단 기준 각도
		 */
		toShapeAngle: function (degree){
			var angle = (degree - 90) % 360;
			if (angle < 0) angle = 360 + angle;
			return angle;
		},
		/**
		 * 도형 중상단 기준 각도에서 중하단 기준 각도로 계산합니다.
		 * <p>* 도형의 각도를 단순 계산하면 도형의 중하단을 기준이 됩니다.
		 * @memberof AbGraphics.angle
		 * @param {Number} degree 각도
		 * @return {Number} 도형 중하단 기준 각도
		 */
		fromShapeAngle: function (degree){ return (degree + 90) % 360; },
	},

	/**
	 * 회전 관련 도구
	 * @memberof AbGraphics
	 * @namespace
	 */
	rotate: {
		/**
		 * (cx,cy) 좌표를 기준으로 (x,y) 좌표를 각도만큼 회전합니다.
		 * @memberof AbGraphics.rotate
		 * @param {Number} radian 각도
		 * @param {Number} cx 기준 x좌표
		 * @param {Number} cy 기준 y좌표
		 * @param {Number} x x좌표
		 * @param {Number} y y좌표
		 * @return {Point} 회전된 좌표
		 */
		point: function (radian, cx, cy, x, y){
			var cv = Math.cos(radian), sv = Math.sin(radian);
			return {
				x: (x - cx) * cv - (y - cy) * sv + cx,
				y: (x - cx) * sv + (y - cy) * cv + cy
			};
		},

		/**
		 * (cx,cy) 좌표를 기준으로 상자를 각도만큼 회전합니다.
		 * @memberof AbGraphics.rotate
		 * @param {Number} radian 각도
		 * @param {Number} cx 기준 x좌표
		 * @param {Number} cy 기준 y좌표
		 * @param {Number} x1 상자의 좌상단 x좌표
		 * @param {Number} y1 상자의 우하단 y좌표
		 * @param {Number} x2 상자의 좌상단 x좌표
		 * @param {Number} y2 상자의 우하단 y좌표
		 * @return {Rect} 회전된 상자 정보
		 */
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

		/**
		 * 회전된 절반 크기의 bounds를 계산합니다.
		 * @memberof AbGraphics.rotate
		 * @param {Number} radian 각도
		 * @param {Number} cx 기준 x좌표
		 * @param {Number} cy 기준 y좌표
		 * @param {Number} hw 절반 크기 폭
		 * @param {Number} hh 절반 크기 높이
		 */
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

		/**
		 * 회전된 상자의 bounds를 계산합니다.
		 * @memberof AbGraphics.rotate
		 * @param {Number} radian 각도
		 * @param {Number} x x좌표
		 * @param {Number} y y좌표
		 * @param {Number} w 폭
		 * @param {Number} h 높이
		 * @return {Box} 회전된 상자의 위치 및 크기
		 */
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

		/**
		 * 회전된 상자의 코너 정보
		 * @typedef {Object} AbGraphics.rotate.RotatedBoxCorner
		 * @property {Point} leftTop 상자의 좌상단 좌표
		 * @property {Point} rightTop 상자의 우상단 좌표
		 * @property {Point} rightBottom 상자의 우하단 좌표
		 * @property {Point} leftBottom 상자의 좌하단 좌표
		 * @property {Point} left 상자의 제일 왼쪽 좌표
		 * @property {Point} top 상자의 제일 왼쪽 좌표
		 * @property {Point} left 상자의 제일 상단 좌표
		 * @property {Point} right 상자의 제일 오른쪽 좌표
		 * @property {Point} bottom 상자의 제일 하단 좌표
		 * @property {Object} min 상자의 XY 좌표 중 최소 XY 좌표
		 * @property {Object} min.x 상자의 XY 좌표 중 최소 X 좌표
		 * @property {Object} min.y 상자의 XY 좌표 중 최소 X 좌표
		 * @property {Object} max 상자의 XY 좌표 중 최대 XY 좌표
		 * @property {Object} max.x 상자의 XY 좌표 중 최대 X 좌표
		 * @property {Object} max.y 상자의 XY 좌표 중 최대 X 좌표
		 */

		/**
		 * (cx, cy) 좌표를 기준으로 회전한 상자의 코너 정보를 계산합니다.
		 * @memberof AbGraphics.rotate
		 * @param {Number} radian 각도
		 * @param {Number} cx 기준 x좌표
		 * @param {Number} cy 기준 y좌표
		 * @param {Number} x1 상자의 좌상단 x좌표
		 * @param {Number} y1 상자의 좌상단 y좌표
		 * @param {Number} x2 상자의 우하단 x좌표
		 * @param {Number} y2 상자의 우하단 y좌표
		 * @return {AbGraphics.rotate.RotatedBoxCorner} 회전된 상자의 코너 정보
		 */
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

		/**
		 * 파이의 하프 값
		 * @memberof AbGraphics.rotate
		 * @const
		 * @type {Number}
		 * @default
		 */
		HALF_PI : Math.PI / 2,

		// (0,0) 좌표로 회전한 좌표를 화면 기준 (0,0) 좌표가 기준이 되도록 보정치 계산
		/**
		 * (0,0) 좌표를 기준으로 회전한 좌표를 화면 기준 (0,0) 좌표가 기준이 되도록 보정치를 계산합니다.
		 * @memberof AbGraphics.rotate
		 * @param {Number} radian 각도
		 * @param {Number} w 폭
		 * @param {Number} h 높이
		 * @param {Boolean} [reverse=true] 보정치 만큼 역회전합니다.
		 */
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

		/**
		 * 거리를 각도로 회전한 좌표를 계산합니다.
		 * @memberof AbGraphics.rotate
		 * @param {Number} radian 각도
		 * @param {Number} distance 거리
		 * @return {Point} 회전 좌표
		 */
		pointByDistance: function (radian, distance){
			return {
				x: distance * Math.cos(radian),
				y: distance * Math.sin(radian)
			};
		},
	},

	/**
	 * HTML Canvas 관련 도구
	 * @memberof AbGraphics
	 * @namespace
	 */
	canvas: {
		/**
		 * Canvas를 이미지로 변환 시 이미지 퀄리티
		 * <p>* JPEG 이미지에만 해당됩니다.
		 * @memberof AbGraphics.canvas
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL} MDN 자료 참고
		 * @const
		 * @type {String}
		 * @default
		 */
		IMAGE_QUALITY: undefined,
		
		/**
		 * Context의 이미지 퀄리티를 설정합니다.
		 * <p>* IE, 파이어폭스는 지원하지 않습니다.
		 * @memberof AbGraphics.canvas
		 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
		 * @param {String} value 설정값 (low|medium|high)
		 * @return {CanvasRenderingContext2D} Canvas 2D Context
		 */
		imageSmoothing: function(ctx, value){
			ctx.imageSmoothingEnabled = value;
			ctx.mozImageSmoothingEnabled = value;
			ctx.webkitImageSmoothingEnabled = value;
			ctx.msImageSmoothingEnabled = value;
	
			ctx.imageSmoothingQuality = 'high';

			return ctx;
		},

		/**
		 * Canvas 2D Context를 생성합니다.
		 * @memberof AbGraphics.canvas
		 * @param {Number} [w] Canvas의 폭
		 * @param {Number} [h] Canvas의 높이
		 * @return {CanvasRenderingContext2D} Canvas 2D Context
		 */
		createContext: function (w, h){
			var canvas = null;
			if (AbCommon.isNumber(w) && AbCommon.isNumber(h))
				canvas = $('<canvas width="'+w+'" height="'+h+'"/>');
			else
				canvas = $('<canvas/>');
			var ctx = canvas.get(0).getContext('2d');
			return ctx;
		},

		/**
		 * Canvas를 이미지로 변환합니다.
		 * @memberof AbGraphics.canvas
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL} MDN 자료 참고
		 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
		 * @param {String} [type] 이미지 타입 (jpeg|jpg|png)
		 * @return {String} DATA URL 형식 문자열
		 */
		toImage: function (ctx, type){
			switch (type){
			case 'jpg': case 'jpeg': type = 'image/jpeg'; break;
			default: type = 'image/png'; break;
			}
			if (AbCommon.isSetted(this.IMAGE_QUALITY))
				return ctx.canvas.toDataURL(type, this.IMAGE_QUALITY);
			else
				return ctx.canvas.toDataURL(type);
		},

		/**
		 * Canvas를 BLOB 데이터로 변환합니다.
		 * @memberof AbGraphics.canvas
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob} MDN 자료 참고
		 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
		 * @param {String} type MIME Type, 예) image/jpeg
		 * @return {Blob} Blob 객체
		 */
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

		/**
		 * HTML Image 객체를 Data URL 형식 문자열로 변환합니다.
		 * @memberof AbGraphics.canvas
		 * @param {CanvasImageSource} imgElement 이미지 객체
		 * @param {String} [type] 이미지 타입 (jpeg|jpg|png)
		 * @return {String} DATA URL 형식 문자열
		 */
		renderImage: function (imgElement, type){
			var ctx = this.createContext(imgElement.width, imgElement.height);
			ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height, 0, 0, imgElement.width, imgElement.height);
			return this.toImage(ctx, type);
		},

		/**
		 * Dash 크기 (단위: 픽셀)
		 * @memberof AbGraphics.canvas
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash} MDN 자료 참고
		 * @const
		 * @type {Number}
		 * @default
		 */
		DASH_SIZ: 8,
		/**
		 * Dot 크기 (단위: 픽셀)
		 * @memberof AbGraphics.canvas
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash} MDN 자료 참고
		 * @const
		 * @type {Number}
		 * @default
		 */
		DOT_SIZ: 2,
		/**
		 * Dash나 Dot 사이의 공간 크기 (단위: 픽셀)
		 * @memberof AbGraphics.canvas
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash} MDN 자료 참고
		 * @const
		 * @type {Number}
		 * @default
		 */
		SPACE_SIZ: 4,

		/**
		 * Canvas에서 안티 앨리어싱(Anti-Aliasing)이 되지 않도록 수치를 보정합니다.
		 * @memberof AbGraphics.canvas
		 * @param {Number} x 수치
		 * @return {Number} 보정된 수치
		 */
		noAnti: function (x){
			return Math.round(x) - 0.5;
		},

		/**
		 * Canvas에서 안티 앨리어싱(Anti-Aliasing)이 되지 않도록 좌표를 보정합니다.
		 * @memberof AbGraphics.canvas
		 * @param {Point} d 좌표
		 * @return {Point} 보정된 좌표
		 */
		noAntiPos: function (d){
			d.x = AbGraphics.canvas.noAnti(d.x);
			d.y = AbGraphics.canvas.noAnti(d.y);
			return d;
		},

		/**
		 * Dash 스타일을 확인합니다.
		 * @memberof AbGraphics.canvas
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash} MDN 자료 참고
		 * @param {Number} style 스타일 (solid|dash|dot|dash-dot|dash-dot-dot)
		 * @param {Number} defaultStyle 스타일을 지정하지 않을 때 기본 스타일
		 * @return {String} 확인된 스타일
		 */
		dashStyle: function (style, defaultStyle){
			if (!style) return defaultStyle;
	
			switch (style){
			case 'solid': case 'dash': case 'dot': case 'dash-dot': case 'dash-dot-dot': return style;
			}
			return defaultStyle;
		},
	
		/**
		 * Dash 스타일을 생성합니다.
		 * @memberof AbGraphics.canvas
		 * @param {String} s 스타일
		 * @return {Array.<Number>} Dash 스타일 배열
		 */
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

		/**
		 * 텍스트 측정 크기 정보
		 * @typedef {Object} AbGraphics.canvas.MeasureTextSize
		 * @property {Number} width 텍스트 상자의 폭 (줄 높이 적용)
		 * @property {Number} height 텍스트 상자의 높이 (줄 높이 적용)
		 * @property {Number} contentWidth 텍스트의 폭 (줄 높이 적용 안함)
		 * @property {Number} contentHeight 텍스트의 높이 (줄 높이 적용 안함)
		 */

		/**
		 * HTMLDivElement를 이용해 텍스트의 크기를 측정합니다.
		 * @memberof AbGraphics.canvas
		 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
		 * @param {Number} lineHeight 줄 높이(1=100%)
		 * @param {Number} cache 측정용 엘리먼트를 저장할 객체
		 * @param {Number} text 텍스트
		 * @return {AbGraphics.canvas.MeasureTextSize} 크기정보
		 */
		measureText: function (ctx, lineHeight, cache, text){
			//console.log('[MEASURE TEXT] ' + ctx.font);

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

			e1.detach();
			e2.detach();

			return {
				width: size1.width,
				height: size1.height,
				contentWidth: size2.width,
				contentHeight: size2.height,
			};
		},
	},

	/**
	 * 이미지 프로세싱 관련 도구
	 * @memberof AbGraphics
	 * @namespace
	 */
	image: {
		/**
		 * bilinear 보간 알고리즘을 적용합니다.
		 * @memberof AbGraphics.image
		 * @see {@link http://strauss.pas.nu/js-bilinear-interpolation.html} 참고
		 * @param {Number} srcImg 원본 ImageData
		 * @param {Number} destImg 대상 ImageData
		 * @param {Number} scale 적용 비율
		 * 
		 * @example
		 * var w = 500, h = 500, scale = 0.5;
		 * 
		 * var ctx = AbGraphics.createContext();
		 * var destCtx = AbGraphics.createContext(w, h);
		 * 
		 * ctx.drawImage(image, 0, 0);
		 * 
		 * var src = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
		 * var dest = destCtx.createImageData(w, h);
		 * 
		 * AbGraphics.image.bilinear(src, dest, scale);
		 * 
		 * destCtx.putImageData(dest, 0, 0);
		 */
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

		/**
		 * bicubic 보간 알고리즘
		 * @memberof AbGraphics.image
		 * @see {@link http://strauss.pas.nu/js-bilinear-interpolation.html} 참고
		 * @param {Number} srcImg 원본 ImageData
		 * @param {Number} destImg 대상 ImageData
		 * @param {Number} scale 적용 비율
		 * 
		 * @example
		 * var w = 500, h = 500, scale = 0.5;
		 * 
		 * var ctx = AbGraphics.createContext();
		 * var destCtx = AbGraphics.createContext(w, h);
		 * 
		 * ctx.drawImage(image, 0, 0);
		 * 
		 * var src = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
		 * var dest = destCtx.createImageData(w, h);
		 * 
		 * AbGraphics.image.bicubic(src, dest, scale);
		 * 
		 * destCtx.putImageData(dest, 0, 0);
		 */
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
		* @memberof AbGraphics.image
		* @see {@link https://github.com/viliusle/Hermite-resize} Canvas image resize/resample using Hermite filter with JavaScript.
		* @param {HtmlElement} canvas
		* @param {int} width
		* @param {int} height
		* @param {boolean} [resize_canvas=false] if true, canvas will be resized. Optional.
		 * 
		 * @example
		 * var w = 500, h = 500;
		 * 
		 * var ctx = AbGraphics.createContext();
		 * var destCtx = AbGraphics.createContext(w, h);
		 * 
		 * ctx.drawImage(image, 0, 0);
		 * 
		 * AbGraphics.image.hermite(ctx.canvas, w, h, true);
		 * 
		 * destCtx.drawImage(ctx.canvas, 0, 0);
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