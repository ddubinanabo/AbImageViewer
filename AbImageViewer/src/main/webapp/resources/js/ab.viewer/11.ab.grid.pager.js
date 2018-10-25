/**
 * 페이저 함수
 * <p>* 페이지 링크 스크립트를 리턴합니다.
 * @typedef {Function} AbGridPager.pager
 * @param {Number} page 페이지 번호
 * @return {String} 페이지 링크 스크립트 문자열
 */

/**
 * 네비게이션 제작 콜백
 * <table>
 * <thead>
 * <tr>
 * 	<th>제작 파트</th><th>설명</th><th>value 인자 타입</th>
 * </tr>
 * </thead>
 * <tbody>
 * <tr>
 * 	<td>block.first</td><td>시작 블럭</td><td>Number</td>
 * </tr>
 * <tr>
 * 	<td>block.last</td><td>마지막 블럭</td><td>Number</td>
 * </tr>
 * <tr>
 * 	<td>block.prev</td><td>이전 블럭</td><td>Number</td>
 * </tr>
 * <tr>
 * 	<td>block.next</td><td>다음 블럭</td><td>Number</td>
 * </tr>
 * <tr>
 * 	<td>page.current</td><td>현재 페이지</td><td>Number</td>
 * </tr>
 * <tr>
 * 	<td>page</td><td>페이지</td><td>Number</td>
 * </tr>
 * <tr>
 * 	<td>navigation</td><td>네비게이션</td><td>{@link AbGridPager.Navigation}</td>
 * </tr>
 * </tbody>
 * </table>
 * @callback AbGridPager.NavigationGenerateCallback
 * @param {String} name 제작 파트
 * @param {Number} value 데이터
 * @return {String} HTML 문자열
 */

/**
 * 네비게이션 정보 객체
 * @typedef {Object} AbGridPager.Navigation
 * @property {Number} total 전체 데이터 개수
 * @property {Object} html 각 블럭의 HTML 문자열 객체
 * @property {Object} html.first 시작 블럭 HTML 문자열
 * @property {Object} html.prev 이전 블럭 HTML 문자열
 * @property {Object} html.pages 페이지 목록 HTML 문자열
 * @property {Object} html.next 다음 블록 HTML 문자열
 * @property {Object} html.last 마지막 블록 HTML 문자열
 */

/**
 * 페이징 계산기
 * @class
 * @param {Object} [options] 옵션
 * @param {String} [options.template] 템플릿 옵션, 페이징 UI 중 블럭 링크 템플릿
 * @param {String} [options.template.symbolPrevBlock] 이전 블럭 심볼 (◀)
 * @param {String} [options.template.symbolNextBlock] 다음 블럭 심볼 (▶)
 * @param {String} [options.template.symbolFirstBlock] 처음 블럭 심볼 (│◀)
 * @param {String} [options.template.symbolLastBlock] 마지막 블럭 심볼 (▶│)
 * @param {String} [options.template.blockTemplate] 블럭 템플릿 (&lt;a href=""&gt;▶&lt;/a&gt;)
 * @param {String} [options.template.cpageTemplate] 현재 페이지 템플릿 (&lt;span&gt;1&lt;/span&gt;)
 * @param {String} [options.template.pageTemplate] 페이지 템플릿 (&lt;a href=""&gt;1&lt;/a>)
 * @param {String} [options.template.pageGapTemplate] 페이지 간 공백 템플릿
 * @param {String} [options.template.navTemplate] 네비게이션 템플릿 (│◀ ◀ 1 2 3 ▶ ▶│)
 * @param {String} [options.style] 스타일 옵션, CSS 스타일명
 * @param {String} [options.style.styleBlock=pageBlock] 블럭 스타일
 * @param {String} [options.style.styleCurrentPage=curpage] 현재 페이지 스타일
 * @param {String} [options.style.stylePage=page] 페이지 스타일
 */
function AbGridPager (options){
	if (!options) options = {};
	var templateOptions = options.template || {};
	var styleOptions = options.style || {};

	/**
	 * 페이지 스크립트 명 접두사
	 * @type {String}
	 */
	this.prefix = '';
	
	/**
	 * 전체 데이터 개수 (사용자 설정)
	 * @private
	 */
	this.$totalCount = 0;
	/**
	 * 시퀀스 번호
	 * @private
	 */
	this.$count = 0;
	/**
	 * 현재 위치
	 * @private
	 */
	this.$index = 0;
	/**
	 * 시퀀스 번호의 역순 여부 (사용자 설정)
	 * @private
	 */
	this.$desc = true;
	
	/**
	 * 화면에 보여줄 row 수 (사용자 설정)
	 * <p>* 한 페이지의 데이터 개수
	 * @private
	 */
	this.$lineCount = 15;
	/**
	 * 네비게이션의 페이지 개수 (사용자 설정)
	 * <p>* 한 블럭의 페이지 개수
	 * @private
	 */
	this.$pageCount = 10;
	
	/**
	 * 현재 페이지 번호 (사용자 설정)
	 * @private
	 */
	this.$page = 0;
	/**
	 * 전체 페이지 개수
	 * @private
	 */
	this.$totalPage = 0;
	/**
	 * 이전 페이지 번호
	 * @private
	 */
	this.$prevPage = 0;
	/**
	 * 다음 페이지 번호
	 * @private
	 */
	this.$nextPage = 0;
	
	/**
	 * 화면에 표시할 시작 페이지 번호
	 * @private
	 */
	this.$startPage = 0;
	/**
	 * 화면에 표시할 마지막 페이지 번호
	 * @private
	 */
	this.$endPage = 0;
	
	/**
	 * 현재 블럭 번호
	 * @private
	 */
	this.$block = 0;
	/**
	 * 전체 블럭 개수
	 * @private
	 */
	this.$totalBlock = 0;
	/**
	 * 이전 블럭의 페이지 번호
	 * @private
	 */
	this.$prevBlock = 0;
	/**
	 * 다음 블럭의 페이지 번호
	 * @private
	 */
	this.$nextBlock = 0;
	
	/**
	 * 시작 블럭
	 * @private
	 */
	this.$startBlock = 0;
	/**
	 * 마지막 블럭
	 * @private
	 */
	this.$endBlock = 0;
	
	//------------------ navigate
	
	var oThis = this;
	
	/**
	 * 페이저 함수
	 * <p>* 페이지 링크 스크립트를 리턴합니다.
	 * @private
	 * @method
	 * @param {Number} page 페이지 번호
	 * @return {String} 페이지 링크 스크립트 문자열
	 */
	this.$pagerFunction = arguments.length > 0 && typeof arguments[0] == 'function' ? arguments[0] : function (page){
		return 'javascript:'+oThis.prefix+'page(' + page + ')';
	};

	/*
	this.$symbolPrevBlock = '◀';
	this.$symbolNextBlock = '▶';
	
	this.$symbolFirstBlock = '│◀';
	this.$symbolLastBlock = '▶│';
	*/

	/**
	 * 이전 블럭 심볼
	 * @private
	 */
	this.$symbolPrevBlock = templateOptions.hasOwnProperty('symbolPrevBlock') ? templateOptions.symbolPrevBlock : '<img align="absmiddle" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMiAzMjsiIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBpZD0iX3gzNF9fYXVkaW9fcGxheSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEuMDE5Nzk1LCAwLCAwLCAxLCAzMi4zNDMxODIsIC0wLjA1NDk0NSkiIGZpbGw9IiNGRkZGRkYiPgogICAgPHBhdGggZD0iTTkuODM5LDE3Ljg0MnYtMy42ODhWNi4zOThjMC0wLjU1MSwwLjMzLTEuMDQ3LDAuODQtMS4yNThjMC41MDgtMC4yMTEsMS4wOTQtMC4wOTQsMS40ODIsMC4yOTVsOS42MDIsOS42MDIgICBjMC4yNTYsMC4yNTUsMC4zOTgsMC42MDIsMC4zOTgsMC45NjJjMCwwLjM2MS0wLjE0MywwLjcwOC0wLjM5OCwwLjk2M2wtOS42MDIsOS42MDNjLTAuMjYsMC4yNi0wLjYwOCwwLjM5OC0wLjk2MiwwLjM5OCAgIGMtMC4xNzUsMC0wLjM1My0wLjAzMy0wLjUyMS0wLjEwNGMtMC41MS0wLjIxMS0wLjg0LTAuNzA3LTAuODQtMS4yNThWMTcuODQyeiIvPgogIDwvZz4KPC9zdmc+"/>';
	/**
	 * 다음 블럭 심볼
	 * @private
	 */
	this.$symbolNextBlock = templateOptions.hasOwnProperty('symbolNextBlock') ? templateOptions.symbolNextBlock : '<img align="absmiddle" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMTZweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjE2cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDM0X19hdWRpb19wbGF5IiBmaWxsPSIjRkZGRkZGIj48cGF0aCBkPSJNOS44MzksMTcuODQydi0zLjY4OFY2LjM5OGMwLTAuNTUxLDAuMzMtMS4wNDcsMC44NC0xLjI1OGMwLjUwOC0wLjIxMSwxLjA5NC0wLjA5NCwxLjQ4MiwwLjI5NWw5LjYwMiw5LjYwMiAgIGMwLjI1NiwwLjI1NSwwLjM5OCwwLjYwMiwwLjM5OCwwLjk2MmMwLDAuMzYxLTAuMTQzLDAuNzA4LTAuMzk4LDAuOTYzbC05LjYwMiw5LjYwM2MtMC4yNiwwLjI2LTAuNjA4LDAuMzk4LTAuOTYyLDAuMzk4ICAgYy0wLjE3NSwwLTAuMzUzLTAuMDMzLTAuNTIxLTAuMTA0Yy0wLjUxLTAuMjExLTAuODQtMC43MDctMC44NC0xLjI1OFYxNy44NDJ6Ii8+PC9nPjwvc3ZnPg=="/>';
	
	/**
	 * 처음 블럭 심볼
	 * @private
	 */
	this.$symbolFirstBlock = templateOptions.hasOwnProperty('symbolFirstBlock') ? templateOptions.symbolFirstBlock : '<img align="absmiddle" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMTZweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjE2cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDM0X19hdWRpb19zdGVwX2JhY2siIGZpbGw9IiNGRkZGRkYiPjxwYXRoIGQ9Ik0yMS4zMjEsNS4xNDFjLTAuNTA4LTAuMjExLTEuMDk0LTAuMDk0LTEuNDgyLDAuMjk1bC05LjUsOS41VjUuMDM4YzAtMC4yNzYtMC4yMjQtMC41LTAuNS0wLjVIOC40NjcgICBjLTAuMjc2LDAtMC41LDAuMjI0LTAuNSwwLjV2MjEuOTI1YzAsMC4yNzYsMC4yMjQsMC41LDAuNSwwLjVoMS4zNzJjMC4yNzYsMCwwLjUtMC4yMjQsMC41LTAuNXYtOS44OThsOS41LDkuNSAgIGMwLjI2LDAuMjYsMC42MDgsMC4zOTgsMC45NjIsMC4zOThjMC4xNzUsMCwwLjM1My0wLjAzMywwLjUyMS0wLjEwNGMwLjUxLTAuMjExLDAuODQtMC43MDcsMC44NC0xLjI1OHYtNy43NnYtMy42ODdWNi4zOTkgICBDMjIuMTYxLDUuODQ4LDIxLjgzMSw1LjM1MiwyMS4zMjEsNS4xNDF6Ii8+PC9nPjwvc3ZnPg=="/>';
	/**
	 * 마지막 블럭 심볼
	 * @private
	 */
	this.$symbolLastBlock = templateOptions.hasOwnProperty('symbolLastBlock') ? templateOptions.symbolLastBlock : '<img align="absmiddle" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMTZweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjE2cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDM0X19hdWRpb19zdGVwX2ZvcndhcmQiIGZpbGw9IiNGRkZGRkYiPjxwYXRoIGQ9Ik05Ljc0Miw1LjE0MWMwLjUwOC0wLjIxMSwxLjA5NC0wLjA5NCwxLjQ4MiwwLjI5NWw5LjUsOS41VjUuMDM3YzAtMC4yNzYsMC4yMjUtMC41LDAuNS0wLjVoMS4zNzMgICBjMC4yNzUsMCwwLjUsMC4yMjQsMC41LDAuNXYyMS45MjZjMCwwLjI3Ni0wLjIyNSwwLjUtMC41LDAuNWgtMS4zNzNjLTAuMjc1LDAtMC41LTAuMjI0LTAuNS0wLjV2LTkuODk4bC05LjUsOS41ICAgYy0wLjI2LDAuMjYtMC42MDcsMC4zOTgtMC45NjEsMC4zOThjLTAuMTc2LDAtMC4zNTQtMC4wMzMtMC41MjEtMC4xMDRjLTAuNTEtMC4yMTEtMC44NC0wLjcwNy0wLjg0LTEuMjU4di03Ljc2di0zLjY4OFY2LjM5OCAgIEM4LjkwMiw1Ljg0OCw5LjIzMiw1LjM1Miw5Ljc0Miw1LjE0MXoiLz48L2c+PC9zdmc+"/>';
	
	/**
	 * 블럭 스타일
	 * @private
	 */
	this.$styleBlock = styleOptions.hasOwnProperty('styleBlock') ? styleOptions.styleBlock : 'pageBlock';
	/**
	 * 현재 페이지 스타일
	 * @private
	 */
	this.$styleCurrentPage = styleOptions.hasOwnProperty('styleCurrentPage') ? styleOptions.styleCurrentPage : 'curpage';
	/**
	 * 페이지 스타일
	 * @private
	 */
	this.$stylePage = styleOptions.hasOwnProperty('stylePage') ? styleOptions.stylePage : 'page';

	/**
	 * 블럭 템플릿
	 * @private
	 */
	this.$blockTemplate = templateOptions.hasOwnProperty('blockTemplate') ? templateOptions.blockTemplate : '<a class="{:style:}" href="{:pagenav:}">{:symbol:}</a>';
	/**
	 * 현재 페이지 템플릿
	 * @private
	 */
	this.$cpageTemplate = templateOptions.hasOwnProperty('cpageTemplate') ? templateOptions.cpageTemplate : '<div class="{:style:}">{:page:}</div>';
	/**
	 * 페이지 템플릿
	 * @private
	 */
	this.$pageTemplate = templateOptions.hasOwnProperty('pageTemplate') ? templateOptions.pageTemplate : '<a class="{:style:}" href="{:pagenav:}">{:page:}</a>';

	/*
	this.$blockTemplate = '<a class="{:style:}" href="{:pagenav:}">{:symbol:}</a>';
	this.$cpageTemplate = '<div class="{:style:}">[{:page:}]</div>';
	this.$pageTemplate = '<a class="{:style:}" href="{:pagenav:}">[{:page:}]</a>';
	*/
	
	/**
	 * 페이지 간 공백 템플릿
	 * @private
	 */
	this.$pageGapTemplate = templateOptions.hasOwnProperty('pageGapTemplate') ? templateOptions.pageGapTemplate : '&nbsp;';
	
	/**
	 * 네비게이션 템플릿
	 * @private
	 */
	this.$navTemplate = templateOptions.hasOwnProperty('navTemplate') ? templateOptions.navTemplate : '{:first:}&nbsp;{:prev:}&nbsp;{:pages:}&nbsp;{:next:}&nbsp;{:last:}';
}

/**
 * 페이지를 설정하거나 가져옵니다.
 * @param {Number} [page] 이동할 페이지 (1~N)
 * @return {Number} 인자를 안 줄 경우, 현재 페이지를 리턴합니다.
 */
AbGridPager.prototype.page = function (){
	if (arguments.length > 0){
		var val = parseInt(arguments[0]);
		if (isNaN(val)) val = 0;
		
		if (val >= 1)
			this.$page = val;
		else
			this.$page = 1;
	}else{
		return this.$page;
	}
}

/**
 * 전체 데이터 개수를 설정하거나 가져옵니다.
 * @param {Number} value 전체 데이터 개수
 * @return {Number} 인자를 안 줄 경우, 전체 데이터 개수를 리턴합니다.
 */
AbGridPager.prototype.totalCount = function (){
	if (arguments.length > 0){
		var val = parseInt(arguments[0]);
		if (isNaN(val)) val = 0;
		
		if (val <= 0)
			this.$totalCount = 0;
		else
			this.$totalCount = val;
		
		if (this.$totalCount < 1)
			this.$page = 1;
	}else{
		return this.$totalCount;
	}
}

/**
 * 시퀀스 번호를 가져옵니다.
 * @return {Number} 시퀀스 번호
 */
AbGridPager.prototype.count = function (){
	return this.$count;
}

/**
 * 현재 위치를 가져옵니다.
 * @return {Number} 현재 위치
 */
AbGridPager.prototype.index = function (){
	return this.$index;
}

/**
 * 시퀀스 번호의 역순 여부를 설정하거나 가져옵니다.
 * @param {Number} value 시퀀스 번호의 역순 여부
 * @return {Number} 인자를 안 줄 경우, 시퀀스 번호의 역순 여부를 리턴합니다.
 */
AbGridPager.prototype.desc = function (){
	if (arguments.length > 0){
		this.$desc = arguments[0] == true ? true : false;
	}else{
		return this.$desc;
	}
}

/**
 * 화면에 보여줄 row 수를 설정하거나 가져옵니다.
 * @param {Number} value 화면에 보여줄 row 수
 * @return {Number} 인자를 안 줄 경우, 화면에 보여줄 row 수를 리턴합니다.
 */
AbGridPager.prototype.lineCount = function (){
	if (arguments.length > 0){
		var val = parseInt(arguments[0]);
		if (isNaN(val)) val = 0;
		
		if (val < 1)
			this.$lineCount = 1;
		else
			this.$lineCount = val;
	}else{
		return this.$lineCount;
	}
}

/**
 * 네비게이션의 페이지 개수를 설정하거나 가져옵니다.
 * @param {Number} value 네비게이션의 페이지 개수
 * @return {Number} 인자를 안 줄 경우, 네비게이션의 페이지 개수를 리턴합니다.
 */
AbGridPager.prototype.pageCount = function (){
	if (arguments.length > 0){
		var val = parseInt(arguments[0]);
		if (isNaN(val)) val = 0;
		
		if (val < 1)
			this.$pageCount = 1;
		else
			this.$pageCount = val;
	}else{
		return this.$pageCount;
	}
}

/**
 * 전체 페이지 개수를 가져옵니다.
 * @return {Number} 전체 페이지 개수
 */
AbGridPager.prototype.totalPage = function (){
	return this.$totalPage;
}

/**
 * 이전 페이지 번호를 가져옵니다.
 * @return {Number} 이전 페이지 번호
 */
AbGridPager.prototype.prevPage = function (){
	return this.$prevPage;
}

/**
 * 다음 페이지 번호를 가져옵니다.
 * @return {Number} 다음 페이지 번호
 */
AbGridPager.prototype.nextPage = function (){
	return this.$nextPage;
}

/**
 * 화면에 표시할 시작 페이지 번호를 가져옵니다.
 * @return {Number} 화면에 표시할 시작 페이지 번호
 */
AbGridPager.prototype.startPage = function (){
	return this.$startPage;
}

/**
 * 화면에 표시할 마지막 페이지 번호를 가져옵니다.
 * @return {Number} 화면에 표시할 마지막 페이지 번호
 */
AbGridPager.prototype.endPage = function (){
	return this.$endPage;
}

/**
 * 현재 블럭 번호를 가져옵니다.
 * @return {Number} 현재 블럭 번호
 */
AbGridPager.prototype.block = function (){
	return this.$block;
}

/**
 * 전체 블럭 개수를 가져옵니다.
 * @return {Number} 전체 블럭 개수
 */
AbGridPager.prototype.totalBlock = function (){
	return this.$totalBlock;
}

/**
 * 이전 블럭의 페이지 번호를 가져옵니다.
 * @return {Number} 이전 블럭의 페이지 번호
 */
AbGridPager.prototype.prevBlock = function (){
	return this.$prevBlock;
}

/**
 * 다음 블럭의 페이지 번호를 가져옵니다.
 * @return {Number} 다음 블럭의 페이지 번호
 */
AbGridPager.prototype.nextBlock = function (){
	return this.$nextBlock;
}

/**
 * 시작 블럭를 가져옵니다.
 * @return {Number} 시작 블럭
 */
AbGridPager.prototype.startBlock = function (){
	return this.$startBlock;
}

/**
 * 마지막 블럭를 가져옵니다.
 * @return {Number} 마지막 블럭
 */
AbGridPager.prototype.endBlock = function (){
	return this.$endBlock;
}

/**
 * 화면에 표시할 데이터의 시작 위치를 가져옵니다.
 * @return {Number} 화면에 표시할 데이터의 시작 위치
 */
AbGridPager.prototype.startRow = function (){
	if (this.$page > 0)
		return (this.$page - 1) * this.$lineCount;
	return 0;
}

/**
 * 데이터의 위치로 페이지 번호를 계산합니다.
 * @param {Number} index 데이터 위치
 * @return {Number} 페이지 번호
 */
AbGridPager.prototype.pageFromIndex = function (index){
	return this.$totalCount > 0 ? parseInt(index / this.$lineCount) + 1 : 0;
}

//--------------- [START] navigate

/**
 * 페이저 함수를 설정하거나 가져옵니다.
 * @param {AbGridPager.pager} value 페이저 함수
 * @return {AbGridPager.pager} 인자를 안 줄 경우, 페이저 함수를 리턴합니다.
 */
AbGridPager.prototype.pager = function (){
	if (arguments.length > 0){
		if (typeof arguments[0] == 'function')
			this.$pagerFunction = arguments[0];
	}else{
		return this.$pagerFunction;
	}
}

/**
 * 이전 블럭 심볼을 설정하거나 가져옵니다.
 * @param {String} value 이전 블럭 심볼
 * @return {String} 인자를 안 줄 경우, 이전 블럭 심볼을 리턴합니다.
 */
AbGridPager.prototype.symbolPrevBlock = function (){
	if (arguments.length > 0){
		this.$symbolPrevBlock = arguments[0];
	}else{
		return this.$symbolPrevBlock;
	}
}

/**
 * 다음 블럭 심볼을 설정하거나 가져옵니다.
 * @param {String} value 다음 블럭 심볼
 * @return {String} 인자를 안 줄 경우, 다음 블럭 심볼을 리턴합니다.
 */
AbGridPager.prototype.symbolNextBlock = function (){
	if (arguments.length > 0){
		this.$symbolNextBlock = arguments[0];
	}else{
		return this.$symbolNextBlock;
	}
}

/**
 * 처음 블럭 심볼을 설정하거나 가져옵니다.
 * @param {String} value 처음 블럭 심볼
 * @return {String} 인자를 안 줄 경우, 처음 블럭 심볼을 리턴합니다.
 */
AbGridPager.prototype.symbolFirstBlock = function (){
	if (arguments.length > 0){
		this.$symbolFirstBlock = arguments[0];
	}else{
		return this.$symbolFirstBlock;
	}
}

/**
 * 마지막 블럭 심볼을 설정하거나 가져옵니다.
 * @param {String} value 마지막 블럭 심볼
 * @return {String} 인자를 안 줄 경우, 마지막 블럭 심볼을 리턴합니다.
 */
AbGridPager.prototype.symbolLastBlock = function (){
	if (arguments.length > 0){
		this.$symbolLastBlock = arguments[0];
	}else{
		return this.$symbolLastBlock;
	}
}

/**
 * 블럭 스타일을 설정하거나 가져옵니다.
 * @param {String} value 블럭 스타일
 * @return {String} 인자를 안 줄 경우, 블럭 스타일을 리턴합니다.
 */
AbGridPager.prototype.styleBlock = function (){
	if (arguments.length > 0){
		this.$styleBlock = arguments[0];
	}else{
		return this.$styleBlock;
	}
}

/**
 * 현재 페이지 스타일을 설정하거나 가져옵니다.
 * @param {String} value 현재 페이지 스타일
 * @return {String} 인자를 안 줄 경우, 현재 페이지 스타일을 리턴합니다.
 */
AbGridPager.prototype.styleCurrentPage = function (){
	if (arguments.length > 0){
		this.$styleCurrentPage = arguments[0];
	}else{
		return this.$styleCurrentPage;
	}
}

/**
 * 페이지 스타일을 설정하거나 가져옵니다.
 * @param {String} value 페이지 스타일
 * @return {String} 인자를 안 줄 경우, 페이지 스타일을 리턴합니다.
 */
AbGridPager.prototype.stylePage = function (){
	if (arguments.length > 0){
		this.$stylePage = arguments[0];
	}else{
		return this.$stylePage;
	}
}

/**
 * 블럭 템플릿을 설정하거나 가져옵니다.
 * @param {String} value 블럭 템플릿
 * @return {String} 인자를 안 줄 경우, 블럭 템플릿을 리턴합니다.
 */
AbGridPager.prototype.templateBlock = function (){
	if (arguments.length > 0){
		this.$blockTemplate = arguments[0];
	}else{
		return this.$blockTemplate;
	}
}

/**
 * 현재 페이지 템플릿을 설정하거나 가져옵니다.
 * @param {String} value 현재 페이지 템플릿
 * @return {String} 인자를 안 줄 경우, 현재 페이지 템플릿을 리턴합니다.
 */
AbGridPager.prototype.templateCurrentPage = function (){
	if (arguments.length > 0){
		this.$cpageTemplate = arguments[0];
	}else{
		return this.$cpageTemplate;
	}
}

/**
 * 페이지 템플릿을 설정하거나 가져옵니다.
 * @param {String} value 페이지 템플릿
 * @return {String} 인자를 안 줄 경우, 페이지 템플릿을 리턴합니다.
 */
AbGridPager.prototype.templatePage = function (){
	if (arguments.length > 0){
		this.$pageTemplate = arguments[0];
	}else{
		return this.$pageTemplate;
	}
}

/**
 * 페이지 간 공백 템플릿을 설정하거나 가져옵니다.
 * @param {String} value 페이지 간 공백 템플릿
 * @return {String} 인자를 안 줄 경우, 페이지 간 공백 템플릿을 리턴합니다.
 */
AbGridPager.prototype.templatePageGap = function (){
	if (arguments.length > 0){
		this.$pageGapTemplate = arguments[0];
	}else{
		return this.$pageGapTemplate;
	}
}

/**
 * 네비게이션 템플릿을 설정하거나 가져옵니다.
 * @param {String} value 네비게이션 템플릿
 * @return {String} 인자를 안 줄 경우, 네비게이션 템플릿을 리턴합니다.
 */
AbGridPager.prototype.templateNavigate = function (){
	if (arguments.length > 0){
		this.$navTemplate = arguments[0];
	}else{
		return this.$navTemplate;
	}
}

//--------------- [END] navigate

/**
 * 계산 전 준비 작업을 수행합니다.
 * @return {Number} 시작 시퀀스 번호
 */
AbGridPager.prototype.prepare = function (){
	if (this.$totalCount <= 0)
		return 0;
	
	if (this.$totalCount > 0 && this.$lineCount > 0)
		this.$totalPage = Math.floor((this.$totalCount - 1) / this.$lineCount) + 1;
	else
		this.$totalPage = 0;
	
	var page = this.$page;
	if (this.$totalCount > 0 && page < 1)
		page = 1;
	
	if (page > this.$totalPage){
		this.$page = page = this.$totalPage;
	}
	
	if (this.$desc)
		this.$count = this.$totalCount - (page - 1) * this.$lineCount;
	else
		this.$count = (page - 1) * this.$lineCount + 1;
	
	return this.$count;
}

/**
 * 루틴을 초기화합니다.
 */
AbGridPager.prototype.reset = function (){
	this.$index = 0;
}

/**
 * 다음 데이터로 이동합니다.
 * @return {Number} 시퀀스 번호
 */
AbGridPager.prototype.next = function (){
	if (this.$desc)
		this.$count--;
	else
		this.$count++;
	
	this.$index++;
	
	return this.$count;
}

/**
 * 다음 데이터를 표시할 수 있는 지 확인합니다.
 * @return {Boolean} 표시할 수 있으면 true
 */
AbGridPager.prototype.hasNext = function (){
	return this.$index < this.$lineCount;
}

/**
 * 입력한 정보를 기반으로 페이지를 계산합니다.
 */
AbGridPager.prototype.calculate = function (){
	if (this.$page < 1)
		this.$page = 1;
	
	this.$totalBlock = Math.ceil(this.$totalPage / this.$pageCount);
	this.$block = Math.ceil(this.$page / this.$pageCount);
	
	this.$startBlock = (this.$block - 1) * this.$pageCount;
	this.$endBlock = this.$block * this.$pageCount;
	
	if (this.$page > 1)
		this.$prevPage = this.$page - 1;
	else
		this.$prevPage = 0;
	
	if (this.$page < this.$totalPage)
		this.$nextPage = this.$page + 1;
	else
		this.$nextPage = 0;
	
	if (this.$block > 1)
		this.$prevBlock = this.$startBlock;
	else
		this.$prevBlock = 0;
	
	if (this.$block < this.$totalBlock)
		this.$nextBlock = this.$endBlock + 1;
	else
		this.$nextBlock = 0;
	
	this.$startPage = this.$startBlock + 1;
	this.$endPage = this.$startBlock + this.$pageCount;
	
	if (this.$endPage > this.$totalPage)
		this.$endPage = this.$totalPage;
}

/**
 * 네이게이션을 생성합니다.
 * @param {AbGridPager.NavigationGenerateCallback} [callback] 네비게이션 제작 콜백
 * @return {String} 네이게이션 HTML 문자열
 */
AbGridPager.prototype.generate = function (){
	if (arguments.length && typeof arguments[0] == 'function'){
		return this.generateEach(arguments[0]);
	}else{
		return this.generateHtml();
	}
}

/**
 *네이게이션을 생성합니다.
 * @return {String} 네이게이션 HTML 문자열
 */
AbGridPager.prototype.generateHtml = function (){
	var htmlFirst = '';
	var htmlLast = '';
	var htmlPrev = '';
	var htmlNext = '';
	var htmlPages = '';
	
	if (this.$totalCount){
		if (this.$block > 1 && this.$totalBlock){
			htmlFirst = this.$blockTemplate
				.replace('{:pagenav:}', this.$pagerFunction(1))
				.replace('{:style:}', this.$styleBlock)
				.replace('{:symbol:}', this.$symbolFirstBlock);
		}
		
		if (this.$totalBlock && this.$block < this.$totalBlock){
			htmlLast = this.$blockTemplate
				.replace('{:pagenav:}', this.$pagerFunction(this.$totalPage))
				.replace('{:style:}', this.$styleBlock)
				.replace('{:symbol:}', this.$symbolLastBlock);
		}
		
		if (this.$prevBlock){
			htmlPrev = this.$blockTemplate
				.replace('{:pagenav:}', this.$pagerFunction(this.$prevBlock))
				.replace('{:style:}', this.$styleBlock)
				.replace('{:symbol:}', this.$symbolPrevBlock);
		}
		
		for (var i=this.$startPage, idx = 0; i<=this.$endPage; i++, idx++){
			if (idx > 0)
				htmlPages += this.$pageGapTemplate;
				
			if (i == this.$page)
				htmlPages += this.$cpageTemplate
					.replace('{:style:}', this.$styleCurrentPage)
					.replace('{:page:}', i);
			else
				htmlPages += this.$pageTemplate
					.replace('{:pagenav:}', this.$pagerFunction(i))
					.replace('{:style:}', this.$stylePage)
					.replace('{:page:}', i);
		}
		
		if (this.$nextBlock){
			htmlNext = this.$blockTemplate
				.replace('{:pagenav:}', this.$pagerFunction(this.$nextBlock))
				.replace('{:style:}', this.$styleBlock)
				.replace('{:symbol:}', this.$symbolNextBlock);
		}
	}
	
//	var html = 	this.$navTemplate.replace('{:first:}', htmlFirst);
//	html = html.replace('{:prev:}', htmlPrev);
//	html = html.replace('{:pages:}', htmlPages);
//	html = html.replace('{:next:}', htmlNext);
//	html = html.replace('{:last:}', htmlLast);
//	return html;
	
	return this.$navTemplate
					.replace('{:first:}', htmlFirst)
					.replace('{:prev:}', htmlPrev)
					.replace('{:pages:}', htmlPages)
					.replace('{:next:}', htmlNext)
					.replace('{:last:}', htmlLast);
}

/**
 * 콜백을 이용해 네이게이션을 생성합니다.
 * @param {AbGridPager.NavigationGenerateCallback} callback 네비게이션 제작 콜백
 * @return {String} 네이게이션 HTML 문자열
 */
AbGridPager.prototype.generateEach = function (callback){
	var htmlFirst = '';
	var htmlLast = '';
	var htmlPrev = '';
	var htmlNext = '';
	var htmlPages = '';
	
	if (this.$totalCount){
		if (this.$block > 1 && this.$totalBlock)
			htmlFirst = callback('block.first', 1);
		
		if (this.$totalBlock && this.$block < this.$totalBlock)
			htmlLast = callback('block.last', this.$totalPage);
		
		if (this.$prevBlock)
			htmlPrev = callback('block.prev', this.$prevBlock);
		
		for (var i=this.$startPage, idx = 0; i<=this.$endPage; i++, idx++){
			if (idx > 0)
				htmlPages += this.$pageGapTemplate;
				
			if (i == this.$page)
				htmlPages += callback('page.current', i);
			else
				htmlPages += callback('page', i);
		}
		
		if (this.$nextBlock)
			htmlNext = callback('block.next', this.$nextBlock);
	}

	return callback('navigation', {
		total: this.$totalCount,

		html: {
			first: htmlFirst,
			prev: htmlPrev,
			pages: htmlPages,
			next: htmlNext,
			last: htmlLast
		},
	});
}


