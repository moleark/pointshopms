import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, } from 'tonva';
import { CReport } from './CReport';
import { Chart, Interval, Tooltip } from 'bizcharts';
const data = [
    { year: '1951 年', sales: 38 },
    { year: '1952 年', sales: 52 },
    { year: '1956 年', sales: 61 },
    { year: '1957 年', sales: 45 },
    { year: '1958 年', sales: 48 },
    { year: '1959 年', sales: 38 },
    { year: '1960 年', sales: 38 },
    { year: '1962 年', sales: 38 },
];
export class VPointsDist extends VPage<CReport> {

    async open(param?: any) {
        this.openPage(this.page);
    }


    private page = observer(() => {
        return <Page header="积分分布">
            积分分布
             <Chart height={200} autoFit data={data} interactions={['active-region']} padding={[20, 10, 30, 30]} >
                <Interval position="year*sales" />
                <Tooltip shared />
            </Chart>
        </Page>
    })
}