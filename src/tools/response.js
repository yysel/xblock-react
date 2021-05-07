import {message as mes, Modal} from 'antd';

function selectMessageType(type) {
  switch (type) {
    case 'message':
      return {
        error: (message) => mes.error(message),
        success: (message) => mes.success(message),
      };
    case 'modal':
      return {
        error: (message) => Modal.error({
          title: '操作结果',
          content: message,
        }),
        success: (message) => Modal.success({
          title: '操作结果',
          content: message,
        }),
      };
    case 'form' :
      return {
        success: () => {
        },
        error: () => {
        }
      };
    default :
      return {
        error: (message) => mes.error(message),
        success: (message) => mes.success(message),
      };
  }
}

//根据响应类型渲染对应组件
export function checkCode({code, message, success, type, silence = false}) {
  const show = selectMessageType(type);
  if (!silence) {
    if (success) show.success(message);
    else show.error(message);
  }
};
