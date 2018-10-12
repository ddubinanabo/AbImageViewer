package com.abrain.wiv.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {
	public static String time(String format) {
		long time = System.currentTimeMillis();
		Date date = new Date(time);
		SimpleDateFormat fmt = new SimpleDateFormat(format);
		return fmt.format(date);
	}	
	
	public static String YMD() {
		return time("yyyyMMdd");
	}
	
	public static String YMDHIS() {
		return time("yyyyMMddHHmmss");
	}
}
