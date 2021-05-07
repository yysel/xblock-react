import {connect} from 'dva'
import React from 'react'

document.title

const DocumentTitleAndIcon = ({tabTitle, title, favicon, children}) => {
  document.title = tabTitle ? tabTitle : title
  const link = document.head.querySelector('link')
  link.href = favicon
  return children
}

export default connect(({'@@app': {favicon, title, tabTitle}}) => ({favicon, title, tabTitle}))(DocumentTitleAndIcon)
