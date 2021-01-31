import { Form, Select, Input } from 'antd';
import React, { useState,useEffect } from 'react';

const { Option } = Select;
const FormInput = (props) => {
    const { type } = props;

    const getInput = ()=>{
        switch(type){
            case "password" : 
                return <Input.Password 
                        placeholder={props.placeholder ? props.placeholder : `请输入${props.label}`} 
                        disabled={props.disabled == undefined ? false : props.disabled} />;
            case "text" : 
                return <Input.TextArea 
                        rows={4} 
                        placeholder={props.placeholder ? props.placeholder : `请输入${props.label}`} 
                        allowClear 
                        disabled={props.disabled == undefined ? false : props.disabled} />;
            default :
                return <Input 
                        placeholder={props.placeholder ? props.placeholder : `请输入${props.label}`} 
                        disabled={props.disabled == undefined ? false : props.disabled}  />;
        }
    }

    return (
        <Form.Item
            label={props.label}
            name={props.name}
            rules={props.rules} >
            { getInput() }
        </Form.Item>
    );
};

export default FormInput;
