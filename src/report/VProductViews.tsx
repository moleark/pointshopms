import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, } from 'tonva';
import { CReport } from './CReport';
import { Chart, Interval, Tooltip } from 'bizcharts';

export class VProductViews extends VPage<CReport> {

    async open(param?: any) {
        this.openPage(this.page);
    }


    private page = observer(() => {
        return <Page header="商品浏览量">
            商品浏览量
        </Page>
    })
}