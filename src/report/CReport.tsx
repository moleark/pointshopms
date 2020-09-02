import { CUqBase } from 'CBase';
import { VProductViews } from './VProductViews';
import { VPointsDist, PointRangeLibForm } from './VPointsDist';
import { observable } from 'mobx';
import { VBrowseProductSearchHeader } from 'lordScreen/VSearchHeader';

const numLimit = [100, 1000, 10000, 100000, 1000000, 10000000];
const changeConditionObj = {
    million: { limit: 100000000, text: '亿', fillIn: 8 },
    thousand: { limit: 10000, text: '万', fillIn: 4 },
}

export class CReport extends CUqBase {
    @observable browsedProductLib: any[] = [];         /* 已浏览的商品列表 */
    @observable pointRangeLib: any[] = [];             /* 积分范围及人数匹配列表 */
    @observable pointRange: string;                    /* 选择的积分范围 */
    @observable maxPointRange: string;                 /* 最大的界限 */
    @observable maxPoint: any;                         /* 最大的客户积分 */
    @observable maxPointRangeLib: any[] = [];          /* 最高值适配数据列表 */

    async internalStart(param?: any) {
        await this.searchKeyBrowseProduct(param);
        this.closePage();
        this.openProductViews();
    }

    /**
     * 商品浏览量页面
     */
    openProductViews = async () => {
        await this.getBrowsedProductLib();
        this.openVPage(VProductViews);
    }

    /**
     * 积分分布页面
     */
    openPointsDist = async () => {
        await this.getMaxPoint();
        this.maxPointAdaptive();
        this.pointRange = PointRangeLibForm[0].value;
        await this.customerPointsDistributionMap();
        this.openVPage(VPointsDist);
    }

    /**
     * 筛选头部
     */
    renderSearchHeader = (size?: string) => {
        return this.renderView(VBrowseProductSearchHeader, size);
    }

    /**
     * 搜索产品 查看浏览量
     */
    searchKeyBrowseProduct = async (key: any) => {
        // await this.uqs.
    }

    /**
     * 获取已浏览的商品列表 
     */
    getBrowsedProductLib = async () => {
        // this.uqs.
    }

    getMaxPoint = async () => {
        // this.maxPoint=  await this.uqs.
        this.maxPoint = 81000000;
    }

    /**
     * 最高值及其适配数据
     */
    maxPointAdaptive = () => {
        let maxR = '1.1亿';
        let limit = 10000, arr = [], shifVal;
        let TALLEST = { AT: 1000, BT: 10000, MT: 100000000, TT: '万', MTT: '亿' };
        let { AT, BT, MT, TT, MTT } = TALLEST;

        /* 赋值addVal(数值间隔) */
        let valLib = [
            { max: 100000000, val: 50000000 },
            { max: 50000000, val: 10000000 },
            { max: 10000000, val: 5000000 },
            { max: 5000000, val: 1000000 },
            { max: 1000000, val: 500000 },
            { max: 500000, val: 100000 },
            { max: 100000, val: 50000 },
            { max: 10000, val: 10000 },
        ];
        let findVal = valLib.find(e => this.maxPoint > e.max);
        let addVal = findVal !== undefined ? findVal.val : 1000;

        if (this.maxPoint >= AT) {
            /* 排除特殊数值 */
            let all = {}, fillIn = 1000;
            let obj = [
                { value: 10000, fillIn: 10000 },
                { value: 50000, fillIn: 50000 },
                { value: 500000, fillIn: 100000 },
                { value: 1000000, fillIn: 1000000 },
                { value: 10000000, fillIn: 10000000 },
                { value: 100000000, fillIn: 50000000 },
            ];
            for (let i = AT; i <= MT * 1.5; i += fillIn) {
                for (let key of obj)
                    if (i >= key.value) fillIn = key.fillIn;
                all[i] = i;
            }

            /* 适配数据 */
            for (let i = 0; i <= this.maxPoint; i += addVal) {
                if (i - addVal >= 0) {
                    if (this.maxPoint <= BT)
                        shifVal = `${i - addVal}-${i === BT ? i / BT + TT : i}`;
                    else {
                        if (i - addVal >= MT) { TT = MTT; limit = MT };
                        let a = `${(i - addVal) / limit}${(i - addVal) !== 0 ? TT : ''}`;
                        if (i >= MT) { TT = MTT; limit = MT };
                        shifVal = `${a}-${i / limit + TT}`;
                    }
                    arr.push({ value: shifVal, title: shifVal });
                    if (i === MT) break;
                }
            }

            if (!(this.maxPoint in all)) {
                shifVal = arr[arr.length - 1].value.split('-')[1] + '以上';
                arr.push({ value: shifVal, title: shifVal });

                /* 最大的界限适配 */
                let toRegExp = shifVal.replace(/以(上|下)/g, '');
                if (toRegExp === '1亿') this.maxPointRange = maxR;
                else {
                    let result = this.changeTextUnits(toRegExp, 'toNum');
                    this.maxPointRange = this.changeTextUnits((+result[0] + 1) + result.slice(1), 'toText');
                }
            }
        } else
            arr.push({ value: '0-1000', title: '0-1000' });
        console.log(arr);
        this.maxPointRangeLib = arr;
    }

    /**
     * 查询积分分布
     */
    queryPointDistribution = async (QPointRange: any) => {
        let { pointRange } = QPointRange;
        this.pointRange = pointRange;
        await this.customerPointsDistributionMap();
    }

    /**
     * 积分范围及人数匹配列表
     */
    customerPointsDistributionMap = async () => {
        let distributionArr = this.processPointRange();
        let start = Number(this.changeTextUnits(distributionArr[0], 'toNum'));
        let end = Number(this.changeTextUnits(distributionArr[1], 'toNum'));
        let interVal = (end - start) / 100;
        let granularity = numLimit.find(v => interVal <= v);
        let shiftArr = [];
        for (let i = start; i <= end; i += granularity) {
            if (i !== start) {
                let pointRange = `${this.changeTextUnits(i - granularity, 'toText')}-${this.changeTextUnits(i, 'toText')}`;
                let param = { start: i - granularity, end: i };
                let QTYP = await this.getUsersDistOfPointInterval(param);
                shiftArr.push({ pointRange, QTYP });
            }
        }
        this.pointRangeLib = shiftArr;
        // console.log(shiftArr);
    }

    /**
     * 获取指定积分区间的客户分布数
     */
    getUsersDistOfPointInterval = async (pointRange: any) => {
        // return this.uqs
        return Math.floor(Math.random() * 200);
    }

    /**
     * 处理积分范围
     */
    processPointRange = () => {
        let distributionArr = this.pointRange.replace(/以(上|下)/g, '').split('-');
        if (this.pointRange.endsWith('以下')) distributionArr.unshift('0');
        if (this.pointRange.endsWith('以上')) distributionArr.push(this.maxPointRange); //1亿
        // if (this.pointRange.endsWith('以上')) distributionArr.push('1500万'); //1亿
        return distributionArr;
    }

    /**
     * 文字单位的转换 (数字与文字的转换)
     */
    changeTextUnits = (key: any, changeDesc?: string) => {
        let obj = changeConditionObj;
        for (let i in obj) {
            let { limit, text, fillIn } = obj[i];
            if (changeDesc === 'toNum' && key.endsWith(text))
                return key.replace(text, '0'.repeat(fillIn));
            if (changeDesc === 'toText' && key >= limit)
                return `${key / limit}${text}`;
        }
        return key;
    }
}
