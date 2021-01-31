import { Form, Select, DatePicker } from 'antd';
import React, { useState,useEffect } from 'react';

const {RangePicker} = DatePicker;

const FormDateRange = (props) => {

    return (
        <Form.Item
            label={props.label}
            name={props.name}
            rules={props.rules} >
            <RangePicker />
        </Form.Item>
    );
};

export default FormDateRange;
