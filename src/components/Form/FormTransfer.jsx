import { Form, Select, Col,Input,Button,Modal, Transfer, Switch, Table, Tag,message } from 'antd';
import React, { useState,useEffect,useRef,useImperativeHandle,forwardRef   } from 'react';
import difference from 'lodash/difference';
import {getModalScale} from "@/utils/utils"

const formItemLayout = {
    labelCol: {
        span: 7
    },
    wrapperCol: {
        span: 12
    },
};

const FormTransfer = (props) => {

    const [modalVisible, setModalVisible] = useState(false);
    const {onConfirm,count,loading} = props;
    const {formRef} = props;
    const ref = useRef();

    const selectBefore = (
        <a onClick={()=>{
            onConfirm([]);
        }} style={{color:"#252525"}} >清空</a>
    );
    
    const selectAfter = (
        <a onClick={()=>{
            setModalVisible(true);
        }} style={{color:"#252525"}} >选择</a>
    );

    return (
        <>
            <Modal 
                style={{top:8}}
                width={getModalScale().width}
                destroyOnClose={true}
                onCancel={()=>{setModalVisible(false);}}
                visible={modalVisible}
                forceRender={true}
                footer={[
                    <Button key="validate" onClick={()=>{
                        let targetKeys = ref.current.getTargetKeys();
                        if(count && targetKeys.length > count){
                            message.info(`最多选择${count}个`);
                            return;
                        }
                        onConfirm(targetKeys);
                        setModalVisible(false);
                    }} type="primary" >确定</Button>
                ]}>
                <CommonTransfer ref={ref}  {...props} />
            </Modal>
                <Form.Item name={props.name} style={{display:"none"}} >
                    <Input type="hidden" />
                </Form.Item>
                <Form.Item
                    label={props.label ? props.label : null}
                    name={`${props.name}Name`}
                    rules={props.rules} >
                    <Input disabled addonBefore={selectBefore} addonAfter={selectAfter}  />
                </Form.Item>
        </>
    );
};

// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns,loading, ...restProps }) => {
    return (
    <Transfer {...restProps} showSelectAll={false}  >
        {({
            direction,
            filteredItems,
            onItemSelectAll,
            onItemSelect,
            selectedKeys: listSelectedKeys
        }) => {

            const columns = direction === 'left' ? leftColumns : rightColumns;
            loading = direction === 'left' ? loading : false;

            const rowSelection = {
                getCheckboxProps: item => ({ disabled: item.disabled }),
                onSelectAll(selected, selectedRows) {
                    const treeSelectedKeys = selectedRows
                        .filter(item => !item.disabled)
                        .map(({ key }) => key);
                    const diffKeys = selected
                        ? difference(treeSelectedKeys, listSelectedKeys)
                        : difference(listSelectedKeys, treeSelectedKeys);
                    onItemSelectAll(diffKeys, selected);
                },
                onSelect({ key }, selected) {
                    onItemSelect(key, selected);
                },
                selectedRowKeys: listSelectedKeys,
            };

            return (
                <Table
                    rowSelection={rowSelection}
                    loading={loading}
                    columns={columns}
                    dataSource={filteredItems}
                    size="small"
                    onRow={({ key, disabled: itemDisabled }) => ({
                        onClick: () => {
                            onItemSelect(key, !listSelectedKeys.includes(key));
                        }
                    })} />
            );
        }}
    </Transfer>
)};

const CommonTransfer = forwardRef ((props,ref) => {
    let {targetKeys,columns,datasource,loading} = props;
    let {filterOption} = props;

    const [componentTargetKeys,setTargetKeys] = useState(targetKeys);
    
    useImperativeHandle(ref, () => ({
	    getTargetKeys: () => {
            return componentTargetKeys;
        },
        clear : ()=>{
            setTargetKeys([]);
        }
  	}));

    const onChange = nextTargetKeys => {
        setTargetKeys(nextTargetKeys);
    };

    return (
        <>
            <TableTransfer
                loading={loading}
                dataSource={datasource}
                targetKeys={componentTargetKeys}
                showSearch={true}
                onChange={onChange}
                filterOption={filterOption}
                pagination
                leftColumns={columns}
                rightColumns={columns} />
        </>
    )
})

export default FormTransfer;
