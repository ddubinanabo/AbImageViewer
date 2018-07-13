function AbHistoryAddShapeState(){
	this.type = 'shape';
	this.cmd = 'add';

	this.pageIndex = -1;
	this.shapes = [];

	this.start = 0;
};
	
//-----------------------------------------------------------

AbHistoryAddShapeState.prototype = {
	constructor: AbHistoryAddShapeState,
	
	begin: function(engine){
		var page = engine.currentPage;

		this.pageIndex = engine.currentPageIndex;
		this.start = page.shapes.length;
	},

	end: function(engine){
		var page = engine.pages.get(this.pageIndex);
		
		var shapes = null;
		if (this.start >= 0)
			shapes = page.shapes.slice(this.start);
		else
			shapes = page.shapes.slice();

		if (!shapes.length)
			return false;

		this.shapes = AbCommon.indexArrayOf(page.shapes, shapes, true);
	},

	undo: function(engine){
		var page = engine.pages.get(this.pageIndex);
		if (!this.shapes.length) return;

		engine.selectPage(this.pageIndex);
		var mod = engine.unselect(false);
		
		var len = this.shapes.length;
		for (var i=len - 1; i >= 0; i--)
			page.shapes.splice(this.shapes[i].index, 1);

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	redo: function(engine){
		var page = engine.pages.get(this.pageIndex);

		engine.selectPage(this.pageIndex);
		var mod = engine.unselect(false);

		var len = this.shapes.length;
		for (var i=0; i < len; i++){
			var d = this.shapes[i];

			page.shapes.splice(d.index, 0, d.source);
			//d.source.measure();
			engine.selectShape(d.source);
		}

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	dispose: function(){
		this.shapes.splice(0, this.shapes.length);
		//AbCommon.disposeShapes(this.shapes);
	},
};


//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------


function AbHistoryUpdateShapeState(){
	this.type = 'shape';
	this.cmd = 'update';

	this.pageIndex = -1;
	this.props = null;
	this.editPoint = null;

	this.un = [];
	this.re = [];
};

//-----------------------------------------------------------

AbHistoryUpdateShapeState.prototype = {
	constructor: AbHistoryUpdateShapeState,
	
	begin: function(engine, props, editPoint){
		if (!engine.selectedShapes.length)
			return false;

		this.props = props;
		this.editPoint = editPoint;
		this.pageIndex = engine.currentPageIndex;

		var page = engine.currentPage;
		var idxes = AbCommon.indexArrayOf(page.shapes, engine.selectedShapes, true);
		var len = idxes.length;
		for (var i=0; i < len; i++){
			var d = idxes[i];
			var p = AbCommon.copyProp(d.source, {}, this.props);

			this.un.push({
				index: d.index,
				prop: p
			});
		}
	},

	end: function(engine){
		if (!engine.selectedShapes.length)
			return false;

		var page = engine.pages.get(this.pageIndex);

		var idxes = AbCommon.indexArrayOf(page.shapes, engine.selectedShapes, true);
		var len = idxes.length;
		for (var i=0; i < len; i++){
			var d = idxes[i];
			var p = AbCommon.copyProp(d.source, {}, this.props);

			this.re.push({
				index: d.index,
				prop: p
			});
		}

		var mod = false;
		for (var i=0; i < len; i++){
			var un = this.un[i].prop;
			var re = this.re[i].prop;

			if (!AbCommon.equals(un, re)){
				mod = true;
				break;
			}
		}

		return mod;
	},

	undo: function(engine){
		var page = engine.pages.get(this.pageIndex);

		engine.selectPage(this.pageIndex);
		var mod = engine.unselect(false);
		
		var len = this.un.length;
		for (var i=0; i < len; i++){
			var d = this.un[i];
			var s = page.shapes[d.index];
			
			$.extend(s, d.prop, true);
			//s.measure();
			engine.selectShape(s);
		}

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	redo: function(engine){
		var page = engine.pages.get(this.pageIndex);

		engine.selectPage(this.pageIndex);
		var mod = engine.unselect(false);
		
		var len = this.re.length;
		for (var i=0; i < len; i++){
			var d = this.re[i];
			var s = page.shapes[d.index];
			
			$.extend(s, d.prop, true);
			//s.measure();
			engine.selectShape(s);
		}

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	dispose: function(){
		if (this.props) this.props.splice(0, this.props.length);
		this.un.splice(0, this.un.length);
		this.re.splice(0, this.re.length);
	},
};


//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------


function AbHistoryRemoveShapeState(){
	this.type = 'shape';
	this.cmd = 'remove';

	this.pageIndex = -1;
	this.shapes = [];
};
	
//-----------------------------------------------------------

AbHistoryRemoveShapeState.prototype = {
	constructor: AbHistoryRemoveShapeState,
	
	begin: function(engine, shapes){
		var page = engine.currentPage;

		if (!shapes) shapes = engine.selectedShapes;

		if (!shapes.length)
			return false;
		
		this.pageIndex = engine.currentPageIndex;
		this.shapes = AbCommon.indexArrayOf(page.shapes, shapes, true);
	},

	end: function(engine){
		if (!this.shapes.length)
			return false;
	},

	undo: function(engine){
		var page = engine.pages.get(this.pageIndex);

		engine.selectPage(this.pageIndex);
		var mod = engine.unselect(false);

		var len = this.shapes.length;
		for (var i=0; i < len; i++){
			var d = this.shapes[i];

			page.shapes.splice(d.index, 0, d.source);
			engine.selectShape(d.source);
		}

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	redo: function(engine){
		var page = engine.pages.get(this.pageIndex);
		if (!this.shapes.length) return;

		engine.selectPage(this.pageIndex);
		var mod = engine.unselect(false);
		
		var len = this.shapes.length;
		for (var i=len - 1; i >= 0; i--)
			page.shapes.splice(this.shapes[i].index, 1);

		if (len > 0 || mod){
			engine.render();

			// Notify modified
			engine.modified();
		}
	},

	dispose: function(){
		this.shapes.splice(0, this.shapes.length);
	},
};



//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------


function AbHistoryRemoveAllShapeState(){
	this.type = 'shape';
	this.cmd = 'all';

	this.pages = [];
	this.numAllShapes = 0;
};
	
//-----------------------------------------------------------

AbHistoryRemoveAllShapeState.prototype = {
	constructor: AbHistoryRemoveAllShapeState,
	
	begin: function(engine){
		var siz = engine.pages.length();
		for (var i=0; i < siz; i++){
			var page = engine.pages.get(i);

			if (!page.shapes.length)
				continue;
			
			var shapes = page.shapes.slice(0);

			this.pages.push({
				index: i,
				source: shapes
			});

			this.numAllShapes += shapes.length;
		}
	},

	end: function(engine){
		if (!this.numAllShapes)
			return false;
	},

	undo: function(engine){
		var mod = engine.unselect(false);

		var len = this.pages.length, last = -1;
		for (var i=0; i < len; i++){
			var d = this.pages[i];

			var page = engine.pages.get(d.index);
			Array.prototype.push.apply(page.shapes, d.source);

			last = d.index;
		}

		if (last >= 0){
			if (last == engine.currentPageIndex)
				engine.render();
			else
				engine.selectPage(last);
		}
	},

	redo: function(engine){
		var len = this.pages.length, last = -1;
		for (var i=0; i < len; i++){
			var d = this.pages[i];

			var page = engine.pages.get(d.index);
			page.shapes.splice(0, page.shapes.length);

			last = d.index;
		}

		if (last >= 0){
			if (last == engine.currentPageIndex)
				engine.render();
			else
				engine.selectPage(last);
		}
	},

	dispose: function(){
		this.pages.splice(0, this.pages.length);
	},
};

