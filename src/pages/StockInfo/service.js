import request from '@/utils/request';
import { message } from 'antd';
import TYPES from "@/types"

export async function queryStock(params) {
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

    return request(`/api/stock/getpage`, {
        method: 'POST',
        data: params,
        requestType: 'form'
    }).then((resp)=>{
        return {
            data : resp.data ? JSON.parse(resp.data.records).map((obj)=>{
                obj["key"] = obj.code;
                return obj;
            }) : [],
            success : resp.code == 200,
            total : resp.data.recordCount
        }
    });
}
