<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<div class="modal fade" tabindex="-1" aria-hidden="true" data-backdrop="static" >
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">
                    <i class="fa fa-stop"></i>
                    <i class="fa fa-times-circle"></i>
                    <i class="fa fa-exclamation-triangle"></i>
                    <i class="fa fa-info-circle"></i>
                    <i class="fa fa-exclamation-circle"></i>
                    <i class="fa fa-question-circle"></i>
                    <span></span>
                </h4>
            </div>
            <div class="modal-body" >

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default modal-message-button-ok" data-type="submit" data-result="ok">确定
                </button>
                <button type="button" class="btn btn-default modal-message-button-cancel" data-type="cancel" data-result="cancel">
                    取消
                </button>
                <button type="button" class="btn btn-default btn-warning modal-message-button-abort" data-result="abort"><i
                        class="fa fa-times"></i> 中止
                </button>
                <button type="button" class="btn btn-default btn-primary modal-message-button-retry" data-result="retry"><i
                        class="fa fa-refresh"></i> 重试
                </button>
                <button type="button" class="btn btn-default btn-danger modal-message-button-ignore" data-result="ignore"><i
                        class="fa fa-share-square-o"></i> 忽略
                </button>
                <button type="button" class="btn btn-default modal-message-button-yes" data-type="submit" data-result="yes">是
                </button>
                <button type="button" class="btn btn-default modal-message-button-no" data-type="reset" data-result="no">否</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->
</div>