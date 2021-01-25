import request from '@/utils/request';
import { message } from 'antd';
import TYPES from "@/types"

export async function saveDatasource(params) {
    return request(`${TYPES.SYS_APPNAME}/api/datasource/saveO.do`, {
        method: 'POST',
        data: params,
        requestType: 'form'
    }).then(response=>{
        if(response.code == 500){
            message.error(response.message);
            return;
        }

        if (response.code == 200) {
            message.success('提交成功');
            return response.data;
        }
    });
}

export async function queryDatasource(params) {
    params.pageIndex = params.current;
    params.parameters = {"_keep":""};//不能传空对象，默认写一个
    let ignoreParams = ["current","pageIndex","pageSize","parameters","sorter"];
    for(var i in params){
        if(ignoreParams.indexOf(i) != -1)continue;
        params.parameters[i] = params[i];
    }

    //排序属性
    let sorter = params.sorter;
    let ordersortMapping = {ascend:"asc",descend:"desc"};
    if(sorter != ""){
        params.parameters["_ordercode"] = sorter.split("_")[0];
        params.parameters["_ordersort"] = ordersortMapping[sorter.split("_")[1]];
    }

    return request(`/api/fund/getpage`, {
        method: 'POST',
        data: params,
        requestType: 'form'
    }).then((resp)=>{
        return {
            data : resp.data ? resp.data.records.map((obj)=>{
                obj.fields["key"] = obj.pk;
                return obj.fields;
            }) : [],
            success : resp.code == 200,
            total : resp.data.recordCount
        }
    });
}

export async function delDatasource(params){
    return request(`${TYPES.SYS_APPNAME}/api/datasource/deleteO.do`, {
        method: 'POST',
        data: params,
        requestType: 'form'
    }).then(res=>{
        if(res.code == 200){
            message.success('删除成功');
        }
    })
}

export async function getDatasource(params){
    return request(`${TYPES.SYS_APPNAME}/api/datasource/getO.do`, {
        method: 'POST',
        data: params,
        requestType: 'form'
    }).then(res=>{
        if(res.code == 200){
            return res.data;
        }
    })
}

export async function updateDatasource(params){
    return request(`${TYPES.SYS_APPNAME}/api/datasource/updateO.do`, {
        method: 'POST',
        data: params,
        requestType: 'form'
    }).then(response=>{
        if(response.code == 500){
            message.error(response.message);
            return;
        }

        if (response.code == 200) {
            message.success('更新成功');
        }
    })
}
