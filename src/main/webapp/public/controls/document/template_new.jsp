<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="panel panel-default attachment">
    <div class="panel-heading attachment-layout">
        <div class="attachment-layout-left">
            <span class="name-font">附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;件：</span>
        </div>
        <div class="row document-toolbar attachment-layout-right">
            <span class="document-upload-button">
                <i class="glyphicon iconfont icon-shangchuan"></i>
                <input type="file"/>
            </span>

            <button type="button" class="btn btn-primary document-new-button">
                <i class="glyphicon glyphicon-plus"></i>
                <span>新建文档</span>
            </button>
        </div>
    </div>
    <div class="document-list">
        <table role="presentation" class="table">
            <tbody>
            <tr class="document-template">
                <td rowspan="2" class="document-preview">
                </td>
                <td class="document-info">
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
