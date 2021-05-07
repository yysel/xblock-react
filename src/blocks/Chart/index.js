import React from 'react';
import Line from './Line'

export default function (props) {
  const {block: {property: {type = 'line'}}} = props;
  switch (type) {
    case 'line':
      return <Line {...props}/>
    case 'bar':
      return <div>111</div>
    case 'ring':
      return <div>111</div>
    case 'pie':
      return <div>111</div>
  }
}
