package com.abrain.wiv;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.abrain.wiv.converters.PolarisConverter;
import com.abrain.wiv.data.AbBinaryData;
import com.abrain.wiv.data.AbImageType;
import com.abrain.wiv.exceptions.ArgumentException;
import com.abrain.wiv.exceptions.EmptyDataException;
import com.abrain.wiv.services.DocService;
import com.abrain.wiv.utils.FileUtil;

/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {
	
	@Autowired
	private DocService svc;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home() throws Exception {
		
		//throw new Exception("Exception Test");
		
		return "home";
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public String homeWithId(@PathVariable(value="id") String id, Model model) throws Exception {
		if (id != null && !id.isEmpty())
			model.addAttribute("id", id);
		
		return "home";
	}
	
	@RequestMapping(value = "/doc")
	public void doc(String q, String n, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (q == null || q.isEmpty())
			throw new ArgumentException();

		if (n == null || n.isEmpty())
			throw new ArgumentException();
		
		PolarisConverter.download(q, n, request, response);
	}
	
	@RequestMapping(value = "/img")
	public void img(String q, String s, @RequestParam(required=false) String t, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (q == null || q.isEmpty())
			throw new ArgumentException();

		if (s == null || s.isEmpty())
			throw new ArgumentException();
		
		int seq = 0;
		
		try
		{
			seq = Integer.parseInt(s);
		}
		catch (Exception e)
		{
			System.out.println("[IMAGE][SEQ] Exception!!!");
			
			throw new ArgumentException();
		}
		
		AbImageType type = AbImageType.find(t);
		
		AbBinaryData r = svc.image(q, seq, type);
		
		if (r == null || r.length == 0){
			throw new EmptyDataException();
		}
		
		ByteArrayInputStream in = null;
		OutputStream out = null;
		Exception ex = null;
		
		try
		{
			in = new ByteArrayInputStream(r.bytes);
			out = response.getOutputStream();
			
	        response.setHeader("Content-Disposition", "attachment;filename=\""+seq+"\";");
			response.setHeader("Content-Transfer-Encoding", "binary");
			
			FileUtil.write(in, out);
		}
		catch (IOException ioe)
		{
			System.out.println("[IMAGE] IOException");
			ex = ioe;
		}
		catch (Exception e)
		{
			System.out.println("[IMAGE] Exception");
			ex = e;
		}
		finally
		{
			if (in != null){
				try
				{
					in.close();
				}
				catch (IOException ioe)
				{
					System.out.println("[IMAGE] in close IOException");
				}
				catch (Exception e)
				{
					System.out.println("[IMAGE] in close Exception");
				}
			}
			
			if (out != null){
				try
				{
					out.close();
				}
				catch (IOException ioe)
				{
					System.out.println("[IMAGE] out close IOException");
				}
				catch (Exception e)
				{
					System.out.println("[IMAGE] out close Exception");
				}
			}
		}
		
		if (ex != null)
			throw ex;
	}
}
