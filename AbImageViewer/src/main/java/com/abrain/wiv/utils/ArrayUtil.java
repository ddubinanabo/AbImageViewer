package com.abrain.wiv.utils;

/**
 * 배열 관련 도구
 * @author Administrator
 *
 */
public class ArrayUtil {
	/**
	 * 배열에서 지정된 요소를 찾을 수있는 첫 번째 인덱스를 반환하고 존재하지 않으면 -1을 반환합니다.
	 * @param a 배열
	 * @param value 찾을 요소
	 * @return 인덱스
	 */
	public static int indexOf(Object[] a, Object value) {
		if (a == null || a.length < 1)
			return -1;
		
		int len = a.length;
		if (value == null) {
			for (int i=0; i < len; i++) {
				if (a[i] == null)
					return i;
			}
			
		}else {
			for (int i=0; i < len; i++) {
				if (a[i].equals(value))
					return i;
			}
		}		
		return -1;
	}

	/**
	 * 지정된 요소가 배열에서 발견 될 수있는 마지막 인덱스를 반환하고, 존재하지 않으면 -1을 반환합니다.
	 * @param a 배열
	 * @param value 찾을 요소
	 * @return 인덱스
	 */
	public static int lastIndexOf(Object[] a, Object value) {
		if (a == null || a.length < 1)
			return -1;
		
		int len = a.length;
		if (value == null) {
			for (int i=len - 1; i >= 0; i--) {
				if (a[i] == null)
					return i;
			}
			
		}else {
			for (int i=len - 1; i >= 0; i--) {
				if (a[i].equals(value))
					return i;
			}
		}		
		return -1;
	}
}
