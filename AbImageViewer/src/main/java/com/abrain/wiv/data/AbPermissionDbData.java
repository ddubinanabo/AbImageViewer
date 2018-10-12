package com.abrain.wiv.data;

/**
 * 퍼미션 DB 정보
 * @author Administrator
 *
 */
public class AbPermissionDbData {
	private String usrLvl;
	private String itmTp;
	private String itm;
	private String useYn;
	private String dsc;

	//-----------------------------------------------------------

	public String getUsrLvl() { return usrLvl; }
	public void setUsrLvl(String value) { usrLvl = value; }

	public String getItmTp() { return itmTp; }
	public void setItmTp(String value) { itmTp = value; }

	public String getItm() { return itm; }
	public void setItm(String value) { itm = value; }

	public String getUseYn() { return useYn; }
	public void setUseYn(String value) { useYn = value; }

	public String getDsc() { return dsc; }
	public void setDsc(String value) { dsc = value; }
}
