import React, { useEffect, useState,useImperativeHandle } from 'react';
import { connect } from 'umi';

import { Button, Card, Form, Input, Popover,message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

import FormInput from "@/components/Form/FormInput"
import FormInputNumber from "@/components/Form/FormInputNumber"

import {getFund } from '../service';


const fieldLabels = {
    name: '名称',
    code: '代码',
    pe_low: '低估值',
    pe_normal: '正常值',
    pe_high: '高估值',
    pe : '现估值'
};

const formItemLayout = {
    labelCol: {
        span: 7
    },
    wrapperCol: {
        span: 12
    },
};

const FundInfoMain = (props) => {
    const { submitting,dispatch,base,fund } = props;
    const { formRef,data,visible } = props;
    const [form] = Form.useForm();
    const [error, setError] = useState([]);
    const [formdata , setFormdata] = useState({});

    //getO
    useEffect(() => {
        getO();

        return ()=>{
            dispatch({
                type: "fund/clear"
            })
        }

    },[]);

    useImperativeHandle(formRef, () => ({
	    submit: () => {
            form.submit()
        }, 
        validateFields : ()=>{
            return form.validateFields();
        },
        validate : ()=>{
            validateO();
        }
  	}));

    const getO = ()=>{
        if(!data || !data.id)return;
        getFund({id:data.id}).then(data=>{
            setFormdata(data);
            form.resetFields();
        });
    }

    const validateO =()=>{
        let values = form.getFieldsValue();
        validateDatasource(values);
    }

    const getErrorInfo = errors => {
        const errorCount = errors.filter(item => item.errors.length > 0).length;

        if (!errors || errorCount === 0) {
            return null;
        }

        const scrollToField = fieldKey => {
            const labelNode = document.querySelector(`label[for="${fieldKey}"]`);

            if (labelNode) {
                labelNode.scrollIntoView(true);
            }
        };

        const errorList = errors.map(err => {
            if (!err || err.errors.length === 0) {
                return null;
            }

            const key = err.name[0];
            return (
                <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
                    <CloseCircleOutlined className={styles.errorIcon} />
                    <div className={styles.errorMessage}>{err.errors[0]}</div>
                    <div className={styles.errorField}>{fieldLabels[key]}</div>
                </li>
            );
        });
        return (
            <span className={styles.errorIcon}>
                <Popover
                    title="表单校验信息"
                    content={errorList}
                    overlayClassName={styles.errorPopover}
                    trigger="click"
                    getPopupContainer={trigger => {
                        if (trigger && trigger.parentNode) {
                            return trigger.parentNode;
                        }

                        return trigger;
                    }}
                >
                    <CloseCircleOutlined />
                </Popover>
                {errorCount}
            </span>
        );
    };

    
    const onFinish = values => {
        setError([]);
        if(values.id == undefined || values.id == ""){
            dispatch({
            type: 'fund/saveFund',
                payload: values,
            });
        }else{
            dispatch({
                type: 'fund/updateFund',
                payload: values,
            });
        }
    };

    const onFinishFailed = errorInfo => {
        setError(errorInfo.errorFields);
    };

    return (
        <>
            <Form
                {...formItemLayout}
                form={form}
                initialValues={formdata}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed} >
                <Card title="指数信息" bordered={false}>
                
                    <Form.Item name="id" style={{display:"none"}} >
                        <Input type="hidden" />
                    </Form.Item>

                    <FormInput 
                        label={fieldLabels.name}
                        name="name"
                        rules={[{
                            required: true,
                            message: `请输入${fieldLabels.name}`,
                        }]} />

                    <FormInput
                        label={fieldLabels.code}
                        name="code"
                        rules={[{
                            required: true,
                            message: `请输入${fieldLabels.code}`,
                        }]}  />

                    <FormInputNumber
                        label={fieldLabels.pe_low}
                        name="pe_low"
                        rules={[{
                            required: true,
                            message: `请填写${fieldLabels.pe_low}`,
                        }]} />

                    <FormInputNumber 
                        label={fieldLabels.pe_normal}
                        name="pe_normal"
                        rules={[{
                            required: true,
                            message: `请填写${fieldLabels.pe_normal}`,
                        }]} />

                    <FormInputNumber 
                        label={fieldLabels.pe_high}
                        name="pe_high"
                        rules={[{
                            required: true,
                            message:`请填写${fieldLabels.pe_high}`,
                        }]} />

                    <FormInputNumber 
                        label={fieldLabels.pe}
                        name="pe" />

                </Card>
                
            </Form>
        </>
    );
};


function mapStateToProps(state) {
    const {loading,base,fund} = state;
    return {
        submitting: loading.effects['fund/saveDatasource'],
        base,
        fund
    };
  }

export default connect(mapStateToProps)(FundInfoMain);
