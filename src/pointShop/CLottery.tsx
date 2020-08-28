import { CUqBase } from 'CBase';
import { VLotteryProduct } from './VLotteryProduct';
import { observable } from 'mobx';

export class CLottery extends CUqBase {
    @observable lotteryProducts: any[] = [];    /* 抽奖产品列表 */

    async internalStart(param?: any) {
        await this.getLotteryProducts();
        this.openVPage(VLotteryProduct);
    }

    /**
     * 获取抽奖产品列表
     */
    getLotteryProducts = async () => {
        this.lotteryProducts = [];
    }
}
