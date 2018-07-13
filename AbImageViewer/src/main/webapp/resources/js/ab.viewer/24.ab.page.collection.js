function AbPageCollection(){
	this.source = [];
	this.map = {};
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbPageCollection.prototype = {
	constructor: AbPageCollection,

	//-----------------------------------------------------------

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

	length: function() { return this.source.length; },

	//-----------------------------------------------------------

	numShapes: function(){
		var nums = 0;
		for (var i = this.source.length - 1; i >= 0; i--)
			nums += this.source[i].shapes.length;
		return nums;
	},

	//-----------------------------------------------------------

	set: function (index, value) { this.source[index] = value; },
	get: function (index) {
		if (AbCommon.isString(index)) index = parseInt(index);
		return this.source[index];
	},

	getById: function (uid){
		return this.map[uid];
	},

	//-----------------------------------------------------------

	uuid: function(){
		var uid = AbCommon.uuid();
		while (this.map[uid])
			uid = AbCommon.uuid();
		return uid;
	},

	//-----------------------------------------------------------

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

	remove: function (){
		var siz = arguments.length;
		for (var i=0; i < siz; i++){
			var page = this.source.splice(arguments[i], 1);
			delete this.map[page.uid];
		}
	},

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

	push: function (){
		var siz = arguments.length;
		for (var i=0; i < siz; i++){
			var page = arguments[i];
			this.source.push(page);
			this.map[page.uid] = page;
		}
	},

	pop: function(){
		var page = this.source.pop();
		if (page)
			delete this.map[page.uid];
		return page;
	},

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

	slice: function (){
		return Array.prototype.slice.apply(this.source, arguments);
	},

	shift: function(){
		var page = Array.prototype.shift.apply(this.source, arguments);
		if (page)
			delete this.map[page.uid];
		return page;
	},

	unshift: function(){
		Array.prototype.unshift.apply(this.source, arguments);

		var siz = arguments.length;
		for (var i=0; i < siz; i++){
			var page = arguments[i];
			this.map[page.uid] = page;
		}
	},
};