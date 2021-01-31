import { Button,Upload, Modal, message,Form } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useImperativeHandle } from 'react';
import TYPES from "@/types"

import {deleteFile,getFiles } from '@/services/base';

import PDFViewer from "@/components/FilePreview/PDFViewer"
import {getModalScale} from "@/utils/utils"

function beforeUpload(file,filetypes) {
    let filename = file.name;
    let suffix = filename.substring(filename.lastIndexOf(".")+1).toLowerCase();
    if(filetypes.indexOf(suffix) == -1){
        message.error(`只允许上传${filetypes.join("/")}文件!`);
        return Promise.reject(new Error(`只允许上传${filetypes.join("/")}文件!`));
    }
    return true;
}

const FormUpload = (props) => {
    let {count,data,glid,gllx,label,name,url,files,filetype,mode} = props;
    count = count ? count : 1;
    data = data ? data : {};
    data["glid"] = glid;
    data["gllx"] = gllx;
    data["filecount"] = count;
    url = url ? url : `${TYPES.SYS_APPNAME}/api/file/upload.do`;
    mode = mode ? mode : TYPES.UPLOAD_EDIT;

    const [fileList,setFileList] = useState(files ? files : []);

    const [previewVisible,setPreviewVisible] = useState(false);
    const [previewUrl,setPreviewUrl] = useState("");
    const [previewTitle,setPreviewTitle] = useState("");
    const [previewFileType,setPreviewFileType] = useState(null);

    useEffect(()=>{
        getFilesHandler();
    },[])

    const getFilesHandler = async ()=>{
        let res = await getFiles({ glid, gllx, count });
        if(res.code == 200){
            let data = res.data.map(obj=>{
                obj.response = {
                    data : obj
                }
                return  {
                    ...obj,
                    uid: obj.appdocid,
                    name: obj.filename,
                    status: 'done',
                    url: `${TYPES.HOST_APP+obj.url}`
                }
            })
            setFileList(data);
        }
            
    }

    const handleCancel = () => {
        setPreviewVisible(false);
    }

    const handleChange = info => {
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        // fileList = fileList.slice(-2);

        // 2. Read from response and show file link
        fileList = fileList.map(file => {
            if (file.response) {
                let {data} = file.response;
                return Object.assign(file,data);
            }
            return file;
        });

        if(count == 1){
            fileList = fileList.slice(-1);
        }
        setFileList(fileList);
    };

    const handleRemove = async (file) =>{
        let glfileid = file.response.data.glfileid;
        deleteFile({id:glfileid}).then(resp=>{
            message.success("删除成功");
        })
    }
    

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) return;

        let filename = file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
        let filetype = filename.substring(filename.lastIndexOf(".")+1).toLowerCase();

        setPreviewUrl(file.url || file.preview);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
        setPreviewFileType(filetype);

        if([TYPES.FILETYPE_PDF].indexOf(filetype) == -1){
            window.open(file.url || file.preview);
            setPreviewVisible(false);
            return;
        }

        setPreviewVisible(true);
    }

    const getPreviewComponent = ()=>{
        switch(previewFileType){
            case TYPES.FILETYPE_PDF :
                return <PDFViewer file={previewUrl} />
            default : 
                return null
        }
    }
  
    return (
        <>
            <Form.Item label={label} name={name} >
                <Upload
                    action={url}
                    data={data}
                    fileList={fileList}
                    showUploadList={{
                        showRemoveIcon : (TYPES.UPLOAD_VIEW == mode) ? false : true
                    }}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    onRemove={handleRemove}
                    beforeUpload={(file)=>{
                        return beforeUpload(file,filetype);
                    }}
                    multiple={count == 1 ? false : true}>
                    {
                        (TYPES.UPLOAD_VIEW == mode) ? null :
                        <Button icon={<UploadOutlined />}>上传</Button>
                    }
                    
                </Upload>
            </Form.Item>
            <Modal
                style={{ top: 8 }}
                bodyStyle={{height : getModalScale().bodyHeight,overflowY:"auto",background:"#F0F2F5"}}
                width={getModalScale().width}
                height={getModalScale().height}
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel} >
                {getPreviewComponent()}
            </Modal>
        </>
    );

}

export default FormUpload;