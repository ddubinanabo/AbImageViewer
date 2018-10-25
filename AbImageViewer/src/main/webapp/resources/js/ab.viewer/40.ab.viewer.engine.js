
//----------------------------------------------------------------------------------------------------------
// Notify Arguments 정의
//----------------------------------------------------------------------------------------------------------

/**
 * Notify (show) Arguments
 * @typedef {Object} AbViewerEngine.NotifyShowArgs
 * @property {String} type all 또는 도형 구분 (ShapeObject.type)
 * @property {Boolean} show 표시 여부
 */

/**
 * Notify (rotate) Arguments
 * @typedef {Object} AbViewerEngine.NotifyRotateArgs
 * @property {Number} from 변경 전 각도
 * @property {Number} to 변경 후 각도
 */

/**
 * Notify (history.sync) Arguments
 * @typedef {Object} AbViewerEngine.NotifyHistorySyncArgs
 * @property {String} topic 토픽 (shape|page)
 * @property {String} cmd 명령어 (add|remove|update 등등)
 * @property {String} docmd 수행명령어 (undo|redo)
 * @property {AbHistory.HistorySyncArgs} data 데이터
 * <p>* 동작에 따라 유형이 달라집니다.
 */

/**
 * 페이지 인덱스 정보
 * @typedef {Object} AbViewerEngine.NotifyPageIndexArgs
 * @property {Number} index 페이지 인덱스
 * @property {AbPage} page 페이지
 */

/**
 * Notify (page.remove) Arguments
 * @typedef {Array.<AbViewerEngine.NotifyPageIndexArgs>}
 * AbViewerEngine.NotifyPageIndexListArgs
 */

/**
 * Notify (modified) Arguments
 * @typedef {(String|Array.<Number>)} AbViewerEngine.NotifyModifiedArgs
 */


//----------------------------------------------------------------------------------------------------------
// 도형 객체 정의
//----------------------------------------------------------------------------------------------------------

/**
 * 도형 객체
 * <p>* 도형 객체는 {@link AbShapeObject}을 상속받거나 다음 필드/메서드가 정의되어 있는 객체를 말합니다.
 * <table>
 * <thead>
 * <tr>
 * 	<th>필드/메서드</th><th>비고</th>
 * </tr>
 * </thead>
 * <tbody>
 * <tr><td>name</td><td></td></tr>
 * <tr><td>type</td><td></td></tr>
 * <tr><td>shapeType</td><td></td></tr>
 * <tr><td>shapeStyle</td><td></td></tr>
 * <tr><td>token</td><td></td></tr>
 * <tr><td>selected</td><td></td></tr>
 * <tr><td>focused</td><td></td></tr>
 * <tr><td>indicator</td><td></td></tr>
 * <tr><td>angle</td><td></td></tr>
 * <tr><td>style</td><td></td></tr>
 * 
 * <tr><td>creationSize</td><td>&lt;optinoal&gt;</td></tr>
 * <tr><td>collectPoints</td><td>&lt;optinoal&gt;</td></tr>
 * 
 * <tr><td>move()</td><td></td></tr>
 * <tr><td>styleDesc()</td><td></td></tr>
 * <tr><td>setAngle()</td><td></td></tr>
 * <tr><td>center()</td><td></td></tr>
 * <tr><td>padding()</td><td></td></tr>
 * <tr><td>rect()</td><td></td></tr>
 * <tr><td>box()</td><td></td></tr>
 * <tr><td>contains()</td><td></td></tr>
 * <tr><td>editable()</td><td></td></tr>
 * <tr><td>editPos()</td><td></td></tr>
 * <tr><td>resize()</td><td></td></tr>
 * <tr><td>measure()</td><td></td></tr>
 * <tr><td>notify()</td><td></td></tr>
 * <tr><td>serialize()</td><td></td></tr>
 * <tr><td>prepare()</td><td></td></tr>
 * <tr><td>reset()</td><td></td></tr>
 * <tr><td>draw()</td><td></td></tr>
 * <tr><td>preload()</td><td>&lt;optinoal&gt;</td></tr>
 * <tr><td>adviceClone()</td><td>&lt;optinoal&gt;</td></tr>
 * <tr><td>cloneProperty()</td><td>&lt;optinoal&gt;</td></tr>
 * <tr><td>minimum()</td><td>&lt;optinoal&gt;</td></tr>
 * <tr><td>creationStyle()</td><td>&lt;optinoal&gt;</td></tr>
 * <tr><td>resizable()</td><td>&lt;optinoal&gt;</td></tr>
 * <tr><td>testInlineEdit()</td><td>&lt;optinoal&gt;</td></tr>
 * <tr><td>inlineEdit()</td><td>&lt;optinoal&gt;</td></tr>
 * <tr><td>restoreMinimumSize()</td><td>&lt;optinoal&gt;</td></tr>
 * <tr><td>addPoint()</td><td>&lt;optinoal&gt;</td></tr>
 * <tr><td>endPoint()</td><td>&lt;optinoal&gt;</td></tr>
 * <tr><td>creationDraw()</td><td>&lt;optinoal&gt;</td></tr>
 * <tr><td>creationMinimum()</td><td>&lt;optinoal&gt;</td></tr>
 * </tbody>
 * </table>
 * <dl>객체를 사용하기 위해 선행 준비 작업이 필요한 경우, 엔진은 preload() 함수를 호출하고 대기합니다.
 * 	<dt>prepare()</dt><dd>객체 내부의 동기적 선행 작업을 해야 할때 사용됩니다.</dd>
 * 	<dt>preload()</dt><dd>객체 내부의 비동기적 선행 작업을 해야 할때 사용됩니다.</dd>
 * </dl>
 * @typedef {(Object|AbShapeObject|AbShapeImage|AbShapeRectangle|AbShapeTextBox|AbShapeEllipse|AbShapeLine|AbShapeArrow|AbShapePen|AbShapeStamp|AbShapeHighlightPen)} ShapeObject
 * @property {String} name 명칭
 * @property {String} type 구분 (annotation=주석|masking=마스킹)
 * @property {String} shapeType 도형 유형 (shape|polygon|image)
 * @property {String} shapeStyle 도형 스타일 (box|line)
 * @property {Object} token 토큰 (예약)
 * @property {Boolean} selected 선택 여부
 * @property {Boolean} focused 포커스 여부
 * @property {(Object|AbBoxEditIndicator|AbLineEditIndicator)} indicator 편집점 지시자 인스턴스
 * @property {Number} angle 회전 각도 (0~359)
 * @property {Object} style 스타일 정보
 * 
 * @property {String} [creationSize] 생성 시 크기 설정 여부를 명시합니다.
 * @property {Boolean} [collectPoints] 스트로크를 수집한다는 것을 명시합니다.
 * 
 * @property {Function} move() 도형을 이동합니다.
 * @property {Function} styleDesc() 도형의 스타일 편집 정보를 가져옵니다.
 * @property {Function} setAngle() 도형의 회전 각도를 설정합니다.
 * @property {Function} center() 도형의 가장 자리 좌표를 가져옵니다.
 * @property {Function} padding() 도형의 여백 정보를 가져옵니다. (도형과 지시자 사이의 여백 크기)
 * @property {Function} rect() 도형의 상자 크기를 설정하거나 가져옵니다.
 * @property {Function} box() 도형의 상자 크기를 설정하거나 가져옵니다.
 * @property {Function} contains() 도형과 점 또는 상자와 충돌하는 지 검사합니다.
 * @property {Function} editable() 좌표에 맞는 도형의 편집점을 가져옵니다.
 * @property {Function} editPos() 편집접에 대한 좌표를 가져옵니다.
 * @property {Function} resize() 도형을 회전하거나 위치 및 크기를 설정합니다.
 * @property {Function} measure() 도형 크기를 측정합니다.
 * @property {Function} notify() 도형에 전달된 Notify를 처리합니다.
 * @property {Function} serialize() 도형 속성 정보를 XML 문자열로 가져옵니다.
 * @property {Function} prepare() 도형 준비작업을 수행합니다.
 * @property {Function} reset() 도형 정보를 초기화합니다.
 * @property {Function} draw() 도형을 그립니다.
 * @property {Function} [preload()] 비동기적 선행 작업을 진행합니다.
 * @property {Function} [adviceClone()] 복제 어드바이스 정보를 가져옵니다.
 * @property {Function} [cloneProperty()] 필드 복제 전에 호출되는 메서드입니다.
 * @property {Function} [minimum()] 도형의 최소 크기를 가져옵니다.
 * @property {Function} [creationStyle()] 도형의 최소 크기를 가져옵니다.
 * @property {Function} [resizable()] 주어진 크기로 설정이 가능한 지 확인합니다.
 * @property {Function} [testInlineEdit()] 사용자가 텍스트 영역을 클릭했는지 확인합니다.
 * @property {Function} [inlineEdit()] 텍스트 편집을 시작합니다.
 * @property {Function} [restoreMinimumSize()] 복구 최소 크기를 가져옵니다.
 * @property {Function} [addPoint()] 좌표를 스트로크 경로에 추가합니다.
 * @property {Function} [endPoint()] 스트로크 졍로에 좌표 등록을 마칩니다.
 * @property {Function} [creationDraw()] 생성 중 도형을 그립니다.
 * @property {Function} [creationMinimum()] 생성 시 최소 크기를 가져옵니다.
 */

/**
 * 객체 필드 경로 문자열
 * <p>* ","이 있다면, "."을 기준으로 왼쪽이 상위 필드를 지칭합니다.
 * @typedef {String} ObjectPathString
 * 
 * 
 * @example <caption>obj의 필드를 지정할 떄</caption>
 * var obj = { text: '테스트', stroke: { color: 'red', width: 3, data: { value: 'origin', token: 'test' } } };
 * var fieldPath = 'text';
 * 
 * @example <caption>obj의 stroke 필드의 color 필드를 지정할 떄</caption>
 * var obj = { text: '테스트', stroke: { color: 'red', width: 3, data: { value: 'origin', token: 'test' } } };
 * var fieldPath = 'stroke.color';
 * 
 * @example <caption>obj의 stroke 필드의 data 필드의 value 필드를 지정할 떄</caption>
 * var obj = { text: '테스트', stroke: { color: 'red', width: 3, data: { value: 'origin', token: 'test' } } };
 * var fieldPath = 'stroke.data.value';
 */

/**
 * 도형 스타일 편집 정보
 * @typedef {Object} ShapeStyleEditInfo
 * @property {Array.<ObjectPathString>} select 필수 스타일 필드명 배열 <p>* 이 배열의 필드 중 하나는 값이 설정되어야 함을 의미합니다.
 * @property {Array.<(ShapeStyleFieldGroupEditInfo|ShapeStyleFieldEditInfo)>} descs 스타일 필드 그룹/필드 편집 정보 배열
 */

/**
 * 스타일 필드 그룹 편집 정보
 * @typedef {Object} ShapeStyleFieldGroupEditInfo
 * @property {String} name 스타일 필드 명
 * @property {String} text 표시명
 * @property {Array.<(ShapeStyleFieldGroupEditInfo|ShapeStyleFieldEditInfo)>} childs 스타일 필드 그룹/필드 편집 정보 배열
 */

/**
 * 스타일 필드 편집 정보
 * @typedef {(ShapeStyleColorFieldEditInfo|ShapeStyleSelectFieldEditInfo|ShapeStyleCheckFieldEditInfo|ShapeStyleTextFieldEditInfo)} ShapeStyleFieldEditInfo
 */

/**
 * 스타일 색상 필드 편집 정보
 * @typedef {Object} ShapeStyleColorFieldEditInfo
 * @property {String} name 스타일 필드 명
 * @property {String} text 표시명
 * @property {String} style=color 필드 타입 (color|select|check|text)
 * @property {Boolean} [alpha] 알파 선택 사용 여부<p>* style이 color인 경우에만 해당
 * @property {Boolean} [notset] 색상없음 버튼 사용 여부<p>* style이 color인 경우에만 해당
 */

/**
 * 스타일 필드 값 타입 (number|number-unit|boolean|string)
 * <p>* number-unit은 단위가 붙는 숫자형을 말하며, 스타일 편집 정보의 unit이 뒤에 붙은 문자열이 됩니다.
 * @typedef {String} ShapeStyleValueType
 */

/**
 * 스타일 선택상자 필드 편집 정보
 * @typedef {Object} ShapeStyleSelectFieldEditInfo
 * @property {String} name 스타일 필드 명
 * @property {String} text 표시명
 * @property {String} style=select 필드 타입 (color|select|check|text)
 * @property {(String|Array.<(String|Number|Boolean|SelectBoxItem)>)} values 선택상자 아이템 배열
 * <p>* 값이 문자열이면 스타일러가 기본 제공하는 아이템 배열을 사용합니다.
 * <p>* 기본 제공하는 아이템 배열 {@link AbShapeStyler#getDefaultValues}
 * @property {ShapeStyleValueType} [type] 타입 (number|number-unit|boolean|string)
 * @property {String} [unit] 단위 (px, % 등등)
 */

/**
 * 스타일 체크 필드 편집 정보
 * @typedef {Object} ShapeStyleCheckFieldEditInfo
 * @property {String} name 스타일 필드 명
 * @property {String} text 표시명
 * @property {String} style=check 필드 타입 (color|select|check|text)
 */

/**
 * 스타일 입력 필드 편집 정보
 * @typedef {Object} ShapeStyleTextFieldEditInfo
 * @property {String} name 스타일 필드 명
 * @property {String} text 표시명
 * @property {String} style=text 필드 타입 (color|select|check|text)
 * @property {ShapeStyleValueType} [type] 타입 (number|number-unit|boolean|string)
 * @property {String} [unit] 단위 (px, % 등등)
 * @property {Boolean} [trim] 입력 값의 좌우 공백을 제거할 지 여부, true면 좌우 공백을 제거합니다.
 * @property {Boolean} [notempty] 빈 내용을 입력할 수 있는 지 여부, true면 빈 내용을 입력할 수 없습니다.
 * @property {Number} [size] 입력 필드의 크기 (width)
 * @property {ShapeStyleValueRange} [range] 입력값 범위
 */

/**
 * 스타일 입력 필드 편집 정보
 * @typedef {Object} ShapeStyleValueRange
 * @property {Number} [start] 최소값
 * @property {Number} [end] 최대값
 */

/**
 * 도형 객체 비동기 선행 작업 콜백 함수
 * <dl>topic 목록
 * 	<dt>ok</dt><dd>수행을 완료했습니다.</dd>
 * 	<dt>skip</dt><dd>수행을 건너뜁니다.</dd>
 * 	<dt>error</dt><dd>수행 중 오류가 발생했습니다. e인자를 참조하세요</dd>
 * </dl>
 * @callback ShapeObjectPreloadCallback
 * @param {String} topic 토픽 (ok|skip|error)
 * @param {Error} e Error 객체
 */

/**
 * 크기 조정 결과
 * @typedef {Object} ShapeObjectResizeResult
 * @property {(Boolean|String)} result 조정부위로, false면 조정되지 않았고, h면 폭을, v면 높이를 조정했습니다.
 * @property {Number} width 조정된 폭
 * @property {Number} height 조정된 높이
 */

/**
 * 엔진 스타일 정보
 * @typedef {Object} AbViewerEngine.Style
 * @property {CSS_Color} color 배경색
 */

/**
 * Dumy History 관리 객체
 * <p>* 아무 동작도 하지 않습니다.
 * @typedef {Object} AbViewerEngine.DumyHistory
 * @property {Function} lock() 아무 동작도 하지 않습니다.
 * @property {Function} unlock() 아무 동작도 하지 않습니다.
 * @property {Function} canUndo() 아무 동작도 하지 않습니다.
 * @property {Function} canRedo() 아무 동작도 하지 않습니다.
 * @property {Function} begin() 아무 동작도 하지 않습니다.
 * @property {Function} end() 아무 동작도 하지 않습니다.
 * @property {Function} cancel() 아무 동작도 하지 않습니다.
 * @property {Function} undo() 아무 동작도 하지 않습니다.
 * @property {Function} redo() 아무 동작도 하지 않습니다.
 * @property {Function} clear() 아무 동작도 하지 않습니다.
 */

/**
 * 이벤트 추출 정보
 * @typedef {Object} AbViewerEngine.EventInfo
 * @property {Number} x 캔버스 좌표계 X좌표
 * @property {Number} y 캔버스 좌표계 Y좌표
 * @property {Boolean} ctrlKey ctrl 키가 눌러져 있으면 true
 * @property {Boolean} shiftKey shift 키가 눌러져 있으면 true
 * @property {Boolean} altKey alt 키가 눌러져 있으면 true
 * @property {String} button 마우스 버튼 (left|middle|right)
 */

/**
 * 페이지 인덱스 정보
 * @typedef {Object} AbViewerEngine.PageInfo
 * @property {Number} index 페이지 인덱스
 * @property {AbPage} page 페이지 인스턴스
 */

//----------------------------------------------------------------------------------------------------------
// 엔진
//----------------------------------------------------------------------------------------------------------

/**
 * 도형 편집 엔진
 * @class
 * @param {Object} [options] 옵션
 * @param {String} [options.selector=#engine] 엔진 HTML 엘리먼트 선택자
 * @param {Padding} [options.margin] 페이지 마진
 * <p>* 이미지와 캔버스의 사이의 여백입니다.
 * @param {AbImageViewer.Config} [options.config] 이미지 뷰어 설정 정보
 * @param {Boolean} [options.notifySelectPage=true] 페이지 선택 시 Notify 여부
 * @param {AbWaterMark} [options.waterMark] 워터마크 관리자 인스턴스
 * @param {AbPageCollection} [options.pages] 페이지 목록
 * @param {AbClipboard} [options.clipboard] 클립보드 관리자 인스턴스
 * @param {AbHistory} [options.history] History 관리자 인스턴스
 * @param {AbViewerEngine.Style} [options.style] 엔진 스타일 정보
 */
function AbViewerEngine(options){
	if (!options) options = {};
	var optionMargin = options.margin || { left: 10, top: 10, right: 10, bottom: 10 };
	var styleOption = options.style || {};

	//-----------------------------------------------------------

	/**
	 * 엔진 HTML 엘리먼트 선택자
	 * @type {String}
	 */
	this.selector = options.selector;
	if (!this.selector) this.selector = '#engine';
	
	//-----------------------------------------------------------

	/**
	 * 선택된 도형 목록
	 * @type {Array.<ShapeObject>}
	 */
	this.selectedShapes = [];
	/**
	 * 포커스된 도형
	 * @type {ShapeObject}
	 */
	this.focusedShape = null;
	
	//-----------------------------------------------------------
	
	/**
	 * 이미지 뷰어 설정 정보
	 * @private
	 * @type {AbImageViewer.Config}
	 */
	this.$config = options.config || {};
	
	//-----------------------------------------------------------

	/**
	 * 엔진 스타일 정보
	 * @type {AbViewerEngine.Style}
	 */
	this.style = {
		color: styleOption.hasOwnProperty('color') ? styleOption.color : null, // '#F8F8F9',
	};
	
	//-----------------------------------------------------------
	
	/**
	 * 페이지 선택 시 Notify 여부
	 * @type {Boolean}
	 */
	this.enableNotifySelectPage = AbCommon.isBool(options.notifySelectPage) ? options.notifySelectPage : true;
	
	//-----------------------------------------------------------

	/**
	 * 워터마크 관리자 인스턴스
	 * @type {AbWaterMark}
	 */
	this.waterMark = options.waterMark && options.waterMark instanceof AbWaterMark ? options.waterMark : null;
	if (this.waterMark)
		this.waterMark.observe(this);
	
	//-----------------------------------------------------------

	/**
	 * 엔진 상태 (ready|preparing|prepared)
	 * <dl>
	 * 	<dt>ready</dt><dd>대기중입니다.</dd>
	 * 	<dt>preparing</dt><dd>준비중입니다.</dd>
	 * 	<dt>prepared</dt><dd>준비가 완료되었습니다.</dd>
	 * </dl>
	 * @type {String}
	 * @default
	 */
	this.status = 'ready';
	/**
	 * 편집 활설화 여부
	 * <p>* false면 편집을 하지 못합니다.
	 * @type {Boolean}
	 * @default
	 */
	this.enabled = true;
	// view = 이미지 뷰잉
	// edit = 도형 편집
	/**
	 * 엔진 모드 (view/edit)
	 * <dl>
	 * 	<dt>edit</dt><dd>편집모드: 도형을 추가하거나 편집합니다.</dd>
	 * 	<dt>view</dt><dd>보기모드: 도형 편집을 할 수 없습니다.</dd>
	 * </dl>
	 * @type {String}
	 * @default
	 */
	this.engineMode = 'edit';
	// runtime이 true이면,
	// 에디터가 실시간으로 화면 업데이트 중이며,
	// true인 동안에는 인위적으로 화면을 업데이트하는 행위(render/paint 등)를
	// 하면 안된다.
	/**
	 * 엔진의 실시간 업데이트 여부
	 * <p>* runtime이 true이면 엔진이 실시간으로 화면 업데이트 중이며, true인 동안에는 화면을 업데이트하는 행위(render/paint 등)를 하면 안됩니다.
	 * @type {Boolean}
	 * @default
	 */
	this.runtime = false;

	/**
	 * 애니메이션 사용 여부
	 * <p>* 이미지 회전/확대/축소 등등의 기능별 애니메이션의 활성화 여부
	 * @type {Boolean}
	 * @default
	 */
	this.enableAnimate = true;

	// 보여질 도형 타입 맵
	/**
	 * 도형을 화면에 표시할 지 여부
	 * @type {Boolean}
	 * @default
	 */
	this.showingShapes = true;
	/**
	 * 도형 구분({@link AbShapeObject#type|type})별 화면 표시 맵
	 * <dl>
	 * 	<dt>annotation</dt><dd>주석</dd>
	 * 	<dt>masking</dt><dd>마스킹</dd>
	 * </dl>
	 * <p>* 필드명이 도형 구분, 필드값이 부울형인 객체입니다.
	 * @type {Object.<String, Boolean>}
	 */
	this.showingShapeTypeMap = {};

	/**
	 * 페이지 마진
	 * <p>* 이미지와 캔버스의 사이의 간격입니다.
	 * @type {Padding}
	 */
	this.margin = {
		left: optionMargin.left,
		top: optionMargin.top,
		right: optionMargin.right,
		bottom: optionMargin.bottom,

		horiz: function() { return this.left + this.right; },
		vert: function() { return this.top + this.bottom; },
	};
	
	//-----------------------------------------------------------
	// 옵저버

	/**
	 * 엔진 옵저버 리스너 관리자 인스턴스
	 * @type {AbViewerEngineObservers}
	 */
	this.observers = new AbViewerEngineObservers({
		engine: this
	});
	
	//-----------------------------------------------------------
	// 애니메이션 상태 정보

	/**
	 * 애니메이션 상태 정보 인스턴스
	 * @type {AbViewerEngineAnimateStates}
	 */
	this.animateStates = new AbViewerEngineAnimateStates({
		engine: this
	});

	//-----------------------------------------------------------

	/**
	 * 페이지 목록
	 * @type {AbPageCollection}
	 */
	this.pages = options.pages || new AbPageCollection();

	/**
	 * 현재 페이지의 인덱스
	 * @type {Number}
	 * @default
	 */
	this.currentPageIndex = -1;
	/**
	 * 현재 페이지 인스턴스
	 * @type {AbPage}
	 * @default
	 */
	this.currentPage = null;

	//-----------------------------------------------------------

	/**
	 * 클립보드 관리자 인스턴스
	 * @type {AbClipboard}
	 */
	this.clipboard = options.clipboard || new AbClipboard();
	//this.history = options.history || new AbHistory();

	/**
	 * History 관리자 인스턴스
	 * <p>* History 관리자 인스턴스를 옵션으로 설정하지 않으면,
	 * {@link AbViewerEngine.DumyHistory|Dumy 객체}가 설정됩니다.
	 * @type {(AbViewerEngine.DumyHistory|AbHistory)}
	 */
	this.history = options.history || {
		lock: function(){},
		unlock: function(){},
		canUndo: function(){},
		canRedo: function(){},
		begin: function(){},
		end: function(){},
		cancel: function(){},
		undo: function(){},
		redo: function(){},
		clear: function(){},
	};

	//-----------------------------------------------------------

	/**
	 * 선택 영역 정보
	 * @type {AbViewerEngineSelection}
	 */
	this.selection = new AbViewerEngineSelection({
		engine: this
	});

	//-----------------------------------------------------------

	/**
	 * 엔진 HTML 엘리먼트 jQuery 객체
	 * @type {jQueryObject}
	 */
	this.panel = $(this.selector);
	/**
	 * 화면 Canvas 2D Context
	 * @type {CanvasRenderingContext2D}
	 */
	this.viewContext = null;
	/**
	 * 화면버퍼 Canvas 2D Context
	 * @type {CanvasRenderingContext2D}
	 */
	this.context = null;

	/**
	 * 입력상자 관리자
	 * @type {AbViewerEngineTextBox}
	 */
	this.textbox = new AbViewerEngineTextBox({
		engine: this
	});

	/**
	 * 키 입력 리스닝
	 * <p>* false면 키 입력이 없고, 숫자형이면 키 입력이 발생한 것입니다.
	 * @type {(Boolean|Number)}
	 */
	this.listening = false;
	/**
	 * 키 입력 리스닝이 된 상태에서 마우스가 드래깅 했는 지 여부입니다.
	 * @type {Boolean}
	 */
	this.mouseTriggered = false;
}
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbViewerEngine.prototype = {
	constructor: AbViewerEngine,

	//-----------------------------------------------------------

	/**
	 * 방향없음
	 * @type {Number}
	 * @const
	 * @static 
	 * @default
	 */
	NONE: 0,

	/**
	 * 수평방향
	 * @type {Number}
	 * @const
	 * @static 
	 * @default
	 */
	DIR_HORIZ : 1,
	/**
	 * 수직방향
	 * @type {Number}
	 * @const
	 * @static 
	 * @default
	 */
	DIR_VERT: 2,
	
	//-----------------------------------------------------------

	/**
	 * 최소 축소율
	 * @type {Number}
	 * @const
	 * @static 
	 * @default
	 */
	MIN_SCALE: 0.1,
	/**
	 * 최대 확대율
	 * @type {Number}
	 * @const
	 * @static 
	 * @default
	 */
	MAX_SCALE: 5,

	/**
	 * 확대/축소 비율 간격
	 * @type {Number}
	 * @const
	 * @static 
	 * @default
	 */
	SCALE_STEP: 0.07,

	/**
	 * 확대/축소 애니메이션의 비율 간격
	 * @type {Number}
	 * @const
	 * @static 
	 * @default
	 */
	SCALE_ANI_STEP: 0.4,
	/**
	 * 확대/축소 애니메이션의 Easing 함수명
	 * @see {@link Easing} Easing 정의
	 * @type {String}
	 * @const
	 * @static 
	 * @default
	 */
	SCALE_ANI_EASING: 'easeOutExpo',
	/**
	 * 확대/축소 애니메이션의 실행 시간
	 * @type {Number}
	 * @const
	 * @static 
	 * @default
	 */
	SCALE_ANI_DURATION: 300,

	/**
	 * 이미지 회전 애니메이션의 Easing 함수명
	 * @see {@link Easing} Easing 정의
	 * @type {String}
	 * @const
	 * @static 
	 * @default
	 */
	ROTATE_ANI_EASING: 'easeOutExpo',
	/**
	 * 이미지 회전 애니메이션의 실행 시간
	 * @type {Number}
	 * @const
	 * @static 
	 * @default
	 */
	ROTATE_ANI_DURATION: 400,
	
	//-----------------------------------------------------------

	/**
	 * 도형 테이블
	 * <p>* 도형 생성 시 이 테이블의 인스턴스를 복제해서 페이지의 도형 목록에 추가합니다.
	 * <p>* 필드명이 도형명칭, 필드값이 {@link ShapeObject} 인스턴스인 객체입니다.
	 * @type {Object.<String, ShapeObject>}
	 */
	SHAPE_TABLE: {
		textbox: new AbShapeTextBox(),
		rectangle: new AbShapeRectangle(),
		pen: new AbShapePen(),
		highlightpen: new AbShapeHighlightPen(),
		ellipse: new AbShapeEllipse(),
		arrow: new AbShapeArrow(),
		line: new AbShapeLine(),
		checker: new AbShapeImage({ name: 'checker', source: AbIcons.CHECKER }),
		stamp: new AbShapeStamp(),
	},
	
	//-----------------------------------------------------------

	/**
	 * 엔진을 세팅합니다.
	 * <p>* 캔버스를 생성하고, 도형의 비동기 선행 작업을 진행합니다.
	 * @param {Function} [callback] 세팅 완료 후 호출되는 콜백 함수
	 */
	install: function (callback){
		if (!AbCommon.isFunction(callback)) callback = function() {};
		
		if (this.panel.length){
			this.status = 'preparing';
	
			var box = AbCommon.getBounds(this.panel.get(0));
	
			var canvas = $('<canvas width="'+box.width+'" height="'+box.height+'"/>');
			canvas.css('touch-action', 'none');
			canvas.css('user-select', 'none');
			canvas.css('-webkit-user-drag', 'none');
			canvas.css('-webkit-tap-highlight-color', 'rgba(0, 0, 0, 0);');
			canvas.css('outline', 'none');
			canvas.attr('tabindex', '1');
	
			canvas.focus(function(e){
				this.textbox.hide();
			}.bind(this));
	
			canvas.on('contextmenu', function (e){
				e.preventDefault(); // 현재 이벤트의 기본 동작을 중단한다.
				e.stopPropagation(); // 현재 이벤트가 상위로 전파되지 않도록 중단한다.
				e.stopImmediatePropagation(); // 현재 이벤트가 상위뿐 아니라 현재 레벨에 걸린 다른 이벤트도 동작하지 않도록 중단한다.			
	
				if (e.originalEvent && e.originalEvent.hasOwnProperty('returnValue'))
					e.originalEvent.returnValue = false;
				
				return false;
			});
	
			this.panel.append(canvas);
	
			var viewCanvas = canvas.get(0);
			this.viewContext = viewCanvas.getContext('2d');
	
			var canvas = $('<canvas width="'+box.width+'" height="'+box.height+'"/>');
			//canvas.width = viewCanvas.width;
			//canvas.height = viewCanvas.height;
			this.context = canvas.get(0).getContext('2d');

			this.textbox.generate();
	
			// this.textbox.e = $('<textarea placeholder="내용을 입력하세요" wrap="soft" spellcheck="false"></textarea>');
			// this.textbox.css('line-height', '1.2');
			// this.textbox.css('border', '0 none white');
			// this.textbox.css('padding', '0');
			// this.textbox.css('outline', 'none');
			// this.textbox.css('IME-MODE', 'active');
			// this.textbox.css('overflow', 'hidden');
			// this.textbox.css('resize', 'none');
			// this.textbox.css('position', 'absolute');
			// this.textbox.css('visibility', 'hidden');
			// this.textbox.css('z-index', '-1');
			// this.textbox.css('-webkit-user-drag', 'none');
			// this.textbox.css('-webkit-font-smoothing', 'antialiased');
			// this.textbox.css('-moz-osx-font-smoothing', 'grayscale');
			// this.textbox.e.keydown(this, function (e){
			// 	e.stopPropagation(); // 현재 이벤트가 상위로 전파되지 않도록 중단한다.
			// 	e.stopImmediatePropagation(); // 현재 이벤트가 상위뿐 아니라 현재 레벨에 걸린 다른 이벤트도 동작하지 않도록 중단한다.			
			// });
	
			this.panel.append(this.textbox.e);
			
			this.prepare();
			this.status = 'prepared';
		}
		
		var preloads = [];
		if (this.SHAPE_TABLE){
			for (var p in this.SHAPE_TABLE){
				var s = this.SHAPE_TABLE[p];
				
				if (AbCommon.needPreloading(s)){
					preloads.push(s);
				}
			}
		}
		
		if (preloads.length){
			var called = 0, totalCalled = preloads.length;
			
			while(preloads.length){
				var s = preloads.shift();
				s.preload(function (){
					called++;
					if (called >= totalCalled){
						callback();
					}
				});
			}
		}else{
			callback();
		}
	},
	
	//-----------------------------------------------------------

	/**
	 * 엔진을 dispose합니다.
	 */
	dispose: function(){
		this.selection.engine = null;
		this.animateStates.engine = null;
		
		this.clearPages();
		
		this.textbox.engine = null;
		this.textbox.e = null;
	},

	//-----------------------------------------------------------

	/**
	 * 옵저버 리스너를 등록합니다.
	 * <p>* 토픽이 all이면 모든 토픽에 대해 옵저브합니다.
	 * @param {String} topic 토픽
	 * @param {AbViewerEngineObservers.ObserveListener} observer 등록할 리스너
	 */
	observe: function(topic, observer){ this.observers.add(topic, observer); },
	/**
	 * 옵저버 리스너를 제거합니다.
	 * @param {String} topic 토픽
	 * @param {AbViewerEngineObservers.ObserveListener} observer 제거할 리스너
	 */
	stopObserve: function(topic, observer){ this.observers.remove(topic, observer); },

	/**
	 * 옵저버 리스너에 Notify합니다.
	 * @param {String} topic 토픽
	 * @param {*} value 전달할 데이터
	 * @param {AbViewerEngineObservers.NotifyCallback} [callback] Notify 후 호출되는 콜백 함수
	 */
	notifyObservers: function(topic, value, callback){
		if (this.observers){
			this.observers.notify(topic, value, callback);
		}else{
			if (AbCommon.isFunction(callback)) callback(false);
		}
	},

	//-----------------------------------------------------------

	/**
	 * 선택된 도형들에게 Notify합니다.
	 * @param {String} cmd Command Text
	 * @param {...*} args 도형에 전달할 인자
	 */
	notifySelectionShapes: function(cmd){
		var len = this.selectedShapes.length;
		for (var i=0; i < len; i++)
			this.selectedShapes[i].notify.apply(this.selectedShapes[i], arguments);
	},

	/**
	 * 현재 페이지의 도형들에게 Notify합니다.
	 * @param {String} cmd Command Text
	 * @param {...*} args 도형에 전달할 인자
	 */
	notifyShapes: function(cmd){
		var len = this.currentPage.shapes.length;
		for (var i=0; i < len; i++)
			this.currentPage.shapes[i].notify.apply(this.currentPage.shapes[i], arguments);
	},

	//-----------------------------------------------------------

	/**
	 * 워터마크 관리자에서 보낸 Notify를 처리합니다.
	 * @param {AbWaterMark} sender Notify한 객체 
	 * @param {String} topic 토픽
	 * @param {*} value 값
	 */
	waterMarkNotify: function(sender, topic, value){
		switch(topic){
		case 'render':
			if (this.context && this.currentPage)
				this.render();
			break;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 도형 테이블에 등록된 인스턴스를 가져옵니다.
	 * @param {String} s 도형 명칭
	 * @return {ShapeObject} 도형 인스턴스
	 */
	shapeObject: function (s){
		return AbCommon.isString(s) ? AbViewerEngine.prototype.SHAPE_TABLE[s] : (AbCommon.isShape(s) ? s : null);
	},

	/**
	 * 도형을 생성합니다.
	 * @param {String} name 도형명칭<p>* 도형 테이블의 등록된 명칭이어야 합니다.
	 * @param {...*} args 속성 목록<p>* 이 목록의 속성 정보들을 새 도형 객체에 복사합니다.
	 * @param {Function} callback 도형 생성 후 호출되는 콜백 함수
	 * @example
	 * engine.createShape('rectangle', { style: { color: 'red' } }, function(){
	 * 	console.log('생성 완료');
	 * });
	 */
	createShape: function (){
		if (!arguments.length)
			return;

		var callback = function() {};
		var argLen = arguments.length;
		var name = arguments[0];
		
		if (argLen > 1 && AbCommon.isFunction(arguments[argLen - 1])){
			callback = arguments[argLen - 1];
			argLen--;
		}
		
		var s = AbViewerEngine.prototype.SHAPE_TABLE[name];
		if (!s){
			callback(null);
			return;
		}

		s = AbCommon.cloneShape(s);
		
		if (argLen > 1){
			for (var i=1; i < argLen; i++){
				AbCommon.shapeProp(s, arguments[i]);
			}

			// var a = [true, s];

			// var len = arguments.length;
			// for (var i=1; i < len; i++) a.push(arguments[i]);

			// $.extend.apply($.extend, a);
		}

		if (AbCommon.needPreloading(s)){
			s.preload(function(success, r){
				// success
				// - ok: 성공
				// - error: error, r은 메시지
				// - skip: 넘어감
				
				switch (success){
				case 'error':
					callback(s, new Error(r));
					break;
				default:
					callback(s);
					break;
				}
			});
		}else{
			callback(s);
		}
	},

	//-----------------------------------------------------------
	
	/**
	 * 이미지 뷰어 설정 정보에서 데이터를 가져옵니다.
	 * @see {@link AbImageViewer.Config} 이미지 뷰어 설정 정보
	 * @param {ObjectPathString} name 필드명 경로
	 * @return {*} 이미지 뷰어 설정 값
	 */
	config: function (name){
		function configObject(config, name){
			var o = config;
			var path = name.split('.'), idx = 0;
			var pathSiz = path.length - 1, leap = path[path.length - 1];
			while (idx < pathSiz){
				o = o[path[idx]];
				if (!o)
					return null;
				idx++;
			}
			return {
				config: o,
				leap: leap
			};
		}
		
		var r = configObject(this.$config, name);
		
		if (!r)
			return null;
		
		return r.config[r.leap];
	},

	/**
	 * 도형 명칭에 맞는 주석/마스킹 선택 방식 설정값을 가져옵니다.
	 * @param {String} shapeName 도형 명칭
	 * @return {String} 주석/마스킹 선택 방식<p>* {@link AbImageViewer.Config|이미지 뷰어 설정 정보}의 주석/마스킹 선택 관련 설정을 참고하세요
	 */
	selectionStyle: function (shapeName){
		//console.log('[selection-style][' + shapeName + ']');
		
		var config = this.$config;
		var style = 'path', target = ['all'];
		
		if (config && config.shape && config.shape.selection){
			if (config.shape.selection.style) style = config.shape.selection.style;
			if (config.shape.selection.target && $.isArray(config.shape.selection.target))
				target = config.shape.selection.target;
		}
		
		if ($.inArray('all', target) >= 0 || $.inArray(shapeName, target) >= 0)
			return style;
		return 'path';
	},
	
	//-----------------------------------------------------------
	
	/**
	 * 도형을 화면에 표시할 수 있는 지 확인합니다.
	 * @param {String} type 도형 구분 (annotation=주석/masking=마스킹)
	 * @return {Boolean}
	 */
	isVisibleShapeType: function (type){
		if (!this.showingShapes) return false;
		
		var showing = true;
		
		if (type && this.showingShapeTypeMap[type] === false) showing = false;
		
		return showing;
	},

	/**
	 * 도형의 화면 표시 여부를 설정하거나 가져옵니다. 또는 화면에 표시할 도형 구분을 설정하거나 가져옵니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자수</th><th>인자0</th><th>인자1</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>0개</td><td></td><td></td><td>도형을 화면에 표시할 지 여부를 가져옵니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>1개</td><td>show: Boolean</td><td></td><td>도형을 화면에 표시할 지 여부를 설정합니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>1개</td><td>type: String</td><td></td><td>type으로 구분된 도형을 화면에 표시할 수 있는 지 확인합니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>2개</td><td>type: String</td><td>show: Boolean</td><td>type으로 구분된 도형을 화면에 표시할 지 여부를 설정합니다.</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {(Boolean|String)} [0] 화면에 표시할 지 여부 또는 도형 구분
	 * @param {Boolean} [1] 화면에 표시할 지 여부
	 * @return {Boolean} 화면 표시 여부
	 */
	showShapes: function(){
		if (arguments.length){
			if (AbCommon.isBool(arguments[0])){
				this.showingShapes = arguments[0];
				this.render();

				this.notifyObservers('show', { type: 'all', show: this.showingShapes });
			}else if (AbCommon.isString(arguments[0])){
				var type = $.trim(arguments[0]);
				
				if (arguments.length >= 2 && AbCommon.isBool(arguments[1])){
					this.showingShapeTypeMap[type] = arguments[1];
					this.render();

					this.notifyObservers('show', { type: type, show: this.showingShapeTypeMap[type] });
				}else{
					return this.showingShapeTypeMap[type];
				}
			}
		}
		return this.showingShapes;
	},
	
	/**
	 * 도형 구분별 화면 표시 여부 맵
	 * @see {@link AbViewerEngine#showingShapeTypeMap} showingShapeTypeMap 필드
	 * @return {Object.<String, Boolean>}
	 */
	showShapeTypeMap: function(){ return this.showingShapeTypeMap; },

	/**
	 * 엔진 사용이 가능한지 확인합니다.
	 * <p>* 엔진에 페이지 목록이 있는 지 현재 페이지이 선택되었는 지 페이지가 정상적인지 도형은 편집가능 한지 확인합니다.
	 * @type {Boolean}
	 */
	editable: function(){
		return this.pages.length() > 0 && this.currentPage && !this.currentPage.error && this.maniplatable();
	},

	/**
	 * 도형 편집이 가능한 지 확인합니다.
	 * <p>* 엔진이 활성화되었는지 애니메이션 중인지 확인합니다.
	 */
	maniplatable: function(){
		return this.enabled && !this.animateStates.animated();
	},

	//-----------------------------------------------------------
	// 에디터에서 수정이 있었음을 공지
	// - 도형 추가/삭제/회전, 위치/크기 변경
	// - 도형 편집 초기화
	// - 도형 스타일 변경
	// - 페이지 회전
	// - 클립보드 붙이기
	// - 도형 추가 History Undo/Redo
	// - 도형 수정 History Undo/Redo
	// - 도형 삭제 History Undo/Redo

	/**
	 * 엔진에서 수정이 있었음을 Notify 합니다.
	 * <ul>
	 * 	<li>도형 추가
	 * 	<li>도형 삭제
	 * 	<li>도형 회전
	 * 	<li>도형 이동
	 * 	<li>도형 크기 변경
	 * 	<li>도형 편집 초기화
	 * 	<li>도형 스타일 변경
	 * 	<li>이미지 회전
	 * 	<li>클립보드 붙이기
	 * 	<li>클립보드 자르기
	 * 	<li>History Undo 중 도형 추가
	 * 	<li>History Redo 중 도형 추가
	 * 	<li>History Undo 중 도형 속성 수정
	 * 	<li>History Redo 중 도형 속성 수정
	 * 	<li>History Undo 중 도형 삭제
	 * 	<li>History Redo 중 도형 삭제
	 * </ul>
	 * @param {(String|Array.<Number>)} [target] 대상, 배열이면 범위를, all이면 전체입니다.
	 */
	modified: function(target){
		this.notifyObservers('modified', target);
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

	/**
	 * 명령을 수행합니다.
	 * <dl>
	 * 	<dt>undo</dt><dd>실행 취소를 실행합니다.</dd>
	 * 	<dt>redo</dt><dd>다시 실행을 실행합니다.</dd>
	 * 	<dt>copy</dt><dd>선택된 도형들을 클립보드에 복사합니다.</dd>
	 * 	<dt>paste</dt><dd>클립보드에 있는 복사된 도형들을 붙여넣기합니다.</dd>
	 * 	<dt>cut</dt><dd>선택된 도형들을 클립보드에 복사하고 화면에서 제거합니다.</dd>
	 * 	<dt>delete</dt><dd>선택된 도형들을 삭제합니다.</dd>
	 * 	<dt>selectAll</dt><dd>페이지의 모든 도형들을 선택합니다.</dd>
	 * 	<dt>z-index</dt><dd>선택된 도형들을 앞 또는 뒤로 보냅니다.
	 * <p>* value는 (top|up|down|bottom) 중 하나를 설정합니다.
	 * <p>* {@link AbViewerEngine#zIndex|zIndex()}를 참고하세요.</dd>
	 * </dl>
	 * @param {String} cmd 명령어
	 * @param {*} [value] 값
	 */
	execCommand: function(cmd, value){
		if (!this.maniplatable()) return;

		var f = function(){
			var cmd = arguments.callee.cmd;

			switch(cmd){
			case 'undo': this.undo(); break;
			case 'redo': this.redo(); break;
			case 'copy': this.copy(); break;
			case 'paste': this.paste(); break;
			case 'cut': this.cut(); break;
			case 'delete': this.deleteShapes(); break;
			case 'selectAll': this.selectAll(); break;
			case 'z-index': this.zIndex(value); break;
			}
		};
		f.cmd = cmd;

		this.exec(f);
	},

	/**
	 * 키 입력 이벤트를 처리합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 */
	keyEvent: function(e){
		var cancel = false;
		var page = e.data.currentPage;
		var editMode = e.data.engineMode == 'edit';
		var maniplatable = e.data.maniplatable();

		//console.log('[KEYDOWN]');

		switch(e.type){
		case 'keydown':
			if (editMode){
				if (page && !e.shiftKey && !e.altKey && !e.ctrlKey && e.keyCode == 32){
					e.data.listening = e.keyCode;

					if (e.data.mouseTriggered){
						e.stopPropagation(); // 현재 이벤트가 상위로 전파되지 않도록 중단한다.
					}

					e.data.mouseTriggered = false;
					//cancel = true;
				}
				if (e.ctrlKey && (e.key == 'A' || e.key == 'a')){
					e.data.execCommand('selectAll');
					cancel = true;
				}else if (e.ctrlKey && (e.key == 'Z' || e.key == 'z')){
					e.data.execCommand('undo');
					//cancel = true;
				}else if (e.ctrlKey && (e.key == 'Y' || e.key == 'y')){
					e.data.execCommand('redo');
					//cancel = true;
				}else if (e.ctrlKey && (e.key == 'C' || e.key == 'c')){
					e.data.execCommand('copy');
					//cancel = true;
				}else if (e.ctrlKey && (e.key == 'V' || e.key == 'v')){
					e.data.execCommand('paste');
					//cancel = true;
				}else if (e.ctrlKey && (e.key == 'X' || e.key == 'x')){
					e.data.execCommand('cut');
					//cancel = true;
				}else if (e.which == 46){ // delete
					e.data.execCommand('delete');
					//cancel = true;
				}else if (e.which == 116){ // F5
					//cancel = true;
				}
			}
			break;
		case 'keyup':
			if (editMode){
				if (page && !e.shiftKey && !e.altKey && !e.ctrlKey && e.keyCode == 32){
					e.data.listening = false;
					e.data.mouseTriggered = false;
					cancel = true;
				}
			}
			break;
		}

		if(cancel){
			e.preventDefault(); // 현재 이벤트의 기본 동작을 중단한다.
			e.stopPropagation(); // 현재 이벤트가 상위로 전파되지 않도록 중단한다.
			e.stopImmediatePropagation(); // 현재 이벤트가 상위뿐 아니라 현재 레벨에 걸린 다른 이벤트도 동작하지 않도록 중단한다.			

			if (e.originalEvent && e.originalEvent.hasOwnProperty('returnValue'))
				e.originalEvent.returnValue = false;

			return false;
		}
		return true;
	},
	
	/**
	 * 마우스 이벤트를 처리합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 */
	mouseEvent: function (e){
		if (!e.data.currentPage || !e.data.maniplatable()) return;

		var isRightKey = e.which == 3;
		if (isRightKey) return;
			
		if (e.target == e.data.viewContext || e.target == e.data.viewContext.canvas){
			e.data.mouse(true, e.type, e);
		}else{
			e.data.mouse(false, e.type, e);
		}
	},

	/**
	 * 화면 크기 변경 이벤트를 처리합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 */
	resizeEvent: function (e){
		e.data.exec(function(){
			this.resize();
		});
	},

	/**
	 * 캔버스 엘리먼트의 blur 이벤트를 처리합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 */
	canvasBlurEvent: function (e){
		e.data.exec(function(){
			this.selection.reset();
		});
	},

	/**
	 * HTML 엘리먼트 이벤트를 등록합니다.
	 */
	attachEvents: function (){
		var body = $(document);
		var win = $(window);
		var canvas = $(this.viewContext.canvas);

		body.bind('mousemove', this, this.mouseEvent);
		body.bind('mousedown', this, this.mouseEvent);
		body.bind('mouseup', this, this.mouseEvent);
		body.bind('click', this, this.mouseEvent);
		body.bind('mousewheel', this, this.mouseEvent);
		body.bind('wheel', this, this.mouseEvent);
		win.bind('keydown', this, this.keyEvent);
		win.bind('keyup', this, this.keyEvent);
		win.bind('resize', this, this.resizeEvent);
		canvas.bind('blur', this, this.canvasBlurEvent);
	},

	/**
	 * HTML 엘리먼트 이벤트를 제거합니다.
	 */
	detachEvents: function (){
		var body = $(document);
		var win = $(window);
		var canvas = $(this.viewContext.canvas);

		body.unbind('mousemove', this, this.mouseEvent);
		body.unbind('mousedown', this, this.mouseEvent);
		body.unbind('mouseup', this, this.mouseEvent);
		body.unbind('click', this, this.mouseEvent);
		body.unbind('mousewheel', this, this.mouseEvent);
		body.unbind('wheel', this, this.mouseEvent);
		win.unbind('keydown', this, this.keyEvent);
		win.unbind('keyup', this, this.keyEvent);
		win.unbind('resize', this, this.resizeEvent);
		canvas.unbind('blur', this, this.canvasBlurEvent);
	},

	/**
	 * 스크린 좌표계에서 캔버스 좌표계로 변환합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자수</th><th>인자0</th><th>인자1</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>1개</td><td>pos: ({@link Point}|{@link Box})</td><td></td><td></td>
	 * </tr>
	 * <tr>
	 * 	<td>2개</td><td>x: Number</td><td>y: Number</td><td></td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {(Number|Point|Box)} 0 스크린 좌표계 X좌표 또는 위치 정보
	 * @param {Number} [1] 스크린 좌표계 Y좌표
	 * @return {Point} 캔버스 좌표계 좌표
	 */
	screen2canvas: function (){
		var x = 0, y = 0;
		if (arguments.length == 1) { x = arguments[0].x; y = arguments[0].y; }
		else { x = arguments[0]; y = arguments[1]; }

		var box = AbCommon.getBounds(this.viewContext.canvas);
		var pos = $(this.viewContext.canvas).position();
		var scr = AbCommon.scrolledParents($(this.viewContext.canvas));
		
		return {
			x: x - pos.left - scr.x - this.margin.left,
			y: y - pos.top - scr.y - this.margin.top,
		};
	},

	/**
	 * 캔버스 좌표계에서 스크린 좌표계로 변환합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>인자수</th><th>인자0</th><th>인자1</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>1개</td><td>pos: ({@link Point}|{@link Box})</td><td></td><td></td>
	 * </tr>
	 * <tr>
	 * 	<td>2개</td><td>x: Number</td><td>y: Number</td><td></td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {(Number|Point|Box)} 0 캔버스 좌표계 X좌표 또는 위치 정보
	 * @param {Number} [1] 캔버스 좌표계 Y좌표
	 * @return {Point} 스크린 좌표계 좌표
	 */
	canvas2screen: function(){
		var x = 0, y = 0;
		if (arguments.length == 1) { x = arguments[0].x; y = arguments[0].y; }
		else { x = arguments[0]; y = arguments[1]; }

		var box = AbCommon.getBounds(this.viewContext.canvas);
		var pos = $(this.viewContext.canvas).position();
		var scr = AbCommon.scrolledParents($(this.viewContext.canvas));

		return {
			x: x + pos.left + scr.x + this.margin.left,
			y: y + pos.top + scr.y + this.margin.top,
		};
	},

	/**
	 * jQuery 이벤트 객체에서 정보를 추출합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 * @return {AbViewerEngine.EventInfo} 이벤트 추출 정보
	 */
	event: function (e){
		var ctrlKey = e ? e.ctrlKey : false;
		var shiftKey = e ? e.shiftKey : false;
		var altKey = e ? e.altKey : false;
		var isRightKey = (e && e.originalEvent ? e.originalEvent.location : 1) == 2;

		var box = AbCommon.getBounds(this.viewContext.canvas);
		var scr = AbCommon.scrolledParents($(this.viewContext.canvas));
		
		var p = {
			x: e.pageX - box.left - scr.x - this.margin.left,
			y: e.pageY - box.top - scr.y - this.margin.top,
		};		

		return {
			x: p.x,
			y: p.y,

			ctrlKey: e ? e.ctrlKey : false,
			shiftKey: e ? e.shiftKey : false,
			altKey: e ? e.altKey : false,

			//isRightKey: (e && e.originalEvent ? e.originalEvent.location : 1) == 2,
			button: e.which == 1 ? 'left' : e.which == 2 ? 'middle' : e.which == 3 ? 'right' : null,
		};
	},

	/**
	 * 마우스 동작 상태 정보
	 * @typedef {Object} AbViewerEngine.ActionStates
	 * @property {AbViewerEngine.EventInfo} arg 이벤트 추출 정보
	 * @property {Number} x 페이지 좌표계 X좌표
	 * @property {Number} y 페이지 좌표계 Y좌표
	 * @property {Boolean} additional 추가 선택 혹은 추가 선택 해제 설정<p>* shift 키가 눌러진 경우 true
	 * @property {Boolean} fixed 드래깅 방향 고정 여부<p>* ctrl 키가 눌러진 경우 true
	 * @property {Boolean} pageMove 이미지 이동 여부<p>* 편집모드에서 space+마우스 드래깅 시에 활성화
	 */

	/**
	 * 마우스 동작을 수행합니다.
	 * @param {Boolean} inCanvas 캔버스 내 동작 여부입니다.
	 * @param {String} type 이벤트 타입 (mousemove|mouseup|mousedown|click|dblclick)
	 * @param {jQueryEventObject} event jQuery Event 객체
	 */
	mouse: function (){
		if (!arguments.length)
			return;

		if (!this.enabled)
			return;
		
		var inCanvas = arguments[0] === true;
		var type = arguments[1];
		var event = arguments[2];

		// canvas 내 event
		if (inCanvas){
			var arg = this.event(event);
			var x = arg.x, y = arg.y;

			//console.log('[ENABLE] pageMove=' + states.pageMove +', fix=' + states.fixed + ', additional=' + states.additional);

			if (this.currentPage){
				var cr = this.currentPage.fromCanvas(x, y);
				x = cr.x;
				y = cr.y;
			}

			var states = {
				arg: arg,
				x: x,
				y: y,
				
				additional: arg.shiftKey,
				fixed: arg.ctrlKey,
				pageMove: false,
			};

			if (this.engineMode == 'edit' && this.listening !== false){
				this.mouseTriggered = true;
				states.pageMove = true;
						
				//console.log('[MOUSE][LISTEN] Page Moving');
			}

			// var ctx = this.viewContext;
			// if (ctx){
			// 	var page = this.currentPage;
	
			// 	ctx.fillStyle = '#00FFFF';
			// 	ctx.beginPath();
			// 	ctx.arc((x * page.scale.x) + page.x, (y * page.scale.y) + page.y, 5, 0, 360);
			// 	ctx.fill();
			// 	ctx.closePath();
			// }

			//if (e.type != 'mousemove') console.log('[CANVAS][EVENT][MOUSE] type='+e.type+' (selection='+this.selection.mode+'), pageX=' + pageX + ', pageY=' + pageY + ', x=' + x + ', y=' + y);
	
			//console.log('[MOUSE]['+type+']['+(arg.isRightKey ? 'right' : 'left')+'] mode=' + (this.selection.mode || '') + ', target=' + (this.selection.target || '') );
			
			switch (type){
			case 'mousemove':
				// 드래깅 방향 결정
				if (states.fixed){
					if (this.selection.direction == this.NONE)
						this.selection.direction = this.analysisMouseDirection(this.selection.prev.x,this.selection.prev.y, x, y);
					
					if (this.selection.direction == this.DIR_HORIZ){
						states.y = y = this.selection.start.y;
						states.arg.y = arg.y = this.selection.canvas.start.y;
					}else if (this.selection.direction == this.DIR_VERT){
						states.x = x = this.selection.start.x;
						states.arg.x = arg.x = this.selection.canvas.start.x;
					}

					if (this.selection.direction)
						this.notifyObservers('mouse.direction', this.selection.direction);
				}else if (this.selection.direction){
					this.selection.direction = this.NONE;

					this.notifyObservers('mouse.direction', this.selection.direction);
				}
				
				this.selection.end.x = x;
				this.selection.end.y = y;				
				this.selection.canvas.end.x = arg.x;
				this.selection.canvas.end.y = arg.y;
			
				switch(this.engineMode){
				case 'edit':
					this.editMouseMoveEvent(event, states);
					break;
				case 'view':
					this.viewMouseMoveEvent(event, states);
					break;
				}

				this.selection.prev.x = x;
				this.selection.prev.y = y;
				this.selection.canvas.prev.x = arg.x;
				this.selection.canvas.prev.y = arg.y;
				break;
			case 'mousedown':
				this.selection.prev.x = this.selection.start.x = this.selection.end.x = x;
				this.selection.prev.y = this.selection.start.y = this.selection.end.y = y;
				this.selection.canvas.prev.x = this.selection.canvas.start.x = this.selection.canvas.end.x = arg.x;
				this.selection.canvas.prev.y = this.selection.canvas.start.y = this.selection.canvas.end.y = arg.y;
			
				switch(this.engineMode){
				case 'edit':
					this.editMouseDownEvent(event, states);
					break;
				case 'view':
					this.viewMouseDownEvent(event, states);
					break;
				}

				// console.log('[MODE] ' + this.selection.mode);
				break;
			case 'mouseup':		
				switch(this.engineMode){
				case 'edit':
					this.editMouseUpEvent(event, states);
					break;
				case 'view':
					this.viewMouseUpEvent(event, states);
					break;
				}
				break;
			case 'click':						
				// console.log('[CLICK] ' + this.selection.mode + ', x=' + x + ', y=' + y);

				switch(this.engineMode){
				case 'edit':
					this.editMouseClickEvent(event, states);
					break;
				case 'view':
					this.viewMouseClickEvent(event, states);
					break;
				}
				break;
			case 'mousewheel': case 'wheel':
				return this.mouseWheelEvent(event);
			}
		}else{
			var e = arguments.length >= 2 ? arguments[1] : null;

			switch (type){
			case 'mousemove': break;
			case 'mousedown': break;
			case 'mouseup':
				switch(this.engineMode){
				case 'edit':
					this.editMouseUpEvent(event);
					break;
				case 'view':
					this.viewMouseUpEvent(event);
					break;
				}
				break;
			}
		}
	},
		
	//-----------------------------------------------------------

	/**
	 * 편집모드 mousemove 이벤트의 동작을 수행합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 * @param {AbViewerEngine.ActionStates} [states] 마우스 동작 상태 정보
	 */
	editMouseMoveEvent: function (e, states){		
		switch(this.selection.mode){
		case 'page-move':
			this.move(states.arg.x - this.selection.canvas.prev.x, states.arg.y - this.selection.canvas.prev.y, true);

			// Notify
			this.notifyObservers('page', 'move');

			//console.log('[MOUSE][MOVE] Page Moving...');
			break;
		case 'selection':
			this.restoreSelection();
			this.drawSelection();
			break;
		case 'creation':
			var targetShape = this.shapeObject(this.selection.target);
			if (AbCommon.wannaCollectPoints(targetShape))
				targetShape.addPoint(this.selection.end.x, this.selection.end.y);

			if (!AbCommon.supportCreationDraw(targetShape))
				this.restoreSelection();
				//console.log('aa');
			
			if (!AbCommon.hasCreationStyleShape(targetShape) || targetShape.creationStyle() != 'click')
				this.drawCreation();
			break;
		case 'move':					
			var xval = states.x - this.selection.prev.x;
			var yval = states.y - this.selection.prev.y;

			var len = this.selectedShapes.length;
			for (var i=0; i < len; i++){
				var s = this.selectedShapes[i];
				s.move(xval, yval, true);
			}
			this.render();

			//if (this.focusedShape) { var box = this.focusedShape.box(); console.log('[MOVE] x: ' + box.x + ', y: ' + box.y); }
			break;
		case 'resize':
			this.resizeSelection(states.x, states.y);
			break;
		default:
			this.editNormalMouseOperation(e, states);
			break;
		}
	},

	/**
	 * 편집모드 mousemove 이벤트의 동작 중 단순 마우스 조작에 대한 처리를 수행합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 * @param {AbViewerEngine.ActionStates} [states] 마우스 동작 상태 정보
	 */
	editNormalMouseOperation: function (e, states){
		var edit = null;
		var sel = null;
		var x = states.x, y = states.y;
		for (var i = this.selectedShapes.length - 1; i >= 0; i--){
			var s = this.selectedShapes[i];

			if ((edit = s.editable(x, y, this.viewContext)) != null){
				sel = s;
				break;
			}
		}

		if (!edit){
			for (var i = this.selectedShapes.length - 1; i >= 0; i--){
				var s = this.selectedShapes[i];

				if (s.contains(x, y, this.viewContext)){
					sel = s;
					break;
				}
			}
		}

		if (edit){
			this.selection.edit = edit;
			this.selection.editTarget = sel;
		}else{
			this.selection.edit = null;
			this.selection.editTarget = null;
		}

		//console.log('[EDIT] edit=' + edit + ', target=' + sel);

		if (this.cursor() != 'pointer'){
			if (edit){
				var cursor = AbGraphics.cursor(edit, sel.angle);
				this.cursor(cursor);
			}else if (sel){
				this.cursor('move');
			}else{
				var cursor = this.cursor();
				if(cursor && cursor != 'default')
					this.cursor('default');
			}
		}
	},

	/**
	 * 편집모드 mousedown 이벤트의 동작을 수행합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 * @param {AbViewerEngine.ActionStates} [states] 마우스 동작 상태 정보
	 */
	editMouseDownEvent: function(e, states){
		if (states.pageMove){
			var r = this.testContentView();
			if (!r.inCanvas){
				this.selection.mode = 'page-move';

				//-----------------------------------------------------------
				// begin record history
				//this.history.begin('page', 'update', this, ['x', 'y']);
				//-----------------------------------------------------------

				// console.log('[PAGE-MOVE] START');
			}
		}

		if (!this.selection.mode){
			var targetShape = this.shapeObject(this.selection.target);

			if (this.selection.editTarget && this.selection.edit){
				this.selection.mode = 'resize';
			}else if (targetShape){
				this.unselect(false);
				this.selection.mode = 'creation';
	
				if (AbCommon.wannaCollectPoints(targetShape)){
					targetShape.addPoint(this.selection.end.x, this.selection.end.y);
				}
	
				this.runtime = true;
				// console.log('[RUNTIME][ON] ' + this.runtime);
			}else{
				var s = null;
	
				// [20180719] 파워포인트 처럼 처기하기 위해 아래 코드 삭제
				// if (this.selectedShapes.length && (s = this.getContainsSelection(states.x, states.y))){					
				// 	if (states.additional){
				// 		if (s.selected){
				// 			this.unselectShape(s);
				// 			this.render();
				// 			return;
				// 		}else{
				// 			this.focusShape(s);
				// 			this.selection.mode = 'mmove';
				// 		}
				// 	}else{
				// 		this.focusShape(s);
				// 		this.selection.mode = 'move';
				// 	}
				// 	this.render();
				// }
	
				if (!this.selection.mode){
					s = this.getShape(states.x, states.y);
					if (s){
						if (s.selected){
							if (states.additional){
								this.unselectShape(s);
								this.render();
								return;
							}else{
								this.focusShape(s);
								this.selection.mode = 'move';
							}
							this.render();
						}else{
							if (!states.additional)
								this.unselect(false);
							this.selectShape(s);
							this.selection.mode = 'move';
							this.render();
						}
					}
				}
	
				if (!this.selection.mode){
					this.selection.mode = 'selection';

					this.runtime = true;
					// console.log('[RUNTIME][ON] ' + this.runtime);
				}
			}

			//-----------------------------------------------------------
			// begin record history
			switch(this.selection.mode){
			case 'resize':
				this.history.begin('shape', 'update', this, ['angle', 'x', 'y', 'width', 'height', 'x1', 'y1', 'x2', 'y2', 'textWidth', 'textHeight', 'text'], this.selection.edit);
				break;
			case 'move':
				this.history.begin('shape', 'update', this, ['angle', 'x', 'y', 'x1', 'y1', 'x2', 'y2']);
				break;
			}
			//-----------------------------------------------------------
		}
	},

	/**
	 * 편집모드 mouseup 이벤트의 동작을 수행합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 * @param {AbViewerEngine.ActionStates} [states] 마우스 동작 상태 정보
	 */
	editMouseUpEvent: function (e, states){
		if (!states) states = {};

		switch(this.selection.mode){
		case 'page-move':
			//-----------------------------------------------------------
			// end record history
			//this.history.end(this);
			//-----------------------------------------------------------

			this.selection.reset();

			// Notify
			this.notifyObservers('page', 'moved');

			// console.log('[PAGE-MOVE] END');
			break;
		case 'selection':
			this.restoreSelection();
			this.selection.reset();

			this.select({
				additional: states.additional
			});

			this.runtime = false;
			// console.log('[RUNTIME][OFF] ' + this.runtime);
	
			
			// Notify
			this.notifyObservers('selection', 'end');
		
			break;
		case 'creation':
			this.runtime = false;
			// console.log('[RUNTIME][OFF] ' + this.runtime);

			var targetShape = this.shapeObject(this.selection.target);
			
			// record end point
			if (AbCommon.wannaCollectPoints(targetShape)){
				targetShape.endPoint();
			}

			// cloning
			if (AbCommon.isString(this.selection.target)){
				var templateShape = targetShape;
				targetShape = AbCommon.cloneShape(targetShape);
				templateShape.reset();
			}

			// restore background
			this.restoreSelection();

			// check minimum size
			var x1 = this.selection.start.x, y1 = this.selection.start.y;
			var x2 = this.selection.end.x, y2 = this.selection.end.y;
	
			if ((!AbCommon.hasCreationStyleShape(targetShape) || targetShape.creationStyle() != 'click') && (AbCommon.hasCreationMinimum(targetShape) || AbCommon.hasMinimum(targetShape))){
				var m = AbCommon.hasCreationMinimum(targetShape) ? targetShape.creationMinimum() : targetShape.minimum();
				var mod = false;
				if (m.width > Math.abs(x2 - x1)){
					if (x2 < x1) x2 = x1 - m.width;
					else x2 = x1 + m.width;
					mod = true;
				}
	
				if (m.height > Math.abs(y2 - y1)){
					if (y2 < y1) y2 = y1 - m.height;
					else y2 = y1 + m.height;
					mod = true;
				}
	
				if (mod){
					//console.log('[ADD][MOD] x1: ' + x1 + ', y1: ' + y1 + ', x2: ' + x2 + ', y2: ' + y2);

					targetShape.rect(x1, y1, x2, y2);
				}
			}

			//-----------------------------------------------------------
			// begin record history
			this.history.begin('shape', 'add', this);
			//-----------------------------------------------------------
			
			// add draw list
			this.currentPage.shapes.push(targetShape);
			this.selectShape(targetShape);

			// link engine
			targetShape['engine'] = this;

			// notify created
			targetShape.notify('created', x1, y1, x2, y2);

			// do measure
			targetShape.measure();

			// notify measured
			targetShape.notify('measured');
			
			// log
			//var tbox = targetShape.box();
			//console.log('[ADD] x: ' + tbox.x + ', y: ' + tbox.y + ', width: ' + tbox.width + ', height: ' + tbox.height);
			//var trect = targetShape.rect();
			//console.log('\t x1: ' + trect.x1 + ', y1: ' + trect.y1 + ', x2: ' + trect.x2 + ', y2: ' + trect.y2);

			//-----------------------------------------------------------
			// end record history
			this.history.end(this);
			//-----------------------------------------------------------

			// finish
			this.selection.reset();
			this.render();

			// Notify
			this.notifyObservers('shape', 'created');

			// Notify modified
			this.modified();
			break;
		case 'resize':

			this.notifySelectionShapes('resized');

			//-----------------------------------------------------------
			// end record history
			this.history.end(this);
			//-----------------------------------------------------------

			// finish
			this.selection.reset();
			this.render();

			// Notify
			this.notifyObservers('shape', 'resized');

			// Notify modified
			this.modified();
			break;
		case 'move':
			var fs = this.focusedShape;
			if (!this.selection.dragged()){
				//-----------------------------------------------------------
				// cancel record history
				this.history.cancel();
				//-----------------------------------------------------------

				if (!states.additional)
					this.unselect({
						unfocusOnly: true
					});

				if (this.selectedShapes.length){
					// Notify
					this.notifyObservers('shape', 'click');
				}

				if (this.selectedShapes.length == 1 && fs && AbCommon.isSupportInlineEditShape(fs) && fs.testInlineEdit(this.viewContext, this.selection.end.x, this.selection.end.y)){
					this.selection.reset();
					this.selection.mode = 'inline';
					this.selection.clickTarget = fs;
					return;
				}else{
					this.selection.reset();
					this.selection.clickTarget = fs;
				}
			}else{
				this.notifySelectionShapes('moved');

				//-----------------------------------------------------------
				// end record history
				this.history.end(this);
				//-----------------------------------------------------------

				// Notify
				this.notifyObservers('shape', 'moved');

				// Notify modified
				this.modified();
			}

			// if (!this.selection.dragged() && fs && AbCommon.isSupportInlineEditShape(fs)){
			// 	this.selection.reset();
			// 	if (this.selectedShapes.length == 1 && fs.testInlineEdit(this.viewContext, this.selection.end.x, this.selection.end.y)){
			// 		this.selection.reset();
			// 		this.selection.mode = 'inline';
			// 		this.selection.clickTarget = fs;	
			// 	}
			// 	break;
			// }else if (!this.selection.dragged()){
			// 	if (!states.states.additional)
			// 		this.unselect({
			// 			unfocusOnly: true
			// 		});
			// 	this.selection.reset();
			// 	this.selection.clickTarget = fs;
			// 	break;
			// }

			//var tbox = this.focusedShape.box();
			//console.log('[MOVE] x: ' + tbox.x + ', y: ' + tbox.y + ', width: ' + tbox.width + ', height: ' + tbox.height);
			//var trect = this.focusedShape.rect();
			//console.log('\t x1: ' + trect.x1 + ', y1: ' + trect.y1 + ', x2: ' + trect.x2 + ', y2: ' + trect.y2);
		default:
			if (e.target && !this.selection.mode && this.selection.target){
				var target = $(e.target);
				if (target.attr('ve-type') === 'creation')
					return;
			}
			this.selection.reset();
			break;
		}
	},

	/**
	 * 편집모드 click 이벤트의 동작을 수행합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 * @param {AbViewerEngine.ActionStates} [states] 마우스 동작 상태 정보
	 */
	editMouseClickEvent: function (e, states){
		switch(this.selection.mode){
		case 'inline':
			//console.log('[INLINE]');
			this.exec(function (){
				if (this.selection.clickTarget)
				this.selection.clickTarget.inlineEdit(this);

				this.selection.reset();

				// Notify
				this.notifyObservers('shape', 'inline');
			});
			break;
		}
	},
	
	//-----------------------------------------------------------

	/**
	 * 보기모드 mousemove 이벤트의 동작을 수행합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 * @param {AbViewerEngine.ActionStates} [states] 마우스 동작 상태 정보
	 */
	viewMouseMoveEvent: function (e, states){
		switch(this.selection.mode){
		case 'page-move':
			this.move(states.arg.x - this.selection.canvas.prev.x, states.arg.y - this.selection.canvas.prev.y, true);

			// Notify
			this.notifyObservers('page', 'move');
			break;
		}
	},

	/**
	 * 보기모드 mousedown 이벤트의 동작을 수행합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 * @param {AbViewerEngine.ActionStates} [states] 마우스 동작 상태 정보
	 */
	viewMouseDownEvent: function (e, states){
		if (!this.selection.mode){
			var r = this.testContentView();
			if (!r.inCanvas){
				this.selection.mode = 'page-move';

				//console.log('[PAGE-MOVE] START');
			}
		}
	},

	/**
	 * 보기모드 mouseup 이벤트의 동작을 수행합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 * @param {AbViewerEngine.ActionStates} [states] 마우스 동작 상태 정보
	 */
	viewMouseUpEvent: function (e, states){
		switch(this.selection.mode){
		case 'page-move':
			this.selection.reset();

			//console.log('[PAGE-MOVE] END');

			// Notify
			this.notifyObservers('page', 'moved');
			break;
		}
	},
	
	/**
	 * 보기모드 click 이벤트의 동작을 수행합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 * @param {AbViewerEngine.ActionStates} [states] 마우스 동작 상태 정보
	 */
	viewMouseClickEvent: function (e, states){
	},

	//-----------------------------------------------------------

	/**
	 * 시작 점에서 끝 점의 방향을 분석합니다.
	 * @param {Number} x1 시작점 X좌표
	 * @param {Number} y1 시작점 Y좌표
	 * @param {Number} x2 끝점 X좌표
	 * @param {Number} y2 끝점 Y좌표
	 * @return {Number} 드래깅 방향
	 * (0={@link AbViewerEngine#NONE|NONE}|1={@link AbViewerEngine#DIR_HORIZ|DIR_HORIZ}|2={@link AbViewerEngine#DIR_VERT|DIR_VERT})
	 */
	analysisMouseDirection: function(x1, y1, x2, y2){
		var xval = Math.abs(x2 - x1);
		var yval = Math.abs(y2 - y1);

		if (!xval && !yval)
			return this.NONE;

		if (xval >= yval)
			return this.DIR_HORIZ;
		return this.DIR_VERT;
	},
	
	//-----------------------------------------------------------

	/**
	 * 마우스 휠에서 확대/축소의 비율 단계
	 * @private
	 * @type {Number}
	 * @default
	 */
	prevScaleStep: 1,

	/**
	 * 마우스 휠 이벤트를 처리합니다.
	 * @param {jQueryEventObject} e jQuery Event 객체
	 */
	mouseWheelEvent: function(e){
		//var delta = (e.wheelDeltaY || (e.originalEvent && (e.originalEvent.wheelDeltaY || e.originalEvent.wheelDelta)) || e.wheelDelta || 0);
		//console.log('[BODY LOCK] ' + e.type + ', delta='+delta+', target=' + e.target);
		//var body = $(e.data.headers[idx].listSelector());
		//body.scrollTop(body.scrollTop() - delta);
		//e.data.scroll(idx, -delta);

		this.textbox.hide();

		var ed = this.event(e);

		var d = AbCommon.wheel.normalize(e.originalEvent);
		//console.log('[WHEEL] spinX=' + d.spinX + ', spinY=' + d.spinY + ', pixelX=' + d.pixelX + ', pixelY=' + d.pixelY);

		var page = this.currentPage;

		var fastZoom = e.shiftKey;
		var scaleStep = fastZoom ? this.SCALE_ANI_STEP : this.SCALE_STEP;
		var step = this.prevScaleStep;
		if (d.spinY < 0) step = 1 + scaleStep; else step = 1 - scaleStep;

		var zoom = page.scale.x * step;
		
		//-----------------------------------------------------------

		if (zoom < this.MIN_SCALE) zoom = this.MIN_SCALE;
		else if (zoom > this.MAX_SCALE) zoom = this.MAX_SCALE;

		if (this.scale(zoom, ed.x, ed.y, null, fastZoom, this.SCALE_ANI_DURATION) === false)
			this.prevScaleStep *= step;
		else
			this.prevScaleStep = 1;

		e.preventDefault();
		e.stopPropagation(); 

		return false;
	},
		
	//-----------------------------------------------------------

	/**
	 * 엔진 모드를 설정하거나 가져옵니다.
	 * <p>* 현재 페이지가 있고 편집이 가능한 경우만 설정할 수 있습니다.
	 * <p>* 설정 후 mode가 Notify됩니다.
	 * @param {String} [mode] 모드 (edit=편집모드|view=보기모드)
	 * @return {String} 엔진 모드
	 */
	mode: function (){
		if (this.currentPage && this.maniplatable() && arguments.length){
			var s = (arguments[0] || '').toLowerCase();
			if (s && this.engineMode != s){
				this.engineMode = s;

				this.unselect(false);
				this.prepare();
				this.render();

				// Notify
				this.notifyObservers('mode', s);
			}
		}
		return this.engineMode;
	},

	/**
	 * 준비 작업을 수행합니다.
	 * <p>* 엔진 모드에 따른 마우스 커서를 설정합니다.
	 */
	prepare: function(){
		if (!this.currentPage || !this.maniplatable()) return;

		switch(this.engineMode){
		case 'edit':
			this.cursor('default');
			break;
		case 'view':
			this.cursor('pointer');
			break;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 캔버스 엘리먼트에 포커스를 줍니다.
	 */
	focus: function(){
		if (this.viewContext.canvas)
			this.viewContext.canvas.focus();
	},

	/**
	 * 마우스 커서를 설정하거나 가져옵니다.
	 * @param {String} [value] 마우스 커서
	 * @return {String} 마우스 커서
	 */
	cursor: function(value){
		if (arguments.length){
			this.exec(function (){
				var e = this.panel;
				//var e = this.panel;
				
				e.css('cursor', value);
				//console.log ('[CURSOR] ' + e.css('cursor'));
	
				//$(document.body).css('cursor', value);
			});
		}else return this.panel.css('cursor');
	},

	//-----------------------------------------------------------

	/**
	 * 크기 변경에 대한 처리를 수행합니다.
	 * <p>* 완료 후 resize가 Notify됩니다.
	 */
	resize: function(){
		this.runtime = true;

		var width = this.panel.width(), height = this.panel.height();
		if (width <= 0 || height <= 0) return;

		var temp = $('<canvas width="'+width+'" height="'+height+'"/>');
		var tempCtx = temp.get(0).getContext('2d');

		tempCtx.drawImage(this.context.canvas, 0, 0);

		//-----------------------------------------------------------

		var bufe = $(this.context.canvas);
		bufe.css({
			width: width,
			height: height
		});

		this.context.canvas.width = width;
		this.context.canvas.height = height;

		//-----------------------------------------------------------

		//console.log('[RESIZE][CANVAS] width=' + this.context.canvas.width + ', height=' + this.context.canvas.height + ', fitTo=' + this.currentPage.fitTo);
					
		this.imagePositioning(width, height);
		this.render(false);

		//-----------------------------------------------------------

		var e = $(this.viewContext.canvas);
		e.css({
			width: width,
			height: height
		});

		this.viewContext.canvas.width = width;
		this.viewContext.canvas.height = height;

		//-----------------------------------------------------------

		this.viewContext.drawImage(tempCtx.canvas, 0, 0);

		//console.log('[RESIZE][VIEW-CANVAS] width=' + this.viewContext.canvas.width + ', height=' + this.viewContext.canvas.height + ', fitTo=' + this.currentPage.fitTo);

		//-----------------------------------------------------------
		
		this.paint();
		
		this.runtime = false;

		// Notify
		this.notifyObservers('resize');
	},

	//-----------------------------------------------------------

	/**
	 * 화면 캔버스 정보
	 * @typedef {Object} AbViewerEngine.CanvasInfo
	 * @property {Size} canvas 캔버스의 크기
	 * @property {Point} center 화면 중심점 촤표
	 * @property {Size} content 화면에서 페이지의 크기 (확대/축소 비율 적용됨)
	 * @property {Boolean} inCanvas 페이지가 캔버스보다 작으면 true
	 * @property {Boolean} horizInCanvas 페이지의 폭이 캔버스의 폭보다 작으면 true
	 * @property {Boolean} vertInCanvas 페이지의 높이가 캔버스의 높이보다 작으면 true
	 */

	/**
	 * 화면 정보를 가져옵니다.
	 * @param {Number} [scale=1] 화면 확대/축소율
	 * @return {AbViewerEngine.CanvasInfo} 화면 캔버스 정보
	 */
	testContentView: function (scale){
		var canvas = this.context.canvas;
		var page = this.currentPage;

		var scaleX = 1, scaleY = 1;
		if (!arguments.length){
			scaleX = page.scale.x;
			scaleY = page.scale.y;
		}else
			scaleX = scaleY = scale;

		var contentsWidth = page.width * scaleX, contentsHeight = page.height * scaleY;

		var viewWidth = canvas.width, viewHeight = canvas.height;
		viewWidth -= this.margin.horiz();
		viewHeight -= this.margin.vert();
		
		var viewCenter = this.screen2canvas(viewWidth >> 1, viewHeight >> 1);
		
		var horizInCanvas = viewWidth >= contentsWidth, vertInCanvas = viewHeight >= contentsHeight;
		var inCanvas = horizInCanvas && vertInCanvas;

		return {
			canvas: { width: viewWidth, height: viewHeight },
			center: viewCenter,
			contents: { width: contentsWidth, height: contentsHeight },
			inCanvas: inCanvas,
			horizInCanvas: horizInCanvas,
			vertInCanvas: vertInCanvas
		};
	},

	//-----------------------------------------------------------

	/**
	 * 이미지를 회전합니다.
	 * <p>* 이미지 회전 각도의 가져오면 인자 없이 호출하며, 회전할려면 방향과 회전각도는 필수로 설정해야 합니다.
	 * <p>* 애니메이션 진행 중 애니메이션 rotate의 상태가 플래그됩니다.
	 * <p>* 완료 후 rotate가 Notify됩니다.
	 * @param {Number} [direction] 방향 ({@link AbRotate#CW|AbRotate.CW}|{@link AbRotate#CCW|AbRotate.CCW}=반시계방향)
	 * @param {Number} [degree] 회전 각도 ({@link AbRotate#DEG_90|AbRotate.DEG_90}=90도|{@link AbRotate#DEG_180|AbRotate.DEG_180}=180도|{@link AbRotate#DEG_270|AbRotate.DEG_270}=270도|{@link AbRotate#DEG_360|AbRotate.DEG_360}=360도)
	 * @param {Function} [callback] 회전 완료 후 호출될 콜백 함수
	 * @param {Boolean} [animating=true] 애니메이션 수행 여부
	 * @return {Number} 페이지의 회전 각도
	 */
	rotate: function (direction, degree, callback, animating){
		if (!AbCommon.isBool(animating)) animating = true;
		if (!this.currentPage) return 0;

		if (arguments.length == 2){
			if (!this.maniplatable())
				return;
			
			if (!direction) direction = 1;
			if (!degree) degree = 1;

			direction = parseInt(direction);
			degree = parseInt(degree);

			if (direction != 1 && direction != -1){
				throw 'Invalid direction';
				return;
			}

			if (degree < 0 || degree > 3){
				throw 'Invalid direction';
				return;
			}

			//-----------------------------------------------------------

			this.animateStates.begin('rotate');

			//-----------------------------------------------------------
			
			degree = parseInt(direction) * (parseInt(degree) * 90);

			var angle = this.currentPage.angle;
			var destAngle = angle + degree;

			//-----------------------------------------------------------

			var page = this.currentPage;
			var image = page.image();
			var srcsiz = page.sourceSize();
			var pr = AbGraphics.angle.point(destAngle, 0, 0, srcsiz.width, srcsiz.height);

			var imgpos = this.calcImagePosition(null, null, Math.round(Math.abs(pr.x)), Math.round(Math.abs(pr.y)));

			//-----------------------------------------------------------
			// begin record history
			this.history.begin('page', 'update', this, ['angle', 'width', 'height', 'x', 'y', 'scale'], function(c, o, ctoken, otoken){
				if (c.scale){
					page.scale.x = c.scale.x;
					page.scale.y = c.scale.y;
				}

				if (ctoken && ctoken.fited)
					page.fitTo = ctoken.to;
				
				this.rotatePage(c.angle, false);
			}, { fited: imgpos && imgpos.fited, to: imgpos && imgpos.to });
			//-----------------------------------------------------------

			this.exec(function (){
				AbCommon.tween({
					caller: this,
					start: 0,
					end: 1,
					easing: this.ROTATE_ANI_EASING,
					duration: this.ROTATE_ANI_DURATION,
					animating: animating && this.enableAnimate,
					proc: function (value, d, step){
						if (imgpos && imgpos.fited){
							//console.log('[FIT][ING] ' + value + ', start=' + d.start + ', end=' + d.end + ', scale='+imgpos.scale+', ratio=' + imgpos.ratio + ', value=' + (imgpos.scale + (imgpos.ratio-imgpos.scale) * value));

							var scaleValue = d.end - value;

							page.scale.x = imgpos.scale + (imgpos.ratio-imgpos.scale) * value;
							page.scale.y = imgpos.scale + (imgpos.ratio-imgpos.scale) * value;
						}
						
						this.rotatePage(angle + (degree * value), false, false);

						if (imgpos && imgpos.fited){
							this.center(imgpos.canvas.width, imgpos.canvas.height);
						}else
							this.center();

						this.render();
					},
					ended: function(d){
						this.rotatePage(destAngle, false);

						//-----------------------------------------------------------
						// end record history
						this.history.end(this);
						//-----------------------------------------------------------

						this.animateStates.end('rotate');

						if (typeof callback == 'function')
							this.exec(callback);

						// Notify
						this.notifyObservers('rotate', { from: angle, to: destAngle });

						// Notify modified
						this.modified();						
					},
				});
			});
		}

		return this.currentPage.angle;
	},

	/**
	 * 이미지를 회전합니다.
	 * @private
	 * @param {Number} degree 회전 각도 (0~359)
	 * @param {Boolean} [increase=true] degree가 증감량인지 설정
	 * @param {Boolean} [rendering=true] 회전 후 렌더링 할지 여부
	 */
	rotatePage: function (degree, increase, rendering){
		if (arguments.length == 1) increase = true;

		if (!AbCommon.isBool(rendering)) rendering = true;

		var page = this.currentPage;

		var stepDegree = 0;
		if (!increase) stepDegree = degree - page.angle;
		else stepDegree = degree;

		if (stepDegree == 0) return;

		var prevAngle = page.angle;
		page.angle = AbGraphics.angle.increase(page.angle, stepDegree);

		var image = page.image();
		var srcsiz = page.sourceSize();
		var pageWidth = srcsiz.width, pageHeight = srcsiz.height;
		
		var pr = AbGraphics.angle.point(page.angle, 0, 0, pageWidth, pageHeight);
		page.width = Math.round(Math.abs(pr.x));
		page.height = Math.round(Math.abs(pr.y));

		var pp = AbGraphics.angle.correctDisplayCoordinate(prevAngle, pageWidth, pageHeight, false);
		var cp = AbGraphics.angle.correctDisplayCoordinate(page.angle, pageWidth, pageHeight, false);
		
		// console.log('[PAGE][ROTATE] page( angle: ' + page.angle + ', stepDegree='+stepDegree+', width: ' + pageWidth + ', height: ' + pageHeight+' )');
		// console.log('[PAGE][ROTATE][PRE] correct(x: '+pp.x+', y: ' + pp.y + ')');
		// console.log('[PAGE][ROTATE][NEW] correct(x: '+cp.x+', y: ' + cp.y + ')');
	
		var slen = page.shapes.length;
		for (var i=0; i < slen; i++){
			var s = page.shapes[i];

			if (s.shapeStyle == 'line'){
				var r = AbGraphics.angle.rect(-prevAngle, 0, 0, s.x1 + pp.x, s.y1 + pp.y, s.x2 + pp.x, s.y2 + pp.y);
				r = AbGraphics.angle.rect(page.angle, 0, 0, r.x1, r.y1, r.x2, r.y2);

				s.rect(r.x1 - cp.x, r.y1 - cp.y, r.x2 - cp.x, r.y2 - cp.y);
			}else{
				var c = s.center();
				var cr = AbGraphics.angle.point(-prevAngle, 0, 0, c.x + pp.x, c.y + pp.y);
				var sr = AbGraphics.angle.point(-prevAngle, 0, 0, s.x + pp.x, s.y + pp.y);

				cr = AbGraphics.angle.point(page.angle, 0, 0, cr.x, cr.y);
				sr = AbGraphics.angle.point(page.angle, 0, 0, sr.x, sr.y);

				sr = AbGraphics.angle.point(-stepDegree, cr.x, cr.y, sr.x, sr.y);

				//console.log('\t\t['+s.shapeStyle+'] sr.x: '+sr.x + ', sr.y: '+sr.y+', cr.x: '+cr.x+', cr.y: '+cr.y);

				s.box(sr.x - cp.x, sr.y - cp.y, s.width, s.height);
	
				s.setAngle(AbGraphics.angle.increase(s.angle, stepDegree));

				//console.log('\t['+s.shapeStyle+'] x: '+s.x + ', y: '+s.y+', width: '+s.width+', height: '+s.height+', angle: '+s.angle + ', sr(x=' + sr.x + ', y=' + sr.y + ')');
			}
		}

		if (rendering){
			this.imagePositioning();
			this.render();
		}
	},

	/**
	 * 이미지를 확대/축소합니다.
	 * <p>* 완료 후 fit과 scale이 순차적으로 Notify됩니다.
	 * @param {Number} value 확대/축소 비율
	 * @param {Number} canvasX 캔버스 좌표계 X좌표
	 * @param {Number} canvasY 캔버스 좌표계 Y좌표
	 * @param {Function} [callback] 확대/축소 후 호출되는 콜백 함수
	 * @param {Boolean} [animating=true] 확대/축소 애니메이션 실행 여부
	 * @param {Number} [duration=400] 확대/축소 애니메이션 시간
	 */
	scale: function (value, canvasX, canvasY, callback, animating, duration){
		if (!AbCommon.isBool(animating)) animating = true;
		if (!AbCommon.isNumber(duration)) duration = 400;
		if (!this.currentPage) return 1;
		
		if (arguments.length){

			this.currentPage.fitTo = null;

			// Notify
			this.notifyObservers('fit', null);

			var r = this.doScale(value, canvasX, canvasY, callback, animating, duration);
			if (r == -2)
				return false;

			// Notify
			this.notifyObservers('scale', value);
		}
		return this.currentPage.scale.x;
	},

	/**
	 * 이미지를 확대/축소합니다.
	 * <p>* 애니메이션 진행 중 애니메이션 scale의 상태가 플래그됩니다.
	 * @private
	 * @param {Number} value 확대/축소 비율
	 * @param {Number} canvasX 캔버스 좌표계 X좌표
	 * @param {Number} canvasY 캔버스 좌표계 Y좌표
	 * @param {Function} [callback] 확대/축소 후 호출되는 콜백 함수
	 * @param {Boolean} [animating=true] 확대/축소 애니메이션 실행 여부
	 * @param {Number} [duration=400] 확대/축소 애니메이션 시간
	 * @param {Boolean} [rendering=true] 화면 표시 여부 (애니메이션 중, 확대/축소 후)
	 * @return {Number} 실행 결과
	 * <dl>
	 * 	<dt>0</dt><dd>Cancel: 작업 수행을 할 필요가 없어 취소합니다.</dd>
	 * 	<dt>1</dt><dd>InProgress: 확대/축소 진행 중 입니다.</dd>
	 * 	<dt>-1</dt><dd>엔진이 편집할 수 없는 상태입니다.</dd>
	 * </dl>
	 */
	doScale: function (value, canvasX, canvasY, callback, animating, duration, rendering){
		if (!AbCommon.isBool(animating)) animating = true;
		if (!AbCommon.isNumber(duration)) duration = 400;
		if (!AbCommon.isBool(rendering)) rendering = true;
		if (!this.currentPage) return -1;
		
		if (!this.maniplatable())
			return -2;

		if (value < this.MIN_SCALE) value = this.MIN_SCALE;
		//else if (value > this.MAX_SCALE) value = this.MAX_SCALE;

		//-----------------------------------------------------------
		// begin record history
		// this.history.begin('page', 'update', this, ['scale'], function(c, o){
		// 	this.scale(c.scale.x, null, false);
		// });
		//-----------------------------------------------------------
		
		var page = this.currentPage;
		if (value == page.scale.x)
			return 0;
		
		var r = this.testContentView();
		var tr = this.testContentView(value);

		if (!AbCommon.isNumber(canvasX)) canvasX = r.center.x;
		if (!AbCommon.isNumber(canvasY)) canvasY = r.center.y;

		//-----------------------------------------------------------
		
		this.animateStates.begin('scale');

		//console.log('[SCALE] BEGIN...');

		if (r.inCanvas || tr.inCanvas){
			AbCommon.tween({
				caller: this,
				start: page.scale.x,
				end: value,
				easing: this.SCALE_ANI_EASING,
				duration: duration,
				animating: animating && this.enableAnimate,
				proc: function (value, d){
					//console.log('[SCALE][ING] ' + value + ', start=' + d.start + ', end=' + d.end);

					page.scale.x = value;
					page.scale.y = value;

					this.center(r.canvas.width, r.canvas.height);
					if (rendering)
						this.render();
				},
				ended: function(d){
					page.scale.x = d.end;
					page.scale.y = d.end;

					this.center(r.canvas.width, r.canvas.height);

					//-----------------------------------------------------------
					// end record history
					//this.history.end(this);
					//-----------------------------------------------------------
					
					if (rendering)
						this.render();

					this.animateStates.end('scale');

					//console.log('[SCALE] END ---------------------------------------------------------');
					//console.log('[SCALED] scale=' + page.scale.x);

					if (typeof callback == 'function')
						this.exec(callback);
				},
			});
		}else{
			var px = r.horizInCanvas ? r.center.x : canvasX;
			var py = r.vertInCanvas ? r.center.y : canvasY;

			//console.log('[SCALE][BEGIN] point(x: ' + px + ', y: ' + py + '), center(x: '+r.center.x + ', y: '+r.center.y + ')');

			var vp = page.fromCanvas(px, py);

			AbCommon.tween({
				caller: this,
				start: page.scale.x,
				end: value,
				duration: duration,
				animating: animating && this.enableAnimate,
				proc: function (value, d){
					//console.log('[SCALE][ING] ' + value + ', start=' + d.start + ', end=' + d.end);

					page.scale.x = value;
					page.scale.y = value;

					var cp = page.toCanvas(vp.x, vp.y);

					//console.log('[SCALE][ING] xval=' + (-(cp.x - px)) + ', yval=' + (-(cp.y - py)) + '');

					this.move(-(cp.x - px), -(cp.y - py), true, false);
					this.render();
				},
				ended: function (d){
					//console.log('[SCALE][END] ======================================================================================');

					page.scale.x = d.end;
					page.scale.y = d.end;

					var cp = page.toCanvas(vp.x, vp.y);

					this.move(-(cp.x - px), -(cp.y - py), true, false);

					//-----------------------------------------------------------
					// end record history
					//this.history.end(this);
					//-----------------------------------------------------------
					
					this.render();

					this.animateStates.end('scale');

					//console.log('[SCALE] END ---------------------------------------------------------');
					//console.log('[SCALED] scale=' + page.scale.x);

					if (typeof callback == 'function')
						this.exec(callback);
				},
			});
		}

		//console.log('[SCALE] scale(x: ' + page.scale.x + ', y: ' + page.scale.y + ', page rect( x: '+page.x + ', y: '+page.y+', width: ' + page.width + ', height: '+page.height+' )')

		return 1;
	},

	/**
	 * 이미지 위치 정보
	 * @typedef {Object} AbViewerEngine.ImagePosInfo
	 * @property {Boolean} fited 화면 맞춤 여부
	 * @property {String} to 화면 맞춤 (in|horiz|vert)
	 * @property {Number} scale 확대/축소 비율
	 * @property {Number} ratio 화면 맞춤 비율
	 * @property {Size} canvas 캔버스 크기
	 * @property {Size} origin 페이지 크기
	 * @property {Box} page 페이지의 상자 정보
	 * @property {Box} destPage 화면에 표시될 페이지의 상자 정보
	 */

	/**
	 * 화면에 표시할 이미지의 위치를 계산합니다.
	 * @private
	 * @param {Number} canvasWidth 캔버스 폭
	 * @param {Number} canvasHeight 캔버스 높이
	 * @param {Number} pageWidth 페이지 폭
	 * @param {Number} pageHeight 페이지 높이
	 * @return {AbViewerEngine.ImagePosInfo} 이미지 위치 정보
	 */
	calcImagePosition: function(canvasWidth, canvasHeight, pageWidth, pageHeight){
		var page = this.currentPage;
		if (!page) return null;
		
		var fited = false;
		var pwidth = null, pheight = null;
		var canvas = this.context.canvas;	
		var cwidth = AbCommon.isNumber(canvasWidth) ? canvasWidth : canvas.width;
		var cheight = AbCommon.isNumber(canvasHeight) ? canvasHeight : canvas.height;

		if (!AbCommon.isNumber(pageWidth)) pageWidth = page.width;
		if (!AbCommon.isNumber(pageHeight)) pageHeight = page.height;
		
		cwidth -= this.margin.horiz();
		cheight -= this.margin.vert();

		switch(page.fitTo){
		case 'in':
			pwidth = pageWidth;
			pheight = pageHeight;
			fited = true;
			break;
		case 'horiz':
			pwidth = pageWidth;
			pheight = 0;
			fited = true;
			break;
		case 'vert':
			pheight = pageHeight;
			pwidth = 0;
			fited = true;
			break;
		}

		var dp = null;
		var ratio = 1;
		if (fited){
			var r = AbGraphics.box.zoom(pwidth, pheight, cwidth, cheight);
			ratio = r.ratio;

			dp = this.calcCenter(cwidth, cheight);
		}else{
			dp = this.calcCenter();
		}

		return {
			fited: fited,
			to: page.fitTo,
			scale: page.scale.x,
			ratio: ratio,
			canvas: { width: cwidth, height: cheight },
			origin: { width: pageWidth, height: pageHeight },
			page: { x: page.x, y: page.y, width: pwidth, height: pheight },
			destPage: { x: dp ? dp.x : page.x, y: dp ? dp.y : page.y, width: pwidth * ratio, height: pheight * ratio },
		};
	},

	/**
	 * 이미지를 화면에 맞춥니다.
	 * <p>* 애니메이션 진행 중 애니메이션 fit의 상태가 플래그됩니다.
	 * @private
	 * @param {Number} canvasWidth 캔버스 폭
	 * @param {Number} canvasHeight 캔버스 높이
	 * @param {Object} [options] 옵션
	 * @param {Object} [options.animate] 애니메이션 진행 여부
	 * @param {Object} [options.callback] 맞춤 후 호출되는 콜백 함수
	 * @param {Object} [options.easing] 애니메이션 Easing 함수명
	 * @param {Object} [options.duration] 애니메이션 진행 시간
	 */
	imagePositioning: function(canvasWidth, canvasHeight, options){
		var page = this.currentPage;
		if (!page || page.error) return;
		
		if (!options) options = {};
		var animating = options.animate === true;
		var callback = options.callback;
		var imgpos = this.calcImagePosition(canvasWidth, canvasHeight);

		//if (!this.maniplatable()) return;

		this.animateStates.begin('fit');

		AbCommon.tween({
			caller: this,
			start: 0,
			end: 1,
			easing: options.easing || this.SCALE_ANI_EASING,
			duration: options.duration || this.SCALE_ANI_DURATION,
			animating: animating && this.enableAnimate,
			proc: function (value, d){
				//console.log('[FIT][ING] ' + value + ', start=' + d.start + ', end=' + d.end + ', scale='+imgpos.scale+', ratio=' + (imgpos.scale + (imgpos.ratio-imgpos.scale) * value));

				if (imgpos.fited){
					page.scale.x = imgpos.scale + (imgpos.ratio-imgpos.scale) * value;
					page.scale.y = imgpos.scale + (imgpos.ratio-imgpos.scale) * value;

					this.center(imgpos.canvas.width, imgpos.canvas.height);
				}else{
					page.x = (imgpos.destPage.x - imgpos.page.x) * value;
					page.y = (imgpos.destPage.y - imgpos.page.y) * value;
				}

				this.render();
			},
			ended: function(d){
				if (imgpos.fited){
					page.scale.x = imgpos.ratio;
					page.scale.y = imgpos.ratio;
		
					this.center(imgpos.canvas.width, imgpos.canvas.height);
				}else
					this.center();
		
				this.animateStates.end('fit');

				//console.log('[FIT] END ---------------------------------------------------------');

				if (typeof callback == 'function')
					this.exec(callback);
			},
		});
	},

	/**
	 * 이미지를 화면에 맞춥니다.
	 * <p>* 완료 후 fit이 Notify됩니다.
	 * @param {String} [value] 화면 맞춤 (in|horiz|vert)
	 * @return {String} 현재 페이지에 설정된 화면맞춤
	 */
	fit: function(value){
		if (arguments.length && this.currentPage){
			this.currentPage.fitTo = value;

			this.imagePositioning(null, null, {
				animate: true,
				callback: function(){
					this.render();

					// Notify
					this.notifyObservers('fit', this.currentPage.fitTo);
				}
			});
		}

		return this.currentPage ? this.currentPage.fitTo : null;
	},

	/**
	 * 폭, 높이 중앙점의 스크린 좌표계 좌표를 계산합니다.
	 * @param {Number} width 폭
	 * @param {Number} height 높이
	 * @return {Point} 스크린 좌표계 좌표
	 */
	calcCenter: function(width, height){
		if (!this.currentPage) return;

		if (!arguments.length){
			width = this.context.canvas.width;
			height = this.context.canvas.height;

			// 마진 적용
			width -= this.margin.horiz();
			height -= this.margin.vert();
		}

		var page = this.currentPage;
		var image = page.image();
		var srcsiz = page.sourceSize();
		var pageWidth = srcsiz.width * page.scale.x, pageHeight = srcsiz.height * page.scale.y;

		var pageX = page.x, pageY = page.y;
		
		if (page.angle){
			var b = AbGraphics.angle.bounds(page.angle, 0, 0, pageWidth, pageHeight);
			pageWidth = b.width;
			pageHeight = b.height;
		}

		//console.log('[CENTERING] w=' + pageWidth + ', H=' + pageHeight);

		var half = 0;
		if (AbCommon.isNumber(width)){
			half = width >> 1;
			pageX = Math.round(half - (pageWidth >> 1));
			//page.x = Math.round(half);
		}

		if (AbCommon.isNumber(height)){
			half = height >> 1;
			pageY = Math.round(half - (pageHeight >> 1));
			//page.y = Math.round(half);
		}

		return {
			x: pageX,
			y: pageY
		}
	},

	/**
	 * 페이지의 중앙을 폭, 높이의 중앙에 위치시킵니다.
	 * @param {Number} width 폭
	 * @param {Number} height 높이
	 */
	center: function(width, height){
		var p = this.calcCenter.apply(this, arguments);
		if (!p) return;

		var page = this.currentPage;
		page.x = p.x;
		page.y = p.y;
	},

	/**
	 * 이미지를 이동합니다.
	 * @param {Number} canvasX 캔버스 좌표계 X좌표
	 * @param {Number} canvasY 캔버스 좌표계 Y좌표
	 * @param {Boolean} [increase=false] canvasX, canvasY가 증감량인지 여부
	 * @param {Boolean} [rendering=true] 화면 표시 여부
	 */
	move: function (canvasX, canvasY, increase, rendering){
		if (!this.currentPage) return;
		if (!AbCommon.isBool(rendering)) rendering = true;

		var page = this.currentPage;
		var oldx = page.x, oldy = page.y;

		//console.log('[CALL][PAGE-MOVE] page(width: ' + page.width + ', height: ' + page.height+')');

		var canvas = this.context.canvas;
		var canvasWidth = canvas.width, canvasHeight = canvas.height;
		// 마진 적용
		canvasWidth -= this.margin.horiz();
		canvasHeight -= this.margin.vert();
	
		var scaledPageWidth = page.width * page.scale.x, scaledPageHeight = page.height * page.scale.y;	
		
		var px = page.x, py = page.y;
		if (increase){
			px += canvasX;
			py += canvasY;
		}else{
			px = canvasX;
			py = canvasY;
		}

		// var s = '\t start(x=' + px + ', y=' + py + '), origin(x='+page.x+', y='+page.y+')';
		// s += ', view(w='+canvasWidth+', h=' + canvasHeight + ')';
		// s += ', scaled page(w='+scaledPageWidth + ', h='+scaledPageHeight+')';
		// s += ', RB(right='+(px+scaledPageWidth)+ ', bottom='+(py+scaledPageHeight)+')';
		// console.log(s);

		var horiz = scaledPageWidth > canvasWidth, vert = scaledPageHeight > canvasHeight;

		if (horiz){
			if (px > 0) px = 0;
			else if (px + scaledPageWidth < canvasWidth) px = canvasWidth - scaledPageWidth;
		}else{
			px = ((canvasWidth >> 1) - (scaledPageWidth >> 1));
		}

		if (vert){
			if (py > 0) py = 0;
			else if (py + scaledPageHeight < canvasHeight) py = canvasHeight - scaledPageHeight;			
		}else{
			py = ((canvasHeight >> 1) - (scaledPageHeight >> 1));
		}

		page.x = px;
		page.y = py;

		// console.log('\t moved page(x=' + page.x + ', y=' + page.y+')');

		if (rendering && (oldx != page.x || oldy != page.y))
			this.render();
	},

	//-----------------------------------------------------------

	/**
	 * 선택된 도형들을 클립보드에 복사합니다.
	 * <p>* 완료 후 clipboard의 copy가 Notify됩니다.
	 */
	copy: function (){
		if (!this.currentPage || !this.maniplatable()) return;
		this.clipboard.copy(this, this.currentPage, this.selectedShapes);

		// Notify
		this.notifyObservers('clipboard', 'copy');
	},

	/**
	 * 선택된 도형들을 제거하고 클립보드에 복사합니다.
	 * <p>* 완료 후 clipboardd의 cut이 Notify됩니다.
	 */
	cut: function(){
		if (!this.currentPage || !this.maniplatable()) return;
		this.clipboard.cut(this, this.currentPage, this.selectedShapes);

		// Notify
		this.notifyObservers('clipboard', 'cut');
	},

	/**
	 * 클립보드에 있는 복사된 도형들을 붙여넣기합니다.
	 * <p>* 완료 후 clipboard의 paste가 Notify됩니다.
	 * @param {Function} [callback] 완료 후 호출될 콜백 함수
	 */
	paste: function (callback){
		if (!this.currentPage || !this.maniplatable()) return;
		this.clipboard.paste(this, this.currentPage, function(){
			// Notify
			this.notifyObservers('clipboard', 'paste');
			
			if (AbCommon.isFunction(callback))
				callback();
		}.bind(this));
	},

	//-----------------------------------------------------------

	/**
	 * 실행 취소를 실행합니다.
	 * <p>* 실행 전 history의 undoing이 Notify됩니다.
	 * <p>* 완료 후 history의 undo가 Notify됩니다.
	 */
	undo: function(){
		if (!this.maniplatable()) return;

		if (this.history.canUndo()){
			// Notify
			this.notifyObservers('history', 'undoing');
			
			this.history.undo(this);

			// Notify
			this.notifyObservers('history', 'undo');
		}
	},

	/**
	 * 다시 실행을 실행합니다.
	 * <p>* 실행 전 history의 redoing이 Notify됩니다.
	 * <p>* 완료 후 history의 redo가 Notify됩니다.
	 */
	redo: function (){
		if (!this.maniplatable()) return;

		if (this.history.canRedo()){
			// Notify
			this.notifyObservers('history', 'redoing');

			this.history.redo(this);

			// Notify
			this.notifyObservers('history', 'redo');
		}
	},

	//-----------------------------------------------------------

	/**
	 * x, y좌표에 있는 도형을 탐색합니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @return {ShapeObject} 도형 인스턴스
	 */
	getShape: function(x, y){
		for (var i = this.currentPage.shapes.length - 1; i >= 0; i--){
			var s = this.currentPage.shapes[i];

			if (!this.isVisibleShapeType(s.type))
				continue;

			if (s.contains(x, y, this.viewContext))
				return s;
		}
		return null;
	},

	//-----------------------------------------------------------

	/**
	 * 선택된 도형들을 제거합니다.
	 * <p>* 완료 후 shape의 delete가 Notify됩니다.
	 * @param {Boolean} [rendering=true] 화면 표시 여부
	 */
	deleteShapes: function (rendering){
		if (!this.currentPage || !this.maniplatable()) return;
		if (!arguments.length) rendering = true;

		//-----------------------------------------------------------
		// begin record history
		this.history.begin('shape', 'remove', this);
		//-----------------------------------------------------------

		var page = this.currentPage;
		for (var i = page.shapes.length - 1; i >= 0; i--){
			var s = page.shapes[i];
			if (s.selected)
				page.shapes.splice(i, 1);
		}

		this.selectedShapes.splice(0, this.selectedShapes.length);
		this.focusedShape = false;

		//-----------------------------------------------------------
		// end record history
		this.history.end(this);
		//-----------------------------------------------------------

		if (rendering)
			this.render();

		// Notify
		this.notifyObservers('shape', 'delete');

		// Notify modified
		this.modified();
	},

	/**
	 * 도형을 포커스된 도형으로 설정합니다.
	 * @param {ShapeObject} s 도형 인스턴스
	 */
	focusShape: function (s){
		if (this.focusedShape)
			this.focusedShape.focused = false;

		s.focused = true;
		s.selected = true;
		this.focusedShape = s;
	},

	/**
	 * 도형을 선택합니다.
	 * @param {ShapeObject} s 도형 인스턴스
	 */
	selectShape: function (s){
		this.focusShape(s);
		this.selectedShapes.push(s);
	},

	/**
	 * 도형을 선택 해제합니다.
	 * @param {ShapeObject} s 도형 인스턴스
	 */
	unselectShape: function (s){
		var focused = s.focused;

		var idx = this.getIndexOfSelection(s);
		if (idx>=0)
			this.selectedShapes.splice(idx, 1);

		s.selected = false;
		s.focused = false;
	
		if (focused){
			this.focusedShape = null;

			if (this.selectedShapes.length)
				this.focusShape(this.selectedShapes[this.selectedShapes.length - 1]);
		}
	},

	//-----------------------------------------------------------

	/**
	 * 선택된 도형 목록의 인덱스를 가져옵니다.
	 * @param {ShapeObject} s 도형 인스턴스
	 * @return {Number} 목록에 없으면 -1을, 있으면 해당 배열의 인덱스를 리턴합니다.
	 */
	getIndexOfSelection: function (s){
		for (var i = this.selectedShapes.length - 1; i >= 0; i--)
			if (this.selectedShapes[i] == s)
				return i;
		return -1;
	},

	/**
	 * 선택된 도형 목록에서 x, y좌표에 있는 도형을 탐색합니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @return {ShapeObject} 없으면 null을 리턴합니다.
	 */
	getContainsSelection: function (x, y){
		// if (this.focusedShape){
		// 	if (this.focusedShape.contains(x, y, this.viewContext))
		// 		return this.focusedShape;
		// }

		var len = this.selectedShapes.length;
		for (var i = 0; i < len; i++){
			var s = this.selectedShapes[i];
			if (s.contains(x, y, this.viewContext))
				return s;
		}
		return null;
	},

	/**
	 * 크기 변경이 가능한 도형인지 확인합니다.
	 * <p>* {@link AbShapeLine|선}, {@link AbShapeArrow|화살표}는 크기 변경을 할 수 없습니다.
	 * @param {ShapeObject} s 도형 인스턴스
	 */
	resizableShape: function (s){
		return s.shapeStyle != 'line';
	},

	/**
	 * 선택된 도형들을 편집중인 도형의 편집점에 따라 동일하게 변경합니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @param {Boolean} [rendering=true] 화면 표시 여부
	 */
	resizeSelection: function (x, y, rendering){
		if (!AbCommon.isBool(rendering)) rendering = true;

		var page = this.currentPage;
		var len = this.selectedShapes.length;

		var fep = this.selection.editTarget.editPos(this.selection.edit);
		var ret = this.selection.editTarget.resize(this.selection.edit, x, y);

		//console.log('[RESIZE] ret(x=' + ret.x + ', y=' + ret.y + '), fep(x=' + fep.x + ', y=' + fep.y + ') rpos(x=' + ( ret.x - fep.x) + ', y='+(ret.y - fep.y) + ')');

		var resizable = this.resizableShape(this.selection.editTarget);
		if (ret){
			var rpos = { x: ret.x - fep.x, y: ret.y - fep.y };

			for (var i=0; i < len; i++){
				var s = this.selectedShapes[i];
				if (s == this.selection.editTarget)
					continue;

				if (this.selection.edit == 'A'){
					s.setAngle(AbGraphics.angle.increase(s.angle, ret));
				}else if (resizable && this.resizableShape(s)){
					var ep = s.editPos(this.selection.edit);
					var center = s.center();
					center = page.toCanvas(center.x, center.y);

					//console.log('\t[SHAPE] ep(x=' + ep.x + ', y=' + ep.y + ') result(x=' + (ep.x + rpos.x) + ', y='+(ep.y + rpos.y) + ')');

					var rotatedPx = AbGraphics.angle.point(s.angle, center.x, center.y, ep.x + rpos.x, ep.y + rpos.y);
					rotatedPx = page.fromCanvas(rotatedPx.x, rotatedPx.y);
					s.resize(this.selection.edit, rotatedPx.x, rotatedPx.y);
				}
			}
		}
		if (rendering) this.render();
	},

	//-----------------------------------------------------------

	/**
	 * select 옵션
	 * @typedef {Object} AbViewerEngine.selectOptions
	 * @property {Boolean} rendering 화면 표시 여부
	 * @property {Boolean} additional 추가 선택 혹은 추가 선택 해제 설정<p>* shift 키가 눌러진 경우 true
	 */

	/**
	 * 선택영역의 도형들을 선택합니다.
	 * @param {(Boolean|AbViewerEngine.selectOptions)} [options] 부울형이면 화면 표시 여부, 아니면 {@link AbViewerEngine.selectOptions|select 옵션}
	 * 
	 * @example <caption>부울형일때</caption>
	 * engine.select(true); // 선택영역의 도형들을 선택하고, 화면을 표시합니다.
	 * 
	 * @example <caption>객체일때</caption>
	 * var opt = { rendering: true };
	 * engine.select(opt); // 선택영역의 도형들을 선택하고, 화면을 표시합니다.
	 */
	select: function(options){
		if (!this.currentPage || !this.maniplatable()) return;

		var rendering = true;
		var opt = null;

		if (AbCommon.isBool(options)) {
			opt = {};
			rendering = options;
		}else if (arguments.length) {
			opt = options || {};
			if (AbCommon.isBool(opt.rendering)) rendering = opt.rendering;
		}else
			opt = {};

		if (!opt.additional)
			this.selectedShapes.splice(0, this.selectedShapes.length);

		var startCnt = this.selectedShapes.length;

		//console.log('[SELECTION] dragged=' + this.selection.dragged());

		var sel = null;
		if (this.selection.dragged()){
			if (!opt.additional)
				this.focusedShape = null;

			var box = this.selection.box();
			for (var i=this.currentPage.shapes.length - 1; i >= 0; i--){
				var s = this.currentPage.shapes[i];

				if (!this.isVisibleShapeType(s.type))
					continue;

				if (s.contains(box.x, box.y, box.width, box.height, this.viewContext)){
					s.selected = true;
					this.selectedShapes.push(s);

					if (!opt.additional){
						if (!sel){
							sel = s;
							s.focused = true;
							this.focusedShape = s;
						}else{
							s.focused = false;
						}
					}
				}else if (!opt.additional){
					s.selected = false;
					s.focused = false;
				}
			}
		}else{
			var x = this.selection.end.x, y = this.selection.end.y;
			// if (this.focusedShape && this.focusedShape.contains(x, y, this.viewContext))
			// 	return;

			if (!opt.additional)
				this.focusedShape = null;

			for (var i=this.currentPage.shapes.length - 1; i >= 0; i--){
				var s = this.currentPage.shapes[i];

				if (!this.isVisibleShapeType(s.type))
					continue;

				if (!sel && s.contains(x, y, this.viewContext)){
					s.selected = true;
					this.selectedShapes.push(s);

					if (!opt.additional){
						s.focused = true;
						this.focusedShape = s;
					}
					sel = s;
				}else if (!opt.additional){
					s.selected = false;
					s.focused = false;
				}
			}
		}
		if (rendering) this.render();

		var endCnt = this.selectedShapes.length;

		if (endCnt - startCnt > 0){
			// Notify
			this.notifyObservers('shape', 'select');
		}
	},

	/**
	 * unselect 옵션
	 * @typedef {Object} AbViewerEngine.unselectOptions
	 * @property {Boolean} rendering 화면 표시 여부
	 * @property {Boolean} unfocusOnly true면 포커스 도형은 제외하고 선택 해제합니다.
	 */

	/**
	 * 선택된 도형들을 선택 해제합니다.
	 * @param {(Boolean|AbViewerEngine.unselectOptions)} [options] 부울형이면 화면 표시 여부, 아니면 {@link AbViewerEngine.unselectOptions|unselect 옵션}
	 * 
	 * @example <caption>부울형일때</caption>
	 * engine.unselect(true); // 도형들을 선택 해제하고, 화면을 표시합니다.
	 * 
	 * @example <caption>객체일때</caption>
	 * var opt = { rendering: true };
	 * engine.unselect(opt); // 도형들을 선택 해제하고, 화면을 표시합니다.
	 */
	unselect: function(options){
		if (!this.currentPage || !this.maniplatable()) return false;

		var unselected = this.selectedShapes.length > 0;
		var rendering = true;
		var opt = null;

		if (AbCommon.isBool(options)) {
			opt = {};
			rendering = options;
		}else if (arguments.length) {
			opt = options || {};
			if (AbCommon.isBool(opt.rendering)) rendering = opt.rendering;
		}else
			opt = {};

		this.selectedShapes.splice(0, this.selectedShapes.length);
		if (opt.unfocusOnly){
			this.selectedShapes.push(this.focusedShape);
		}else{
			this.focusedShape = null;
		}

		for (var i=this.currentPage.shapes.length - 1; i >= 0; i--){
			var s = this.currentPage.shapes[i];

			if (opt.unfocusOnly === true && s == this.focusedShape)
				continue;

			s.selected = false;
			s.focused = false;
		}

		if (rendering) this.render();

		if (unselected){
			// Notify
			this.notifyObservers('shape', 'unselect');
		}

		return unselected;
	},

	/**
	 * @private
	 */
	unselectUnfocus: function(){
		if (!this.currentPage || !this.maniplatable()) return;

		if (!AbCommon.isBool(rendering)) rendering = true;

		this.selectedShapes.splice(0, this.selectedShapes.length);

		this.focusedShape = null;
		for (var i=this.currentPage.shapes.length - 1; i >= 0; i--){
			var s = this.currentPage.shapes[i];

			s.selected = false;
			s.focused = false;
		}

		if (rendering) this.render();
	},

	//-----------------------------------------------------------

	/**
	 * 페이지의 모든 도형들을 선택합니다.
	 * <p>* 완료 후 shape의 selectAll이 Notify됩니다.
	 * @param {Boolean} [rendering=true] 화면 표시 여부
	 */
	selectAll: function(rendering){
		if (!this.currentPage || !this.maniplatable()) return;
		
		if (!AbCommon.isBool(rendering)) rendering = true;

		this.selectedShapes.splice(0, this.selectedShapes.length);
		this.focusedShape = null;

		for (var i=this.currentPage.shapes.length - 1; i >= 0; i--){
			var s = this.currentPage.shapes[i];

			if (!this.isVisibleShapeType(s.type))
				continue;

			s.selected = true;
			s.focused = false;

			this.selectedShapes.push(s);
			if (i == 0){
				s.focused = true;
				this.focusedShape = s;
			}
		}
		
		if (rendering) this.render();

		if (this.selectedShapes.length){
			// Notify
			this.notifyObservers('shape', 'selectAll');
		}
	},

	//-----------------------------------------------------------

	/**
	 * History State와의 동기화 처리를 위해 history.sync를 Notify합니다.
	 * <p>* {@link AbImageListView|이미지 리스트뷰}에서 처리합니다.
	 * <table>
	 * <thead>
	 * <tr>
	 * 	<th>topic</th><th>cmd</th><th>docmd</th><th>data</th><th>설명</th>
	 * </tr>
	 * </thead>
	 * <tbody>
	 * <tr>
	 * 	<td>page</td><td>add</td><td>undo</td><td>Array.&lt;{@link AbPage}&gt;</td><td>추가된 페이지들을 제거해야 합니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>page</td><td>add</td><td>redo</td><td>Array.&lt;{@link AbPage}&gt;</td><td>추가된 페이지들을 추가해야 합니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>page</td><td>update</td><td>undo</td><td>Number (페이지 인덱스)</td><td>해당 페이지의 정보가 변경되었습니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>page</td><td>update</td><td>redo</td><td>Number (페이지 인덱스)</td><td>해당 페이지의 정보가 변경되었습니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>page</td><td>remove</td><td>undo</td><td>Array.&lt;{@link AbHistoryRemovePageState.PageIndexInfo}&gt;</td><td>삭제된 페이지들을 추가해야 합니다.</td>
	 * </tr>
	 * <tr>
	 * 	<td>page</td><td>remove</td><td>redo</td><td>Array.&lt;{@link AbHistoryRemovePageState.PageIndexInfo}&gt;</td><td>삭제된 페이지들을 제거해야 합니다.</td>
	 * </tr>
	 * </tbody>
	 * </table>
	 * @param {String} topic 토픽 (shape|page)
	 * @param {String} cmd 명령어 (add|remove|update 등등)
	 * @param {String} docmd 수행명령어 (undo|redo)
	 * @param {AbHistory.HistorySyncArgs} data 데이터
	 * <p>* 동작에 따라 유형이 달라집니다
	 * @param {AbViewerEngineObservers.NotifyCallback} callback Notify 후 호출되는 콜백 함수
	 */
	historySync: function (topic, cmd, docmd, data, callback){
		this.notifyObservers('history.sync', {
			topic: topic,
			cmd: cmd,
			docmd: docmd,
			data: data
		}, callback);
	},

	//-----------------------------------------------------------

	/**
	 * History State에서 페이지가 추가되었음을 알립니다.
	 * <p>* History State와의 동기화 처리를 위한 기능입니다.
	 * @param {Number} index 페이지 인덱스
	 */
	pageInserted: function (index){
		if (this.currentPageIndex >= 0){
			if (this.currentPageIndex >= index)
				this.currentPageIndex++;
		}
	},
	
	/**
	 * History State에서 페이지가 제거되었음을 알립니다.
	 * <p>* History State와의 동기화 처리를 위한 기능입니다.
	 * @param {Number} index 페이지 인덱스
	 */
	pageRemoved: function (index){
		if (this.currentPageIndex >= 0){
			if (this.currentPageIndex >= index)
			this.currentPageIndex--;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 모든 페이지들을 제거합니다.
	 */
	clearPages: function(){
		this.selectedShapes.splice(0, this.selectedShapes.length);
		this.focusedShape = null;

		this.pages.clear(true);
		
		this.currentPage = null;
		this.currentPageIndex = -1;
	},

	/**
	 * 페이지 인덱스 배열의 페이지들을 제거합니다.
	 * <p>* 완료 후 page.remove가 Notify 됩니다.
	 * @param {Array.<Number>} pageIndexArray 페이지 인덱스 배열
	 * @param {Boolean} [history=true] History 기록 여부
	 */
	removePages: function (pageIndexArray, history){
		if (!this.maniplatable()) return;
		if (!pageIndexArray || !$.isArray(pageIndexArray)) return;
		
		if (!AbCommon.isBool(history)) history = true;

		var cindex = this.currentPageIndex;
		var cdel = false;
	
		//-----------------------------------------------------------
		// begin record history
		if (history) this.history.begin('page', 'remove', this, pageIndexArray);
		//-----------------------------------------------------------

		pageIndexArray.sort(function (a, b){ return a - b; });

		var pages = [];
		for (var i=pageIndexArray.length - 1; i >= 0; i--){
			var idx = pageIndexArray[i];
			if (idx == cindex) cdel = true;

			var page = this.pages.splice(idx, 1);

			pages.push({
				index: idx,
				page: page
			});
		}

		//-----------------------------------------------------------
		// end record history
		if (history) this.history.end(this);
		//-----------------------------------------------------------

		// Notify
		this.notifyObservers('page.remove', pages);

		if (cdel){
			if (this.pages.length()){
				this.currentPage = null;
				this.currentPageIndex = -1;
	
				if (cindex >= this.pages.length())
					cindex = this.pages.length() - 1;

				this.selectPage(cindex);
	
			}else{
				this.unselectPage();
			}
		}

		return pages;
	},

	/**
	 * 페이지의 범위를 제거합니다.
	 * <p>* 완료 후 page.remove가 Notify 됩니다.
	 * @param {Number} start 시작 위치
	 * @param {Number} end 끝 위치
	 * @param {Boolean} [history=true] History 기록 여부 
	 */
	removePageRange: function (start, end, history){
		var ia = [], siz = this.pages.length() - 1;
		for (var i = start; i <= end; i++){
			if (i >= 0 && i <= siz)
				ia.push(i);
		}

		if (ia.length)
			this.removePages(ia, history);
	},

	/**
	 * 현재 페이지를 제거합니다.
	 * <p>* 완료 후 page.remove가 Notify 됩니다.
	 * @param {Boolean} [history=true] History 기록 여부 
	 */
	removePage: function (history){
		if (!this.currentPage) return;

		this.removePages([this.currentPageIndex], history);
	},

	/**
	 * 페이지를 추가합니다.
	 * <p>* 완료 후 page의 add가 Notify 됩니다.
	 * @param {AbPage} page 
	 * @param {Boolean} [selecting=true] 현재 페이지 설정 여부
	 * @param {Boolean} [history=true] History 기록 여부 
	 */
	addPage: function (page, selecting, history){
		if (!page || !this.maniplatable()) return;
		if (!(page instanceof AbPage)) return;

		if (!AbCommon.isBool(selecting)) selecting = true;
		if (!AbCommon.isBool(history)) history = true;

		//-----------------------------------------------------------
		// begin record history
		if (history) this.history.begin('page', 'add', this);
		//-----------------------------------------------------------
		
		this.pages.push(page);

		if (selecting === true){
			this.currentPageIndex = this.pages.length() - 1;
			this.currentPage = page;
	
			if (page.shapes.length){
				var len = page.shapes.length;
				for (var i=0; i < len; i++){
					var s = page.shapes[i];
	
					s.engine = this;
					e.measure();
				}
			}
		}

		//-----------------------------------------------------------
		// end record history
		if (history) this.history.end(this);
		//-----------------------------------------------------------

		// Notify
		this.notifyObservers('page', 'add');
	},

	/**
	 * 페이지 인덱스가 유효한지 확인합니다.
	 * @param {Number} idx 페이지 인덱스
	 * @return {Boolean}
	 */
	selectable: function(idx){
		if (!AbCommon.isNumber(idx)) idx = parseInt(idx);
		//return idx >= 0 && idx < this.pages.length() && !this.pages.get(idx).isError();
		return idx >= 0 && idx < this.pages.length();
	},

	/**
	 * 페이지를 선택하거나 현재 페이지를 가져옵니다.
	 * <p>* 완료 후 page의 select가 Notify 됩니다. 단, enableNotifySelectPage 필드가 false면 Notify 하지 않습니다.
	 * @param {Number} [index] 페이지 인덱스
	 * @param {Boolean} [forcibly] 강제 선택 여부입니다.
	 * <p>* 엔진은 페이지 인덱스가 현재 페이지와 다른 경우에만 상태를 확인해 request.select를 Notify를 합니다.
	 * <p>forcibly 옵션은 현재 페이지도 페이지 상태를 확인하게 합니다.
	 * @return {AbPage} 현재 페이지 인스턴스
	 */
	selectPage: function(){
		if (arguments.length && this.maniplatable()){
			var idx = arguments[0];
			var forcibly = arguments[1] === true;
			
			if (this.pages.length() < 1){
				this.currentPage = null;
				this.currentPageIndex = -1;
			}else{
				if (!AbCommon.isNumber(idx)) idx = parseInt(idx);

				if (this.selectable(idx)){
					var checked = forcibly || this.currentPageIndex != idx;

					if (checked){
						var page = this.pages.get(idx);

						if (!page.error && !page.editable()){
							this.notifyObservers('request.select', idx);
						}else{
							this.currentPageIndex = idx;
							this.currentPage = page;
	
							this.focusedShape = null;
							this.selectedShapes.splice(0, this.selectedShapes.length);
	
							if (this.currentPage.shapes.length){
								var siz = this.currentPage.shapes.length;
								for (var i=0; i < siz; i++){
									var s = this.currentPage.shapes[i];
	
									if (s.selected)
										this.selectedShapes.push(s);
	
									if (s.focused)
										this.focusedShape = s;
								}
							}
		
							this.imagePositioning();
							this.render();
						}
					}
					// Notify
					if (this.enableNotifySelectPage === true)
						this.notifyObservers('page', 'select');
				}
			}
		}
		return this.currentPage;
	},

	/**
	 * 페이지를 선택 해제합니다.
	 * <p>* 완료 후 page의 unselect가 Notify 됩니다.
	 * @param {Boolean} [rendering=true] 화면 표시 여부
	 */
	unselectPage: function(rendering){
		if (!AbCommon.isBool(rendering)) rendering = true;

		this.currentPage = null;
		this.currentPageIndex = -1;

		if (rendering)
			this.render();

		this.notifyObservers('page', 'unselect');
	},

	/**
	 * 화면을 갱신합니다.
	 * <p>* 이미지의 위치를 재조정합니다.
	 */
	refresh: function(){
		if (!this.currentPage)
			return;

		this.imagePositioning();
		this.render();
	},

	//-----------------------------------------------------------

	/**
	 * 페이지 목록 작업 완료 콜백 
	 * @callback AbViewerEngine.PageListCallback
	 * @param {Array.<AbViewerEngine.PageInfo>} pageInfos 페이지 인덱스 정보 배열
	 */

	/**
	 * 모든 페이지의 도형들을 제거합니다.
	 * <p>* 완료 후 shape의 all.remove가 Notify 됩니다.
	 * @param {Object} [options] 옵션
	 * @param {Boolean} [options.history=true] History 기록 여부
	 * @param {AbViewerEngine.PageListCallback} [options.end] 작업 완료 후 호출되는 콜백 함수
	 */
	removeAllPageShapes: function (options){
		if (!options) options = {};
		var history = options.history;
		if (!AbCommon.isBool(history)) history = true;
		
		this.exec(function (){
			//var bak = { index: this.currentPageIndex, page: this.currentPage };

			//-----------------------------------------------------------
			// begin record history
			if (history) this.history.begin('shape', 'all', this);
			//-----------------------------------------------------------
			
			var pageInfos = [];

			for (var i = this.pages.length() - 1; i >= 0; i--){
				var page = this.pages.get(i);
				var shapes = page.shapes;
				
				//console.log('[remove][all][' + i + '] shapes=' + shapes.length);
				
				if (shapes.length){
					shapes.splice(0, shapes.length);
					
					pageInfos.unshift({
						index: i,
						page: page
					});
				}
			}

			//-----------------------------------------------------------
			// end record history
			if (history) this.history.end(this);
			//-----------------------------------------------------------

			this.render();

			// Notify
			this.notifyObservers('shape', 'all.remove');
			
			// Notify modified
			this.modified();
			
			if (AbCommon.isFunction(options.end))
				options.end(pageInfos);
		});
	},

	//-----------------------------------------------------------

	/**
	 * 페이지 배열의 모든 도형을 제거합니다.
	 * <p>* 완료 후 shape의 range.remove가 Notify 됩니다.
	 * @param {Array.<AbPage>} pages 페이지 배열
	 * @param {Object} [options] 옵션
	 * @param {Boolean} [options.history=true] History 기록 여부
	 * @param {AbViewerEngine.PageListCallback} [options.end] 작업 완료 후 호출되는 콜백 함수
	 */
	removeRangePageShapes: function (pages, options){
		if (!options) options = {};
		var history = options.history;
		
		if (!AbCommon.isBool(history)) history = true;
		
		this.exec(function (){
			//var bak = { index: this.currentPageIndex, page: this.currentPage };

			//-----------------------------------------------------------
			// begin record history
			if (history) this.history.begin('shape', 'range', this, pages);
			//-----------------------------------------------------------

			var pageInfos = [];

			for (var i = pages.length - 1; i >= 0; i--){
				var page = pages[i];
				var shapes = page.shapes;
				
				if (shapes.length){
					shapes.splice(0, shapes.length);
					
					pageInfos.unshift({
						index: i,
						page: page
					});
				}
			}

			//-----------------------------------------------------------
			// end record history
			if (history) this.history.end(this);
			//-----------------------------------------------------------

			this.render();

			// Notify
			this.notifyObservers('shape', 'range.remove');
			
			// Notify modified
			this.modified();
			
			if (AbCommon.isFunction(options.end))
				options.end(pageInfos);
		});
	},

	//-----------------------------------------------------------

	/**
	 * addShape 옵션
	 * @typedef {Object} AbViewerEngine.addShapeOptions
	 * @property {Boolean} creation 생성 옵션<p>* {@link AbViewerEngine#addShape|addShape()}를 참고하세요
	 * @
	 */

	/**
	 * 도형을 추가합니다.
	 * <dl>생성옵션
	 * 	<dt>생성옵션이 true면</dt><dd>엔진에서 생성 영역을 마우스로 드래깅하거나 클릭해야 합니다.
	 * <p>* 도형 테이블에서 객체를 복제하고, selection.target에 세팅합니다.</dd>
	 * 	<dt>생성옵션이 false면</dt><dd>도형 인스턴스를 현재 페이지에 추가합니다.
	 * <p>* 완료 후 shape.add가 Notify 됩니다.</dd>
	 * </dl>
	 * @param {(String|ShapeObject)} data 도형명칭 또는 {@link ShapeObject|도형 인스턴스}
	 * @param {(Boolean|AbViewerEngine.addShapeOptions)} [option] 부울형이면 생성 옵션 아니면 {@link AbViewerEngine.addShapeOptions|addShape 옵션}
	 */
	addShape: function (){
		if (!arguments.length || !this.currentPage)
			return;
		
		var data = arguments[0];
		var shape = this.shapeObject(data);
		if (!shape)
			return;

		var creation = false, options = null;
		if (arguments.length >= 2){
			if (AbCommon.isBool(arguments[1])){
				creation = arguments[1];
				options = {};
			}else{
				options = arguments[1] || {};
				creation = options.creation || false;
			}
		}else{
			options = {};
		}

		if (AbCommon.isString(data))
			creation = true;

		/*
		shape.x = 10;
		shape.y = 20;
		shape.width = 50;
		shape.height = 50;
		*/

		if (creation){
			if (this.maniplatable()){
				this.selection.target = data;
			}
		}else{
			var page = this.currentPage;

			//-----------------------------------------------------------
			// begin record history
			this.history.begin('shape', 'add', this);
			//-----------------------------------------------------------

			page.shapes.push(shape);

			//-----------------------------------------------------------
			// end record history
			this.history.end(this);
			//-----------------------------------------------------------
			
			shape.engine = this;
			shape.measure();

			// Notify
			this.notifyObservers('shape.add', shape);
		}

		// var render = options.render || false;
		// if (render)
		// 	this.render();
	},

	//-----------------------------------------------------------

	/**
	 * 선택영역에 그린 영역만큼 화면을 복구합니다.
	 */
	restoreSelection: function (){
		//console.log('[CALL] restoreSelection()');
		//return;

		if (this.selection.drawed){
			var ctx = this.viewContext;
			ctx.save();

			var box = this.selection.drawed;
			box.x += this.margin.left;
			box.y += this.margin.top;

			var alpha = ctx.globalAlpha;
			ctx.globalAlpha = 1;

			var page = this.currentPage;
				
			var strokeSize = this.selection.style && this.selection.style.stroke ? this.selection.style.stroke.width : 1;
			var pbox = AbGraphics.box.inflate(box.x, box.y, box.width, box.height, strokeSize);
			
			this.paintRect(pbox.x, pbox.y, pbox.width, pbox.height);
			//this.paintRect(pbox.x + page.x, pbox.y + page.y, pbox.width, pbox.height);

			this.selection.drawed = null;

			ctx.globalAlpha = alpha;
			ctx.restore();
		}

	},

	/**
	 * 선택영역의 selection을 그립니다.
	 * <p>* 이 메서드로 그려진 영역은 restoreSelection()로 자동 복구됩니다.
	 */
	drawSelection: function (){
		//return;

		var ctx = this.viewContext;
		var box = this.selection.box();
		var page = this.currentPage;
		
		box = page.toCanvasBox(box);

		ctx.save();
		ctx.translate(this.margin.left, this.margin.top);

		if (this.selection.style.color){
			ctx.fillStyle = this.selection.style.color;
			ctx.fillRect(box.x, box.y, box.width, box.height);
		}

		if (this.selection.style.stroke){
			ctx.strokeStyle = this.selection.style.stroke.color;
			ctx.lineWidth = this.selection.style.stroke.width;
			ctx.strokeRect(box.x, box.y, box.width, box.height);
		}
		ctx.restore();

		this.selection.drawed = box;
	},

	/**
	 * 생성된 도형을 그립니다.
	 * <p>* 이 메서드로 그려진 영역은 restoreSelection()로 자동 복구됩니다.
	 */
	drawCreation: function(){
		//console.log('[CALL] drawCreation()');

		var page = this.currentPage;
		var ctx = this.viewContext;
		ctx.save();

		var pc = page.toCanvas(0, 0);
		ctx.translate(pc.x, pc.y);
		ctx.translate(this.margin.left, this.margin.top);

		var targetShape = this.shapeObject(this.selection.target);
		var direct = AbCommon.supportCreationDraw(targetShape);
		//var direct = false;

		if (direct){
			targetShape.creationDraw(ctx, page, this.selection);
		}else{
			if (targetShape.hasOwnProperty('creationAlpha'))
				ctx.globalAlpha = targetShape.creationAlpha;

			if (!targetShape.hasOwnProperty('creationSize') || targetShape.creationSize !== 'auto'){
				targetShape.rect(
					this.selection.start.x,
					this.selection.start.y,
					this.selection.end.x,
					this.selection.end.y
				);
			}
				
			targetShape.draw(ctx, page, true);
		}	

		// 가상 좌표계 좌표
		if (targetShape && AbCommon.supportRestoreMinimumSize(targetShape)){
			var minimum = targetShape.restoreMinimumSize();

			var tbox = page.toCanvasBox(targetShape.box());
			this.selection.drawed = AbGraphics.box.inflate(tbox.x, tbox.y, tbox.width, tbox.height, minimum.width, minimum.height);

			//this.selection.drawed = targetShape.restoreRect(targetShape.box());
		}else{
			this.selection.drawed = page.toCanvasBox(targetShape.box());
		}

		ctx.restore();
	},

	//-----------------------------------------------------------

	/**
	 * 오류 페이지의 내용을 그립니다.
	 * <p>* 현재 아무 내용도 표시하지 않습니다.
	 */
	drawError: function (){
		var page = this.currentPage;
		var ctx = this.viewContext;
		ctx.save();

		ctx.restore();
	},

	//-----------------------------------------------------------

	/**
	 * 페이지를 섬네일 이미지로 렌더링합니다.
	 * <p>* 오류 페이지는 렌더링 하지 않습니다.
	 * @param {AbThumbnailGenerator} gen 섬네일 생성기
	 * @param {(Number|AbPage)} page 페이지 인덱스 또는 {@link AbPage|페이지 인스턴스}
	 */
	renderThumbnail: function (gen, page){
		if (arguments.length <= 1) page = this.currentPage;

		if (AbCommon.isNumber(page)){
			if (page < 0 || page >= this.pages.length()) return;
			page = this.pages.get(page);
		}

		if (page.error) return;
		
		//-----------------------------------------------------------

		var image = page.image();

		gen.resize(page.width, page.height);

		var ctx = gen.context;

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
		var image = page.originThumbnail();
		if (!image) image = page.image();

		if (image){
			// var marginLeft = this.margin.left, marginTop = this.margin.top, marginRight = this.margin.right, marginBottom = this.margin.bottom;
			// this.margin.left = this.margin.top = this.margin.right = this.margin.bottom = 0;
			
			var cpage = this.currentPage;
			this.currentPage = page;
			
			var srcsiz = page.sourceSize();
			var w = Math.round(srcsiz.width * gen.ratio), h = Math.round(srcsiz.height * gen.ratio);
			//var w = srcsiz.width * gen.ratio, h = srcsiz.height * gen.ratio;

			//-----------------------------------------------------------
			// Hermite
			// var e = $('<canvas width="'+srcsiz.width+'" height="'+srcsiz.height+'"/>');
			// var imgCanvas = e.get(0);
			// var imgctx = imgCanvas.getContext('2d');
			// imgctx.drawImage(image, 0, 0);

			// AbGraphics.image.hermite(imgCanvas, w, h, true);
			//-----------------------------------------------------------

			ctx.save();
			//AbGraphics.canvas.imageSmoothing(ctx, true);

			if (page.angle){
				var cp = AbGraphics.angle.correctDisplayCoordinate(page.angle, w, h);
				ctx.rotate(AbGraphics.angle.deg2rad(page.angle));
				ctx.translate(-cp.x, -cp.y);
				ctx.drawImage(image, 0, 0, w, h);
			}else{
				ctx.drawImage(image, 0, 0, w, h);
			}

			ctx.restore();
	
			if (this.isVisibleShapeType())
				page.drawOrigin(ctx, {
					scale: gen.ratio,
					showingShapeTypeMap: this.showingShapeTypeMap
				});
			
			// this.margin.left = marginLeft;
			// this.margin.top = marginTop;
			// this.margin.right = marginRight;
			// this.margin.bottom = marginBottom;
			
			this.currentPage = cpage;
		}
	},

	/**
	 * 페이지를 이미지로 렌더링 합니다.
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 * @param {(Number|AbPage)} [page] 페이지 인덱스 또는 {@link AbPage|페이지 인스턴스}
	 * <p>* 설정하지 않으면 현재 페이지를 렌더링 합니다.
	 * @param {Boolean} [drawShapes] 도형 렌더링 여부
	 * @param {Object.<String, Boolean>} showingShapeTypeMap 도형 구분 맵
	 * <p>* 필드명이 도형 구분, 필드값이 부울형인 객체입니다.
	 */
	renderImage: function (ctx, page, drawShapes, showingShapeTypeMap){
		if (arguments.length <= 1) page = this.currentPage;
		if (arguments.length <= 2) drawShapes = this.showingShapes;
		if (arguments.length <= 3) showingShapeTypeMap = this.showingShapeTypeMap;

		if (AbCommon.isNumber(page)){
			if (page < 0 || page >= this.pages.length()) return;
			page = this.pages.get(page);
		}

		if (page.error) return;

		//-----------------------------------------------------------

		var pageWidth = page.width, pageHeight = page.height;

		if (!page.editable()){
			var srcsiz = page.sourceSize();
			pageWidth = srcsiz.width;
			pageHeight = srcsiz.height;
		}

		ctx.canvas.width = pageWidth;
		ctx.canvas.height = pageHeight;
		
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
		var image = page.image();
		if (image){
			var cpage = this.currentPage;
			this.currentPage = page;
			
			var srcsiz = page.sourceSize();
			var w = srcsiz.width, h = srcsiz.height;

			// var marginLeft = this.margin.left, marginTop = this.margin.top, marginRight = this.margin.right, marginBottom = this.margin.bottom;
			// this.margin.left = this.margin.top = this.margin.right = this.margin.bottom = 0;

			ctx.save();

			if (page.angle){
				var cp = AbGraphics.angle.correctDisplayCoordinate(page.angle, w, h);
				ctx.rotate(AbGraphics.angle.deg2rad(page.angle));
				ctx.translate(-cp.x, -cp.y);
				ctx.drawImage(image, 0, 0);
			}else{
				ctx.drawImage(image, 0, 0);
			}

			ctx.restore();
	
			//-----------------------------------------------------------

			if (this.drawableWaterMark()){
				this.waterMark.draw(ctx, 1, pageWidth, pageHeight);
			}
		
			//-----------------------------------------------------------

			if (drawShapes)
				page.drawOrigin(ctx, {
					showingShapeTypeMap: showingShapeTypeMap
				});

			// this.margin.left = marginLeft;
			// this.margin.top = marginTop;
			// this.margin.right = marginRight;
			// this.margin.bottom = marginBottom;
			
			this.currentPage = cpage;
		}
	},

	//-----------------------------------------------------------

	/**
	 * 워터마크를 그릴 수 있는 지 확인합니다.
	 * @return {Boolean}
	 */
	drawableWaterMark: function(){ return this.waterMark && this.waterMark.drawable(); },

	//-----------------------------------------------------------

	/**
	 * 화면 버퍼에 페이지와 도형들을 그립니다.
	 * @param {Boolean} [painting=true] 렌더링 후 화면에 복사할 지 여부입니다.
	 */
	render: function (painting){
		if (!this.context) return;

		if (!arguments.length) painting = true;

		//console.log('[CALL] render()');
		this.exec(function (){
			//console.log('[CALLED] render()');
			var len = 0, sel = null;
			var ctx = this.context;
			
			//-----------------------------------------------------------
			// page
			var page = this.currentPage;

			if (page && !page.error){
				var runtime = this.runtime;
				this.runtime = true;

				ctx.save();

				this.clearCanvas(ctx);
				
				ctx.translate(page.x, page.y);
				ctx.translate(this.margin.left, this.margin.top);
				
				//-----------------------------------------------------------
	
				var image = page.image({ origin: true });
				if (image){
					var pageAngle = page.angle;
					//var pageAngle = 380 % 360;

					var mx = 0, my = 0;
					var srcsiz = page.sourceSize();
					var w = srcsiz.width * page.scale.x, h = srcsiz.height * page.scale.y;
					var pageWidth = page.width, pageHeight = page.height;
				
					ctx.save();
					if (pageAngle){
					//if (true){
						var b = AbGraphics.angle.bounds(pageAngle, 0, 0, srcsiz.width, srcsiz.height);
						pageWidth = b.width;
						pageHeight = b.height;
						
						var cp = AbGraphics.angle.correctDisplayCoordinate(pageAngle, w, h);

						//console.log('[DRAWE] correct(x: '+cp.x+', y: ' + cp.y + ')');
						
						//-----------------------------------------------------------

						ctx.translate(mx, my);
						ctx.rotate(AbGraphics.angle.deg2rad(pageAngle));
						ctx.translate(-cp.x, -cp.y);

						//-----------------------------------------------------------

						ctx.drawImage(image, 0, 0, w, h);

						//ctx.fillStyle = 'red';
						//ctx.fillRect(0, 0, w, h);
					}else{
						ctx.drawImage(image, 0, 0, w, h);
						//ctx.fillStyle = 'red';
						//ctx.fillRect(0, 0, w, h);
					}
					ctx.restore();

					//-----------------------------------------------------------
					// [Begin] Boxing
					//-----------------------------------------------------------

					// var radian = AbGraphics.angle.deg2rad(pageAngle);
					// var cs = AbGraphics.rotate.corners(radian, 0, 0, 0, 0, w, h);
					// var b = AbGraphics.rotate.bounds(radian, 0, 0, w, h);
					// var hbw = b.width >> 1, hbh = b.height >> 1;
					// var hw = w >> 1, hh = h >> 1;
					// var mlen = 100;

					// //console.log('[DRAWING] w=' + b.width + ', H=' + b.height);
					
					// ctx.strokeStyle = ctx.fillStyle = 'cyan';
					// ctx.lineWidth = 5;
					// ctx.beginPath();
					// ctx.moveTo(mx - mlen, my);
					// ctx.lineTo(mx + mlen, my);
					// ctx.moveTo(mx, my - mlen);
					// ctx.lineTo(mx, my + mlen);
					// ctx.stroke();
					// ctx.closePath();

					// ctx.beginPath();
					// ctx.moveTo(mx + hw - mlen, my + hh);
					// ctx.lineTo(mx + hw + mlen, my + hh);
					// ctx.moveTo(mx + hw, my + hh - mlen);
					// ctx.lineTo(mx + hw, my + hh + mlen);
					// ctx.stroke();
					// ctx.closePath();

					// ctx.strokeStyle = ctx.fillStyle = '#D99088';
					// ctx.beginPath();
					// ctx.moveTo(mx + hbw - mlen, my + hbh);
					// ctx.lineTo(mx + hbw + mlen, my + hbh);
					// ctx.moveTo(mx + hbw, my + hbh - mlen);
					// ctx.lineTo(mx + hbw, my + hbh + mlen);
					// ctx.stroke();
					// ctx.closePath();
					
					// ctx.lineWidth = 1;
					// drawBounds(b, mx, my);

					// ctx.font = '32px tahoma';
					// ctx.beginPath();
					// ctx.strokeStyle = ctx.fillStyle = '#FF00AE';
					// ctx.arc(mx + cs.leftTop.x, my + cs.leftTop.y, 5, 0, 360);
					// ctx.fillText('LT (' + cs.leftTop.x.toFixed(1) + ', ' + cs.leftTop.y.toFixed(1)+')', mx + cs.leftTop.x, my + cs.leftTop.y + 40);
					// ctx.fill();

					// ctx.beginPath();
					// ctx.strokeStyle = ctx.fillStyle = '#D0FF00';
					// ctx.arc(mx + cs.rightTop.x, my + cs.rightTop.y, 5, 0, 360);
					// ctx.fillText('RT (' + cs.rightTop.x.toFixed(1) + ', ' + cs.rightTop.y.toFixed(1)+')', mx + cs.rightTop.x, my + cs.rightTop.y + 40);
					// ctx.fill();

					// ctx.beginPath();
					// ctx.strokeStyle = ctx.fillStyle = '#3AE2CE';
					// ctx.arc(mx + cs.rightBottom.x, my + cs.rightBottom.y, 5, 0, 360);
					// ctx.fillText('RB (' + cs.rightBottom.x.toFixed(1) + ', ' + cs.rightBottom.y.toFixed(1)+')', mx + cs.rightBottom.x, my + cs.rightBottom.y + 40);
					// ctx.fill();

					// ctx.beginPath();
					// ctx.strokeStyle = ctx.fillStyle = '#FFDD00';
					// ctx.arc(mx + cs.leftBottom.x, my + cs.leftBottom.y, 5, 0, 360);
					// ctx.fillText('LB (' + cs.leftBottom.x.toFixed(1) + ', ' + cs.leftBottom.y.toFixed(1)+')', mx + cs.leftBottom.x, my + cs.leftBottom.y + 40);
					// ctx.fill();			
					
					// function drawBounds(b, x, y) {
					// 	if (!x) x = 0; if (!y) y = 0;
					// 	//x -= b.x; y -= b.y;
					// 	var w = b.width, h = b.height;
					// 	// bounds
					// 	ctx.strokeStyle = ctx.fillStyle = 'red';
					// 	ctx.beginPath();
					// 	ctx.moveTo(x, y);
					// 	ctx.lineTo(x + w, y);
					// 	ctx.lineTo(x + w, y + h);
					// 	ctx.lineTo(x, y + h);
					// 	ctx.lineTo(x, y);
					// 	//ctx.fill();
					// 	ctx.stroke();
					// 	ctx.closePath();
					// }

					//-----------------------------------------------------------
					// [END] Boxing
					//-----------------------------------------------------------
				}
		
				//-----------------------------------------------------------

				//console.log('[RENDER] w=' + pageWidth + ', h=' + pageHeight);

				if (this.drawableWaterMark()){
					this.waterMark.draw(ctx, page.scale.x, {
						source: { width: srcsiz.width * page.scale.x, height: srcsiz.height * page.scale.x },
						view: { width: pageWidth * page.scale.x, height: pageHeight * page.scale.y }
					});
				}

				//-----------------------------------------------------------
	
				if (this.isVisibleShapeType())
					page.drawShapes(ctx, {
						showingShapeTypeMap: this.showingShapeTypeMap
					});

				ctx.restore();

				this.runtime = runtime;
			}else{
				this.clearCanvas(ctx);
			}


			//-----------------------------------------------------------

			if (painting)
				this.paint();
		});
	},

	//-----------------------------------------------------------

	/**
	 * Canvas 2D Context의 영역을 비웁니다.
	 * @private
	 * @param {CanvasRenderingContext2D} ctx Canvas 2D Context
	 */
	clearCanvas: function(ctx){
		// var page = this.currentPage;
			
		// if (page && (!page.angle || page.angle % 90 == 0)){
		// 	var pageWidth = page.width * page.scale.x, pageHeight = page.height * page.scale.y;

		// 	if (this.style.color){
		// 		ctx.fillStyle = this.style.color;
		// 		ctx.fillRect(0, 0, ctx.canvas.width, page.y + this.margin.top); // top
		// 		ctx.fillRect(page.x + pageWidth + this.margin.left, 0, ctx.canvas.width - (page.x + pageWidth + this.margin.left), ctx.canvas.height); // right
		// 		ctx.fillRect(0, page.y + pageHeight + this.margin.top, ctx.canvas.width, ctx.canvas.height - (page.y + pageHeight + this.margin.top)); // bottom
		// 		ctx.fillRect(0, 0, page.x + this.margin.left, ctx.canvas.height); // left
		// 	}else{
		// 		ctx.clearRect(0, 0, ctx.canvas.width, page.y + this.margin.top); // top
		// 		ctx.clearRect(page.x + pageWidth + this.margin.left, 0, ctx.canvas.width - (page.x + pageWidth + this.margin.left), ctx.canvas.height); // right
		// 		ctx.clearRect(0, page.y + pageHeight + this.margin.top, ctx.canvas.width, ctx.canvas.height - (page.y + pageHeight + this.margin.top)); // bottom
		// 		ctx.clearRect(0, 0, page.x + this.margin.left, ctx.canvas.height); // left
		// 	}
		// }else if (this.style.color){
		
		if (this.style.color){
			ctx.fillStyle = this.style.color;
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}else{
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}
	},

	/**
	 * 화면 버퍼에서 설정된 영역만 화면으로 복사합니다.
	 * @param {Number} x X좌표
	 * @param {Number} y Y좌표
	 * @param {Number} w 폭
	 * @param {Number} h 높이
	 */
	paintRect: function (x, y, w, h){
		//console.log('[PAINT-RECT] x' + x + ', y=' + y + ', w=' + w + ', h=' + h);

		if (x < 0){ w -= x; x = 0; }
		if (y < 0){ h -= y; y = 0; }
		if (w <= 0 || h <= 0) return;

		var ctx = this.viewContext;


		if (!this.style.color)
			ctx.clearRect(x, y, w, h);
		ctx.drawImage(this.context.canvas, x, y, w, h, x, y, w, h);
	},

	/**
	 * 화면 버퍼의 내용을 화면을 복사합니다.
	 * <p>* 엔진이 애니메이션 중이라면 동작하지 않습니다.
	 */
	paint: function(){
		if (this.animateStates.$engine === true)
			return;

//		this.exec(function (){
//			var ctx = this.viewContext;
//
//			if (!this.style.color)
//				this.clearCanvas(ctx);
//			ctx.drawImage(this.context.canvas, 0, 0);
//		});
		
		var ctx = this.viewContext;

		if (!this.style.color)
			this.clearCanvas(ctx);
		ctx.drawImage(this.context.canvas, 0, 0);
		
	},

	/**
	 * 엔진의 애니메이션 동작을 수행합니다.
	 * <p>* 동작 전 animate.engine이 Notify 됩니다.
	 * <p>* 일반적으로 1초당 60회 콜백을 호출하는 함수을 통해 화면버퍼를 화면으로 복사합니다.
	 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/Window/requestAnimationFrame} MDN 자료 참고
	 */
	animate: function (){
		var requestAnimFrame = AbCommon.requestAnimFrame();
		if (typeof requestAnimFrame == 'function'){
			this.animateStates.$engine = true;
			this.notifyObservers('animate.engine', true);

			var render = function (timestamp){
				var self = arguments.callee.self;
	
				//console.log('[ANIMATE] runtime=' + self.runtime);
	
				if (!self.runtime){
					var ctx = self.viewContext;
					
					self.clearCanvas(ctx);
					ctx.drawImage(self.context.canvas, 0, 0);
				}
	
				this.ani = requestAnimFrame(render);
			};
			render.self = this;
	
			this.ani = requestAnimFrame(render);
		}
	},

	/**
	 * 엔진의 애니메이션을 중단합니다.
	 * <p>* 완료 후 animate.engine이 Notify 됩니다.
	 */
	stop: function(){
		var cancelAnimFrame = AbCommon.cancelAnimFrame();

		if(this.ani)
			cancelAnimFrame(this.ani);

		this.animateStates.$engine = false;

		this.notifyObservers('animate.engine', false);
	},

	/**
	 * 화면 버퍼를 BLOB 객체로 가져옵니다.
	 * @return {Promise} Promise 객체
	 */
	toBlob: function(callback){
		return AbGraphics.canvas.toBlob(this.context);
	},

	/**
	 * 선택된 도형들을 앞이나 뒤로 보냅니다.
	 * <dl>
	 * 	<dt>top</dt><dd>맨 앞으로 보냅니다.</dd>
	 * 	<dt>up</dt><dd>앞으로 보냅니다.</dd>
	 * 	<dt>down</dt><dd>뒤로 보냅니다.</dd>
	 * 	<dt>bottom</dt><dd>맨 뒤로 보냅니다.</dd>
	 * </dl>
	 * @param {String} cmd 명령어 (top|up|down|bottom)
	 */
	zIndex: function (cmd){
		if (!this.currentPage || !this.maniplatable()) return;
		if (!this.selectedShapes.length && !this.focusedShape) return;

		// validation command
		switch(cmd){
		case 'top': case 'up': case 'down': case 'bottom': break;
		default: return;
		}
	
		var page = this.currentPage;

		// rollback selected shapes
		//var backupSelectedShapes = this.selectedShapes;
		//this.selectedShapes = page.shapes;

		//-----------------------------------------------------------
		// begin record history
		this.history.begin('shape', 'zindex', this, cmd);

		if (cmd == 'top' || cmd == 'bottom'){
			var a = [];
			for (var i=page.shapes.length - 1; i >= 0; i--){
				if (page.shapes[i].selected){
					var s = page.shapes.splice(i, 1);
					if (s.length)
						a.unshift(s[0]);
				}
			}
	
			if (cmd == 'top')
				Array.prototype.push.apply(page.shapes, a);
			else
				Array.prototype.unshift.apply(page.shapes, a);
		}else if (cmd == 'up' || cmd == 'down'){
			var a = [];
			for (var i=page.shapes.length - 1; i >= 0; i--){
				if (page.shapes[i].selected){
					a.unshift(i);
				}
			}

			if (cmd == 'up'){
				for (var i=a.length; i >= 0; i--){
					var idx = a[i];

					if (idx + 1 == page.shapes.length)
						break;
					
					var tmp = page.shapes[idx + 1];
					page.shapes[idx + 1] = page.shapes[idx];
					page.shapes[idx] = tmp;
				}
			}else{
				var alen = a.length;
				for (var i=0; i < alen; i++){
					var idx = a[i];

					if (idx == 0)
						break;
					
					var tmp = page.shapes[idx - 1];
					page.shapes[idx - 1] = page.shapes[idx];
					page.shapes[idx] = tmp;
				}
			}
		}

		//-----------------------------------------------------------
		// end record history
		this.history.end(this);

		// rollback selected shapes
		//this.selectedShapes = backupSelectedShapes;

		this.exec(function(){
			this.render();
		});
	},
};