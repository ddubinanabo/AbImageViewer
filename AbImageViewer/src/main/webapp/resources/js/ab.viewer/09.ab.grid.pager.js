function AbGridPager (options){
	if (!options) options = {};
	var templateOptions = options.template || {};
	var styleOptions = options.style || {};

	this.prefix = '';
	
	this.$totalCount = 0;
	this.$count = 0;
	this.$index = 0;
	this.$desc = true;
	
	this.$lineCount = 15;
	this.$pageCount = 10;
	
	this.$page = 0;
	this.$totalPage = 0;
	this.$prevPage = 0;
	this.$nextPage = 0;
	
	this.$startPage = 0;
	this.$endPage = 0;
	
	this.$block = 0;
	this.$totalBlock = 0;
	this.$prevBlock = 0;
	this.$nextBlock = 0;
	
	this.$startBlock = 0;
	this.$endBlock = 0;
	
	//------------------ navigate
	
	var oThis = this;
	
	this.$pagerFunction = arguments.length > 0 && typeof arguments[0] == 'function' ? arguments[0] : function (page){
		return 'javascript:'+oThis.prefix+'page(' + page + ')';
	};

	/*
	this.$symbolPrevBlock = '◀';
	this.$symbolNextBlock = '▶';
	
	this.$symbolFirstBlock = '│◀';
	this.$symbolLastBlock = '▶│';
	*/

	this.$symbolPrevBlock = templateOptions.hasOwnProperty('symbolPrevBlock') ? templateOptions.symbolPrevBlock : '<img align="absmiddle" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMiAzMjsiIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBpZD0iX3gzNF9fYXVkaW9fcGxheSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEuMDE5Nzk1LCAwLCAwLCAxLCAzMi4zNDMxODIsIC0wLjA1NDk0NSkiIGZpbGw9IiNGRkZGRkYiPgogICAgPHBhdGggZD0iTTkuODM5LDE3Ljg0MnYtMy42ODhWNi4zOThjMC0wLjU1MSwwLjMzLTEuMDQ3LDAuODQtMS4yNThjMC41MDgtMC4yMTEsMS4wOTQtMC4wOTQsMS40ODIsMC4yOTVsOS42MDIsOS42MDIgICBjMC4yNTYsMC4yNTUsMC4zOTgsMC42MDIsMC4zOTgsMC45NjJjMCwwLjM2MS0wLjE0MywwLjcwOC0wLjM5OCwwLjk2M2wtOS42MDIsOS42MDNjLTAuMjYsMC4yNi0wLjYwOCwwLjM5OC0wLjk2MiwwLjM5OCAgIGMtMC4xNzUsMC0wLjM1My0wLjAzMy0wLjUyMS0wLjEwNGMtMC41MS0wLjIxMS0wLjg0LTAuNzA3LTAuODQtMS4yNThWMTcuODQyeiIvPgogIDwvZz4KPC9zdmc+"/>';
	this.$symbolNextBlock = templateOptions.hasOwnProperty('symbolNextBlock') ? templateOptions.symbolNextBlock : '<img align="absmiddle" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMTZweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjE2cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDM0X19hdWRpb19wbGF5IiBmaWxsPSIjRkZGRkZGIj48cGF0aCBkPSJNOS44MzksMTcuODQydi0zLjY4OFY2LjM5OGMwLTAuNTUxLDAuMzMtMS4wNDcsMC44NC0xLjI1OGMwLjUwOC0wLjIxMSwxLjA5NC0wLjA5NCwxLjQ4MiwwLjI5NWw5LjYwMiw5LjYwMiAgIGMwLjI1NiwwLjI1NSwwLjM5OCwwLjYwMiwwLjM5OCwwLjk2MmMwLDAuMzYxLTAuMTQzLDAuNzA4LTAuMzk4LDAuOTYzbC05LjYwMiw5LjYwM2MtMC4yNiwwLjI2LTAuNjA4LDAuMzk4LTAuOTYyLDAuMzk4ICAgYy0wLjE3NSwwLTAuMzUzLTAuMDMzLTAuNTIxLTAuMTA0Yy0wLjUxLTAuMjExLTAuODQtMC43MDctMC44NC0xLjI1OFYxNy44NDJ6Ii8+PC9nPjwvc3ZnPg=="/>';
	
	this.$symbolFirstBlock = templateOptions.hasOwnProperty('symbolFirstBlock') ? templateOptions.symbolFirstBlock : '<img align="absmiddle" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMTZweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjE2cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDM0X19hdWRpb19zdGVwX2JhY2siIGZpbGw9IiNGRkZGRkYiPjxwYXRoIGQ9Ik0yMS4zMjEsNS4xNDFjLTAuNTA4LTAuMjExLTEuMDk0LTAuMDk0LTEuNDgyLDAuMjk1bC05LjUsOS41VjUuMDM4YzAtMC4yNzYtMC4yMjQtMC41LTAuNS0wLjVIOC40NjcgICBjLTAuMjc2LDAtMC41LDAuMjI0LTAuNSwwLjV2MjEuOTI1YzAsMC4yNzYsMC4yMjQsMC41LDAuNSwwLjVoMS4zNzJjMC4yNzYsMCwwLjUtMC4yMjQsMC41LTAuNXYtOS44OThsOS41LDkuNSAgIGMwLjI2LDAuMjYsMC42MDgsMC4zOTgsMC45NjIsMC4zOThjMC4xNzUsMCwwLjM1My0wLjAzMywwLjUyMS0wLjEwNGMwLjUxLTAuMjExLDAuODQtMC43MDcsMC44NC0xLjI1OHYtNy43NnYtMy42ODdWNi4zOTkgICBDMjIuMTYxLDUuODQ4LDIxLjgzMSw1LjM1MiwyMS4zMjEsNS4xNDF6Ii8+PC9nPjwvc3ZnPg=="/>';
	this.$symbolLastBlock = templateOptions.hasOwnProperty('symbolLastBlock') ? templateOptions.symbolLastBlock : '<img align="absmiddle" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMTZweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjE2cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDM0X19hdWRpb19zdGVwX2ZvcndhcmQiIGZpbGw9IiNGRkZGRkYiPjxwYXRoIGQ9Ik05Ljc0Miw1LjE0MWMwLjUwOC0wLjIxMSwxLjA5NC0wLjA5NCwxLjQ4MiwwLjI5NWw5LjUsOS41VjUuMDM3YzAtMC4yNzYsMC4yMjUtMC41LDAuNS0wLjVoMS4zNzMgICBjMC4yNzUsMCwwLjUsMC4yMjQsMC41LDAuNXYyMS45MjZjMCwwLjI3Ni0wLjIyNSwwLjUtMC41LDAuNWgtMS4zNzNjLTAuMjc1LDAtMC41LTAuMjI0LTAuNS0wLjV2LTkuODk4bC05LjUsOS41ICAgYy0wLjI2LDAuMjYtMC42MDcsMC4zOTgtMC45NjEsMC4zOThjLTAuMTc2LDAtMC4zNTQtMC4wMzMtMC41MjEtMC4xMDRjLTAuNTEtMC4yMTEtMC44NC0wLjcwNy0wLjg0LTEuMjU4di03Ljc2di0zLjY4OFY2LjM5OCAgIEM4LjkwMiw1Ljg0OCw5LjIzMiw1LjM1Miw5Ljc0Miw1LjE0MXoiLz48L2c+PC9zdmc+"/>';
	
	this.$styleBlock = styleOptions.hasOwnProperty('styleBlock') ? styleOptions.styleBlock : 'pageBlock';
	this.$styleCurrentPage = styleOptions.hasOwnProperty('styleCurrentPage') ? styleOptions.styleCurrentPage : 'curpage';
	this.$stylePage = styleOptions.hasOwnProperty('stylePage') ? styleOptions.stylePage : 'page';

	this.$blockTemplate = templateOptions.hasOwnProperty('blockTemplate') ? templateOptions.blockTemplate : '<a class="{:style:}" href="{:pagenav:}">{:symbol:}</a>';
	this.$cpageTemplate = templateOptions.hasOwnProperty('cpageTemplate') ? templateOptions.cpageTemplate : '<div class="{:style:}">{:page:}</div>';
	this.$pageTemplate = templateOptions.hasOwnProperty('pageTemplate') ? templateOptions.pageTemplate : '<a class="{:style:}" href="{:pagenav:}">{:page:}</a>';

	/*
	this.$blockTemplate = '<a class="{:style:}" href="{:pagenav:}">{:symbol:}</a>';
	this.$cpageTemplate = '<div class="{:style:}">[{:page:}]</div>';
	this.$pageTemplate = '<a class="{:style:}" href="{:pagenav:}">[{:page:}]</a>';
	*/
	
	this.$pageGapTemplate = templateOptions.hasOwnProperty('pageGapTemplate') ? templateOptions.pageGapTemplate : '&nbsp;';
	
	this.$navTemplate = templateOptions.hasOwnProperty('navTemplate') ? templateOptions.navTemplate : '{:first:}&nbsp;{:prev:}&nbsp;{:pages:}&nbsp;{:next:}&nbsp;{:last:}';
}

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

AbGridPager.prototype.count = function (){
	return this.$count;
}

AbGridPager.prototype.index = function (){
	return this.$index;
}

AbGridPager.prototype.desc = function (){
	if (arguments.length > 0){
		this.$desc = arguments[0] == true ? true : false;
	}else{
		return this.$desc;
	}
}

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

AbGridPager.prototype.totalPage = function (){
	return this.$totalPage;
}

AbGridPager.prototype.prevPage = function (){
	return this.$prevPage;
}

AbGridPager.prototype.nextPage = function (){
	return this.$nextPage;
}

AbGridPager.prototype.startPage = function (){
	return this.$startPage;
}

AbGridPager.prototype.endPage = function (){
	return this.$endPage;
}

AbGridPager.prototype.block = function (){
	return this.$block;
}

AbGridPager.prototype.totalBlock = function (){
	return this.$totalBlock;
}

AbGridPager.prototype.prevBlock = function (){
	return this.$prevBlock;
}

AbGridPager.prototype.nextBlock = function (){
	return this.$nextBlock;
}

AbGridPager.prototype.endPage = function (){
	return this.$endPage;
}

AbGridPager.prototype.startBlock = function (){
	return this.$startBlock;
}

AbGridPager.prototype.endBlock = function (){
	return this.$endBlock;
}

AbGridPager.prototype.startRow = function (){
	if (this.$page > 0)
		return (this.$page - 1) * this.$lineCount;
	return 0;
}

AbGridPager.prototype.pageFromIndex = function (index){
	return this.$totalCount > 0 ? parseInt(index / this.$lineCount) + 1 : 0;
}

//--------------- [START] navigate

AbGridPager.prototype.pager = function (){
	if (arguments.length > 0){
		if (typeof arguments[0] == 'function')
			this.$pagerFunction = arguments[0];
	}else{
		return this.$pagerFunction;
	}
}

AbGridPager.prototype.symbolPrevBlock = function (){
	if (arguments.length > 0){
		this.$symbolPrevBlock = arguments[0];
	}else{
		return this.$symbolPrevBlock;
	}
}

AbGridPager.prototype.symbolNextBlock = function (){
	if (arguments.length > 0){
		this.$symbolNextBlock = arguments[0];
	}else{
		return this.$symbolNextBlock;
	}
}

AbGridPager.prototype.symbolFirstBlock = function (){
	if (arguments.length > 0){
		this.$symbolFirstBlock = arguments[0];
	}else{
		return this.$symbolFirstBlock;
	}
}

AbGridPager.prototype.symbolLastBlock = function (){
	if (arguments.length > 0){
		this.$symbolLastBlock = arguments[0];
	}else{
		return this.$symbolLastBlock;
	}
}

AbGridPager.prototype.styleBlock = function (){
	if (arguments.length > 0){
		this.$styleBlock = arguments[0];
	}else{
		return this.$styleBlock;
	}
}

AbGridPager.prototype.styleCurrentPage = function (){
	if (arguments.length > 0){
		this.$styleCurrentPage = arguments[0];
	}else{
		return this.$styleCurrentPage;
	}
}

AbGridPager.prototype.stylePage = function (){
	if (arguments.length > 0){
		this.$stylePage = arguments[0];
	}else{
		return this.$stylePage;
	}
}

AbGridPager.prototype.templateBlock = function (){
	if (arguments.length > 0){
		this.$blockTemplate = arguments[0];
	}else{
		return this.$blockTemplate;
	}
}

AbGridPager.prototype.templateCurrentPage = function (){
	if (arguments.length > 0){
		this.$cpageTemplate = arguments[0];
	}else{
		return this.$cpageTemplate;
	}
}

AbGridPager.prototype.templatePage = function (){
	if (arguments.length > 0){
		this.$pageTemplate = arguments[0];
	}else{
		return this.$pageTemplate;
	}
}

AbGridPager.prototype.templatePageGap = function (){
	if (arguments.length > 0){
		this.$pageGapTemplate = arguments[0];
	}else{
		return this.$pageGapTemplate;
	}
}

AbGridPager.prototype.templateNavigate = function (){
	if (arguments.length > 0){
		this.$navTemplate = arguments[0];
	}else{
		return this.$navTemplate;
	}
}

//--------------- [END] navigate

AbGridPager.prototype.prepare = function (){
	if (this.$totalCount <= 0)
		return 0;
	
	if (this.$totalCount > 0 && this.$lineCount > 0)
		this.$totalPage = Math.floor((this.$totalCount - 1) / this.$lineCount) + 1;
	else
		this.$totalPage = 0;
	
	if (this.$page > this.$totalPage)
		this.$page = this.$totalPage;
	
	if (this.$desc)
		this.$count = this.$totalCount - (this.$page - 1) * this.$lineCount;
	else
		this.$count = (this.$page - 1) * this.$lineCount + 1;
	
	return this.$count;
}


AbGridPager.prototype.reset = function (){
	this.$index = 0;
}

AbGridPager.prototype.next = function (){
	if (this.$desc)
		this.$count--;
	else
		this.$count++;
	
	this.$index++;
	
	return this.$count;
}

AbGridPager.prototype.hasNext = function (){
	return this.$index < this.$lineCount;
}

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

AbGridPager.prototype.generate = function (){
	if (arguments.length && typeof arguments[0] == 'function'){
		return this.generateEach(arguments[0]);
	}else{
		return this.generateHtml();
	}
}

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


