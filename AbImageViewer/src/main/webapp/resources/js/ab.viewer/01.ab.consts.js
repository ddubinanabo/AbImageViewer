
//----------------------------------------------------------------------------------------------------------
// 좌표 정보 정의
//----------------------------------------------------------------------------------------------------------

/**
 * 좌표 정보
 * @typedef {Object} Point
 * @property {Number} x X축 값
 * @property {Number} y Y축 값
 */

 /**
 * 크기 정보
 * @typedef {Object} Size
 * @property {Number} width 폭
 * @property {Number} height 높이
 */

 /**
 * Box 정보
 * @typedef {Object} Box
 * @property {Number} x X축 값
 * @property {Number} y Y축 값
 * @property {Number} width 폭
 * @property {Number} height 높이
 */

 /**
 * 상자의 좌상단 우하단 좌표 정보
 * @typedef {Object} 2Point
 * @property {Number} x1 첫번째 점의 X축 값
 * @property {Number} y1 첫번째 점의 Y축 값
 * @property {Number} x2 두번째 점의 X축 값
 * @property {Number} y2 두번째 점의 Y축 값
 */

 /**
 * 상자의 좌상단 우하단 좌표 정보
 * @typedef {Object} Rect
 * @property {Number} left 좌상단 X축 값
 * @property {Number} top 좌상단 Y축 값
 * @property {Number} right 우하단 X축 값
 * @property {Number} bottom 우하단 Y축 값
 */

 /**
 * HTML 엘리먼트의 크기 정보
 * @typedef {Object} HTMLBounds
 * @property {Number} left 좌상단 X축 값
 * @property {Number} top 좌상단 Y축 값
 * @property {Number} right 우하단 X축 값
 * @property {Number} bottom 우하단 Y축 값
 * @property {Number} width 폭
 * @property {Number} height 높이
 */

 /**
 * 여백 정보
 * @typedef {Object} Padding
 * @property {Number} left 왼쪽 여백
 * @property {Number} top 위쪽 여백
 * @property {Number} right 오른쪽 여백
 * @property {Number} bottom 아래쪽 여백
 * @property {Padding_GetNumberFunction} horiz() 수평 여백
 * @property {Padding_GetNumberFunction} vert() 수직 여백
 */

 /**
 * 여백 정보
 * @function Padding_GetNumberFunction
 * @return {Number}
 */

//----------------------------------------------------------------------------------------------------------
// jQuery
//----------------------------------------------------------------------------------------------------------

/**
 * jQuery 객체
 * @typedef {Object} jQueryObject
 * @see {@link https://learn.jquery.com/using-jquery-core/jquery-object/} The jQuery Object
 */

/**
 * jQuery 이벤트 객체
 * @typedef {Object} jQueryEventObject
 * @see {@link https://api.jquery.com/category/events/event-object/} Event Object
 * @see {@link http://api.jquery.com/Types/#Event} Event type
 */

/**
 * jQuery 이벤트 핸들러
 * @callback jQueryEventHandler
 * @param {jQueryEventObject} event
 */

//----------------------------------------------------------------------------------------------------------
// UI 컨트롤
//----------------------------------------------------------------------------------------------------------

/**
 * 선택상자 아이템
 * @typedef {Object} SelectBoxItem
 * @property {String} text 표시명
 * @property {(String|Number|Boolean)} value 값
 */

//----------------------------------------------------------------------------------------------------------
// HTML
//----------------------------------------------------------------------------------------------------------

/**
 * 캔버스에 그릴 수 있는 클래스 목록
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage} MDN 자료 참고
 * @typedef {(Image|HTMLImageElement|HTMLCanvasElement|SVGImageElement|HTMLVideoElement|ImageBitmap|OffscreenCanvas)}
 * CanvasImageSource
 */

//----------------------------------------------------------------------------------------------------------
// 기타
//----------------------------------------------------------------------------------------------------------

/**
 * 이미지 회전 정의
 * @namespace
 * @example
 * var engine = new AbViewerEngine();
 * engine.rotate(AbRotate.CW,AbRotate.DEG_90); // 90도 회전
 * engine.rotate(AbRotate.CCW,AbRotate.DEG_90); // 반시계반향 90도 회전
 */
var AbRotate = {
	/**
	 * 회전 방향 (시계방향)
	 * @type {Number}
	 * @const
	 * @memberof AbRotate
	 */
	CW: 1,
	/**
	 * 회전 방향 (반시계방향)
	 * @type {Number}
	 * @const
	 * @memberof AbRotate
	 */
	CCW: -1,

	/**
	 * 회전 각도 (90도)
	 * @type {Number}
	 * @const
	 * @memberof AbRotate
	 */
	DEG_90: 1,
	/**
	 * 회전 각도 (180도)
	 * @type {Number}
	 * @const
	 * @memberof AbRotate
	 */
	DEG_180: 2,
	/**
	 * 회전 각도 (270도)
	 * @type {Number}
	 * @const
	 * @memberof AbRotate
	 */
	DEG_270: 3,
	/**
	 * 회전 각도 (360도)
	 * @type {Number}
	 * @const
	 * @memberof AbRotate
	 */
	DEG_360: 0,
};

/**
 * 이미지 정보 정의
 * @typedef AbIcons.Source
 * @property {String} data 이미지 URL
 * @property {Number} width 이미지 폭
 * @property {Number} height 이미지 높이
 * @property {Object} [render] SVG 이미지의 렌더링 힌트<p>* IE에서만 SVG를 렌더링하며, 확대했을 때 퀄리티를 위해 사이즈를 크게 잡습니다.
 * @property {Number} [render.width] 렌더링 이미지 폭
 * @property {Number} [render.height] 렌더링 이미지 높이
 */

/**
 * 아이콘 정의
 * <p>AbShapeImage에 사용되어 지며, 체크 주석 등으로 활용된다.
 * @namespace
 */
var AbIcons = {
	/**
	 * 24x24 크기의 체크 이미지 정보
	 * <p>* 이 정보가 체크 주석에 사용됩니다.
	 * @type {AbIcons.Source}
	 * @const
	 * @memberof AbIcons
	 */
	CHECKER: {
		data: 'resources/icon/shape.checker.svg',
		width: 24, height: 24,
		render: {
			width: 256, height: 256
		} 
	},
		
	/**
	 * 256x256 크기의 체크 이미지 정보
	 * @type {AbIcons.Source}
	 * @const
	 * @memberof AbIcons
	 */
	CHECKER_256_PNG: {
		data: 'resources/icon/shape.checker-256.png',
		width: 256, height: 256,
	},
		
	/**
	 * 24x24 크기의 빨간 체크 이미지 정보
	 * @type {AbIcons.Source}
	 * @const
	 * @memberof AbIcons
	 */
	CHECKER_RED: {
		data: 'resources/icon/shape.checker.red.svg',
		width: 24, height: 24,
	},
		
	/**
	 * 64x64 크기의 체크 이미지 정보
	 * @type {AbIcons.Source}
	 * @const
	 * @memberof AbIcons
	 */
	CHECKER_PNG: {
		data: 'resources/icon/shape.checker.png',
		width: 64, height: 64,
	},

	/**
	 * 48x48 크기의 포스트잇 이미지 정보
	 * @type {AbIcons.Source}
	 * @const
	 * @memberof AbIcons
	 */
	MEMOPAD: {
		data: 'resources/icon/shape.memo.png',
		width: 48, height: 48,
	},

	/**
	 * 64x64 크기의 비디오 이미지 정보
	 * @type {AbIcons.Source}
	 * @const
	 * @memberof AbIcons
	 */
	VIDEO: {
		data: 'resources/icon/icon.video.64.png',
		width: 64, height: 64,
	},

	/**
	 * 512x512 크기의 비디오 이미지 정보
	 * @type {AbIcons.Source}
	 * @const
	 * @memberof AbIcons
	 */
	VIDEO_LARGE: {
		data: 'resources/icon/icon.video.512.png',
		width: 512, height: 512,
	},

	/**
	 * 64x64 크기의 오디오 이미지 정보
	 * @type {AbIcons.Source}
	 * @const
	 * @memberof AbIcons
	 */
	AUDIO: {
		data: 'resources/icon/icon.audio.64.png',
		width: 64, height: 64,
	},

	/**
	 * 512x512 크기의 오디오 이미지 정보
	 * @type {AbIcons.Source}
	 * @const
	 * @memberof AbIcons
	 */
	AUDIO_LARGE: {
		data: 'resources/icon/icon.audio.512.png',
		width: 512, height: 512,
	},
};