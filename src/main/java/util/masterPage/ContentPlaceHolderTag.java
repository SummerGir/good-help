package util.masterPage;

import com.google.common.base.Strings;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.BodyTagSupport;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by xiucai on 2017/10/18.
 */
public class ContentPlaceHolderTag extends BodyTagSupport {
    @Override
    public int doEndTag() throws JspException {

        String writeId = (String) this.pageContext.getRequest().getAttribute(Consts.WRITE_PAGE_ID);

        String attrName = writeId + "___" + this.getId();
        String attrValue = (String) this.pageContext.getRequest().getAttribute(attrName);
        if (!Strings.isNullOrEmpty(attrValue)) {
            this.pageContext.getRequest().removeAttribute(attrName);
            try {
                this.pageContext.getOut().write(attrValue);
            } catch (IOException e) {
                e.printStackTrace();
                e.printStackTrace(new PrintWriter(this.pageContext.getOut()));
            }
        }
        return EVAL_PAGE;
    }
}
