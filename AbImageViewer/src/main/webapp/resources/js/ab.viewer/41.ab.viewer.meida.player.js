/**
 * 미디어 플레이어
 * @class
 * @param {Object} options 옵션
 * @param {AbViewerEngine} options.engine 엔진 인스턴스
 */
function AbViewerMediaPlayer(options){
	if (!options) options = {};

	/**
	 * 엔진 인스턴스
	 * @type {AbViewerEngine}
	 */
	this.engine = options.engine || null;

	//-----------------------------------------------------------

	/**
	 * 비디오 HTML jQueryObject
	 * @private
	 * @type {jQueryObject}
	 */
	this.video = null;
	/**
	 * 오디오 HTML jQueryObject
	 * @private
	 * @type {jQueryObject}
	 */
	this.audio = null;
}

AbViewerMediaPlayer.prototype = {
	constructor: AbViewerMediaPlayer,

	//-----------------------------------------------------------

	/**
	 * 미디어 HTML 엘리먼트들을 생성합니다.
	 */
	install: function (){
		var panel = this.engine.panel;

		this.video = $('<video style="width: 100%; height: 100%; display: none;" controls="controls" preload="none"></video>');
		this.audio = $('<audio style="width: 100%; height: 100%; display: none;" controls="controls" preload="none"></audio>');

		panel.append(this.video);
		panel.append(this.audio);
	},

	/**
	 * 미디어 플레이어를 표시합니다.
	 * @param {String} type 미디어 타입 (video|audio)
	 */
	show: function(type){
		switch (type){
		case 'video':
			this.command(this.audio, 'pause');

			this.audio.hide();
			this.video.show();
			break;
		case 'audio':
			this.command(this.video, 'pause');

			this.video.hide();
			this.audio.show();
			break;
		}
	},

	/**
	 * 미디어 플레이어를 숨깁니다.
	 * @param {String} type 미디어 타입 (video|audio)
	 */
	hide: function(type){
		switch (type){
		case 'video':
			this.command(this.video, 'pause');
			this.video.hide();
			break;
		case 'audio':
			this.command(this.audio, 'pause');
			this.audio.hide();
			break;
		default:
			this.command(this.video, 'pause');
			this.command(this.audio, 'pause');

			this.video.hide();
			this.audio.hide();
			break;
		}
	},

	/**
	 * 미디어를 설정합니다.
	 * @param {String} type 미디어 타입 (video|audio)
	 * @param {String} mime MIME 타입
	 * @param {String} src 미디어 URI
	 */
	set: function(type, mime, src){
		var player = null;
		switch (type){
		case 'video':
			player = this.video;
			break;
		case 'audio':
			player = this.audio;
			break;
		}

		if (player){
			var e = player.find('source');
			if (!e.length){
				e = $('<source></source>');
				player.append(e);
			}
			e.attr('type', mime);
			e.attr('src', src);

			this.command(player, 'load');
		}
	},

	/**
	 * 미디어 명령을 수행합니다.
	 * @private
	 * @param {jQueryObject} e 미디어 HTML jQueryObject
	 * @param {String} cmd 수행 명령어
	 */
	command: function (e, cmd){
		try
		{
			var element = e && e.length ? e.get(0) : null;
			if (element){
				var a = [];
				for (var i=2; i < arguments.length; i++) a.push(arguments[i]);

				switch(cmd){
				case 'load': return element.load.apply(element, a);
				case 'play': return element.play.apply(element, a);
				case 'pause': return element.pause.apply(element, a);

				case 'addTextTrack': return element.addTextTrack.apply(element, a);
				case 'captureStream': return element.captureStream.apply(element, a);
				case 'canPlayType': return element.canPlayType.apply(element, a);

				case 'mozCaptureStream': return element.mozCaptureStream.apply(element, a);
				case 'mozCaptureStreamUntilEnded': return element.mozCaptureStreamUntilEnded.apply(element, a);
				case 'mozGetMetadata': return element.mozGetMetadata.apply(element, a);

				case 'fastSeek': return element.fastSeek.apply(element, a);
				case 'seekToNextFrame': return element.seekToNextFrame.apply(element, a);
				case 'setMediaKeys': return element.setMediaKeys.apply(element, a);
				case 'setSinkId': return element.setSinkId.apply(element, a);
				}
			}
			return null;
		}
		catch(e)
		{	
			return null;
		}
	},
};