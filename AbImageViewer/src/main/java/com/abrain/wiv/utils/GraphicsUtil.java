package com.abrain.wiv.utils;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.PixelGrabber;
import java.awt.image.RenderedImage;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;
import javax.swing.ImageIcon;

import org.apache.commons.io.FilenameUtils;

import com.abrain.wiv.enums.AbImageDecoder;

/**
 * 그래픽스 관련 도구
 * @author Administrator
 *
 */
public class GraphicsUtil {
	/**
	 * 섬네일 이미지 파일명 접두사
	 */
	private static final String PREFIX = "thumb_";
	
	/**
	 * 섬네일 이미지 최대 크기
	 */
	private static final int THUMB_WIDTH = 120, THUMB_HEIGHT = 120;
	
	//-----------------------------------------------------------
	
	/**
	 * 섬네일 이미지 생성 경과
	 * @author Administrator
	 *
	 */
	public static class ThumbnailImageResult {
		/**
		 * 원본 이미지 크기
		 */
		public int srcWidth, srcHeight;
		/**
		 * 섬네일 이미지 크기
		 */
		public int width, height;
		/**
		 * 섬네일 이미지
		 */
		public BufferedImage image;
		/**
		 * 예외 정보
		 * <p>* 예외 발생 시 설정됩니다.
		 */
		public Exception e;
	}
	
	//-----------------------------------------------------------
	
	/**
	 * 섬네일 이미지를 생성합니다.
	 * @param imgFile 원본 이미지 파일
	 * @return 섬네일 이미지 생성 경과
	 */
	public static ThumbnailImageResult renderThumbnail(File imgFile) {
		String filename = imgFile.getName();
		String extension = FilenameUtils.getExtension(filename);
		String mimeType = FileUtil.contentType(imgFile);
		
		AbImageDecoder decoder = AbImageDecoder.analysis(extension, mimeType);
	
		return renderThumbnail(imgFile, decoder);
	}

	/**
	 * 섬네일 이미지를 생성합니다.
	 * @param imgFile 원본 이미지 파일
	 * @param decoder 이미지 렌더링 힌트
	 * @return 섬네일 이미지 생성 경과
	 */
	public static ThumbnailImageResult renderThumbnail(File imgFile, AbImageDecoder decoder) {
		ThumbnailImageResult r = new ThumbnailImageResult();
		
		try
		{
			//Image origin = ImageIO.read(imgFile);
			Image origin = new ImageIcon(imgFile.toURI().toURL()).getImage();
			
			//-----------------------------------------------------------
			
			int srcWidth = origin.getWidth(null);
			int srcHeight = origin.getHeight(null);
			
			double ratio = zoom(srcWidth, srcHeight, THUMB_WIDTH, THUMB_HEIGHT);
			
			int thumbWidth = ratio != 1 ? (int)((double)srcWidth * ratio) : srcWidth;
			int thumbHeight = ratio != 1 ? (int)((double)srcHeight * ratio) : srcHeight;
			
			//-----------------------------------------------------------
			
			Image thumb = origin.getScaledInstance(thumbWidth, thumbHeight, Image.SCALE_SMOOTH);
			int pixels[] = new int[thumbWidth * thumbHeight];
			PixelGrabber pg = new PixelGrabber(thumb, 0, 0, thumbWidth, thumbHeight, pixels, 0, thumbWidth);
			pg.grabPixels();
			
			//-----------------------------------------------------------
			
			int imageType = decoder == AbImageDecoder.ABDEC_PNG ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB;
			
			BufferedImage dest = new BufferedImage(thumbWidth, thumbHeight, imageType);
			dest.setRGB(0, 0, thumbWidth, thumbHeight, pixels, 0, thumbWidth);
			
			r.srcWidth = srcWidth;
			r.srcHeight = srcHeight;
			r.width = thumbWidth;
			r.height = thumbHeight;
			r.image = dest;
		}
		catch (IOException ioe)
		{
			DebugUtil.print(ioe);
			
			System.out.println("[thumbnail] IOException");
			
			r.e = ioe;
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			System.out.println("[thumbnail] Exception");
			
			r.e = e;
		}
		finally
		{
		}
		return r;
	}
	
	//-----------------------------------------------------------
	
	/**
	 * 생성한 섬네일 이미지 파일 정보
	 * @author Administrator
	 *
	 */
	public static class ThumbnailResult {
		public int srcWidth, srcHeight;
		public int width, height;
		public AbImageDecoder decoder;
		public String name;
		public Exception e;
	}
	
	//-----------------------------------------------------------

	/**
	 * 섬네일 이미지를 생성합니다.
	 * @param imgFile 원본 이미지 파일
	 * @return 생성한 섬네일 이미지 파일 정보
	 */
	public static ThumbnailResult thumbnail(File imgFile) {
		return thumbnail(imgFile, null, AbImageDecoder.ABDEC_JPG);
	}

	/**
	 * 섬네일 이미지를 생성합니다.
	 * @param imgFile 원본 이미지 파일
	 * @param decoder 이미지 렌더링 힌트
	 * @return 생성한 섬네일 이미지 파일 정보
	 */
	public static ThumbnailResult thumbnail(File imgFile, AbImageDecoder decoder) {
		return thumbnail(imgFile, null, decoder);
	}

	/**
	 * 섬네일 이미지를 생성합니다.
	 * @param imgFile 원본 이미지 파일
	 * @param outputPath 저장할 폴더 경로
	 * @return 생성한 섬네일 이미지 파일 정보
	 */
	public static ThumbnailResult thumbnail(File imgFile, String outputPath) {
		return thumbnail(imgFile, outputPath, AbImageDecoder.ABDEC_JPG);
	}

	/**
	 * 섬네일 이미지를 생성합니다.
	 * @param imgFile 원본 이미지 파일
	 * @param outputPath 저장할 폴더 경로
	 * @param decoder 이미지 렌더링 힌트
	 * @return 생성한 섬네일 이미지 파일 정보
	 */
	public static ThumbnailResult thumbnail(File imgFile, String outputPath, AbImageDecoder decoder) {
		ThumbnailResult r = new ThumbnailResult();
		
		try
		{
			File folder = imgFile.getParentFile();
			File thumbFile = null;
			
			String thumbnail = null;
			if (outputPath != null && !outputPath.isEmpty()) {
				thumbFile = new File(outputPath);
				thumbnail = thumbFile.getName();
			}else {
				thumbnail = PREFIX + imgFile.getName();
				
				String path = folder.getAbsolutePath();
				if (path != null && path.length() >= 1 && path.charAt(path.length() - 1) != '/')
					path += "/";
				
				thumbFile = new File(path + thumbnail);
			}
			
			//-----------------------------------------------------------
			
			ThumbnailImageResult tr = renderThumbnail(imgFile, decoder);
			if (tr.e != null) {
				r.e = tr.e;
				return r;
			}
			
			write(tr.image, decoder, thumbFile);
			
			r.srcWidth = tr.srcWidth;
			r.srcHeight = tr.srcHeight;
			r.width = tr.width;
			r.height = tr.height;
			r.name = thumbnail;
			r.decoder = decoder;
		}
		catch (IOException ioe)
		{
			DebugUtil.print(ioe);
			
			System.out.println("[thumbnail] IOException");
			
			r.e = ioe;
		}
		catch (Exception e)
		{
			DebugUtil.print(e);
			
			System.out.println("[thumbnail] Exception");
			
			r.e = e;
		}
		finally
		{
		}
		return r;
	}
	
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	
	/**
	 * 최대 폭/높이에 맞는 비율을 계산합니다.
	 * @param srcWidth 폭
	 * @param srcHeight 높이
	 * @param limitWidth 최대 폭
	 * @param limitHeight 최대 높이
	 * @return 비율
	 */
	public static double zoom(int srcWidth, int srcHeight, int limitWidth, int limitHeight){
		double rx = (double)limitWidth / (double)srcWidth;
		double ry = (double)limitHeight / (double)srcHeight;
		
		return rx > ry ? ry : rx;
	}
	
	/**
	 * 최대 폭/높이에 맞는 비율을 계산합니다.
	 * <p>* 폭/높이가 최대 폭/높이보다 큰 경우에만 계산하며, 작은 경우는 1을 리턴합니다.
	 * @param srcWidth 폭
	 * @param srcHeight 높이
	 * @param limitWidth 최대 폭
	 * @param limitHeight 최대 높이
	 * @return 비율 
	 */
	public static double limit(int srcWidth, int srcHeight, int limitWidth, int limitHeight){
		boolean bOverX = limitWidth < srcWidth, bOverY = limitHeight < srcHeight;
		if ( bOverX || bOverY ) {
			double rx = (double)limitWidth / (double)srcWidth;
			double ry = (double)limitHeight / (double)srcHeight;
			
			return rx > ry ? ry : rx;	
		}
		return 1;
	}
	
	//-----------------------------------------------------------
	
	/**
	 * 이미지 렌더링 힌트으로 ImageIO의 formatName을 가져옵니다.
	 * @param decoder 이미지 렌더링 힌트
	 * @return 문자열
	 */
	public static String formatName(AbImageDecoder decoder) {
		return decoder == AbImageDecoder.ABDEC_PNG ? "png" : "jpg";
	}

	/**
	 * 이미지를 파일에 씁니다.
	 * @param image 이미지 객체
	 * @param decoder 이미지 렌더링 힌트
	 * @param out 파일 객체
	 * @throws IOException 예외
	 */
	public static void write (RenderedImage image, AbImageDecoder decoder, File out) throws IOException {
		ImageIO.write(image, formatName(decoder), out);
	}

	/**
	 * 이미지를 출력 스트림에 씁니다.
	 * @param image 이미지 객체
	 * @param decoder 이미지 렌더링 힌트
	 * @param out 출력 스트림 예외
	 * @throws IOException 예외
	 */
	public static void write (RenderedImage image, AbImageDecoder decoder, OutputStream out) throws IOException {
		ImageIO.write(image, formatName(decoder), out);
	}

	/**
	 * 이미지를 출력 스트림에 씁니다.
	 * @param image 이미지 객체
	 * @param decoder 이미지 렌더링 힌트
	 * @param out 출력 스트림
	 * @throws IOException 예외
	 */
	public static void write (RenderedImage image, AbImageDecoder decoder, ImageOutputStream out) throws IOException {
		ImageIO.write(image, formatName(decoder), out);
	}
	
}
