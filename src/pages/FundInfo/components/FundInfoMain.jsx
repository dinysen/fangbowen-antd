import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Form, InputNumber, Radio, Select, Tooltip } from 'antd';
import { connect, FormattedMessage, formatMessage } from 'umi';
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const BasicForm = (props) => {
    const { submitting } = props;
    const [form] = Form.useForm();
    const [showPublicUsers, setShowPublicUsers] = React.useState(false);
    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 7,
            },
        },
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 12,
            },
            md: {
                span: 10,
            },
        },
    };
    const submitFormLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 10,
                offset: 7,
            },
        },
    };

    const onFinish = (values) => {
        const { dispatch } = props;
        dispatch({
            type: 'formAndbasicForm/submitRegularForm',
            payload: values,
        });
    };

    const onFinishFailed = (errorInfo) => {
        // eslint-disable-next-line no-console
        console.log('Failed:', errorInfo);
    };

    const onValuesChange = (changedValues) => {
        const { publicType } = changedValues;
        if (publicType) setShowPublicUsers(publicType === '2');
    };

    return (
        <Card bordered={false}>
            <Form
                hideRequiredMark
                style={{
                    marginTop: 8,
                }}
                form={form}
                name="basic"
                initialValues={{
                    public: '1',
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                onValuesChange={onValuesChange}
            >
                <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="formandbasic-form.title.label" />}
                    name="title" >
                    <Input
                        placeholder={formatMessage({
                            id: 'formandbasic-form.title.placeholder',
                        })}
                    />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="formandbasic-form.date.label" />}
                    name="date" >
                    <RangePicker
                        style={{
                            width: '100%',
                        }}
                    />
                </FormItem>
            </Form>
        </Card>
    );
};

export default connect(({ loading }) => ({
    submitting: loading.effects['formAndbasicForm/submitRegularForm'],
}))(BasicForm);
