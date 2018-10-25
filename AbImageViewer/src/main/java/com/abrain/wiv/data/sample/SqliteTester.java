package com.abrain.wiv.data.sample;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * 이 클래스는 SQLite 테스트용으로, 이미지 뷰어와는 연관이 없습니다.
 * @author Administrator
 *
 */
public class SqliteTester {
	
	static {
		try
		{
			Class.forName("org.sqlite.JDBC");
		}
		catch (Exception e)
		{
			System.out.println(e);
		}		
	}

	public int test() {
		try
		{
			Connection conn = DriverManager.getConnection("jdbc:sqlite:C:\\abrain.db");
			
			String sql = "SELECT COUNT(*) FROM AB_DOC";
			
			PreparedStatement pmt = conn.prepareStatement(sql);
			
			ResultSet rs = pmt.executeQuery();
			
			int value = 0;
			
			while (rs.next()) {
				value = rs.getInt(1);
			}
			
			conn.close();
			
			return value;
		}
		catch (Exception e)
		{
			System.out.println(e);
		}
		return -1;
	}
}
