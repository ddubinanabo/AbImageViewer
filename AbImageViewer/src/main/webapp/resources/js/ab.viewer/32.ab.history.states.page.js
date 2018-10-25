/**
 * 페이지 추가 History 상태
 * <p>* 추가 전/후의 정보를 담습니다.
 * @class
 */
function AbHistoryAddPageState(){
	/**
	 * 실행 구분
	 * @type {String}
	 * @default
	 */
	this.type = 'page';
	/**
	 * 실행 명령
	 * @type {String}
	 * @default
	 */
	this.cmd = 'add';

	/**
	 * 페이지 인덱스
	 * @private
	 * @type {Number}
	 */
	this.pageIndex = -1;
	/**
	 * 페이지 목록
	 * @private
	 * @type {Array.<AbPage>}
	 */
	this.pages = [];
	/**
	 * 페이지 목록 인덱스
	 * @private
	 * @type {Number}
	 */
	this.start = 0;
};
	
//-----------------------------------------------------------

AbHistoryAddPageState.prototype = {
	constructor: AbHistoryAddPageState,
	
	/**
	 * 기록을 시작합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	begin: function(engine){
		this.pageIndex = engine.currentPageIndex;
		this.start = engine.pages.length();
	},

	/**
	 * 기록을 종료합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	end: function(engine){
		var pages = null;
		if (this.start >= 0)
			pages = engine.pages.slice(this.start);
		else
			pages = engine.pages.slice();

		if (!pages.length)
			return false;

		this.pages = AbCommon.indexArrayOf(engine.pages.source, pages, true);
	},

	/**
	 * 실행 취소를 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	undo: function(engine){
		if (!this.pages.length) return;

		var cindex = -1;
		var ocindex = cindex;

		var len = this.pages.length;
		if (len){
			for (var i=len - 1; i >= 0; i--){
				var d = this.pages[i];

				cindex = d.index;

				engine.pages.splice(d.index, 1);
			}

			if (cindex >= engine.pages.length())
				cindex = engine.pages.length() - 1;

			engine.historySync('page', 'add', 'undo', this.pages, function (){
				if (cindex >= 0){
					engine.selectPage(cindex, true);
				}else{
					engine.selectPage(engine.pages.length() - 1, true);
				}
			}.bind(this));

			if (engine.pages.length() == 0)
				engine.render();
		}
	},

	/**
	 * 다시 실행을 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	redo: function(engine){
		if (!this.pages.length) return;

		var len = this.pages.length;
		for (var i=0; i < len; i++){
			var d = this.pages[i];

			engine.pages.splice(d.index, 0, d.source);
		}

		if (len){
			engine.historySync('page', 'add', 'redo', this.pages, function(){
				engine.selectPage(this.pages[len-1].index, true);
			}.bind(this));
		}

		if (len > 0 || mod)
			engine.render();
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
 * 사용자 정의 복제 함수
 * @callback AbHistoryUpdatePageState.Setter
 * @param {Object} c 변경 전 필드의 복제 객체
 * @param {Object} o 변경 후 필드의 복제 객체
 * @param {Object} ctoken 변경 전 토큰 (사용자 정의 정보)
 * @param {Object} otoken 변경 후 토큰 (사용자 정의 정보)
 */

/**
 * 페이지 변경 History 상태
 * <p>* 변경 전/후의 정보를 담습니다.
 * @class
 */
function AbHistoryUpdatePageState(){
	/**
	 * 실행 구분
	 * @type {String}
	 * @default
	 */
	this.type = 'page';
	/**
	 * 실행 명령
	 * @type {String}
	 * @default
	 */
	this.cmd = 'update';

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
	 * 변경 전 필드의 복제 객체
	 * @private
	 * @type {Object}
	 */
	this.un = null;
	/**
	 * 변경 전 토큰 (사용자 정의 정보)
	 * @private
	 * @type {Object}
	 */
	this.unToken = null;
	/**
	 * 변경 후 필드의 복제 객체
	 * @private
	 * @type {Object}
	 */
	this.re = null;
	/**
	 * 변경 후 토큰 (사용자 정의 정보)
	 * @private
	 * @type {Object}
	 */
	this.reToken = null;

	/**
	 * 사용자 정의 객체 복제 함수
	 * @private
	 * @type {AbHistoryUpdatePageState.Setter}
	 */
	this.setter = null;
};

//-----------------------------------------------------------

AbHistoryUpdatePageState.prototype = {
	constructor: AbHistoryUpdatePageState,
	
	/**
	 * 기록을 시작합니다.
	 * @param {AbViewerEngine} engine 엔진
	 * @param {Array.<String>} props 체크할 필드 목록
	 * @param {AbHistoryUpdatePageState.Setter} [setter] 사용자 정의 객체 복제 함수
	 * @param {Object} [token] 사용자 정의 정보
	 */
	begin: function(engine, props, setter, token){
		this.props = props;
		this.setter = setter;

		this.pageIndex = engine.currentPageIndex;

		this.un = AbCommon.copyProp(engine.currentPage, {}, this.props);
		this.unToken = token;
	},

	/**
	 * 기록을 종료합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	end: function(engine, token){
		var page = engine.pages.get(this.pageIndex);

		this.re = AbCommon.copyProp(page, {}, this.props);
		this.reToken = token;

		return !AbCommon.equals(this.un, this.re);
	},

	/**
	 * 실행 취소를 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	undo: function(engine){
		var page = engine.pages.get(this.pageIndex);

		engine.selectPage(this.pageIndex);

		if (AbCommon.isFunction(this.setter)) this.setter.call(engine, this.un, this.re, this.unToken, this.reToken);
		else{
			$.extend(page, this.un, true);
			engine.render();
		}

		engine.historySync('page', 'update', 'undo', this.pageIndex);

		// Notify modified
		engine.modified();
	},

	/**
	 * 다시 실행을 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	redo: function(engine){
		var page = engine.pages.get(this.pageIndex);

		engine.selectPage(this.pageIndex);

		if (AbCommon.isFunction(this.setter)) this.setter.call(engine, this.re, this.un, this.reToken, this.unToken);
		else {
			$.extend(page, this.re, true);
			engine.render();
		}

		engine.historySync('page', 'update', 'redo', this.pageIndex);

		// Notify modified
		engine.modified();
	},

	/**
	 * 상태 객체를 dispose 합니다.
	 */
	dispose: function(){
		if (this.props) this.props.splice(0, this.props.length);
		this.un = null;
		this.re = null;
		this.setter = null;
	},
};


//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

/**
 * 페이지 인덱스 배열
 * @typedef {Object} AbHistoryRemovePageState.PageIndexInfo
 * @property {Number} index 페이지 인덱스
 * @property {AbPage} source 페이지 객체
 */

/**
 * 페이지 삭제 History 상태
 * <p>* 삭제 전/후의 정보를 담습니다.
 * @class
 */
function AbHistoryRemovePageState(){
	/**
	 * 실행 구분
	 * @type {String}
	 * @default
	 */
	this.type = 'page';
	/**
	 * 실행 명령
	 * @type {String}
	 * @default
	 */
	this.cmd = 'remove';

	/**
	 * 페이지 인덱스
	 * @private
	 * @type {Number}
	 */
	this.pageIndex = -1;
	/**
	 * 페이지 목록
	 * @private
	 * @type {Array.<AbHistoryRemovePageState.PageIndexInfo>}
	 */
	this.pages = [];
};
	
//-----------------------------------------------------------

AbHistoryRemovePageState.prototype = {
	constructor: AbHistoryRemovePageState,
	
	/**
	 * 기록을 시작합니다.
	 * @param {AbViewerEngine} engine 엔진
	 * @param {Array.<Number>} pages 페이지 인덱스 배열
	 */
	begin: function(engine, pages){
		this.pageIndex = engine.currentPageIndex;

		if (!pages) pages = [engine.currentPageIndex];

		if (!pages.length)
			return false;

		var siz = pages.length;
		for (var i=0; i < siz; i++){
			this.pages.push({
				index: pages[i],
				source: engine.pages.get(pages[i]),
			});
		}
	},

	/**
	 * 기록을 종료합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	end: function(engine){
		if (!this.pages.length)
			return false;
	},

	/**
	 * 실행 취소를 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	undo: function(engine){
		if (!this.pages.length) return;

		var len = this.pages.length;
		if (len > 0){
			for (var i=0; i < len; i++){
				var d = this.pages[i];
	
				engine.pages.splice(d.index, 0, d.source);
				engine.pageInserted(d.index);
			}
	
			engine.historySync('page', 'remove', 'undo', this.pages, function(){
				engine.selectPage(this.pages[len-1].index, true);
			}.bind(this));
		}
	},

	/**
	 * 다시 실행을 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	redo: function(engine){
		if (!this.pages.length) return;

		var cindex = engine.currentPageIndex;
		var ocindex = cindex;
		
		var len = this.pages.length;
		if (len){
			for (var i=len - 1; i >= 0; i--){
				var d = this.pages[i];
	
				engine.pages.splice(d.index, 1);
				engine.pageRemoved(d.index);
			}
				
			if (cindex >= engine.pages.length())
				cindex = engine.pages.length() - 1;
			
			engine.historySync('page', 'remove', 'redo', this.pages, function (){
				if (cindex >= 0){
					engine.selectPage(cindex, true);
				}else{
					engine.selectPage(engine.pages.length() - 1, true);
				}
			}.bind(this));

			if (engine.pages.length() == 0)
				engine.render();
		}
	},

	/**
	 * 상태 객체를 dispose 합니다.
	 */
	dispose: function(){
		this.pages.splice(0, this.pages.length);
	},
};

