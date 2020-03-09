import { message as mes, Modal } from 'antd';

function selectMessageType(type) {
  let show = {
    error: null,
    success: null,
  };
  switch (type) {
    case 'message':
      return show = {
        error: (message) => mes.error(message),
        success: (message) => mes.success(message),
      };
    case 'modal':
      return show = {
        error: (message) => Modal.error({
          title: '操作结果',
          content: message,
        }),
        success: (message) => Modal.success({
          title: '操作结果',
          content: message,
        }),
      };
    default :
      return show = {
        error: (message) => mes.error(message),
        success: (message) => mes.success(message),
      };
  }
}

//根据响应类型渲染对应组件
export function checkCode({ code, message, success, type, silence = false }) {
  const show = selectMessageType(type);
  if (!silence) {
    if (success) show.success(message);
    else show.error(message);
  }
};
