/**
 * 엔진 옵저버 리슨 함수
 * @callback AbViewerEngineObservers.ObserveListenFunction
 * @param {AbViewerEngine} sendor Notify한 객체
 * @param {String} value 값
 */

 /**
 * 엔진 옵저버 리슨 객체
 * @typedef AbViewerEngineObservers.ObserveListenObject
 * @property {AbViewerEngineObservers.ObserveListenFunction} engineNotify 리스너 메서드
 */

/**
 * 엔진 옵저버 리스너
 * @typedef {(AbViewerEngineObservers.ObserveListenFunction|AbViewerEngineObservers.ObserveListenObject)}
 * AbViewerEngineObservers.ObserveListener
 */

/**
 * 엔진 옵저버 Notify 콜백 함수
 * @callback AbViewerEngineObservers.NotifyCallback
 * @param {Boolean} notified Notify 여부, false면 대상 리스너가 없어 notify 하지 못한 것입니다.
 */

/**
 * 엔진 옵저버 리스너 롼리자
 * @class
 * @param {Object} options 옵션
 * @param {AbViewerEngine} options.engine 엔진 인스턴스
 */
function AbViewerEngineObservers(options){
	if (!options) options = {};

	this.engine = options.engine || null;

	/**
	 * 토픽별 옵저버 리스너 맵
	 * <p>* 필드명이 토픽, 필드값이 {@link AbViewerEngineObservers.ObserveListener|배열}인 객체입니다.
	 * @type {Object.<String, Array.<AbViewerEngineObservers.ObserveListener>>}
	 */
	this.listeners = {};
	/**
	 * 전체 옵저버 리스너 목록
	 * <p>* 모든 토픽에 대한 옵저브
	 * @type {Array.<AbViewerEngineObservers.ObserveListener>}
	 */
	this.all = [];
}

AbViewerEngineObservers.prototype = {
	constructor: AbViewerEngineObservers,

	/**
	 * 옵저버 리스너를 등록합니다.
	 * <p>* 토픽이 all이면 모든 토픽에 대해 옵저브합니다.
	 * @param {String} name 토픽
	 * @param {AbViewerEngineObservers.ObserveListener} listener 등록할 리스너
	 */
	add: function(name, listener){
		if (!(AbCommon.isFunction(listener) || (listener && AbCommon.isFunction(listener.engineNotify))))
			return;

		if (name && name != 'all'){
			if (this.listeners[name])
				this.listeners[name].push(listener);
			else
				this.listeners[name] = [listener];
		}else{
			this.all.push(listener);
		}
	},

	/**
	 * 옵저버 리스너를 제거합니다.
	 * @param {String} name 토픽
	 * @param {AbViewerEngineObservers.ObserveListener} listener 제거할 리스너
	 */
	remove: function(name, listener){
		if (!(AbCommon.isFunction(listener) || (listener && AbCommon.isFunction(listener.engineNotify))))
			return;

		var a = null;
		if (name && name != 'all'){
			if (this.listeners[name])
				a = this.listeners[name];
		}else{
			a = this.all;
		}

		if (!a) return;
		
		var len = a.length;
		for (var i= a.length - 1; i >= 0; i--){
			if (a[i] == listener){
				a.splice(i, 1);
				return;
			}
		}
	},

	/**
	 * 토픽의 옵저버 리스너들을 제거합니다.
	 * @param {String} name 토픽
	 */
	clear: function (name){
		if (this.listeners[name])
			this.listeners[name].splice(0, this.listeners[name].length);
	},

	/**
	 * 모든 옵저버 리스너들을 제거합니다.
	 */
	reset: function(){
		for (var p in this.listeners){
			this.listeners[p].splice(0, this.listeners[p].length);
			delete this.listeners[p];
		}

		this.all.splice(0, this.all.length);
	},

	/**
	 * 옵저버 리스너에 Notify합니다.
	 * @param {String} topic 토픽
	 * @param {*} value 전달할 데이터
	 * @param {AbViewerEngineObservers.NotifyCallback} callback Notify 후 호출되는 콜백 함수
	 */
	notify: function(topic, value, callback){
		if (this.listeners[topic] || this.all.length){
			setTimeout(function(){
				var a = this.listeners[topic];
				if (this.all.length){
					if (a){
						var b = [];
						Array.prototype.push.apply(b, a);
						Array.prototype.push.apply(b, this.all);
						a = b;
					}else if (this.all.length)
						a = this.all;
				}

				var len = a ? a.length : 0;
				for (var i=0; i < len; i++){
					if (AbCommon.isFunction(a[i]))
						a[i](this.engine, value);
					else
						a[i].engineNotify(this.engine, topic, value);
				}

				if (AbCommon.isFunction(callback)) callback(true);
			}.bind(this), 0);
		}else{
			if (AbCommon.isFunction(callback)) callback(false);
		}
	},
};