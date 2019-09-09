<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="panel panel-default">
    <div class="panel-heading">
        <div class="row document-toolbar">
             <span class="btn btn-success document-upload-button">
                    <i class="glyphicon glyphicon-upload"></i>
                    <span>上传文档</span>
                    <input type="file"/>
                </span>
            <button type="button" class="btn btn-primary document-new-button">
                <i class="glyphicon glyphicon-plus"></i>
                <span>新建文档</span>
            </button>
            <table class="extendInfo">
                <thead>
                    <tr>
                        <td>上传规范：</td>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    </div>
    <div class="document-list">
        <table role="presentation" class="table">
            <tbody>
            <tr class="document-template">
                <td rowspan="2" class="document-preview" style="cursor: pointer" onclick="showImage(this);">
                </td>
                <td  class="document-info" >
                </td>

                <td rowspan="2" class="document-button">
                </td>
            </tr>
            <tr class="document-template">
                <td class="document-size">
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <div class="document-new-dialog modal fade" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">
                新建文档
            </h4>
        </div>
        <div class="modal-body">
            请输入新文档的名称：<br/>
            <input class="eiis-text"/>

            <div class="document-new-dialog-info"></div>
            <div class="document-new-dialog-error"></div>
        </div>
        <div class="modal-footer">
            <button type="button" class="eiis-button" data-type="submit">确定
            </button>
            <button type="button" class="eiis-button" data-type="cancel" data-dismiss="modal">
                取消
            </button>
        </div>
    </div>
</div>
