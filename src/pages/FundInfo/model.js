/*
 * @Author: 方博文
 * @Date: 2020-06-28 11:38:25
 * @LastEditors: 方博文
 * @LastEditTime: 2020-11-02 11:53:23
 * @Description: file content
 * @FilePath: \bdi-antd\src\models\datasource.js
 */
import { saveDatasource,updateDatasource } from './service';
import { message } from 'antd';

const initialState = {
    enable : true,//表单可以被提交
    data : {},//表单数据，getO的时候拿的
    modalMainVisible : false
}

const BaseModel = {
    namespace: 'datasource',
    state: initialState,
    effects: {
        //保存数据源
        *saveDatasource({ payload }, { call, put }) {
            const response = yield call(saveDatasource, payload);
            yield put({
                type: 'saveDatasourceReducer'
            });
        },
        //更新数据源
        *updateDatasource({ payload }, { call, put }) {
            const response = yield call(updateDatasource, payload);
        },
    },
    reducers: {
        saveDatasourceReducer(state, action) {
            return { ...state, enable : false };//禁用提交按钮，防止重复提交
        },
        setModalMainVisible(state,action){
            return {...state,modalMainVisible : action.payload}
        },
        clear(){
            return initialState;
        }
    },
};
export default BaseModel;
