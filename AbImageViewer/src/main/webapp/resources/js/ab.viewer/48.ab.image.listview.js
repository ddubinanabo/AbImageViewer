
//----------------------------------------------------------------------------------------------------------
// Notify Arguments 정의
//----------------------------------------------------------------------------------------------------------

/**
 * Notify (click) Arguments
 * @typedef {Object} AbImageListView.NotifyClickArgs
 * @property {String} uid {@link AbPage|페이지} UUID
 * @property {String} status 페이지 상태 (ready|loading|loaded|error)
 */

/**
 * Notify (page.remove.list) Arguments
 * @typedef {Object} AbImageListView.NotifyPageRemoveListArgs
 * @property {Array.<AbImageListView.CheckItemUID>} pages 아이템 UUID 정보 목록
 */

/**
 * Notify (renderlist) Arguments
 * @typedef {Object} AbImageListView.NotifyRenderListArgs
 * @property {Number} visible 렌더링 아이템 개수
 * @property {Number} loading 로드 요청 아이템 개수
 */

//----------------------------------------------------------------------------------------------------------
// 옵저버
//----------------------------------------------------------------------------------------------------------

/**
 * 리스트뷰 옵저버 리스너
 * @callback AbImageListView.ObserveListenFunction
 * @param {AbImageListView} sendor Notify한 객체
 * @param {String} topic 토픽
 * @param {String} value 값
 */

 /**
 * 리스트뷰 옵저버 리스너 객체
 * @typedef AbImageListView.ObserveListenObject
 * @property {AbImageListView.ObserveListenFunction} listViewNotify 리스너 메서드
 */

/**
 * 리스트뷰 옵저브 리스너
 * @typedef {(AbImageListView.ObserveListenFunction|AbImageListView.ObserveListenObject)}
 * AbImageListView.ObserveListener 
 */

//----------------------------------------------------------------------------------------------------------
// 기타
//----------------------------------------------------------------------------------------------------------

/**
 * 아이템 선택 방법 정보
 * @typedef {Object} AbImageListView.SelectMethodInfo
 * @property {Array.<String>} method 아이템 선택 방법 배열 (click, dblclick)
 * @property {Boolean} auto 자동 선택 여부 (목록 변경 시/페이지 이동 시 등등)
 */

//----------------------------------------------------------------------------------------------------------
// 이미지 리스트뷰
//----------------------------------------------------------------------------------------------------------

/*
- 목록 개수, 뷰 개수 변화 시
	- update() 호출

- 페이지 이동 시
	- paging() 호출

- 같은 페이지 재 호출 시
	- reload() 호출
*/

/**
 * 이미지 리스트뷰
 * <dl>
 * 	<dt>목록 개수, 뷰 개수 변화 시</dt><dd>{@link AbImageListView#update|update()} 호출</dd>
 * 	<dt>페이지 이동 시</dt><dd>{@link AbImageListView#paging|paging()} 호출</dd>
 * 	<dt>같은 페이지 재 호출 시</dt><dd>{@link AbImageListView#reload|reload()} 호출</dd>
 * </dl>
 * @class
 * @param {Object} [options] 옵션
 * @param {String} [options.name=list] 리스트뷰명
 * @param {String} [options.selector=#thumbnails] 리스트뷰 HTML 엘리먼트 선택자
 * @param {Boolean} [options.bookmark=false] 북마크 여부
 * @param {*} [options.token] 사용자 정의 데이터
 * @param {Number} [options.pageCount=4] 페이지 네비게이션의 개수
 * @param {String} [options.templateSelector=#list-template] 아이템 템플릿 선택자
 * @param {AbPageCollection} [options.pages] 페이지 목록
 * @param {Object} [options.selecting] 선택 옵션
 * @param {(String|Array.<String>)} [options.selecting.method=click] 선택 하는 방법 (click, dblclick)
 * <dl>입력 타입
 * 	<dt>문자열</dt><dd>"|"로 구분합니다. 예) click, dblclick, click|dblclick</dd>
 * 	<dt>문자열 배열</dt><dd>["click", "dblclick"] </dd>
 * </dl>
 * <dl>선택 방법
 * 	<dt>click</dt><dd>아이템 클릭 시 선택</dd>
 * 	<dt>dblclick</dt><dd>아이템 더블 클릭 시 선택</dd>
 * </dl>
 * @param {Boolean} [options.selecting.auto=true] 자동 선택 여부 (목록 변경 시/페이지 이동 시 등등)
 */
function AbImageListView(options){
	if (!options) options = {};
	var selectingOptions = options.selecting || {};

	/**
	 * 리스트뷰명
	 * @type {String}
	 */
	this.name = options.name || 'list';

	/**
	 * 리스트뷰 HTML 엘리먼트 선택자
	 * @type {String}
	 */
	this.selector = options.selector || '#thumbnails';
	
	/**
	 * 리스트뷰 HTML 엘리먼트 jQuery 객체
	 * @type {jQueryObject}
	 */
	this.e = $(this.selector);
	/**
	 * 컨테이너 HTML 엘리먼트 jQuery 객체
	 * @private
	 * @type {jQueryObject}
	 */
	this.listContainer = this.e.find('.adv-list [lt-topic="container"]');
	/**
	 * 전체 선택용 체크박스 HTML 엘리먼트 jQuery 객체
	 * @private
	 * @type {jQueryObject}
	 */
	this.eCheckAll = this.e.find('.head [lt-topic="all"]');
	/**
	 * 목록 스타일(페이지당 아이템 개수) 선택상자 HTML 엘리먼트 jQuery 객체
	 * @private
	 * @type {jQueryObject}
	 */
	this.eViewSize = this.e.find('.head [lt-topic="viewsize"]');
	/**
	 * 페이지 네비게이션 HTML 엘리먼트 jQuery 객체
	 * @private
	 * @type {jQueryObject}
	 */
	this.ePagingArea = this.e.find('.foot .paginate');
	
	//-----------------------------------------------------------

	/**
	 * 북마크 여부
	 * @type {Boolean}
	 */
	this.bookmark = options.hasOwnProperty('bookmark') ? options.bookmark : false;		// 북마크 모드
	/**
	 * 아이템 선택 방법 정보
	 * @type {AbImageListView.SelectMethodInfo}
	 */
	this.selecting = {
		method: AbCommon.isString(selectingOptions.method) ?
			selectingOptions.method.split(/\|/g)
			: AbCommon.isSetted(selectingOptions.method) && $.isArray(selectingOptions.method) ?
				selectingOptions.method : ['click'], // 선택 하는 방법, click, dblclick
		auto: AbCommon.isBool(selectingOptions.auto) ? selectingOptions.auto : true, // 자동 선택 여부(목록 변경 시/페이지 이동 시 등등), true, false
	};
	/**
	 * 사용자 정의 데이터
	 * @type {*}
	 */
	this.token = options.token; // 사용자 정의 데이터
	
	//-----------------------------------------------------------
	// 전체 아이템 목록

	/**
	 * 아이템 맵
	 * <p>* 필드명이 {@link AbPage|페이지} UUID, 필드값이 아이템 HTML 엘리먼트 jQuery 객체인 객체입니다.
	 * @private
	 * @type {Object.<String, jQueryObject>}
	 */
	this.map = {};
	/**
	 * 아이템 목록
	 * @private
	 * @type {Array.<jQueryObject>}
	 */
	this.children = [];
	
	//-----------------------------------------------------------
	// 화면에 표시된 아이템 목록

	/**
	 * 화면에 표시된 아이템 맵
	 * <p>* 필드명이 {@link AbPage|페이지} UUID, 필드값이 아이템 HTML 엘리먼트 jQuery 객체인 객체입니다.
	 * @private
	 * @type {Object.<String, jQueryObject>}
	 */
	this.renderedMap = {};
	/**
	 * 화면에 표시된 아이템의 체크상자 목록
	 * @private
	 * @type {Array.<jQueryObject>}
	 */
	this.renderedChecks = [];
	/**
	 * 화면에 표시된 아이템 목록
	 * @private
	 * @type {Array.<jQueryObject>}
	 */
	this.renderedChildren = [];

	/**
	 * 페이지 네비게이션
	 * @type {AbGridPager}
	 */
	this.pager = this.createPager();
	this.pager.pageCount(!options.pageCount || options.pageCount < 1 ? 4 : options.pageCount); // page navigation의 개수
	
	//-----------------------------------------------------------

	/**
	 * 아이템 템플릿 선택자
	 * @type {String}
	 */
	this.templateSelector = options.templateSelector || '#list-template';
	/**
	 * 아이템 템플릿 HTML 엘리먼트 jQuery 객체
	 * @type {jQueryObject}
	 */
	this.template = $(this.templateSelector);
	
	//-----------------------------------------------------------

	/**
	 * 옵저브 리스너 목록
	 * @type {Array.<AbImageListView.ObserveListener>}
	 */
	this.observers = [];

	//-----------------------------------------------------------

	/**
	 * 페이지당 아이템 개수
	 */
	this.viewSize = this.eViewSize.val();
	if (this.viewSize > 0)
		this.pager.lineCount(this.viewSize);

	/**
	 * 선택된 아이템의 인덱스
	 */
	this.selectedIndex = -1;
	/**
	 * 페이지 목록
	 * <p>* 참조 객체입니다.
	 * @type {Array.<AbPageCollection>}
	 */
	this.pages = options.pages;

	//-----------------------------------------------------------

	/**
	 * click 이벤트를 처리합니다.
	 * @private
	 * @function
	 */
	this.clickHandler = function(event){
		var e = $(event.currentTarget);
		var target = $(event.target);

		var selectable = $.inArray('click', this.selecting.method) >= 0;

		var status = e.attr('lt-status');
		var uid = e.attr('lt-uid');
		
		this.notifyObservers('click', { uid: uid, status: status });
		
		if (e.hasClass('selected') || target.hasClass('no') || target.hasClass('display') || target.hasClass('text') || target.hasClass('checkmark') || target.hasClass('info') || (event.target && event.target.tagName.toLowerCase() == 'input')){
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

	/**
	 * dblclick 이벤트를 처리합니다.
	 * @private
	 * @function
	 */
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

	/**
	 * 북마크 체크상자의 click 이벤트를 처리합니다.
	 * @private
	 * @function
	 */
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

	/**
	 * 이미지 정보 버튼의 click 이벤트를 처리합니다.
	 * @private
	 * @function
	 */
	this.checkInfoHandler = function(event){
		var e = $(event.currentTarget);
		var ecover = e.parents('[lt-topic="cover"]');
		var uid = ecover.attr('lt-uid');

		this.notifyObservers('info', uid);
	}.bind(this);

	//-----------------------------------------------------------

	/**
	 * 전체선택 체크상자의 click 이벤트를 처리합니다.
	 * @private
	 * @function
	 */
	this.eCheckAll.click(function (event){
		var e = $(event.currentTarget);
		
		this.toggleAll(e.is(':checked'));
	}.bind(this));

	/**
	 * 목록 스타일(페이지당 아이템 개수) 선택상자의 change 이벤트를 처리합니다.
	 * @private
	 * @function
	 */
	this.eViewSize.change(function (event){
		var e = $(event.currentTarget);

		this.changeView(e.val());
	}.bind(this));

	/**
	 * 페이지 네비게이션의 click 이벤트를 처리합니다.
	 * @private
	 * @function
	 */
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

	/**
	 * 옵저버 리스너를 등록합니다.
	 * @param {AbImageListView.ObserveListener} observer 리스너
	 */
	observe: function(observer){ this.observers.push(observer); },
	/**
	 * 옵저버 리스너를 제거합니다.
	 * @param {AbImageListView.ObserveListener} observer 리스너
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
	 * 이미지 뷰어에서 Notify한 내용을 처리합니다.
	 * @param {AbImageViewer} sender Notify한 객체
	 * @param {String} topic 토픽
	 * @param {*} value 값
	 */
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
			if (item){
				this.topic(item, 'image').attr('src', value.data);
				
				var page = this.pages.getById(value.uid);
				if (page){
					if (page.hasShapes()){
						this.topic(item, 'annotation').show();
					}else{
						this.topic(item, 'annotation').hide();
					}		
				}
			}
			break;
		}
	},

	/**
	 * 이미지 뷰어에서 Notify한 내용을 북마크 모드에서 처리합니다.
	 * @param {AbImageViewer} sender Notify한 객체
	 * @param {String} topic 토픽
	 * @param {*} value 값
	 */
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
			break;
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

	/**
	 * 이미지 뷰어에서 Notify한 내용을 처리합니다.
	 * @param {AbImageViewer} sender Notify한 객체
	 * @param {String} topic 토픽
	 * @param {*} value 값
	 */
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

	/**
	 * 엘리먼트로 스크롤 합니다.
	 * @param {jQueryObject} e HTML 엘리먼트 jQuery 객체
	 */
	scrollIntoElement: function (e){
		var stop = this.listContainer.scrollTop();
		var etop = stop + e.position().top;
		var vsiz = etop + e.height();
		var svsiz = stop + this.listContainer.height();

		if (svsiz < vsiz || stop > etop)
			this.listContainer.scrollTop(vsiz - this.listContainer.height());
	},

	//-----------------------------------------------------------

	/**
	 * 토픽으로 엘리먼트를 가져옵니다.
	 * @param {jQueryObject} e HTML 엘리먼트 jQuery 객체
	 * @param {String} topic 토픽
	 * @return {jQueryObject} e HTML 엘리먼트 jQuery 객체
	 */
	topic: function (e, topic){ return e.find('[lt-topic="'+topic+'"]'); },

	//-----------------------------------------------------------

	/**
	 * 페이지 목록의 개수입니다.
	 * @type {Number}
	 */
	length: function () { return this.pages.length(); },

	/**
	 * 화면에 표시되는 첫 아이템의 인덱스를 가져옵니다.
	 * @type {Number}
	 */
	startIndex: function () { return this.pager.startRow(); },
	/**
	 * 인덱스가 화면에 표시되는 아이템인지 확인합니다.
	 * @param {Number} index 
	 * @return {Boolean}
	 */
	inPage: function(index){ return this.pager.startRow() <= index && index < this.pager.startRow() + this.pager.lineCount(); },

	// 전체 선택이 체크되어 있는 지 여부
	/**
	 * 전체 선택이 체크되어 있는 지 확인합니다.
	 * @return {Boolean}
	 */
	checkedAll: function (){ return this.eCheckAll.is(':checked'); },

	//-----------------------------------------------------------

	/**
	 * 이미지를 로드할 수 있는 지 확인합니다.
	 * @param {AbPage} page 페이지 인스턴스
	 * @return {Boolean}
	 */
	loadable: function (page){ return page.status != AbPage.prototype.LOADED && page.loader; },
	/**
	 * 리스트뷰가 활성화되었는 지 확인합니다.
	 * @return {Boolean}
	 */
	enabled: function() { return !this.e.hasClass('hide'); },

	/**
	 * {@link AbPage|페이지} UUID를 가진 아이템이 선택되어 있는 지 확인합니다.
	 * @param {String} uid {@link AbPage|페이지} UUID
	 * @return {Boolean}
	 */
	selected: function (uid){ return this.map[uid].hasClass('selected'); },

	//-----------------------------------------------------------
	// 목록 삭제 액션

	/**
	 * 북마크 모드 리스트뷰의 북마크 체크 해제 작업을 수행합니다.
	 * <p>* 완료 후 unselect, bookmark.remove.list가 순착적으로 Notify 됩니다.
	 * @private
	 */
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

		this.unselect(); // 필수
		
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

	/**
	 * 아이템 UUID 정보
	 * @typedef {Object} AbImageListView.CheckItemUID
	 * @property {Number} index 아이템 인덱스
	 * @property {String} uid {@link AbPage|페이지} UUID
	 */

	/**
	 * 체크된 아이템들의 UUID 목록을 가져옵니다.
	 * @return {Array.<AbImageListView.CheckItemUID>} 아이템 UUID 정보 목록
	 */
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

	/**
	 * 체크된 아이템 개수를 가져옵니다.
	 * @return {Number} 체크된 아이템 개수
	 */
	numSelectedPages: function (){
		var siz = this.renderedChildren.length;
		var nums = 0;
		for (var i=0; i < siz; i++){
			var e = this.renderedChildren[i];
			var ce = this.topic(e, 'check');

			if (!ce.is(':checked'))
				continue;

			nums++;
		}
		return nums;
	},

	/**
	 * 체크된 아이템들을 제거합니다.
	 * <p>* 완료 후 page.remove.list가 Notify 됩니다.
	 */
	removeList: function(){
		var a = this.selectedPages();
		this.notifyObservers('page.remove.list', { pages: a });
	},

	/**
	 * {@link AbPage|페이지} UUID로 아이템을 제거합니다.
	 * @param {String} uid {@link AbPage|페이지} UUID
	 * @return {Boolean} 제거 여부
	 */
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

	/**
	 * 화면에 표시된 아이템들을 체크 합니다.
	 * @param {Boolean} checked 체크 여부
	 */
	toggleAll: function (checked){
		var siz = this.renderedChecks.length;
		for (var i = 0; i < siz; i++){
			var e = this.renderedChecks[i];

			e.prop('checked', checked);
		}
	},

	/**
	 * 화면에 표시되는 아이템 개수를 변경합니다.
	 * @param {Number} value 아이템 개수
	 */
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

	/**
	 * 이전 페이지로 이동할 수 있는 지 확인합니다.
	 * @type {Boolean}
	 */
	canPrev: function (){ var index = this.selectedIndex; if (index <= 0) return false; return true; },
	/**
	 * 다음 페이지로 이동할 수 있는 지 확인합니다.
	 * @type {Boolean}
	 */
	canNext: function(){ var index = this.selectedIndex; if (index < 0 || index+1 >= this.length()) return false; return true; },
	/**
	 * 페이지 인덱스로 이동할 수 있는 지 확인합니다.
	 * @param {Number} index 페이지 인덱스
	 * @return {Boolean}
	 */
	canGo: function(index){ return index >= 0 && index < this.length(); },

	/**
	 * 이전 페이지로 이동합니다.
	 * <p>* 완료 후 select가 Notify 됩니다.
	 */
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

	/**
	 * 다음 페이지로 이동합니다.
	 * <p>* 완료 후 select가 Notify 됩니다.
	 */
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

	/**
	 * 페이지 인덱스로 이동합니다.
	 * <p>* 완료 후 select가 Notify 됩니다.
	 * @param {Number} index 페이지 인덱스
	 * @return {Boolean} 이동 여부
	 */
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

	/**
	 * 선택된 아이템을 선택 해제 합니다.
	 */
	unselect: function(){
		if (this.selectedIndex >= 0)
			this.children[this.selectedIndex].removeClass('selected');
		this.selectedIndex = -1;
	},

	/**
	 * 아이템을 선택합니다.
	 * <p>* 완료 후 selected가 Notify 됩니다.
	 * @param {(String|Number)} value 문자열이면 {@link AbPage|페이지} UUID, 숫자형이면 페이지 인덱스입니다.
	 */
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
	/**
	 * 아이템 목록을 갱신합니다.
	 * @private
	 * @param {(String|Number)} [criterion] (current|nothing|first) 또는 아이템 인덱스
	 */
	reload: function (criterion){
		this.renderPageList(this.pager.page(), criterion);
	},

	// 페이지 이동할 때
	/**
	 * 페이지를 이동합니다.
	 * @private
	 * @param {Number} page 페이지 인덱스
	 * @param {(String|Number)} [criterion] (current|nothing|first) 또는 아이템 인덱스
	 */
	paging: function(page, criterion){
		if (this.pager.page() == page)
			return;

		this.renderPageList(page, criterion);
	},

	//-----------------------------------------------------------
	// 목록 삭제

	/**
	 * 모든 아이템들을 제거합니다.
	 */
	clear: function (){
		this.clearRendered();

		for (var p in this.map)
			delete this.map[p];

		this.children.splice(0, this.children.length);
	},

	// 렌더링 된 목록 아이템 삭제
	/**
	 * 화면에 표시된 아이템들을 제거합니다.
	 * @private
	 * @param {Boolean} [unselecting=true] 선택해제 여부
	 */
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

	/**
	 * 페이지 네비게이션을 생성합니다.
	 * @private
	 * @return {AbGridPager}
	 */
	createPager: function (){ return new AbGridPager({
		template: {
			pageGapTemplate: ''
		}
	}); },

	/**
	 * 변경된 아이템 개수를 네비게이션에 반영합니다.
	 * @private
	 */
	updateViewSize: function (){ this.pager.lineCount(this.viewSize < 0 ? this.pager.totalCount() : this.viewSize); },
	/**
	 * 페이지 네비게이션 화면을 갱신합니다.
	 * @private
	 */
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
	/**
	 * 페이지 네비게이션을 갱신합니다.
	 * <p>* 목록의 아이템 개수, 화면에 표시되는 아이템 개수가 변경된 경우 사용합니다.
	 * @private
	 * @param {(String|Number)} [criterion] (current|nothing|first) 또는 아이템 인덱스
	 */
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

	/**
	 * 화면에 표시되는 아이템 목록과 페이지 네비게이션을 렌더링합니다.
	 * @private
	 * @param {Number} page 페이지 인덱스
	 * @param {(String|Number)} [criterion] (current|nothing|first) 또는 아이템 인덱스
	 */
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

	/**
	 * 화면에 표시되는 아이템 목록을 렌더링합니다.
	 * <p>* 로드가 필요한 아이템이 있으면 request.load가 Notify 됩니다.
	 * <p>* 렌더링 후 renderlist가 Notify 됩니다.
	 * @private
	 * @param {Object} [options] 렌더링 옵션
	 * @param {Object} [options.select] 아이템 선택 옵션
	 * @param {Object} [options.select.unselecting=true] 기존 선택된 아이템을 선택 해제할 지 여부
	 * @param {Object} [options.select.auto=true] 자동 선택 여부
	 * @param {Object} [options.select.relative=true] criterion이 아이템 인덱스인 경우, 인덱스가 화면의 첫 아이템 부터인지 여부
	 * @param {(String|Number)} [options.select.criterion=first] (current|nothing|first) 또는 아이템 인덱스
	 */
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

	/**
	 * 아이템을 렌더링하고, 목록에 추가합니다.
	 * <p>* children과 map에 추가됩니다.
	 * @private
	 * @param {AbPage} page 페이지 인스턴스
	 * @param {Number} [insertIndex] 삽입할 위치
	 */
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

	/**
	 * 아이템을 갱신합니다.
	 * @private
	 * @param {(String|Number)} value 문자열이면 {@link AbPage|페이지} UUID, 숫자형이면 아이템 인덱스입니다.
	 */
	listItemImage: function (value){
		var item = null, page = null;
		var name = '', text = '';

		if (AbCommon.isNumber(value)){
			item = this.children[value];
			page = this.pages.get(value);
		}else{
			item = this.map[value];
			page = this.pages.getById(value);
		}

		var info = page.info();
		if (info){
			if (info.originMeta) info = info.originMeta;

			name = info.name;
			text = info.text;
		}
		
		if (text == null || text == undefined) text = name;
		if (text == null || text == undefined) text = '';
		
		this.topic(item, 'text').text(text);

		item.attr('lt-status', page.statusText());

		var image = page.thumbnail();

		if (image)
			this.topic(item, 'image').attr('src', image.src);

		if (page.hasShapes()){
			this.topic(item, 'annotation').show();
		}else{
			this.topic(item, 'annotation').hide();
		}

		if (page.hasImageInfo()){
			this.topic(item, 'info').bind('click', this.checkInfoHandler);
		}else{
			this.topic(item, 'info').remove();
		}
	},
};
