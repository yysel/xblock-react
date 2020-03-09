import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import { getFileType } from '_tools/file';

export default class FileRenderModal extends PureComponent {

  state = {
    visible: false,
  };

  getFile = (file) => {
    const type = getFileType(file);
    if (['doc', 'docx', 'xls', 'ppt'].includes(type)) {
      return <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file)}&amp;wdStartOn=1&amp;wdEmbedCode=0`}
        width="100%"
        height="1000px" frameBorder="0"/>;
    } else {
      return <embed src={file} style={{ width: '100%' }} onClick={e => e.stopPropagation()}/>;
    }

  };

  show = () => {
    this.setState({ visible: true });
  };

  render() {
    const { file, children, clickAble = false } = this.props;
    const { visible } = this.state;
    const props = clickAble ? {
      clickAble: this.show,
    } : {};
    return <div {...props} >
      <div>{children}</div>
      <Modal visible={visible} footer={null} width='1000px' onCancel={(e) => {
        e.stopPropagation();
        this.setState({ visible: false });
      }}>
        {
          this.getFile(file)
        }
      </Modal>
    </div>;
  }

}
