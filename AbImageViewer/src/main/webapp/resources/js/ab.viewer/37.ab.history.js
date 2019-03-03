
//----------------------------------------------------------------------------------------------------------
// Notify Sync
//----------------------------------------------------------------------------------------------------------

/**
 * History Sync Arguments
 * @typedef {(AbHistoryAddPageState.HistorySyncArgs|AbHistoryUpdatePageState.HistorySyncArgs|AbHistoryRemovePageState.HistorySyncArgs)}
 * AbHistory.HistorySyncArgs
 */

/**
 * AbHistoryAddPageState History Sync Arguments
 * <p>* AbPage 배열
 * @typedef {Array.<AbPage>} AbHistoryAddPageState.HistorySyncArgs
 */

/**
 * AbHistoryUpdatePageState History Sync Arguments
 * <p>* 페이지 인덱스
 * @typedef {Number} AbHistoryUpdatePageState.HistorySyncArgs
 */

/**
 * AbHistoryRemovePageState History Sync Arguments
 * <p>* 페이지 인덱스
 * @typedef {Array.<AbHistoryRemovePageState.PageIndexInfo>} AbHistoryRemovePageState.HistorySyncArgs
 */

//----------------------------------------------------------------------------------------------------------
// Notify 상태 겍체 정의
//----------------------------------------------------------------------------------------------------------

/**
 * History 상태 객체는 수정 전/후 정보를 담고 있는 객체로, 다음 필드/메서드들이 정의된 객체를 말합니다.
 * <table>
 * <thead>
 * <tr>
 * 	<th>필드/메서드</th><th>비고</th>
 * </tr>
 * </thead>
 * <tbody>
 * <tr><td>type</td><td></td></tr>
 * <tr><td>cmd</td><td></td></tr>
 * <tr><td>begin()</td><td></td></tr>
 * <tr><td>end()</td><td></td></tr>
 * <tr><td>undo()</td><td></td></tr>
 * <tr><td>redo()</td><td></td></tr>
 * <tr><td>dispose()</td><td></td></tr>
 * </tbody>
 * </table>
 * @typedef {(AbHistoryAddPageState|AbHistoryAddShapeState|AbHistoryRemoveAllShapeState|AbHistoryRemovePageState|AbHistoryRemoveRangeShapeState|AbHistoryRemoveShapeState|AbHistoryUpdatePageState|AbHistoryUpdateShapeState|AbHistoryZIndexShapeState)} AbHistoryState
 * @property {String} type 실행 구분 예) shape, page
 * @property {String} cmd 실행 명령, 예) add, update, remove, all, range, zindex
 * @property {Function} begin() 기록을 시작합니다.
 * @property {Function} end() 기록을 종료합니다.
 * @property {Function} undo() 실행 취소를 수행합니다.
 * @property {Function} redo() 다시 실행을 수행합니다.
 * @property {Function} dispose() 상태 객체를 dispose 합니다.
 */

/**
 * 상태 정보 테이블
 * @typedef {Object} AbHistory.AbHistoryStateTable
 * @property {Object} shape 도형 상태 테이블
 * @property {Object} shape.add {@link AbHistoryAddShapeState} 인스턴스: 도형 추가 History 상태
 * @property {Object} shape.update {@link AbHistoryUpdateShapeState} 인스턴스: 도형 변경 History 상태
 * @property {Object} shape.remove {@link AbHistoryRemoveShapeState} 인스턴스: 도형 삭제 History 상태
 * @property {Object} shape.all {@link AbHistoryRemoveAllShapeState} 인스턴스: 전체 페이지의 도형 삭제 History 상태
 * @property {Object} shape.range {@link AbHistoryRemoveRangeShapeState} 인스턴스: 페이지 범위의 도형 삭제 History 상태
 * @property {Object} shape.zindex {@link AbHistoryZIndexShapeState} 인스턴스: 도형 앞뒤 변경 History 상태
 * @property {Object} page 페이지 상태 테이블
 * @property {Object} page.add {@link AbHistoryAddPageState} 인스턴스: 페이지 추가 History 상태
 * @property {Object} page.update {@link AbHistoryUpdatePageState} 인스턴스: 페이지 변경 History 상태
 * @property {Object} page.remove {@link AbHistoryRemovePageState} 인스턴스: 페이지 삭제 History 상태
 */

//----------------------------------------------------------------------------------------------------------
// Notify 관리자
//----------------------------------------------------------------------------------------------------------

/**
 * History 관리자
 * <p>* History 관리자는 도형/페이지 등에 변경이 일어날 경우 HistoryState 객체에 정보를 담아 관리합니다.
 * 관리되는 정보는 이후 실행 취소/다시 실행 등을 구현하는 데 사용됩니다.
 * @class
 * @param {Object} [options] 옵션
 * @param {Number} [options.queueSize=100] Queue 크기
 */
function AbHistory(options){
	if (!options) options = {};

	/**
	 * History Queue
	 * @private2
	 * @type {Array.<AbHistoryState>}
	 */
	this.queue = [];
	/**
	 * History Queue Size
	 * @private
	 * @type {Number}
	 */
	this.queueSize = options.queueSize || 100;
	/**
	 * History Index
	 * @private
	 * @type {Number}
	 */
	this.index = -1;

	/**
	 * 임시 AbHistoryState 객체
	 * <p>* 기록 시작 시 할당되며, 기록이 끝나면 History Queue에 등록됩니다.
	 * @private
	 * @type {AbHistoryState}
	 */
	this.temp = null;
	/**
	 * 기록 잠금 여부입니다. true면 기록을 하지 않습니다.
	 * @type {Boolean}
	 */
	this.locked = false;
	/**
	 * @private
	 */
	this.enabled = true;
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbHistory.prototype = {
	constructor: AbHistory,

	//-----------------------------------------------------------

	/**
	 * 상태 정보 테이블
	 * <p>* 이 테이블의 객체를 복제하여 관리합니다.
	 * @const
	 * @type {AbHistory.AbHistoryStateTable}
	 */
	STATES_TABLE: {
		shape: {
			add: new AbHistoryAddShapeState(),
			update: new AbHistoryUpdateShapeState(),
			remove: new AbHistoryRemoveShapeState(),

			all: new AbHistoryRemoveAllShapeState(),
			range: new AbHistoryRemoveRangeShapeState(),

			zindex: new AbHistoryZIndexShapeState(),
		},

		page: {
			add: new AbHistoryAddPageState(),
			update: new AbHistoryUpdatePageState(),
			remove: new AbHistoryRemovePageState(),
		},
	},

	//-----------------------------------------------------------

	/**
	 * 실행 구분, 실행 명령으로 {@link AbHistoryState} 인스턴스를 가져옵니다.
	 * @param {String} type 실행 구분
	 * @param {String} cmd 실행 명령
	 * @return {AbHistoryState}
	 */
	get: function(type, cmd){
		var table = AbHistory.prototype.STATES_TABLE[type];
		if (table) return table[cmd];
		return null;
	},

	//-----------------------------------------------------------

	/**
	 * 기록을 하지 않도록 잠급니다.
	 */
	lock: function(){ this.locked = true; },
	/**
	 * 기록을 하도록 잠금해제합니다.
	 */
	unlock: function(){ this.locked = false; },

	//-----------------------------------------------------------

	/**
	 * 실행 취소를 수행할 수 있는 지 확인합니다.
	 * @return {Boolean} 수행 가능하면 true
	 */
	canUndo: function () {
		var can = this.queue.length && this.index > -1;
		if (arguments.length){
			var type = arguments[0];
			return can && this.queue[this.index].type == type;
		}
		return can;
	},
	
	/**
	 * 다시 실행을 수행할 수 있는 지 확인합니다.
	 * @return {Boolean} 수행 가능하면 true
	 */
	canRedo: function () {
		var can = this.queue.length && this.index+1 < this.queue.length;
		if (arguments.length){
			var type = arguments[0];
			return can && this.queue[this.index].type == type;
		}
		return can;
	},

	//-----------------------------------------------------------
	
	/**
	 * 기록을 시작합니다.
	 * @private
	 * @param {AbHistoryState} state 수행 AbHistoryState 인스턴스
	 * @param {...*} AbHistoryState 인스턴스의 begin() 메서드에 전달된 인자
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>type</th><th>cmd</th><th>참고</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>shape</td><td>add</td><td>{@link AbHistoryAddShapeState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>shape</td><td>update</td><td>{@link AbHistoryUpdateShapeState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>shape</td><td>remove</td><td>{@link AbHistoryRemoveShapeState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>shape</td><td>all</td><td>{@link AbHistoryRemoveAllShapeState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>shape</td><td>range</td><td>{@link AbHistoryRemoveRangeShapeState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>shape</td><td>zindex</td><td>{@link AbHistoryZIndexShapeState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>page</td><td>add</td><td>{@link AbHistoryAddPageState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>page</td><td>update</td><td>{@link AbHistoryUpdatePageState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>page</td><td>remove</td><td>{@link AbHistoryRemovePageState#begin}</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 */
	beginState: function(state){
		if (this.locked) return;

		if (AbCommon.isHistoryState(state)){
			this.temp = AbCommon.clone(state);

			var a = AbCommon.copyArray(arguments, 1);
			this.temp.begin.apply(this.temp, a);
		}
	},

	/**
	 * 기록을 시작합니다.
	 * @param {String} type 실행 구분
	 * @param {String} cmd 실행 명령
	 * @param {...*} AbHistoryState 인스턴스의 begin() 메서드에 전달된 인자
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>type</th><th>cmd</th><th>참고</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>shape</td><td>add</td><td>{@link AbHistoryAddShapeState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>shape</td><td>update</td><td>{@link AbHistoryUpdateShapeState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>shape</td><td>remove</td><td>{@link AbHistoryRemoveShapeState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>shape</td><td>all</td><td>{@link AbHistoryRemoveAllShapeState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>shape</td><td>range</td><td>{@link AbHistoryRemoveRangeShapeState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>shape</td><td>zindex</td><td>{@link AbHistoryZIndexShapeState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>page</td><td>add</td><td>{@link AbHistoryAddPageState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>page</td><td>update</td><td>{@link AbHistoryUpdatePageState#begin}</td>
	 * </tr>
	 * <tr>
	 * 	<td>page</td><td>remove</td><td>{@link AbHistoryRemovePageState#begin}</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 */
	begin: function(){
		if (this.locked) return;
		
		this.cancel();

		if (arguments.length >= 2 && AbCommon.isString(arguments[0]) && AbCommon.isString(arguments[1])){
			var states = this.get(arguments[0], arguments[1]);
			if (states){
				var a = AbCommon.copyArray(arguments, 2);
				a.splice(0, 0, states);
				this.beginState.apply(this, a);
			}
		}else{
			return this.beginState.apply(this, arguments);
		}
	},

	/**
	 * 기록을 종료합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	end: function(){
		if (this.temp != null){
			if (this.temp.end.apply(this.temp, arguments) === false){
				this.cancel();
				return;
			}

			//-----------------------------------------------------------

			this.releasePost(this.index);

			if (this.queue.length >= this.queueSize){
				this.queue[0].dispose();
				this.queue.splice(0, 1);
			}

			//-----------------------------------------------------------

			this.queue.push(this.temp);
			this.temp = null;

			this.index = this.queue.length - 1;

			//console.log('[HISTORY][ADD]');
			//console.log(this.queue[this.index]);

			this.logAllTree();
		}
	},

	/**
	 * 기록을 취소합니다.
	 */
	cancel: function(){
		if (this.temp != null){
			this.temp.dispose();
			this.temp = null;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 로그 기록 여부
	 * @const
	 * @type {Boolean}
	 * @default
	 */
	ENABLE_LOG: false,

	/**
	 * 전체 로그를 기록합니다.
	 * @private
	 */
	logAllTree: function(){
		if (!this.ENABLE_LOG) return;

		var s = '[HISTORY]';
		for (var i=0; i < this.queue.length; i++){
			var q = this.queue[i];
			s += '[' + q.type + '::'+q.cmd+']';
		}
		console.log(s);
	},

	/**
	 * 현재 위치까지의 로그를 기록합니다.
	 * @private
	 */
	logTree: function(){
		if (!this.ENABLE_LOG) return;

		var s = '\t[DO][' + this.index + ']';
		for (var i=0; i <= this.index; i++){
			var q = this.queue[i];
			s += '[' + q.type + '::'+q.cmd+']';
		}
		console.log(s);
	},

	//-----------------------------------------------------------

	/**
	 * 실행 취소를 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	undo: function(engine){
		if (this.canUndo()){
			engine.history.lock();

			var q = this.queue[this.index];
			q.undo.apply(q, arguments);
			this.index--;

			engine.history.unlock();

			this.logTree();
		}
	},

	/**
	 * 다시 실행을 수행합니다.
	 * @param {AbViewerEngine} engine 엔진
	 */
	redo: function(engine){
		if (this.canRedo()){
			engine.history.lock();

			if (this.index < 0 && this.queue.length) this.index = 0;
			else this.index++;

			var q = this.queue[this.index];
			q.redo.apply(q, arguments);

			engine.history.unlock();

			this.logTree();
		}
	},

	//-----------------------------------------------------------

	/**
	 * History Queue를 비웁니다.
	 */
	clear: function(){
		this.queue.splice(0, this.queue.length);
		this.index = -1;
	},

	//-----------------------------------------------------------

	/**
	 * 현재 위치 이후의 기록을 제거합니다.
	 * <p>AbHistoryState 인스턴스의 dispose()가 실행됩니다.
	 */
	releasePost: function(start){
		if (!this.queue.length) return;

		var len = this.queue.length, cnt=0;
		for (var i=start + 1; i < len; i++){
			var q = this.queue[i];
			q.dispose();
			cnt++;
		}

		this.queue.splice(start + 1, cnt);
	},
};
