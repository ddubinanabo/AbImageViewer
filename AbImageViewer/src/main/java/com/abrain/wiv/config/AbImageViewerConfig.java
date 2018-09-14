package com.abrain.wiv.config;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.abrain.wiv.utils.ArrayUtil;

@Component
public class AbImageViewerConfig {
	
	@Autowired
	public WaterMark waterMark;
	
	@Autowired
	public Image image;
	
	@Autowired
	public Toolbar toolbar;
	
	@Autowired
	public Shape shape;

	//-----------------------------------------------------------------------------------
	
	public WaterMark getWaterMark() { return waterMark; }
	public Image getImage() { return image; }
	public Toolbar getToolbar() { return toolbar; }
	public Shape getShape() { return shape; }

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

		//-----------------------------------------------------------------------------------
		
		public String getSave() { return save; }
	}

	@Component
	public static class Toolbar {
		
		@Value("#{'${viewer.toolbar.layout}'.trim().toLowerCase().split('\\s*\\|\\s*')}")
		public String[] layout;

		//-----------------------------------------------------------------------------------
		
		public String[] getLayout() { return layout; }

		//-----------------------------------------------------------------------------------
	
		public boolean hasLayout(String name) {
			return ArrayUtil.indexOf(layout, name) >= 0;
		}
	}

	@Component
	public static class Shape {
		
		@Value("${viewer.shape.save}")
		public String save;
		
		@Value("${viewer.shape.add.ui}")
		public String addUI;
		
		@Value("${viewer.shape.selection}")
		public String selection;

		//-----------------------------------------------------------------------------------
		
		public String getSave() { return save; }
		public String getAddUI() { return addUI; }
		public String getSelection() { return selection; }
	}
}
