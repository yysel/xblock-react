import React from 'react';
import registerState from '../xblock/registerState';

export const BlockComponent = ({block, ...rest}) => {
  const component = registerState.blockComponent.find(i => i.key === block.component);
  const Block = component ? component.component : () => <div>222</div>;
  return <Block {...rest} block={block}/>;
};




