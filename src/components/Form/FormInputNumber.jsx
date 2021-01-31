import { Form, Select, InputNumber } from 'antd';
import React, { useState,useEffect } from 'react';

const { Option } = Select;
const FormInput = (props) => {
    const { type } = props;

    return (
        <Form.Item
            label={props.label}
            name={props.name}
            rules={props.rules} >
            <InputNumber 
                style={{width:"100%"}}
                placeholder={props.placeholder ? props.placeholder : `请输入${props.label}`} 
                disabled={props.disabled == undefined ? false : props.disabled} />
        </Form.Item>
    );
};

export default FormInput;
