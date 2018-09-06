/*
- 목록 개수, 뷰 개수 변화 시
	- update() 호출

- 페이지 이동 시
	- paging() 호출

- 같은 페이지 재 호출 시
	- reload() 호출
*/

function AbImageListView(options){
	if (!options) options = {};
	var selectingOptions = options.selecting || {};

	this.name = options.name || 'list';

	this.selector = options.selector || '#thumbnails';
	
	this.e = $(this.selector);
	this.listContainer = this.e.find('.adv-list [lt-topic="container"]');
	this.eCheckAll = this.e.find('.head [lt-topic="all"]');
	this.eViewSize = this.e.find('.head [lt-topic="viewsize"]');
	this.ePagingArea = this.e.find('.foot .paginate');
	
	//-----------------------------------------------------------

	this.bookmark = options.hasOwnProperty('bookmark') ? options.bookmark : false;		// 북마크 모드
	this.selecting = {
		method: AbCommon.isString(selectingOptions.method) ?
			selectingOptions.method.split(/\|/g)
			: AbCommon.isSetted(selectingOptions.method) && $.isArray(selectingOptions.method) ?
				selectingOptions.method : ['click'], // 선택 하는 방법, click, dblclick
		auto: AbCommon.isBool(selectingOptions.auto) ? selectingOptions.auto : true, // 자동 선택 여부(목록 변경 시/페이지 이동 시 등등), true, false
	};
	this.token = options.token; // 사용자 정의 데이터
	
	//-----------------------------------------------------------

	this.map = {};
	this.renderedMap = {};
	
	this.children = [];
	this.renderedChecks = [];
	this.renderedChildren = [];

	this.pager = this.createPager();
	this.pager.pageCount(!options.pageCount || options.pageCount < 1 ? 4 : options.pageCount); // page navigation의 개수
	
	//-----------------------------------------------------------

	this.templateSelector = options.templateSelector || '#list-template';
	this.template = $(this.templateSelector);
	
	//-----------------------------------------------------------

	this.observers = [];

	//-----------------------------------------------------------

	this.viewSize = this.eViewSize.val();
	if (this.viewSize > 0)
		this.pager.lineCount(this.viewSize);

	this.selectedIndex = -1;
	this.pages = options.pages;

	//-----------------------------------------------------------

	this.clickHandler = function(event){
		var e = $(event.currentTarget);
		var target = $(event.target);

		var selectable = $.inArray('click', this.selecting.method) >= 0;

		var status = e.attr('lt-status');
		var uid = e.attr('lt-uid');
		
		this.notifyObservers('click', { uid: uid, status: status });

		if (e.hasClass('selected') || target.hasClass('checkmark') || target.hasClass('info') || (event.target && event.target.tagName.toLowerCase() == 'input')){
			if (status == 'error' && target.hasClass('content')){
				var index = e.index() + this.startIndex();

				e.attr('lt-status', 'loading');
				this.notifyObservers('request.load', { index: index, page: this.pages.get(index) });
			}			
			return;
		}
		
		if (status == 'loaded'){
			if (selectable) this.notifyObservers('select', uid);
		}else if (status == 'error'){
			if (target.hasClass('content')){
				var index = e.index() + this.startIndex();

				e.attr('lt-status', 'loading');
				if (selectable)
					this.notifyObservers('request.load', { index: index, page: this.pages.get(index) });
				else
					this.notifyObservers('request.load');
			}else{
				if (selectable) this.notifyObservers('select', uid);
			}
		}
	}.bind(this);

	this.dblClickHandler = function(event){
		var e = $(event.currentTarget);
		var target = $(event.target);

		var selectable = $.inArray('dblclick', this.selecting.method) >= 0;

		if (!selectable)
			return;

		var status = e.attr('lt-status');

		var uid = e.attr('lt-uid');
		
		if (status == 'loaded'){
			this.notifyObservers('dblclick', uid);
		}else if (status == 'error'){
			if (target.hasClass('content')){
				var index = e.index() + this.startIndex();

				e.attr('lt-status', 'loading');
				this.notifyObservers('request.load', { index: index, page: this.pages.get(index) });
			}else{
				this.notifyObservers('dblclick', uid);
			}
		}
	}.bind(this);

	this.checkBookmarkHandler = function(event){
		var e = $(event.currentTarget);
		var ecover = e.parents('[lt-topic="cover"]');
		var uid = ecover.attr('lt-uid');
		var checked = e.is(':checked');

		if (!checked)
			this.notifyObservers('bookmark.remove', uid);
		else
			this.notifyObservers('bookmark.add', uid);

		event.preventDefault();
	}.bind(this);

	this.checkInfoHandler = function(event){
		var e = $(event.currentTarget);
		var ecover = e.parents('[lt-topic="cover"]');
		var uid = ecover.attr('lt-uid');

		this.notifyObservers('info', uid);
	}.bind(this);

	//-----------------------------------------------------------

	this.eCheckAll.click(function (event){
		var e = $(event.currentTarget);
		
		this.toggleAll(e.is(':checked'));
	}.bind(this));

	this.eViewSize.change(function (event){
		var e = $(event.currentTarget);

		this.changeView(e.val());
	}.bind(this));

	this.ePagingArea.click(function(event){
		var e = $(event.currentTarget);
		var target = $(event.target);

		var page = target.attr('lt-page');
		if (!page)
			return;

		page = parseInt(page);
		this.paging(page);

	}.bind(this));
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbImageListView.prototype = {
	constructor: AbImageListView,

	//-----------------------------------------------------------

	observe: function(observer){ this.observers.push(observer); },
	stopObserve: function(observer){
		var idx = this.observers.indexOf(observer);
		if (idx >= 0) this.observers.splice(idx, 1);
	},
	
	notifyObservers: function(topic, value, element){
		this.exec(function(){
			var len = this.observers.length;
			for (var i=0; i < len; i++){
				var o = this.observers[i];

				if (typeof o == 'function')
					o(this, topic, value, element);
				else if (typeof o.listViewNotify == 'function')
					o.listViewNotify(this, topic, value, element);
			}
		});
	},

	//-----------------------------------------------------------

	exec: function(func, delay){
		if (!delay) delay = 0;
		setTimeout(func.bind(this), delay);
		//func.call(this);
	},

	//-----------------------------------------------------------

	notify: function(sender, topic, value){
		if (this.bookmark)
			this.notifyRelative(sender, topic, value);
		else
			this.notifyAbsolute(sender, topic, value);

		switch (topic){
		case 'page.select':
			if (this.enabled()){
				this.select(value);
			}
			break;
		case 'collection.changed':
			if (this.enabled()){
				if (!AbCommon.isSetted(value)) value = true;

				var selectingPage = AbCommon.isBool(value) ? value : false;
				var nums = this.length();
				if (nums){
					var index = this.selectedIndex;
					//var selectedIndex = index;
					if (index < 0 || index >= nums)
						this.selectedIndex = index = 0;

					var e = this.children[index];
					if (e && selectingPage && this.selecting.auto){
						this.notifyObservers('select', e.attr('lt-uid'));
					}
				}else{
					if (selectingPage && this.selecting.auto) this.notifyObservers('unselect');
				}
			}
			break;
		case 'modified':
			var item = this.map[value.uid];
			if (item) this.topic(item, 'image').attr('src', value.data);
			break;
		}
	},

	notifyRelative: function (sender, topic, value){
		//console.log('[LISTVIEW::'+this.name+'][Viewer]['+ topic + '] ' + value);
	
		var index = 0, item = null, page = null;
		switch (topic){
		case 'bookmark.add':
			this.pager.totalCount(this.length());
			this.updateViewSize();

			page = this.pages.getById(value);
			index = this.insertListItem(page);

			this.update(this.selectedIndex >= 0 ? 'current' : 'first');
			this.topic(this.children[index], 'bookmark').prop('checked', true);

			if (page.status == AbPage.prototype.LOADED)
				this.listItemImage(value);
			break;

		case 'bookmark.remove':
			var selectable = this.removeListItem(value);

			this.pager.totalCount(this.length());
			this.updateViewSize();
			
			this.update(this.selectedIndex >= 0 ? 'current' : 'first');

			if (this.enabled() && this.length() == 0) this.notifyObservers('unselect');
			break;

		case 'page.loaded':
			uid = value.page.uid;
			item = this.map[uid];
			if (item && item.attr('lt-status') !== 'loaded')
				this.listItemImage(uid);

		case 'page.remove':
			this.removeBookmarks();
			break;

		case 'page.remove.list':
			var a = [];
			var cindex = this.selectedIndex, ocindex = cindex, cdel = false;

			this.unselect();
			
			for (var i = value.pages.length - 1; i >= 0; i--){
				var uid = value.pages[i].uid;
				var idx = this.pages.indexOf(uid);
				if (idx < 0)
					continue;

				a.push(idx);
				
				delete this.map[uid];
				this.pages.removeById(uid);
			}

			a.sort(function (a, b){ return a - b; });

			for (var i = a.length - 1; i >= 0; i--){
				var idx = a[i];

				if (cindex >= 0){
					if (cindex == idx){
						cdel = true;
						cindex = ocindex;
					}else if (cindex > idx)
						cindex--;
				}

				this.children.splice(idx, 1);
			}

			if (cindex >= this.children.length)
				cindex = this.children.length - 1;

			this.selectedIndex = cindex;

			this.pager.totalCount(this.children.length);
			this.updateViewSize();
			this.update(this.selectedIndex >= 0 ? 'current' : 'first');

			if (this.enabled() && this.length() == 0) this.notifyObservers('unselect');
			break;

		case 'history.sync':
			// undo/redo에 대한 복원 처리
			switch(value.topic){
			case 'page':
				switch(value.cmd){
				case 'add':
					switch(value.docmd){
					case 'undo':
						for (var i=value.data.length - 1; i >= 0; i--){
							var d = value.data[i];
							var uid = d.source.uid;

							item = this.map[uid];
							if (item){
								index = this.pages.indexOf(uid);

								this.children.splice(index, 1);
								delete this.map[uid];
							}
						}

						this.pager.totalCount(this.length());
						this.updateViewSize();
						this.pager.prepare();

						this.reload('current');
						this.notifyObservers('history.sync.end', value);
						break;

					case 'redo':
						break;
					}					
					break;

				case 'remove':
					switch(value.docmd){
					case 'undo':
						break;

					case 'redo':
						for (var i=value.data.length - 1; i >= 0; i--){
							var d = value.data[i];
							var uid = d.source.uid;

							item = this.map[uid];
							if (item){
								index = this.pages.indexOf(uid);

								this.children.splice(index, 1);
								delete this.map[uid];
							}
						}

						this.pager.totalCount(this.length());
						this.updateViewSize();
						this.pager.prepare();

						this.reload('current');
						this.notifyObservers('history.sync.end', value);
						break;
					}					
					break;
				}
				break;
			}
			break;
		}
	},
	
	pageLoadCount: 0,

	notifyAbsolute: function(sender, topic, value){
		//console.log('[LISTVIEW::'+this.name+'][Viewer]['+ topic + '] ' + value);
	
		var index = 0, item = null, uid = null;
		switch (topic){
		case 'pages':
			this.pager.totalCount(this.length());
			this.updateViewSize();
			this.update(this.selectedIndex >= 0 ? 'current' : 'first');
	
			if (this.enabled() && this.length() == 0) this.notifyObservers('unselect');		
			break;
		case 'page.add':
			this.insertListItem(value.page);
			break;
		case 'page.loading':
			this.map[value].attr('lt-status', 'loading');
			break;
		case 'page.loaded':
			uid = value.page.uid;
			index = value.index;

			this.listItemImage(index);

			item = this.map[uid];
			item.attr('lt-status', 'loaded');

			if (value.hasOwnProperty('select') && value.select && this.selecting.auto)
				this.notifyObservers('select', item.attr('lt-uid'));
			break;
		case 'page.error':
			this.map[value].attr('lt-status', 'error');
			break;

		case 'bookmark.add':
			this.topic(this.map[value], 'bookmark').prop('checked', true);
			break;
		case 'bookmark.remove':
			this.topic(this.map[value], 'bookmark').prop('checked', false);
			break;

		case 'bookmark.remove.list':
			for (var i=value.length - 1; i >= 0; i--){
				var e = this.map[value[i]];
				var ce = this.topic(e, 'bookmark');

				ce.prop('checked', false);
			}
			break;

		case 'page.remove':
			this.removeList();
			break;

		case 'page.remove.list':
			// 삭제된 페이지의 뷰 적용
			var a = value.pages;
			var cindex = this.selectedIndex;

			this.unselect(); // 팔수

			for (var i=a.length - 1; i >= 0; i--){
				var d = a[i];
				index = d.index;
	
				if (cindex >= 0 && cindex >= d.index)
					cindex--;

				item = this.children.splice(index, 1);
				if (item.length){
					uid = item[0].attr('lt-uid');
					d.uid = uid;
				}
			}

			if (cindex >= this.children.length)
				cindex = this.children.length - 1;
	
			this.pager.totalCount(this.children.length);
			this.updateViewSize();
			this.update(cindex >= 0 ? cindex : 'first');
	
			if (this.enabled() && this.length() == 0) this.notifyObservers('unselect');		
			break;

		case 'history.sync':
			// undo/redo에 대한 복원 처리
			switch(value.topic){
			case 'page':
				switch(value.cmd){
				case 'add':
					switch(value.docmd){
					case 'undo':
						this.unselect();

						for (var i=value.data.length - 1; i >= 0; i--){
							var d = value.data[i];
							var uid = d.source.uid;

							this.children.splice(d.index, 1);
							delete this.map[uid];
						}

						this.pager.totalCount(this.length());
						this.updateViewSize();
						this.pager.prepare();
			
						this.reload('nothing');

						this.notifyObservers('history.sync.end', value);
						break;

					case 'redo':
						this.unselect();

						var siz = value.data.length;
						for (var i=0; i < siz; i++){
							var d = value.data[i];
							this.insertListItem(d.source, d.index);

							this.listItemImage(d.index);
						}

						this.pager.totalCount(this.length());
						this.updateViewSize();
						this.pager.prepare();
			
						this.reload('nothing');

						this.notifyObservers('history.sync.end', value);
						break;
					}					
					break;
					
				case 'remove':
					switch(value.docmd){
					case 'undo':
						this.unselect();

						var siz = value.data.length;
						for (var i=0; i < siz; i++){
							var d = value.data[i];
							this.insertListItem(d.source, d.index);

							this.listItemImage(d.index);
						}

						this.pager.totalCount(this.length());
						this.updateViewSize();
						this.pager.prepare();

						this.reload('nothing');

						this.notifyObservers('history.sync.end', value);
						break;

					case 'redo':
						this.unselect();

						for (var i=value.data.length - 1; i >= 0; i--){
							var d = value.data[i];
							var uid = d.source.uid;

							this.children.splice(d.index, 1);
							delete this.map[uid];
						}

						this.pager.totalCount(this.length());
						this.updateViewSize();
						this.pager.prepare();

						this.reload('nothing');

						this.notifyObservers('history.sync.end', value);
						break;
					}
					break;
				}
				break;
			}
			break;
		}
	},

	//-----------------------------------------------------------
	// 유틸리티

	scrollIntoElement: function (e){
		var stop = this.listContainer.scrollTop();
		var etop = stop + e.position().top;
		var vsiz = etop + e.height();
		var svsiz = stop + this.listContainer.height();

		if (svsiz < vsiz || stop > etop)
			this.listContainer.scrollTop(vsiz - this.listContainer.height());
	},

	//-----------------------------------------------------------

	topic: function (e, topic){ return e.find('[lt-topic="'+topic+'"]'); },

	//-----------------------------------------------------------

	length: function () { return this.pages.length(); },

	startIndex: function () { return this.pager.startRow(); },
	inPage: function(index){ return this.pager.startRow() <= index && index < this.pager.startRow() + this.pager.lineCount(); },

	// 전체 선택이 체크되어 있는 지 여부
	checkedAll: function (){ return this.eCheckAll.is(':checked'); },

	//-----------------------------------------------------------

	loadable: function (page){ return page.status != AbPage.prototype.LOADED && page.loader; },
	enabled: function() { return !this.e.hasClass('hide'); },

	selected: function (uid){ return this.map[uid].hasClass('selected'); },

	//-----------------------------------------------------------
	// 목록 삭제 액션

	removeBookmarks: function(){
		var a = [], siz = this.renderedChildren.length;
		for (var i=0; i < siz; i++){
			var e = this.renderedChildren[i];
			var ce = this.topic(e, 'check');

			if (!ce.is(':checked'))
				continue;

			var index = e.index() + this.startIndex();
			a.push(index);
		}

		if (!a.length)
			return;

		var cindex = this.selectedIndex;

		this.unselect(); // 팔수
		
		var ua = [];
		for (var i=a.length - 1; i >= 0; i--){
			var idx = a[i];

			if (cindex >= 0 && cindex >= idx)
				cindex--;
	
			var item = this.children.splice(idx, 1);
			if (item.length){
				var uid = item[0].attr('lt-uid');
				ua.push(uid);
			}
		}

		if (cindex >= this.children.length)
			cindex = this.children.length - 1;

		this.pager.totalCount(this.children.length);
		this.updateViewSize();
		this.update(cindex >= 0 ? cindex : 'first');

		if (this.enabled() && this.length() == 0) this.notifyObservers('unselect');	

		this.notifyObservers('bookmark.remove.list', ua);
	},

	selectedPages: function(){
		var a = [], siz = this.renderedChildren.length;
		for (var i=0; i < siz; i++){
			var e = this.renderedChildren[i];
			var ce = this.topic(e, 'check');

			if (!ce.is(':checked'))
				continue;

			var index = e.index() + this.startIndex();
			a.push({ index: index });
		}

		if (!a.length)
			return a;

		for (var i=a.length - 1; i >= 0; i--){
			var d = a[i];
			var idx = d.index;

			var item = this.children[idx];
			if (item){
				var uid = item.attr('lt-uid');
				d.uid = uid;
			}
		}

		return a;
	},

	removeList: function(){
		var a = this.selectedPages();
		this.notifyObservers('page.remove.list', { pages: a });
	},

	removeListItem: function (uid){
		var item = this.map[uid];
		var index = -1;
		var e = this.renderedMap[uid];

		if (e){
			index = e.index() + this.startIndex();

			e.detach();

			var idx = $.inArray(e, this.renderedChildren);
			if (idx >= 0){
				this.renderedChildren.splice(idx, 1);
				this.renderedChecks.splice(idx, 1);
			}
			delete this.renderedMap[uid];
		}else
			index = this.pages.indexOf(uid);
		
		this.children.splice(index, 1);
		delete this.map[uid];
	
		if (this.selectedIndex >= 0){
			if (index == this.selectedIndex){
				var length = this.children.length;
				if (index >= length){
					this.selectedIndex = length - 1;
					return true;
				}
			}else if (index < this.selectedIndex)
				this.selectedIndex--;
		}
		return false;
	},

	//-----------------------------------------------------------
	// 이벤트 액션

	toggleAll: function (checked){
		var siz = this.renderedChecks.length;
		for (var i = 0; i < siz; i++){
			var e = this.renderedChecks[i];

			e.prop('checked', checked);
		}
	},

	changeView: function (value){
		if (value === 'all')
			value = -1;

		if (!AbCommon.isNumber(value)) value = parseInt(value);
		if (isNaN(value)) value = 0;

		this.viewSize = value;

		this.updateViewSize();
		this.update();
	},

	//-----------------------------------------------------------
	// 목록 아이템 네비게이션

	canPrev: function (){ var index = this.selectedIndex; if (index <= 0) return false; return true; },
	canNext: function(){ var index = this.selectedIndex; if (index < 0 || index+1 >= this.length()) return false; return true; },
	canGo: function(index){ return index >= 0 && index < this.length(); },

	prev: function (){
		if (!this.canPrev())
			return;

		var index = this.selectedIndex;

		index--;

		var e = this.children[index];
		var uid = e.attr('lt-uid');
		//var loaded = e.attr('lt-status') === 'loaded';
		var loaded = true;

		if (loaded){
			if (this.selecting.auto) this.notifyObservers('select', uid);
		}else
			this.paging(this.pager.page() - 1, 'last');
	},

	next: function (){
		if (!this.canNext())
			return;

		var index = this.selectedIndex;
			
		index++;
		var e = this.children[index];
		var uid = e.attr('lt-uid');
		//var loaded = e.attr('lt-status') === 'loaded';
		var loaded = true;

		if (loaded){
			if (this.selecting.auto) this.notifyObservers('select', uid);
		}else
			this.paging(this.pager.page() + 1, 'first');
	},

	go: function (index){
		if (!this.canGo(index))
			return false;

		var item = this.children[index];

		if (this.inPage(index)){
			if (this.selectedIndex != index){
				var e = this.children[index];
				var uid = e.attr('lt-uid');
				//var loaded = e.attr('lt-status') === 'loaded';
				var loaded = true;
		
				if (loaded){
					if (this.selecting.auto) this.notifyObservers('select', uid);
				}else
					this.reload(index);
			}
		}else{
			var page = this.pager.pageFromIndex(index);

			this.paging(page, index);
		}
		return true;
	},

	//-----------------------------------------------------------
	// 목록 아이템 선택

	unselect: function(){
		if (this.selectedIndex >= 0)
			this.children[this.selectedIndex].removeClass('selected');
		this.selectedIndex = -1;
	},

	select: function (value){
		if (!this.selecting.auto)
			return;

		var index = -1;
		if (AbCommon.isString(value)){
			index = this.pages.indexOf(value);
		}else{
			index = value;
		}

		if (this.selectedIndex != index)
			this.unselect();
		
		var page = this.pager.pageFromIndex(index);
		this.paging(page, 'nothing');

		if (index >= 0){
			var e = this.children[index];
			e.addClass('selected');

			this.scrollIntoElement(e);
		}

		this.selectedIndex = index;

		this.notifyObservers('selected', this.selectedIndex);
	},

	//-----------------------------------------------------------
	// 페이징

	// 목록 리로드, 같은 페이지를 다시 호출해야 할 떄
	reload: function (criterion){
		this.renderPageList(this.pager.page(), criterion);
	},

	// 페이지 이동할 때
	paging: function(page, criterion){
		if (this.pager.page() == page)
			return;

		this.renderPageList(page, criterion);
	},

	//-----------------------------------------------------------
	// 목록 삭제

	clear: function (){
		this.clearRendered();

		for (var p in this.map)
			delete this.map[p];

		this.children.splice(0, this.children.length);
	},

	// 렌더링 된 목록 아이템 삭제
	clearRendered: function(unselecting){
		if (!AbCommon.isBool(unselecting)) unselecting = true;

		if (unselecting)
			this.unselect();

		var siz = this.renderedChildren.length;
		for (var i=0; i < siz; i++)
			this.renderedChildren[i].detach();

		for (var p in this.renderedMap)
			delete this.renderedMap[p];

		this.renderedChecks.splice(0, this.renderedChecks.length);
		this.renderedChildren.splice(0, this.renderedChildren.length);
	},

	//-----------------------------------------------------------
	// 페이지 네비게이션

	createPager: function (){ return new AbGridPager({
		template: {
			pageGapTemplate: ''
		}
	}); },
	updateViewSize: function (){ this.pager.lineCount(this.viewSize < 0 ? this.pager.totalCount() : this.viewSize); },
	updatePageNavigation: function (){
		var html = this.pager.generate(function (name, value){
			switch(name){
			case 'block.first': return '<a lt-topic="link" lt-page="'+value+'" class="block first"></a>'; 
			case 'block.last': return '<a lt-topic="link" lt-page="'+value+'" class="block last"></a>'; 
			case 'block.prev': return '<a lt-topic="link" lt-page="'+value+'" class="block prev"></a>'; 
			case 'block.next': return '<a lt-topic="link" lt-page="'+value+'" class="block next"></a>'; 
			case 'page.current': return '<li class="curpage"><a>' + value + '</a></li>'; 
			case 'page': return '<li><a lt-topic="link" lt-page="'+value+'" class="page">' + value + '</a></li>';

			case 'navigation':
				return value.total <= 0 ?
					'' :
					value.html.first + value.html.prev + '<ol class="pages">' + value.html.pages + '</ol>' + value.html.next + value.html.last;
			}
		});

		this.ePagingArea.html(html);
	},

	// 목록 개수/뷰 개수가 수정된 경우 호출
	update: function(criterion){
		if (!AbCommon.isSetted(criterion)) criterion = 'first';
		var userSelecting = criterion !== 'nothing';
		if (criterion === 'current') criterion = this.selectedIndex;
		
		this.pager.reset();
		this.pager.prepare();
		this.pager.calculate();

		this.renderList({
			select: {
				unselecting: criterion === 'nothing' ? false : true,
				auto: userSelecting,
				relative: false,
				criterion: criterion
			}
		});
		this.updatePageNavigation();
	},
	
	//-----------------------------------------------------------
	// 리스트 렌더링

	renderPageList: function (page, criterion){
		if (!AbCommon.isSetted(criterion)) criterion = 'first';
		var userSelecting = criterion !== 'nothing';
		if (criterion === 'current') criterion = this.selectedIndex;

		this.pager.page(page);
		this.pager.calculate();

		this.renderList({
			select: {
				unselecting: criterion === 'nothing' ? false : true,
				auto: userSelecting,
				relative: false,
				criterion: criterion
			}
		});
		this.updatePageNavigation();
	},

	renderList: function (options){
		if (!options) options = {};
		var selectOption = options.select || {};

		var unselecting = selectOption.hasOwnProperty('unselecting') ? selectOption.unselecting : true;
		var autoSelecting = selectOption.hasOwnProperty('auto') ? selectOption.auto : true;
		var relative = selectOption.hasOwnProperty('relative') ? selectOption.relative : true;
		var criterion = selectOption.hasOwnProperty('criterion') ? selectOption.criterion : 'first';

		var cindex = -1;
		if (!unselecting)
			cindex = this.selectedIndex;

		this.clearRendered(unselecting);
		
		var start = this.startIndex();
		var end = start + this.pager.lineCount();
		if (end > this.children.length)
			end = this.children.length;

		var checked = this.checkedAll();
		var enabled = this.enabled();
		var visibleCount = 0, loadingCount = 0;
	
		for (var i=start, r = 0; i < end; i++, r++){
			var e = this.children[i];
			var page = this.pages.getById(e.attr('lt-uid'));

			if (!page) return;

			var selecting = false;
			if (autoSelecting && cindex < 0 && enabled){
				if ((criterion === 'first' && r == 0) || (criterion === 'last' && i + 1 == end) || (relative && criterion === r) || (!relative && criterion == i) )
					selecting = true;
			}

			if (this.loadable(page)){
				var data = { index: i, page: page };
				if (selecting && this.selecting.auto) data.select = true;

				loadingCount++;
				
				this.notifyObservers('request.load', data);
			}else if (selecting && this.selecting.auto){
				this.notifyObservers('select', page.uid);
			}

			var ce = this.topic(e, 'no');
			ce.text((i + 1) + '');

			ce = this.topic(e, 'check');
			ce.prop('checked', checked);

			this.renderedChecks.push(ce);
			this.renderedChildren.push(e);
			this.renderedMap[page.uid] = e;

			this.listContainer.append(e);
			
			visibleCount++;
		}
		
		this.notifyObservers('renderlist', {
			visible: visibleCount,
			loading: loadingCount,
		});
	},

	//-----------------------------------------------------------
	// 리스트 아이템 렌더링

	insertListItem: function(page,insertIndex){
		var index = this.children.length;
		var text = '';

		var e = this.template.children(':eq(0)').clone();
		var image = page.thumbnail();

		if (image)
			this.topic(e, 'image').attr('src', image.src);
		
		e.attr('lt-uid', page.uid);
		e.attr('lt-status', page.statusText());

		this.topic(e, 'no').text((index + 1) + '');
		this.topic(e, 'check').val(page.uid);
		this.topic(e, 'bookmark').bind('click', this.checkBookmarkHandler);

		e.bind('click', this.clickHandler);
		e.bind('dblclick', this.dblClickHandler);

		if (AbCommon.isNumber(insertIndex)){
			index = insertIndex;

			this.children.splice(index, 0, e);
		}else{
			this.children.push(e);
		}
		this.map[page.uid] = e;
		return index;
	},

	listItemImage: function (value){
		var item = null, page = null;
		var text = '';

		if (AbCommon.isNumber(value)){
			item = this.children[value];
			page = this.pages.get(value);
		}else{
			item = this.map[value];
			page = this.pages.getById(value);
		}

		var info = page.info();
		if (info && info.info)
			text = info.info.text;
		
		if (text == null || text == undefined) text = '';
		this.topic(item, 'text').text(text);

		item.attr('lt-status', page.statusText());

		var image = page.thumbnail();

		if (image)
			this.topic(item, 'image').attr('src', image.src);

		if (page.hasImageInfo()){
			this.topic(item, 'info').bind('click', this.checkInfoHandler);
		}else{
			this.topic(item, 'info').remove();
		}
	},
};
