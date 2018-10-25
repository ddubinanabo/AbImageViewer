package com.abrain.wiv.data;

/**
 * 퍼미션 DB 정보
 * @author Administrator
 *
 */
public class AbPermissionDbData {
	/**
	 * 계정 권한 레벨
	 */
	private String usrLvl;
	/**
	 * 아이템 구분
	 */
	private String itmTp;
	/**
	 * 아이템
	 */
	private String itm;
	/**
	 * 허용여부 (Y/N)
	 */
	private String useYn;
	/**
	 * 아이템 설명
	 */
	private String dsc;

	//-----------------------------------------------------------

	/**
	 * 계정 권한 레벨(을)를 가져옵니다.
	 * @return 계정 권한 레벨
	 */
	public String getUsrLvl() { return usrLvl; }
	/**
	 * 계정 권한 레벨(을)를 설정합니다.
	 * @param value 계정 권한 레벨
	 */
	public void setUsrLvl(String value) { usrLvl = value; }

	/**
	 * 아이템 구분(을)를 가져옵니다.
	 * @return 아이템 구분
	 */
	public String getItmTp() { return itmTp; }
	/**
	 * 아이템 구분(을)를 설정합니다.
	 * @param value 아이템 구분
	 */
	public void setItmTp(String value) { itmTp = value; }

	/**
	 * 아이템(을)를 가져옵니다.
	 * @return 아이템
	 */
	public String getItm() { return itm; }
	/**
	 * 아이템(을)를 설정합니다.
	 * @param value 아이템
	 */
	public void setItm(String value) { itm = value; }

	/**
	 * 허용여부(을)를 가져옵니다.
	 * @return 허용여부 (Y/N)
	 */
	public String getUseYn() { return useYn; }
	/**
	 * 허용여부(을)를 설정합니다.
	 * @param value 허용여부 (Y/N)
	 */
	public void setUseYn(String value) { useYn = value; }

	/**
	 * 아이템 설명(을)를 가져옵니다.
	 * @return 아이템 설명
	 */
	public String getDsc() { return dsc; }
	/**
	 * 아이템 설명(을)를 설정합니다.
	 * @param value 아이템 설명
	 */
	public void setDsc(String value) { dsc = value; }
}
