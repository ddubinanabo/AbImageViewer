/**
 * 클립보드 데이터
 * <p>* OS와 호환되지 않습니다.
 * @typedef {Object} AbClipboard.Data
 * @property {String} type 데이터 유형 (shape)
 * @property {String} data 데이터
 * <dl>
 * 	<dt>type이 shape인 경우</dt><dd>도형 XML 문자열</dd>
 * </dl>
 */

/**
 * 클립보드 관리자
 * <p>* OS와 호환되지 않습니다.
 * @class
 */
function AbClipboard(){
	/**
	 * 개체 목록
	 * @private
	 * @type {Array.<AbClipboard.Data>}
	 */
	this.datas = [];
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbClipboard.prototype = {
	constructor: AbClipboard,

	//-----------------------------------------------------------

	/**
	 * 클립보드를 비웁니다.
	 */
	clear: function (){
		this.datas.splice(0, this.datas.length);

		// var dlen = this.datas.length;
		// for (var i=0; i < dlen; i++){
		// 	var d = this.datas[i];

		// 	d.type = null;
		// 	d.data = null;
		// }
	},

	//-----------------------------------------------------------

	/**
	 * 클립보드에 추가합니다.
	 * @param {AbViewerEngine} engine 엔진
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {Array.<ShapeObject>} shapes 도형 목록
	 */
	copy: function(engine, page, shapes){
		this.clear();

		var slen = shapes.length;
		for (var i=0; i < slen; i++){
			var s = shapes[i];
			var d = s.serialize();

			//console.log(d);

			this.datas.push({
				type: 'shape',
				data: d
			});
		}
	},

	/**
	 * 엔진에서 선택된 도형을 제거하고, 제거한 도형들을 클립보드에 추가합니다.
	 * @param {AbViewerEngine} engine 엔진
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {Array.<ShapeObject>} shapes 도형 목록
	 */
	cut: function (engine, page, shapes){
		this.copy(engine, page, shapes);
		engine.deleteShapes();
	},

	/**
	 * 클립보드의 도형들을 엔진에 추가합니다.
	 * @param {AbViewerEngine} engine 엔진
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {Function} callback 작업 완료 후 호출된 콜백 함수
	 */
	paste: function (engine, page, callback){
		if (!AbCommon.isFunction(callback)) callback = function(){};
		
		var totalCalled = 0, received = 0;
		
		var func = function (){
			received++;
			
			if (received >= totalCalled){
				engine.render();

				// Notify modified
				engine.modified();
				
				callback();
			}
		};

		//-----------------------------------------------------------
		
		var pls = [];
		var dlen = this.datas.length;
		if (dlen){
			engine.unselect(false);

			//-----------------------------------------------------------
			// begin record history
			engine.history.begin('shape', 'add', engine);
			//-----------------------------------------------------------

			var page = engine.currentPage;
			
			var numShapes = 0;
			for (var i=0; i < dlen; i++){
				var d = this.datas[i];
				if (d.type == 'shape') numShapes++;
			}

			var called = 0;
			for (var i=0; i < dlen; i++){
				var d = this.datas[i];
	
				if (d.type == 'shape'){
					var prop = AbCommon.deserializeShape(d.data);
					var s = engine.createShape(prop.name, prop, function (s, error){
						s.prepare();

						this.move(engine, page, s);
		
						page.shapes.push(s);

						s.engine = engine;
						s.measure();

						engine.selectShape(s);
						
						//-----------------------------------------------------------
						
						called++;
						if (called >= numShapes){
							//-----------------------------------------------------------
							// end record history
							engine.history.end(engine);
							//-----------------------------------------------------------
							
							engine.render();

							// Notify modified
							engine.modified();

							callback();
						}
					}.bind(this));
				}
			}
			
			if (!numShapes){
				//-----------------------------------------------------------
				// end record history
				engine.history.end(engine);
				//-----------------------------------------------------------
				
				engine.render();

				// Notify modified
				engine.modified();

				callback();
			}
		}else{
			callback();
		}
	},

	/**
	 * 붙여넣기 위치 더해질 증가량
	 * @private
	 * @const
	 * @type {Number}
	 * @default
	 */
	PASTE_STEP: 20,

	/**
	 * 도형의 위치를 이동합니다.
	 * @private
	 * @param {AbViewerEngine} engine 엔진
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {ShapeObject} s 도형
	 */
	move: function(engine, page, s){
		var box = s.box(), step = this.PASTE_STEP;

		while(this.hasShape(engine, page, box.x, box.y)){
			box.x += step;
			box.y += step;
		}

		s.move(box.x, box.y);
	},

	/**
	 * 붙여넣기할 도형의 위치에 다른 도형이 있는지 확인합니다.
	 * @param {AbViewerEngine} engine 엔진
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {Number} x 새 도형의 X좌표
	 * @param {Number} y 새 도형의 Y좌표
	 * @return {Boolean}
	 */
	hasShape: function (engine, page, x, y){
		var len = page.shapes.length;
		for (var i=0; i < len; i++){
			var ps = page.shapes[i];

			var box = ps.box();
			if (Math.round(box.x) == x && Math.round(box.y) == y)
				return true;
		}
		return false;
	},
};
