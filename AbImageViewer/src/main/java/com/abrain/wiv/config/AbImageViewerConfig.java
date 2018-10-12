package com.abrain.wiv.config;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.abrain.wiv.utils.ArrayUtil;

@Component
public class AbImageViewerConfig {
	
	@Value("${viewer.mode}")
	public String mode;
	
	@Autowired
	public WaterMark waterMark;
	
	@Autowired
	public Image image;
	
	@Autowired
	public Toolbar toolbar;
	
	@Autowired
	public Shape shape;

	//-----------------------------------------------------------------------------------
	
	public String getMode() { return mode; }

	//-----------------------------------------------------------------------------------
	
	public WaterMark getWaterMark() { return waterMark; }
	public Image getImage() { return image; }
	public Toolbar getToolbar() { return toolbar; }
	public Shape getShape() { return shape; }

	//-----------------------------------------------------------------------------------

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
	
	public String toJSON() throws Exception {
		ObjectMapper om = new ObjectMapper();
		return om.writeValueAsString(this);
	}

	//-------------------------------------------------------------------------
	
	public static AbImageViewerConfig fromJSON(String jsonData) throws Exception {
		ObjectMapper om = new ObjectMapper();
		return om.readValue(jsonData, AbImageViewerConfig.class);
	}

	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------

	@Component
	public static class WaterMark {
		
		@Value("${viewer.watermark.image}")
		public String image;

		//-----------------------------------------------------------------------------------
		
		public String getImage() { return image; }
	}

	@Component
	public static class Image {
		
		@Value("${viewer.image.save}")
		public String save;
		
		@Autowired
		public ImageStorage storage;

		//-----------------------------------------------------------------------------------
		
		public String getSave() { return save; }
		public ImageStorage getStorage() { return storage; }
	}

	@Component
	public static class ImageStorage {
		
		@Value("${viewer.image.storage.type}")
		public String type;

		@Value("${viewer.image.storage.path}")
		public String path;

		//-----------------------------------------------------------------------------------
		
		public String getType() { return type; }
		public String getPath() { return path; }

		//-----------------------------------------------------------------------------------
		
		public boolean equalsType(String type) {
			if (this.type == null && type == null)
				return true;
			
			return this.type != null ? this.type.equalsIgnoreCase(type) : false;
		}
	}

	@Component
	public static class Toolbar {
		
		@Value("#{'${viewer.toolbar.layout}'.trim().toLowerCase().split('\\s*\\|\\s*')}")
		public String[] layout;

		//-----------------------------------------------------------------------------------
		
		public String[] getLayout() { return layout; }

		//-----------------------------------------------------------------------------------
	
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

	@Component
	public static class Shape {
		
		@Value("${viewer.shape.save}")
		public String save;
		
		@Value("${viewer.shape.add.ui}")
		public String addUI;

		@Autowired
		public ShapeSelection selection;

		//-----------------------------------------------------------------------------------
		
		public String getSave() { return save; }
		public String getAddUI() { return addUI; }
		public ShapeSelection getSelection() { return selection; }
	}

	@Component
	public static class ShapeSelection {
		
		@Value("${viewer.shape.selection.style}")
		public String style;
		
		@Value("#{'${viewer.shape.selection.target}'.trim().toLowerCase().split('\\s*\\,\\s*')}")
		public String[] target;

		@Value("${viewer.shape.selection.lineDrawStyle}")
		public String lineDrawStyle;

		//-----------------------------------------------------------------------------------
		
		public String getStyle() { return style; }
		public String[] getTarget() { return target; }
		public String getLineDrawStyle() { return lineDrawStyle; }

		//-----------------------------------------------------------------------------------
	
		public boolean hasTarget(String name) {
			return target != null && ArrayUtil.indexOf(target, name) >= 0;
		}
	}

}
