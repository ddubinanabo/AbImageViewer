/**
 * 다각형 도형 편집 지시자 스타일 정보
 * @typedef {Object} AbShapePolygonPointUpdater.Data
 * @property {AbShapePolygonPointUpdater.BeforeData} angle=true 회전 편집점 사용 여부
 * @property {AbShapePolygonPointUpdater.AfterData} angleDistance=30 도형과 회전 편집점의 거리
 */

/**
 * 다각형 도형 편집 지시자 스타일 정보
 * @typedef {Object} AbShapePolygonPointUpdater.BeforeData
 * @property {AbShapePolygonPointUpdater.EditPoint} edit 에디팅 포인트 정보
 * @property {Point} point 포인트 정보
 * @property {NumAbShapePolygonPointUpdater.Boundary} boundary 경계 정보
 */

/**
 * 다각형 도형 편집 지시자 스타일 정보
 * @typedef {Object} AbShapePolygonPointUpdater.AfterData
 * @property {AbShapePolygonPointUpdater.EditPoint} edit 에디팅 포인트 정보
 * @property {Point} point 포인트 정보
 * @property {AbShapePolygonPointUpdater.Boundary} boundary 경계 정보
 */

/**
 * 에디팅 포인트 정보
 * @typedef {Object} AbShapePolygonPointUpdater.EditPoint
 * @property {String} full 수평 + 수직 포인트<p>ex) LT, LC, RB
 * @property {String} horiz 수평 포인트 (L|C|R)
 * @property {String} vert 수직 포인트 (T|C|B)
 */

/**
 * 경계 정보
 * @typedef {Object} AbShapePolygonPointUpdater.Boundary
 * @property {Number} x 도형의 X좌표
 * @property {Number} y 도형의 Y좌표
 * @property {Number} width 도형의 폭
 * @property {Number} height 도형의 높이
 * @property {Point} min 도형의 최소 값 정보
 * @property {Point} max 도형의 최대 값 정보
 * @property {Function} checkPoint 에디팅 포인트를 가져옵니다.
 * @property {Function} get 도형의 최소값을 기준으로 한 좌표를 가져옵니다.
 * @property {Function} start 시작 점을 가져옵니다.
 */

/**
 * 다각형 편집점 업데이터
 * <p>* AbPolygonEditIndicator가 내부에서 사용합니다.
 * @class
 */
function AbShapePolygonPointUpdater(){

	/**
	 * 대상 도형 객체
	 * @private
	 * @type {ShapeObject}
	 */
	this.s = null;

	/**
	 * 수정 정보
	 * @private
	 * @type {AbShapePolygonPointUpdater.Data}
	 */
	this.data = {
		before: null,
		after: null,
	};
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------


AbShapePolygonPointUpdater.prototype = (function(){
	return {
		constructor: AbShapePolygonPointUpdater,
		
		//-----------------------------------------------------------

		/**
		 * 객체를 dispose 합니다.
		 */
		dispose: function(){
			this.s = null;
			this.data.before = null;
			this.data.after = null;
		},
		
		//-----------------------------------------------------------

		/**
		 * 포인트를 수정한 후 도형의 에디팅 포인트가 변화가 있는 지 확인합니다.
		 * @return {Boolean}
		 */
		changed: function (){
			var b = this.data.before, a = this.data.after;
			return (a.edit.horiz === 'C' && b.edit.horiz !== 'C') || (a.edit.vert === 'C' && b.edit.vert !== 'C');
		},
		
		//-----------------------------------------------------------

		/**
		 * 대상 도형을 설정합니다.
		 * @param {ShapeObject} shapeObject 도형 객체
		 */
		set: function (shapeObject){
			this.s = shapeObject;
		},
		
		//-----------------------------------------------------------

		/**
		 * 포인트 수정을 시작합니다.
		 * @param {Number} index 포인트의 위치
		 * @param {Number} x 포인트의 새 X좌표
		 * @param {Number} y 포인트의 새 Y좌표
		 */
		begin: function(index, x, y){
			this.data.before = begin(this, index);
			this.data.after = prepare(this, index, x, y);
		},

		/**
		 * 포인트 수정을 종료합니다.
		 */
		end: function (){
			update(this);
		},
	};
	
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------

	// 에디팅 포인트 정보를 확인합니다.
	function checkPoint (value, min, max, minPoint, maxPoint){
		var point = 'C';
		if (value <= min) point = minPoint;
		else if (value >= max) point = maxPoint;
		return point;
	}

	function checkEditPoint (s, x, y){
		var ph = checkPoint(x, s.minPointX, s.maxPointX, 'L', 'R');
		var pv = checkPoint(y, s.minPointY, s.maxPointY, 'T', 'B');

		return {
			full: ph + pv,
			horiz: ph,
			vert: pv,
		};
	}

	// 경계 정보를 생성합니다.
	function boundary (s){
		return {
			x: s.x,
			y: s.y,
			width: s.width,
			height: s.height,

			min: { x: s.minPointX, y: s.minPointY },
			max: { x: s.maxPointX, y: s.maxPointY },

			checkPoint: function (x, y){
				var ph = checkPoint(x, this.min.x, this.max.x, 'L', 'R');
				var pv = checkPoint(y, this.min.y, this.max.y, 'T', 'B');
		
				return {
					full: ph + pv,
					horiz: ph,
					vert: pv,
				};		
			},

			get: function (x, y){
				return {
					x: x - this.min.x,
					y: y - this.min.y
				};
			},

			start: function (){ return this.get(this.x, this.y); },
		};
	}

	//-----------------------------------------------------------

	// 포인트 수정 전 정보를 가져옵니다.
	function begin(instance, index){
		var b = boundary(instance.s);
		var p = instance.s.points[index];
		var point = { x: p.x + b.min.x, y: p.y + b.min.y };
		var edit = b.checkPoint(point.x, point.y);

		return {
			edit: edit,
			point: point,
			boundary: b,
		};
	}

	// 포인트 정보를 수정합니다.
	function prepare(instance, index, x, y){
		var b = boundary(instance.s);
		var start = b.start();
		var bound = {
			min: { x: 0, y: 0 },
			max: { x: 0, y: 0 },
		};
		var points = instance.s.points;
		var len = points.length, a = [];
		for (var i=0; i < len; i++){
			var p = { x: points[i].x, y: points[i].y };

			if (i === index){
				p.x = x - start.x;
				p.y = y - start.y;
			}else{
				p.x += b.min.x;
				p.y += b.min.y;
			}

			bound.min.x = i == 0 || p.x < bound.min.x ? p.x : bound.min.x;
			bound.min.y = i == 0 || p.y < bound.min.y ? p.y : bound.min.y;
			bound.max.x = i == 0 || p.x > bound.max.x ? p.x : bound.max.x;
			bound.max.y = i == 0 || p.y > bound.max.y ? p.y : bound.max.y;

			a.push(p);
		}

		b.min = bound.min;
		b.max = bound.max;

		var edit = b.checkPoint(x - start.x, y - start.y);

		b.x = bound.min.x + start.x;
		b.y = bound.min.y + start.y;
		b.width = bound.max.x - bound.min.x;
		b.height = bound.max.y - bound.min.y;

		return {
			edit: edit,
			start: start,
			input: { index: index, x: x, y: y },
			points: a,
			boundary: b,
		};
	}

	// 포인트 수정을 종료합니다.
	function update(instance){
		var s = instance.s;
		var d = instance.data.after;
		var b = d.boundary;

		var a = d.points, len = a.length;
		for (var i=0; i < len; i++){
			var p = a[i];

			p.x -= b.min.x;
			p.y -= b.min.y;
		}

		s.points = a;

		s.minPointX = b.min.x;
		s.minPointY = b.min.y;
		s.maxPointX = b.max.x;
		s.maxPointY = b.max.y;

		//s.x = b.x;
		//s.y = b.y;
		s.width = b.width;
		s.height = b.height;
	}
})();