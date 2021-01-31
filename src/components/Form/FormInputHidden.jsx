import { Form, Select, Input } from 'antd';
import React, { useState,useEffect } from 'react';

const FormInputHidden = (props) => {
    const { name } = props;

    return (
        <Form.Item name={name} style={{display:"none"}} >
            <Input type="hidden" />
        </Form.Item>
    );
};

export default FormInputHidden;
