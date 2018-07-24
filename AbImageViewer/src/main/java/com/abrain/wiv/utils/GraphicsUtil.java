package com.abrain.wiv.utils;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.PixelGrabber;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;

public class GraphicsUtil {
	private static final String PREFIX = "thumb_";
	
	private static final int THUMB_WIDTH = 120, THUMB_HEIGHT = 120;
	
	//-----------------------------------------------------------
	
	public static class ThumbnailResult {
		public int srcWidth, srcHeight;
		public int width, height;
		public String name;
		public Exception e;
	}
	
	//-----------------------------------------------------------

	public static ThumbnailResult thumbnail(File imgFile) {
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
			
			ImageIO.write(dest, "jpg", thumbFile);
			
			r.srcWidth = srcWidth;
			r.srcHeight = srcHeight;
			r.width = thumbWidth;
			r.height = thumbHeight;
			r.name = thumbnail;
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
}
