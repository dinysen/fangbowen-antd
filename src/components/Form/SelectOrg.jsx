import React, { useEffect, useState,useRef,useImperativeHandle,forwardRef  } from 'react';
import request from '@/utils/request';
import TYPES from "@/types"
import { Tree,Card,List,Typography,Button,Form,Modal,Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {getModalScale} from "@/utils/utils"

const formItemLayout = {
    labelCol: {
        span: 7
    },
    wrapperCol: {
        span: 12
    },
};

const FormSelectOrg = (props) => {

    const [modalVisible, setModalVisible] = useState(false);
    const {name,count,loading} = props;
    const {form} = props;
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

    const onConfirm = (checkedData)=>{
        let targetKeys = checkedData.map(obj=>{
            return obj.key;
        }).toString()

        let targetValue = checkedData.map(obj=>{
            return obj.title;
        }).toString()

        var data = {};
        data[name] = targetKeys;
        data[`${name}Name`] = targetValue;
        form.setFieldsValue(data);
    }


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
                        let checkedData = ref.current.getCheckedData();
                        if(count && targetKeys.length > count){
                            message.info(`最多选择${count}个`);
                            return;
                        }
                        onConfirm(checkedData);
                        setModalVisible(false);
                    }} type="primary" >确定</Button>
                ]}>
                <SelectOrg ref={ref}  {...props} />
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

function updateTreeData(list, key, children) {
    return list.map((node) => {
        if (node.key === key) {
            return { ...node, children };
        } else if (node.children) {
            return { ...node, children: updateTreeData(node.children, key, children) };
        }

        return node;
    });
}

const SelectOrg = forwardRef ((props,ref)=>{
    const [checkedData,setCheckedData] = useState([]);

    useImperativeHandle(ref, () => ({
	    getCheckedData: () => {
            return checkedData;
        },
        clear : ()=>{
            setCheckedData([]);
        }
  	}));

    const onCheck = (checkedKeys)=>{
        setCheckedData(checkedKeys);
    }

    const onDelete = (deletedKey)=>{
        let newData = checkedData.filter(obj=>{
            return obj.key != deletedKey;
        })
        setCheckedData(newData);
    }

    return (
        <div style={{position:"relative",minHeight:"400px"}} >
            <div style={{position:"absolute",left:"10px",right:"350px",top:"10px",minHeight:"270px",background:"white"}} >
                <Card title="部门信息"  style={{ height : "100%",fontSize:"14px !important" }}>
                    <OrgTree onTreeNodeCheck={onCheck} />
                </Card>
            </div>
            <div style={{position:"absolute",width:"330px",right:"10px",top:"10px"}} >
                <SelectedList data={checkedData} onDelete={onDelete} />
            </div>
        </div>
    )

})

const SelectedList = (props)=>{
    let {data} = props;
    const {onDelete} = props;

    return (
        <List
            style={{background:"white"}}
            header={<div style={{paddingTop:"5px",paddingBottom:"5px"}} >选中{data.length}项</div>}
            bordered
            dataSource={data}
            renderItem={item => (
            <List.Item actions={[<DeleteOutlined key="delete" onClick={()=>{
                onDelete(item.key);
            }} />]} >
                {item.title}
            </List.Item>
        )} />
    )

}

const OrgTree = (props) => {
    const {onTreeNodeCheck} = props;
    const [treeData, setTreeData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [orgData , setOrgData] = useState([]);

    useEffect(() => {
        onLoadData("");
    }, [])

    const onCheck = (checkedKeys)=>{
        let checkedArr = checkedKeys.checked;
        let checkedData = orgData.filter(obj=>{
            return (checkedArr.indexOf(obj.key) > -1)
        })
        checkedData = checkedData ? checkedData : [];
        onTreeNodeCheck(checkedData);
    }

    function onLoadData({ key, children }) {

        return request(`${TYPES.SYS_APPNAME}/api/porg/getPorgList.do`, {
            method: 'POST',
            data: {parentid : key},
            requestType: 'form'
        }).then((resp)=>{

            if(resp.code != 200){
                alert("数据加载失败");
                return;
            }

            let orglist = resp.data;
            orglist = orglist.map(obj=>{
                return {
                    key : obj.id,
                    title : obj.organizeName,
                    isLeaf : (obj.ischild == "0")
                }
            })

            setOrgData(orgData.concat(orglist));

            if(JSON.stringify(treeData) == "[]"){
                setTreeData(orglist);
            }else{
                setTreeData((origin) =>
                    updateTreeData(origin, key, orglist),
                );
            }
        });

    }

    return <Tree 
                onCheck={onCheck}
                height={300}
                checkable
                checkStrictly
                loadData={onLoadData} 
                treeData={treeData}  />;
};

export default FormSelectOrg;