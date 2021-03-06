import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Divider,message, Popconfirm ,Modal,Card,Upload } from 'antd';
import React, { useState, useRef ,useEffect} from 'react';
import ProTable from '@ant-design/pro-table';
import { connect } from 'umi';
import { queryFundPart,delPart } from '@/pages/FundInfo/service';

import TYPES from '@/types/index';

const TableList = (props) => {
    const { dispatch,fund,data } = props;
    const [sorter, setSorter] = useState('');
    const [importLoading,setImportLoading] = useState(false);
    const formRef = useRef();
    const actionRef = useRef();

    //getO
    useEffect(() => {
    }, []);

    const queryData = (params,sort,filter) => {
        params.indexid = data.id;
        return queryFundPart(params);
    };

    const delData = (ids) =>{
        delPart({ids}).then(data=>{
            actionRef.current.reload();
        });
    }

    const setModalMainVisible = (visible)=>{
        dispatch({
            type : "fund/setModalMainVisible",
            payload : visible
        })
    }

    const importProps = {
        name: 'file',
        action:  `/api/fundpart/import`,
        showUploadList : false,
        data : {indexid:data.id,code:data.code},
        beforeUpload: file => {
            if (file.type !== 'application/vnd.ms-excel') {
                message.error(`只允许上传excel文件`);
            }
            return file.type === 'application/vnd.ms-excel';
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
        title: '占比',
        dataIndex: 'ratio',
        sorter: true
    },{
        title: 'TTM市盈率',
        dataIndex: 'pe_ttm',
        sorter: true
    },{
        title: '导入时间',
        dataIndex: 'created_time',
        sorter: true
    }];

    return (
        <>
            <ProTable
                headerTitle="成分股列表"
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
    const {base,fund} = state;
    return {
        base,
        fund
    };
  }

export default connect(mapStateToProps)(TableList);

