import request from '@/utils/request';
import { message } from 'antd';
import TYPES from "@/types"

export async function saveFund(params) {
    return request(`/api/fund/post`, {
        method: 'POST',
        data: JSON.stringify(params)
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

export async function queryFund(params) {
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
                obj.fields["id"] = obj.pk;
                return obj.fields;
            }) : [],
            success : resp.code == 200,
            total : resp.data.recordCount
        }
    });
}

export async function delFund(params){
    return request(`/api/fund/delete`, {
        method: 'POST',
        data: params,
        requestType: 'form'
    }).then(res=>{
        if(res.code == 200){
            message.success('删除成功');
        }
    })
}

export async function getFund(params){
    return request(`/api/fund/getone`, {
        method: 'POST',
        data: params,
        requestType: 'form'
    }).then(res=>{
        if(res.code == 200){
            let data = res.data[0].fields;
            data["id"] = res.data[0].pk;
            return data;
        }
    })
}

export async function updateFund(params){
    return request(`/api/fund/update`, {
        method: 'POST',
        data: JSON.stringify(params),
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

export async function queryFundPart(params) {
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

    return request(`api/fundpart/getpage`, {
        method: 'POST',
        data: params,
        requestType: 'form'
    }).then((resp)=>{
        return {
            data : resp.data ? JSON.parse(resp.data.records).map((obj)=>{
                console.log(obj);
                obj["key"] = obj.code;
                return obj;
            }) : [],
            success : resp.code == 200,
            total : resp.data.recordCount
        }
    });
}

export async function caculate(params){
    return request(`/api/fund/caculate`, {
        method: 'POST',
        data: params,
        requestType: 'form'
    }).then(res=>{
        if(res.code == 200){
            message.success('计算完成');
        }
    })
}