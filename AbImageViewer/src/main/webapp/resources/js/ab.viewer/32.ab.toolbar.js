function AbToolbar(options){
	if (!options) options = {};

	this.selector = options.selector || '#tb-main, #tb-left, #rb-right, #tb-thumb-popup-left';
	
	this.e = $(this.selector);
	
	//-----------------------------------------------------------

	this.observers = [];
	this.groupObservers = [];

	//-----------------------------------------------------------

	this.topics = {};
	this.topicTypes = {};
	this.topicGroups = {};
	this.imageHoverTopics = [];

	//-----------------------------------------------------------

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

	this.changeHandler = function(event){
		var e = $(event.currentTarget);
		var topic = e.attr('tb-topic');
		
		this.change(topic, e.val(), e);
	}.bind(this);

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

	this.keydownHandler = function(event){
		event.stopPropagation(); // 현재 이벤트가 상위로 전파되지 않도록 중단한다.
		event.stopImmediatePropagation(); // 현재 이벤트가 상위뿐 아니라 현재 레벨에 걸린 다른 이벤트도 동작하지 않도록 중단한다.			
	}.bind(this);

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

	this.mouseoverHandler = function(event){
		var e = $(event.currentTarget);
		this.mouseOver(e);
	}.bind(this);

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

	observe: function(observer){ this.observers.push(observer); },
	stopObserve: function(observer){
		var idx = this.observers.indexOf(observer);
		if (idx >= 0) this.observers.splice(idx, 1);
	},
	
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

	groupObserve: function(observer){ this.groupObservers.push(observer); },
	stopGroupObserve: function(observer){
		var idx = this.groupObservers.indexOf(observer);
		if (idx >= 0) this.groupObservers.splice(idx, 1);
	},

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

	change: function (topic, value, e){
		this.notifyObservers(topic, value, e ? e : null);
	},

	//-----------------------------------------------------------

	uncheckedGroup: function(group){
		var g = this.topicGroups[group];
		var len = g.topics.length;
		 for (var i=0; i < len; i++){
			g.topics[i].attr('tb-status', '');
		}
		g.selected =null;
	},

	toolbarType: function(e){
		var type = e ? e.attr('tb-type') : null;
		if (type == 'radio'){
			var group = e.attr('tb-group');
			
			if (!group || !this.topicGroups[group])
				type = 'check';
		}
		return type;
	},

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

	forEach: function(callback){
		if (!AbCommon.isFunction(callback))
			return;

		for (var p in this.topics){
			var value = this.get(p);
			callback(p, value);
		}
	},

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
};
