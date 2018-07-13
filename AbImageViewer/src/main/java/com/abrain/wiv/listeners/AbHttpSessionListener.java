package com.abrain.wiv.listeners;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.apache.commons.io.FileUtils;

import org.apache.log4j.Logger;

public class AbHttpSessionListener implements HttpSessionListener, ServletContextListener {
	
	private static ServletContext context;
	
	private Logger logger = Logger.getLogger(AbHttpSessionListener.class);

	@Override
	public void contextDestroyed(ServletContextEvent event) {
		context = null;
	}

	@Override
	public void contextInitialized(ServletContextEvent event) {
		context = event.getServletContext();
	}
	
	//-----------------------------------------------------------------------------------

	@Override
	public void sessionCreated(HttpSessionEvent event) {
		String sessionId = null;
		HttpSession session = event.getSession();

		if (session != null)
			sessionId = session.getId();
		
		System.out.println("[HTTP Session] Created, ID: " + sessionId);
		
		if (logger.isDebugEnabled()) {
            logger.debug("[HTTP Session] Session ID".concat(sessionId).concat(" created at ").concat(new Date().toString()));
        }
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent event) {
		String sessionId = null;
		HttpSession session = event.getSession();

		if (session != null)
			sessionId = session.getId();
		
		if (logger.isDebugEnabled()) {
            logger.debug("[HTTP Session] Session ID".concat(sessionId).concat(" destroyed at ").concat(new Date().toString()));
        }
		
		System.out.println("[HTTP Session] Destoryed, ID: " + sessionId);
		
		if (context != null && session != null){
			String docDirPath = context.getRealPath("/WEB-INF/docs/" + sessionId);
			File docDir = new File(docDirPath);
			
			if (docDir.exists()){
				try
				{
					FileUtils.deleteDirectory(docDir);
					
					System.out.println("[HTTP Session][remove-template] remove directory!!!");
				}
				catch (IOException ioe)
				{
					System.out.println("[HTTP Session][remove-template] IOException");
				}
				catch (Exception e)
				{
					System.out.println("[HTTP Session][remove-template] Exception");
				}
			}else{
				System.out.println("[HTTP Session][remove-template] not found directory!!!");
			}
		}
	}
}
