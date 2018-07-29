var AbRotate = {
	CW: 1,
	CCW: -1,

	DEG_90: 1,
	DEG_180: 2,
	DEG_270: 3,
	DEG_360: 0,
};

var AbIcons = {
	CHECKER: {
		data: 'resources/icon/shape.checker.svg',
		width: 24, height: 24,
		// SVG 렌더링 힌트 (IE에서만 SVG를 렌더링합니다)
		render: {
			width: 256, height: 256
		} 
	},
		
	CHECKER_256_PNG: {
		data: 'resources/icon/shape.checker-256.png',
		width: 256, height: 256,
	},
	CHECKER_RED: {
		data: 'resources/icon/shape.checker.red.svg',
		width: 24, height: 24,
	},
	CHECKER_PNG: {
		data: 'resources/icon/shape.checker.png',
		width: 64, height: 64,
	},
};