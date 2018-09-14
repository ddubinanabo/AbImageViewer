package com.abrain.wiv.utils;

public class ArrayUtil {
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
