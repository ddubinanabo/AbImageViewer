/**
 * 서버 제공 정보들
 * @namespace Server
 */

/**
 * 이미지 정보
 * <p>* 서버에서 제공합니다.
 * @memberof Server
 * @typedef {Object} ImageData
 * @property {Number} angle 이미지 회전 각도
 * @property {String} decoder 이미지 렌더링 힌트 (jpeg|png)
 * @property {Number} width 이미지 폭
 * @property {Number} height 이미지 높이
 * @property {String} image 이미지 URL
 * @property {String} thumbnail 섬네일 이미지 URL
 * @property {String} shapes 도형 XML 문자열
 * @property {AbImage.Metadata} info 이미지 메타데이터
 */

/**
 * 이미지 정보 목록
 * <p>* 서버에서 제공합니다.
 * <p>* 이미지 목록 로드, 서버 폴더, 문서 컨버팅 시에 전달되는 정보입니다.
 * @memberof Server
 * @typedef {Array.<Server.ImageData>} ImageList
 */

/**
 * 이미지 목록 정보
 * <p>* 아이디로 서버에 요청하면 제공하는 정보입니다.
 * <p>* URL: api/images
 * @see {@link AbImageViewer#URLS|AbImageViewer.URLS}의 OPEN 필드를 참고하세요.
 * @memberof Server
 * @typedef {Object} LoadImageData
 * @property {Array.<Number>} bookmarks 북마크 인덱스 배열<p>* images의 인덱스 배열입니다.
 * @property {Server.ImageList} images 이미지 정보 목록
 */

/**
 * 서버의 AbAllocKeyData 데이터
 * @memberof Server
 * @typedef {Object} AbAllocKeyData
 * @property {String} key 아이디
 * @property {String} time 발급일시(17자리)<p>* yyyyMMddHHmmssSSS 형식
 */