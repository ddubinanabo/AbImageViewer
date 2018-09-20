<%@page import="com.abrain.wiv.utils.WebUtil"%>
<%@page import="com.abrain.wiv.data.AbBrowserKind"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>

<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>이미지 뷰어</title>
	<!-- <meta http-equiv="X-UA-Compatible" content="IE=edge"> -->

	<link rel="stylesheet" type="text/css" href="resources/css/viewer.css" media="all" />

	<script type="text/javascript" src="resources/js/es6-promise.auto.js"></script>
	<script type="text/javascript" src="resources/js/jquery-3.3.1.min.js"></script>
	<script type="text/javascript" src="resources/js/jquery.form.min.js"></script>
	
	<% AbBrowserKind kind = WebUtil.getBrowser(request); if(kind == AbBrowserKind.ABBROWSER_IE || kind == AbBrowserKind.ABBROWSER_FIREFOX){ %>
	<script type="text/javascript" src="resources/js/vendor/StackBlur.min.js"></script>
	<script type="text/javascript" src="resources/js/vendor/rgbcolor.min.js"></script>
	<script type="text/javascript" src="resources/js/vendor/canvg.min.js"></script>
	<%}%>

	<script type="text/javascript" src="resources/js/vendor/canvas-toBlob.js"></script>
	
	<%/*
	<script type="text/javascript" src="resources/js/jquery-3.3.1.js"></script>
	*/%>
		
	<script type="text/javascript" src="resources/js/vendor/FileSaver.min.js"></script>
	<script type="text/javascript" src="resources/js/vendor/exif.min.js"></script>

	<jsp:include page="/WEB-INF/debug/js-viewer.jsp"></jsp:include>
	<jsp:include page="/WEB-INF/debug/js-i-viewer.jsp"></jsp:include>
	
	<%/*
	<script type="text/javascript" src="resources/js/ab.viewer.min.js"></script>
	<script type="text/javascript" src="resources/js/i.ab.viewer.min.js"></script>
	*/%>
	
	<script type="text/javascript" src="resources/js/ab.view.controller.js"></script>
	<script>
	AbViewController.onInitailize = function(viewer){
		//AbMsgBox.show('오케이');
	};
	</script>
	<style>
	</style>
	</head>
<body>
	<!-- 인자 전달 (시작) -->
	<c:if test="${not empty id}">
		<input type="hidden" id="param-id" value="${id}"/>
	</c:if>
	<c:if test="${not empty q}">
		<input type="hidden" id="param-q" value="${q}"/>
	</c:if>
	<!-- 인자 전달 (끝) -->

	<!-- 테스트	
	<div style="position: absolute; left: 0; top: 0; z-index: 200; background-color: white; padding: 10px;">
		${config.shape.save}
	</div>
	-->

	<div style="display: none;">
		<!-- 섬네일 목록 아이템 시작 -->
		<div id="list-template">
			<ol lt-topic="cover" lt-status="ready">
				<li class="no" lt-topic="no"></li>
				<li class="ground">
					<div class="cover">
						<div class="content"></div>
						<img lt-topic="image" src="" class="thumb"/>
					</div>
					<label lt-topic="check.cover" class="checkpoint" title="이미지 선택">
						<input type="checkbox" lt-topic="check"/>
						<span class="checkmark"></span>
					</label>
					<label lt-topic="bookmark.cover" class="bookmark" title="북마크 설정/해제">
						<input type="checkbox" lt-topic="bookmark"/>
						<span class="checkmark"></span>
					</label>
					<div lt-topic="annotation" class="annotation" title="주석/마스킹 있음"></div>
					<div lt-topic="info" class="info" title="이미지 정보"></div>
				</li>
				<li class="display">
					<span class="text" lt-topic="text"></span>
				</li>
			</ol>
		</div>
		<!-- 섬네일 목록 아이템 끝 -->
		<!-- 문서 전송 양식 시작 -->
		<div id="doc-forms"></div>
		<!-- 문서 전송 양식 끝 -->
		<!-- 이미지 전송 양식 시작 -->
		<div id="save-forms"></div>
		<!-- 이미지 전송 양식 끝 -->
		<!-- 인쇄 이미지 전송 양식 시작 -->
		<div id="print-support-forms"></div>
		<!-- 인쇄 이미지 전송 양식 끝 -->
	</div>
	<header class="abv-header">
		<!--<div>뷰어헤더</div>-->
	</header>
	<nav class="abv-nav noselection">
		<div class="abv-toolbar tb-toolbar main-toolbar hide" id="tb-main">
			<!--툴바-->
			<ul class="horiz tb-main">
				<li tb-topic="file.open" title="이미지 열기" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_01.png"/></li>
				<li tb-topic="file.save.image" title="이미지 저장" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_02.png"/></li>
				<li class="sep" tb-topic="file.save.annotation" title="주석/마스킹 정보 저장" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_03.png"/></li>
				<li class="sep" tb-topic="send.server" title="서버 전송" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_03-01.png"/></li>
				<li class="sep" tb-topic="page.remove" title="현재 이미지 삭제" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_04.png"/></li>
				<li tb-topic="page.print" title="현재 이미지 인쇄" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_05.png"/></li>
				<li class="sep" tb-topic="print" title="전체 이미지 인쇄" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_06.png"/></li>
				<li tb-topic="zoom.in" title="확대" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_07.png"/></li>
				<li class="sep" tb-topic="zoom.out" title="축소" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_08.png"/></li>
				<li tb-topic="zindex.front" title="맨 앞으로 가져오기" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_09.png"/></li>
				<li tb-topic="zindex.forward" title="앞으로 가져오기" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_10.png"/></li>
				<li tb-topic="zindex.backward" title="뒤로 보내기" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_11.png"/></li>
				<li class="sep" tb-topic="zindex.back" title="맨 뒤로 보내기" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_12.png"/></li>
				<li tb-topic="fit.horiz" title="너비 맞춤" tb-type="radio" tb-group="fit" tb-user-lock="uncheck"><img class="tb-btn" src="resources/icon/tbm_13.png"/></li>
				<li tb-topic="fit.vert" title="높이 맞춤" tb-type="radio" tb-group="fit" tb-user-lock="uncheck"><img class="tb-btn" src="resources/icon/tbm_14.png"/></li>
				<li class="sep" tb-topic="fit.in" title="화면 맞춤" tb-type="radio" tb-group="fit" tb-user-lock="uncheck" tb-status="checked"><img class="tb-btn" src="resources/icon/tbm_15.png"/></li>
				<li tb-topic="page.rotate.ccw" title="화면 회전 (반시계)" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_16.png"/></li>
				<li tb-topic="page.rotate.cw" title="화면 회전" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_17.png"/></li>
				<li class="sep" tb-topic="page.rotate.180" title="화면 회전 (180º)" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_18.png"/></li>
				<li tb-topic="mode" title="편집/보기 모드" tb-type="check" tb-status="checked"><img class="tb-btn" src="resources/icon/tbm_19.png" ></li>
				<li class="sep" tb-topic="show.shapes" title="주석/마스킹 보기/감추기" tb-type="check" tb-status="checked"><img class="tb-btn" src="resources/icon/tbm_20.png"></li>
				<li class="sep" tb-topic="clear.shapes" title="주석/마스킹 초기화" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_21.png"></li>
				<li class="sep nowrap">
					<img src="resources/icon/tbm_22-01.png" class="tb-lmar" tb-topic="page.prev" title="이전 이미지" tb-type="click"/>
					<input type="text" class="center" tb-topic="page.no" tb-type="text" size="1" value="0" disabled="disabled"/> / <span tb-topic="page.total" tb-type="label">0</span>
					<img src="resources/icon/tbm_22-02.png" class="tb-rmar" tb-topic="page.next" title="다음 이미지" tb-type="click"/>
				</li>
				<li>
					<div class="custom-select">
					<select tb-topic="page.scale" tb-type="select" title="화면 비율">
						<option>비율</option>
						<option value="fit.in" selected="selected">화면 맞춤</option>
						<option value="fit.horiz">너비 맞춤</option>
						<option value="fit.vert">높이 맞춤</option>
						<option value="100%">원본</option>
						<option value="10%">10%</option>
						<option value="20%">20%</option>
						<option value="30%">30%</option>
						<option value="40%">40%</option>
						<option value="50%">50%</option>
						<option value="60%">60%</option>
						<option value="70%">70%</option>
						<option value="80%">80%</option>
						<option value="90%">90%</option>
						<option value="150%">150%</option>
						<option value="200%">200%</option>
						<option value="250%">250%</option>
						<option value="300%">300%</option>
						<option value="350%">350%</option>
						<option value="400%">400%</option>
						<option value="450%">450%</option>
						<option value="500%">500%</option>
					</select>
					</div>
				</li>
			</ul>
		</div>
	</nav>
	<section class="abv-body">
		<aside class="abv-left-side tb-toolbar noselection" id="tb-left">
			<!--툴바-->
			<ul class="vert">
				<li tb-topic="pages" title="목록" tb-type="radio" tb-status="checked" tb-group="left"><img class="tb-btn" src="resources/icon/tbl_01.png"/></li>
				<li tb-topic="bookmarks" title="북마크 목록" tb-type="radio" tb-group="left"><img class="tb-btn" src="resources/icon/tbl_02.png"/></li>
			</ul>
			<div>&nbsp;</div>
			<!--툴바-->
			<ul class="vert">
				<li tb-topic="thumb-popup.open" title="모아보기" tb-type="click"><img class="tb-btn" src="resources/icon/tbl_03.png"></li>
			</ul>
		</aside>
		<aside class="abv-thumbnails noselection">
			<section id="thumbnails">
				<nav class="head">
					<label class="checkbox" title="전체 선택">
						<input type="checkbox" lt-topic="all"/>
						<span class="checkmark"></span>
					</label>
					
					<div class="custom-select">
					<select lt-topic="viewsize" title="목록 스타일">
						<option value="10">10개</option>
						<option value="20">20개</option>
						<option value="30">30개</option>
						<option value="all">전체</option>
					</select>
					</div>			
				</nav>
				<div class="adv-list">
					<ul>
						<li lt-topic="container">
							<!-- 섬네일 목록 시작 -->
							<!-- 섬네일 목록 끝 -->
						</li>
					</ul>
				</div>
				<nav class="foot">
					<div class="paginate"><!-- 페이지 네비게이션 --></div>
				</nav>
			</section>
			<section id="bookmarks" class="hide">
				<nav class="head">
					<label class="checkbox" title="전체 선택">
						<input type="checkbox" lt-topic="all"/>
						<span class="checkmark"></span>
					</label>
					
					<div class="custom-select">
					<select lt-topic="viewsize" title="목록 스타일">
						<option value="10">10개</option>
						<option value="20">20개</option>
						<option value="30">30개</option>
						<option value="all">전체</option>
					</select>
					</div>			
				</nav>
				<div class="adv-list">
					<ul>
						<li lt-topic="container">
							<!-- 섬네일 목록 시작 -->
							<!-- 섬네일 목록 끝 -->
						</li>
					</ul>
				</div>
				<nav class="foot">
					<div class="paginate"><!-- 북마크 네비게이션 --></div>
				</nav>
			</section>
		</aside>
		<section class="abv-view">
			<nav class="tb-toolbar abstyler noselection">
				<div id="abstyler" class="abstyler-body"></div>
				<!-- 도형 스타일 시작 -->
				<!-- 도형 스타일 끝 -->
			</nav>
			
			<div class="abv-canvas">
				<div class="abv-canvas-wrap">
					<div class="abv-canvas-inwrap">
						<div id="engine" class="canvas"><!--<div style="position: absolute;">캔버스</div>--></div>
					</div>
				</div>
			</div>
		</section>	
		<aside class="abv-right-side noselection tb-toolbar" id="rb-right">
			<div class="vblock" title="주석"></div>
			<ul class="vert">
				<li tb-topic="annotation.cursor" title="선택하기" tb-type="radio" tb-group="draw" tb-status="checked"><img class="tb-btn" src="resources/icon/cursor.png"/></li>
				<li ve-type="creation" tb-topic="annotation.rectangle" title="사각형 그리기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_01.png"/></li>
				<li ve-type="creation" tb-topic="annotation.ellipse" title="원형 그리기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_02.png"/></li>
				<li ve-type="creation" tb-topic="annotation.line" title="선 그리기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_03.png"/></li>
				<li ve-type="creation" tb-topic="annotation.arrow" title="화살표 그리기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_04.png"/></li>
				<li ve-type="creation" tb-topic="annotation.pen" title="펜으로 그리기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_05.png"/></li>
				<li ve-type="creation" tb-topic="annotation.highlightpen" title="형판펜으로 칠하기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_06.png"/></li>
				<li ve-type="creation" tb-topic="annotation.textbox" title="메모하기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_07.png"/></li>
				<li ve-type="creation" tb-topic="annotation.checker" title="체크" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_08.png"/></li>
			</ul>
			<div class="vhblock" title="마스킹"></div>
			<ul class="vert">
				<li ve-type="creation" tb-topic="masking.rectangle" title="사각형으로 마스킹" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_09.png"/></li>
				<li ve-type="creation" tb-topic="masking.ellipse" title="원형으로 마스킹" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_10.png"/></li>
			</ul>
		</aside>
		<!-- 섬네일 모아보기 시작 -->
		<div class="abv-thumb-popup abv-hide-thumbnails-popup-layer noselection" id="thumbnails-popup-layer">
			<section>
				<aside class="abv-left-side tb-toolbar noselection" id="tb-thumb-popup-left">
					<!--툴바-->
					<ul class="vert">
						<li tb-topic="thumb-popup.pages" title="목록" tb-type="radio" tb-status="checked" tb-group="thumb-popup.left"><img class="tb-btn" src="resources/icon/tbl_03.png"></li>
						<li tb-topic="thumb-popup.bookmarks" title="북마크 목록" tb-type="radio" tb-group="thumb-popup.left"><img class="tb-btn" src="resources/icon/tbl_02.png"></li>
					</ul>
					<div>&nbsp;</div>
					<!--툴바-->
					<ul class="vert">
						<li tb-topic="thumb-popup.close" title="기본보기" tb-type="click"><img class="tb-btn" src="resources/icon/tbl_01.png"></li>
					</ul>
				</aside>
				<!-- 섬네일 이미지 목록 시작 -->
				<section class="abv-thumbnails">
					<section class="adv-thumb-popup-list" id="thumbnails-popup">
						<nav class="head">
							<label class="checkbox" title="전체 선택">
								<input type="checkbox" lt-topic="all"/>
								<span class="checkmark"></span>
							</label>
							
							<div class="custom-select">
							<select lt-topic="viewsize" title="목록 스타일">
								<option value="10">10개</option>
								<option value="30">30개</option>
								<option value="40">40개</option>
								<option value="50">50개</option>
								<option value="100">100개</option>
								<option value="all">전체</option>
							</select>
							</div>			
						</nav>
						<div class="adv-list">
							<ul>
								<li lt-topic="container">
									<!-- 섬네일 목록 시작 -->
									<!-- 섬네일 목록 끝 -->
								</li>
							</ul>
						</div>
						<nav class="foot">
							<div class="paginate"><!-- 페이지 네비게이션 --></div>
						</nav>
					</section>
					<section class="adv-thumb-popup-list hide" id="bookmarks-popup">
						<nav class="head">
							<label class="checkbox" title="전체 선택">
								<input type="checkbox" lt-topic="all"/>
								<span class="checkmark"></span>
							</label>
							
							<div class="custom-select">
							<select lt-topic="viewsize" title="목록 스타일">
								<option value="10">10개</option>
								<option value="30">30개</option>
								<option value="40">40개</option>
								<option value="50">50개</option>
								<option value="100">100개</option>
								<option value="all">전체</option>
							</select>
							</div>			
						</nav>
						<div class="adv-list">
							<ul>
								<li lt-topic="container">
									<!-- 섬네일 목록 시작 -->
									<!-- 섬네일 목록 끝 -->
								</li>
							</ul>
						</div>
						<nav class="foot">
							<div class="paginate"><!-- 페이지 네비게이션 --></div>
						</nav>
					</section>
				</section>
				<!-- 섬네일 이미지 목록 끝 -->
			</section>
		</div>
		<!-- 섬네일 모아보기 끝 -->
	</section>
	<footer class="abv-footer">
		<div>카피라이터</div>
	</footer>

	<!-- Color Picker 시작 -->
	<div id="picker" class="ab-color-picker">
		<div class="edit-panel">
			<div class="sample-boxes"></div>
			<div class="ui-color-picker"></div>
			<div class="user-boxes"></div>
		</div>
		<div class="ctrl-panel">
			<div class="cp-left">
				<input class="btn-notset" type="button" cmd="notset" value="색상없음"/>
			</div>
			<div class="cp-right">
				<input class="btn-ok" type="button" cmd="ok" value="확인"/>
				<input class="btn-cancel" type="button" cmd="cancel" value="취소"/>
			</div>				
		</div>
	</div>
	<!-- Color Picker 끝 -->
	<!-- 메시지 박스 시작 -->
	<div id="img-info" class="modal img-info">
		<div class="body">
			<span class="close" mb-topic="cancel">&times;</span>
			<header></header>
			<div></div>
			<footer>
				<input type="button" mb-topic="ok" value="확인"/>
			</footer>
		</div>
	</div>
	<!-- 메시지 박스 끝 -->
	<!-- 인쇄 메시지 시작 -->
	<div id="print-loading" pl-topic="ready" class="center-flybox">
		<ul>
			<li>
				<div class="window">
					<ul class="pl-ready fhoriz fcenter">
						<li><div class="loader"></div></li>
						<li class="text">인쇄할 이미지들을 계산 중입니다...</li>
					</ul>
					<ul class="pl-proc fvert fcenter pad10">
						<li><div class="loader"></div></li>
						<li>&nbsp;</li>
						<li class="fullwide"><div class="progress"><div class="bar"></div></div></li>
						<li class="text">인쇄할 이미지들을 준비 중입니다...</li>
					</ul>					
					<ul class="pl-build fhoriz fcenter">
						<li><div class="loader"></div></li>
						<li class="text">인쇄 자료를 생성 중입니다...</li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
	<!-- 인쇄 메시지 끝 -->
	<!-- 인쇄용 IFRAME 시작 -->
	<iframe id="print-frame" style="display: none"></iframe>
	<!-- 인쇄용 IFRAME 끝 -->
	<!-- 파일 로드 메시지 시작 -->
	<div id="file-loading" pl-topic="loading" class="center-flybox">
		<ul>
			<li>
				<div class="window">
					<ul class="pl-loading fvert fcenter pad10">
						<li><div class="loader"></div></li>
						<li>&nbsp;</li>
						<li class="fullwide"><div class="progress"><div class="bar"></div></div></li>
						<li class="text">이미지들을 로드 중입니다...</li>
					</ul>					
				</div>
			</li>
		</ul>
	</div>
	<!-- 파일 로드 메시지 끝 -->
	<!-- 서버 전송 메시지 시작 -->
	<div id="server-saving" pl-topic="ready" class="center-flybox">
		<ul>
			<li>
				<div class="window">
					<ul class="pl-ready fhoriz fcenter">
						<li><div class="loader"></div></li>
						<li class="text">전송할 이미지들을 계산 중입니다...</li>
					</ul>
					<ul class="pl-proc fvert fcenter pad10">
						<li><div class="loader"></div></li>
						<li>&nbsp;</li>
						<li class="fullwide"><div class="progress"><div class="bar"></div></div></li>
						<li class="text">이미지들을 전송중입니다...</li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
	<!-- 서버 전송 메시지 끝 -->	
	<!-- 서버 로드 메시지 시작 -->
	<div id="server-loading" pl-topic="loading" class="center-flybox">
		<ul>
			<li>
				<div class="window">
					<ul class="pl-loading fhoriz fcenter">
						<li><div class="loader"></div></li>
						<li class="text" pl-topic="text"></li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
	<!-- 서버 로드 메시지 끝 -->
	
	<!-- 테스트 패널 -->
	<jsp:include page="/WEB-INF/debug/view-home.jsp"></jsp:include>
</body>
</html>
