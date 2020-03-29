export default function findChild(value, disabledList, dict) {
  const children = dict.filter(i => i.parent === value);
  children?.map(i => {
    disabledList.push(i.value);
    findChild(i.value, disabledList, dict);
  });
}
