<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<style>
  .news .tabselect_admin{padding: 0;overflow: hidden;border: 1px solid #ddd;}
  .news .nav-tabs>a{padding:5px 10px 5px 10px; color: #919191;display: block; text-decoration: none}
  .news .nav-tabs>a:hover{background:none; border-bottom: 2px solid #ff9800; }
  .news .nav-tabs>a.active{border:none;border-bottom: 2px solid #ff9800; background: none; color: #000}
  .news .tabselect_admin.panel-body{padding: 0;}
  .news .tabselect_admin{border-bottom: 1px solid #f3f3f3;}
  .news .tabselect_admin a{margin-right: 5%}
  .news .nav-tabs{border-bottom: none;}
  .news .tabselect_admin .tab-content{padding: 4px 0px;}
  .news #swiperDoc .swiper-slide{  width: auto;float: left;  }
  .news #swiperDoc {  border-bottom: 1px solid #f1f1f1;  }
  .news .tab_content_admin ul li{border-bottom: none;height: 30px; line-height: 30px; overflow: hidden; margin-right: 0;padding-right: 20px;padding-left: 6px;}
  .news .tab_content_admin ul{padding-left: 0}
  .news .tab_content_admin ul li i,.tab_content_admin ul li a,.tab_content_admin ul li span,.tab_content_admin ul li em{display: block; color: #000; float: left;}
  .news .tab_content_admin ul li i{display: block;width: 5px; height: 5px; border-radius: 50%; margin-top: 16px; margin-right: 5px}
  .news .tab_content_admin ul li span{color: #919191;}
  .news .tab_content_admin ul li em{float: right;color: #919191;}
</style>
<!--新闻中心-->
<div class="panel panel-default news" style="height: 100%;">
  <div style="width: 100%;height: 2px;background-color: rgba(16,147,237,0.3);padding: 0;"></div>
  <div class="panel-heading"style="height: 30px;background-color: white">
    <h3 class="panel-title" style="padding: 0;line-height: 7px;">
      <span style="font-size: 14px;font-weight: normal;cursor: default;">新闻中心</span>
    </h3>
  </div>
  <div style="padding: 8px 15px;">
    <div class="panel-body tabselect_admin" style="height: 188px;">
    <div class="swiper-container2 panel-body" style="height: 34px;padding: 0;border:none;border-bottom: 1px solid #eee; ">
      <div class="swiper-wrapper" style="height: 100%;" id="swiperDoc">

      </div>
    </div>
    <div class="tab-content tab_content_admin tab_content_admin_doc">
    </div>
    <script>
      $(function () {
        $('#tabnews_admin li:eq(0) a').tab('show');
      });
    </script>
  </div>
  </div>
</div>