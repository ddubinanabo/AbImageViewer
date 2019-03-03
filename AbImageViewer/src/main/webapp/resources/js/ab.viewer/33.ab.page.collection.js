/**
 * 페이지 컬렉션
 * @class
 */
function AbPageCollection(){
	/**
	 * 페이지 배열
	 * @private
	 * @type {Array.<AbPage>}
	 */
	this.source = [];
	/**
	 * 페이지 맵
	 * <p>필드명이 페이지 UUID, 필드값이 페이지 {@link AbPage}인 객체입니다.
	 * @private
	 * @type {Object.<String, AbPage>}
	 */
	this.map = {};
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbPageCollection.prototype = {
	constructor: AbPageCollection,

	//-----------------------------------------------------------

	/**
	 * 페이지 목록을 비웁니다.
	 * @param {Boolean} [disposing] Dipose 여부
	 */
	clear: function(disposing){
		if (disposing === true){
			for (var i = this.source.length - 1; i>=0; i--){
				var page = this.source[i];
				if (AbCommon.isFunction(page.dispose))
					page.dispose();
			}
		}

		for (var p in this.map)
			delete this.map[p];
		
		this.source.splice (0, this.source.length);
	},

	//-----------------------------------------------------------

	/**
	 * 페이지 개수를 가져옵니다.
	 * @return {Number}
	 */
	length: function() { return this.source.length; },

	//-----------------------------------------------------------

	/**
	 * 페이지 전체의 도형 개수와 도형이 있는 페이지의 개수 정보
	 * @typedef {Object} NumShapesResult
	 * @property {Number} shapes 전체 페이지의 도형 개수
	 * @property {Number} pages 도형이 있는 페이지 개수
	 */

	/**
	 * 페이지 전체의 도형 개수와 도형이 있는 페이지의 개수를 가져옵니다.
	 * @return {NumShapesResult} 페이지 전체의 도형 개수와 도형이 있는 페이지의 개수 정보
	 */
	numShapes: function(){
		var info = {
			shapes: 0,
			pages: 0,
		};

		var nums = 0;

		for (var i = this.source.length - 1; i >= 0; i--){
			nums = this.source[i].shapes.length;

			if (nums > 0){
				info.shapes += nums;
				info.pages ++;
			}
		}
		return info;
	},

	//-----------------------------------------------------------

	/**
	 * 페이지 인덱스 위치의 페이지를 변경합니다.
	 * @param {Number} index 페이지 인덱스
	 * @param {AbPage} value 페이지 인스턴스
	 */
	set: function (index, value) { this.source[index] = value; },
	/**
	 * 페이지를 가져옵니다.
	 * @param {(String|Number)} index 페이지 UUID 또는 페이지 인덱스
	 * @return {AbPage}
	 */
	get: function (index) {
		if (AbCommon.isString(index)) index = parseInt(index);
		return this.source[index];
	},

	/**
	 * 페이지를 가져옵니다.
	 * @param {String} uid 페이지 UUID
	 * @return {AbPage}
	 */
	getById: function (uid){
		return this.map[uid];
	},

	//-----------------------------------------------------------

	/**
	 * 새 페이지 UUID를 생성합니다.
	 * @return {String} UUID
	 */
	uuid: function(){
		var uid = AbCommon.uuid();
		while (this.map[uid])
			uid = AbCommon.uuid();
		return uid;
	},

	//-----------------------------------------------------------

	/**
	 * 페이지 인덱스를 가져옵니다.
	 * @param {(String|AbPage)} item 페이지 UUID 또는 페이지 인스턴스
	 * @return {Number} 페이지 인덱스
	 */
	indexOf: function (){
		if (!arguments.length)
			return -1;

		var arg0 = arguments[0];
		var siz = this.source.length;

		if (AbCommon.isString(arg0)){
			for (var i=0; i < siz; i++){
				if (this.source[i].uid == arg0)
					return i;
			}					
		}else{
			for (var i=0; i < siz; i++){
				if (this.source[i] == arg0)
					return i;
			}					
		}
		return -1;
	},

	/**
	 * 페이지를 삭제합니다.
	 * @param {...Number} index 페이지 인덱스...페이지 인덱스
	 */
	remove: function (){
		var siz = arguments.length;
		for (var i=0; i < siz; i++){
			var page = this.source.splice(arguments[i], 1);
			delete this.map[page.uid];
		}
	},

	/**
	 * 페이지를 삭제합니다.
	 * @param {...String} uid 페이지 UUID...페이지 UUID
	 */
	removeById: function (uid){
		var siz = arguments.length;
		for (var i=0; i < siz; i++){
			var page = this.map[arguments[0]];
			var idx = this.indexOf(page);
			this.source.splice(idx, 1);
			delete this.map[page.uid];
		}
	},

	//-----------------------------------------------------------

	/**
	 * 목록의 끝에 하나 이상의 페이지를 추가합니다.
	 * @see {@link https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/push} MDN 자료 참고
	 * @param {...AbPage} page 페이지 인스턴스...페이지 인스턴스
	 */
	push: function (){
		var siz = arguments.length;
		for (var i=0; i < siz; i++){
			var page = arguments[i];
			this.source.push(page);
			this.map[page.uid] = page;
		}
	},

	/**
	 * 목록에서 마지막 페이지를 제거하고 그 페이지를 반환합니다.
	 * @see {@link https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/pop} MDN 자료 참고
	 * @return {AbPage} 마지막 페이지
	 */
	pop: function(){
		var page = this.source.pop();
		if (page)
			delete this.map[page.uid];
		return page;
	},

	/**
	 * 페이지 목록에 있는 페이지들을 제거하고, 목록에 새 페이지들을 추가합니다.
	 * @see {@link https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/splice} MDN 자료 참고
	 * @param {Number} start 배열의 변경을 시작하는 인덱스입니다(초기 index : 0).
	 * 만약 배열 길이보다 길면 실제 시작 인덱스는 배열의 길이로 설정됩니다.
	 * 음수의 경우, 배열의 끝에서 부터 페이지를 세어나가며 (초기 index : 1),
	 * 그 값의 절대값이 배열의 길이 보다 큰 경우 0으로 설정됩니다.
	 * @param {Number} [deleteCount] 목록에서 삭제할 페이지 수입니다.
	 * 만약 deleteCount가 0의 경우, 아무런 페이지도 제거되지 않습니다.
	 * 이 경우, 최소한 하나의 새 페이지를 특정해 주어야 합니다.
	 * 만약, deleteCount가 start 부터 남은 페이지 수 보다 많을 경우, 남은 페이지를 모두 제거합니다.
	 * @param {...AbPage} [page] 배열에 추가될 페이지입니다.
	 * 만약 아무런 페이지도 특정되지 않을 경우, splice()는 페이지를 오직 삭제만 할 것입니다
	 */
	splice: function (){
		var r = Array.prototype.splice.apply(this.source, arguments);
		var siz = r.length;

		for (var i=0; i < siz; i++)
			delete this.map[r[i].uid];

		if (arguments.length > 2){
			siz = arguments.length;
			for (var i=2; i < siz; i++){
				var page = arguments[i];
				this.map[page.uid] = page;
			}
		}
	},

	/**
	 * begin부터 end까지(end는 불포함)에 대한 shallow copy를 새로운 배열 객체로 반환합니다. 원본 배열은 수정되지 않습니다.
	 * @see {@link https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/slice} MDN 자료 참고
	 * @param {Number} [begin] 0을 시작으로 하는 추출 시작점에 대한 인덱스를 의미합니다.
	 * 음수 인덱스는 배열의 끝에서부터의 길이를 나타냅니다.
	 * slice(-2) 는 배열에서 마지막 두 개의 엘리먼트를 추출합니다.
	 * begin 이 undefined인 경우에는, 0번 인덱스부터 slice 합니다.
	 * @param {Number} [end] 추출을 종료 할 0 기준 인덱스입니다.
	 * slice 는 end 인덱스를 제외하고 추출합니다.
	 * 예를들어, slice(1,4)는 두번째 요소부터 네번째 요소까지 (1, 2 및 3을 인덱스로 하는 요소) 추출합니다.
	 * 음수 인덱스는 배열의 끝에서부터의 길이를 나타냅니다. 예를들어 slice(2,-1) 는 세번째부터 끝에서 두번째 요소까지 추출합니다.
	 * end가 생략되면 slice는 배열의 끝까지(arr.length) 추출합니다.
	 * 만약 end값이 배열의 길이보다 크다면, silce는 배열의 끝까지(arr.length) 추출합니다.
	 * @return {Array.<AbPage>} 추출 된 페이지 목록
	 */
	slice: function (){
		return Array.prototype.slice.apply(this.source, arguments);
	},

	/**
	 * 배열에서 첫 번째 페이지를 제거하고, 제거된 페이지를 반환합니다.
	 * @see {@link https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/shift} MDN 자료 참고
	 * @return {AbPage} 배열에서 제거된 요소를 반환합니다. 빈 배열의 경우 undefined 를 반환합니다.
	 */
	shift: function(){
		var page = Array.prototype.shift.apply(this.source, arguments);
		if (page)
			delete this.map[page.uid];
		return page;
	},

	/**
	 * 새로운 페이지를 배열의 맨 앞쪽에 추가합니다.
	 * @param {...AbPage} page 배열 맨 앞에 추가할 요소들.
	 */
	unshift: function(){
		Array.prototype.unshift.apply(this.source, arguments);

		var siz = arguments.length;
		for (var i=0; i < siz; i++){
			var page = arguments[i];
			this.map[page.uid] = page;
		}
	},
};