import * as React from 'react';
import { VPage, Page } from 'tonva';
import { CProduct } from 'product/CProduct';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

export class VPointProductPostShow extends VPage<CProduct>{
    @observable isScale: boolean;
    async open(param: any) {
        this.isScale = param;
        this.openPage(this.page);
    }

    setDetailMobSize = () => {
        setTimeout(() => {
            let getDetail_mob = document.querySelector('.reset-z-detail_mob');
            let getTable__01 = document.getElementById('__01');
            let viewP = 750;
            if (getTable__01) viewP = getTable__01.offsetWidth;
            getDetail_mob.setAttribute('style', `transform:scale(${window.innerWidth / viewP})`);
        }, 50);
    }

    private page = observer(() => {
        let { htmlFragment } = this.controller;
        if(this.isScale) this.setDetailMobSize();
        return <Page header='预览帖文'>
            <div dangerouslySetInnerHTML={{ __html: htmlFragment }} className="reset-z-detail_mob"></div>
        </Page >
    })
}