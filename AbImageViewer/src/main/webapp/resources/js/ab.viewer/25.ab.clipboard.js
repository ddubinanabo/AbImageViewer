function AbClipboard(){
	this.datas = [];
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbClipboard.prototype = {
	constructor: AbClipboard,

	//-----------------------------------------------------------

	clear: function (){
		this.datas.splice(0, this.datas.length);

		// var dlen = this.datas.length;
		// for (var i=0; i < dlen; i++){
		// 	var d = this.datas[i];

		// 	d.type = null;
		// 	d.data = null;
		// }
	},

	//-----------------------------------------------------------

	copy: function(engine, page, shapes){
		this.clear();

		var slen = shapes.length;
		for (var i=0; i < slen; i++){
			var s = shapes[i];
			var d = s.serialize();

			//console.log(d);

			this.datas.push({
				type: 'shape',
				data: d
			});
		}
	},

	cut: function (engine, page, shapes){
		this.copy(engine, page, shapes);
		engine.deleteShapes();
	},

	paste: function (engine, page, callback){
		if (!AbCommon.isFunction(callback)) callback = function(){};
		
		var totalCalled = 0, received = 0;
		
		var func = function (){
			received++;
			
			if (received >= totalCalled){
				engine.render();

				// Notify modified
				engine.modified();
				
				callback();
			}
		};

		//-----------------------------------------------------------
		
		var pls = [];
		var dlen = this.datas.length;
		if (dlen){
			engine.unselect(false);

			//-----------------------------------------------------------
			// begin record history
			engine.history.begin('shape', 'add', engine);
			//-----------------------------------------------------------

			var page = engine.currentPage;
			
			var numShapes = 0;
			for (var i=0; i < dlen; i++){
				var d = this.datas[i];
				if (d.type == 'shape') numShapes++;
			}

			var called = 0;
			for (var i=0; i < dlen; i++){
				var d = this.datas[i];
	
				if (d.type == 'shape'){
					var prop = AbCommon.deserializeShape(d.data);
					var s = engine.createShape(prop.name, prop, function (s, error){
						s.prepare();

						this.move(engine, page, s);
		
						page.shapes.push(s);

						s.engine = engine;
						s.measure();

						engine.selectShape(s);
						
						//-----------------------------------------------------------
						
						called++;
						if (called >= numShapes){
							//-----------------------------------------------------------
							// end record history
							engine.history.end(engine);
							//-----------------------------------------------------------
							
							engine.render();

							// Notify modified
							engine.modified();

							callback();
						}
					}.bind(this));
				}
			}
			
			if (!numShapes){
				//-----------------------------------------------------------
				// end record history
				engine.history.end(engine);
				//-----------------------------------------------------------
				
				engine.render();

				// Notify modified
				engine.modified();

				callback();
			}
		}else{
			callback();
		}
	},

	PASTE_STEP: 20,

	move: function(engine, page, s){
		var box = s.box(), step = this.PASTE_STEP;

		while(this.hasShape(engine, page, box.x, box.y)){
			box.x += step;
			box.y += step;
		}

		s.move(box.x, box.y);
	},

	hasShape: function (engine, page, x, y){
		var len = page.shapes.length;
		for (var i=0; i < len; i++){
			var ps = page.shapes[i];

			var box = ps.box();
			if (Math.round(box.x) == x && Math.round(box.y) == y)
				return true;
		}
		return false;
	},
};
