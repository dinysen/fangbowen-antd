import { Form, Select, DatePicker } from 'antd';
import React, { useState,useEffect } from 'react';

const FormDate = (props) => {

    return (
        <Form.Item
            label={props.label}
            name={props.name}
            rules={props.rules} >
            <DatePicker />
        </Form.Item>
    );
};

export default FormDate;
