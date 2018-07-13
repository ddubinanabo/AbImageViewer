function AbHistoryAddPageState(){
	this.type = 'page';
	this.cmd = 'add';

	this.pageIndex = -1;
	this.pages = [];

	this.start = 0;
};
	
//-----------------------------------------------------------

AbHistoryAddPageState.prototype = {
	constructor: AbHistoryAddPageState,
	
	begin: function(engine){
		this.pageIndex = engine.currentPageIndex;
		this.start = engine.pages.length();
	},

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

	dispose: function(){
		this.pages.splice(0, this.pages.length);
	},
};


//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------


function AbHistoryUpdatePageState(){
	this.type = 'page';
	this.cmd = 'update';

	this.pageIndex = -1;
	this.props = null;

	this.un = null;
	this.unToken = null;
	this.re = null;
	this.reToken = null;

	this.setter = null;
};

//-----------------------------------------------------------

AbHistoryUpdatePageState.prototype = {
	constructor: AbHistoryUpdatePageState,
	
	begin: function(engine, props, setter, token){
		this.props = props;
		this.setter = setter;

		this.pageIndex = engine.currentPageIndex;

		this.un = AbCommon.copyProp(engine.currentPage, {}, this.props);
		this.unToken = token;
	},

	end: function(engine, token){
		var page = engine.pages.get(this.pageIndex);

		this.re = AbCommon.copyProp(page, {}, this.props);
		this.reToken = token;

		return !AbCommon.equals(this.un, this.re);
	},

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


function AbHistoryRemovePageState(){
	this.type = 'page';
	this.cmd = 'remove';

	this.pageIndex = -1;
	this.pages = [];
};
	
//-----------------------------------------------------------

AbHistoryRemovePageState.prototype = {
	constructor: AbHistoryRemovePageState,
	
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

	end: function(engine){
		if (!this.pages.length)
			return false;
	},

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

	dispose: function(){
		this.pages.splice(0, this.pages.length);
	},
};

