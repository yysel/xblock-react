import React, {PureComponent, Fragment} from 'react';
import FileRenderModal from './FileRenderModal';
import {getFileType} from '_tools/file';
import {Icon} from '@ant-design/compatible'

export default class FileReader extends PureComponent {
  onClick = (e) => {
    e.stopPropagation();
    this.show && this.show();
  };

  render() {
    const {value} = this.props;
    const type = getFileType(value);
    const Content = () => <Fragment>
      {['png', 'jpg', 'jpeg', 'gif'].includes(type) ?
        <img src={value} height={'100%'} onClick={this.onClick}/> :
        <Icon onClick={this.onClick} type={`file-text`} theme="twoTone"
              style={{fontSize: 80, alignSelf: 'center'}}/>}
    </Fragment>;
    return <FileRenderModal file={value} ref={e => this.show = e?.show}>
      <div style={{
        height: 100,
        width: 100,
        display: 'flex',
      }}>
        {value ? <Content/> : null}
      </div>
    </FileRenderModal>;
  }

}
