<%@ page import="eiis.app.projectinfo.SumCycApps" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="modal fade in" tabindex="-1" data-width="96%" data-backdrop="static" aria-hidden="false" style="color: #000000;">
    <div class="modal-header" style="padding: 6px;font-weight: bolder;">
        <h4 class="modal-title">
            <span>实际成本数据施工部位设置</span>
        </h4>
    </div>
    <div class="modal-body" style="padding: 0;">
        <div class="partContainer">
            <div class="partLeft">
                <div class="selectGrid">
                    <div class="partsType">
                        <div>
                            <h5 class="typeTitle">业务类型:</h5>
                            <div class="typeSelect">
                                <label>
                                    <select>
                                        <option value="<%=SumCycApps.meterial.getAppId()%>" data-en="<%=SumCycApps.meterial.getAppEn()%>">材料通</option>
                                        <option value="<%=SumCycApps.labour.getAppId()%>" data-en="<%=SumCycApps.labour.getAppEn()%>">劳务通</option>
                                        <option value="<%=SumCycApps.machine.getAppId()%>" data-en="<%=SumCycApps.machine.getAppEn()%>">机械通</option>
                                        <option value="<%=SumCycApps.lease.getAppId()%>" data-en="<%=SumCycApps.lease.getAppEn()%>">租赁通</option>
                                        <option value="<%=SumCycApps.fee.getAppId()%>" data-en="<%=SumCycApps.fee.getAppEn()%>">间接费</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="partRight">
                <div class="rowGrid">

                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer" style="padding: 8px;">
        <button type="button" class="eiis-button btn btn-default closeParts">关闭</button>
        <button type="button" class="eiis-button btn btn-primary confirmParts">确定</button>
    </div>
</div>