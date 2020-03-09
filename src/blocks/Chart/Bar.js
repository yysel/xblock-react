import React from 'react';
import { color } from '_tools/helper';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';
import DataSet from '@antv/data-set';

export default class Bar extends React.Component {
  render() {
    if (this.chart) {
      this.chart.forceFit();
    }
    const { block: { height = 600, data: { content, header }, property: { x, y } } } = this.props;
    let dict = {};
    const yAxis = y.split(',');
    header.map(i => {
      if (yAxis.includes(i.index)) {
        dict[i.index] = i.title;
      }
    });
    const ds = new DataSet();
    const dv = ds.createView().source(content);

    dv.transform({
      type: 'fold',
      fields: yAxis,
      key: 'type',
      value: 'value',
    });
    dv.transform({
      type: 'map',
      callback(row) {
        row.type = dict[row.type];
        row.value = parseFloat(row.value);
        return row;
      },
    });
    const cols = {
      sales: {
        tickInterval: 20,
      },
    };
    return (
      <div>

        <Chart height={height} data={dv} scale={cols} padding="auto" onGetG2Instance={(chart) => {
          this.chart = chart;
        }} forceFit>

          <Legend/>
          <Axis name="value" label={{
            formatter: val => `${val}`,
          }}/>
          <Axis name="type"/>

          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom
            type="intervalDodge"
            position={`${x}*value`}
            color={['type', color]}
          />
        </Chart>
      </div>
    );
  }
}
