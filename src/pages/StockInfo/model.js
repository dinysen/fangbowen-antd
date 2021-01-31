/*
 * @Author: 方博文
 * @Date: 2020-06-28 11:38:25
 * @LastEditors: 方博文
 * @LastEditTime: 2020-11-02 11:53:23
 * @Description: file content
 * @FilePath: \bdi-antd\src\models\datasource.js
 */
import { saveStock,updateStock } from './service';
import { message } from 'antd';

const initialState = {
}

const BaseModel = {
    namespace: 'stock',
    state: initialState,
    effects: {
        
    },
    reducers: {
        
        clear(){
            return initialState;
        }
    },
};
export default BaseModel;
