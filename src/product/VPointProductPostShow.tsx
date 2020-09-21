import * as React from 'react';
import { VPage, Page } from 'tonva';
import { CProduct } from 'product/CProduct';
import { observer } from 'mobx-react';

export class VPointProductPostShow extends VPage<CProduct>{
    async open() {
        this.openPage(this.page);
    }

    private page = observer(() => {
        let { htmlFragment } = this.controller;
        return <Page header='预览帖文'>
            <div dangerouslySetInnerHTML={{ __html: htmlFragment }} className="w-100"></div>
        </Page >
    })
}