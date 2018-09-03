package com.abrain.wiv.data.externals;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileFilter;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.NotDirectoryException;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;

import com.abrain.wiv.config.AbImageConfig;
import com.abrain.wiv.data.AbImageData;
import com.abrain.wiv.data.AbImageDecoder;
import com.abrain.wiv.data.AbImageInfo;
import com.abrain.wiv.data.AbImageType;
import com.abrain.wiv.data.SplayTree;
import com.abrain.wiv.exceptions.NotFoundFileException;
import com.abrain.wiv.utils.FileUtil;
import com.abrain.wiv.utils.GraphicsUtil;
import com.abrain.wiv.utils.WebUtil;

public class AbExtImages {
	public AbExtImages(AbImageConfig config, String path) throws Exception {
		this.config = config;
		this.imgPath = path;
		
		//-----------------------------------------------------------

		File dir = new File(path);
		
		if (!dir.exists())
			throw new NotFoundFileException(path);
		
		if (!dir.isDirectory())
			throw new NotDirectoryException(path);
		
		imgDir = dir;
		
		//-----------------------------------------------------------

		thumbPath = imgPath + "/thumbnail";
		thumbDir = new File(thumbPath);
		
		//-----------------------------------------------------------
		
		annoPath = imgPath + "/annotation";
		annoDir = new File(annoPath);
	}
	
	//-----------------------------------------------------------
	
	private String imgPath, thumbPath, annoPath;
	private File imgDir, thumbDir, annoDir;
	
	//-----------------------------------------------------------
	
	private SplayTree<String, File> annotations = null;
	private SplayTree<String, File> thumbnails = null;
	
	//-----------------------------------------------------------
	
	private AbImageConfig config;
	
	//-----------------------------------------------------------

	private FileFilter imageFilter = null, xmlFilter = null;
	
	//-----------------------------------------------------------
	
	private FileFilter xmlFilter() {
		if (xmlFilter == null)
			xmlFilter = new ImageFileFilter("xml");
		return xmlFilter;
	}
	
	private FileFilter imageFilter() {
		if (imageFilter == null)
			imageFilter = new ImageFileFilter(config.ACCEPTS);
		return imageFilter;
	}
	
	//-----------------------------------------------------------
	
	private void collectAnnotation() {
		if (annotations != null)
			return;
		
		annotations = new SplayTree<>();
		
		if (annoDir.exists() && annoDir.isDirectory()) {
			File[] files = annoDir.listFiles(xmlFilter());
			
			for (File file : files) {
				String filename = file.getName();
				String basename = FilenameUtils.getBaseName(filename);
				annotations.add(basename, file);
			}
		}
	}
	
	private void collectThumbnail() {
		if (thumbnails != null)
			return;
		
		thumbnails = new SplayTree<>();
		
		if (thumbDir.exists() && thumbDir.isDirectory()) {
			File[] files = thumbDir.listFiles(imageFilter());
			
			for (File file : files) {
				String filename = file.getName();
				String basename = FilenameUtils.getBaseName(filename);
				thumbnails.add(basename, file);
			}
		}
	}

	//-----------------------------------------------------------

	public List<AbImageData> collect() throws Exception {
		collectAnnotation();
		collectThumbnail();
		
		//-----------------------------------------------------------
		
		SplayTree.Node<String, File> node = null;
		File[] files = imgDir.listFiles(imageFilter());
		
		List<AbImageData> images = new ArrayList<>();
		for (File file : files) {
			String filename = file.getName();
			String basename = FilenameUtils.getBaseName(filename);
			
			//-----------------------------------------------------------
			
			System.out.println("[IMAGE FILE] " + filename);
			
			//-----------------------------------------------------------
			
			String annotation = null;
			node = annotations.find(basename);
			if (node != null) {
				annotation = new String(FileUtil.read(node.value()), "UTF-8");
			}
			
			//-----------------------------------------------------------
			
			String path = URLEncoder.encode(imgPath, "UTF-8");
			String name = URLEncoder.encode(filename, "UTF-8");
			
			AbImageInfo imgInfo = new AbImageInfo();
			imgInfo.setName(filename);
			imgInfo.setText(filename);
			
			String cgi = "q=" + path + "&n=" + name;
			String thumbCgi = "c=Y&" + cgi;
			
			//-----------------------------------------------------------
		
			node = thumbnails.find(basename);
			if (node != null) {
				String thumbFilename = node.value().getName();
				
				String thPath = URLEncoder.encode(thumbPath, "UTF-8");
				String thName = URLEncoder.encode(thumbFilename, "UTF-8");
				
				thumbCgi = "q=" + path + "&n=" + thName;
			}
			
			//-----------------------------------------------------------
		
			AbImageData img = new AbImageData(
				"ext/img?" + cgi,
				"ext/img?t=thumb&" + thumbCgi
			);
			if (annotation != null)
				img.setShapes(annotation);
			img.setInfo(imgInfo);
			img.setDecoder("jpg");
			
			images.add(img);
		}
		
		return images;
	}
	
	//-----------------------------------------------------------
	
	public void download(HttpServletResponse response, String name, AbImageType type, boolean needCreate) throws Exception {
		if (type == AbImageType.ABIMG_IMAGE) {
			File file = new File(imgPath + "/" + name);
			
			WebUtil.download(response, file, name);			
		}else if (type == AbImageType.ABIMG_THUMBNAIL) {
			if (needCreate) {
				String extension = FilenameUtils.getExtension(name);
				AbImageDecoder decoder = AbImageDecoder.fromExtension(extension);
				
				File file = new File(imgPath + "/" + name);
				
				GraphicsUtil.ThumbnailImageResult r = GraphicsUtil.renderThumbnail(file);
				if (r.e != null)
					throw r.e;
				
				ByteArrayOutputStream out = new ByteArrayOutputStream();
				GraphicsUtil.write(r.image, decoder, out);
				
				WebUtil.download(response, name, out.toByteArray());
			}else {
				File file = new File(thumbPath + "/" + name);
				WebUtil.download(response, file, name);
			}
		}
	}

	//-----------------------------------------------------------
	
	public static AbImageData file(String path) throws Exception {
		return file(path, null);
	}

	public static AbImageData file(String path, String annoPath) throws Exception {
		File file = new File(path);
		if (!file.exists())
			throw new NotFoundFileException(path);
		
		if (file.isDirectory())
			throw new NotFoundFileException(path);
		
		//-----------------------------------------------------------
		
		String annotation = null;
		if (annoPath != null) {
			File annoFile = new File(annoPath);
			if (annoFile.exists())
				annotation = new String(FileUtil.read(annoFile), "UTF-8");
		}
		
		//-----------------------------------------------------------
		
		String filename = file.getName();
		
		String encPath = URLEncoder.encode(path, "UTF-8");
		
		AbImageInfo imgInfo = new AbImageInfo();
		imgInfo.setName(filename);
		imgInfo.setText(filename);
		
		String cgi = "q=" + encPath;
		
		AbImageData img = new AbImageData(
			"ext/file?" + cgi,
			"ext/file?c=Y&t=thumb&" + cgi
		);
		if (annotation != null)
			img.setShapes(annotation);
		img.setInfo(imgInfo);
		img.setDecoder("jpg");

		return img;
	}
	
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	
	public static class ImageFileFilter implements FileFilter {
		public ImageFileFilter(String accepts) {
			if (accepts != null && !accepts.isEmpty()) {
				String[] exts = accepts.split(",");
				
				for (int i=0; i < exts.length; i++) {
					String ext = exts[i].trim();
					if (ext.isEmpty())
						continue;
					
					this.accepts.add(ext.toLowerCase());
				}
			}
		}
		
		private List<String> accepts = new ArrayList<>();
		
		@Override
		public boolean accept(File file) {
			String name = file.getName();
			String ext = FilenameUtils.getExtension(name).toLowerCase();
			
			return accepts.indexOf(ext) >= 0;
		}
	}
}
