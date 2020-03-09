import React from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts';
import { color as defaultColor } from '_tools/helper';

export default class Line extends React.Component {
  render() {
    const { block: { content, property: { x, y, group_by, color, has_point }, getHeader } } = this.props;
    const chartColor = color ? color : defaultColor;
    const xHeader = getHeader(x);
    const yHeader = getHeader(y);
    const cols = {};
    cols[x] = {
      alias: xHeader.title,
    };
    cols[y] = {
      type: 'linear',
      alias: yHeader.title,
      formatter: val => yHeader.unit ? `${val} ${yHeader.unit}` : val,
    };
    const position = `${x}*${y}`;
    return (
      <div>
        <Chart height={400} padding="auto" data={content} scale={cols} forceFit>
          <Legend/>
          <Axis name={x}/>
          <Axis name={y}/>
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom
            type="line"
            position={position}
            size={2}
            color={group_by ? [group_by, chartColor] : ''}
            shape={'smooth'}
          />
          {has_point && <Geom
            type="point"
            position={position}
            size={4}
            shape={'circle'}
            color={group_by ? [group_by, chartColor] : ''}
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
          />}
        </Chart>
      </div>
    );
  }
}
