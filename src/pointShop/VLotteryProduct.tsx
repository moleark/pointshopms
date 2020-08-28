import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, LMR, List, } from 'tonva';
import { CLottery } from './CLottery';

export class VLotteryProduct extends VPage<CLottery> {

    async open(param?: any) {
        this.openPage(this.page);
    }


    private page = observer(() => {
        let { lotteryProducts } = this.controller;
        let none = <div className="mt-3 text-secondary d-flex justify-content-center">『 无抽奖商品 』</div>
        return <Page header="抽奖商品">
            <div className="px-2 py-3">
                <List items={lotteryProducts} item={{ render: () => <div>11</div> }} none={none} className="mt-2" />
            </div>
        </Page>
    })
}