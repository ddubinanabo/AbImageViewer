package com.abrain.wiv.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 날짜 관련 도구
 * @author Administrator
 *
 */
public class DateUtil {
	/**
	 * 현재 시간을 형식으로 포매팅합니다.
	 * @param format 형식
	 * @return 포매팅 시간
	 */
	public static String time(String format) {
		long time = System.currentTimeMillis();
		Date date = new Date(time);
		SimpleDateFormat fmt = new SimpleDateFormat(format);
		return fmt.format(date);
	}	
	
	/**
	 * 현재 일자를 yyyyMMdd 형식으로 가져옵니다.
	 * @return yyyyMMdd 형식 날짜
	 */
	public static String YMD() {
		return time("yyyyMMdd");
	}
	
	/**
	 * 현재 시간을 yyyyMMddHHmmss 형식으로 가져옵니다.
	 * @return yyyyMMddHHmmss 형식 시간
	 */
	public static String YMDHIS() {
		return time("yyyyMMddHHmmss");
	}
}
