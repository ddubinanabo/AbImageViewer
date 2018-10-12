package com.abrain.wiv.data;

import java.util.List;

/**
 * 브라우저에 제공하는 이미지 및 북마크 목록
 * @author Administrator
 *
 */
public class AbImageDataList {
	public AbImageDataList(List<AbImageData> images) {
		this.images = images;
	}
	public AbImageDataList(List<AbImageData> images, List<Integer> bookmarks) {
		this.images = images;
		this.bookmarks = bookmarks;
	}
	
	//-----------------------------------------------------------

	private List<AbImageData> images;
	private List<Integer> bookmarks;
	
	//-----------------------------------------------------------

	public List<AbImageData> getImages() { return images; }
	//public void setImages(List<AbImageData> value) { images = value; }

	public List<Integer> getBookmarks() { return bookmarks; }
	//public void setBookmarks(List<Integer> value) { bookmarks = value; }
}
