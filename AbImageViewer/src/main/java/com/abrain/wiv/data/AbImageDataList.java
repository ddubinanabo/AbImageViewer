package com.abrain.wiv.data;

import java.util.List;

/**
 * 이미지 목록 정보
 * <p>* 브라우저에 제공하는 이미지 및 북마크 목록입니다.
 * @author Administrator
 *
 */
public class AbImageDataList {
	/**
	 * 이미지 목록 정보
	 * @param images 이미지 정보 목록
	 */
	public AbImageDataList(List<AbImageData> images) {
		this.images = images;
	}
	/**
	 * 이미지 목록 정보
	 * @param images 이미지 정보 목록
	 * @param bookmarks 북마크 인덱스 배열
	 */
	public AbImageDataList(List<AbImageData> images, List<Integer> bookmarks) {
		this.images = images;
		this.bookmarks = bookmarks;
	}
	
	//-----------------------------------------------------------

	/**
	 * 이미지 정보 목록
	 */
	private List<AbImageData> images;
	/**
	 * 북마크 인덱스 배열
	 */
	private List<Integer> bookmarks;
	
	//-----------------------------------------------------------

	/**
	 * 이미지 정보 목록을 가져옵니다.
	 * @return 이미지 정보 목록
	 */
	public List<AbImageData> getImages() { return images; }
	//public void setImages(List<AbImageData> value) { images = value; }

	/**
	 * 북마크 인덱스 배열을 가져옵니다.
	 * @return 북마크 인덱스 배열
	 */
	public List<Integer> getBookmarks() { return bookmarks; }
	//public void setBookmarks(List<Integer> value) { bookmarks = value; }
}
