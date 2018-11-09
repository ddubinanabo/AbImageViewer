package com.abrain.wiv.config;

import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.abrain.wiv.utils.ArrayUtil;

/**
 * 이미지 뷰어 설정 정보
 * @author Administrator
 *
 */
@Component
public class AbImageViewerConfig {
	
	/**
	 * 이미지 뷰어 초기 모드 설정
	 */
	@Value("${viewer.mode}")
	public String mode;
	
	/**
	 * 워터마크 관련 설정
	 */
	@Autowired
	public WaterMark waterMark;
	
	/**
	 * 이미지 관련 설정
	 */
	@Autowired
	public Image image;
	
	/**
	 * 툴바 관련 설정
	 */
	@Autowired
	public Toolbar toolbar;
	
	/**
	 * 주석/마스킹 관련 설정
	 */
	@Autowired
	public Shape shape;

	//-----------------------------------------------------------------------------------
	
	/**
	 * 이미지 뷰어 초기 모드 설정을 가져옵니다.
	 * @return 이미지 뷰어 초기 모드 설정
	 */
	public String getMode() { return mode; }

	//-----------------------------------------------------------------------------------
	
	/**
	 * 워터마크 관련 설정을 가져옵니다.
	 * @return {@link #waterMark}
	 */
	public WaterMark getWaterMark() { return waterMark; }
	/**
	 * 이미지 관련 설정을 가져옵니다.
	 * @return {@link #image}
	 */
	public Image getImage() { return image; }
	/**
	 * 툴바 관련 설정을 가져옵니다.
	 * @return {@link #toolbar}
	 */
	public Toolbar getToolbar() { return toolbar; }
	/**
	 * 주석/마스킹 관련 설정을 가져옵니다.
	 * @return {@link #shape}
	 */
	public Shape getShape() { return shape; }

	//-----------------------------------------------------------------------------------

	/**
	 * 모드별 분기
	 * <p>* 마지막 문자열은 else 분기입니다.
	 * @param args 모드, 문자열, 모드, 문자열 ... 마지막 문자열
	 * @return 모드에 해당하는 문자열을 리턴합니다.
	 */
	public String decodeMode(String...args) {
		if (args == null)
			return "";
		if (mode == null)
			return args.length > 0 ? args[0] : "";

		int len = args.length, idx = 0;
		for (int i=0; i+1 < len; i+=2) {
			String c = args[i];
			String r = args[i + 1];
			
			if (mode.equalsIgnoreCase(c)) {
				return r;
			}
			
			idx += 2;
		}
		return idx + 1 <= len ? args[idx] : "";
	}

	//-----------------------------------------------------------------------------------
	
	/**
	 * 객체를 JSON으로 인코딩합니다.
	 * @return JSON 인코딩 문장열
	 * @throws Exception 예외
	 */
	public String toJSON() throws Exception {
		ObjectMapper om = new ObjectMapper();
		return om.writeValueAsString(this);
	}

	//-------------------------------------------------------------------------
	
	/**
	 * JSON 문자열에서 객체로 변환합니다.
	 * @param jsonData JSON 인코딩 문장열
	 * @return 이미지 뷰어 설정 정보
	 * @throws Exception 예외
	 */
	public static AbImageViewerConfig fromJSON(String jsonData) throws Exception {
		ObjectMapper om = new ObjectMapper();
		return om.readValue(jsonData, AbImageViewerConfig.class);
	}

	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------

	/**
	 * 워터마크 관련 설정
	 * @author Administrator
	 *
	 */
	@Component
	public static class WaterMark {
		
		/**
		 * 워터마크 이미지 URL
		 */
		@Value("${viewer.watermark.image}")
		public String image;

		//-----------------------------------------------------------------------------------
		
		/**
		 * 워터마크 이미지 URL을 가져옵니다.
		 * @return {@link #image}
		 */
		public String getImage() { return image; }
	}

	/**
	 * 이미지 관련 설정
	 * @author Administrator
	 *
	 */
	@Component
	public static class Image {
		
		/**
		 * 서버 전송 방식 설정 (all|current)
		 */
		@Value("${viewer.image.save}")
		public String save;
		
		/**
		 * 로컬 다운로드 개수 제한
		 */
		@Value("${viewer.image.local-save-limit}")
		public int localSaveLimit;
		
		/**
		 * 이미지 스토로지 관련 설정
		 */
		@Autowired
		public ImageStorage storage;

		//-----------------------------------------------------------------------------------
		
		/**
		 * 서버 전송 방식 설정을 가져옵니다.
		 * @return {@link #save}
		 */
		public String getSave() { return save; }
		/**
		 * 로컬 다운로드 개수 제한
		 * @return {@link #localSaveLimit}
		 */
		@JsonProperty("local-save-limit")
		public int getLocalSaveLimit() { return localSaveLimit; }
		/**
		 * 이미지 스토로지 관련 설정을 가져옵니다.
		 * @return {@link #storage}
		 */
		public ImageStorage getStorage() { return storage; }
	}

	/**
	 * 이미지 스토로지 관련 설정
	 * @author Administrator
	 *
	 */
	@Component
	public static class ImageStorage {
		
		/**
		 * 이미지 스토로지 타입 설정 (db|folder)
		 */
		@Value("${viewer.image.storage.type}")
		public String type;

		/**
		 * 이미지 스트로지 경로 설정 (type이 folder인 경우)
		 */
		@Value("${viewer.image.storage.path}")
		public String path;

		//-----------------------------------------------------------------------------------
		
		/**
		 * 이미지 스토로지 타입 설정을 가져옵니다.
		 * @return {@link #type}
		 */
		public String getType() { return type; }
		/**
		 * 이미지 스트로지 경로 설정을 가져옵니다.
		 * @return {@link #path}
		 */
		public String getPath() { return path; }

		//-----------------------------------------------------------------------------------
		
		/**
		 * 스트로지 타입과 일치하는 지 확인합니다.
		 * @param type 타입
		 * @return 일치하면 true
		 */
		public boolean equalsType(String type) {
			if (this.type == null && type == null)
				return true;
			
			return this.type != null ? this.type.equalsIgnoreCase(type) : false;
		}
	}

	/**
	 * 툴바 관련 설정
	 * @author Administrator
	 *
	 */
	@Component
	public static class Toolbar {
		
		/**
		 * 툴바 레이아웃 설정 (all|main|right)
		 */
		@Value("#{'${viewer.toolbar.layout}'.trim().toLowerCase().split('\\s*\\|\\s*')}")
		public String[] layout;

		//-----------------------------------------------------------------------------------
		
		/**
		 * 툴바 레이아웃 설정을 가져옵니다.
		 * @return {@link #layout}
		 */
		public String[] getLayout() { return layout; }

		//-----------------------------------------------------------------------------------
	
		/**
		 * 툴바 레이아웃이 있는 확인합니다.
		 * @param name 툴바 레이아웃, 툴바 레이아웃 ... 툴바 레이아웃 
		 * @return 하나라도 있으면 true
		 */
		public boolean hasLayout(String...name) {
			if (name == null) {
				if (layout == null) return true;
				return false;
			}
			if (layout == null) return false;
			
			int len = name.length;
			for (int i=0; i < len; i++) {
				if (ArrayUtil.indexOf(layout, name[i]) >= 0)
					return true;
			}
			return false;
		}
		
		/**
		 * 툴바 레이아웃별 분기
		 * <p>* 마지막 문자열은 else 분기입니다.
		 * @param args 툴바 레이아웃, 문자열, 툴바 레이아웃, 문자열 ... 마지막 문자열
		 * @return 툴바 레이아웃에 해당하는 문자열을 리턴합니다.
		 */
		public String decodeLayout(String...args) {
			if (args == null)
				return "";
			if (layout == null)
				return args.length > 0 ? args[0] : "";

			int len = args.length, idx = 0;
			for (int i=0; i+1 < len; i+=2) {
				String c = args[i];
				String r = args[i + 1];
				
				if (ArrayUtil.indexOf(layout, c) >= 0) {
					return r;
				}
				
				idx += 2;
			}
			return idx + 1 <= len ? args[idx] : "";
		}
	}

	/**
	 * 주석/마스킹 관련 설정
	 * @author Administrator
	 *
	 */
	@Component
	public static class Shape {
		
		/**
		 * 저장 옵션 (all|masking=마스킹만 저장)
		 */
		@Value("${viewer.shape.save}")
		public String save;
		
		/**
		 * 로컬 다운로드 개수 제한
		 */
		@Value("${viewer.shape.local-save-limit}")
		public int localSaveLimit;
		
		/**
		 * 추가 방식 설정 (none|window=스타일 설정창 사용)
		 */
		@Value("${viewer.shape.add.ui}")
		public String addUI;

		/**
		 * 주석/마스킹 선택 관련 설정
		 */
		@Autowired
		public ShapeSelection selection;

		//-----------------------------------------------------------------------------------
		
		/**
		 * 저장 옵션을 가져옵니다.
		 * @return {@link #save}
		 */
		public String getSave() { return save; }
		/**
		 * 로컬 다운로드 개수 제한
		 * @return {@link #localSaveLimit}
		 */
		@JsonProperty("local-save-limit")
		public int getLocalSaveLimit() { return localSaveLimit; }
		/**
		 * 추가 방식 설정을 가져옵니다.
		 * @return {@link #addUI}
		 */
		public String getAddUI() { return addUI; }
		/**
		 * 주석/마스킹 선택 관련 설정을 가져옵니다.
		 * @return {@link #selection}
		 */
		public ShapeSelection getSelection() { return selection; }
	}

	/**
	 * 주석/마스킹 선택 관련 설정
	 * @author Administrator
	 *
	 */
	@Component
	public static class ShapeSelection {
		
		/**
		 * 선택 방식 설정 (path|box)
		 */
		@Value("${viewer.shape.selection.style}")
		public String style;
		
		/**
		 * 선택 방식을 적용할 도형 배열 (style이 box일 경우)
		 * <p>(all|rectangle|ellipse|line|arrow|pen|highlightpen|masking.rectangle|masking.ellipse)
		 */
		@Value("#{'${viewer.shape.selection.target}'.trim().toLowerCase().split('\\s*\\,\\s*')}")
		public String[] target;

		/**
		 * 선 모양 도형(선, 화살표)의 포커스 스타일 (path|box)
		 * <dl>
		 * 	<dt>path</dt><dd>선 모양의 선택영역을 그립니다. (기본 스타일)</dd>
		 * 	<dt>box</dt><dd>선택 영역을 상자로 그립니다.</dd>
		 * </dl>
		 */
		@Value("${viewer.shape.selection.lineDrawStyle}")
		public String lineDrawStyle;

		//-----------------------------------------------------------------------------------
		
		/**
		 * 선택 방식 설정을 가져옵니다.
		 * @return {@link #style}
		 */
		public String getStyle() { return style; }
		/**
		 * 선택 방식을 적용할 도형 배열을 가져옵니다.
		 * @return {@link #target}
		 */
		public String[] getTarget() { return target; }
		/**
		 * 선 모양 도형(선, 화살표)의 포커스 스타일을 가져옵니다.
		 * @return {@link #lineDrawStyle}
		 */
		public String getLineDrawStyle() { return lineDrawStyle; }

		//-----------------------------------------------------------------------------------
	
		/**
		 * 선택 방식을 적용할 도형 배열에 도형이 해당되는 지 확인합니다.
		 * @param name 도형 명칭
		 * @return 해당되면 true
		 */
		public boolean hasTarget(String name) {
			return target != null && ArrayUtil.indexOf(target, name) >= 0;
		}
	}

}
