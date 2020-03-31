import React from 'react'
import { Modal, Upload } from 'antd'
import { InboxOutlined, CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons'

const Dragger = Upload.Dragger

export default function ExcelImportModal (onExportSample, onOk) {
  const modal = Modal.confirm({})
  let result = null
  const onChange = (file) => {
    if (file.type.includes('xls')) {
      result = file
      modal.update({
        content: <Content result={file}/>,
        okButtonProps: {disabled: false},
      })
    } else {
      result = false
      modal.update({
        okButtonProps: {disabled: true},
        content: <Content result={false}/>
      })
    }
    return false
  }
  const Content = ({result = null, title}) => <Dragger beforeUpload={onChange} fileList={[]}>
    <p >
      <p className="ant-upload-drag-icon" style={{marginTop:20}}>
        {result ? <CheckCircleFilled style={{color: 'var(--success-color)',fontSize:70}}/> : (result === false ?
          <ExclamationCircleFilled style={{color: 'var(--error-color)',fontSize:70}}/> : <InboxOutlined style={{fontSize:70}} />)}

      </p>
      <p className="ant-upload-hint" style={{fontSize: 8, marginTop: 40}}>
        {result ? result.name : (result === false ? '文件类型错误：目前仅支持 .xls 或 .xlsx 类型的文件' : <a onClick={(e) => {
          e.stopPropagation()
          onExportSample()
        }}>点击此处，获取样表？</a>)}

      </p>
    </p>

  </Dragger>
  const modalProps = {
    width: 600,
    content: <Content result={null}/>,
    okText: '导入',
    okButtonProps: {disabled: true},
    onOk: () => {
      modal.update({
        content: <Content result={result}/>,
        cancelButtonProps: {disabled: true}
      })
      if (result) {
        return onOk(result)
      }

      return Modal.error({
        title: '文件不能为空'
      })

    }
  }
  modal.update(modalProps)
}
