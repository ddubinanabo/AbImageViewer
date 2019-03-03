/**
 * 도형 추가 History 상태
 * <p>* 추가 전/후의 상태 정보를 담습니다.
 * @class
 */
function AbHistoryAddShapeState(){
	/**
	 * 실행 구분
	 * @type {String}
	 * @default
	 */
	this.type = 'shape';
	/**
	 * 실행 명령
	 * @type {String}
	 * @default
	 */
	this.cmd = 'add';

	/**
	 * 페이지 인덱스
	 * <p>* 서브 페이지가 있는 경우, 부모 페이지의 인덱스
	 */
	this.pageOwnerIndex = -1;
	/**
	 * 페이지 인덱스
	 * <p>* 서브 페이지가 있는 경우, 서브 페이지의 인덱스
	 * @private
	 * @type {Number}
	 */
	this.pageIndex = -1;
	/**
	 * 도형 목록
	 * @private
	 * @type {Array.<ShapeObject>}
	 */
	this.shapes = [];

	/**
	 * 도형 목록 인덱스
	 * @private
	 * @type {Number}
	 */
	this.start = 0;
};
	
//-----------------------------------------------------------

AbHistoryAddShapeState.prototype = {
	constructor: AbHistoryAddShapeState,

	/**
	 * 기록을 시작합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	begin: function(engine){
		var page = engine.currentPage;

		this.pageIndex = engine.currentPageIndex;
		this.pageOwnerIndex = engine.ownerPageIndex;
		this.start = page.shapes.length;
	},

	/**
	 * 기록을 종료합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	end: function(engine){
		var page = engine.query('page', this.pageIndex, this.pageOwnerIndex);
		
		var shapes = null;
		if (this.start >= 0)
			shapes = page.shapes.slice(this.start);
		else
			shapes = page.shapes.slice();

		if (!shapes.length)
			return false;

		this.shapes = AbCommon.indexArrayOf(page.shapes, shapes, true);
	},

	/**
	 * 실행 취소를 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	undo: function(engine){
		var page = engine.query('page', this.pageIndex, this.pageOwnerIndex);
		if (!this.shapes.length) return;

		engine.command('page.select', this.pageIndex, this.pageOwnerIndex);
		var mod = engine.unselect(false);
		
		var len = this.shapes.length;
		for (var i=len - 1; i >= 0; i--)
			page.shapes.splice(this.shapes[i].index, 1);

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	/**
	 * 다시 실행을 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	redo: function(engine){
		var page = engine.query('page', this.pageIndex, this.pageOwnerIndex);

		engine.command('page.select', this.pageIndex, this.pageOwnerIndex);
		var mod = engine.unselect(false);

		var len = this.shapes.length;
		for (var i=0; i < len; i++){
			var d = this.shapes[i];

			page.shapes.splice(d.index, 0, d.source);
			//d.source.measure();
			engine.selectShape(d.source);
		}

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	/**
	 * 상태 객체를 dispose 합니다.
	 */
	dispose: function(){
		this.shapes.splice(0, this.shapes.length);
		//AbCommon.disposeShapes(this.shapes);
	},
};


//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

/**
 * 도형 필드 정보
 * @typedef {Object} AbHistoryUpdateShapeState.Prop
 * @property {Number} index 도형 인덱스
 * @property {*} prop 필드값
 */

/**
 * 도형 변경 History 상태
 * <p>* 수정 전/후의 상태 정보를 담습니다.
 * @class
 */
function AbHistoryUpdateShapeState(){
	/**
	 * 실행 구분
	 * @type {String}
	 * @default
	 */
	this.type = 'shape';
	/**
	 * 실행 명령
	 * @type {String}
	 * @default
	 */
	this.cmd = 'update';

	/**
	 * 페이지 인덱스
	 * <p>* 서브 페이지가 있는 경우, 부모 페이지의 인덱스
	 */
	this.pageOwnerIndex = -1;
	/**
	 * 페이지 인덱스
	 * @private
	 * @type {Number}
	 */
	this.pageIndex = -1;
	/**
	 * 체크할 필드 목록
	 * @private
	 * @type {Array.<String>}
	 */
	this.props = null;
	/**
	 * 도형 편집점 (A|LT|CT|RT|LC|RC|LB|CB|RB)
	 * @private
	 * @type {String}
	 */
	this.editPoint = null;

	/**
	 * 변경 전 필드 내용 목록
	 * @private
	 * @type {Array.<AbHistoryUpdateShapeState.Prop>}
	 */
	this.un = [];
	/**
	 * 변경 후 필드 내용 목록
	 * @private
	 * @type {Array.<AbHistoryUpdateShapeState.Prop>}
	 */
	this.re = [];
};

//-----------------------------------------------------------

AbHistoryUpdateShapeState.prototype = {
	constructor: AbHistoryUpdateShapeState,
	
	/**
	 * 기록을 시작합니다.
	 * @param {AbViewerEngine} engine 엔진
	 * @param {Array.<String>} props 체크할 필드 목록
	 * @param {String} editPoint 도형 편집점
	 */
	begin: function(engine, props, editPoint){
		if (!engine.selectedShapes.length)
			return false;

		this.props = props;
		this.editPoint = editPoint;
		this.pageIndex = engine.currentPageIndex;
		this.pageOwnerIndex = engine.ownerPageIndex;

		var page = engine.currentPage;
		var idxes = AbCommon.indexArrayOf(page.shapes, engine.selectedShapes, true);
		var len = idxes.length;
		for (var i=0; i < len; i++){
			var d = idxes[i];
			var p = AbCommon.copyProp(d.source, {}, this.props);

			this.un.push({
				index: d.index,
				prop: p
			});
		}
	},

	/**
	 * 기록을 종료합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	end: function(engine){
		if (!engine.selectedShapes.length)
			return false;

		var page = engine.query('page', this.pageIndex, this.pageOwnerIndex);

		var idxes = AbCommon.indexArrayOf(page.shapes, engine.selectedShapes, true);
		var len = idxes.length;
		for (var i=0; i < len; i++){
			var d = idxes[i];
			var p = AbCommon.copyProp(d.source, {}, this.props);

			this.re.push({
				index: d.index,
				prop: p
			});
		}

		var mod = false;
		for (var i=0; i < len; i++){
			var un = this.un[i].prop;
			var re = this.re[i].prop;

			if (!AbCommon.equals(un, re)){
				mod = true;
				break;
			}
		}

		return mod;
	},

	/**
	 * 실행 취소를 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	undo: function(engine){
		var page = engine.query('page', this.pageIndex, this.pageOwnerIndex);

		engine.command('page.select', this.pageIndex, this.pageOwnerIndex);
		var mod = engine.unselect(false);
		
		var len = this.un.length;
		for (var i=0; i < len; i++){
			var d = this.un[i];
			var s = page.shapes[d.index];
			
			$.extend(s, d.prop, true);
			//s.measure();
			s.notify('history', 'undo', 'update', page);
			engine.selectShape(s);
		}

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	/**
	 * 다시 실행을 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	redo: function(engine){
		var page = engine.query('page', this.pageIndex, this.pageOwnerIndex);

		engine.command('page.select', this.pageIndex, this.pageOwnerIndex);
		var mod = engine.unselect(false);
		
		var len = this.re.length;
		for (var i=0; i < len; i++){
			var d = this.re[i];
			var s = page.shapes[d.index];
			
			$.extend(s, d.prop, true);
			//s.measure();
			s.notify('history', 'redo', 'update', page);
			engine.selectShape(s);
		}

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	/**
	 * 상태 객체를 dispose 합니다.
	 */
	dispose: function(){
		if (this.props) this.props.splice(0, this.props.length);
		this.un.splice(0, this.un.length);
		this.re.splice(0, this.re.length);
	},
};


//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

/**
 * 도형 삭제 History 상태
 * <p>* 삭제 전/후의 상태 정보를 담습니다.
 * @class
 */
function AbHistoryRemoveShapeState(){
	/**
	 * 실행 구분
	 * @type {String}
	 * @default
	 */
	this.type = 'shape';
	/**
	 * 실행 명령
	 * @type {String}
	 * @default
	 */
	this.cmd = 'remove';

	/**
	 * 페이지 인덱스
	 * <p>* 서브 페이지가 있는 경우, 부모 페이지의 인덱스
	 */
	this.pageOwnerIndex = -1;
	/**
	 * 페이지 인덱스
	 * @private
	 * @type {Number}
	 */
	this.pageIndex = -1;
	/**
	 * 도형 목록
	 * @private
	 * @type {Array.<ShapeObject>}
	 */
	this.shapes = [];
};
	
//-----------------------------------------------------------

AbHistoryRemoveShapeState.prototype = {
	constructor: AbHistoryRemoveShapeState,
	
	/**
	 * 기록을 시작합니다.
	 * @param {AbViewerEngine} engine 엔진
	 * @param {Array.<ShapeObject>} shapes 도형 목록
	 */
	begin: function(engine, shapes){
		var page = engine.currentPage;

		if (!shapes) shapes = engine.selectedShapes;

		if (!shapes.length)
			return false;
		
		this.pageIndex = engine.currentPageIndex;
		this.pageOwnerIndex = engine.ownerPageIndex;
		this.shapes = AbCommon.indexArrayOf(page.shapes, shapes, true);
	},

	/**
	 * 기록을 종료합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	end: function(engine){
		if (!this.shapes.length)
			return false;
	},

	/**
	 * 실행 취소를 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	undo: function(engine){
		var page = engine.query('page', this.pageIndex, this.pageOwnerIndex);

		engine.command('page.select', this.pageIndex, this.pageOwnerIndex);
		var mod = engine.unselect(false);

		var len = this.shapes.length;
		for (var i=0; i < len; i++){
			var d = this.shapes[i];

			page.shapes.splice(d.index, 0, d.source);
			engine.selectShape(d.source);
		}

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	/**
	 * 다시 실행을 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	redo: function(engine){
		var page = engine.query('page', this.pageIndex, this.pageOwnerIndex);
		if (!this.shapes.length) return;

		engine.command('page.select', this.pageIndex, this.pageOwnerIndex);
		var mod = engine.unselect(false);
		
		var len = this.shapes.length;
		for (var i=len - 1; i >= 0; i--)
			page.shapes.splice(this.shapes[i].index, 1);

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	/**
	 * 상태 객체를 dispose 합니다.
	 */
	dispose: function(){
		this.shapes.splice(0, this.shapes.length);
	},
};



//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

/**
 * 페이지 도형 정보
 * @typedef {Object} AbHistoryRemoveAllShapeState.PageShapes
 * @property {Number} index 페이지 인덱스
 * @property {Array.<ShapeObject>} source 도형 목록
 */

/**
 * 전체 페이지의 도형 삭제 History 상태
 * <p>* 삭제 전/후의 상태 정보를 담습니다.
 * @class
 */
function AbHistoryRemoveAllShapeState(){
	/**
	 * 실행 구분
	 * @type {String}
	 * @default
	 */
	this.type = 'shape';
	/**
	 * 실행 명령
	 * @type {String}
	 * @default
	 */
	this.cmd = 'all';

	/**
	 * 페이지 도형 정보 목록
	 * @private
	 * @type {Array.<AbHistoryRemoveAllShapeState.PageShapes>}
	 */
	this.pages = [];
	/**
	 * 수집된 도형 전체 개수
	 * @private
	 * @type {Number}
	 */
	this.numAllShapes = 0;
};
	
//-----------------------------------------------------------

AbHistoryRemoveAllShapeState.prototype = {
	constructor: AbHistoryRemoveAllShapeState,
	
	/**
	 * 기록을 시작합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	begin: function(engine){
		var siz = engine.pages.length();
		for (var i=0; i < siz; i++){
			var page = engine.pages.get(i);

			var numSubPages = page.subPages.length();
			if (numSubPages){
				for (var j=0; j < numSubPages; j++){
					var subPage = page.subPages.get(j);
	
					if (!subPage.shapes.length)
						continue;
	
					var shapes = subPage.shapes.slice(0);
	
					this.pages.push({
						index: j,
						ownerIndex: i,
						source: shapes
					});
	
					this.numAllShapes += shapes.length;
				}	
			}else if (page.shapes.length){
				var shapes = page.shapes.slice(0);

				this.pages.push({
					index: i,
					source: shapes
				});

				this.numAllShapes += shapes.length;
			}
		}
	},

	/**
	 * 기록을 종료합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	end: function(engine){
		if (!this.numAllShapes)
			return false;
	},

	/**
	 * 실행 취소를 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	undo: function(engine){
		var mod = engine.unselect(false);

		var len = this.pages.length, last = -1, lastOwner = -1;
		for (var i=0; i < len; i++){
			var d = this.pages[i];

			var page = engine.query('page', d.index, d.ownerIndex);
			Array.prototype.push.apply(page.shapes, d.source);

			last = d.index;
			lastOwner = d.ownerIndex;
		}

		if (last >= 0){
			engine.command('page.render', last, lastOwner);
			
			// Notify modified
			engine.modified('all');
		}
	},

	/**
	 * 다시 실행을 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	redo: function(engine){
		var len = this.pages.length, last = -1, lastOwner = -1;
		for (var i=0; i < len; i++){
			var d = this.pages[i];

			var page = engine.query('page', d.index, d.ownerIndex);
			page.shapes.splice(0, page.shapes.length);

			last = d.index;
			lastOwner = d.ownerIndex;
		}

		if (last >= 0){
			engine.command('page.render', last, lastOwner);
			
			// Notify modified
			engine.modified('all');
		}
	},

	/**
	 * 상태 객체를 dispose 합니다.
	 */
	dispose: function(){
		this.pages.splice(0, this.pages.length);
	},
};



//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

/**
 * 페이지 범위의 도형 삭제 History 상태
 * <p>* 삭제 전/후의 상태 정보를 담습니다.
 * @class
 */
function AbHistoryRemoveRangeShapeState(){
	/**
	 * 실행 구분
	 * @type {String}
	 * @default
	 */
	this.type = 'shape';
	/**
	 * 실행 명령
	 * @type {String}
	 * @default
	 */
	this.cmd = 'range';

	/**
	 * 페이지 도형 정보 목록
	 * @private
	 * @type {Array.<AbHistoryRemoveAllShapeState.PageShapes>}
	 */
	this.pageShapes = [];

	/**
	 * 페이지 인덱스 목록
	 * @private
	 * @type {Array.<Number>}
	 */
	this.pages = [];
	/**
	 * 수집된 도형 전체 개수
	 * @private
	 * @type {Number}
	 */
	this.numShapes = 0;
};
	
//-----------------------------------------------------------

AbHistoryRemoveRangeShapeState.prototype = {
	constructor: AbHistoryRemoveRangeShapeState,

	/**
	 * 기록을 시작합니다.
	 * @param {AbViewerEngine} engine 엔진
	 * @param {(Array.<AbPage>|AbPageCollection)} pages 페이지 목록
	 */
	begin: function(engine, pages){
		var siz = pages.length;
		for (var i=0; i < siz; i++){
			var page = pages[i];

			var numSubPages = page.subPages.length();
			if (numSubPages){
				for (var j=0; j < numSubPages; j++){
					var subPage = page.subPages.get(j);
	
					if (!subPage.shapes.length)
						continue;
	
					var shapes = subPage.shapes.slice(0);
	
					this.pages.push({
						index: j,
						ownerIndex: i,
						source: shapes
					});
				}
			}else if (page.shapes.length){
				var shapes = page.shapes.slice(0);
				var index = engine.pages.indexOf(page.uid);
	
				this.pageShapes.push({
					index: index,
					source: shapes
				});
	
				this.pages.push(index);
	
				this.numShapes += shapes.length;
			}
		}
	},

	/**
	 * 기록을 종료합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	end: function(engine){
		if (!this.numShapes)
			return false;
	},

	/**
	 * 실행 취소를 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	undo: function(engine){
		var mod = engine.unselect(false);

		var len = this.pageShapes.length, last = -1;
		for (var i=0; i < len; i++){
			var d = this.pageShapes[i];

			var page = engine.query('page', d.index, d.ownerIndex);
			Array.prototype.push.apply(page.shapes, d.source);

			last = d.index;
			lastOwner = d.ownerIndex;
		}

		if (last >= 0){
			engine.command('page.render', last, lastOwner);
			
			// Notify modified
			engine.modified(this.pages);
		}
	},

	/**
	 * 다시 실행을 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	redo: function(engine){
		var len = this.pageShapes.length, last = -1;
		for (var i=0; i < len; i++){
			var d = this.pageShapes[i];

			var page = engine.query('page', d.index, d.ownerIndex);
			page.shapes.splice(0, page.shapes.length);

			last = d.index;
			lastOwner = d.ownerIndex;
		}

		if (last >= 0){
			engine.command('page.render', last, lastOwner);
			
			// Notify modified
			engine.modified(this.pages);
		}
	},

	/**
	 * 상태 객체를 dispose 합니다.
	 */
	dispose: function(){
		this.pageShapes.splice(0, this.pageShapes.length);
		this.pages.splice(0, this.pages.length);
	},
};


//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

/**
 * 도형 앞뒤 변경 History 상태
 * <p>* 변경 전/후의 상태 정보를 담습니다.
 * @class
 */
function AbHistoryZIndexShapeState(){
	/**
	 * 실행 구분
	 * @type {String}
	 * @default
	 */
	this.type = 'shape';
	/**
	 * 실행 명령
	 * @type {String}
	 * @default
	 */
	this.cmd = 'zindex';

	/**
	 * 페이지 인덱스
	 * <p>* 서브 페이지가 있는 경우, 부모 페이지의 인덱스
	 */
	this.pageOwnerIndex = -1;
	/**
	 * 페이지 인덱스
	 * @private
	 * @type {Number}
	 */
	this.pageIndex = -1;
	/**
	 * 이동 명령 (top=맨 앞으로/up=앞으로/down=뒤로/bottom=맨 뒤로)
	 * @see {@link AbViewerEngine#zIndex} AbViewerEngine.zIndex()
	 * @private
	 * @type {String}
	 */
	this.moveCmd = null;
	/**
	 * 이동 방향 (0=이동없음/1=앞/-1=뒤)
	 * @private
	 * @type {Number}
	 */
	this.direction = 0;

	/**
	 * 변경 전 도형 인덱스 목록
	 * @private
	 * @type {Array.<Number>}
	 */
	this.un = [];
	/**
	 * 변경 후 도형 인덱스 목록
	 * @private
	 * @type {Array.<Number>}
	 */
	this.re = [];
};

//-----------------------------------------------------------

AbHistoryZIndexShapeState.prototype = {
	constructor: AbHistoryZIndexShapeState,
	
	/**
	 * 기록을 시작합니다.
	 * @param {AbViewerEngine} engine 엔진
	 * @param {String} cmd 이동 명령 (top=맨 앞으로/up=앞으로/down=뒤로/bottom=맨 뒤로)
	 * <p>* {@link AbViewerEngine#zIndex|AbViewerEngine.zIndex()}를 참고하세요.
	 */
	begin: function(engine, cmd){
		if (!engine.selectedShapes.length)
			return false;

		this.moveCmd = cmd;
		this.direction = cmd === 'top' || cmd === 'up' ? 1 : -1;
		this.pageIndex = engine.currentPageIndex;
		this.pageOwnerIndex = engine.ownerPageIndex;

		var page = engine.currentPage;

		for (var i=page.shapes.length - 1; i >= 0; i--){
			if (page.shapes[i].selected){
				this.un.unshift(i);
			}
		}
	},

	/**
	 * 기록을 종료합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	end: function(engine){
		if (!engine.selectedShapes.length)
			return false;

		var page = engine.query('page', this.pageIndex, this.pageOwnerIndex);

		for (var i=page.shapes.length - 1; i >= 0; i--){
			if (page.shapes[i].selected){
				this.re.unshift(i);
			}
		}

		if (!this.un.length || !this.re.length || this.un.length != this.re.length)
			return false;

		var mod = false;
		for (var i=0; i < len; i++){
			var un = this.un[i];
			var re = this.re[i];

			if (un != re){
				mod = true;
				break;
			}
		}
		return mod;
	},

	/**
	 * 실행 취소를 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	undo: function(engine){
		var page = engine.query('page', this.pageIndex, this.pageOwnerIndex);

		engine.command('page.select', this.pageIndex, this.pageOwnerIndex);
		var mod = engine.unselect(false);

		var a = [];
		for (var i=this.re.length - 1; i >= 0; i--){
			var idx = this.re[i];

			var r = page.shapes.splice(idx, 1);
			a.unshift(r[0]);
		}

		var len = this.un.length;
		for (var i=0; i < len; i++){
			var idx = this.un[i];

			page.shapes.splice(idx, 0, a[i]);
		}

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	/**
	 * 다시 실행을 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	redo: function(engine){
		var page = engine.query('page', this.pageIndex, this.pageOwnerIndex);

		engine.command('page.select', this.pageIndex, this.pageOwnerIndex);
		var mod = engine.unselect(false);
		
		var a = [];
		for (var i=this.un.length - 1; i >= 0; i--){
			var idx = this.un[i];

			var r = page.shapes.splice(idx, 1);
			a.unshift(r[0]);
		}

		var len = this.re.length;
		for (var i=0; i < len; i++){
			var idx = this.re[i];

			page.shapes.splice(idx, 0, a[i]);
		}

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	/**
	 * 상태 객체를 dispose 합니다.
	 */
	dispose: function(){
		this.un.splice(0, this.un.length);
		this.re.splice(0, this.re.length);
	},
};
