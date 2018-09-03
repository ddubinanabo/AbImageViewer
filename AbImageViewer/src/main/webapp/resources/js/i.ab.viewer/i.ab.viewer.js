var iAbViewer = {
	URLS: {
		FOLDER: 'api/ext/folder',
		FILE: 'api/ext/file',
	},

	//-----------------------------------------------------------
		
	viewers: {},

	//-----------------------------------------------------------
	
	regist: function (viewer, name){
		if (!name) name = 'main';
		this.viewers[name] = viewer;
	},
	
	release: function (name){
		if (!name) name = 'main';
		delete this.viewers[name];
	},
	
	get: function(name){
		if (!name) name = 'main';
		return this.viewers[name];
	},

	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	
	// 이 함수로 변경된 사항은 History에 기록되지 않습니다.
	view: function (directoryPath, combinedDisplayText, options){
		if (!options) options = {};
		if (!options.errorMessage) options.errorMessage = '원격 이미지 정보(들)를 조회하는 데 실패했습니다';
		
		var self = this;
		
		return new Promise(function(resolve, reject){
			AbCommon.ajax({
				url: self.URLS.FOLDER,
				data: {
					q: directoryPath,
					t: combinedDisplayText
				},
				
				success: function(r){
					this.get(options.name).addImages(r)
						.then(function(){
							if (AbCommon.isFunction(options.resolve))
								options.resolve();
							
							resolve();
						})
						.catch(function(e){
							if (AbCommon.isFunction(options.reject))
								options.reject(e);
							
							reject(e);
						});
				}.bind(self),
				
				error: function(xhr, textStatus, errorThrown){
					var e = new Error(options.errorMessage);
					
					if (AbCommon.isFunction(options.reject))
						options.reject(e);
					
					reject(e);
				}
			});
		})
			.then(function(){
				// exec
			});
	},
	
	// 이 함수로 변경된 사항은 History에 기록되지 않습니다.
	viewMain: function (index, imagePath, annotationPath, options){
		if (!options) options = {};
		if (!options.errorMessage) options.errorMessage = '원격 이미지 정보(들)를 조회하는 데 실패했습니다';
	
		var self = this;
		
		return new Promise(function(resolve, reject){
			AbCommon.ajax({
				url: self.URLS.FILE,
				data: {
					q: imagePath,
					a: annotationPath,
				},
				
				success: function(r){
					if (r){
						this.get(options.name).changeImage(index, r, options)
							.then(function(){
								if (AbCommon.isFunction(options.resolve))
									options.resolve();
								
								resolve();
							})
							.catch(function(e){
								reject(e);
							});
					}else{
						if (AbCommon.isFunction(options.resolve))
							options.resolve();
						
						resolve();
					}
				}.bind(self),
				
				error: function(xhr, textStatus, errorThrown){
					var e = new Error(options.errorMessage);
					
					if (AbCommon.isFunction(options.reject))
						options.reject(e);
					
					reject(e);
				}
			});
		})
			.then(function(){
				// exec
			});
	},
};