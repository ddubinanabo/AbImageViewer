/**
 * 이미지 인쇄 도구
 * @namespace
 */
var AbPrint = {
	/**
	 * CSS Transform
	 * @memberof AbPrint
	 * @private
	 * @param {jQueryObject} e HTML 엘리먼트 jQuery 객체
	 * @param {String} value 값
	 */
	transform: function (e, value){
		e.css('-webkit-transform', value);
		e.css('-moz-transform', value);
		e.css('-ms-transform', value);
		e.css('-o-transform', value);
		e.css('transform', value);

		e.css('-webkit-transform-origin: top left;');
		e.css('-moz-transform-origin: top left;');
		e.css('-ms-transform-origin: top left;');
		e.css('-o-transform-origin: top left;');
		e.css('transform-origin: top left;');
	},

	/**
	 * 가로 방향 이미지인지 확인합니다.
	 * @memberof AbPrint
	 * @param {(Image|HTMLImageElement)} img HTML 이미지 엘리먼트
	 * @return {Boolean}
	 */
	isLandscapeImage: function (img){
		return img.width > img.height;
	},

	/**
	 * 가로 방향 이미지를 세로 방향 이미지로 변환합니다.
	 * @memberof AbPrint
	 * @param {(Image|HTMLImageElement)} img HTML 이미지 엘리먼트
	 * @return {String} DATA URL 형식 문자열
	 */
	landscape: function (img){
		var ctx = AbGraphics.canvas.createContext(img.height, img.width);

		var angle = AbGraphics.angle.increase(0, -90);
		var w = img.width, h = img.height;
		var cp = AbGraphics.angle.correctDisplayCoordinate(angle, w, h);

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.rotate(AbGraphics.angle.deg2rad(angle));
		ctx.translate(-cp.x, -cp.y);
		ctx.drawImage(img, 0, 0);

		return AbGraphics.canvas.toImage(ctx);
	},

	/**
	 * 이미지 인쇄 엘리먼트를 생성해 target에 추가합니다.
	 * @memberof AbPrint
	 * @private
	 * @param {jQueryObject} target 대상 HTML 엘리먼트 jQuery 객체
	 * @param {(String|AbPage)} printPage 인쇄할 페이지
	 * <p>* 문자열이면 이미지 URL, 아니면 {@link AbPage|페이지} 인스턴스
	 * @param {Object} [options] 옵션
	 * @param {String} [options.orientation] 방향 설정
	 * <p>* 값이 auto면 이미지 크기로 방향을 판단해 세로 방향 이미질로 변환합니다.
	 * @return {Promise} Promise 객체
	 */
	item: function(target, printPage, options){
		var e = $('<div class="print portrait"/>');
		target.append(e);

		var img = AbCommon.isString(printPage) ? printPage : printPage.image || printPage.source;
		if (img instanceof AbImage) img = img.imgInfo.url;
		else if (!AbCommon.isString(img)) img = img.src;

		return AbCommon.loadImage(img)
			.then(function (eimg){
				if (options && options.orientation === 'auto'){
					if (eimg.width > eimg.height){
						var src = AbPrint.landscape(eimg);
						return AbCommon.loadImage(src);
					}
				}				
				return eimg;
			})
			.then(function (eimg){
				var ei = $('<img/>');
				ei.attr('src', eimg.src);

				var ce = $('<div/>');

				ce.append(ei);
				e.append(ce);

				return e;
			});
	},

	/**
	 * 인쇄 HTML 엘리먼트들을 target에 추가합니다.
	 * <p>* 
	 * @memberof AbPrint
	 * @param {jQueryObject} target 대상 HTML 엘리먼트 jQuery 객체
	 * @param {(AbPageCollection|Array.<(String|AbPage)>)} printPages 페이지 목록
	 * @param {Object} [options] 옵션
	 * @param {String} [options.orientation] 방향 설정
	 * <p>* 값이 auto면 이미지 크기로 방향을 판단해 세로 방향 이미질로 변환합니다.
	 * @return {Promise} Promise 객체
	 */
	generate: function (target, printPages, options){
		if (!options) options = {};

		var termOptions = options.term || {};
		if (!termOptions.hasOwnProperty('resolve')) termOptions.resolve = 100;

		if (!options.hasOwnProperty('orientation')) options.orientation = 'auto';

		if (printPages instanceof AbPageCollection){
			printPages = printPages.source;
		}else if (!$.isArray(printPages)){
			printPages = [printPages];
		}

		var ps = [];
		var siz = printPages.length;
		for (var i=0; i < siz; i++){
			var printPage = printPages[i];

			var p = AbPrint.item(target, printPage, options);

			ps.push(p);
		}

		return AbCommon.promiseAll(ps, options.progress, options);
	},

	/**
	 * 이미지 URL 목록으로 인쇄 HTML을 생성합니다.
	 * @memberof AbPrint
	 * @param {Array.<String>} imageUrls 이미지 URL 목록
	 * @param {String} openHtml 시작 HTML
	 * @param {String} closeHtml 종료 HTML
	 * @return {String} 인쇄 HTML
	 */
	generateHtml: function (imageUrls, openHtml, closeHtml){
		var htmls = [];
		
		if (openHtml) htmls.push(openHtml);
		
		var siz = imageUrls.length;
		for (var i=0; i < siz; i++){
			var url = imageUrls[i];

			htmls.push('<div class="print portrait">');
			htmls.push('<div>');
			htmls.push('<img src="'+url+'"/>');
			htmls.push('</div>');
			htmls.push('</div>');
		}

		if (closeHtml) htmls.push(closeHtml);
		
		return htmls.join('');
	},
	
	/**
	 * 이미지 URL 목록으로 이미지 커버 HTML만 있는 인쇄 페이지 HTML를 생성합니다.
	 * @memberof AbPrint
	 * @param {Array.<String>} imageUrls 이미지 URL 목록
	 * @param {String} prefix 이미지 커버 HTML 아이디 접두사
	 * <p>* 설정하지 않으면 인덱스가 아이디가 됩니다.
	 * @param {String} openHtml 시작 HTML
	 * @param {String} closeHtml 종료 HTML
	 * @return {String} 인쇄 HTML
	 */
	generateCoverHtml: function (imageUrls, prefix, openHtml, closeHtml){
		var htmls = [];
		
		if (openHtml) htmls.push(openHtml);
		
		var siz = imageUrls.length;
		for (var i=0; i < siz; i++){
			var url = imageUrls[i];

			htmls.push('<div class="print portrait">');
			htmls.push('<div id="'+(prefix ? prefix + i : '' + i)+'">');
			htmls.push('</div>');
			htmls.push('</div>');
		}

		if (closeHtml) htmls.push(closeHtml);
		
		return htmls.join('');
	},
};