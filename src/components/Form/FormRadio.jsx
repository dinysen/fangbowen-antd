import { Form, Select,Radio } from 'antd';
import React, { useState,useEffect } from 'react';
import { getCodes } from '@/services/base';

const { Option } = Select;
const TableForm = (props) => {
    const {codetype,onChange} = props;
    const [codes,setCodes] = useState([]);
    const [value,setValue] = useState("");
 
    useEffect(() => {
        getCodes({codetype}).then((res)=>{
            let {data} = res;
            var list = [];
            for(var i in data){
                list.push({name:data[i],value:i})
            }
            setCodes(list);
        });
    }, []);

    var children = codes.map((obj,index,arr)=>{
        return <Radio key={index} value={obj.value} checked={index==0} >{obj.name}</Radio>
    });

    return (
        <Form.Item 
            label={props.label}
            name={props.name}
            rules={props.rules}>
            <Radio.Group onChange={onChange}  >
                {children}
            </Radio.Group>
        </Form.Item>
    );
};

export default TableForm;
