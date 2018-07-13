function AbShapeStyler(options){
	if (!options) options = {};

	this.selector = options.selector || '#abstyler';

	this.e = $(this.selector);

	//-----------------------------------------------------------

	this.shape = null;
	this.styleDesc = null;

	this.observers = [];

	//-----------------------------------------------------------

	this.colorPicker = new AbColorPicker({
		selector: options.colorPickerSelector,
	});

	this.colorPicker.observe(this);

	this.hasHandler = function(e){
		var target = $(this.colorPicker.token);
		if (!(target.has(e.target).length || this.colorPicker.has(e.target)))
			this.colorPicker.close();
	}.bind(this);
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeStyler.prototype = {
	constructor: AbShapeStyler,

	//-----------------------------------------------------------

	NOTSET: '없음',
	NOTSET_BKCOLOR: 'white',

	//-----------------------------------------------------------

	observe: function(observer){ this.observers.push(observer); },
	stopObserve: function(observer){
		var idx = this.observers.indexOf(observer);
		if (idx >= 0) this.observers.splice(idx, 1);
	},

	// Styler에서 변경한 내용을 Viewer에서 History에 담아야 하기 때문에
	// Notify를 실행 큐에 전달하지 않고 바로 호출한다.
	notifyObservers: function(topic, value){
		var len = this.observers.length;
		for (var i=0; i < len; i++){
			var o = this.observers[i];

			if (typeof o == 'function')
				o(this, topic, value, this.shape);
			else if (typeof o.styleNotify == 'function')
				o.styleNotify(this, topic, value, this.shape);
		}
	},

	//-----------------------------------------------------------

	getDefaultValues: function(type){
		switch(type){
		case 'lineWidth': return [ { text: '없음', value: 0 }, 1, 2, 3, 4, 5];
		case 'fontSize': return [ 8, 10, 12, 14, 16, 20, 24, 36, 48, 64];
		case 'font': return [ { text: '맑은 고딕', value: 'Malgun Gothic' }, { text: '굴림', value: 'gulim' }, { text: '돋움', value: 'Dotum' }, 'Arial', 'Courier New', 'Times New Roman', 'Verdana', 'Helvetica', 'Tahoma', ];
		}
		return null;
	},

	//-----------------------------------------------------------

	exec: function(func, delay){
		if (!delay) delay = 0;
		setTimeout(func.bind(this), delay);
		//func.call(this);
	},

	//-----------------------------------------------------------

	set: function(shape){
		if (!AbCommon.isShape(shape))
			return;
	
		this.clear();

		this.shape = shape;
		
		this.prepare();
	},

	//-----------------------------------------------------------

	clear: function(){
		this.styleDesc = null;
		this.shape = null;
		this.colorPicker.close();
		this.e.empty();
	},

	//-----------------------------------------------------------

	prepare: function(){
		this.styleDesc = this.shape.styleDesc();

		this.createTopics({ e: this.e }, this.styleDesc.descs, this.shape.style);

		//-----------------------------------------------------------

		this.e.find('select').change(function(event){
			var e = $(event.currentTarget);
			var topic = e.attr('abs-topic');
			var type = e.attr('abs-type');
			var unit = e.attr('abs-unit');
			var value = this.typeValue(type, e.val());

			if (!value)
				if (!this.emptyCheck(topic))
					return;

			this.style(topic, this.output(value, type, unit));
		}.bind(this));

		this.e.find('div[abs-kind="color"]').click(function(event){
			var element = event.currentTarget;
			var e = $(element);
			var p = this.getPoint(e);

			if (this.colorPicker.opened() && this.colorPicker.token && this.colorPicker.token == element){
				this.colorPicker.close();
				return;
			}

			var topic = e.attr('abs-topic');
			var alpha = e.attr('abs-alpha') == 'false' ? 1 : false;
			var notset = e.attr('abs-notset') == 'false' ? false : true;

			this.colorPicker.lockAlpha(alpha);
			this.colorPicker.enableNotset(notset);

			var color = e.attr('abs-color');
			if (color)
				this.colorPicker.setColor(color);

			this.colorPicker.token = element;
			this.colorPicker.open(p.x, p.y + e.height());
		}.bind(this));
		
		this.e.find('input[type="checkbox"]').change(function(event){
			var e = $(event.currentTarget);
			var topic = e.attr('abs-topic');

			var checked = e.is(':checked');

			if (!checked && !this.emptyCheck(topic))
				return;
	
			this.style(topic, checked);
		}.bind(this));

		this.e.find('input[type="text"]').change(function(event){
			var e = $(event.currentTarget);
			var topic = e.attr('abs-topic');
			var type = e.attr('abs-type');
			var unit = e.attr('abs-unit');
			//var number = e.attr('abs-number');
			var rangeStart = e.attr('abs-range-start');
			var rangeEnd = e.attr('abs-range-end');
			var value = e.val();

			value = this.typeValue(type, value);

			if (rangeStart || rangeEnd){
				var sr = this.typeValue(type, rangeStart);
				var er = this.typeValue(type, rangeEnd);

				if (rangeStart && value < sr){
					value = this.style(topic);
					e.val(this.input(value, type, unit));

					this.exec(function(){
						this.alert('값은 '+sr+'보다 커야 합니다');
					});
					return;
				}

				if (rangeEnd && value > er){
					value = this.style(topic);
					e.val(this.input(value, type, unit));

					this.exec(function(){
						this.alert('값은 '+er+'보다 작아야 합니다');
					});
					return;
				}
			}

			if (!value && !this.emptyCheck(topic))
				return;
			
			this.style(topic, this.output(value, type, unit));
		}.bind(this));
	},

	//-----------------------------------------------------------

	// observe color picker
	notify: function (sender, topic, value, token){
		switch(topic){
		case 'color':
			var e = $(token);
			var ce = e.find('div');
			var abTopic = e.attr('abs-topic');

			if (value){
				e.attr('abs-color', value);
				ce.css('background-color', value);
				ce.text('');
			}else{
				e.attr('abs-color', '');
				ce.css('background-color', this.NOTSET_BKCOLOR);
				ce.text(this.NOTSET);

				if (!this.emptyCheck(abTopic))
					return;
			}

			this.style(abTopic, value);
			break;
		case 'open':
			$(document).on('click', this.hasHandler);
			break;
		case 'close':
			$(document).off('click', this.hasHandler);
			break;
		}
	},

	//-----------------------------------------------------------

	emptyCheck: function(emptyTopic){
		if (!$.isArray(this.styleDesc.select))
			return true;
		
		var len = this.styleDesc.select.length;
		for (var i=0; i < len; i++){
			var topic = this.styleDesc.select[i];
			if (topic == emptyTopic)
				continue;
			
			var value = this.style(topic);
			if (!value){
				var e = this.descObject(emptyTopic);
				var o = this.descObject(topic);

				var msgFormat = '';
				switch(e.desc.style){
				case 'color': msgFormat = e.text+' 색상을 선택해야 합니다'; break;
				case 'select': msgFormat = e.text+'(을)를 선택해야 합니다'; break;
				case 'check': msgFormat = e.text+'(을)를 선택해야 합니다'; break;
				case 'text': msgFormat = e.text+'(을)를 입력해야 합니다'; break;
				}

				if (msgFormat){
					this.update();
					
					this.exec(function(){
						this.alert(msgFormat);
					});

					return false;
				}else{
					break;
				}
			}
		}

		return true;
	},

	//-----------------------------------------------------------

	alert: function (s){
		//alert(s);
		AbMsgBox.warning(s);
	},

	//-----------------------------------------------------------

	styleObject: function(topic){
		var o = this.shape.style;
		var path = topic.split('.'), idx = 0;
		var pathSiz = path.length - 1, leap = path[path.length - 1];
		while (idx < pathSiz){
			o = o[path[idx]];
			idx++;
		}
		return {
			style: o,
			leapTopic: leap
		};
	},

	descObject: function(topic, token){
		if (arguments.length <= 1) token = ' ';

		var o = this.styleDesc.descs;
		var path = topic.split('.'), idx = 0;
		var pathSiz = path.length;
		var text = '', name = '';
		while (idx < pathSiz){
			var list = o.childs || o;
			var len = list.length, found = null;
			for (var i=0; i < len; i++){
				if (list[i].name == path[idx]){
					found = list[i];
					break;
				}
			}

			if (!found) return null;

			o = found;

			if (idx == 0){
				text = o.text;
			}else{
				text += token + o.text;
			}

			idx++;
		}
		return {
			text: text,
			desc: o,
		};
	},

	style: function(topic, value){
		var r = this.styleObject(topic);

		if (arguments.length == 2){
			if (r.style[r.leapTopic] == value)
				return false;

			this.notifyObservers(topic, { changed: false });

			r.style[r.leapTopic] = value;

			this.notifyObservers(topic, { changed: true, value: value });
			return true;
		}

		return r.style[r.leapTopic];
	},

	//-----------------------------------------------------------

	getPoint: function (e){
		var element = e.get(0);
		var box = AbCommon.getBounds(element);
		var scr = AbCommon.scrolledParents(e);

		return {
			x: box.left - scr.x,
			y: box.top - scr.y,
		};
	},

	//-----------------------------------------------------------

	createTopics: function(parent, descs, style){
		var descSiz = descs.length, cnt=0;
		for (var i=0; i < descSiz; i++){
			var d = descs[i];
			var topic = parent.topic ? parent.topic +'.'+d.name : d.name;

			var e = null;
			if ($.isArray(d.childs)){
				e = this.createGroup(topic, d);

				if (this.createTopics({ topic: topic, e: e }, d.childs, style[d.name]) == 0)
					e = null;
			}else{
				switch(d.style){
				case 'color': e = this.createColor(topic, d, style[d.name]); break;
				case 'select': e = this.createSelect(topic, d, style[d.name]); break;
				case 'check': e = this.createCheck(topic, d, style[d.name]); break;
				case 'text': e = this.createText(topic, d, style[d.name]); break;
				}
			}

			if (e){
				parent.e.append(e);
				cnt++;
			}
		}
		return cnt;
	},

	inputElement: function (topic){ return this.e.find('[abs-topic="'+topic+'"]'); },

	//-----------------------------------------------------------

	createField: function (topic, d, needTextNode){
		if (!AbCommon.isBool(needTextNode)) needTextNode = true;

		var e = $('<div class="abstyler-field"/>');

		if (d.text && needTextNode){
			var le = $('<div class="abstyler-field-text"/>');
			le.text(d.text);

			e.append(le);
		}

		return e;
	},

	//-----------------------------------------------------------

	createGroup: function(topic, d, style){
		var e = $('<fieldset class="abstyler-group" abs-kind="group"/>');
		e.attr('abs-topic', topic);

		var ce = $('<legend/>');

		ce.text(d.text);
		e.append(ce);

		return e;
	},

	createColor: function(topic, d, style){
		var fe = this.createField(topic, d);

		var e = $('<div class="abstyler-input" abs-kind="color"/>');
		e.attr('abs-topic', topic);
		e.attr('abs-color', style);

		if (AbCommon.isBool(d.alpha)) e.attr('abs-alpha', d.alpha);
		if (AbCommon.isBool(d.notset)) e.attr('abs-notset', d.notset);

		var ce = $('<div/>');
		if (style)
			ce.css('background-color', style);
		else{
			ce.css('background-color', this.NOTSET_BKCOLOR);
			ce.text(this.NOTSET);
		}

		e.append(ce);
		fe.append(e);
		return fe;
	},

	updateColor: function(topic, d, style){
		var e = this.inputElement(topic);

		e.attr('abs-color', style);
		var ce = e.children(":first");
		
		if (style){
			ce.css('background-color', style);
			ce.text('');
		}else{
			ce.css('background-color', this.NOTSET_BKCOLOR);
			ce.text(this.NOTSET);
		}
	},

	createSelect: function(topic, d, style){
		var fe = this.createField(topic, d);

		var ecover = $('<div class="custom-select"/>')

		var e = $('<select class="abstyler-input" abs-kind="select"/>');
		e.attr('abs-topic', topic);

		if (d.type) e.attr('abs-type', d.type);
		if (d.unit) e.attr('abs-unit', d.unit);

		if (d.values){
			var values = null;

			if (AbCommon.isString(d.values)) values = this.getDefaultValues(d.values);
			else values = d.values;

			if ($.isArray(values)){
				var len = values.length, value = null, oe = null, html = '';
				for (var i=0; i < len; i++){
					value = values[i];

					if (AbCommon.isString(value)){
						var output = this.output(value, d.type, d.unit);

						html += '<option ';
						if (style && style.toLowerCase() === output.toLowerCase())
							html += ' selected="selected" ';
						html += 'value="' + AbCommon.escape(value+'') + '">' + value + '</option>';
					}else if (AbCommon.isBool(value) || AbCommon.isNumber(value)){
						var output = this.output(value, d.type, d.unit);

						html += '<option ';
						if (style && style === output)
							html += ' selected="selected" ';
						html += 'value="' + AbCommon.escape(value+'') + '">' + value + '</option>';						
					}else if (value && (AbCommon.isSetted(value.value) || AbCommon.isSetted(value.text))){
						var output = this.output(value.value, d.type, d.unit);
						var setted = AbCommon.isSetted(value.value);

						html += '<option ';
						if (setted && style === value.value)
							html += ' selected="selected" ';

						if (setted)
							html += 'value="' + AbCommon.escape(value.value) + '"'
						html += '>'+ value.text + '</option>';
					}
				}

				e.append(html);
			}
		}

		ecover.append(e);
		fe.append(ecover);

		return fe;
	},

	updateSelect: function(topic, d, style){
		var e = this.inputElement(topic);
		
		e.val(style);
	},

	createCheck: function(topic, d, style){
		var fe = this.createField(topic, d, false);

		var e = $('<label/>');
		var ce = $('<input type="checkbox" class="abstyler-input" abs-kind="check"/>');
		var cme = $('<div class="checkmark"/>');
		ce.attr('abs-topic', topic);

		if (style) ce.attr('checked', true);
		
		e.append(document.createTextNode(d.text));
		e.append(ce);
		e.append(cme);

		fe.append(e);
		return fe;
	},

	updateCheck: function(topic, d, style){
		var e = this.inputElement(topic);

		e.attr('checked', style ? true : false);
	},

	createText: function(topic, d, style){
		var fe = this.createField(topic, d);

		var e = $('<input type="text" class="abstyler-input" abs-kind="text"/>');
		e.attr('abs-topic', topic);

		if (d.range) {
			if (AbCommon.isSetted(d.range.start)) e.attr('abs-range-start', d.range.start);
			if (AbCommon.isSetted(d.range.end)) e.attr('abs-range-end', d.range.end);
		}
		if (d.type) e.attr('abs-type', d.type);
		if (d.unit) e.attr('abs-unit', d.unit);
		if (d.number) e.attr('abs-number', d.number);

		if (style)
			e.val(this.input(style, d.type, d.unit));

		fe.append(e);

		if (d.unit){
			var ue = $('<span class="abstyler-input-suffix"/>');
			ue.text(d.unit);

			fe.append(ue);
		}
		
		return fe;
	},

	updateText: function(topic, d, style){
		var e = this.inputElement(topic);
		var type = e.attr('abs-type');
		var unit = e.attr('abs-unit');

		value = this.output(value, type, unit);

		e.val(style);
	},

	//-----------------------------------------------------------

	typeValue: function (type, value){
		switch (type){
		case 'number': value = parseFloat(value); break;
		case 'boolean': value = value == 'true'; break;
		}
		return value;
	},

	input: function(value, type, unit){
		if (unit == '%')
			return parseFloat(value) * 100;
		return type == 'number' ? parseFloat(value) : type == 'boolean' ? value == 'true' : value;
	},

	output: function (value, type, unit){
		if (unit == '%')
			return (parseFloat(value) / 100);
		return type == 'number' ? parseFloat(value) : type == 'boolean' ? value == 'true' : (unit ? value + unit : value);
	},
	
	//-----------------------------------------------------------

	update: function(){
		this.updateTopics(null, this.styleDesc.descs, this.shape.style);
	},

	updateTopics: function(parentTopic, descs, style){
		var descSiz = descs.length;
		for (var i=0; i < descSiz; i++){
			var d = descs[i];
			var topic = parentTopic ? parentTopic +'.'+d.name : d.name;

			if ($.isArray(d.childs)){
				this.updateTopics(topic, d.childs, style[d.name]);
			}else{
				var value = style[d.name];

				switch(d.style){
				case 'color': this.updateColor(topic, d, style[d.name]); break;
				case 'select': this.updateSelect(topic, d, style[d.name]); break;
				case 'check': this.updateCheck(topic, d, style[d.name]); break;
				case 'text': this.updateText(topic, d, style[d.name]); break;
				}
			}
		}
	},
};
