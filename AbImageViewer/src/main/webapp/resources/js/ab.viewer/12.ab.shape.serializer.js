function AbShapeSerializer(){
	this.prop = {};
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeSerializer.prototype = {
	constructor: AbShapeSerializer,

	//-----------------------------------------------------------

	GROUP_PREFIX: 'g-',
	PROP_PREFIX: 'p-',

	//-----------------------------------------------------------

	addGroup: function(){
		var group = null, name = null;
		if (arguments.length == 2){
			group = arguments[0];
			name = arguments[1];
		}else if (arguments.length == 1){
			name = arguments[0];
		}else
			return;
		
		var p = {};
		if (group)
			group[this.GROUP_PREFIX + name] = p;
		else
			this.prop[this.GROUP_PREFIX + name] = p;

		return p;
	},

	add: function (){
		var group = null, name = null, value = null;
		if (arguments.length == 3){
			group = arguments[0];
			name = arguments[1];
			value = arguments[2];
		}else if (arguments.length == 2){
			name = arguments[0];
			value = arguments[1];
		}else
			return;

		if (group)
			group[this.PROP_PREFIX + name] = value;
		else
			this.prop[this.PROP_PREFIX + name] = value;
	},

	escape: function (value){
		return value.replace ( /&/gi, '&amp;' ).replace ( /&/gi, '&nbsp;' ).replace ( /</gi, '&lt;' ).replace ( />/gi, '&gt;' ).replace ( /'/g, '&#039;' ).replace ( /"/g, '&quot;' );
	},

	outputValue: function(output, name, value){
		var cdata = false;
		var cnull = !AbCommon.isSetted(value);
		var ctype = null;

		if (cnull) value = '';
		else {
			ctype = typeof value;

			if (ctype == 'string'){
				if (value.length > 100) cdata = true;
			} else if (ctype != 'number' && ctype != 'boolean'){
				ctype = 'json';
				value = JSON.stringify(value);
				cdata = true;
			}
		}

		output.put('<' + name);
		if (cnull)
			output.put(' nul="true"');
		if (ctype)
			output.put(' type="'+ctype+'"');
		output.put('>');

		if (cdata) output.put('<![CDATA[');

		if (ctype == 'string') output.put(this.escape(value));
		else output.put(value);

		if (cdata) output.put(']]>');
		output.put('</' + name + '>');
	},

	output: function (output, group){
		for (var p in group){
			var isProp = p.indexOf(this.PROP_PREFIX) == 0;
			var isGroup = p.indexOf(this.GROUP_PREFIX) == 0;

			if (isGroup){
				var name = p.substr(this.PROP_PREFIX.length);

				output.put('<' + name + ' ptype="group">');

				this.output(output, group[p]);

				output.put('</' + name + '>');
			}else if (isProp){
				var name = p.substr(this.PROP_PREFIX.length);
				this.outputValue(output, name, group[p]);
			}

			//output.put('<prop name="' + name + '" value="' + this.prop[p] + '"/>');
		}
	},

	hasProp: function (o){
		for (var p in o)
			if (o.hasOwnProperty(p)) return true;
		return false;
	},

	serialize: function(){
		if (!this.hasProp(this.prop))
			return null;

		var output = { text: '', put: function (s) { this.text += s; } };

		output.put('<shape>');

		this.output(output, this.prop);

		output.put('</shape>');

		return output.text;
	},
};
