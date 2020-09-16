import { CUqBase } from 'CBase';
import { VLotteryProduct, VLotteryProductQueryLib } from './VLotteryProduct';
import { observable } from 'mobx';
import { RowContext } from 'tonva';

export class CLottery extends CUqBase {
    @observable lotteryProducts: any[] = [];    /* 抽奖产品列表 */
    @observable QProductLib: any[] = [];        /* 产品库 */
    @observable productBase: number = 8;        /* 产品基数 */
    @observable totalPR: number;                /* 概率总和 */
    async internalStart(param?: any) {
        // await this.getLotteryProducts();
        // this.openVPage(VLotteryProduct);
    }

    /**
     * 抽奖产品管理界面
     */
    openLotteryProduct = async () => {
        await this.getLotteryProducts();
        this.getTotalPR();
        this.openVPage(VLotteryProduct);
    }

    /**
     * 抽奖产品查询总库
     */
    openLotteryProductQueryLib = async () => {
        await this.getQProductLib();
        this.openVPage(VLotteryProductQueryLib);
    }

    /**
     * 获取概率总和
     */
    getTotalPR = () => {
        let total = 0;
        this.lotteryProducts.forEach(el => {
            total += el.quantity;
        });
        this.totalPR = total;
    }

    /**
     * 获取抽奖产品库
     */
    getQProductLib = async () => {
        // this.lotteryProducts = await this.uqs.积分商城
        this.QProductLib = [
            { id: 1, imageUrl: '1', descriptionC: 'MUX倾力打造的矢量图标管理、交流平台。' },
            { id: 2, imageUrl: '1', descriptionC: '矢量图标管理、交流平台。' },
            { id: 3, imageUrl: '1', descriptionC: '交流平台。' },
        ];
        this.QProductLib.forEach(el => {
            for (let i of this.lotteryProducts)
                if (i.id === el.id)
                    el.quantity = i.quantity;
        });
    }

    /**
     * 获取抽奖产品列表
     */
    getLotteryProducts = async () => {
        // this.lotteryProducts = await this.uqs.积分商城
        this.lotteryProducts = [];
    }

    onQuantityChanged = async (context: RowContext, value: any, prev: any) => {
        let { data } = context;
        let { length } = this.lotteryProducts;
        let index = this.lotteryProducts.findIndex(v => v.id === data.id);
        if (index === -1) {
            if (length < this.productBase) this.lotteryProducts.push(data);
        } else {
            await this.delLotteryProducts(this.lotteryProducts[index]);//data
            this.lotteryProducts.splice(index, 1, data);
        }
        if (length < this.productBase)
            await this.addLotteryProducts(data);
        this.getTotalPR()
    }

    /**
     * 新增抽奖产品
     */
    addLotteryProducts = async (product: any) => {
        // await this.uqs.积分商城.
    }

    /*
     * 删除抽奖产品
     */
    delLotteryProducts = async (product: any) => {
        // await this.uqs.积分商城.
    }
}
