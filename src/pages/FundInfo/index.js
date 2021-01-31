import { DeleteOutlined, PlusOutlined,AccountBookOutlined } from '@ant-design/icons';
import { Button, Divider,message, Popconfirm ,Modal } from 'antd';
import React, { useState, useRef ,useEffect} from 'react';
import ProTable from '@ant-design/pro-table';
import { connect } from 'umi';
import { queryFund,delFund,caculate } from './service';

import Main from "./components/FundInfoMain"
import FundPartList from "./components/FundPartList"

import TYPES from '@/types/index';

const TableList = (props) => {
    const { dispatch,fund } = props;
    const [sorter, setSorter] = useState('');
    const [data, setData] = useState({});
    const formRef = useRef();
    const actionRef = useRef();

    const queryData = (params,sort,filter) => {
        return queryFund(params);
    };

    const delData = (ids) =>{
        delFund({ids}).then(data=>{
            actionRef.current.reload();
        });
    }

    const setModalMainVisible = (visible)=>{
        dispatch({
            type : "fund/setModalMainVisible",
            payload : visible
        })
    }

    const setPartListVisible = (visible)=>{
        dispatch({
            type : "fund/setPartListVisible",
            payload : visible
        })
    }

    const caculateIndex = (ids)=>{
        caculate({ids}).then(data=>{
            actionRef.current.reload();
        })
    }

    const columns = [{
        title: '序号',
        dataIndex: 'index',
        valueType: 'index',
        width: 60,
    },{
        title: '名称',
        dataIndex: 'name',
        sorter: true
    },{
        title: '代码',
        dataIndex: 'code',
        sorter: true
    },{
        title: '低估值',
        dataIndex: 'pe_low',
        sorter: true
    },{
        title: '正常值',
        dataIndex: 'pe_normal',
        sorter: true
    },{
        title: '高估值',
        dataIndex: 'pe_high',
        sorter: true
    },{
        title: '现估值',
        dataIndex: 'pe',
        sorter: true
    },{
        title: '操作',
        dataIndex: 'option',
        valueType : 'option',
        render: (_, record) => (
            <>
                <a onClick={() => {
                    setModalMainVisible(true);
                    setData(record);
                }} >
                    修改
                </a>
                <Divider type="vertical" />
                <a onClick={() => {
                    setPartListVisible(true);
                    setData(record);
                }} >
                    成分股
                </a>
                <Divider type="vertical" />
                <Popconfirm
                    title="确认删除？"
                    onConfirm={()=>{
                        delData([record.id].toString())
                    }}
                    okText="是"
                    cancelText="否" >
                    <a href="#" >删除</a>
                </Popconfirm>
            </>
        ),
    }];

    return (
        <>
            {fund.modalMainVisible ? 
            <Modal 
                destroyOnClose={true}
                bodyStyle={{padding:"0"}}
                onCancel={()=>{setModalMainVisible(false);}}
                visible={fund.modalMainVisible}
                forceRender={true}
                footer={[
                    <Button key="submit" onClick={()=>{
                        formRef.current.validateFields().then(values=>{
                            formRef.current.submit();
                            actionRef.current.reload();
                            setModalMainVisible(false);
                        }).catch(err=>{})
                    }} type="primary" >提交</Button>
                ]}
            >
                <Main 
                    visible={fund.modalMainVisible}
                    data={data} formRef={formRef} />
            </Modal> : null  }
            
            {fund.modalPartListVisible ? 
            <Modal 
                width="70%"
                destroyOnClose={true}
                style={{top:"8px"}}
                bodyStyle={{padding:"0"}}
                onCancel={()=>{setPartListVisible(false);}}
                visible={fund.modalPartListVisible}
                footer={null}
                forceRender={true} >
                <FundPartList data={data} formRef={formRef} />
            </Modal> : null }

            <ProTable
                headerTitle="查询表格"
                actionRef={actionRef}
                rowKey="key"
                onChange={(_, _filter, _sorter) => {
                    const sorterResult = _sorter;

                    if (sorterResult.field) {
                        setSorter(`${sorterResult.field}_${sorterResult.order}`);
                    }
                }}
                params={{sorter,}}
                toolBarRender={(action, { selectedRows }) => [
                    <Button type="primary" onClick={() => {
                        if(selectedRows.length == 0){
                            message.error("请选择要计算的指数");
                            return;
                        }
                        caculateIndex(selectedRows.map((obj)=>{
                            return obj.id;
                        }).toString())
                    }}>
                        <AccountBookOutlined /> 计算估值
                    </Button>,
                    <Button type="primary" onClick={() => {
                        setModalMainVisible(true);
                        setData({});
                    }}>
                        <PlusOutlined /> 新建
                    </Button>,

                    selectedRows && selectedRows.length > 0 && (
                    <Popconfirm
                        title="确认删除？"
                        onConfirm={()=>{
                            delData(selectedRows.map((obj)=>{
                                return obj.id;
                            }).toString())
                        }}
                        okText="是"
                        cancelText="否" >
                        <Button type="primary" danger >
                            <DeleteOutlined /> 删除
                        </Button>
                    </Popconfirm>
                    ),
                ]}
                search={false}
                tableAlertRender={false}
                request={(params,sort,filter) => queryData(params,sort,filter)}
                columns={columns}
                rowSelection={{}}
            />
        </>
    );
};

function mapStateToProps(state) {
    const {base,fund} = state;
    return {
        base,
        fund
    };
  }

export default connect(mapStateToProps)(TableList);

