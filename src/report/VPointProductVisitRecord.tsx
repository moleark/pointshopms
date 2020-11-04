import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page } from 'tonva';
import { CReport } from './CReport';

export class VPointProductVisitRecord extends VPage<CReport> {

    async open(param?: any) {
        this.openPage(this.page);
    }

    private page = observer(() => {
        return <Page header='访问记录'>
            VPointProductVisitRecord
        </Page>
    })
}