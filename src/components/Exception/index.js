import React, { createElement } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import config from './typeConfig';

export default ({ className, linkElement = 'a', type, title, desc, img, actions, ...rest }) => {
  const pageType = type in config ? type : '404';
  const clsString = classNames('xblock-exception', className);
  return (
    <div className={clsString} {...rest}>
      <div className='imgBlock'>
        <div
          className='imgEle'
          style={{ backgroundImage: `url(${img || config[pageType].img})` }}
        />
      </div>
      <div className='content'>
        <h1>{title || config[pageType].title}</h1>
        <div className='desc'>{desc || config[pageType].desc}</div>
        <div className='actions'>
          <Button type="primary" onClick={() => window.history.go(-1)}>返回上一页</Button>
        </div>
      </div>
    </div>
  );
};
