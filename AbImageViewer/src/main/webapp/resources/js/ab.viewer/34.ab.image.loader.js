var AbImageLoader = {
	multiImages: [],
	docs: [],

	executePath : 'js/works/',
	executeMin : false,
	
	urlConverter: 'http://localhost:8084/wiv/api/doc',

	//-----------------------------------------------------------

	workerPath: function (workName){
		return this.executePath + workName + (this.executeMin ? '.min.js' : '.js');
	},

	//-----------------------------------------------------------

	load: function(data){
		var engine = null;
		if (AbCommon.isFileData(data)){
			engine = this.test(data.name, data.type);
		}else if (AbCommon.isString(data)){
			data = {
				name: data,
				type: '',
				size: 0,
			};
			engine = this.test(data.name, data.type);
		}

		var loader = null;
		switch (engine){
		case 'doc':
			this.docs.push({ engine: engine, data: data});
			return null;

		case 'tif':
			return null;

		case 'j2k':
			return null;
			
		case 'def':
			if (AbCommon.supportWebWorker()){
				var workerPath = this.workerPath('work.def');
				loader = function(){
					var data =  arguments.callee.data;

					return new Promise(function (resolve, reject){
						var worker = new Worker(workerPath);

						worker.onerror = function(e){
							setTimeout(reject.bind(null, e), 0);
							worker.terminate();
						};

						worker.onmessage = function (e){
							setTimeout(resolve.bind(null, { type: 'file', image: e.data.image, data: e.data.data }), 0);
							worker.terminate();
						};

						worker.postMessage(data);
					});
				};
				loader.data = data;
			}else{
				loader = function(){
					var data =  arguments.callee.data;

					return new Promise(function (resolve, reject){
						var reader = new FileReader();
						reader.onload = function(event){
							setTimeout(resolve.bind(null, { type: 'file', image: event.target.result, data: data }), 0);
						};
						reader.onerror = function (e){
							reader.abort();
							setTimeout(reject.bind(null,e), 0);
						};

						reader.readAsDataURL(data);
					});
				};
				loader.data = data;
			}

			return loader;
		}

		loader = function(){
			var data =  arguments.callee.data;

			return new Promise(function (resolve, reject){
				setTimeout(reject.bind(null,new Error('Not support file format')), 0);
			});
		};
		loader.data = data;

		return loader;
	},

	test: function (name, type){
		if (!name) return null;

		name = name.toLowerCase();

		if (name.match('\.jp2$|\.j2x$|\.j2k$|\.j2c$')){
			return 'j2k';
		}
		if (name.match('\.doc$|\.docx$|\.xls$|\.xlsx$|\.ppt$|\.pptx$|\.hwp$|\.pdf$')){
			return 'doc';
		}
		if (type === 'image/tiff'){
			return 'tif';
		}
		if (type === 'image/svg+xml'){
			return 'svg';
		}
		switch(type){
		case 'image/jpeg': case 'image/png': case 'image/apng': case 'image/bmp': case 'image/gif':
			return 'def';
		}

		// if (!type.match('image.*')){
		// 	return null;
		// }

		// firefox 기준 지원 이미지 포맷
		// - jpeg (image/jpeg)
		// - gif (image/gif)
		// - png (image/png)
		// - apng (image/apng)
		// - svg (image/svg+xml)
		// - bmp (image/bmp)
		// - bmp ico (image/vnd.microsoft.icon, image/x-icon, image/ico, image/icon, text/ico, application/ico)

		// image viewer 지원 이미지 포맷
		// - image
		// 		- jpeg
		// 		- gif
		// 		- png
		// 		- apng
		// 		- svg
		// 		- bmp
		// 		- jpeg2000 (준비중)
		// 		- tiff (준비중)
		// - document (준비중)
		// 		- doc
		// 		- docx
		// 		- xls
		// 		- xlsx
		// 		- ppt
		// 		- pptx
		// 		- hwp
		// 		- pdf

		return null;
	},

	analysis: function (files){
		var siz = files.length;
		var d = { doc: 0, img: 0, etc: 0 };
		for (var i=0; i < siz; i++){
			var file = files[i];

			var r = this.test(file.name, file.type);
			switch(r){
			case 'doc':
				d.doc++;
				break;
			case 'def': case 'j2k': case 'tif': case 'svg':
				d.img++;
				break;
			default:
				d.etc++;
				break;
			}
		}
		return d;
	},

	needExternalProcess: function() { return this.multiImages.length > 0 || this.docs.length > 0; },

	doExternalProcess: function(options){
		if (!options) options = {};

		var total = this.docs.length + this.multiImages.length;

		if (AbCommon.isFunction(options.begin))
			options.begin(total);

		var index = 0;

		var callback = function(){
			index++;

			if (AbCommon.isFunction(options.next))
				options.next(total, index);

			if (index >= total){
				if (AbCommon.isFunction(options.end))
					options.end(total);
			}
		};

		this.$doRemoteProcess(total, options, callback);
	},

	$doRemoteProcess: function (total, options, callback){
		var forms = $('#doc-forms');
		// 혹시 남을 수 있는 경우를 대비한 코드
		var cleared = 0;
		var clear = function(){
			var siz = arguments.length.siz;

			cleared++;

			if (cleared == siz){
				forms.empty();
			}
		};
		clear.siz = this.docs.length;

		var url = this.urlConverter;
		var siz = this.docs.length;
		for (var i=0; i < siz; i++){
			var d = this.docs[i];

			if (d.engine === 'doc'){
				var loaded = function(event){
					var data = arguments.callee.data;

					var baData =  event.target.result;
					var b64 = baData.substr(baData.indexOf(",") + 1);

					var html = '<form enctype="multipart/form-data"><input type="hidden" name="name"/><input type="hidden" name="content"/></form>';
					var e = $(html);

					e.find('[name="name"]').val(data.name);
					e.find('[name="content"]').val(b64);

					forms.append(e);

					try
					{
						var success = function(r, status, xhr, $form){
							var data = arguments.callee.data;

							$form.remove();
							clear();

							console.log('OK!!');
							
							if (AbCommon.isFunction(options.getList))
								options.getList(r,  { type: 'doc', data: data });

							if (AbCommon.isFunction(callback))
								callback();
						};
						success.data = data;

						AbCommon.ajaxSubmit(e, {
							title: '문서 변환',
							url: url,
							success: success,

							error: function(e, $form){
								$form.remove();
								clear();

								console.log(e);

								if (AbCommon.isFunction(callback))
									callback();
							},
						});
					}
					catch (e)
					{
						clear();
					}
				};
				loaded.data = d.data;

				var error = function (e){
					reader.abort();

					if (AbCommon.isFunction(options.error))
						options.error(e);

					if (AbCommon.isFunction(callback))
						callback();
				};

				var reader = new FileReader();
				reader.onload = loaded;
				reader.onerror = error;

				reader.readAsDataURL(d.data);
			}
		}

		this.docs.splice(0, this.docs.length);
	},
};

