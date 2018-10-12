package com.abrain.wiv.data;

/**
 * 이미지 북마크 DB 정보
 * @author Administrator
 *
 */
public class AbBookmarkDbData {
	private String id;
	private Integer seq;
	private Integer bmSeq;

	//-----------------------------------------------------------

	public String getId() { return id; }
	public void setId(String value) { id = value; }

	public Integer getSeq() { return seq; }
	public void setSeq(Integer value) { seq = value; }

	public Integer getBmSeq() { return bmSeq; }
	public void setBmSeq(Integer value) { bmSeq = value; }
}
