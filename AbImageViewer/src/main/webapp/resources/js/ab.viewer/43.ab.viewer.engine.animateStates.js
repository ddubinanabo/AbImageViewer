/**
 * 엔진 애니메이션 상태 관리자
 * @class
 * @param {Object} options 옵션
 * @param {AbViewerEngine} options.engine 엔진 인스턴스
 */
function AbViewerEngineAnimateStates(options){
	if (!options) options = {};

	/**
	 * 엔진 인스턴스
	 * @type {AbViewerEngine}
	 */
	this.engine = options.engine || this;

	/**
	 * 상태 맵
	 * <p>* 필드명이 구분명, 필드값이 부울형인 객체입니다.
	 * @private
	 * @type {Object.<String, Boolean>}
	 */
	this.$states = {};
	/**
	 * 애니메이션 진행 여부입니다.
	 * @private
	 * @type {Boolean}
	 */
	this.$animated = false;

	/**
	 * $animated 배열
	 * @private
	 * @type {Array.<Boolean>}
	 */
	this.$stack = [];

	// 엔진의 애니메이션 여부
	/**
	 * 엔진의 애니메이션 여부
	 * @type {Boolean}
	 */
	this.$engine = false;

};

AbViewerEngineAnimateStates.prototype = {
	constructor: AbViewerEngineAnimateStates,

	// 엔진 외 기능이 애니메이션 중인지 확인
	/**
	 * 엔진 외 기능이 애니메이션 중인지 확인합니다.
	 * @return {Boolean}
	 */
	animated: function(){
		if (arguments.length)
			return this.$states[arguments[0]];
		return this.$animated;
	},

	/**
	 * 애니메이션 진행을 시작합니다.
	 * @param {String} name 기능명
	 */
	begin: function(name){
		this.$stack.push(this.$animated);
		this.$animated = true;

		this.$states[name] = true;

		this.engine.notifyObservers('animate', name);
	},

	/**
	 * 애니매이션 진행을 종료합니다.
	 * @param {Strign} name 기능명
	 */
	end: function(name){
		if (this.$states[name] === true){
			this.$states[name] = false;

			var val = this.$stack.pop();
			this.$animated = val;

			this.engine.notifyObservers('animated', name);
		}
	},

};