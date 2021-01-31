/*
 * @Author: 方博文
 * @Date: 2020-06-28 11:38:25
 * @LastEditors: 方博文
 * @LastEditTime: 2020-11-02 11:53:23
 * @Description: file content
 * @FilePath: \bdi-antd\src\models\datasource.js
 */
import { saveFund,updateFund } from './service';
import { message } from 'antd';

const initialState = {
    data : {},//表单数据，getO的时候拿的
    modalMainVisible : false,//信息表单
    modalPartListVisible : false//成分股列表
}

const BaseModel = {
    namespace: 'fund',
    state: initialState,
    effects: {
        //保存数据源
        *saveFund({ payload }, { call, put }) {
            const response = yield call(saveFund, payload);
            yield put({
                type: 'saveFundReducer'
            });
        },
        //更新数据源
        *updateFund({ payload }, { call, put }) {
            const response = yield call(updateFund, payload);
        },
    },
    reducers: {
        saveFundReducer(state, action) {
            return { ...state };
        },
        setModalMainVisible(state,action){
            return {...state,modalMainVisible : action.payload}
        },
        setPartListVisible(state,action){
            return {...state,modalPartListVisible : action.payload}
        },
        clear(){
            console.log("clear");
            return initialState;
        }
    },
};
export default BaseModel;
