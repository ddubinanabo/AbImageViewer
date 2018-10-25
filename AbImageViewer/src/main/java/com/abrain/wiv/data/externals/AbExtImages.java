package com.abrain.wiv.data.externals;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileFilter;
import java.net.URLEncoder;
import java.nio.file.NotDirectoryException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;

import com.abrain.wiv.config.AbImageConfig;
import com.abrain.wiv.data.AbImageData;
import com.abrain.wiv.data.AbImageMetadata;
import com.abrain.wiv.data.SplayTree;
import com.abrain.wiv.data.exif.AbExif;
import com.abrain.wiv.enums.AbImageDecoder;
import com.abrain.wiv.enums.AbImageType;
import com.abrain.wiv.exceptions.NotFoundFileException;
import com.abrain.wiv.readers.AbExifReader;
import com.abrain.wiv.utils.FileUtil;
import com.abrain.wiv.utils.GraphicsUtil;
import com.abrain.wiv.utils.WebUtil;

/**
 * 외부 파일 이미지 지원
 * <p>* 서버의 이미지 파일을 클라이언트에 제공합니다.
 * @author Administrator
 *
 */
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
	
	/**
	 * 이미지/섬네일/주석 경로
	 */
	private String imgPath, thumbPath, annoPath;
	/**
	 * 이미지/섬네일/주석 파일 객체
	 */
	private File imgDir, thumbDir, annoDir;
	
	//-----------------------------------------------------------
	
	/**
	 * 수집된 주석 파일 객체 트리
	 */
	private SplayTree<String, File> annotations = null;
	/**
	 * 수집된 섬네일 파일 객체 트리
	 */
	private SplayTree<String, File> thumbnails = null;
	
	//-----------------------------------------------------------
	
	/**
	 * 이미지 설정 정보
	 */
	private AbImageConfig config;
	
	//-----------------------------------------------------------

	/**
	 * 이미지/XML 파일 필터
	 */
	private FileFilter imageFilter = null, xmlFilter = null;
	
	//-----------------------------------------------------------
	
	/**
	 * XML 파일 필터를 가져옵니다.
	 * @return
	 */
	private FileFilter xmlFilter() {
		if (xmlFilter == null)
			xmlFilter = new ImageFileFilter("xml");
		return xmlFilter;
	}
	
	/**
	 * 이미지 파일 필터를 가져옵니다.
	 * @return
	 */
	private FileFilter imageFilter() {
		if (imageFilter == null)
			imageFilter = new ImageFileFilter(config.ACCEPTS);
		return imageFilter;
	}
	
	//-----------------------------------------------------------
	
	/**
	 * 주석/마스킹 파일을 수집합니다.
	 */
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
	
	/**
	 * 섬네일 이미지를 수집합니다.
	 */
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

	/**
	 * 이미지 파일을 수집하고, 이미지 정보 목록을 가져옵니다.
	 * @return 이미지 파일 목록
	 * @throws Exception 예외
	 */
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
			
			String mimeType = FileUtil.contentType(file);
			String extension = FilenameUtils.getExtension(filename);
			String decoder = AbImageDecoder.renderingHint(extension, mimeType);
			
			//-----------------------------------------------------------
			
			System.out.println("=====================================================");
			System.out.println("[IMAGE FILE] " + filename + "(" + mimeType + ") " + decoder );
			System.out.println("-----------------------------------------------------");
			
			//-----------------------------------------------------------
			
			AbExif exif = AbExifReader.read(file);
			
			//-----------------------------------------------------------
			
			String annotation = null;
			node = annotations.find(basename);
			if (node != null) {
				annotation = new String(FileUtil.read(node.value()), "UTF-8");
			}
			
			//-----------------------------------------------------------
			
			String path = URLEncoder.encode(imgPath, "UTF-8");
			String name = URLEncoder.encode(filename, "UTF-8");
			
			AbImageMetadata imgInfo = new AbImageMetadata();
			imgInfo.setName(filename);
			imgInfo.setText(filename);
			imgInfo.setType(mimeType);
			imgInfo.setSize(file.length());
			
			if (exif != null)
				imgInfo.setExif(exif);
			
			String cgi = "q=" + path + "&n=" + name;
			String thumbCgi = "c=Y&" + cgi;
			
			//-----------------------------------------------------------
		
			node = thumbnails.find(basename);
			if (node != null) {
				String thumbFilename = node.value().getName();
				
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
			img.setDecoder(decoder);
			
			images.add(img);
		}
		
		return images;
	}
	
	//-----------------------------------------------------------
	
	/**
	 * 파일을 다운로드합니다.
	 * @param response HTTP 응답 정보
	 * @param name 파일명
	 * @param type 이미지 구분
	 * @param needCreate 생성이 필요한 지 여부 (섬네일 이미지만 해당됩니다)
	 * <p>true면 섬네일 이미지를 만들어서 다운로드합니다.
	 * @throws Exception 예외
	 */
	public void download(HttpServletResponse response, String name, AbImageType type, boolean needCreate) throws Exception {
		if (type == AbImageType.ABIMG_IMAGE) {
			File file = new File(imgPath + "/" + name);
			
			WebUtil.download(response, file, name);			
		}else if (type == AbImageType.ABIMG_THUMBNAIL) {
			if (needCreate) {
				File file = new File(imgPath + "/" + name);
				String extension = FilenameUtils.getExtension(name);
				String mimeType = FileUtil.contentType(file);
				
				AbImageDecoder decoder = AbImageDecoder.analysis(extension, mimeType);
				
				GraphicsUtil.ThumbnailImageResult r = GraphicsUtil.renderThumbnail(file, decoder);
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
	
	/**
	 * 이미지 파일의 이미지 정보를 가져옵니다.
	 * @param path 파일 경로
	 * @return 이미지 정보
	 * @throws Exception 예외
	 */
	public static AbImageData file(String path) throws Exception {
		return file(path, null);
	}

	/**
	 * 이미지 파일의 이미지 정보를 가져옵니다.
	 * @param path 파일 경로
	 * @param annoPath 주석 경로
	 * @return 이미지 정보
	 * @throws Exception 예외
	 */
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
		String extension = FilenameUtils.getExtension(filename);
		String encPath = URLEncoder.encode(path, "UTF-8");
		
		String mimeType = FileUtil.contentType(file);
		
		String decoder = AbImageDecoder.renderingHint(extension, mimeType);
		
		//-----------------------------------------------------------
		
		AbExif exif = AbExifReader.read(file);
		
		AbImageMetadata imgInfo = new AbImageMetadata();
		imgInfo.setName(filename);
		imgInfo.setText(filename);
		imgInfo.setType(mimeType);
		
		if (exif != null)
			imgInfo.setExif(exif);
	
		String cgi = "q=" + encPath;
		
		AbImageData img = new AbImageData(
			"ext/file?" + cgi,
			"ext/file?c=Y&t=thumb&" + cgi
		);
		if (annotation != null)
			img.setShapes(annotation);
		img.setInfo(imgInfo);
		img.setDecoder(decoder);

		return img;
	}
	
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	
	/**
	 * 이미지 파일 필터
	 * @author Administrator
	 *
	 */
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
		public ImageFileFilter(String[] accepts) {
			if (accepts != null) {
				for (int i=0; i < accepts.length; i++) {
					String ext = accepts[i].trim();
					if (ext.isEmpty())
						continue;
					
					this.accepts.add(ext.toLowerCase());
				}
			}
		}
		
		/**
		 * 허용 확장자 목록
		 */
		private List<String> accepts = new ArrayList<>();
		
		/**
		 * 파일이 이미지인지 확인합니다.
		 * return 이미지이면 true
		 */
		@Override
		public boolean accept(File file) {
			String name = file.getName();
			String ext = FilenameUtils.getExtension(name).toLowerCase();
			
			return accepts.indexOf(ext) >= 0;
		}
	}
}
