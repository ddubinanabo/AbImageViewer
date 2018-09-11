
function AbImageViewer$$doPrint(){
	setTimeout(function (){
		var eloading = $('#print-loading');
		eloading.hide();
	
		var eframe = $('#print-frame');
		var doc = AbCommon.contentDocument(eframe);
		if (doc){
			if (doc.execCommand('print') !== false)
				return;
		}
	
		var win = AbCommon.contentWindow(eframe);
		if (win){
			win.print();
		}
	}, 100);
}

function AbImageViewer$$endPrint(id){
	var func = function (){
		var id = arguments.callee.id;
		var removeUrl = AbImageViewer.prototype.URLS.PRINT.REMOVE;
		
		if (id){
			AbCommon.ajax({
				url: removeUrl,
				data: {
					id: id
				},
			});
		}
	};
	func.id = id;
	
	setTimeout(func, 500);
}

//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

function AbImageViewer(options){
	if (!options) options = {};
	var styleOptions = options.style || {};

	//-----------------------------------------------------------

	this.margin = options.margin || null;
	
	//-----------------------------------------------------------

	this.observers = [];
	this.listeners = {};

	//-----------------------------------------------------------
	// 마스킹 도형 추가

	if (!AbViewerEngine.prototype.SHAPE_TABLE['masking.rectangle'])
		AbViewerEngine.prototype.SHAPE_TABLE['masking.rectangle'] = this.createMaskingShape('rectangle');
	
	if (!AbViewerEngine.prototype.SHAPE_TABLE['masking.ellipse'])
		AbViewerEngine.prototype.SHAPE_TABLE['masking.ellipse'] = this.createMaskingShape('ellipse');

	//-----------------------------------------------------------

	this.history = new AbHistory();

	//-----------------------------------------------------------

	this.listType = 'pages'; // 현재 이미지 목록 타입 (pages/bookmarks)
	this.$showListViewPopup = false; // 모아보기 여부

	//-----------------------------------------------------------
	
	this.animatingEngine = AbCommon.isBool(options.animate) ? options.animate: true;

	//-----------------------------------------------------------
	// 요청 인자
	//-----------------------------------------------------------
	// openImages() 메서드에 의해 세팅됨.
	
	this._requestParam = null;

	//-----------------------------------------------------------

	this.listPopupStyle = styleOptions.listPopup || 'default'; // default (기본보기와 동일), readonly (읽기 전용)

	//-----------------------------------------------------------

	this.thumbnailGenerator = new AbThumbnailGenerator();

	this.images = new AbPageCollection();
	this.bookmarks = new AbPageCollection();

	this.imageListView = null;
	this.bookmarkListViewView = null;

	// 현재 이미지 리스트뷰
	this.listView = null;

	this.styler = null;
	this.toolbar = null;

	this.waterMark = options.waterMark && options.waterMark instanceof AbWaterMark ? options.waterMark : new AbWaterMark();
	this.waterMark.observe(this);

	this.engine = new AbViewerEngine({
		pages: this.images,
		history: this.history,
		margin: this.margin,
		waterMark: this.waterMark,
	});
};
	
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

AbImageViewer.prototype = {
	constructor: AbImageViewer,

	//-----------------------------------------------------------
	
	SPLIT_DATA_SIZE: 30720, // 30KB
	
	PARALLELS: 3, // 이미지 전송 시 병렬 개수
	
	URLS: {
		OPEN: 'http://localhost:8084/wiv/api/images',
		
		SAVE: {
			ALLOC: 'http://localhost:8084/wiv/api/alloc',
			MODIFY: 'http://localhost:8084/wiv/api/modify-prepare',
			
			IMAGE: 'http://localhost:8084/wiv/api/save-image',
			REMOVE: 'http://localhost:8084/wiv/api/remove',
			
			COMPLETED: 'http://localhost:8084/wiv/api/save-completed',
		},
		
		PRINT: {
			ALLOC: 'http://localhost:8084/wiv/api/print-support/alloc',
			IMAGE: 'http://localhost:8084/wiv/api/print-support/save',
			REMOVE: 'http://localhost:8084/wiv/api/print-support/remove',
			
			DOWNLOAD: 'http://localhost:8084/wiv/print-support/img',
		},
	},
	
	// 이미지 저장 작업 목록
	IMAGE_TYPES: [ 'image', 'image-source', 'image-result', 'thumb' ],

	//-----------------------------------------------------------

	install: function(){
		var promiseFunc = function (resolve, reject){
			
			try
			{
				this.styler = new AbShapeStyler();
				this.styler.observe(this);

				//-----------------------------------------------------------

				this.toolbar = new AbToolbar();
				this.toolbar.observe(this);
				this.toolbar.groupObserve(this);

				//-----------------------------------------------------------
				// 기본보기
				//-----------------------------------------------------------

				// 이미지 목록
				this.imageListView = new AbImageListView({
					name: 'pages',
					pages: this.images,

					selector: '#thumbnails',
				});
				this.imageListView.observe(this);
				this.observe(this.imageListView);
			
				// 북마크 목록
				this.bookmarkListView = new AbImageListView({
					name: 'bookmarks',
					pages: this.bookmarks,

					bookmark: true,

					selector: '#bookmarks',
				});
				this.bookmarkListView.observe(this);
				this.observe(this.bookmarkListView);

				//-----------------------------------------------------------
				// 모아보기
				//-----------------------------------------------------------

				// 이미지 목록
				this.popupImageListView = new AbImageListView({
					name: 'pages',
					pages: this.images,

					selector: '#thumbnails-popup',

					selecting: {
						method: this.listPopupStyle === 'readonly' ? 'dblclick' : 'click|dblclick',
						auto: this.listPopupStyle === 'readonly' ? false : true,
					},
					token: 'popup',

					pageCount: 10,
				});
				this.popupImageListView.observe(this);
				this.observe(this.popupImageListView);
			
				// 북마크 목록
				this.popupBookmarkListView = new AbImageListView({
					name: 'bookmarks',
					pages: this.bookmarks,

					bookmark: true,

					selector: '#bookmarks-popup',
					selecting: {
						method: this.listPopupStyle === 'readonly' ? 'dblclick' : 'click|dblclick',
						auto: this.listPopupStyle === 'readonly' ? false : true,
					},
					token: 'popup',

					pageCount: 10,
				});
				this.popupBookmarkListView.observe(this);
				this.observe(this.popupBookmarkListView);

				//-----------------------------------------------------------

				this.updateListType();

				//-----------------------------------------------------------
			
				this.engine.install(function(){
					this.engine.observe('all', this);

					//-----------------------------------------------------------

					this.sync();

					//-----------------------------------------------------------

					this.engine.attachEvents();
					
					if (this.animatingEngine)
						this.engine.animate();

					//-----------------------------------------------------------
					
					resolve(true);
					
				}.bind(this));
			}
			catch (e)
			{
				reject(e);
			}
		}.bind(this);
		
		return new Promise(promiseFunc)
			.then(function (){
				return true;
			}.bind(this));
	},
	
//	prepareInsideIcons: function (){
//		try
//		{
//			var promises = [];
//			for (var p in AbIcons){
//				if (AbIcons.hasOwnProperty(p) && AbIcons[p].data){
//					var d = AbIcons[p];
//					
//					var promise = AbCommon.loadImage(d.data);
//					promises.push(promise);
//				}
//			}
//		}
//		catch (e)
//		{
//			return Promise.reject(e);
//		}
//		
//		if (promises.length)
//			return Promise.all(promises);
//		return Promise.resolve(true);
//	},

	updateListType: function(){
		var imageView = this.imageListView, bookmarkView = this.bookmarkListView;

		if (this.$showListViewPopup){
			imageView = this.popupImageListView;
			bookmarkView = this.popupBookmarkListView;
		}

		switch (this.listType){
		case 'pages':
			this.listView = imageView;
			break;

		case 'bookmarks':
			this.listView = bookmarkView;
			break;
		}
	},

	//-----------------------------------------------------------

	createMaskingShape: function(originalName){

		var templateShape = AbViewerEngine.prototype.SHAPE_TABLE[originalName];
		var shape = AbCommon.cloneShape(templateShape);

		$.extend(shape,{
			name: 'masking.' + originalName,
			type: 'masking',

			style: {
				color: 'black',
			},

			styleDesc: function(){
				return {
					descs: [
						{ name: 'color', text: '채우기색상', style: 'color', alpha: false, notset: false },
					],
				};	
			},
		});

		return shape;
	},

	//-----------------------------------------------------------

	observe: function(observer){ this.observers.push(observer); },
	stopObserve: function(observer){
		var idx = this.observers.indexOf(observer);
		if (idx >= 0) this.observers.splice(idx, 1);
	},
	
	notifyObservers: function(topic, value, element){
		setTimeout(function(){
			var len = this.observers.length;
			for (var i=0; i < len; i++){
				var o = this.observers[i];

				if (typeof o == 'function')
					o(this, topic, value, element);
				else if (typeof o.notify == 'function')
					o.notify(this, topic, value, element);
		}}.bind(this), 0);
	},

	//-----------------------------------------------------------

	drawableWaterMark: function(){ return this.waterMark && this.waterMark.drawable(); },

	//-----------------------------------------------------------

	updatePagesNotifyObservers: function(){
		this.notifyObservers('pages', this.images.length());
		this.toolbar.set('page.total', this.listView.pages.length(), false);
	},

	//-----------------------------------------------------------

	sync: function(){
		this.toolbar.forEach(function(topic, value){
			switch (topic){
			case 'mode':
				this.engine.engineMode = value ? 'edit' : 'view';
				this.showEditControls(value);
				break;
			case 'fit.horiz': case 'fit.vert': case 'fit.in':
				this.engine.fitTo = topic.replace('fit.', '');
				break;
			}
		}.bind(this));

		this.enableToolbarTopics();
	},

	enableToolbarTopics: function(){
		var topics = [
			'file.save.image',
			'file.save.annotation',
			'send.server',
			'page.print',
			'print',
			'zoom.in',
			'zoom.out',

			'zindex.front',
			'zindex.forward',
			'zindex.backward',
			'zindex.back',

			'fit.horiz',
			'fit.vert',
			'fit.in',
			'page.rotate.ccw',
			'page.rotate.cw',
			'page.rotate.180',
			'mode',
			'show.shapes',
			'clear.shapes',
			'page.scale',

			'annotation.cursor',
			'annotation.rectangle',
			'annotation.ellipse',
			'annotation.line',
			'annotation.arrow',
			'annotation.pen',
			'annotation.highlightpen',
			'annotation.textbox',
			'annotation.checker',
			
			'masking.rectangle',
			'masking.ellipse'
		];

		var page = this.engine.currentPage;
		var editable = this.engine.currentPage && this.engine.editable();

		this.toolbar.enableTopic(topics, editable);

		var pageTopics = ['page.prev', 'page.next', 'page.no','page.remove'];

		editable = this.engine.pages.length() > 0;


		this.toolbar.enableTopic(pageTopics, editable);
	},

	//-----------------------------------------------------------

	waterMarkNotify: function(sender, topic, value){
		switch(topic){
		case 'error':
			this.exec(function(){
				AbMsgBox.error('[WATERMARK] ' + value);
			});
			break;
		}
	},

	//-----------------------------------------------------------

	toolbarNotify: function (sender, topic, value){
		//console.log('[VIEWER][Toolbar][Topic]['+ topic + '] ' + value);

		switch(topic){
		case 'file.open': this.openLocalFile(); break;
		case 'file.save.image': this.saveToLocalImage(); break;
		case 'file.save.annotation': this.saveToLocalText(); break;

		case 'send.server': this.sendToServer(); break;

		case 'page.remove': this.removePage(); break;

		case 'page.print': this.printPage(); break;
		case 'print': this.printAllPages(); break;

		case 'zoom.in': this.zoom('in'); break;
		case 'zoom.out': this.zoom('out'); break;

		case 'zindex.front': this.engine.execCommand('z-index', 'top'); break;
		case 'zindex.forward': this.engine.execCommand('z-index', 'up'); break;
		case 'zindex.backward': this.engine.execCommand('z-index', 'down'); break;
		case 'zindex.back': this.engine.execCommand('z-index', 'bottom'); break;
		case 'fit.horiz':
		case 'fit.vert':
		case 'fit.in':
			this.engine.fit(topic.replace('fit.', ''));
			break;
		
		case 'page.rotate.ccw': this.engine.rotate(AbRotate.CCW,AbRotate.DEG_90); break;
		case 'page.rotate.cw': this.engine.rotate(AbRotate.CW,AbRotate.DEG_90); break;
		case 'page.rotate.180': this.engine.rotate(AbRotate.CW,AbRotate.DEG_180); break;

		case 'mode':
			this.engine.mode(value ? 'edit' : 'view');
			this.showEditControls(value);
			break;
		case 'show.shapes':
			this.engine.showShapes(value);
			break;

		case 'clear.shapes': this.clearShapes(); break;
			
		case 'page.prev': this.prevPage(); break;
		case 'page.next': this.nextPage(); break;
		case 'page.no': this.page(value); break;

		case 'page.scale':
			switch (value){
			case 'fit.in': case 'fit.horiz': case 'fit.vert':
				this.engine.fit(value.replace('fit.', ''));
				break;
			default:
				if (value.indexOf('%') >= 0){
					var scale = parseFloat(value.replace('%', ''));
					this.engine.scale(scale / 100);
				}
			}
			break;

		case 'pages': case 'bookmarks':
			this.toggleListView(topic);
			break;

		case 'annotation.cursor': break;
		case 'annotation.rectangle':
		case 'annotation.ellipse':
		case 'annotation.line':
		case 'annotation.arrow':
		case 'annotation.pen':
		case 'annotation.highlightpen':
		case 'annotation.textbox':
		case 'annotation.checker':
			if (!this.engine.editable()){
				sender.set('annotation.cursor', true);
				break;
			}

			this.engine.exec(function(){
				this.addShape(topic.replace('annotation.',''));
			});
			break;
		case 'masking.rectangle':
		case 'masking.ellipse':
			if (!this.engine.editable()){
				sender.set('annotation.cursor', true);
				break;
			}
			this.engine.addShape(topic);
			break;
		case 'thumb-popup.open':
			this.showListViewPopup(true);
			break;
		case 'thumb-popup.pages':
		case 'thumb-popup.bookmarks':
			if (this.listPopupStyle === 'readonly')
				this.toggleListView(topic, false);
			else
				this.toggleListView(topic);
			break;
		case 'thumb-popup.close':
			this.showListViewPopup(false);
			break;
		}
	},

	toolbarGroupNotify: function (sender, group, value){
		//console.log('[VIEWER][Toolbar][Group]['+ group + '] ' + value);

		switch(group){
		case 'left':
			this.showimageListView(value);
			break;
		case 'draw':
			sender.set('annotation.cursor', true);
			break;
		}
	},

	listViewNotify: function(sender, topic, value){
		//console.log('[VIEWER][ListView]['+sender.name+']['+ topic + '] ' + value);

		var page = null, index = -1;
		switch(topic){
		case 'info':
			var page = this.images.getById(value);
			var rd = AbImageInfoRenderer.render(page);
			if (rd){
				AbMsgBox.open({
					title: rd.title,
					textHtml: rd.html,
				});	
			}
			break;
		case 'request.load':
			this.loadPage(value);
			break;
		case 'renderlist':
			// 인터페이스를 위한 이벤트 발생
			this.trigger('renderlist', {
				name: sender.name,
				token: sender.token,
				visible: value.visible,
				loading: value.loading,
			});
			break;
		case 'click':
			page = this.images.getById(value.uid);
			index = this.images.indexOf(page);
			
			// 인터페이스를 위한 이벤트 발생
			this.trigger('click', {
				name: sender.name,
				token: sender.token,
				index: index,
				uid: value.uid,
				status: value.status
			});
			break;
		case 'select':
			page = this.images.getById(value);
			index = this.images.indexOf(page);
			
			// 인터페이스를 위한 이벤트 발생
			this.trigger('select', {
				name: sender.name,
				token: sender.token,
				index: index,
				uid: value,
			});
			
			this.engine.selectPage(index);
			break;
		case 'dblclick':
			if (sender.token === 'popup'){
				if (this.listPopupStyle === 'readonly'){
					this.showListViewPopup(false);
					var collection = this.images;

					page = collection.getById(value);
					index = collection.indexOf(page);

					this.exec(function (){
						this.engine.selectPage(index);
					});
				}else{
					this.showListViewPopup(false);
				}
			}
			break;
		case 'selected':
			this.toolbar.set('page.no', value + 1, false);
			break;
		case 'unselect':
			this.engine.unselectPage();
			this.toolbar.set('page.no', 0, false);
			break;
		case 'bookmark.add':
			page = this.images.getById(value);
			this.bookmarks.push(page);

			this.notifyObservers(topic, value);
			break;
		case 'bookmark.remove':
			this.bookmarks.removeById(value);

			this.notifyObservers(topic, value);

			if (sender.bookmark)
				this.toolbar.set('page.total', sender.pages.length());

			break;

		case 'bookmark.remove.list':
			for (var i=value.length - 1; i>=0; i--)
				this.bookmarks.removeById(value[i]);

			this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
			this.toolbar.set('page.total', this.listView.pages.length(), false);
				
			if (!this.bookmarks.length())
				this.engine.unselectPage();

			this.notifyObservers(topic, value);
			break;

		case 'page.remove.list':
			var siz = value.pages.length, a = [];
			for (var i=0; i < siz; i++){
				var d = value.pages[i];
				a.push(d.index);
			}
				
			this.engine.removePages(a);

			this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
			this.toolbar.set('page.total', this.images.length(), false);

			this.notifyObservers(topic, value);
			break;

		case 'history.sync.end':
			this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
			this.toolbar.set('page.total', this.listView.pages.length(), false);
			break;
		}
	},

	//-----------------------------------------------------------

	engineNotify: function(sender, topic, value){
		//console.log('[VIEWER][Engine]['+ topic + '] ' + value);

		// 페이지 선택 요청
		if (topic == 'request.select'){
			this.listView.go(value);
			return;
		}

		// Styler 연게
		if (topic == 'shape'){
			switch(value){
			case 'created': case 'click': case 'select': case 'selectAll': case 'moved':
				if (this.engine.focusedShape)
					this.styler.set(this.engine.focusedShape);
				break;
			case 'delete':
				if (!this.engine.selectedShapes.length)
					this.styler.clear();
				break;
			}			
		}else if (topic == 'selection'){
			switch(value){
			case 'end':
				if (!this.engine.selectedShapes.length)
					this.styler.clear();
				break;
			}
		}else if (topic == 'clipboard'){
			switch(value){
			case 'paste':
				if (this.engine.focusedShape)
					this.styler.set(this.engine.focusedShape);
				break;
			}
		}

		// Toolbar 연계
		if ((topic == 'shape' && value == 'created') || (topic == 'cancel' && value == 'shape.create')){
			this.toolbar.set('annotation.cursor', true);
		}

		switch (topic){
		case 'scale':
			this.toolbar.set('fit.horiz', false, false);
			this.toolbar.set('fit.vert', false, false);
			this.toolbar.set('fit.in', false, false);

			this.toolbar.set('page.scale', Math.round(value * 100) + '%', false);
			break;
		case 'fit':
			if (value == 'horiz') this.toolbar.set('fit.horiz', true, false);
			if (value == 'vert') this.toolbar.set('fit.vert', true, false);
			if (value == 'in') this.toolbar.set('fit.in', true, false);

			this.toolbar.set('page.scale', 'fit.' + value, false);
			break;

		case 'page':
			if (value == 'select'){
				var page = this.engine.currentPage;

				if (page && page.isReadyImage()){
					this.exec(function (){
						page.source.image()
							.then(function(){
								this.engine.refresh();
							}.bind(this));
					});
				}
			}

			if (value == 'add' || value == 'select'){
				var fitTo = this.engine.fit();
				if (fitTo){
					this.toolbar.set('page.scale', 'fit.' + fitTo, false);

					this.toolbar.set('fit.' + fitTo, true, false);
				}else{
					this.toolbar.set('page.scale', Math.round(this.engine.scale() * 100) + '%', false);

					this.toolbar.set('fit.horiz', false, false);
					this.toolbar.set('fit.vert', false, false);
					this.toolbar.set('fit.in', false, false);
				}
			}

			if (value == 'select' && this.engine.currentPage){
				this.notifyObservers('page.select', this.engine.currentPage.uid);

				if (this.engine.focusedShape)
					this.styler.set(this.engine.focusedShape);
				else if (!this.engine.selectedShapes.length)
					this.styler.clear();
			}
			
			// 툴바 활성화
			this.enableToolbarTopics();
			break;
			
		case 'history':
			if (value == 'undoing' || value == 'redoing')
				// 실행취소/다시실행을 위해 이미지 목록으로 변경
				this.toggleListView('pages', false);
			break;

		case 'history.sync':
			// 에디터 설정을 이미지 목록으로 변경
			this.toggleListView('pages', false);

			this.notifyObservers(topic, value);
			break;
			
		case 'modified':
			this.exec(function (){
				var page = this.engine.currentPage;
				if (!page) return;
				
				this.renderThumbnail(page);
			}, 100);
			break;
		}
	},

	//-----------------------------------------------------------

	styleNotify: function (sender, name, value, shape){
		var changed = value.changed;

		if (changed){
			shape.measure();
			shape.notify('styled');

			this.history.end(this.engine);

			this.engine.render();

			// Notify modified
			this.engine.modified();
		}else{
			this.history.begin('shape', 'update', this.engine, ['style']);
		}
	},

	//-----------------------------------------------------------

	exec: function(func, delay){
		if (!delay) delay = 0;
		setTimeout(func.bind(this), delay);
		//func.call(this);
	},

	//-----------------------------------------------------------

	execCommand: function(cmd){ this.engine.execCommand(cmd); },

	//-----------------------------------------------------------

	toggleListView: function (type, selectingPage){
		if (this.listType == type)
			return;

		if (!AbCommon.isBool(selectingPage)) selectingPage = true;

		var originCallType = type;
		var showListPopup = false;
		if (type.indexOf('thumb-popup.') == 0){
			showListPopup = true;
			type = type.replace('thumb-popup.', '');
		}

		var index = -1;
		switch(type){
		case 'pages':
			$(this.imageListView.selector).removeClass('hide');
			$(this.popupImageListView.selector).removeClass('hide');

			$(this.bookmarkListView.selector).addClass('hide');
			$(this.popupBookmarkListView.selector).addClass('hide');

			this.listType = type;
			this.updateListType();

			this.notifyObservers('collection.changed', selectingPage);
			
			this.toolbar.set(originCallType, true, false);
			this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
			this.toolbar.set('page.total', this.listView.pages.length(), false);

			if (showListPopup) this.toolbar.set('pages', true, false);
			else this.toolbar.set('thumb-popup.pages', true, false);

			break;
		case 'bookmarks':
			$(this.imageListView.selector).addClass('hide');
			$(this.popupImageListView.selector).addClass('hide');

			$(this.bookmarkListView.selector).removeClass('hide');
			$(this.popupBookmarkListView.selector).removeClass('hide');

			this.listType = type;
			this.updateListType();

			this.notifyObservers('collection.changed', selectingPage);

			this.toolbar.set(originCallType, true, false);
			this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
			this.toolbar.set('page.total', this.listView.pages.length(), false);

			if (showListPopup) this.toolbar.set('bookmarks', true, false);
			else this.toolbar.set('thumb-popup.bookmarks', true, false);

			break;
		}
	},

	showimageListView: function(show){
		var thumbnailLayer = $('.abv-thumbnails-closable');

		if (show){
			thumbnailLayer.removeClass('abv-hide-thumbnails');
		}else{
			thumbnailLayer.addClass('abv-hide-thumbnails');
		}
		this.resize();
	},

	showEditControls: function (show){
		var viewLayer = $('.abv-view');
		if (show){
			viewLayer.addClass('abv_show_view_tools');
		}else{
			viewLayer.removeClass('abv_show_view_tools');
		}
		this.resize();
	},

	showListViewPopup: function (show){
		this.$showListViewPopup = show;
		this.updateListType();

		var thumbnailLayer = $('#thumbnails-popup-layer');

		if (show){
			thumbnailLayer.removeClass('abv-hide-thumbnails-popup-layer');
		}else{
			thumbnailLayer.addClass('abv-hide-thumbnails-popup-layer');
		}
	},

	//-----------------------------------------------------------

	resize: function(){
		/*
		this.engine.runtime = true;

		var timeId = setInterval(function (){
			this.engine.resize();
		}.bind(this), 100);

		this.exec(function (){
			clearTimeout(timeId);

			this.engine.runtime = false;
		}, 500);
		*/

		this.exec(function (){
			this.engine.resize();
		}, 0);
	},

	render: function (){ this.engine.render(); },

	//-----------------------------------------------------------

	clear: function(){
		this.engine.clearPages();
	},

	add: function(promise, history){
		if (!AbCommon.isBool(history)) history = false;

		var page = new AbPage({
			uid: this.images.uuid(),
			status: AbPage.prototype.READY,
			loader: promise,
		});

		var pageIndex = this.engine.pages.length();
		
		this.engine.addPage(page, false, history);	// 엔진은 이미지 배열에만 추가한다.

		var r = { page: page, index: pageIndex };

		this.notifyObservers('page.add', r);

		return r;
	},

	//-----------------------------------------------------------
	
	creatingShapes: function (page, shapeDefines){
		var engine = this.engine;
		
		if (shapeDefines){
			promise = new Promise(function (resolve, reject){
				var cpage = engine.currentPage;
				
				try
				{
					// <?xml version="1.0" encoding="UTF-8"?> 제거
					shapeDefines = AbCommon.removeXmlHeader(shapeDefines);
					
					var ps = AbCommon.deserializePageShapes(shapeDefines);
					var psLen = ps.length, called = 0;
					for (var i=0; i < psLen; i++){
						var prop = ps[i];
						
						engine.currentPage = page;
						
						engine.createShape(prop.name, prop, function (s, error){
							s.prepare();
							
							page.shapes.push(s);
							
							s.engine = engine;
							s.measure();
							
							called++;
							if (called >= psLen){
								engine.currentPage = cpage;
								
								resolve(psLen);
							}
						});
					}
				}
				catch (e)
				{
					engine.currentPage = cpage;
					reject(e);
				}
			});
		}else{
			promise = Promise.resolve(0);
		}
		
		return promise;
	},

	//-----------------------------------------------------------

	loadPage: function (pageData, sync){
		if (pageData.page.isLoading())
			return false;

		pageData.page.status = AbPage.prototype.LOADING;
		this.notifyObservers('page.loading', pageData.page.uid);
		
		var engine = this.engine;

		return pageData.page.loader()
			.then(function (e){
//				console.log('[PAGE LOADER]');
//				console.log(e);
				
				return this.creatingShapes(pageData.page, e.shapes)
					.then(function (){
						return e;
					});
			}.bind(this))
			.then(function (e){
				return this.setImage(pageData, e.image, e.info, e.from, e.decoder);	
			}.bind(this))
			.catch(function (e){
				pageData.page.status = AbPage.prototype.ERROR;
				pageData.page.error = e;

				console.log(e);
				this.notifyObservers('page.error', pageData.page.uid);
			}.bind(this));
	},

	setImage: function(pageData, image, imageInfo, from, decoder){
		// 렌더링 디코더
		var renderDecoder = 'jpeg';
		if (decoder){
			if (decoder.hasOwnProperty('render') && AbCommon.isString(decoder.render)){
				renderDecoder = decoder.render;
			}else if (!AbCommon.isString(decoder)){
				renderDecoder = 'png';
			}
		}

		// 이미지 객체에 저장될 이미지 정보
		var info = { from: from, data: imageInfo, decoder: renderDecoder };
		var options = { info: info };
		var isThumbnail = false;

		if (AbCommon.isString(image))
			options.image = image;
		else if (image && (image.image || image.thumbnail)){
			if (!image.image)
				image.image = image.thumbnail;
			
			if (image.width && image.height){
				options.width = image.width;
				options.height = image.height;
			}

			if (image.image && image.width && image.height && image.thumbnail)
				isThumbnail = true;

			if (image.image) options.image = image.image;
			if (image.thumbnail) options.thumbnail = image.thumbnail;
		}

		var abimg = new AbImage(options);

		var pageIndex = pageData.index;
		var page = pageData.page;

		//-----------------------------------------------------------

		var promise = isThumbnail ? abimg.thumbnail() : abimg.image();
		
		var engine = this.engine;
		var thumbnailGenerator = this.thumbnailGenerator;

		return promise.then(function (e){
				if (!abimg.hasThumbnail()){
					if (abimg.thumbInfo.url)
						return abimg.thumbnail();
					return abimg.generateThumbnail(this.thumbnailGenerator);
				}
			}.bind(this))
			.then(function (e){
				page.width = abimg.width;
				page.height = abimg.height;
				page.source = abimg;

				page.error = null;
				page.status = AbPage.prototype.LOADED;
				
				if (page.shapes.length){
					engine.renderThumbnail(thumbnailGenerator, page);

					var imgData = thumbnailGenerator.toImage(renderDecoder);
					page.source.setThumbnailData(imgData);
				}
				
				this.notifyObservers('page.loaded', pageData);
			}.bind(this))
			.catch(function(e){
				console.log(e);

				page.status = AbPage.prototype.ERROR;
				page.error = e;

				this.notifyObservers('page.error', page.uid);
			}.bind(this));	
	},

	//-----------------------------------------------------------

	// images: 이미지 배열
	// options: 옵션
	// 		type: 이미지 타입(local/server)
	//		decoder: 렌더링 힌트
	addImages: function (images, options){
		if (!options) options = {};
		if (!options.from) options.from = 'server';

		return new Promise(function (resolve, reject){
			if (!$.isArray(images)){
				if (!AbCommon.isSetted(images)){
					resolve(0);
					return;
				}
				images = [images];
			}
	
			if (!images.length){
				resolve(0);
				return;
			}
	
			this.exec(function (){
				var siz = images.length;
				for (var i=0; i < siz; i++){
					var src = images[i];
	
					var loader = function (){
						var src =  arguments.callee.src;
						var index =  arguments.callee.index;
		
						return new Promise(function (resolve, reject){
							var img = {};
							var imageInfo = $.extend({}, options.preset);
							
							if (src.info)
								imageInfo = $.extend(imageInfo, src.info);

							if (AbCommon.isString(src)){
								img['image'] = src;
							}else{
								if (AbCommon.isString(src.image)){
									img['image'] = src.image;
								}
								if (AbCommon.isString(src.thumbnail)){
									img['thumbnail'] = src.thumbnail;
								}
								if (AbCommon.isNumber(src.width) && AbCommon.isNumber(src.height) && (src.width > 0 && src.height > 0)){
									img['width'] = src.width;
									img['height'] = src.height;
								}
							}

							if (siz > 1){
								imageInfo['index'] = index;
								imageInfo['pages'] = siz;
							}
							
							var decoder = src.hasOwnProperty('decoder') ? src.decoder : options.decoder;

							var r = { from: options.from, decoder: decoder, image: img, info: imageInfo };
							if (src.shapes)
								r['shapes'] = src.shapes;

							resolve(r);
						});
					};
					loader.src = src;
					loader.index = i;
		
					this.add(loader);
				}
				
				this.exec(function(){
					this.updatePagesNotifyObservers();
					
					resolve(siz);
				});
	
			});			
		}.bind(this));
	},

	//-----------------------------------------------------------
	
	changeImage: function(index, imageData, options){
		if (!options) options = {};
		var removePrevShapes = AbCommon.isBool(options.removePrevShapes) ? options.removePrevShapes : true;
		
		var self = this;
		
		var images = this.images;
		var engine = this.engine;
		var thumbnailGenerator = this.thumbnailGenerator;
		
		return new Promise(function(resolve, reject){
			if (index < 0 || index >= images.length()){
				AbMsgBox.error('잘못된 호출입니다 (index)');
				reject(new Error('잘못된 호출입니다 (index)'));
				return;
			}
			
			if (!imageData){
				AbMsgBox.error('잘못된 호출입니다 (imageData)');
				reject(new Error('잘못된 호출입니다 (imageData)'));
				return;
			}
			
			if (!imageData.image){
				AbMsgBox.error('잘못된 호출입니다 (imageData.image)');
				reject(new Error('잘못된 호출입니다 (imageData.image)'));
				return;
			}
			
			var page = images.get(index);
			if (page.error){
				AbMsgBox.error('이미지 로드를 재시도 하세요');
				reject(new Error('이미지 로드를 재시도 하세요'));
				return;
			}
			
			var renderDecoder = imageData.decoder;
			
			page.changeImage(imageData.image)
				.then(function (r){
					if (removePrevShapes){
						//-----------------------------------------------------------
						// begin record history
						//this.history.begin('shape', 'range', engine, [page]);
						//-----------------------------------------------------------
						
						page.shapes.splice(0, page.shapes.length);
						
						//-----------------------------------------------------------
						// end record history
						//this.history.end(engine);
						//-----------------------------------------------------------
					}
					return this.creatingShapes(page, imageData.shapes)
				}.bind(self))
				.then(function (){
					engine.renderThumbnail(thumbnailGenerator, page);

					var imgData = thumbnailGenerator.toImage(renderDecoder);
					page.source.setThumbnailData(imgData);
					
					if (this.engine.currentPageIndex == index){
						this.engine.refresh();
					}
					
					this.notifyObservers('modified', {
						uid: page.uid,
						data: imgData
					});
					
					return r;
				}.bind(self))
				.then(function(){
					resolve();
				})
				.catch(function (e){
					AbMsgBox.error(e);
					reject(e);
				});
		});
	},

	//-----------------------------------------------------------

	openLocalFile: function(){
		var supported = (window.File && window.FileReader && window.FileList && window.Blob);
		if (!supported){
			alert('File API 지원안함');
			return;
		}

		var efile = $('#fileopen');
		if (efile.length)
			efile.remove();

		efile = $('<input id="fileopen" type="file" multiple="multiple" style="display: none;"/>');
		$(document.body).append(efile);
		
		efile.change(function(e){
			var files = e.currentTarget.files;
			if (!files || !files.length){
				// - 취소 버튼을 눌러도 change가 호출됨.
				//alert('파일을 선택하세요');
				efile.remove();
				return;
			}
			
			if (files.length >= 2){
				console.log('[CATCH]');
			}

			// 에디터 설정을 이미지 목록으로 변경
			this.toggleListView('pages', false);

			var siz = files.length;
			for (var i=0; i < siz; i++){
				var file = files[i];

				// lastModified: 1466262376326
				// lastModifiedDate: Sun Jun 19 2016 00:06:16 GMT+0900 (대한민국 표준시) (Date 객체)
				// name: 56ab2bef0aa7d2738266.png
				// size: 568656
				// type: image/png
				// webkitRelativePath: <<empty string>>

				console.log('[LOCAL][FILE] ' + file.name + ' (' + file.type + ')');

				var loader = AbImageLoader.load(file);
				if (loader)
					this.add(loader, true);
			}

			this.updatePagesNotifyObservers();
			efile.remove();

			if (AbImageLoader.needExternalProcess()){
				var eloading = $('#file-loading');
				eloading.attr('pl-topic', 'loading');

				var bar = eloading.find('.bar');
				bar.css('width', '0%');

				AbImageLoader.doExternalProcess({
					total: 0,
					index: 0,
					self: this,

					begin: function(total){
						this.total = total;
						this.index = 0;
				
						eloading.show();
					},
					next: function (total, index){
						this.index++;
						var per = this.index / this.total * 100;

						bar.css('width', per.toFixed(1) + '%');
					},
					end: function(total){
						this.self.updatePagesNotifyObservers();

						this.self.exec(function (){
							eloading.hide();
						});
					},

					//-----------------------------------------------------------

					error: function (e){
					},

					//-----------------------------------------------------------

					get: function (loader, index){
						this.self.add(loader, true);
					},

					//-----------------------------------------------------------

					beginMulti: function (siz){},
					endMulti: function (siz){
						
					},

					//-----------------------------------------------------------
					
					getList: function (list, token){
						this.self.addImages(list, token);
					},
				});
			}
		}.bind(this));

		efile.click();
	},

	supportFileSaver: function(){
		var isFileSaverSupported = false;
		try {
			isFileSaverSupported = !!new Blob;
		} catch (e) {
			console.log(e);
			return false;
		}
		return isFileSaverSupported;
	},

	saveToLocalImage: function(){
		if (!this.supportFileSaver()){
			AbMsgBox.info('이 브라우저는 파일 저장을 지원하지 않습니다');
			return;
		}

		var pageIdx = this.engine.currentPageIndex;

		// 체크된 페이지 또는 현재 페이지 수집
		var collect = this.collectSelectedOrAllPages({
			start: pageIdx,
			end: pageIdx
		});

		if (!collect.pages.length)
			return;

		var msg = '';
		if (collect.type == 'single'){
			msg = '어떤 형식으로 저장하시겠습니까?';
		}else{
			msg = '선택한 이미지(들)를 어떤 형식으로 저장하시겠습니까?';
		}

		AbMsgBox.show(msg, null, {
			png: 'PNG 형식',
			jpg: 'JPG 형식',
		})
			.then(function (r){
				if (r == 'png' || r == 'jpg'){
					var self = this;
					var ps = [];
					var len = collect.pages.length;
					for (var i=0; i < len; i++){
						var page = collect.pages[i];
						var index = this.images.indexOf(page.uid);

						// 실행 함수
						var func = function (resolve, reject){
							var type = arguments.callee.type;
							var page = arguments.callee.page;
							var index = arguments.callee.index;
							var self = arguments.callee.self;
							
							var doFunc = function(){
								var ctx = AbGraphics.canvas.createContext(page.width, page.height);
								self.engine.renderImage(ctx, page);
		
								AbGraphics.canvas.toBlob(ctx, type == 'jpg' ? 'image/jpeg' : null)
									.then(function (blob){
										AbVendor.save(blob, 'image_'+(index+1)+'.' + type);
										resolve(index);
									})
									.catch(function (e){
										reject(e);
									});
							};
							
							// 섬네일만 로드된 경우
							if (page.isReadyImage()){
								page.source.image()
									.then(function(){
										doFunc();
									})
									.catch(function(e){
										console.log(e);
										
										reject(e);
									});
							}else{
								doFunc();
							}
						};
						func.type = r;
						func.page = page;
						func.index = index;
						func.self = self;

						ps.push(new Promise(func));
					}

					AbCommon.sequencePromiseAll(ps, null, { term: { progress: 10, promise: 10 } })
						.then(function (){
							self.notifyObservers('file.save.image');
						})
						.catch(function(e){
							console.log(e);
							AbMsgBox.error(e);
						});
				}
			}.bind(this));
	},

	saveToLocalText: function(){
		// 체크된 페이지 또는 전체 페이지 수집
		var collect = this.collectSelectedOrAllPages();

		var numShapes = 0, msg = null, isAll = false;
		if (collect.type == 'all'){
			numShapes = this.images.numShapes();
			msg = '모든 이미지의 주석/마스킹 정보를 저장하시겠습니까';
			isAll = true;
		}else{
			for (var i = collect.pages.length - 1; i >= 0; i--)
				numShapes += collect.pages[i].shapes.length;
			msg = '선택한 이미지(들)의 주석/마스킹 정보를 저장하시겠습니까';
		}

		if (!numShapes)
			return;

		AbMsgBox.confirm(msg)
			.then(function (r){
				if (r == 'ok'){
					// var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
					// saveAs(blob, "hello world.txt");

					// this.notifyObservers('file.save.annotation');

					var output = [AbCommon.xmlHeader()];

					if (isAll)
						output.push('<pages all="true">');
					else
						output.push('<pages all="false">');

					var cnt = collect.pages.length;
					for (var i=0; i < cnt; i++){
						var page = collect.pages[i];

						var index = this.images.indexOf(page.uid);

						output.push('<page index="'+index+'">');

						var nums = page.shapes.length;
						for (var j=0; j < nums; j++){
							var s = page.shapes[j];
							output.push(s.serialize());
						}

						output.push('</page>');
					}

					output.push('</pages>');

					//-----------------------------------------------------------

					var blob = new Blob(output, {type: "text/plain;charset=utf-8"});
					saveAs(blob, "shapes.xml");

					this.notifyObservers('file.save.annotation');
				}
			}.bind(this));
	},

	//-----------------------------------------------------------

	sendToServer: function (){
		// 체크된 페이지 또는 전체 페이지 수집
		var collect = this.collectSelectedOrAllPages();
		var msg = null, isAll = false;
		if (collect.type == 'all'){
			msg = '모든 이미지를 서버로 전송하시겠습니까?';
			isAll = true;
		}else{
			msg = '선택한 이미지(들)를 서버로 전송하시겠습니까?';
		}

		if (!collect.pages.length)
			return;
		
		msg = msg + '<br/><br/>※ 오류 이미지는 전송되지 않습니다.';

		if (this._requestParam){
			AbMsgBox.showHtml(msg, null, {
				regist: '신규등록',
				modify: '수    정',
			})
				.then(function (r){
					if (r === 'regist' || r === 'modify'){
						this.exec(function (){
							this.submitImages(collect.pages, r);
						}, 300);
					}
				}.bind(this));
		}else{
			AbMsgBox.confirmHtml(msg)
				.then(function (r){
					if (r == 'ok'){
						this.exec(function (){
							this.submitImages(collect.pages);
						}, 300);
					}
				}.bind(this));
		}
	},

	//-----------------------------------------------------------
	// 수정 작업을 원하면 두번째 인자를 modify로 입력한다
	
	submitImages: function(pages, work){
		if (!AbCommon.isSetted(work)) work = 'auto';
		
		// 이 값이 세팅되면 ID 할당 과정을 생략한다. 즉, 수정 작업 처리
		var requestID = null;
		
		if (work === 'modify' || work === 'auto')
			requestID = this._requestParam;
		
		var it = new AbImageTransferProcessHelper({
			viewer: this,
			
			selector: '#server-saving',
			parallels: this.PARALLELS,
			
			id: requestID,
			
			urls: {
				alloc: this.URLS.SAVE.ALLOC,
				modify: this.URLS.SAVE.MODIFY,
				remove: this.URLS.SAVE.REMOVE,
				completed: this.URLS.SAVE.COMPLETED,
			},
			
			submit: function (sendor, current, data){
				return this.submitProcess(sendor, current, data);
			}.bind(this),
		});
		
		//-----------------------------------------------------------
		
		it.send(pages)
			.then(function(d){
				it.hide();
				it.dispose();
				
				AbMsgBox.success('이미지들을 전송했습니다');
			})
			.catch(function (e){
				it.hide();
				it.remove();
				it.dispose();
				
				console.log(e);
				
				AbMsgBox.error(e);
			})
			.then(function(){
				// 혹시 몰라 넣은 쓰레기 제거 코드 
				$('#save-forms').empty();
			});
	},

	//-----------------------------------------------------------

	submitProcess: function(sendor, current, data){
		//-----------------------------------------------------------

		var types = this.IMAGE_TYPES;
		var numTypes = types.length;
		
		//-----------------------------------------------------------

		var fc = AbCommon.formController('#save-forms', 'modify,id,index,type,info');
		var modify = sendor.work === 'modify';
		var id = sendor.transferID;
		
		//-----------------------------------------------------------
		// 수정 작업 여부
		fc.modify.val(modify);
	
		//-----------------------------------------------------------

		var index = current.index;
		var pageInfo = current.pageInfo;
		var imgInfo = current.imgInfo;
		
		//-----------------------------------------------------------
		// 전송 데이터 수집

		var datas = [];
		for (var itype=0; itype < numTypes; itype++){
			var type = types[itype];
			
			datas.push({
				index: index,
				type: type,
				
				info: pageInfo,
				page: pageInfo.page,
				abimg: pageInfo.page.source,
			});
		}

		// 완료 작업
		datas.push({
			index: index,
			type: 'end',
			
			info: pageInfo,
			page: pageInfo.page,
			abimg: pageInfo.page.source,
		});

		//-----------------------------------------------------------
		// 전송
		
		var dindex = 0, dlength = datas.length;
		var self = this;
		var delay = 10;
		
		return new Promise(function(resolve, reject){
			var exec = function(){
				var d = null;
				var r = null, info = null, content = null;
				var imgElement = null, img = null;
				
				try
				{
					d = datas[dindex];
					var output = [];
					
					var decoder = d.page.decoder();
					if (!decoder) decoder = null;
					
					switch (d.type){
					case 'image':
						imgElement = d.abimg.imageElement();
						
						output.splice(0, output.length);
						
						if (d.page.shapes.length){
							output.push(AbCommon.xmlHeader());
							output.push('<page index="'+d.index+'">');
		
							var nums = d.page.shapes.length;
							for (var j=0; j < nums; j++){
								var s = d.page.shapes[j];
								output.push(s.serialize());
							}
							output.push('</page>');
						}
						
						info = JSON.stringify({
							width: imgElement.width,
							height: imgElement.height,
							shapes: output.length ? output.join('') : null,
							decoder: decoder,
						});
						break;
						
					case 'image-source':
						imgElement = d.abimg.imageElement();
						img = AbGraphics.canvas.renderImage(imgElement, decoder);
						
						console.log('[IMAGE-SOURCE][' + d.index + '] ' + img.substr(0, img.indexOf(',')));
						
						content = img.substr(img.indexOf(',') + 1);
						break;
						
					case 'image-result':
						r = imgInfo.url;
						
						console.log('[IMAGE-RESULT][' + d.index + '] ' + r.substr(0, r.indexOf(',')));
						
						content = r.substr(r.indexOf(',') + 1);
						break;
						
					case 'thumb':
						imgElement = d.abimg.originThumbnailElement();
						img = AbGraphics.canvas.renderImage(imgElement, decoder);
						
						console.log('[THUMBNAIL][' + d.index + '] ' + img.substr(0, img.indexOf(',')));
						
						info = JSON.stringify({
							width: imgElement.width,
							height: imgElement.height,
						});					
						
						content = img.substr(img.indexOf(',') + 1);
						break;
						
					case 'end':
						break;
					}
				
					//-----------------------------------------------------------
					
					self.submitContent(fc, id, d.index, d.type, info, content, function (){
						try
						{
							if (dindex + 1 >= dlength){
								fc.dispose();
								resolve(true);
							}else{
								dindex++;
								setTimeout(exec, delay);
							}
						}
						catch (e){
							fc.dispose();
							reject(e);				
						}
					}, function (e){
						fc.dispose();
						reject(e);
					});					
				}
				catch (e)
				{
					fc.dispose();
					
					reject(e);
				}
			};
			
			setTimeout(exec, 0);
		});		
	},
	
	//-----------------------------------------------------------

	submitContent: function (formController, id, index, type, info, content, success, error, delay){
		var saveUrl = this.URLS.SAVE.IMAGE;
		var splitDataSiz = this.SPLIT_DATA_SIZE;
	
		formController.id.val(id);
		formController.index.val(index);
		formController.type.val(type);
		formController.info.val(info);
		
		if (content){		
			AbCommon.submitPartialContent({
				url: saveUrl,
				content: content,
				
				splitSize: splitDataSiz,
				
				formController: formController,
				
				success: function (){
					if (AbCommon.isFunction(success))
						success();
				},
				
				error: function(e){
					if (AbCommon.isFunction(error))
						error(e);
				}
			});
		}else{
			AbCommon.ajaxSubmit(formController.form, {
				url: saveUrl,
				
				logFail: true,
				nomsg: true,
				
				success: function(r, status, xhr, $form){
					if (AbCommon.isFunction(success))
						success();
				},
				
				error: function(e, $form){
					if (AbCommon.isFunction(error))
						error(e);
				}
			});
		}
	},

	//-----------------------------------------------------------

	removePage: function (){
		if (!this.listView) return;
	
		this.notifyObservers('page.remove');
	},

	page: function (value){
		if (!this.listView) return -1;

		if (arguments.length){
			if (!AbCommon.isNumber(value)) value = parseInt(value);

			if (!this.listView.go(value - 1)){
				this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
			}
		}
		return this.listView.pager.page();
	},

	prevPage: function (){
		if (!this.listView || !this.listView.canPrev()) return;

		this.listView.prev();
	},

	nextPage: function (){
		if (!this.listView || !this.listView.canNext()) return;

		this.listView.next();
	},

	//-----------------------------------------------------------

	selectedPages: function (type){
		var listView = this.listView;

		switch(type){
		case 'pages': listView = this.imageListView; break;
		case 'bookmarks': listView = this.bookmarkListView; break;
		}

		var list = listView.selectedPages();
		var a = [];
		for (var i = list.length - 1; i >= 0; i--){
			if (!list[i].uid)
				continue;

			var page = this.images.getById(list[i].uid);
			if (page)
				a.unshift(page);
		}
		return a;
	},

	//-----------------------------------------------------------

	// 체크된 페이지 또는 전체 페이지 수집
	collectSelectedOrAllPages: function (options){
		// 체크된 페이지가 있는 경우
		var a = this.selectedPages();
		if (a.length)
			return { type: 'range', pages: a };

		// 기본 전체 페이지 지정
		var start = 0, end = this.images.length() - 1;
		var type = 'all';

		// 옵션에 따라 범위 지정
		if (options && (AbCommon.isNumber(options.start) || AbCommon.isNumber(options.end))){
			if (AbCommon.isNumber(options.start)) start = options.start;
			if (AbCommon.isNumber(options.end)) end = options.end;
			type = (start >= 0 || end >= 0) && start === end ? 'single' : 'range';
		}

		// 페이지 수집
		var source = [], pages = [], urls = [], map = {};
		for (var i=start; i >= 0 && i <= end; i++){
			var page = this.images.get(i);
			a.push(page);
		}
		return { type: type, pages: a };
	},

	//-----------------------------------------------------------

	printPage: function(){
		if (!this.engine.currentPage)
			return;

		var uid = this.engine.currentPage.uid;
		var idx = this.images.indexOf(uid);

		if (idx < 0)
			return;

		var page = this.images.get(idx);

		this.exec(function(){
			this.print([page]);
			this.notifyObservers('page.print');
		}, 200);
	},

	printAllPages: function (){
		var collect = this.collectSelectedOrAllPages();
		var siz = collect.pages.length;

		if (siz > 40){
			AbMsgBox.confirmHtml('인쇄하는 데 오래 걸릴 수 있습니다.<br/>계속 진행하시겠습니까?')
				.then(function(r){
					if (r == 'ok'){
						this.exec(function (){
							this.print(collect.pages);
							this.notifyObservers('print');
						}, 300);
					}
				}.bind(this));
		}else{
			this.exec(function(){
				this.print(collect.pages);
				this.notifyObservers('print');
			}, 200);
		}
	},
	
	getPrintFrameDoc: function (){
		var eframe = $('#print-frame');
		var frameDoc = AbCommon.contentDocument(eframe);

		if (!frameDoc){
			AbMsgBox.error('인쇄 프레임에 접근할 수 없습니다');
			return null;
		}
		
		return {
			frame: eframe,
			document: frameDoc
		};
	},

	print: function (pages){
		var pf = this.getPrintFrameDoc();
		if (!pf) return;
		
		var it = new AbImageTransferProcessHelper({
			viewer: this,
			
			selector: '#print-loading',
			parallels: this.PARALLELS,
			
			printShapes: this.engine.showShapes(),
			
			errorImageExit: true, // 오류난 이미지 있을 시 프로세스 중단
		
			urls: {
				alloc: this.URLS.PRINT.ALLOC,
				modify: this.URLS.PRINT.MODIFY,
				remove: this.URLS.PRINT.REMOVE,
			},
			
			msgs: {
				empty: '인쇄할 이미지가 없습니다',
				errorImage: '#{IDX}번 이미지는 인쇄할 수 없습니다',
				readyException: '인쇄 이미지 전송 준비 중 오류가 발생했습니다',
			},
			
			prepare: function (sendor){
				for (var i=0; i < sendor.length; i++)
					sendor.outputImageUrls.push(null);
			},
			
			chain: function (sendor, current, data){
				var promise = null;
				
				if (AbPrint.isLandscapeImage(current.imgInfo)){
					promise = AbCommon.loadImage(current.imgInfo.url)
									.then(function (eimg){
										var src = AbPrint.landscape(eimg);
										
										var tmp = current.imgInfo.width;
										current.imgInfo.width = current.imgInfo.height;
										current.imgInfo.height = tmp;
										
										current.imgInfo.url = src;
										return src;
									});
				}else{
					promise = Promise.resolve(current.imgInfo.url);
				}
				
				return promise;
			}.bind(this),
			
			submit: function (sendor, current, data){
				return this.submitPrintSupport(sendor, current, data);
			}.bind(this),
		});
		
		//-----------------------------------------------------------
		// 커스텀 데이터
		
		it.outputImageUrls = [];
		
		//-----------------------------------------------------------
		
		it.send(pages)
			.then(function(d){
				// 혹시 몰라 넣은 쓰레기 제거 코드 
				$('#print-support-forms').empty();
			})
			.then(function(){
				it.status('build');
				
				try
				{
					if (it.outputImageUrls.length){
						// 인쇄 데이터 작성 
						this.buildPrintSupport(it);
					}
				}
				catch (e)
				{
					throw e;
				}
			}.bind(this))
			.catch(function (e){
				it.hide();
				
				console.log(e);
				
				AbMsgBox.error(e);
			})
			.then(function(){
				it.dispose();
			});
	},
	
	//-----------------------------------------------------------
	
	submitPrintSupport: function (sendor, current, data){

		//-----------------------------------------------------------

		var fc = AbCommon.formController('#print-support-forms', 'id,index');

		//-----------------------------------------------------------
		
		var saveUrl = this.URLS.PRINT.IMAGE;
		var imgUrl = this.URLS.PRINT.DOWNLOAD;
		
		var splitDataSiz = this.SPLIT_DATA_SIZE;

		//-----------------------------------------------------------

		var id = sendor.transferID;
		
		var src = current.imgInfo.url;
		src = src.substr(src.indexOf(",") + 1);
		
		//-----------------------------------------------------------
		
		fc.id.val(id);
		fc.index.val(current.index);
		
		return new Promise(function(resolve, reject){
			AbCommon.submitPartialContent({
				url: saveUrl,
				content: src,
				
				splitSize: splitDataSiz,
				
				formController: fc,
				
				success: function (r){
					fc.dispose();
					
					sendor.outputImageUrls[current.index] = imgUrl + r.text;
					
					resolve(true);
				},
				
				error: function(e){
					fc.dispose();
					reject(e);
				}
			});			
		});
	},
	
	//-----------------------------------------------------------
	
	buildPrintSupport: function (sendor){
		var pf = this.getPrintFrameDoc();
		if (!pf) return;
		
		var id = sendor.transferID;
		var imageUrls = sendor.outputImageUrls;
		
		var heads = [];
		
		heads.push('<!doctype html>');
		heads.push('<html lang="en">');
		heads.push('<head>');
		heads.push('<meta charset="UTF-8">');
		heads.push('<title>이미지 뷰어 인쇄 지원</title>');
		heads.push('<style type="text/css" media="print">');
		heads.push('body,html{width:100%;height:100%; margin: 0;}');
		heads.push('#print,.print,.print>div{width:100%;height:100%}');
		heads.push('@page{size:A4 portrait!important;orientation:portrait}');
		heads.push('#loading{display:none}');
		heads.push('.print{position:relative;margin:0;padding:0;text-align:center;');
		heads.push('page-break-after:always;');
		heads.push('}');
		heads.push('img{position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;max-width:100%!important;max-height:100%!important}');
		heads.push('</style>');
		heads.push('<script>');
		heads.push('function loadedPage(){');
		heads.push('loadImages(function(){');
		heads.push('parent.AbImageViewer$$doPrint();');
		heads.push('setTimeout(endPrint, 500);');
		heads.push('});');
		heads.push('}');
		
		heads.push('function loadImage(index, url, callback){');
		heads.push('var img = new Image();');
		//heads.push('img.crossOrigin = \'Anonymous\';');
		heads.push('img.onload = function(e){');
		heads.push('setTimeout(callback.bind(null, true, index, this), 0);');
		heads.push('};');
		heads.push('img.onerror = function(e){');
		heads.push('setTimeout(callback.bind(null, false, index, new Error(\'[PRINT-IMAGE][\'+index+\'] It is not an image file\')), 0);');
		heads.push('};');
		heads.push('img.src = url;');
		heads.push('}');
		
		heads.push('function endPrint(){');
		heads.push('setTimeout(function(){');
		heads.push('console.log(\'[PRINT] clear printed data...\');');
		heads.push('document.body.innerHTML=\'\';');
		heads.push('parent.AbImageViewer$$endPrint(\''+id+'\');');
		heads.push(' }, 500);');
		heads.push('}');
		
		heads.push('function loadImages(callback){');
		heads.push('var called = 0, total = ' + imageUrls.length + ';');
		heads.push('');
		heads.push('var func = function(success, index, r){');
		heads.push('called++;');
		heads.push('if (success === true){');
		heads.push('var cover = document.getElementById("PIMG_" + index)');
		//heads.push('console.log("[VPRINT] APPEND " + index);');
		heads.push('cover.appendChild(r);');
		heads.push('}else{');
		heads.push('console.log(r);');
		heads.push('}');
		heads.push('if (called >= total)');
		heads.push('callback();');
		heads.push('}');
		heads.push('');
		
		for (var i=0; i < imageUrls.length; i++){
			var url = imageUrls[i];
			
			heads.push('loadImage('+i+', "' + url + '", func);');
		}
		
		heads.push('}');
		heads.push('</script>');
		heads.push('</head>');
		
		heads.push('<body onload="loadedPage();" ');
		
		//heads.push('<body onload="parent.AbImageViewer$$doPrint()" ');
		
//		heads.push(' onafterprint="setTimeout(function(){ ');
//		heads.push('console.log(\'[PRINT] clear printed data...\');');
//		heads.push('document.body.innerHTML=\'\';');
//		heads.push('parent.AbImageViewer$$endPrint(\''+id+'\');');
//		heads.push(' }, 100);"');
		
		heads.push('>');
		
		var htmls = [];
		
		htmls.push(heads.join('\n'));
		//htmls.push(AbPrint.generateHtml(imageUrls, '<div id="print">', '</div>'));
		htmls.push(AbPrint.generateCoverHtml(imageUrls, 'PIMG_', '<div id="print">', '</div>'));
		htmls.push('</body>');
		htmls.push('</html>');
		
		//-----------------------------------------------------------
	
		pf.document.open();
		pf.document.write(htmls.join(''));
		pf.document.close();
		
		console.log('[PRINT] OK!!');
		//console.log(htmls.join('\n'));		
	},
	
	//-----------------------------------------------------------

	clearShapes: function(){
		// 체크된 페이지 또는 전체 페이지 수집
		var collect = this.collectSelectedOrAllPages();
		
		var numShapes = 0, msg = null, isAll = false;
		if (collect.type == 'all'){
			numShapes = this.images.numShapes();
			msg = '모든 이미지의 주석/마스킹을 삭제하시겠습니까?';
			isAll = true;
		}else{
			for (var i = collect.pages.length - 1; i >= 0; i--)
				numShapes += collect.pages[i].shapes.length;
			msg = '선택한 이미지의 주석/마스킹을 삭제하시겠습니까?';
		}
		
		if (numShapes){
			AbMsgBox.confirm(msg, null, 'warn')
				.then(function (r){
					var callback = function(pageInfos){
						if (pageInfos){
							for (var i=0; i < pageInfos.length; i++){
								var pageInfo = pageInfos[i];
								//console.log('[CLEAR][SHAPES][' + pageInfo.index + ']');
								
								if (pageInfo.page.editable())
									this.renderThumbnail(pageInfo.page);
							}
						}
					}.bind(this);
					
					if (r == 'ok'){
						if (isAll)
							this.engine.removeAllPageShapes({
								end: callback
							});
						else
							this.engine.removeRangePageShapes(collect.pages, {
								end: callback
							});
					}
				}.bind(this));
		}

	},

	//-----------------------------------------------------------
	
	renderThumbnail: function(page){
		this.engine.renderThumbnail(this.thumbnailGenerator, page);

		var decoder = page.decoder();

		var imgData = this.thumbnailGenerator.toImage(decoder);
		page.source.setThumbnailData(imgData);

		this.notifyObservers('modified', { uid: page.uid, data: imgData });		
	},

	//-----------------------------------------------------------

	ZOOM_STEP: 0.3,

	zoom: function (value){
		var scale = this.engine.scale();
		var step = 0;

		if (value == 'in'){
			step = 1+this.ZOOM_STEP;
		}else if (value == 'out'){
			step = 1-this.ZOOM_STEP;
		}

		if (step){
			scale *= step;
				
			if (scale < AbViewerEngine.prototype.MIN_SCALE) scale = AbViewerEngine.prototype.MIN_SCALE;
			else if (scale > AbViewerEngine.prototype.MAX_SCALE) scale = AbViewerEngine.prototype.MAX_SCALE;

			if (scale != this.engine.scale())
				this.engine.scale(scale);
		}
	},

	//-----------------------------------------------------------

	addBookmark: function (){
		var a = Array.prototype.slice.call(arguments);
		
		return new Promise(function(resolve, reject){
			this.exec(function (){
				var siz = a.length;
				for (var i=0; i < siz; i++){
					var index = a[i];
					var page = this.images.get(index);
					if (!page)
						continue;

					this.bookmarks.push(page);
	
					this.notifyObservers('bookmark.add', page.uid);

					if (page.status == AbPage.prototype.LOADED)
						this.bookmarkListView.notify('page.loaded', { index: index, page: page });
				}

				resolve(siz);
			});
		}.bind(this));
	},

	//-----------------------------------------------------------
	
	openImages: function (id){
		var loader = $('#server-loading');
		loader.show();

		AbCommon.ajax({
			caller: this,
			title: '이미지 열기',
			url: this.URLS.OPEN,
			data: {
				id: id,
			},
			
			success: function (r){
				if (r && $.isArray(r) && r.length)
					this.addImages(r);
					
				loader.hide();
				
				this._requestParam = id;
			}.bind(this),

			error: function (r){
				loader.hide();
			}.bind(this),
		});
	},

	//-----------------------------------------------------------
	
	attachEvent: function (name, listener){
		if (!AbCommon.isFunction(listener))
			throw new Error('listener is not function');
		
		if (this.listeners[name])
			this.listeners[name].push(listener);
		else
			this.listeners[name] = [listener];
	},
	
	detachEvent: function (name, listener){
		if (!AbCommon.isFunction(listener))
			throw new Error('listener is not function');
		
		if (this.listeners[name]){
			var a = this.listeners[name];
			for (var i=a.length - 1; i >= 0; i--){
				if (a[i] == listener){
					a.splice(i, 1);
				}
			}
		}
	},
	
	trigger: function (name, data){
		var a = [];
		
		if (this.listeners['*'])
			Array.prototype.push.apply(a, this.listeners['*']);
		
		if (this.listeners[name])
			Array.prototype.push.apply(a, this.listeners[name]);
		
		if (a.length){
			var len = a.length;
			for (var i=0; i < len; i++){
				var listener = a[i];
				
				listener(name, data);
			}
		}
	},
};
