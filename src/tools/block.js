export default function (block) {
  block.getHeader = (key = null) => {
    if (key) return block?.header?.find(i => i.index === key);
    else return block?.header;
  };
  block.getFilterHeader = () => block?.header?.filter(i => i.filterable);

  block.getAddHeader = () => block?.header?.filter(i => i.addable);

  block.getEditHeader = () => block?.header?.filter(i => i.editable);

  block.getButton = (key = null) => {
    if (key) return block?.button?.find(i => i.index === key);
    else return block?.button;
  };
  block.getTopButton = () => {
    return block?.button?.filter(i => i.position === 'top');
  };
  block.getInnerButton = () => {
    return block?.button?.filter(i => i.position === 'inner');
  };
  block.getFirst = () => {
    return block?.content?.[0] ? block.content[0] : {};
  };

  block.spreadHeader = () => {
    const newHeader = {};
    block?.header.forEach(item => {
      newHeader[item.index] = item;
    });
    return newHeader;
  };
}
