import React, { Component } from 'react'
import { Upload as AntdUpload, message, Row, Col, Modal } from 'antd'
import FileRenderModal from '../../Column/component/FileRenderModal'
import { getToken } from '_tools/auth'
import { request } from '../../../fetch'
import { Icon } from '@ant-design/compatible'

function removeFile (url, params) {
  return request(url, {
    method: 'POST',
    body: params,
  })
}

function beforeUpload (file) {
  // const isJPG = file.type === 'image/jpeg';
  // if (!isJPG) {
  //   message.error('You can only upload JPG file!');
  // }

  const isLt2M = file.size / 1024 / 1024 < 5
  if (!isLt2M) {
    message.error('图片大小不能大于5MB!')
  }

  return isLt2M
}

function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default class Upload extends Component {

  constructor (props) {
    const config = window.xblock
    super(props)
    this.state = {
      fileList: [],
      uploadUrl: config?.upload_url ? config.upload_url : `${window.location.origin}/api/file/upload`,
      removeUrl: config?.remove_url ? config.remove_url : `${window.location.origin}/api/file/remove`,
    }
  }

  componentWillMount () {
    if (this.props.value) {
      this.setState({
        fileList: [
          {
            uid: '1',
            status: 'done',
            url: this.props.value,
          },
        ],
      })
    }
  }

  componentWillReceiveProps (props, net) {
    if (props.value !== this.props.value) {
      const fileList = props.value ? [{
        uid: '1',
        status: 'done',
        url: props.value,
      }] : []
      this.setState({fileList})
    }
  }

  handleChange = ({file, fileList}) => {
    this.setState({fileList})
    const {onChange} = this.props
    if (file?.response?.success && file?.response?.data?.path && file.status === 'done') {
      onChange(file.response.data.path)
    } else if (file.status === 'removed') {
      onChange('')
    }
  }

  render () {
    const {fileList, uploadUrl, removeUrl} = this.state
    const uploadButton = (
      <div>
        <Icon type="inbox" style={{color: 'var(--primary-color)', fontSize: 30}}/>
        <div className="ant-upload-text">选择文件</div>
      </div>
    )
    return (
      <div className="clearfix">
        <FileRenderModal file={this.props.value} ref={e => this.show = e?.show}>
          <AntdUpload
            action={uploadUrl}
            listType="picture-card"
            headers={{'Authorization': `Bearer ${getToken()}`}}
            fileList={fileList}
            onPreview={() => this.show && this.show()}
            onChange={this.handleChange}
            onRemove={(file) => {
              if (this.props.mode === 'edit') {
                Modal.confirm({
                  title: '即将删除文件（不可恢复），是否确认？', onOk: () => {
                    this.setState({fileList: []})
                    this.props.onChange('')
                    removeFile(removeUrl, file)
                  },
                  okText: '确定',
                  cancelText: '取消',
                  okType: 'danger',
                })
                return false
              } else {
                removeFile(removeUrl, file)
              }

            }}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </AntdUpload>
        </FileRenderModal>


      </div>
    )
  }
}
