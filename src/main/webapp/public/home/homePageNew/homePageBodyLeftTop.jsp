<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<style>
  .shortcut .panel-heading h3 i{display: block;width:20px; height: 20px; position: absolute; margin-left: 16px; top: 4px;}
  .shortcut .panel-heading .a_sz{cursor: pointer;right: 10px;top: 15px;font-size: 18px;color: #ababab;}
  .shortcut .panel-heading h3 i span{display: block;position: absolute; left:46px}
</style>
<!--快捷方式-->
<div class="panel panel-default shortcut" style="height: 100%;">
  <div style="width: 100%;height: 2px;background-color: rgba(16,147,237,0.3);padding: 0;"></div>
  <div class="panel-heading" style="height: 30px;background-color: white">
    <h3 class="panel-title" style="padding:0;line-height: 7px;">
      <span style="font-size: 14px;font-weight: normal;cursor: default;">快捷方式</span>
      <i class="a_sz iconfont icon-shezhi1">
        <div class="a_kj_div" style="display: none">
          <div class="a_kj_div_sanjiao1"></div>
          <div class="a_kj_div_sanjiao2"></div>
          <div class="a_kj_div_sanjiao3"></div>
          <div class="a_kj_div_item" style="border-bottom: 2px solid #ebebeb;line-height: 26px;">
            <i class="a_kj_div_item_add"></i>
            <span class="a_kj_div_item_add_span">添加菜单</span>
          </div>
          <div class="a_kj_div_item" style="line-height: 30px;">
            <i class="a_kj_div_item_delete"></i>
            <span class="a_kj_div_item_delete_span">编辑菜单</span>
          </div>
        </div>
      </i>
    </h3>
  </div>
  <div class="panel-body qucly_admin clearfix" style="border: none;padding: 0;">

  </div>
</div>
<div class="modal fade" id="appPanel" tabindex="-1" aria-hidden="true" data-backdrop="static">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h4 class="modal-title">快捷应用</h4>
  </div>
  <div class="modal-body">
    <div class="form-horizontal">
      <table style="height:150px" align="center" border="0" cellspacing="1" cellpadding="0" class="wTableBox">
        <tr height="26">
          <td align="right" nowrap>成员应用：</td>
          <td nowrap>
            <input
                    type="text"
                    class="eiis-application"
                    data-select-root="false"
                    data-multiple="false"
                    data-isCompetence="true"
                    name="tmp_mod_id"
                    style="width: 240px"
                    placeholder="请选择应用"
                    />
          </td>
        </tr>
        <tr class="" height="26">
          <td align="right" nowrap>快捷名称：</td>
          <td nowrap>
            <input class="eiis-text" name="app_title" maxlength="50" value="" placeholder="默认为应用名称">
          </td>
        </tr>
      </table>
    </div>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" id="saveApp"><i class="fa fa-save"></i>保存</button>
    <button type="button" class="eiis-button btn-default" data-dismiss="modal">关闭</button>
  </div>
</div>
<script type="text/javascript">
  var globResult;
  !function(){
    var globState=true;
    $(".a_kj_div_item").bind("click",function(){
      event.preventDefault();
      event.stopPropagation();
    });
    $(".a_sz").bind("click",function(){
      var kjDiv = $(".a_kj_div");
      if(kjDiv.is(":hidden")){
        kjDiv.fadeIn("slow");
      }else{
        kjDiv.fadeOut("slow");
        if(!globState){
          quclyAdmin.sortable("disable");
          $(".itemDelete").fadeOut("slow");
          globState=true;
          $(".a_left").css("cursor","pointer");
        }
      }
    });
    $(".a_kj_div_item_add_span").bind("click",function(){
      $(".wTableBox input[name='tmp_mod_id']").val("");
      $(".wTableBox input[name='app_title']").val("");
      $("#appPanel").modal();
    });
    $(".a_kj_div_item_delete_span").bind("click",function(){
      if(globState){
        quclyAdmin.sortable("enable");
        $(".itemDelete").fadeIn("slow");
        globState=false;
        $(".a_left").css("cursor","default");

        $(".a_kj_div").fadeOut("slow");
      }else{
        quclyAdmin.sortable("disable");
        $(".itemDelete").fadeOut("slow");
        globState=true;
        $(".a_left").css("cursor","pointer");
      }
    });
    window.onload=function(){
      EIIS.Common.loadComponent(EIIS.Common.controls.member);
      EIIS.Common.loadJavaScript("/public/js/Form.js");
      EIIS.Common.loadJavaScript("/sys/shortcut/js/eiis.application.js");
      EIIS.Common.loadJavaScript("/sys/shortcut/js/eiis.webui.application.js");

      var interval=setInterval(function(){
        try{
          quclyAdmin.sortable("disable");
          clearInterval(interval);
        }catch (e){
        }
      },100);
      var interval2=setInterval(function(){
        try{
          if(reloadApp()){
            clearInterval(interval2);
          };
        }catch (e){
        }
      },100);
      $(".wTableBox input[name='tmp_mod_id']").on({
        "ok.application": function (event,data) {
          var tempMyPlaceholder=$("#tempMyPlaceholder");
          if(String.isNullOrWhiteSpace($("#app_title").val())){
            $(".wTableBox input[name='app_title']").val(data.text);
            tempMyPlaceholder.hide();
          }else{
            tempMyPlaceholder.show();
          }
        }
      }).on({
        "clear.application": function (event,data) {
          var tempMyPlaceholder=$("#tempMyPlaceholder");
          tempMyPlaceholder.show();
        }
      });
      $(document).bind("click",function(){
        var target=$(event.target);
        if(target.parent(".a_left").length==0 && target.hasClass("a_sz")==false && target.parents(".modal").length==0){
          $(".a_kj_div").fadeOut("slow");
          if(!globState){
            quclyAdmin.sortable("disable");
            $(".itemDelete").fadeOut("slow");
            globState=true;
            $(".a_left").css("cursor","pointer");
          }
        }
      });
      window.onresize=function(){
        quclyAdmin.sortable("option",{
          cursorAt : {
            top : (quclyAdmin.height()/3)/2,
            left : (quclyAdmin.width()/4)/2
          }
        });
      };
      quclyAdmin.sortable("option",{
        cursorAt : {
          top : (quclyAdmin.height()/3)/2,
          left : (quclyAdmin.width()/4)/2
        }
      });
    };
    var reloadApp=function(){
      var but=$("#appPanel").find(".tags-btn>button");
      if(but.length==0){
        return false;
      }
      var i=but.children();
      but.text("");
      but.append(i);
      var tagsInput=$("#appPanel").find(".tagsinput");
      if(tagsInput.length==0){
        return false;
      }
      tagsInput.append($("<span id=\"tempMyPlaceholder\"></span>").text("请选择应用").css({
        "position" : "absolute",
        "left": "10px",
        "font-size": "14px",
        "font-weight": "normal",
        "color": "#ababab",
        "top" : "5px"
      }));
      return true;
    };
    var quclyAdmin = $(".qucly_admin");
    var resetShortcut=function(indexNum){
      $.each(quclyAdmin.children(),function(i,o){
        if(i<indexNum){
          return true;
        }
        $(o).attr("indexNum",(Number($(o).attr("indexNum"))-1));
      });
    };
    var deleteShortcut=function(shortcutId,a){
      event.preventDefault();
      event.stopPropagation();
      var indexNum=Number($(a).attr("indexNum"));
      $.message({
        button: $.message.button.yesNo
        , text: "确认删除?"
        , result: function (result) {
          if (result == $.message.result.yes) {
            $.message.loader.open('正在删除...');
            $.ajax({
              type : "post",
              url : "/public/shortcut/deleteShortcut2.do",
              data : {
                shortcutId : shortcutId,
                indexNum : indexNum
              },
              dataType : "json",
              success : function(msg){
                $.message.loader.close();
                if(msg.errorCode==0){
                  resetShortcut(indexNum);
                  $(".qucly_admin>a").eq(indexNum-1).remove();
                  $.message("删除成功");
                }else{
                  $.message("删除失败");
                }
              }
            });
          }
        }
      });
    };
    var putShortcut=function (self){
      var a;
      var color = self.color;
      if(!color) color = "#5fd7f2";
      if(self.imgName){
        a=$("<a style='width: 122px;height: 64px;border-radius: 4px;cursor: pointer;margin-left: 11px;text-decoration: none;'></a>").css({
            "background" : color}).addClass("a_left").attr("href","#").attr("indexNum",self.app_order).append($("<i style='width: 16px;  height: 16px;  margin-left: 6px;  top: 6px;font-size: 16px;line-height: normal;color: #fff;opacity:0.6;filter:alpha(opacity=60);'></i>").addClass(self.imgName).append($("<img/>").addClass("itemDelete").hide().attr("src","/public/home/homePageNew/images/itemDelete.png").bind("click",function(){
          deleteShortcut(self.app_id,$(this).parent().parent());
        }))).append($("<span style='margin-top: 0;color: #fff;font-size: 16px;'></span>").text(self.app_title)).bind("click",function(){
            if(globState){
                if(self.url=="" || self.url=="#"){
                    $.message("该快捷方式已失效，请删除该快捷方式或联系管理员增加你的相关权限");
                }else{
                    window.location.href=self.url;
                }
            }
        }).appendTo(quclyAdmin);
      }else{
        a=$("<a style='width: 122px;height: 64px;border-radius: 4px;cursor: pointer;margin-left: 12px;text-decoration: none;'></a>").css({
            "background" : "#43a8ef"}).addClass("a_left").attr("href","#").attr("indexNum",self.app_order).append($("<i style='width: 16px;  height: 16px;  margin-left: 6px; top: 6px;font-size: 16px;line-height: normal;color: #fff;opacity:0.6;filter:alpha(opacity=60);'></i>").addClass("esg-font icon-tongyong").append($("<img/>").addClass("itemDelete").hide().attr("src","/public/home/homePageNew/images/itemDelete.png").bind("click",function(){
          deleteShortcut(self.app_id,$(this).parent().parent());
        }))).append($("<span style='margin-top: 0;color: #fff;font-size: 16px;'></span>").text(self.app_title)).bind("click",function(){
          if(globState){
            if(self.url=="" || self.url=="#"){
              $.message("该快捷方式已失效，请删除该快捷方式或联系管理员增加你的相关权限");
            }else{
              window.location.href=self.url;
            }
          }
        }).appendTo(quclyAdmin);
      }
      if(!globState){
        a.find(".itemDelete").show();
      }
    };
    $.ajax({
      type : "post",
      url : "/public/shortcut/getShortcutInfo.do",
      data : {
        page : 1,
        rows : 8
      },
      dataType : "json",
      success : function(msg){
        if(msg.length>0){
          globResult=msg;
          for(var i=0;i<msg.length;i++){
            putShortcut(msg[i]);
          }
        }
        quclyAdmin.sortable({
          connectWith: ".qucly_admin",
          revert : true,
          update : function(){
            var dataArr=[];
            $.each(quclyAdmin.children(),function(index,obj){
              !function(index,indexNum){
                if(index!=indexNum){
                  globResult[indexNum].app_order=index+1;
                  dataArr.push(globResult[indexNum]);
                  $(obj).attr("indexNum",index+1);
                }
              }(index,Number($(obj).attr("indexNum"))-1);
            });
            $.ajax({
              type : "post",
              url : "/public/shortcut/saveOrUpdate2.do",
              data : JSON.stringify(dataArr),
              contentType : 'application/json;charset=utf-8',
              dataType : "json",
              success : function(msg){
                globResult=msg.rows;
              }
            });
          }
        });
      }
    });
    $("#saveApp").bind("click",function(){
      $.message.loader.open('正在保存...');
      var id = $(".wTableBox input[name='tmp_mod_id']").val();
      if(id==""){
        $.message("应用不能为空");
        return;
      }
      var name = $(".wTableBox input[name='app_title']").val();
      var datas=[
        {
          tmp_mod_id : id,
          app_title : name
        }
      ];
      $.ajax({
        type : "post",
        url : "/public/shortcut/saveOrUpdate2.do",
        data : JSON.stringify(datas),
        contentType : 'application/json;charset=utf-8',
        dataType : "json",
        success : function(msg){
          $.message.loader.close();
          if(msg.errorCode==1){
            $.message("保存出错");
          }else if(msg.errorCode==2){
            $.message("保存失败，快捷图标已满");
          }else if(msg.errorCode==3){
            $.message("保存失败，快捷图标已存在");
          }else{
            putShortcut(msg.rows[msg.rows.length-1]);
            $.message("保存成功");
            globResult=msg.rows;
          }
        }
      });
    });
  }();
</script>