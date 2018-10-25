/**
 * 속성값 타입
 * <p>* 타입이 Object 이라면 JSON 형식으로 인코딩됩니다.
 * @typedef {(Number|Boolean|String|Object)} AbShapeSerializer.Value
 */

/**
 * 도형 정보 XML 문자열 변환 도구
 * @class
 */
function AbShapeSerializer(){
	/**
	 * 속성 정보 맵
	 * @private
	 */
	this.prop = {};
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbShapeSerializer.prototype = {
	constructor: AbShapeSerializer,

	//-----------------------------------------------------------

	/**
	 * 그룹 정보 필드명 접두사
	 * @private
	 * @const
	 * @default
	 */
	GROUP_PREFIX: 'g-',
	/**
	 * 속성 정보 필드명 접두사
	 * @private
	 * @const
	 * @default
	 */
	PROP_PREFIX: 'p-',

	//-----------------------------------------------------------

	/**
	 * 그룹을 추가합니다.
	 * @param {(String|Object)} 0 그룹명 또는 그룹 객체
	 * @param {String} [1] 그룹명
	 * @return {Object} 그룹 객체
	 * 
	 * @example <caption>최상위에 그룹을 추가할 때</caption>
	 * var styleGroup = serializer.addGroup('style');
	 * serializer.add(styleGroup, 'color', '#aaaaaa');
	 * 
	 * @example <caption>그룹에 하위 그룹을 추가할 때</caption>
	 * var styleSubGroup = serializer.addGroup(styleGroup, 'sub');
	 * serializer.add(styleSubGroup, 'color', '#aaaaaa');
	 */
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

	/**
	 * 속성을 추가합니다.
	 * @param {(String|Object)} 0 속성명 또는 그룹 객체
	 * @param {(AbShapeSerializer.Value|String)} [1] 속성값 또는 속성명
	 * @param {AbShapeSerializer.Value} [2] 속성값
	 * 
	 * @example <caption>최상위에 속성을 추가할 때</caption>
	 * serializer.add('angle', 180);
	 * 
	 * @example <caption>그룹에 속성을 추가할 때</caption>
	 * var styleGroup = serializer.addGroup('style');
	 * serializer.add(styleGroup, 'color', '#aaaaaa');
	 */
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

	/**
	 * 문자열을 HTML 엔티티롤 인코딩합니다.
	 * @private
	 * @param {String} value 문자열
	 * @return {String} 인코딩된 문자열
	 */
	escape: function (value){
		return value.replace ( /&/gi, '&amp;' ).replace ( /&/gi, '&nbsp;' ).replace ( /</gi, '&lt;' ).replace ( />/gi, '&gt;' ).replace ( /'/g, '&#039;' ).replace ( /"/g, '&quot;' );
	},

	/**
	 * 속성 정보를 XML 문자열로 변환합니다.
	 * @private
	 * @param {Object} output 출력 객체
	 * @param {String} name 속성명
	 * @param {AbShapeSerializer.Value} value 속성값
	 */
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

	/**
	 * 그룹 정보와 속성 정보를 XML 문자열로 변환합니다.
	 * @private
	 * @param {Object} output 출력 객체
	 * @param {Object} group 그룹 객체
	 */
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

	/**
	 * 객체에 필드가 있는 지 확인합니다.
	 * @private
	 * @param {Object} o 객체
	 * @return {Boolean} 필드가 있으면 true
	 */
	hasProp: function (o){
		for (var p in o)
			if (o.hasOwnProperty(p)) return true;
		return false;
	},

	/**
	 * 등록된 속성 정보들을 XML 문자열로 변환합니다.
	 * @return {String} XML 문자열
	 */
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
