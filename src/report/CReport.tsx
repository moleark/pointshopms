import { CUqBase } from 'CBase';
import { observable } from 'mobx';
import { VProductViews } from './VProductViews';
import { VPointsDist } from './VPointsDist';

export class CReport extends CUqBase {


    async internalStart(param?: any) { }

    /**
     * 商品浏览量页面
     */
    openProductViews = async () => {
        this.openVPage(VProductViews);
    }

    /**
     * 积分分布页面
     */
    openPointsDist = async () => {
        this.openVPage(VPointsDist);
    }
}
