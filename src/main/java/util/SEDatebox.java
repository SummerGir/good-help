package util;

import java.util.Date;

import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.EventListener;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zul.Datebox;


public class SEDatebox extends Datebox
{
  String data;
  
  public SEDatebox(){
	  this.setFormat("yyyy-MM-dd HH:mm:ss");	
	  this.setWidth("150px");
//	  this.addEventListener(Events.ON_CHANGE, new Changelistener());
//	  addEventListener(Events.ON_OK, new OnOkListener());
  }
  public void onCreate()
  {
	  setId("e_" + getData());
	  addForward(Events.ON_OK, (Component) this.getSpaceOwner(), "onSearch");
  }
//  private class OnOkListener implements EventListener{
//		public void onEvent(Event arg0) throws Exception {
//			onOk();		
//		}	
//	}
//  public void onOk() throws Exception{
//		HotWindow basewnd=(HotWindow) getFellow("baseWnd");
//		if(basewnd!=null){
//			basewnd.search();
//		}else{
//			ListboxWindow boxwnd=(ListboxWindow) getFellow("listboxWnd");
//			if(boxwnd!=null)
//				boxwnd.search();
//			else{
//				//Ӧ���ж�lookupWnd.��ΪlookupWnd��Ҳ����firstPage
//				SearchWindow searchWnd=(SearchWindow)getFellow("lookupWnd");//SearchWindow
//				if(searchWnd!=null){
//					searchWnd.search();						
//				}else{
//					HFirstpage navigator=((HFirstpage)getFellow("firstPage"));//TableWindow or LTableWindow				
//					HotWindow hotWindow=(HotWindow)getFellow(navigator.getBand());
//					if(hotWindow!=null){						
//						hotWindow.search();
//					}
//				}
//			}
//		}		
//	}
  private class Changelistener implements EventListener{
		public void onEvent(Event arg0) throws Exception {
			SEDatebox sedatebox=(SEDatebox) arg0.getTarget();
			Date value=sedatebox.getValue();
			if(value==null)
				return;
			java.util.Calendar c = java.util.Calendar.getInstance();
			c.setTime(value);
			c.set(java.util.Calendar.SECOND, 59);
			sedatebox.setValue(c.getTime());	
		}	  
	  }
  public String getData()
  {
    return this.data;
  }

  public void setData(String paramString)
  {
    this.data = paramString;
  }
}