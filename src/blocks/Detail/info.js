// import Detail from './index';
import Detail from './index';

export default {
  title: '标准详情板',
  key: 'detail',
  component: Detail,
  property: [
    {
      title: '每行展示的列数',
      index: 'column',
    },
  ],
  header: [
    {
      title: '所占列数',
      index: 'span',
    },
  ],
};
