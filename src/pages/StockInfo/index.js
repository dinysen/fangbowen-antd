import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Divider,message, Popconfirm ,Modal,Upload } from 'antd';
import React, { useState, useRef ,useEffect} from 'react';
import ProTable from '@ant-design/pro-table';
import { connect } from 'umi';
import { queryStock,delFund } from './service';

import TYPES from '@/types/index';

const TableList = (props) => {
    const { dispatch,stock } = props;
    const [sorter, setSorter] = useState('');
    const [data, setData] = useState({});
    const [importLoading,setImportLoading] = useState(false);
    const formRef = useRef();
    const actionRef = useRef();

    const queryData = (params,sort,filter) => {
        return queryStock(params);
    };

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
        title: '净利润',
        dataIndex: 'net_earning',
        sorter: true
    },{
        title: '总市值',
        dataIndex: 'price',
        sorter: true
    },{
        title: '导入时间',
        dataIndex: 'created_time',
        sorter: true
    }];

    
    const importProps = {
        name: 'file',
        action:  `/api/stock/import`,
        showUploadList : false,
        data : {indexid:data.id,code:data.code},
        beforeUpload: file => {
            var allowlist = ['application/vnd.ms-excel'];
            if (allowlist.indexOf(file.type) == -1) {
                message.error(`只允许上传xls文件`);
            }
            return allowlist.indexOf(file.type) > -1;
        },
        onChange(info) {
            if(info.file.status == "uploading"){
                setImportLoading(true);
            }
            console.log(info);
            if (info.file.status === 'done') {
                let resp = info.file.response;
                if(resp.code == 200){
                    message.success("导入成功");
                    actionRef.current.reload();
                }else{
                    message.error(resp.message);
                }
                setImportLoading(false);
            } 
        },
    }

    return (
        <>

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
                    <Upload {...importProps}>
                        <Button loading={importLoading} icon={<UploadOutlined />}>导入</Button>
                    </Upload>
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
    const {base,stock} = state;
    return {
        base,
        stock
    };
  }

export default connect(mapStateToProps)(TableList);

