/**
 * 서버 연결 유지 도구
 * @namespace
 */
var AbNoop = {
	/**
	 * 접속 URL
	 * @memberof AbNoop
	 * @static
	 */
	url: 'api/noop',
	/**
	 * 접속 간격입니다.
	 * <p>* 1/1000초
	 * @memberof AbNoop
	 * @default
	 */
	interval: 60000, // 60초
		
	/**
	 * 연결 유지를 시작합니다.
	 * @memberof AbNoop
	 */
	exec: function(){
		var noop = function (){
			$.ajax({
				type: 'POST',
				url: AbNoop.url,
				data: null,
				async: true,
				//dataType: 'text',
				timeout: 1000000,
				success: function (result) {
					console.log('[NOOP] ok !!!');
				},
				
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					console.log('[NOOP] error !!!');
				}
			});
		};
		
		setInterval(noop, AbNoop.interval);
	},
};