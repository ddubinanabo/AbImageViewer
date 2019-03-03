
//----------------------------------------------------------------------------------------------------------
// Notify Arguments 정의
//----------------------------------------------------------------------------------------------------------



//----------------------------------------------------------------------------------------------------------
// 기타
//----------------------------------------------------------------------------------------------------------

/**
 * 토픽 콜백
 * @callback AbToolbar.TopicCallback
 * @param {String} topic 토픽명
 * @param {(String|Number|Boolean)} value 값
 */

/**
 * 툴바 그룹 옵저브 리스너
 * @callback AbToolbar.GroupObserveListenFunction
 * @param {AbToolbar} sendor Notify한 객체
 * @param {String} group 그룹명
 * @param {String} value 값
 */

 /**
 * 툴바 그룹 옵저버 리스너 객체
 * @typedef AbToolbar.GroupObserveListenObject
 * @property {AbToolbar.GroupObserveListenFunction} toolbarGroupNotify 리스너 메서드
 */

/**
 * 툴바 그룹 옵저브 리스너
 * @typedef {(AbToolbar.GroupObserveListenFunction|AbToolbar.GroupObserveListenObject)}
 * AbToolbar.GroupObserveListener 
 */

/**
 * 툴바 옵저버 리스너
 * @callback AbToolbar.ObserveListenFunction
 * @param {AbToolbar} sendor Notify한 객체
 * @param {String} topic 토픽
 * @param {String} value 값
 * @param {jQueryObject} [element] 툴바 엘리먼트 jQuery 객체
 */

 /**
 * 툴바 옵저버 리스너 객체
 * @typedef AbToolbar.ObserveListenObject
 * @property {AbToolbar.ObserveListenFunction} toolbarNotify 리스너 메서드
 */

/**
 * 툴바 옵저브 리스너
 * @typedef {(AbToolbar.ObserveListenFunction|AbToolbar.ObserveListenObject)}
 * AbToolbar.ObserveListener 
 */

//----------------------------------------------------------------------------------------------------------
// 툴바 컨트롤러
//----------------------------------------------------------------------------------------------------------

/**
 * 툴바 컨트럴러
 * @class
 * @param {Object} [options] 옵션
 * @param {String} [options.selector=#tb-main,#tb-left,#rb-right,#tb-thumb-popup-left] 툴바 HTML 엘리먼트 선택자
 */
function AbToolbar(options){
	if (!options) options = {};

	/**
	 * 툴바 HTML 엘리먼트 선택자
	 * @type {String}
	 */
	this.selector = options.selector || '#tb-main,#tb-left,#rb-right,#tb-thumb-popup-left';
	
	/**
	 * 툴바 HTML 엘리먼트 jQuery 객체
	 * @type {jQueryObject}
	 */
	this.e = $(this.selector);
	
	//-----------------------------------------------------------

	/**
	 * 옵저브 리스너 목록
	 * @private
	 * @type {Array.<AbToolbar.ObserveListener>}
	 */
	this.observers = [];
	/**
	 * 그룹 옵저브 리스너 목록
	 * @private
	 * @type {Array.<AbToolbar.GroupObserveListener>}
	 */
	this.groupObservers = [];

	//-----------------------------------------------------------

	/**
	 * 토픽 맵
	 * <p>* 필드명이 토픽명, 필드값이 {@link jQueryObject}인 객체입니다.
	 * @private
	 * @type {Object.<String, jQueryObject>}
	 */
	this.topics = {};
	/**
	 * 툴바 타입 별 맵
	 * <p>* 필드명이 툴바 타입, 필드값이 {@link jQueryObject}인 객체입니다.
	 * <ul>툴바 타입
	 * 	<li>ratio
	 * 	<li>check
	 * 	<li>label
	 * 	<li>text
	 * 	<li>select
	 * </ul>
	 * @private
	 * @type {Object.<String, jQueryObject>}
	 */
	this.topicTypes = {};
	/**
	 * 툴바 그룹 맵
	 * <p>* 라디오 버튼 효과를 내기 위한 정보입니다.
	 * <p>* 필드명이 그룹명, 필드값이 {@link AbToolbar.TopicGroup|토픽 그룹 정보}인 객체입니다.
	 * @private
	 * @type {Object.<String, AbToolbar.TopicGroup>}
	 */
	this.topicGroups = {};
	/**
	 * 이미지 Hover를 지원하는 툴바 목록
	 * <p>* 토픽명 목록입니다.
	 * <p>* 이 목록에 등록된 툴바는 마우스가 Hover되면 설정된 이미지를 표시합니다.
	 * @private
	 * @type {Array.<String>}
	 */
	this.imageHoverTopics = [];

	/**
	 * 토픽 그룹 정보
	 * <p>* 라디오 버튼 효과를 내기 위한 정보입니다.
	 * @typedef {Object} AbToolbar.TopicGroup
	 * @property {jQueryObject} selected 선택된 jQuery 객체
	 * @property {Array.<jQueryObject>} topics 같은 토픽의 jQuery 객체 배열
	 */

	//-----------------------------------------------------------

	/**
	 * click 이벤트를 처리합니다.
	 * @function
	 * @private
	 */
	this.clickHandler = function(event){
		var e = $(event.currentTarget);
		var disabled = e.attr('tb-enabled') === 'disabled';
		if (disabled) return;
		
		var topic = e.attr('tb-topic');
		var type = e.attr('tb-type');
		var checked = e.attr('tb-status') === 'checked';


		if (type == 'radio' && checked){
			var locks = (e.attr('tb-user-lock') || '').split(',');
			if ($.inArray('uncheck', locks) >= 0){
				return;
			}
		}
		
		this.click(topic, !checked);
	}.bind(this);

	/**
	 * change 이벤트를 처리합니다.
	 * @function
	 * @private
	 */
	this.changeHandler = function(event){
		var e = $(event.currentTarget);
		var topic = e.attr('tb-topic');
		
		this.change(topic, e.val(), e);
	}.bind(this);

	/**
	 * input 엘리먼트의 change 이벤트를 처리합니다.
	 * @function
	 * @private
	 */
	this.inputChangeHandler = function(event){
		var e = $(event.currentTarget);
		var topic = e.attr('tb-topic');
		var value = e.val();

		if (!$.isNumeric(value)){
			e.blur();
			AbMsgBox.error('숫자를 입력하세요');
			if (e.attr('tb-origin-value'))
				e.val(e.attr('tb-origin-value'));
			return;
		}
		
		this.change(topic, e.val(), e);
	}.bind(this);

	/**
	 * keydown 이벤트를 처리합니다.
	 * @function
	 * @private
	 */
	this.keydownHandler = function(event){
		event.stopPropagation(); // 현재 이벤트가 상위로 전파되지 않도록 중단한다.
		event.stopImmediatePropagation(); // 현재 이벤트가 상위뿐 아니라 현재 레벨에 걸린 다른 이벤트도 동작하지 않도록 중단한다.			
	}.bind(this);

	/**
	 * keyup 이벤트를 처리합니다.
	 * @function
	 * @private
	 */
	this.keyupHandler = function(event){
		if (event.keyCode == 13){
			var e = $(event.currentTarget);
			var topic = e.attr('tb-topic');
			var value = e.val();

			if (!$.isNumeric(value)){
				e.blur();
				AbMsgBox.error('숫자를 입력하세요');
				if (e.attr('tb-origin-value'))
					e.val(e.attr('tb-origin-value'));
				return;
			}
	
			this.change(topic, e.val());
		}
	}.bind(this);

	/**
	 * mouseover 이벤트를 처리합니다.
	 * @function
	 * @private
	 */
	this.mouseoverHandler = function(event){
		var e = $(event.currentTarget);
		this.mouseOver(e);
	}.bind(this);

	/**
	 * mouseout 이벤트를 처리합니다.
	 * @function
	 * @private
	 */
	this.mouseoutHandler = function(event){
		var e = $(event.currentTarget);
		this.mouseOut(e);
	}.bind(this);

	//-----------------------------------------------------------

	this.prepare();
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbToolbar.prototype = {
	constructor: AbToolbar,

	//-----------------------------------------------------------

	/**
	 * 옵저버 리스너를 등록합니다.
	 * @param {AbToolbar.ObserveListener} observer 리스너
	 */
	observe: function(observer){ this.observers.push(observer); },
	/**
	 * 옵저버 리스너를 제거합니다.
	 * @param {AbToolbar.ObserveListener} observer 리스너
	 */
	stopObserve: function(observer){
		var idx = this.observers.indexOf(observer);
		if (idx >= 0) this.observers.splice(idx, 1);
	},
	
	/**
	 * 등록된 옵저버에 Notify합니다.
	 * @param {String} topic 토픽
	 * @param {String} [value] 값
	 * @param {jQueryObject} [element] 툴바 엘리먼트 jQuery 객체
	 */
	notifyObservers: function(topic, value, element){
		setTimeout(function(){
			var len = this.observers.length;
			for (var i=0; i < len; i++){
				var o = this.observers[i];

				if (typeof o == 'function')
					o(this, topic, value, element);
				else if (typeof o.toolbarNotify == 'function')
					o.toolbarNotify(this, topic, value, element);
		}}.bind(this), 0);
	},
	//-----------------------------------------------------------

	/**
	 * 그룹 옵저버 리스너를 등록합니다.
	 * @param {AbShapeStyler.GroupObserveListener} observer 리스너
	 */
	groupObserve: function(observer){ this.groupObservers.push(observer); },
	/**
	 * 그룹 옵저버 리스너를 제거합니다.
	 * @param {AbShapeStyler.GroupObserveListener} observer 리스너
	 */
	stopGroupObserve: function(observer){
		var idx = this.groupObservers.indexOf(observer);
		if (idx >= 0) this.groupObservers.splice(idx, 1);
	},

	/**
	 * 등록된 그룹 옵저버에 Notify합니다.
	 * @param {String} topic 토픽
	 * @param {String} [value] 값
	 */
	notifyGroupObservers: function(group, value){
		setTimeout(function(){
			var len = this.groupObservers.length;
			for (var i=0; i < len; i++){
				var o = this.groupObservers[i];

				if (typeof o == 'function')
					o(this, group, value);
				else if (typeof o.toolbarGroupNotify == 'function')
					o.toolbarGroupNotify(this, group, value);
		}}.bind(this), 0);
	},

	//-----------------------------------------------------------

	/**
	 * 툴바 준비 작업을 진행합니다.
	 * <p>* 툴바를 탐색하고, 정보를 채우고 이벤트를 연결합니다.
	 * @private
	 */
	prepare: function(){
		var items = this.e.find('[tb-type]');
		var siz = items.length;
		for (var i=0; i < siz; i++){
			var element = items.get(i);
			var e = $(element);

			var topic = e.attr('tb-topic');
			var type = e.attr('tb-type');
			var group = e.attr('tb-group');
			var hover = e.attr('tb-hover');

			if (!topic)
				continue;

			if (hover && e.find('img.tb-btn').length){
				this.imageHoverTopics.push(topic);

				e.mouseover(this.mouseoverHandler);
				e.mouseout(this.mouseoutHandler);
			}

			//-----------------------------------------------------------

			this.topics[topic] = e;

			//-----------------------------------------------------------

			var checked = e.attr('tb-status') === 'checked';

			if (this.topicGroups[group]){
				var g = this.topicGroups[group];
				if (checked)
					g.selected = e;
				g.topics.push(e);
			}else
				this.topicGroups[group] = { selected: checked ? e : null, topics: [e] };

			//-----------------------------------------------------------

			if (this.topicTypes[type])
				this.topicTypes[type].push(e);
			else
				this.topicTypes[type] = [e];
			
			//-----------------------------------------------------------

			switch(type){
			case 'text':
				e.keydown(this.keydownHandler);
				e.keyup(this.keyupHandler);
				e.change(this.inputChangeHandler);
				break;
			case 'select':
				e.change(this.changeHandler);
				break;
			default:
				e.click(this.clickHandler);
				break;
			}
		}	
	},

	//-----------------------------------------------------------

	/**
	 * mouseover 이벤트를 처리합니다.
	 * <p>마우스 Hover 기능을 구현합니다.
	 * @private
	 * @param {jQueryEventObjet} e jQuery 이벤트 객체
	 */
	mouseOver: function(e){
		var childs = e.find('img.tb-btn');
		var len = childs.length;
		for (var i=0; i < len; i++){
			var ce = $(childs.get(i));

			if (!ce.attr('tb-origin'))
				ce.attr('tb-origin', ce.attr('src'));

			ce.attr('src', e.attr('tb-hover'));
		}
	},

	/**
	 * mouseout 이벤트를 처리합니다.
	 * <p>마우스 Hover 기능을 구현합니다.
	 * @private
	 * @param {jQueryEventObjet} e jQuery 이벤트 객체
	 */
	mouseOut: function (e){
		var childs = e.find('img.tb-btn');
		var len = childs.length;
		for (var i=0; i < len; i++){
			var ce = $(childs.get(i));

			if (ce.attr('tb-origin'))
				ce.attr('src', ce.attr('tb-origin'));
		}
	},

	//-----------------------------------------------------------

	/**
	 * click 이벤트를 처리합니다.
	 * <p>* notifing이 true면 토픽명으로 Notify 합니다.
	 * <p>* tb-group 속성이 있는 경우 그룹명으로 그룹 옵저버에 Notify 합니다.
	 * @private
	 * @param {String} topic 토픽명
	 * @param {Boolean} checked 체크된 상태 여부
	 * @param {Boolean} [notifing=true] Notify 여부 
	 */
	click: function(topic, checked, notifing){
		if (!AbCommon.isBool(notifing)) notifing = true;

		var e = this.topics[topic];
		
		var topic = e.attr('tb-topic');
		var type = this.toolbarType(e);

		if (type == 'radio'){
			var group = e.attr('tb-group');
			var status = e.attr('tb-status');
			var g = this.topicGroups[group];

			var echecked = e.attr('tb-status') === 'checked';
			if (checked != echecked){
				var eselected = g.selected != null && g.selected.attr('tb-topic') == topic;

				if (echecked){
					this.uncheckedGroup(group);

					if (notifing === true){
						this.notifyObservers(topic, false, e);
						this.notifyGroupObservers(group, false);
					}
				}else{
					if (g.selected != null){
						g.selected.attr('tb-status', null);
						g.selected = null;						
					}else if (notifing === true){
						this.notifyGroupObservers(group, true);
					}

					e.attr('tb-status', 'checked');
					g.selected = e;

					if (notifing === true)
						this.notifyObservers(topic, true, e);
				}
			}
		}else if (type == 'check'){
			var echecked = e.attr('tb-status') === 'checked';
			if (echecked != checked){
				e.attr('tb-status', checked ? 'checked' : null);

				if (notifing === true)
					this.notifyObservers(topic, checked, e);
			}
		}else if (notifing === true){
			this.notifyObservers(topic, null, e);
		}
	},

	/**
	 * change 이벤트를 처리합니다.
	 * <p>* 토픽명으로 Notify 합니다.
	 * @private
	 * @param {String} topic 토픽명
	 * @param {String} value 변경된 값
	 * @param {jQueryEventObjet} e jQuery 이벤트 객체
	 */
	change: function (topic, value, e){
		this.notifyObservers(topic, value, e ? e : null);
	},

	//-----------------------------------------------------------

	/***
	 * 그룹의 툴바들을 체크 해제합니다.
	 * @private
	 */
	uncheckedGroup: function(group){
		var g = this.topicGroups[group];
		var len = g.topics.length;
		 for (var i=0; i < len; i++){
			g.topics[i].attr('tb-status', '');
		}
		g.selected =null;
	},

	/**
	 * 툴바의 타입을 가져옵니다.
	 * @param {jQueryObject} e 툴바 엘리먼트 jQuery 객체
	 * @return {String} 툴바 타입
	 */
	toolbarType: function(e){
		var type = e ? e.attr('tb-type') : null;
		if (type == 'radio'){
			var group = e.attr('tb-group');
			
			if (!group || !this.topicGroups[group])
				type = 'check';
		}
		return type;
	},

	/**
	 * @private
	 * @param {jQueryObject} e 툴바 엘리먼트 jQuery 객체
	 */
	setTopic: function(e){
		var type = e.attr('tb-type');
		if (type == 'radio'){
			var group = e.attr('tb-group');
			
			if (!group || !this.topicGroups[group])
				type = 'check';
		}
		return type;
	},

	//-----------------------------------------------------------

	/**
	 * 툴바의 값을 설정합니다.
	 * <p>설정 후 notifing이 true면 토픽명으로 Notify 됩니다.
	 * @param {String} topic 토픽명
	 * @param {(String|Boolean|Number)} value 값
	 * @param {Boolean} [notifing=true] Notify 여부 
	 */
	set: function (topic, value, notifing){
		if (!AbCommon.isBool(notifing)) notifing = true;

		var e = this.topics[topic];
		var type = this.toolbarType(e);

		switch(type){
		case 'radio': case 'check':
			this.click(topic, value, notifing);
			break;
		case 'label':
			e.text(value);
			if (notifing)
				this.notifyObservers(topic, value, null);
			break;
		case 'text':
			e.val(value);
			e.attr('tb-origin-value', value);
			if (notifing)
				this.notifyObservers(topic, value, null);
			break;
		case 'select':
			if (e.length){
				e.val(value);

				if (value && value.indexOf('%') >= 0 && e.get(0).selectedIndex == -1){
					var ce = e.children(':first');
					ce.text(value);

					e.get(0).selectedIndex = 0;
				}
			}

			/*
			var oes = e.find('option');
			var siz = oes.length;
			var fe = null;
			for (var i=1; i < siz; i++){
				var oe = $(oes.get(i));

				if (oe.val() == value){
					fe = oe;
					break;
				}
			}

			if (fe){
				e.val(value);
			}else if (siz){
				fe = $(oes.get(0));
				fe.attr('selected', true);
				fe.text(value);
			}
			*/
			break;
		}
	},

	/**
	 * 툴바의 값을 가져옵니다.
	 * @param {String} topic 토픽명
	 * @return {(String|Number|Boolean)}
	 */
	get: function (topic){
		var e = this.topics[topic];
		var type = this.toolbarType(e);

		switch(type){
		case 'radio': case 'check':
			return e.attr('tb-status') === 'checked';
		case 'label':
			return e.text();
		case 'text': case 'select':
			return e.val();
		}
		return null;
	},

	/**
	 * 툴바 토픽마다 한 번씩 주어진 함수를 실행합니다.
	 * @param {AbToolbar.TopicCallback} callback 각 툴바 토픽에 대해 실행할 인수 두 개를 취하는 함수
	 */
	forEach: function(callback){
		if (!AbCommon.isFunction(callback))
			return;

		for (var p in this.topics){
			var value = this.get(p);
			callback(p, value);
		}
	},

	/**
	 * 툴바를 활성화하거나 비활성화합니다.
	 * @param {String} topic 토픽명
	 * @param {Boolean} enabled 활성화 여부
	 */
	enableTopic: function(topic, enabled){
		function enableElemnent(e, enabled){
			if (!e || !e.length) return;

			var htmlElement = e.get(0);
			var tagName = htmlElement.tagName.toLowerCase();

			if (tagName == 'input' || tagName == 'select' || tagName == 'textarea'){
				e.attr('disabled', !enabled);
			}else{
				e.attr('tb-enabled', enabled ? 'enabled' : 'disabled');
			}
		}

		if ($.isArray(topic)){
			var siz = topic.length;
			for (var i=0; i < siz; i++){
				enableElemnent(this.topics[topic[i]], enabled);
			}
		}else{
			enableElemnent(this.topics[topic], enabled);
		}
	},

	/**
	 * 종류별 툴바를 활성화하거나 비활성화합니다.
	 * @param {String} kind 종류
	 * @param {Boolean} enabled 활성화 여부
	 */
	enableKind: function(kind, enabled){
		var requestKinds = $.isArray(kind) ? kind : [kind];

		var kindTopics = this.e.find('[tb-kind]');

		var numKindTopics = kindTopics.length;
		for (var i=0; i < numKindTopics; i++){
			var he = kindTopics.get(i);
			var e = $(he);
			
			var kindTopic = e.attr('tb-kind');

			var accept = false;
			
			var topics = kindTopic.trim().split(/\s*,\s*/g);
			var numTopics = topics.length;
			for (var j=0; j < numTopics; j++){
				var item = topics[j];
				
				if ($.inArray(item, requestKinds) >= 0){
					accept = true;
					break;
				}
			}

			if (accept){
				if (enabled)
					e.show();
				else
					e.hide();
			}
		}

	},
};
