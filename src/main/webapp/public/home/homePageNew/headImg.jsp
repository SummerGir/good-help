<%@ page import="com.sun.image.codec.jpeg.JPEGCodec" %>
<%@ page import="com.sun.image.codec.jpeg.JPEGImageEncoder" %>
<%@ page import="eiis.app.memberarchives.entity.AppMemberPersonArchivesEntity" %>
<%@ page import="eiis.app.memberarchives.service.MemberPersonArchivesService" %>
<%@ page import="eiis.membership.Member" %>
<%@ page import="org.hibernate.LobHelper" %>
<%@ page import="org.hibernate.Query" %>
<%@ page import="org.hibernate.Session" %>
<%@ page import="org.hibernate.SessionFactory" %>
<%@ page import="javax.imageio.ImageIO" %>
<%@ page import="javax.imageio.stream.ImageOutputStream" %>
<%@ page import="java.awt.*" %>
<%@ page import="java.awt.image.BufferedImage" %>
<%@ page import="java.io.*" %>
<%@ page import="java.sql.Blob" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="java.util.*" %>
<%@ page import="java.util.List" %>
<%@ page import="java.awt.font.FontRenderContext" %>
<%@ page import="java.awt.geom.Rectangle2D" %>
<%@ page import="eiis.membership.Person" %>
<%@ page import="eiis.app.memberarchives.service.MemberPhotoService" %>
<%@ page import="eiis.app.memberarchives.entity.AppMemberPhotoEntity" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%!
  SessionFactory sessionFactory = null;
  MemberPhotoService photoService=MemberPhotoService.getInstance();
  SessionFactory getSessionFactory(){
    if (sessionFactory == null)
    {
      sessionFactory = eiis.util.spring.ApplicationContext.getCurrent().getBean(SessionFactory.class);
    }
    return sessionFactory;
  }

  AppMemberPersonArchivesEntity getMemberArchives(String id){
    Session session = getSessionFactory().openSession();
    List<AppMemberPersonArchivesEntity> list = new ArrayList<AppMemberPersonArchivesEntity>();
    try{
      Query query = session.createQuery("from AppMemberPersonArchivesEntity where memberId=:memberId")
              .setParameter("memberId",id);
      list = query.list();
    }finally {
      session.close();
      if(list.size() > 0){
        return list.get(0);
      }else{
        AppMemberPersonArchivesEntity member = new AppMemberPersonArchivesEntity();
        return member;
      }
    }
  }
  public String getStr(String str,int len){
    int i=0;
    String newStr="";
    for(String s:str.split("")){
      i+=s.getBytes().length;
      if(i>len){
        newStr+="..";
        break;
      }
      newStr+=s;
    }
    return newStr;
  }

  public BufferedImage createPhoto(String name){
    //备选背景色
    int[] rC={45,90,70,80,200,200,220,140,110,80,180};
    int[] gC={204,200,140,80,120,120,150,200,150,15,200};
    int[] bC={112,200,200,180,200,120,40,100,160,10,160};
    int i=(int)(Math.random()*10);
    int width=100,height=100;

    BufferedImage image= new BufferedImage(width,height, BufferedImage.TYPE_INT_RGB);
    Graphics2D g = image.createGraphics();
    g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
    g.clearRect(0, 0, width, height);
    Color c=new Color(rC[i],gC[i],bC[i]);//背景颜色
    g.setColor(c);
    g.fillRect(0, 0, width, height);

    g.setColor(new Color(255,255,255));//字体颜色 白色
    Font font = new Font("微软雅黑", Font.CENTER_BASELINE, 25);
    g.setFont(font);

    //字体居中
    FontRenderContext context = g.getFontRenderContext();
    Rectangle2D bounds = font.getStringBounds(name, context);
    double x = (width - bounds.getWidth()) / 2;
    double y = (height - bounds.getHeight()) / 2;
    double ascent = -bounds.getY();
    double baseY = y + ascent;
    g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

    g.drawString(name, (int) x, (int) baseY);
    return image;
  }
%>

<%

  String id = request.getParameter("personId");
  String account = request.getParameter("account");
  String name = StringUtils.isNotBlank(request.getParameter("name"))?request.getParameter("name"):"补";
  if(StringUtils.isBlank(id) && StringUtils.isNotBlank(account)){
    Person p = Person.get(account);
    if(p!=null){
      id = p.getId().toString();
    }
  }

  BufferedInputStream inputimage=null;
  BufferedImage image = null;
  if(StringUtils.isNotBlank(id)){
    AppMemberPersonArchivesEntity memberArchives = getMemberArchives(id);

    boolean have=false;
    if(memberArchives.getMemberPhoto()!=null){
      Blob blob = memberArchives.getMemberPhoto();
      inputimage = new BufferedInputStream(blob.getBinaryStream());
      try{
        image = ImageIO.read(inputimage);
        if(image==null){
          have=true;
        }else{
          have=false;
        }
      }catch(IOException e){
        System.out.println(e);
      }
    }else{
      have=true;
    }
     /*
        * 如果头像为空，自动生成临时头像！
        * 2016-05-12 xsb
        * */
    if(have){
      //名称
      Member mem=Member.get(UUID.fromString(id.toString()));
      if(mem!=null && mem.getName()!=null){
        name= mem.getName().toString();
        name=getStr(name,6);//处理字符串超长问题
      }else{
        name="E-施工";
      }
      image=createPhoto(name);
      ByteArrayOutputStream bs =new ByteArrayOutputStream();

      ImageOutputStream imOut =ImageIO.createImageOutputStream(bs);

      ImageIO.write(image,"jpg",imOut); //scaledImage1为BufferedImage
      byte[] b=bs.toByteArray();
      Session sessions = getSessionFactory().openSession();
      LobHelper lobHelper = sessions.getLobHelper();
      Blob blob = lobHelper.createBlob(b);
      memberArchives.setMemberId(id);
      memberArchives.setMemberPhoto(blob);
      MemberPersonArchivesService.getInstance().save(memberArchives);

      inputimage = new BufferedInputStream(blob.getBinaryStream());
      try{
        image = ImageIO.read(inputimage);
      }catch(IOException e){
        System.out.println(e);
      }
    }
  }else if(StringUtils.isNotBlank(name)){
    name=name.trim();
    AppMemberPhotoEntity pEntity=photoService.findOneByName(name);
    boolean have=false;
    if(pEntity!=null && pEntity.getpPhoto()!=null){
      Blob blob = pEntity.getpPhoto();
      inputimage = new BufferedInputStream(blob.getBinaryStream());
      try{
        image = ImageIO.read(inputimage);
        if(image==null){
          have=true;
        }else{
          have=false;
        }
      }catch(IOException e){
        System.out.println(e);
      }
    }else{
      have=true;
    }
    if(have){
      image=createPhoto(name);
      ByteArrayOutputStream bs =new ByteArrayOutputStream();

      ImageOutputStream imOut =ImageIO.createImageOutputStream(bs);

      ImageIO.write(image,"jpg",imOut); //scaledImage1为BufferedImage
      byte[] b=bs.toByteArray();
      Session sessions = getSessionFactory().openSession();
      LobHelper lobHelper = sessions.getLobHelper();
      Blob blob = lobHelper.createBlob(b);

      pEntity=new AppMemberPhotoEntity();
      pEntity.setpId(UUID.randomUUID().toString());
      pEntity.setpName(name);
      pEntity.setpPhoto(blob);
      photoService.save(pEntity);

      inputimage = new BufferedInputStream(blob.getBinaryStream());
      image = ImageIO.read(inputimage);

    }
  }

  if(image!=null){
    OutputStream sos = response.getOutputStream();
    JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(sos);
    encoder.encode(image);
    inputimage.close();
    out.clear();
    sos.flush();
    sos.close();
    out = pageContext.pushBody();
  }
%>