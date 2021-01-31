import { Form, Select } from 'antd';
import React, { useState,useEffect } from 'react';
import { getCodes } from '@/services/base';

const { Option } = Select;
const TableForm = (props) => {
    const {codetype,onChange,request,data,disabled} = props;
    const [codes,setCodes] = useState([]);

    useEffect(() => {

        if(request){
            request().then(res=>{
                setCodes(res);
            })
        }else if(data){
            setCodes(data);
        }else{
            getCodes({codetype}).then((res)=>{
                let {data} = res;
                var list = [];
                for(var i in data){
                    list.push({name:data[i],value:i})
                }
                setCodes(list);
            });
        }

    }, [JSON.stringify(data)]);

    var children = codes.map((obj,index,arr)=>{
        return <Option key={index} value={obj.value} >{obj.name}</Option>
    });

    return (
        <Form.Item
            label={props.label}
            name={props.name}
            rules={props.rules}
        >
            <Select 
                disabled={disabled ? disabled : false}
                className="select-before" 
                onChange={onChange} >
                {children}
            </Select>
        </Form.Item>
    );
};

export default TableForm;
