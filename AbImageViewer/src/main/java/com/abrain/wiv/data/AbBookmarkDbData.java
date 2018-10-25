package com.abrain.wiv.data;

/**
 * 이미지 북마크 DB 정보
 * @author Administrator
 *
 */
public class AbBookmarkDbData {
	/**
	 * 이미지 목록 ID
	 */
	private String id;
	/**
	 * 이미지 목록의 인덱스
	 */
	private Integer seq;
	/**
	 * 북마크 번호
	 */
	private Integer bmSeq;

	//-----------------------------------------------------------

	/**
	 * 이미지 목록 ID(을)를 가져옵니다.
	 * @return 이미지 목록 ID
	 */
	public String getId() { return id; }
	/**
	 * 이미지 목록 ID(을)를 설정합니다.
	 * @param value 이미지 목록 ID
	 */
	public void setId(String value) { id = value; }

	/**
	 * 이미지 목록의 인덱스(을)를 가져옵니다.
	 * @return 이미지 목록의 인덱스
	 */
	public Integer getSeq() { return seq; }
	/**
	 * 이미지 목록의 인덱스(을)를 설정합니다.
	 * @param value 이미지 목록의 인덱스
	 */
	public void setSeq(Integer value) { seq = value; }

	/**
	 * 북마크 번호(을)를 가져옵니다.
	 * @return 북마크 번호
	 */
	public Integer getBmSeq() { return bmSeq; }
	/**
	 * 북마크 번호(을)를 설정합니다.
	 * @param value 북마크 번호
	 */
	public void setBmSeq(Integer value) { bmSeq = value; }
}
