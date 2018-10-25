
//----------------------------------------------------------------------------------------------------------
// Notify Arguments 정의
//----------------------------------------------------------------------------------------------------------

/**
 * Notify Style Arguments
 * @typedef {Object} AbShapeStyler.NotifyStylekArgs
 * @property {Boolean} changed 변경 여부
 * @property {AbShapeStyler.NotifyStylekValue} [value] 스타일 값
 */

/**
 * Notify Value Type
 * @typedef {(String|Number|Boolean|CSS_Color|Length_Value)}
 * AbShapeStyler.NotifyStylekValue
 */

//----------------------------------------------------------------------------------------------------------
// 옵저버
//----------------------------------------------------------------------------------------------------------

/**
 * 도형 스타일러 옵저버 리스너
 * @callback AbShapeStyler.ObserveListenFunction
 * @param {AbShapeStyler} sendor Notify한 객체
 * @param {String} topic 토픽
 * @param {String} value 값
 * @param {ShapeObject} shape 도형 객체
 */

 /**
 * 도형 스타일러 옵저버 리스너 객체
 * @typedef AbShapeStyler.ObserveListenObject
 * @property {AbShapeStyler.ObserveListenFunction} styleNotify 리스너 메서드
 */

/**
 * 도형 스타일러 옵저브 리스너
 * @typedef {(AbShapeStyler.ObserveListenFunction|AbShapeStyler.ObserveListenObject)}
 * AbShapeStyler.ObserveListener 
 */

//----------------------------------------------------------------------------------------------------------
// 도형 스타일러
//----------------------------------------------------------------------------------------------------------

/**
 * 도형 스타일러
 * @class
 * @param {Object} [options] 옵션
 * @param {Object} [options.seletor=#abstyler] 스타일러 엘리먼트 선택자
 * @param {AbColorPicker} [options.colorPicker] 색상 선택기 인스턴스
 * @param {String} [options.colorPickerSelector] 색상 선택기 엘리먼트 선택자
 */
function AbShapeStyler(options){
	if (!options) options = {};

	/**
	 * 스타일러 엘리먼트 선택자
	 * @type {String}
	 */
	this.selector = options.selector || '#abstyler';

	/**
	 * 스타일러 엘리먼트 jQuery 객체
	 * @type {jQueryObject}
	 */
	this.e = $(this.selector);

	//-----------------------------------------------------------

	/**
	 * 옵저버 Notify 잠금 여부
	 * @type {Boolean}
	 */
	this.locked = false;

	/**
	 * 편집 중인 도형 객체
	 * @type {ShapeObject}
	 */
	this.shape = null;
	/**
	 * 편집 중인 도형의 스타일 편집 정보 객체
	 * @type {ShapeStyleEditInfo}
	 */
	this.styleDesc = null;

	/**
	 * 옵저버 리스너 목록
	 * @private
	 * @type {Array.<AbShapeStyler.ObserveListener>}
	 */
	this.observers = [];

	//-----------------------------------------------------------

	/**
	 * 색상 선택기
	 * @type {AbColorPicker}
	 */
	this.colorPicker = options.colorPicker && options.colorPicker instanceof AbColorPicker ? options.colorPicker : new AbColorPicker({
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

	/**
	 * 색상없음을 선택한 경우 표시명
	 * @const
	 * @type {String}
	 * @default
	 */
	NOTSET: '없음',
	/**
	 * 색상없음을 선택한 경우 배경색
	 * @const
	 * @type {CSS_Color}
	 * @default
	 */
	NOTSET_BKCOLOR: 'white',

	//-----------------------------------------------------------

	/**
	 * 옵저버 리스너를 등록합니다.
	 * @param {AbShapeStyler.ObserveListener} observer 리스너
	 */
	observe: function(observer){ this.observers.push(observer); },
	/**
	 * 옵저버 리스너를 제거합니다.
	 * @param {AbShapeStyler.ObserveListener} observer 리스너
	 */
	stopObserve: function(observer){
		var idx = this.observers.indexOf(observer);
		if (idx >= 0) this.observers.splice(idx, 1);
	},

	/**
	 * 등록된 옵저버에 Notify합니다.
	 * @param {String} topic 토픽
	 * @param {String} [value] 값
	 */
	notifyObservers: function(topic, value){
		// Styler에서 변경한 내용을 Viewer에서 History에 담아야 하기 때문에
		// Notify를 실행 큐에 전달하지 않고 바로 호출한다.

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

	/**
	 * 기본 선택상자 아이템 배열
	 * <dl>
	 * 	<dt>lineWidth</dt>
	 * 	<dd>
	 * 	선 굵기
	 * 	<table>
	 * 	<thead>
	 * 	<tr>
	 * 		<th>표시명</th><th>값</th><th>설명</th>
	 * 	</tr>
	 * 	</thead>
	 * 	<tbody>
	 * 	<tr><td>없음</td><td>0</td><td>선 없음</td></tr>
	 * 	<tr><td>1</td><td>1</td><td>1px</td></tr>
	 * 	<tr><td>2</td><td>2</td><td>2px</td></tr>
	 * 	<tr><td>3</td><td>3</td><td>3px</td></tr>
	 * 	<tr><td>4</td><td>4</td><td>4px</td></tr>
	 * 	<tr><td>5</td><td>5</td><td>5px</td></tr>
	 * 	</tbody>
	 * 	</table>
	 * 	</dd>
	 * 
	 * 	<dt>fontSize</dt>
	 * 	<dd>
	 * 	글씨 크기
	 * 	<table>
	 * 	<thead>
	 * 	<tr>
	 * 		<th>표시명</th><th>값</th><th>설명</th>
	 * 	</tr>
	 * 	</thead>
	 * 	<tbody>
	 * 	<tr><td>8</td><td>8</td><td>8px</td></tr>
	 * 	<tr><td>10</td><td>10</td><td>10px</td></tr>
	 * 	<tr><td>12</td><td>12</td><td>12px</td></tr>
	 * 	<tr><td>14</td><td>14</td><td>14px</td></tr>
	 * 	<tr><td>16</td><td>16</td><td>16px</td></tr>
	 * 	<tr><td>20</td><td>20</td><td>20px</td></tr>
	 * 	<tr><td>24</td><td>24</td><td>24px</td></tr>
	 * 	<tr><td>36</td><td>36</td><td>36px</td></tr>
	 * 	<tr><td>48</td><td>48</td><td>48px</td></tr>
	 * 	<tr><td>64</td><td>64</td><td>64px</td></tr>
	 * 	</tbody>
	 * 	</table>
	 * 	</dd>
	 * 
	 * 	<dt>font</dt>
	 * 	<dd>
	 * 	글씨체
	 * 	<table>
	 * 	<thead>
	 * 	<tr>
	 * 		<th>표시명</th><th>값</th><th>설명</th>
	 * 	</tr>
	 * 	</thead>
	 * 	<tbody>
	 * 	<tr><td>맑은 고딕</td><td>Malgun Gothic</td><td></td></tr>
	 * 	<tr><td>굴림</td><td>gulim</td><td></td></tr>
	 * 	<tr><td>돋움</td><td>Dotum</td><td></td></tr>
	 * 	<tr><td>Arial</td><td>Arial</td><td></td></tr>
	 * 	<tr><td>Courier New</td><td>Courier New</td><td></td></tr>
	 * 	<tr><td>Times New Roman</td><td>Times New Roman</td><td></td></tr>
	 * 	<tr><td>Verdana</td><td>Verdana</td><td></td></tr>
	 * 	<tr><td>Helvetica</td><td>Helvetica</td><td></td></tr>
	 * 	<tr><td>Tahoma</td><td>Tahoma</td><td></td></tr>
	 * 	</tbody>
	 * 	</table>
	 * 	</dd>
	 * 
	 * 	<dt>textAlign</dt>
	 * 	<dd>
	 * 	텍스트 정렬
	 * 	<table>
	 * 	<thead>
	 * 	<tr>
	 * 		<th>표시명</th><th>값</th><th>설명</th>
	 * 	</tr>
	 * 	</thead>
	 * 	<tbody>
	 * 	<tr><td>왼쪽</td><td>left</td><td></td></tr>
	 * 	<tr><td>중앙</td><td>center</td><td></td></tr>
	 * 	<tr><td>오른쪽</td><td>right</td><td></td></tr>
	 * 	<tr><td>맞춤</td><td>justify</td><td></td></tr>
	 * 	</tbody>
	 * 	</table>
	 * 	</dd>
	 * 
	 * 	<dt>arrow</dt>
	 * 	<dd>
	 * 	화살표 모양
	 * 	<table>
	 * 	<thead>
	 * 	<tr>
	 * 		<th>표시명</th><th>값</th><th>설명</th>
	 * 	</tr>
	 * 	</thead>
	 * 	<tbody>
	 * 	<tr><td>없음</td><td>none</td><td></td></tr>
	 * 	<tr><td>◀</td><td>triangle</td><td></td></tr>
	 * 	<tr><td>◆</td><td>diamond</td><td></td></tr>
	 * 	<tr><td>●</td><td>circle</td><td></td></tr>
	 * 	<tr><td>&lt;</td><td>bracket</td><td></td></tr>
	 * 	</tbody>
	 * 	</table>
	 * 	</dd>
	 * 
	 * 	<dt>dots</dt>
	 * 	<dd>
	 * 	대시 모양
	 * 	<table>
	 * 	<thead>
	 * 	<tr>
	 * 		<th>표시명</th><th>값</th><th>설명</th>
	 * 	</tr>
	 * 	</thead>
	 * 	<tbody>
	 * 	<tr><td>──</td><td>solid</td><td></td></tr>
	 * 	<tr><td>─ ─</td><td>dash</td><td></td></tr>
	 * 	<tr><td>- -</td><td>dot</td><td></td></tr>
	 * 	<tr><td>─ -</td><td>dash-dot</td><td></td></tr>
	 * 	<tr><td>─ - -</td><td>dash-dot-dot</td><td></td></tr>
	 * 	</tbody>
	 * 	</table>
	 * 	</dd>
	 * </dl>
	 * @param {String} type 아이템명
	 * @return {Array.<(String|Number|Boolean|SelectBoxItem)>} 선택상자 아이템 배열
	 */
	getDefaultValues: function(type){
		switch(type){
		case 'lineWidth': return [ { text: '없음', value: 0 }, 1, 2, 3, 4, 5];
		case 'fontSize': return [ 8, 10, 12, 14, 16, 20, 24, 36, 48, 64];
		case 'font': return [ { text: '맑은 고딕', value: 'Malgun Gothic' }, { text: '굴림', value: 'gulim' }, { text: '돋움', value: 'Dotum' }, 'Arial', 'Courier New', 'Times New Roman', 'Verdana', 'Helvetica', 'Tahoma', ];
		case 'textAlign': return [ { text: '왼쪽', value: 'left' }, { text: '중앙', value: 'center' }, { text: '오른쪽', value: 'right' }, { text: '맞춤', value: 'justify' }, ];
		case 'arrow': return [ { text: '없음', value: 'none' }, { text: '◀', value: 'triangle' }, { text: '◆', value: 'diamond' }, { text: '●', value: 'circle' }, { text: '&lt;', value: 'bracket' }, ];
		case 'dots': return [ { text: '──', value: 'solid' }, { text: '─ ─', value: 'dash' }, { text: '- -', value: 'dot' }, { text: '─ -', value: 'dash-dot' }, { text: '─ - -', value: 'dash-dot-dot' }, ];
		}
		return null;
	},

	//-----------------------------------------------------------

	/**
	 * 태스크 큐에 실행 함수를 등록합니다.
	 * @private
	 * @param {Function} func 실행 함수
	 * @param {Number} [delay=0] 실행 대기 시간
	 */
	exec: function(func, delay){
		if (!delay) delay = 0;
		setTimeout(func.bind(this), delay);
		//func.call(this);
	},

	//-----------------------------------------------------------

	/**
	 * 편집할 도형 객체를 설정합니다.
	 * @param {ShapeObject} shape 도형 객체
	 */
	set: function(shape){
		if (!AbCommon.isShape(shape))
			return;
	
		this.clear();

		this.shape = shape;
		
		this.prepare();
	},

	//-----------------------------------------------------------

	/**
	 * 도형 스타일러를 초기화합니다.
	 */
	clear: function(){
		this.styleDesc = null;
		this.shape = null;
		this.colorPicker.close();
		this.e.empty();
	},

	//-----------------------------------------------------------

	/**
	 * 도형 스타일러 화면을 준비합니다.
	 * @private
	 */
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
			
			var ebody = $(document.body);
			
			var targetSiz = { width: e.width(), height: e.height() };
			var winSiz = this.colorPicker.size();
			var viewSiz = { width: ebody.width(), height: ebody.height() };

			winSiz.width += 40;
			winSiz.height += 40;
			
			var x = p.x, y = p.y + targetSiz.height;
			
			if (x + winSiz.width > viewSiz.width)
				x = viewSiz.width - winSiz.width;
			
			if (y + winSiz.height > viewSiz.height)
				y = viewSiz.height - winSiz.height;

			this.colorPicker.token = element;
			this.colorPicker.open(x, y);
		}.bind(this));
		
		this.e.find('input[type="checkbox"]').change(function(event){
			var e = $(event.currentTarget);
			var topic = e.attr('abs-topic');

			var checked = e.is(':checked');

			if (!checked && !this.emptyCheck(topic))
				return;
	
			this.style(topic, checked);
		}.bind(this));

		this.e.find('input[type="text"]').keydown(function (event){
			if (event.keyCode == 13){
				$(this).trigger('change');
			}

			event.stopPropagation(); // 현재 이벤트가 상위로 전파되지 않도록 중단한다.
			event.stopImmediatePropagation(); // 현재 이벤트가 상위뿐 아니라 현재 레벨에 걸린 다른 이벤트도 동작하지 않도록 중단한다.			
		});

		this.e.find('input[type="text"]').change(function(event){
			var e = $(event.currentTarget);
			var topic = e.attr('abs-topic');
			var text = e.attr('abs-text');
			var type = e.attr('abs-type');
			var unit = e.attr('abs-unit');
			//var number = e.attr('abs-number');
			var rangeStart = e.attr('abs-range-start');
			var rangeEnd = e.attr('abs-range-end');
			var trim = e.attr('abs-trim');
			var notempty = e.attr('abs-notempty');
			var value = e.val();

			value = this.typeValue(type, value);
			if (trim === 'true')
				value = $.trim(value);

			if (notempty === 'true' && !value){
				value = this.style(topic);
				e.val(this.input(value, type, unit));

				this.alert(text+'을(를) 입력하세요');
				return;
			}

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

	/**
	 * 색상 선택기에서 Notify한 내용을 처리합니다.
	 * @param {AbColorPicker} sender Notify한 객체
	 * @param {String} topic 토픽
	 * @param {String} value 값
	 * @param {*} token 토큰
	 */
	notify: function (sender, topic, value, token){
		if (!this.shape || this.locked === true) return;
		
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

	/**
	 * 필수 스타일로 지정된 필드가 설정되어 있는 지 검사합니다.
	 * @param {ObjectPathString} emptyTopic 현재 스타일 필드 경로
	 * @return {Boolean} 설정되어 있으면 true
	 */
	emptyCheck: function(emptyTopic){
		if (!$.isArray(this.styleDesc.select))
			return true;
		
		if ($.inArray(emptyTopic, this.styleDesc.select) < 0)
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

	/**
	 * 옵저버 리스너에 Notify 하지 않게 설정합니다.
	 */
	lock: function() { this.locked = true; },
	/**
	 * 옵저버 리스너에 Notify 하게 설정합니다.
	 */
	unlock: function() { this.locked = false; },

	//-----------------------------------------------------------

	/**
	 * 알림창을 표시합니다.
	 * @private
	 * @param {String} s 메시지
	 */
	alert: function (s){
		alert(s);
		//AbMsgBox.warning(s);
	},

	//-----------------------------------------------------------

	/**
	 * 스타일 객체 탐색 결과
	 * @typedef {Object} AbShapeStyler.styleObjectResult
	 * @property {Object} style 상위 스타일 객체
	 * @property {String} leap 스타일 필드 경로 중 마지막
	 */

	/**
	 * 스타일 객체를 탐색합니다.
	 * @private
	 * @param {ObjectPathString} topic 스타일 필드 경로
	 * @return {AbShapeStyler.styleObjectResult}
	 */
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

	/**
	 * 스타일 편집 정보 탐색 결과
	 * @typedef {Object} AbShapeStyler.descObjectResult
	 * @property {(ShapeStyleFieldGroupEditInfo|ShapeStyleFieldEditInfo)} desc 편집 정보 객체
	 * @property {String} text 스타일 필드 표시명 경로
	 */

	/**
	 * 스타일 편집 정보를 탐색합니다.
	 * @private
	 * @param {ObjectPathString} topic 스타일 필드 경로
	 * @param {String} [token=' '] 상위 정보와의 표시명 구분자
	 * @return {AbShapeStyler.descObjectResult}
	 */
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

	/**
	 * 도형 객체의 스타일을 설정하거나 가져옵니다.
	 * @private
	 * @param {ObjectPathString} [topic] 스타일 필드 경로
	 * @param {AbShapeStyler.NotifyStylekValue} [value] 스타일 값
	 * @return {AbShapeStyler.NotifyStylekValue} 스타일 값
	 */
	style: function(topic, value){
		if (!this.shape)
			return false;

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

	/**
	 * 엘리먼트의 위치를 가져옵니다.
	 * <p>* 상위 엘리먼트의 스크롤 위치를 반영합니다.
	 * @private
	 * @param {jQueryObject} e HTML 엘리먼트 jQuery 객체
	 * @return {Point}
	 */
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

	/**
	 * 스타일 필드 편집기를 생성합니다.
	 * @private
	 * @param {Object} parent 부모 엘리먼트 정보
	 * @param {jQueryObject} parent.e 부모 엘리먼트 jQuery 객체
	 * @param {ObjectPathString} [parent.topic] 부모 스타일 필드 경로
	 * @param {Array.<(ShapeStyleFieldGroupEditInfo|ShapeStyleFieldEditInfo)>} descs 스타일 필드 편집 정보
	 * @param {Object} style 도형 스타일 객체
	 * @return {Number} 생성된 필드 개수
	 */
	createTopics: function(parent, descs, style){
		var descSiz = descs.length, cnt=0;
		var psingle = false, single = false, nsingle = false;

		for (var i=0; i < descSiz; i++){
			var d = descs[i];
			var nd = i + 1 < descSiz ? descs[i + 1] : null;
			var topic = parent.topic ? parent.topic +'.'+d.name : d.name;

			var e = null;

			nsingle = false;

			if ($.isArray(d.childs)){
				e = this.createGroup(topic, d);

				if (this.createTopics({ topic: topic, e: e }, d.childs, style[d.name]) == 0)
					e = null;

				single = false;
			}else{
				switch(d.style){
				case 'check': single = true; break;
				default: single = false; break;
				}

				if (nd){
					switch(nd.style){
					case 'check': nsingle = true; break;
					default: nsingle = false; break;
					}
				}

				var options = {
					beginSingle: false,
					endSingle: false
				};

				if (single){
					if (!psingle) options.beginSingle = true;
					if (!nsingle) options.endSingle = true;
				}

				switch(d.style){
				case 'color': e = this.createColor(topic, d, style[d.name], options); break;
				case 'select': e = this.createSelect(topic, d, style[d.name], options); break;
				case 'check': e = this.createCheck(topic, d, style[d.name], options); break;
				case 'text': e = this.createText(topic, d, style[d.name], options); break;
				}

			}

			psingle = single;

			if (e){
				parent.e.append(e);
				cnt++;
			}
		}
		return cnt;
	},

	/**
	 * abs-topic 속성이 있는 엘리먼트를 가져옵니다.
	 * @private
	 * @param {String} topic 토픽
	 * @return {jQueryObject}
	 */
	inputElement: function (topic){ return this.e.find('[abs-topic="'+topic+'"]'); },

	//-----------------------------------------------------------

	/**
	 * 스타일 필드 엘리먼트를 생성합니다.
	 * @private
	 * @param {String} topic 스타일 필드명
	 * @param {(ShapeStyleFieldGroupEditInfo|ShapeStyleFieldEditInfo)} d 스타일 편집 정보
	 * @param {Object} [options] 필드 생성 옵션
	 * @property {String} [options.fieldCss=''] CSS 스타일명
	 * @property {Boolean} [options.textNode=true] 필드 표시명 표시 여부, false면 표시명을 표시하지 않습니다.
	 * @return {jQueryObject} 생성된 엘리먼트 jQuery 객체
	 */
	createField: function (topic, d, options){
		if (!options) options = {};
		if (!AbCommon.isBool(options.textNode)) options.textNode = true;

		var fieldCss = options.fieldCss || '';

		var e = $('<div class="abstyler-field '+fieldCss+'"/>');

		if (d.text && options.textNode){
			var le = $('<div class="abstyler-field-text"/>');
			le.text(d.text);

			e.append(le);
		}

		return e;
	},

	//-----------------------------------------------------------

	/**
	 * 스타일 그룹을 생성합니다.
	 * @private
	 * @param {String} topic 스타일 필드명
	 * @param {ShapeStyleFieldGroupEditInfo} d 스타일 편집 정보
	 * @param {Object} style 도형 스타일 객체
	 * @return {jQueryObject} 생성된 엘리먼트 jQuery 객체
	 */
	createGroup: function(topic, d, style){
		var e = $('<fieldset class="abstyler-group" abs-kind="group"/>');
		e.attr('abs-topic', topic);

		var ce = $('<legend/>');

		ce.text(d.text);
		e.append(ce);

		return e;
	},

	/**
	 * 색상 필드를 생성합니다.
	 * @private
	 * @param {String} topic 스타일 필드명
	 * @param {ShapeStyleColorFieldEditInfo} d 스타일 편집 정보
	 * @param {Object} style 도형 스타일 객체
	 * @return {jQueryObject} 생성된 엘리먼트 jQuery 객체
	 */
	createColor: function(topic, d, style, options){
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

	/**
	 * 색상 정보를 업데이트 합니다.
	 * @private
	 * @param {String} topic 스타일 필드명
	 * @param {ShapeStyleColorFieldEditInfo} d 스타일 편집 정보
	 * @param {Object} style 도형 스타일 객체
			
	 */
	updateColor: function(topic, d, style, options){
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

	/**
	 * 선택상자 필드를 생성합니다.
	 * @private
	 * @param {String} topic 스타일 필드명
	 * @param {ShapeStyleSelectFieldEditInfo} d 스타일 편집 정보
	 * @param {Object} style 도형 스타일 객체
	 * @return {jQueryObject} 생성된 엘리먼트 jQuery 객체
	 */
	createSelect: function(topic, d, style, options){
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

	/**
	 * 선택상자 필드를 업데이트합니다.
	 * @private
	 * @param {String} topic 스타일 필드명
	 * @param {ShapeStyleSelectFieldEditInfo} d 스타일 편집 정보
	 * @param {Object} style 도형 스타일 객체
	 */
	updateSelect: function(topic, d, style, options){
		var e = this.inputElement(topic);
		
		e.val(style);
	},

	/**
	 * 체크 필드를 생성합니다.
	 * @private
	 * @param {String} topic 스타일 필드명
	 * @param {ShapeStyleCheckFieldEditInfo} d 스타일 편집 정보
	 * @param {Object} style 도형 스타일 객체
	 * @param {Object} [options] 생성 옵션
	 * @param {Boolean} [options.beginSingle=true] 현재 필드가 연속된 체크 필드 중에서 시작인지 여부
	 * @param {Boolean} [options.endSingle=true] 현재 필드가 연속된 체크 필드 중에서 마지막인지 여부
	 * @return {jQueryObject} 생성된 엘리먼트 jQuery 객체
	 */
	createCheck: function(topic, d, style, options){
		var fieldCss = ['abstyler-single-field'];
		var beginSingle = options && options.beginSingle === true ? true : false;
		var endSingle = options && options.endSingle === true ? true : false;

		if (beginSingle === true)
			fieldCss.push('abstyler-begin-single-field');
		else if (endSingle === true)
			fieldCss.push('abstyler-end-single-field');
		else
			fieldCss.push('abstyler-next-single-field');


		var fe = this.createField(topic, d, {
			textNode: false,
			fieldCss: fieldCss.join(' '),
		});

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

	/**
	 * 체크 필드를 업데이트합니다.
	 * @private
	 * @param {String} topic 스타일 필드명
	 * @param {ShapeStyleCheckFieldEditInfo} d 스타일 편집 정보
	 * @param {Object} style 도형 스타일 객체
	 */
	updateCheck: function(topic, d, style, options){
		var e = this.inputElement(topic);

		e.attr('checked', style ? true : false);
	},

	/**
	 * 입력 필드를 생성합니다.
	 * @private
	 * @param {String} topic 스타일 필드명
	 * @param {ShapeStyleTextFieldEditInfo} d 스타일 편집 정보
	 * @param {Object} style 도형 스타일 객체
	 * @return {jQueryObject} 생성된 엘리먼트 jQuery 객체
	 */
	createText: function(topic, d, style, options){
		var fe = this.createField(topic, d);

		var e = $('<input type="text" class="abstyler-input" abs-kind="text"/>');
		e.attr('abs-topic', topic);
		e.attr('abs-text', d.text);

		if (d.size) {
			e.css('width', 'auto');
			e.attr('size', d.size);
		}

		if (AbCommon.isBool(d.trim)) e.attr('abs-trim', d.trim);
		if (AbCommon.isBool(d.notempty)) e.attr('abs-notempty', d.notempty);

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

	/**
	 * 입력 필드를 업데이트합니다.
	 * @private
	 * @param {String} topic 스타일 필드명
	 * @param {ShapeStyleTextFieldEditInfo} d 스타일 편집 정보
	 * @param {Object} style 도형 스타일 객체
	 */
	updateText: function(topic, d, style, options){
		var e = this.inputElement(topic);
		var type = e.attr('abs-type');
		var unit = e.attr('abs-unit');

		value = this.input(style, type, unit);

		e.val(value);
	},

	//-----------------------------------------------------------

	/**
	 * 타입에 따른 값을 가져옵니다.
	 * @private
	 * @param {String} type 타입 (number|number-unit|boolean)
	 * @param {*} value 값
	 * @return {(Number|Boolean|String)} number|number-unit=숫자형 값, boolean=부울형 값을 리턴합니다.
	 */
	typeValue: function (type, value){
		switch (type){
		case 'number-unit':
		case 'number': value = parseFloat(value); break;
		case 'boolean': value = value == 'true'; break;
		}
		return value;
	},

	/**
	 * 단위와 타입에 맞는 입력 값을 가져옵니다.
	 * <p>* 단위가 %이면 값에 100을 곱합니다.
	 * @private
	 * @param {String} type 타입 (number|number-unit|boolean)
	 * @param {*} value 값
	 * @param {String} unit 단위
	 * @return {(Number|Boolean|String)} number|number-unit=숫자형 값, boolean=부울형 값을 리턴합니다.
	 */
	input: function(value, type, unit){
		if (unit == '%')
			return parseFloat(value) * 100;
		return type == 'number' || type == 'number-unit' ? parseFloat(value) : type == 'boolean' ? value == 'true' : value;
	},

	/**
	 * 단위와 타입에 맞는 출력 값을 가져옵니다.
	 * <p>* 단위가 %이면 값을 100으로 나눕니다.
	 * @private
	 * @param {String} type 타입 (number|number-unit|boolean)
	 * @param {*} value 값
	 * @param {String} unit 단위
	 * @return {(Number|Boolean|String)} number=숫자형 값, number-unit=문자열 값, boolean=부울형 값에 단위를 붙여 리턴합니다.<p>* 단위가 있으면 문자열 값을 리턴합니다.
	 */
	output: function (value, type, unit){
		if (unit == '%')
			return (parseFloat(value) / 100);
		return type == 'number' ? parseFloat(value) : type == 'boolean' ? value == 'true' : (unit ? value + unit : value);
	},
	
	//-----------------------------------------------------------

	/**
	 * 도형 스타일의 정보로 스타일 필드들을 업데이트합니다.
	 */
	update: function(){
		this.updateTopics(null, this.styleDesc.descs, this.shape.style);
	},

	/**
	 * 스타일 필드들을 업데이트합니다.
	 * @private
	 * @param {ObjectPathString} parentTopic 부모 스타일 필드 경로
	 * @param {Array.<(ShapeStyleFieldGroupEditInfo|ShapeStyleFieldEditInfo)>} descs 스타일 편집 정보 배열
	 * @param {Object} style 도형 스타일 객체
	 */
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
