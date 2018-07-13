
//-------------------------------------------------------------------------------------------------------
// Duration Time
//-------------------------------------------------------------------------------------------------------

var AbDurationTimer = {
	data: {},
	
	start: function (name){
		if (typeof name == 'undefined' || !name) name = 'def';
		
		this.data[name] = {
			start: new Date(),
			end: null,
		};
	},
	
	end: function (name, logging){
		if (typeof name == 'undefined' || !name) name = 'def';
		if (typeof logging == 'undefined') logging = true;
		
		if (this.data[name]){
			this.data[name].end = new Date();
		}else{
			this.data[name] = {
				start: null,
				end: new Date()
			}
		}
		
		if (logging)
			this.log(name);
	},
	
	log: function (name){
		if (typeof name == 'undefined' || !name) name = 'def';
		
		var msg = '';
		if (this.data[name]){
			var d = this.data[name];
			if (d.start && d.end){
				var term = d.end.getTime() - d.start.getTime();
				msg = term + 'ms' + ' ' + (term / 1000) + 's';
			}else{
				if (!d.start)
					msg = 'start is null';
				
				if (!d.end)
					msg = 'end is null';
			}
		}else{
			msg = 'not found';
		}
		
		console.log('[' + name + '] ' + msg);
	}
};
