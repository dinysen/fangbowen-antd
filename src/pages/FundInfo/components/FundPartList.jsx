import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider,message, Popconfirm ,Modal } from 'antd';
import React, { useState, useRef ,useEffect} from 'react';
import ProTable from '@ant-design/pro-table';
import { connect } from 'umi';
import { queryDatasource,delDatasource } from '@/pages/FundInfo/service';

import TYPES from '@/types/index';

const TableList = (props) => {
    const { dispatch,datasource } = props;
    const [sorter, setSorter] = useState('');
    const [data, setData] = useState({});
    const formRef = useRef();
    const actionRef = useRef();

    //getO
    useEffect(() => {
    }, []);

    const queryData = (params,sort,filter) => {
        return queryDatasource(params);
    };

    const delData = (ids) =>{
        delDatasource({ids}).then(data=>{
            actionRef.current.reload();
        });
    }

    const setModalMainVisible = (visible)=>{
        dispatch({
            type : "datasource/setModalMainVisible",
            payload : visible
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
        sorter: true,
    },{
        title: '代码',
        dataIndex: 'code',
        sorter: true,
    },{
        title: '低估值',
        dataIndex: 'pe_low',
        sorter: true,
        hideInSearch : true
    },{
        title: '正常值',
        dataIndex: 'pe_normal',
        sorter: true,
        hideInSearch : true
    },{
        title: '高估值',
        dataIndex: 'pe_high',
        sorter: true,
        hideInSearch : true
    },{
        title: '现估值',
        dataIndex: 'pe',
        sorter: true,
        hideInSearch : true
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

            <Modal 
                width="800px"
                destroyOnClose={true}
                bodyStyle={{padding:"0"}}
                onCancel={()=>{setModalMainVisible(false);}}
                visible={datasource.modalMainVisible}
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
                {/* <Main 
                    data={data}
                    showSubmit={false} formRef={formRef} /> */}
            </Modal>

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
                tableAlertRender={false}
                request={(params,sort,filter) => queryData(params,sort,filter)}
                columns={columns}
                rowSelection={{}}
            />
        </>
    );
};

function mapStateToProps(state) {
    const {base,datasource} = state;
    return {
        base,
        datasource
    };
  }

export default connect(mapStateToProps)(TableList);

