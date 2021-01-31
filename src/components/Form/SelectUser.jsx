import React, { useEffect, useState,useImperativeHandle } from 'react';
import { Form} from 'antd';
import { connect } from 'umi';

import request from '@/utils/request';
import TYPES from '@/types';
import FormTransfer from "@/components/Form/FormTransfer";

const SelectUser = (props) => {
    let {name,label,selectedKeys,rules} = props;
    const {form} = props;
    label = label ? label : "无表单名";
    name = name ? name : "无id";
    selectedKeys = selectedKeys ? selectedKeys :[];

    const [dataSource,setDataSource] = useState([]);
    const [loading,setLoading] = useState(true);

    let action = async function getUserList(params){
        return request(`${TYPES.SYS_APPNAME}/api/user/getUserList.do`, {
            method: 'POST',
            data: params,
            requestType: 'form'
        }).then(res=>{
            if(res.code == 200){
                return res.data;
            }
        })
    }

    //getO
    useEffect(() => {
        getO();
    }, []);

    const getO = ()=>{
        action({}).then(data=>{
            let existed = [];
            data = data.filter(obj=>{
                if(existed.findIndex(n => n == obj.usercode) > -1){
                    return false;
                }
                existed.push(obj.usercode);
                return true;
            });

            data = data.map((obj)=>{
                obj.key = obj.usercode;
                return obj;
            })
            setDataSource(data);
            setLoading(false);
        });
    }

    const onConfirm = (targetKeys)=>{
        var targetValue = dataSource.filter(obj=>{
            return targetKeys.indexOf(obj.usercode) > -1;
        }).map(obj => {
            return obj.username;
        })

        var data = {};
        data[name] = targetKeys;
        data[`${name}Name`] = targetValue;
        form.setFieldsValue(data);
    }

    return (
        <FormTransfer 
            label={label}
            name={name}
            formRef={form}
            loading={loading}
            datasource={dataSource}
            targetKeys={selectedKeys}
            onConfirm={onConfirm}
            filterOption={(inputValue, item) =>{
                return item.loginname.indexOf(inputValue) !== -1 
                || item.username.indexOf(inputValue) !== -1
            }}
            columns={[{
                dataIndex: 'loginname',
                title: '工号',
            }, {
                dataIndex: 'username',
                title: '姓名',
            }]}
            rules={rules}  />
    );
};


function mapStateToProps(state) {
    return {};
  }

export default connect(mapStateToProps)(SelectUser);
