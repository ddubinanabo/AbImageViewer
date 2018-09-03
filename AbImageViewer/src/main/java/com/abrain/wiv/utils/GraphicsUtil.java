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

import com.abrain.wiv.data.AbImageDecoder;

public class GraphicsUtil {
	private static final String PREFIX = "thumb_";
	
	private static final int THUMB_WIDTH = 120, THUMB_HEIGHT = 120;
	
	//-----------------------------------------------------------
	
	public static class ThumbnailImageResult {
		public int srcWidth, srcHeight;
		public int width, height;
		public BufferedImage image;
		public Exception e;
	}
	
	//-----------------------------------------------------------

	public static ThumbnailImageResult renderThumbnail(File imgFile) {
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
			
			BufferedImage dest = new BufferedImage(thumbWidth, thumbHeight, BufferedImage.TYPE_INT_RGB);
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
	
	public static class ThumbnailResult {
		public int srcWidth, srcHeight;
		public int width, height;
		public AbImageDecoder decoder;
		public String name;
		public Exception e;
	}
	
	//-----------------------------------------------------------
	
	public static ThumbnailResult thumbnail(File imgFile) {
		return thumbnail(imgFile, AbImageDecoder.ABDEC_JPG);
	}

	public static ThumbnailResult thumbnail(File imgFile, AbImageDecoder decoder) {
		ThumbnailResult r = new ThumbnailResult();
		
		try
		{
			File folder = imgFile.getParentFile();
			
			String thumbnail = PREFIX + imgFile.getName();
			
			String path = folder.getAbsolutePath();
			if (path != null && path.length() >= 1 && path.charAt(path.length() - 1) != '/')
				path += "/";
			
			File thumbFile = new File(path + thumbnail);
			
			//-----------------------------------------------------------
			
			ThumbnailImageResult tr = renderThumbnail(imgFile);
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
	
	public static double zoom(int srcWidth, int srcHeight, int limitWidth, int limitHeight){
		double rx = (double)limitWidth / (double)srcWidth;
		double ry = (double)limitHeight / (double)srcHeight;
		
		return rx > ry ? ry : rx;
	}
	
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
	
	public static String formatName(AbImageDecoder decoder) {
		return decoder == AbImageDecoder.ABDEC_PNG ? "png" : "jpg";
	}

	public static void write (RenderedImage image, AbImageDecoder decoder, File out) throws IOException {
		ImageIO.write(image, formatName(decoder), out);
	}

	public static void write (RenderedImage image, AbImageDecoder decoder, OutputStream out) throws IOException {
		ImageIO.write(image, formatName(decoder), out);
	}

	public static void write (RenderedImage image, AbImageDecoder decoder, ImageOutputStream out) throws IOException {
		ImageIO.write(image, formatName(decoder), out);
	}
	
}
