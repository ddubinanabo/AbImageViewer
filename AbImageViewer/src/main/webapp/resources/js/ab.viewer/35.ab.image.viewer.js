
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

//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

function AbImageViewer(options){
	if (!options) options = {};

	//-----------------------------------------------------------

	this.margin = options.margin || null;
	
	//-----------------------------------------------------------

	this.observers = [];

	//-----------------------------------------------------------
	// 마스킹 도형 추가

	if (!AbViewerEngine.prototype.SHAPE_TABLE['masking.rectangle'])
		AbViewerEngine.prototype.SHAPE_TABLE['masking.rectangle'] = this.createMaskingShape('rectangle');
	
	if (!AbViewerEngine.prototype.SHAPE_TABLE['masking.ellipse'])
		AbViewerEngine.prototype.SHAPE_TABLE['masking.ellipse'] = this.createMaskingShape('ellipse');

	//-----------------------------------------------------------

	this.history = new AbHistory();

	//-----------------------------------------------------------

	this.listType = 'pages';

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

	saveUrl: 'http://localhost:8084/wiv/api/save',
	openImageUrl: 'http://localhost:8084/wiv/api/images',

	//-----------------------------------------------------------

	install: function(){
		this.styler = new AbShapeStyler();
		this.styler.observe(this);

		//-----------------------------------------------------------

		this.toolbar = new AbToolbar();
		this.toolbar.observe(this);
		this.toolbar.groupObserve(this);

		//-----------------------------------------------------------

		this.imageListView = new AbImageListView({
			name: 'pages',
			pages: this.images,

			selector: '#thumbnails',
		});
		this.imageListView.observe(this);
		this.observe(this.imageListView);
	
		this.bookmarkListView = new AbImageListView({
			name: 'bookmarks',
			pages: this.bookmarks,

			bookmark: true,

			selector: '#bookmarks',
		});
		this.bookmarkListView.observe(this);
		this.observe(this.bookmarkListView);

		this.updateListType();

		//-----------------------------------------------------------
	
		this.engine.install();
		this.engine.observe('all', this);

		//-----------------------------------------------------------

		this.sync();

		//-----------------------------------------------------------

		this.engine.attachEvents();
		this.engine.animate();

		//-----------------------------------------------------------

	},

	updateListType: function(){
		switch (this.listType){
		case 'pages':
			this.listView = this.imageListView;
			break;

		case 'bookmarks':
			this.listView = this.bookmarkListView;
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
			'annotation.arrow',
			'annotation.pen',
			'annotation.highlightpen',
			'annotation.textbox',
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

		case 'clear.shapes':
			if (this.images.numShapes()){
				AbMsgBox.confirm('모든 주석/마스킹을 삭제하시겠습니까?', null, 'warn')
					.then(function (r){
						console.log('[MSGBOX] result=' + r);

						if (r == 'ok'){
							this.engine.removeAllPageShapes();
						}
					}.bind(this));
			}
			break;
			
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
		case 'annotation.arrow':
		case 'annotation.pen':
		case 'annotation.highlightpen':
		case 'annotation.textbox':
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
			var html = '';

			var type = page.infoType();
			var info = page.info();
			var title = '이미지 정보';

			switch (type){
			case 'file':
				html = '<table>';
				html += '<tr><th>이름</th><td>' + AbCommon.escape(info.name) + '</td></tr>';
				html += '<tr><th>크기</th><td>' + AbCommon.byteScope(info.size) + '</td></tr>';
				if (info.type)
					html += '<tr><th>타입</th><td>' + AbCommon.escape(info.type) + '</td></tr>';
				if (AbCommon.isSetted(info.pages))
					html += '<tr><th>이미지 수</th><td>' + info.pages + '</td></tr>';
				if (AbCommon.isSetted(info.index))
					html += '<tr><th>인덱스</th><td>' + info.index + '</td></tr>';
				html += '</table>';
				break;
			case 'doc':
				title = '문서 정보';
				
				html = '<table>';
				if (info.name)
					html += '<tr><th>이름</th><td>' + AbCommon.escape(info.name) + '</td></tr>';
				if (info.size)
					html += '<tr><th>크기</th><td>' + AbCommon.byteScope(info.size) + '</td></tr>';
				if (info.type)
					html += '<tr><th>타입</th><td>' + AbCommon.escape(info.type) + '</td></tr>';
				if (AbCommon.isSetted(info.pages))
					html += '<tr><th>페이지 수</th><td>' + info.pages + '</td></tr>';
				if (AbCommon.isSetted(info.index))
					html += '<tr><th>인덱스</th><td>' + info.index + '</td></tr>';
				html += '</table>';
				break;
			}

			if (html){
				AbMsgBox.open({
					title: title,
					textHtml: html,
				});	
			}
			break;
		case 'request.load':
			this.loadPage(value);
			break;
		case 'select':
			//if (this.engine.currentPage && this.engine.currentPage.uid == value) return;

			page = this.images.getById(value);
			index = this.images.indexOf(page);
			this.engine.selectPage(index);
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
		console.log('[VIEWER][Engine]['+ topic + '] ' + value);

		// 페이지 선택 요청
		if (topic == 'request.select'){
			this.listView.goto(value);
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

				this.engine.renderThumbnail(this.thumbnailGenerator, page);

				var imgData = this.thumbnailGenerator.toImage();
				page.source.setThumbnailData(imgData);

				this.notifyObservers('modified', { uid: page.uid, data: imgData });
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

		var index = -1;
		switch(type){
		case 'pages':
			$('#thumbnails').removeClass('hide');
			$('#bookmarks').addClass('hide');

			this.listType = type;
			this.updateListType();

			this.notifyObservers('collection.changed', selectingPage);
			
			this.toolbar.set('pages', true, false);
			this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
			this.toolbar.set('page.total', this.listView.pages.length(), false);

			break;
		case 'bookmarks':
			$('#thumbnails').addClass('hide');
			$('#bookmarks').removeClass('hide');

			this.listType = type;
			this.updateListType();

			this.notifyObservers('collection.changed', selectingPage);

			this.toolbar.set('bookmarks', true, false);
			this.toolbar.set('page.no', this.listView.selectedIndex + 1, false);
			this.toolbar.set('page.total', this.listView.pages.length(), false);
			break;
		}
	},

	showimageListView: function(show){
		var thumbnailLayer = $('.abv-thumbnails');

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

	loadPage: function (pageData, sync){
		pageData.page.status = AbPage.prototype.LOADING;
		this.notifyObservers('page.loading', pageData.page.uid);
		
		var engine = this.engine;

		return pageData.page.loader()
			.then(function (e){
				if (e.shapes){
					var cpage = engine.currentPage;
					
					var ps = AbCommon.deserializePageShapes(e.shapes);
					var psLen = ps.length;
					for (var i=0; i < psLen; i++){
						var prop = ps[i];
						
						engine.currentPage = pageData.page;
						
						var s = engine.createShape(prop.name, prop);
						s.prepare();
						
						pageData.page.shapes.push(s);
						
						s.engine = engine;
						s.measure();
					}
					
					engine.currentPage = cpage;
				}
				
				if (sync){
					return this.setImage(pageData, e.image, {
						type: e.type,
						data: e.data
					})
						.then(function (r){
							return e;
						});

					// return new Promise(function(resolve, reject){
		
					// });				
				}
				this.setImage(pageData, e.image, {
					type: e.type,
					data: e.data
				});
				return e;
			}.bind(this))
			.catch(function (e){
				pageData.page.status = AbPage.prototype.ERROR;
				pageData.page.error = e;

				console.log(e);
				this.notifyObservers('page.error', pageData.page.uid);
			}.bind(this));
	},

	setImage: function(pageData, image, info){
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

					var imgData = thumbnailGenerator.toImage();
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

	addImages: function (images, dataPreset){
		if (!dataPreset) dataPreset = {};
		if (!dataPreset.type) dataPreset.type = 'doc';

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
							var dat = $.extend({}, dataPreset.data);

							if (AbCommon.isString(src)){
								img['image'] = src;
							}else{
								if (AbCommon.isString(src.image)){
									img['image'] = src.image;
								}
								if (AbCommon.isString(src.thumbnail)){
									img['thumbnail'] = src.thumbnail;
								}
								if (AbCommon.isNumber(src.width) && AbCommon.isNumber(src.height)){
									img['width'] = src.width;
									img['height'] = src.height;
								}
							}

							if (siz > 1){
								dat['index'] = index;
								dat['pages'] = siz;
							}

							var r = { type: dataPreset.type, image: img, data: dat };
							if (src.shapes)
								r['shapes'] = src.shapes;

							resolve(r);
						});
					};
					loader.src = src;
					loader.index = i;
		
					this.add(loader);
				}
	
				this.updatePagesNotifyObservers();
	
				resolve(siz);
			});			
		}.bind(this));
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
		var a = this.images;
		if (!a.length() || !this.supportFileSaver())
			return;

		var page = this.engine.currentPage;
		var pageIdx = this.engine.currentPageIndex;

		if (!page) return;

		AbMsgBox.show('어떤 형식으로 저장하시겠습니까?', null, {
			png: 'PNG 형식',
			jpg: 'JPG 형식',
		})
			.then(function (r){
				if (r == 'png' || r == 'jpg'){
					var ctx = AbGraphics.canvas.createContext(page.width, page.height);
					this.engine.renderImage(ctx, page);
		
					AbGraphics.canvas.toBlob(ctx, r == 'jpg' ? 'image/jpeg' : null)
						.then(function (blob){
							AbVendor.save(blob, 'image_'+(pageIdx+1)+'.' + r);
							this.notifyObservers('file.save.image');
						}.bind(this))
						.catch(function (e){
							console.log(e);

							AbMsgBox.error(e);
						}.bind(this));
				}
			}.bind(this));
	},

	saveToLocalText: function(){
		if (!this.images.numShapes())
			return;

		AbMsgBox.confirm('주석/마스킹 정보를 저장하시겠습니까?')
			.then(function (r){
				if (r == 'ok'){
					// var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
					// saveAs(blob, "hello world.txt");

					// this.notifyObservers('file.save.annotation');

					var output = [AbCommon.xmlHeader()];
					output.push('<pages>');

					var cnt = this.images.length();
					for (var i=0; i < cnt; i++){
						var page = this.images.get(i);

						output.push('<page index="'+i+'">');

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
		var a = this.images;
		if (!a.length())
			return;

		AbMsgBox.confirmHtml('서버로 전송하시겠습니까?<br/><br/>※ 오류 이미지는 전송되지 않습니다.')
			.then(function (r){
				this.exec(function (){
					this.submitImages();
				}, 300);
			}.bind(this));
	},

	//-----------------------------------------------------------

	submitImages: function(){
		var length = this.images.length();
		if (!length)
			return;

		var cp = this.collectPages(0, length - 1, {
			selector: '#server-saving',
			printShapes: true,
			inProc: 'saving',

			getTotal: function (numPages, numUrls, numSource){
				return numPages;
			},
		});

		if (!cp) return;

		if (!cp.urls.length){
			AbMsgBox.success('전송할 이미지가 없습니다');
			cp.end();
			return;
		}

		this.promiseRenderCollectPages(cp);

		var saveUrl = this.saveUrl;
		var images = this.images;
		return AbCommon.promiseAll(cp.ps, cp.progress, { term: { progress: 10, promise: 10 } })
			.then(function(){
				var sdatas = [], currnet = 0;
				var length = cp.source.length;
				for (var i=0; i < length; i++){
					var pageData = cp.source[i];

					// base64 로 저장
					console.log(pageData);

					var page = pageData.page;
					var abimg = page.source;

					var imgElement = abimg.imageElement();
					var thumbElement = abimg.originThumbnailElement();

					var img = AbGraphics.canvas.renderImage(imgElement);
					var thumb = AbGraphics.canvas.renderImage(thumbElement);
					var r = cp.urls[cp.map[page.uid]];

					var b64img = img.substr(img.indexOf(",") + 1);
					var b64thumb = thumb.substr(thumb.indexOf(",") + 1);
					var b64 = r.substr(r.indexOf(",") + 1);

					var output = [];
					if (page.shapes.length){
						output.push(AbCommon.xmlHeader());
						output.push('<page index="'+i+'">');
	
						var nums = page.shapes.length;
						for (var j=0; j < nums; j++){
							var s = page.shapes[j];
							output.push(s.serialize());
						}
	
						output.push('</page>');	
					}

					sdatas.push({
						image: {
							width: imgElement.width,
							height: imgElement.height,
							source: b64img,
							result: b64,
							shapes: output.length ? output.join('') : null
						},
						thumbnail: {
							width: thumbElement.width,
							height: thumbElement.height,
							source: b64thumb,
						},
						// shape 포함
					});

					cp.progress(i, length);
				}

				//-----------------------------------------------------------

				cp.status('send');

				//-----------------------------------------------------------
				// 전송 

				var forms = $('#save-forms');

				var html = '<form enctype="multipart/form-data"><input type="hidden" name="content"/></form>';
				var e = $(html);

				var s = JSON.stringify(sdatas);

				e.find('[name="content"]').val(s);

				forms.append(e);

				try
				{
					AbCommon.ajaxSubmit(e, {
						title: '이미지 전송',
						url: saveUrl,
						//dataType: 'text',
						success: function(r, status, xhr, $form){
							$form.remove();
							cp.end();

							AbMsgBox.success('이미지들을 전송했습니다');
						},

						error: function(e, $form){
							$form.remove();
							cp.end();

							console.log(e);
						},
					});
				}
				catch (e)
				{
					cp.end();
					forms.empty();
				}

			})
			.catch(function(e){
				AbMsgBox.error('이미지 전송 준비 중 오류가 발생했습니다');
			});
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

			if (!this.listView.goto(value - 1)){
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

	collectPages: function (start, end, options){
		if (!options) options = {};

		var eloading = $(options.selector);
		eloading.attr('pl-topic', 'ready');
		eloading.show();

		var printShapes = options.printShapes === true;
		var images = this.images;

		var src = null;
		var source = [], pages = [], urls = [], map = {};
		for (var i=start; i <= end; i++){
			var page = this.images.get(i);

			if (page.isError()){
				if (options.exitError === true){
					if (AbCommon.isFunction(options.error)){
						options.error(i);
					}
					pages.splice(0, pages.length);

					eloading.hide();
					return null;
				}
				continue;
			}

			var type = 0;
			if (!page.editable()){
				type |= 1;
			}
			if (page.angle || this.drawableWaterMark() || (page.hasShapes() && printShapes) ){
				type |= 2;
			}

			map[page.uid] = urls.length;
			urls.push(type ? null : page.source.imgInfo.url);

			var dat = { type: type, index: i, page: page };

			if (type)
				pages.push(dat);

			source.push(dat);
		}

		var bar = eloading.find('.bar');
		bar.css('width', '0%');

		var total = AbCommon.isFunction(options.getTotal) ? options.getTotal(pages.length, urls.length, source.length) : pages.length + urls.length;
		var index = 0;

		return {
			printShapes: printShapes,
			inProc: options.inProc,

			loader: eloading,
			source: source,
			pages: pages,
			urls: urls,
			map: map,
			ps: [],

			end: function (){
				eloading.hide();
			},

			status: function (text){
				eloading.attr('pl-topic', text);
			},

			total: pages.length + urls.length,
			bar: bar,

			progress: function (){
				index++;
				var per = index / total * 100;
	
				//console.log('[PROGRESS] ' + per + '%');
	
				bar.css('width', per.toFixed(1) + '%');	
			}
		};
	},

	promiseRenderCollectPages: function(cp){
		if (AbCommon.isString(cp.inProc))
			cp.status(cp.inProc);

		var printShapes = cp.printShapes;
		var siz = cp.pages.length, engine = this.engine;
		for (var i=0; i < siz; i++){
			var d = cp.pages[i]

			var func = function(resolve, reject){
				var self = arguments.callee.self;
				var d = arguments.callee.d;

				var promise = null;
				if (AbCommon.flag(d.type, 1)){
					promise = self.loadPage(d, true);
				}else{
					promise = new Promise(function(resolve, reject){
						resolve();
					});
				}

				promise
					.then(function(e){
						if (d.page.isReadyImage()){
							return d.page.source.image();
						}
					})
					.then(function(e){
						if (AbCommon.flag(d.type, 2)){
							var ctx = AbGraphics.canvas.createContext();
							engine.renderImage(ctx, d.page, printShapes);
							var src = AbGraphics.canvas.toImage(ctx);
				
							cp.urls[cp.map[d.page.uid]] = src;
						}
						resolve(d.page.uid);
					})
					.catch(function (e){
						reject(e);
					});
			};
			func.d = d;
			func.self = this;

			cp.ps.push(new Promise(func));
		}
	},

	//-----------------------------------------------------------

	printPage: function(){
		if (!this.engine.currentPage)
			return;

		var uid = this.engine.currentPage.uid;
		var idx = this.images.indexOf(uid);

		if (idx < 0)
			return;

		this.exec(function(){
			this.print(idx, idx);
			this.notifyObservers('page.print');
		}, 200);
	},

	printAllPages: function (){
		var siz = this.images.length();

		if (siz > 40){
			AbMsgBox.confirmHtml('인쇄하는 데 오래 걸릴 수 있습니다.<br/>계속 진행하시겠습니까?')
				.then(function(r){
					if (r == 'ok'){
						this.exec(function (){
							this.print(0, siz - 1);
							this.notifyObservers('print');
						}, 300);
					}
				}.bind(this));
		}else{
			this.exec(function(){
				this.print(0, siz - 1);
				this.notifyObservers('print');
			}, 200);
		}
	},

	print: function (start, end){
		var eframe = $('#print-frame');
		var frameDoc = AbCommon.contentDocument(eframe);

		if (!frameDoc){
			AbMsgBox.error('인쇄 프레임에 접근할 수 없습니다');
			return;
		}

		var cp = this.collectPages(start, end, {
			selector: '#print-loading',
			printShapes: this.engine.showShapes(),
			inProc: 'loading',

			exitError: true,
			error: function (index){
				AbMsgBox.error((index + 1) + '번 이미지는 인쇄할 수 없습니다');
			},
		});

		if (!cp) return;

		if (!cp.urls.length){
			AbMsgBox.success('인쇄할 이미지가 없습니다');
			cp.end();
			return;
		}

		this.promiseRenderCollectPages(cp);

		return AbCommon.promiseAll(cp.ps, cp.progress, { term: { progress: 10, promise: 10 } })
			.then(function (){
				//-----------------------------------------------------------
				// IFRAME

				var eprint = $('<div id="print"/>');
				AbPrint.generate(eprint, cp.urls, { orientation: 'auto', progress: cp.progress, term: { progress: 10, promise: 10 } })
					.then(function (){
						var le = $('#loading');
						le.remove();

						setTimeout(function (){
							var html = '<!doctype html>';
							html += '<html lang="en">';
							html += '<head>';
							html += '<meta charset="UTF-8">';
							html += '<title>이미지 뷰어 인쇄 지원</title>';
							html += '<style type="text/css" media="print">';
							html += 'body,html{width:100%;height:100%; margin: 0;}';
							html += '#print,.print,.print>div{width:100%;height:100%}';
							html += '@page{size:A4 portrait!important;orientation:portrait}';
							html += '#loading{display:none}';
							html += '.print{position:relative;margin:0;padding:0;text-align:center;';
							html += 'page-break-after:always;';
							html += '}';
							html += 'img{position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;max-width:100%!important;max-height:100%!important}';
							html += '</style>';
							html += '</head>';
							html += '<body onload="parent.AbImageViewer$$doPrint()" onafterprint="setTimeout(function(){ console.log(\'[PRINT] clear printed data...\'); document.body.innerHTML=\'\'; }, 100);">';
							//html += '<body onload="parent.AbImageViewer$$doPrint()">';
							html += eprint.html();
							html += '</body>';
							html += '</html>';

							frameDoc.open();
							frameDoc.write(html);
							frameDoc.close();
							
						}, 100);
					});

			});
		
		//-----------------------------------------------------------
		// 새창

		// var earg = $('#print-args');
		// if (!earg.length){
		// 	earg = $('<input type="hidden" id="print-args"/>');
		// 	$(document.body).append(earg);
		// }
		// earg.val(JSON.stringify(pages));
		
		// if (this.windowPrint)
		// 	this.windowPrint.focus();

		// this.windowPrint = window.open('viewer.print.html', '_print', 'toolbar=no,menubar=no,status=no');
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
			url: this.openImageUrl,
			data: {
				id: id,
			},
			
			success: function (r){
				this.addImages(r);
				loader.hide();
			},

			error: function (r){
				loader.hide();
			},
		});
	},
	
};
