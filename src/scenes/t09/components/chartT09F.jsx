import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine, Label
} from 'recharts';

import * as calc from '../calculations/calculationT09F';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';
import {Button, Grid, Header, Segment} from 'semantic-ui-react';

const styles = {
    chart: {
        top: 20,
        right: 30,
        left: 30,
        bottom: 20
    },
    diagramLabel: {
        position: 'absolute',
        top: '30px',
        left: '55px',
        background: '#EFF3F6',
        opacity: 0.9
    },
    downloadButtons: {
        position: 'absolute',
        top: '45px',
        right: '110px'
    }
};

const Chart = ({parameters}) => {
    const {dz, k, z0, l, w, theta, x, df, ds} = getParameterValues(parameters);

    const newXt = calc.calcNewXt({dz, k, z0, l, w, theta, x, df, ds});
    const xt = calc.calcXt({dz, k, z0, l, w, theta, x, df, ds});
    const dxt = calc.calcDeltaXt({dz, k, z0, l, w, theta, x, df, ds});

    const data = [{
        xt: newXt,
        z0_new: -z0
    }, {
        xt: xt,
        z0: -z0,
        z0_new: (dz + z0) / (l - newXt) * xt - z0 - (dz + z0) / (l - newXt) * newXt
    }, {
        xt: l,
        z0: 0,
        z0_new: dz
    }];

    let currentChart;

    return (
        <div>
            <Header as={'h3'} textAlign='center'>Calculation</Header>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width={'100%'} aspect={2}>
                        <LineChart
                            data={data}
                            margin={styles.chart}
                            ref={(chart) => currentChart = chart}
                        >
                            <XAxis
                                type="number"
                                dataKey="xt"
                                domain={[Math.floor(newXt / 100) * 100, l]}
                            >
                                <Label value={'z0 [m]'} offset={0} position="bottom"/>
                            </XAxis>
                            <YAxis
                                type="number"
                                allowDecimals={false}
                                tickLine={false}
                                tickFormatter={(tick) => tick.toFixed(1)}
                                orientation="right"
                            >
                                <Label
                                    angle={90}
                                    position='right'
                                    style={{textAnchor: 'center'}}
                                    value={'x [m]'}
                                />
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Line
                                isAnimationActive={false}
                                type="basis"
                                dataKey={'z0'}
                                stroke="#ED8D05"
                                strokeWidth="5"
                                dot={false}
                            />
                            <Line
                                isAnimationActive={false}
                                type="basis"
                                dataKey={'z0_new'}
                                stroke="#ED8D05"
                                strokeWidth="5"
                                dot={false}
                                strokeDasharray="15 15"
                            />
                            <ReferenceLine
                                y={-z0}
                                stroke="black"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                label={{position: 'left', value: 'z₀'}}
                                dot={false}
                            />
                            <ReferenceLine
                                x={xt}
                                stroke="black"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                label={{position: 'top', value: 'xt'}}
                                dot={false}
                            />
                            <ReferenceLine
                                x={newXt}
                                stroke="black"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                label={{position: 'top', value: 'xt\''}}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    <Segment raised style={styles.diagramLabel}>
                        <p>x<sub>t</sub>&nbsp;=&nbsp;<strong>{xt.toFixed(1)}</strong>&nbsp;m</p>
                        <p>x<sub>t</sub>'&nbsp;=&nbsp;<strong>{newXt.toFixed(1)}</strong>&nbsp;m</p>
                        <p>dx<sub>t</sub>&nbsp;=&nbsp;<strong>{dxt.toFixed(1)}</strong>&nbsp;m</p>
                    </Segment>

                    <div style={styles.downloadButtons}>
                        <Button
                            size={'tiny'}
                            color={'orange'}
                            content='JPG'
                            onClick={() => exportChartImage(currentChart)}
                        />
                        <Button
                            size={'tiny'}
                            color={'orange'}
                            content='CSV'
                            onClick={() => exportChartData(currentChart)}
                        />
                    </div>
                </Grid.Column>
            </Grid>
        </div>
    );
};

Chart.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Chart);