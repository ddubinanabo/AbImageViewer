<%@page import="com.abrain.wiv.utils.WebUtil"%>
<%@page import="com.abrain.wiv.enums.AbBrowserKind"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>

<!doctype html>
<html lang="en">
<head class="noselection">
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
	
	<script type="text/javascript" src="resources/lib/pdf/pdf.js"></script>

	<%/*
	<jsp:include page="/WEB-INF/debug/js-viewer.jsp"></jsp:include>
	<jsp:include page="/WEB-INF/debug/js-i-viewer.jsp"></jsp:include>
	<script type="text/javascript" src="resources/js/ab.view.controller.js"></script>
	*/%>
	
	<script type="text/javascript" src="resources/js/ab.viewer.min.js"></script>
	<script type="text/javascript" src="resources/js/i.ab.viewer.min.js"></script>
	<script type="text/javascript" src="resources/js/ab.view.controller.min.js"></script>
	
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
	<c:if test="${not empty a}">
		<input type="hidden" id="param-a" value="${a}"/>
	</c:if>
	<!-- 인자 전달 (끝) -->

	<!-- 테스트	
	<div style="position: absolute; left: 0; top: 0; z-index: 200; background-color: white; padding: 10px;">
		${config.viewer.shape.save}
	</div>
	-->

	<div style="display: none;">
		<!-- 섬네일 목록 아이템 시작 -->
		<div id="list-template">
			<ol lt-topic="cover" lt-status="ready">
				<li class="no" lt-topic="no"></li>
				<li class="ground">
					<div class="cover">
						<div class="wrap">
							<div class="content"></div>
							<img lt-topic="image" src="" class="thumb"/>
						</div>
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
		<!-- 하단 섬네일 목록 아이템 시작 -->
		<div id="sub-list-template">
			<ol lt-topic="cover" lt-status="ready">
				<li class="no" lt-topic="no"></li>
				<li class="ground">
					<div class="cover">
						<div class="wrap">
							<div class="content"></div>
							<img lt-topic="image" src="" class="thumb"/>
						</div>
					</div>
					<label lt-topic="check.cover" class="checkpoint" title="이미지 선택">
						<input type="checkbox" lt-topic="check"/>
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
		<!-- 하단 섬네일 목록 아이템 끝 -->
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
	<c:if test="${config.viewer.toolbar.hasLayout('all','main') && config.auth.permission('layout.main')}">
	<nav class="abv-nav noselection" ab-perm="layout.main" ab-layout="all, main">
		<div class="abv-toolbar tb-toolbar main-toolbar hide" id="tb-main">
			<!--툴바-->
			<ul class="horiz tb-main">
				<c:if test="${config.auth.permission('file.open')}">
				<li tb-topic="file.open" title="이미지 열기" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_01.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('file.save.image')}">
				<li tb-topic="file.save.image" title="이미지 저장" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_02.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('file.save.annotation')}">
				<li class="sep" tb-topic="file.save.annotation" title="주석/마스킹 정보 저장" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_03.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('send.server')}">
				<li class="sep" tb-topic="send.server" title="서버 전송" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_03-01.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('page.remove')}">
				<li class="sep" tb-topic="page.remove" title="현재 이미지 삭제" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_04.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('page.print')}">
				<li tb-topic="page.print" title="현재 이미지 인쇄" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_05.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('print')}">
				<li class="sep" tb-topic="print" title="전체 이미지 인쇄" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_06.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('zoom.in')}">
				<li tb-topic="zoom.in" tb-kind="image" title="확대" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_07.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('zoom.out')}">
				<li class="sep" tb-topic="zoom.out" tb-kind="image" title="축소" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_08.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('zindex.front')}">
				<li tb-topic="zindex.front" tb-kind="image" title="맨 앞으로 가져오기" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_09.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('zindex.forward')}">
				<li tb-topic="zindex.forward" tb-kind="image" title="앞으로 가져오기" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_10.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('zindex.backward')}">
				<li tb-topic="zindex.backward" tb-kind="image" title="뒤로 보내기" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_11.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('zindex.back')}">
				<li class="sep" tb-topic="zindex.back" tb-kind="image" title="맨 뒤로 보내기" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_12.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('fit.horiz')}">
				<li tb-topic="fit.horiz" tb-kind="image" title="너비 맞춤" tb-type="radio" tb-group="fit" tb-user-lock="uncheck"><img class="tb-btn" src="resources/icon/tbm_13.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('fit.vert')}">
				<li tb-topic="fit.vert" tb-kind="image" title="높이 맞춤" tb-type="radio" tb-group="fit" tb-user-lock="uncheck"><img class="tb-btn" src="resources/icon/tbm_14.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('fit.in')}">
				<li class="sep" tb-topic="fit.in" tb-kind="image" title="화면 맞춤" tb-type="radio" tb-group="fit" tb-user-lock="uncheck" tb-status="checked"><img class="tb-btn" src="resources/icon/tbm_15.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('page.rotate.ccw')}">
				<li tb-topic="page.rotate.ccw" tb-kind="image" title="화면 회전 (반시계)" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_16.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('page.rotate.cw')}">
				<li tb-topic="page.rotate.cw" tb-kind="image" title="화면 회전" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_17.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('page.rotate.180')}">
				<li class="sep" tb-topic="page.rotate.180" tb-kind="image" title="화면 회전 (180º)" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_18.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('mode')}">
				<li class="sep" tb-topic="mode" tb-kind="image" title="편집/보기 모드" tb-type="check" ${config.viewer.decodeMode('edit','tb-status="checked"','')}><img class="tb-btn" src="resources/icon/tbm_19.png" ></li>
				</c:if>
				<c:if test="${config.auth.permission('show.annotation')}">
				<li tb-topic="show.annotation" tb-kind="image" title="주석 보기/감추기" tb-type="check" tb-status="checked"><img class="tb-btn" src="resources/icon/tbm_20.png"></li>
				</c:if>
				<c:if test="${config.auth.permission('show.masking')}">
				<li class="sep" tb-topic="show.masking" tb-kind="image" title="마스킹 보기/감추기" tb-type="check" tb-status="checked"><img class="tb-btn" src="resources/icon/tbm_21.png"></li>
				</c:if>
				<c:if test="${config.auth.permission('clear.shapes')}">
				<li class="sep" tb-topic="clear.shapes" tb-kind="image" title="주석/마스킹 초기화" tb-type="click"><img class="tb-btn" src="resources/icon/tbm_22.png"></li>
				</c:if>
				<c:if test="${config.auth.permission('page.prev', 'page.no', 'page.next')}">
				<li class="sep nowrap" tb-kind="image" ab-perm="page.prev, page.no, page.next">
					<c:if test="${config.auth.permission('page.prev')}">
					<img src="resources/icon/tbm_23-01.png" class="tb-lmar" tb-topic="page.prev" title="이전 이미지" tb-type="click"/>
					</c:if>
					<c:if test="${config.auth.permission('page.no')}">
					<span ab-perm="page.no">
						<input type="text" class="center" tb-topic="page.no" tb-type="text" size="1" value="0" disabled="disabled"/> / <span tb-topic="page.total" tb-type="label">0</span>
					</span>
					</c:if>
					<c:if test="${config.auth.permission('page.next')}">
					<img src="resources/icon/tbm_23-02.png" class="tb-rmar" tb-topic="page.next" title="다음 이미지" tb-type="click"/>
					</c:if>
				</li>
				</c:if>
				<c:if test="${config.auth.permission('page.scale')}">
				<li ab-perm="page.scale" tb-kind="image">
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
				</c:if>
			</ul>
		</div>
	</nav>
	</c:if>
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
		<aside class="abv-thumbnails noselection abv-thumbnails-closable">
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
			
			<!-- 캔버스 시작 -->
			<div id="canvas" class="abv-canvas" style="${config.viewer.toolbar.decodeLayout('all','','right','','padding-right: 0;')} ${config.auth.decode('layout.right','','padding-right: 0;')}">
				<div class="abv-canvas-wrap">
					<div class="abv-canvas-inwrap">
						<div id="engine" class="canvas"><!--<div style="position: absolute;">캔버스</div>--></div>
					</div>

					<!-- 하단 섬네일 목록 시작 -->
					<div class="abv-btm-thumbnails noselection">
						<section id="sub-thumbnails">
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
								<div class="paginate">
									<!-- 페이지 네비게이션 시작 -->
									<!-- 페이지 네비게이션 끝 -->
								</div>
							</nav>
						</section>
					</div>
					<!-- 하단 섬네일 목록 끝 -->
			
				</div>
			</div>
			<!-- 캔버스 끝 -->

		</section>
		<c:if test="${config.viewer.toolbar.hasLayout('all','right') && config.auth.permission('layout.right')}">	
		<aside class="abv-right-side noselection tb-toolbar" ab-layout="all, right" id="rb-right">
			<div class="vblock" title="주석"></div>
			<ul class="vert">
				<li tb-topic="annotation.cursor" tb-kind="image" title="선택하기" tb-type="radio" tb-group="draw" tb-status="checked"><img class="tb-btn" src="resources/icon/cursor.png"/></li>
				<c:if test="${config.auth.permission('annotation.rectangle')}">
				<li ve-type="creation" tb-topic="annotation.rectangle" tb-kind="image" title="사각형 그리기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_01.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('annotation.ellipse')}">
				<li ve-type="creation" tb-topic="annotation.ellipse" tb-kind="image" title="원형 그리기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_02.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('annotation.line')}">
				<li ve-type="creation" tb-topic="annotation.line" tb-kind="image" title="선 그리기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_03.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('annotation.arrow')}">
				<li ve-type="creation" tb-topic="annotation.arrow" tb-kind="image" title="화살표 그리기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_04.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('annotation.pen')}">
				<li ve-type="creation" tb-topic="annotation.pen" tb-kind="image" title="펜으로 그리기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_05.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('annotation.highlightpen')}">
				<li ve-type="creation" tb-topic="annotation.highlightpen" tb-kind="image" title="형판펜으로 칠하기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_06.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('annotation.textbox')}">
				<li ve-type="creation" tb-topic="annotation.textbox" tb-kind="image" title="메모하기" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_07.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('annotation.checker')}">
				<li ve-type="creation" tb-topic="annotation.checker" tb-kind="image" title="체크" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_08.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('annotation.stamp')}">
				<li ve-type="creation" tb-topic="annotation.stamp" tb-kind="image" title="스탬프" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_09.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('annotation.polygon')}">
				<li ve-type="creation" tb-topic="annotation.polygon" tb-kind="image" title="다각형" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_10.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('annotation.memopad')}">
				<li ve-type="creation" tb-topic="annotation.memopad" tb-kind="image" title="메모패드" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_11.png"/></li>
				</c:if>
			</ul>
			<c:if test="${config.auth.permission('masking.rectangle', 'masking.ellipse')}">
			<div class="vhblock" title="마스킹" ab-perm="masking.rectangle, masking.ellipse"></div>
			<ul class="vert" ab-perm="masking.rectangle, masking.ellipse">
				<c:if test="${config.auth.permission('masking.rectangle')}">
				<li ve-type="creation" tb-topic="masking.rectangle" tb-kind="image" title="사각형으로 마스킹" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_m_01.png"/></li>
				</c:if>
				<c:if test="${config.auth.permission('masking.ellipse')}">
				<li ve-type="creation" tb-topic="masking.ellipse" tb-kind="image" title="원형으로 마스킹" tb-type="radio" tb-group="draw"><img class="tb-btn" src="resources/icon/tbr_m_02.png"/></li>
				</c:if>
			</ul>
			</c:if>
		</aside>
		</c:if>
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
	<!-- 도형 스타일러 창 시작 -->
	<div id="abstylewindow" class="center-flybox">
		<ul>
			<li>
				<div class="window abstyler-window">
					<ul>
						<li>
							<h3 abs-topic="title">스타일 설정</h3>
						</li>
						<li class="abstyler-body-title">
							<div abs-topic="body-title">스타일</div>
						</li>
						<li class="abstyler-body">
							<div class="abstyler">
								<!-- 샘플 시작 -->
								<!--
								<div class="abstyler-field "><div class="abstyler-field-text">채우기색상</div><div class="abstyler-input" abs-kind="color" abs-topic="color" abs-color="rgba(254,238,176,1)" abs-alpha="false" abs-notset="false"><div style="background-color: rgb(254, 238, 176);"></div></div></div><fieldset class="abstyler-group" abs-kind="group" abs-topic="stroke"><legend>선 스타일</legend><div class="abstyler-field "><div class="abstyler-field-text">두께</div><div class="custom-select"><select class="abstyler-input" abs-kind="select" abs-topic="stroke.width" abs-type="number"><option value="0">없음</option><option selected="selected" value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div></div><div class="abstyler-field "><div class="abstyler-field-text">색상</div><div class="abstyler-input" abs-kind="color" abs-topic="stroke.color" abs-color="#5B522B" abs-alpha="false"><div style="background-color: rgb(91, 82, 43);"></div></div></div></fieldset><fieldset class="abstyler-group" abs-kind="group" abs-topic="text"><legend>글자 스타일</legend><div class="abstyler-field "><div class="abstyler-field-text">크기</div><input type="text" class="abstyler-input" abs-kind="text" abs-topic="text.size" abs-range-start="1" abs-type="number-unit" abs-unit="px"><span class="abstyler-input-suffix">px</span></div><div class="abstyler-field "><div class="abstyler-field-text">글자모양</div><div class="custom-select"><select class="abstyler-input" abs-kind="select" abs-topic="text.font" abs-type="string"><option value="Malgun Gothic">맑은 고딕</option><option value="gulim">굴림</option><option value="Dotum">돋움</option><option value="Arial">Arial</option><option value="Courier New">Courier New</option><option value="Times New Roman">Times New Roman</option><option value="Verdana">Verdana</option><option value="Helvetica">Helvetica</option><option selected="selected" value="Tahoma">Tahoma</option></select></div></div><div class="abstyler-field abstyler-single-field abstyler-begin-single-field"><label>기울림<input type="checkbox" class="abstyler-input" abs-kind="check" abs-topic="text.italic"><div class="checkmark"></div></label></div><div class="abstyler-field abstyler-single-field abstyler-next-single-field"><label>굵게<input type="checkbox" class="abstyler-input" abs-kind="check" abs-topic="text.bold"><div class="checkmark"></div></label></div><div class="abstyler-field abstyler-single-field abstyler-next-single-field"><label>밑줄<input type="checkbox" class="abstyler-input" abs-kind="check" abs-topic="text.under"><div class="checkmark"></div></label></div><div class="abstyler-field abstyler-single-field abstyler-end-single-field"><label>취소선<input type="checkbox" class="abstyler-input" abs-kind="check" abs-topic="text.cancel"><div class="checkmark"></div></label></div><div class="abstyler-field "><div class="abstyler-field-text">색상</div><div class="abstyler-input" abs-kind="color" abs-topic="text.color" abs-color="black" abs-alpha="false" abs-notset="false"><div style="background-color: black;"></div></div></div><div class="abstyler-field "><div class="abstyler-field-text">글자높이</div><input type="text" class="abstyler-input" abs-kind="text" abs-topic="text.lineHeight" abs-range-start="10" abs-type="number" abs-unit="%"><span class="abstyler-input-suffix">%</span></div><div class="abstyler-field "><div class="abstyler-field-text">정렬</div><div class="custom-select"><select class="abstyler-input" abs-kind="select" abs-topic="text.align" abs-type="string"><option selected="selected" value="left">왼쪽</option><option value="center">중앙</option><option value="right">오른쪽</option><option value="justify">맞춤</option></select></div></div></fieldset>
								-->
								<!-- 샘플 끝 -->
							</div>
						</li>
						<li class="abstyler-panel">
							<input type="button" abs-cmd="reset" value="기본값"/>
							<input type="button" abs-cmd="ok" value="확인"/>
							<input type="button" abs-cmd="cancel" value="취소"/>
						</li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
	<!-- 도형 스타일러 창 끝 -->
	
	<!-- 테스트 패널 -->
	<%/*
	<jsp:include page="/WEB-INF/debug/view-home.jsp"></jsp:include>
	*/%>
	
	<c:if test="${sample}">
	<%/*
	<c:import url="/WEB-INF/debug/view-home.jsp"></c:import>
	*/%>
	
	<style>
	#test-panel {
		width: 600px;
	
		position: fixed;
		left: 50%;
		margin-left: -300px;
		margin-top: 90px;
		
		padding: 10px 20px;
		z-index: 100;
		
		background-color: #FAFAFA;
	}
	</style>
	
	<div id="test-panel">
		<input type="button" test-topic="remote-folder" value="원격 폴더"/>
		<input type="button" test-topic="change-image" value="2번 이미지 교체"/>
		
		<input type="text" test-topic="authname" value="ab_usr_id" style="width: 50px;"/>
		<input type="text" test-topic="authval" value="dev" style="width: 50px;"/>
		
		<input type="button" test-topic="cookie" value="cookie"/>
		<input type="button" test-topic="localStorage" value="localStorage"/>
		<input type="button" test-topic="sessionStorage" value="sessionStorage"/>
	</div>
	
	<script>
	$(function(){
		// 인터페이스 사용
		$te('remote-folder').click(function(){
			iAbViewer.view(
				'C:/Users/Administrator/Desktop/원앙',
				'테스트|천사|좋은일|행복|도사'
			)
		});
		
		$te('change-image').click(function(){
			iAbViewer.viewMain(
				1,
				'C:/Users/Administrator/Desktop/닭/c1.jpg',
				'C:/Users/Administrator/Desktop/닭/c1.xml'
			)
		});
		
		$te('cookie').click(function(){
			var name = $te('authname').val();
			var value = $te('authval').val();
			
			AbCommon.cookie.setAlways(name, value);
		});
		
		$te('localStorage').click(function(){
			var name = $te('authname').val();
			var value = $te('authval').val();
	
			localStorage.setItem(name, value);
		});
		
		$te('sessionStorage').click(function(){
			var name = $te('authname').val();
			var value = $te('authval').val();
	
			sessionStorage.setItem(name, value);
		});
	
		iAbViewer.attachEvent('select', function (name, data){
			var flags = []; flags.push(data.name?'('+data.name+') ':''); flags.push(data.token?'('+data.token+') ':'');
			console.log('  :: DIRECT :: [EVENT]['+name+'] '+flags.join('')+'' + data.index + ', uid=' + data.uid);
		});
	});
	
	function $te(topic){
		return $('#test-panel [test-topic="'+topic+'"]');
	}
	</script>
	</c:if>
</body>
</html>
