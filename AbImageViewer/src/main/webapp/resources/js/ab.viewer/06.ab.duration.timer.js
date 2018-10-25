
//-------------------------------------------------------------------------------------------------------
// Duration Time
//-------------------------------------------------------------------------------------------------------

/**
 * 진행 시간 측정 도구
 * @namespace
 */
var AbDurationTimer = {

	/**
	 * 측정 시간 저장소
	 * @memberof AbDurationTimer
	 * @private
	 * @type {Object}
	 */
	data: {},

	/**
	 * 측정 시작
	 * <p>측정 시간을 name으로 저장소에 기록합니다.
	 * @memberof AbDurationTimer
	 * @param {String} name=def 이름
	 */
	start: function (name){
		if (typeof name == 'undefined' || !name) name = 'def';
		
		this.data[name] = {
			start: new Date(),
			end: null,
		};
	},

	/**
	 * 측정 종료
	 * @memberof AbDurationTimer
	 * @param {String} name=def 이름
	 * @param {Boolean} logging=true 로드 표시 여부 
	 */
	end: function (name, logging){
		if (typeof name == 'undefined' || !name) name = 'def';
		if (typeof logging == 'undefined') logging = true;
		
		if (this.data[name]){
			this.data[name].end = new Date();
		}else{
			this.data[name] = {
				start: null,
				end: new Date()
			}
		}
		
		if (logging)
			this.log(name);
	},
	
	/**
	 * 측정 시간을 로그에 기록합니다.
	 * @memberof AbDurationTimer
	 * @private
	 * @param {String} name=def 이름
	 */
	log: function (name){
		if (typeof name == 'undefined' || !name) name = 'def';
		
		var msg = '';
		if (this.data[name]){
			var d = this.data[name];
			if (d.start && d.end){
				var term = d.end.getTime() - d.start.getTime();
				msg = term + 'ms' + ' ' + (term / 1000) + 's';
			}else{
				if (!d.start)
					msg = 'start is null';
				
				if (!d.end)
					msg = 'end is null';
			}
		}else{
			msg = 'not found';
		}
		
		console.log('[' + name + '] ' + msg);
	}
};
