function AbHistory(options){
	if (!options) options = {};

	this.queue = [];
	this.queueSize = options.queueSize || 100;
	this.index = -1;

	this.temp = null;
	this.locked = false;
	this.enabled = true;
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbHistory.prototype = {
	constructor: AbHistory,

	//-----------------------------------------------------------

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

	get: function(type, cmd){
		var table = AbHistory.prototype.STATES_TABLE[type];
		if (table) return table[cmd];
		return null;
	},

	//-----------------------------------------------------------

	lock: function(){ this.locked = true; },
	unlock: function(){ this.locked = false; },

	//-----------------------------------------------------------

	canUndo: function () {
		var can = this.queue.length && this.index > -1;
		if (arguments.length){
			var type = arguments[0];
			return can && this.queue[this.index].type == type;
		}
		return can;
	},
	
	canRedo: function () {
		var can = this.queue.length && this.index+1 < this.queue.length;
		if (arguments.length){
			var type = arguments[0];
			return can && this.queue[this.index].type == type;
		}
		return can;
	},

	//-----------------------------------------------------------
	
	beginState: function(state){
		if (this.locked) return;

		if (AbCommon.isHistoryState(state)){
			this.temp = AbCommon.clone(state);

			var a = AbCommon.copyArray(arguments, 1);
			this.temp.begin.apply(this.temp, a);
		}
	},

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

	cancel: function(){
		if (this.temp != null){
			this.temp.dispose();
			this.temp = null;
		}
	},

	//-----------------------------------------------------------

	ENABLE_LOG: false,

	logAllTree: function(){
		if (!this.ENABLE_LOG) return;

		var s = '[HISTORY]';
		for (var i=0; i < this.queue.length; i++){
			var q = this.queue[i];
			s += '[' + q.type + '::'+q.cmd+']';
		}
		console.log(s);
	},

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

	clear: function(){
		this.queue.splice(0, this.queue.length);
		this.index = -1;
	},

	//-----------------------------------------------------------

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
