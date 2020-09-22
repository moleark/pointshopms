import { CUqBase } from 'CBase';
import { VProductViews } from './VProductViews';
import { VPointsDist, PointRangeLibForm } from './VPointsDist';
import { observable } from 'mobx';
import { VBrowseProductSearchHeader } from 'lordScreen/VSearchHeader';
import { VPointProductVisitRecord } from './VPointProductVisitRecord';
import { QueryPager } from 'tonva';

const numLimit = [100, 1000, 10000, 100000, 1000000, 10000000];
const changeConditionObj = {
    million: { limit: 100000000, text: '亿', fillIn: 8 },
    thousand: { limit: 10000, text: '万', fillIn: 4 },
}

export class CReport extends CUqBase {
    @observable browsedProductLib: QueryPager<any>;         /* 已浏览的商品列表 */
    @observable pointProductVisitRecord: any;          /* 商品访问记录 */


    @observable pointRangeLib: any[] = [];             /* 积分范围及人数匹配列表 */
    @observable pointRange: string;                    /* 选择的积分范围 */
    @observable maxPointRange: string;                 /* 最大的界限 */
    @observable maxPoint: any;                         /* 最大的客户积分 */
    @observable maxPointRangeLib: any[] = [];          /* 最高值适配数据列表 */
    private maxPointValue: string = '1.1亿';           /* 最大积分数值(数据最终可查值) */

    async internalStart(param?: any) {
        /* //查询用例,暂不开发
        await this.searchKeyBrowseProduct(param);
        this.closePage();
        this.openVPage(VProductViews, param); */
    }

    /**
     * 商品浏览量页面
     */
    openProductViews = async () => {
        await this.getBrowsedProductLib();
        this.openVPage(VProductViews);
    }

    /**
     * 商品访问记录页面
     */
    openPointProductVisitRecord = async (pointProduct: any) => {
        await this.getPointProductVisitRecord(pointProduct);
        this.openVPage(VPointProductVisitRecord);
    }

    /**
     * 积分分布页面
     */
    openPointsDist = async () => {
        await this.getMaxPoint();
        this.maxPointAdaptive();
        this.pointRange = this.maxPointRangeLib[0].value;
        // this.pointRange = PointRangeLibForm[0].value;
        // 
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
        // this.browsedProductLib = [1];
    }

    /**
     * 获取已浏览的商品列表 
     */
    getBrowsedProductLib = async () => {//QueryPager<any>;
        // this.browsedProductLib = await this.uqs.积分商城.GetHotPointProducts.table({});
        this.browsedProductLib = new QueryPager(this.uqs.积分商城.GetVisitPointProducts, 15, 30);
        this.browsedProductLib.first({});
    }

    /**
     * 获取商品访问记录
     */
    getPointProductVisitRecord = async (pointProduct: any) => {
        // this.pointProductVisitRecord=await this.cApp.uqs.积分商城.
    }

    /**
     * 获取最大的客户积分
     */
    private getMaxPoint = async () => {
        let result = await this.uqs.积分商城.GetMaxPoints.obj({});
        this.maxPoint = result !== undefined ? result.maxPoints : 10000
        // this.maxPoint = 260000;
    }

    /**
     * 最高值及其适配数据
     */
    private maxPointAdaptive = () => {
        let limit = 10000, shiftArr = [], shifVal;
        let TALLEST = { AT: 1000, BT: 10000, MT: 100000000, TT: '万', MTT: '亿', MUL: 1.5 };
        let { AT, BT, MT, TT, MTT, MUL } = TALLEST;

        /* 赋值addVal(数值间隔) */
        let numInterVal = [//维护更改==> 首部添加 或变更规则
            { max: 100000000, val: 50000000 }, { max: 50000000, val: 10000000 },
            { max: 10000000, val: 5000000 }, { max: 5000000, val: 1000000 },
            { max: 1000000, val: 500000 }, { max: 500000, val: 100000 },
            { max: 100000, val: 50000 }, { max: 10000, val: 10000 },
        ];
        /* let numInterVal1 = [{ max: BT, val: BT }], InBase = 8; // numInterVal1 是 numInterVal 的改写,维护更改==>InBase,或变更规则
        let arr = Array.from(Array(InBase - 1), (v, k) => k);//numInterVal1的 length 为 InBase,进行数值限制
        for (let i of arr)
            numInterVal1.push({ max: numInterVal1[i].val * 10, val: numInterVal1[i].max * (i === 0 ? 5 : 1) });
        numInterVal1.reverse(); */

        let findVal = numInterVal.find(e => this.maxPoint > e.max);
        let addVal = findVal !== undefined ? findVal.val : AT;

        if (this.maxPoint >= AT) {
            /* 适配数据 */
            for (let i = 0; i <= this.maxPoint; i += addVal) {
                let firstValue = i - addVal;
                if (firstValue >= 0) {
                    if (this.maxPoint <= BT) /* 最高积分在10000及以下 */
                        shifVal = `${firstValue}-${i === BT ? i / BT + TT : i}`;
                    else {
                        if (firstValue >= MT) { TT = MTT; limit = MT };
                        let startValue = `${firstValue / limit}${firstValue !== 0 ? TT : ''}`;
                        if (i >= MT) { TT = MTT; limit = MT };
                        shifVal = `${startValue}-${i / limit + TT}`;
                    }
                    shiftArr.push({ value: shifVal, title: shifVal });
                    if (i === MT) break;
                }
            }

            /* 特殊数值(最大客户积分为特殊值时,无需匹配其以上值) */
            let specialValObj = {}; /* 特殊数值区间对象 */
            for (let i = 0; i <= MT * MUL; i += addVal) { /* MT * 1.5 最高限,现为1.5亿,若后期超出1.5亿,维护更改==>MUL */
                if (i !== 0) specialValObj[i] = i;
                if (i >= this.maxPoint) break;
            }

            /* 适配除特殊值外的多余的数据,配其以上值 */
            if (!(this.maxPoint in specialValObj)) {
                let finalValue = shiftArr[shiftArr.length - 1].value.split('-')[1];
                // shifVal = finalValue + '以上';
                // shiftArr.push({ value: shifVal, title: shifVal });
                if (finalValue === '1亿') this.maxPointRange = this.maxPointValue;
                else {
                    let result = this.changeTextUnits(finalValue, 'toNum');
                    this.maxPointRange = this.changeTextUnits((+result) + addVal, 'toText');
                    // this.maxPointRange = this.changeTextUnits((+result[0] + 1) + result.slice(1), 'toText');
                }
                shiftArr.push({ value: `${finalValue}-${this.maxPointRange}`, title: `${finalValue}以上` });/* 指定value 不需处理 */
            }
        } else
            shiftArr.push({ value: `0-${AT}`, title: `0-${AT}` });
        this.maxPointRangeLib = shiftArr;
        // console.log(shiftArr);
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
    private customerPointsDistributionMap = async () => {
        let distributionArr = this.pointRange.split('-');
        // let distributionArr = this.processPointRange();/* 处理时value可直接写死值,可不需要此处理 */
        let start = Number(this.changeTextUnits(distributionArr[0], 'toNum'));
        let end = Number(this.changeTextUnits(distributionArr[1], 'toNum'));
        let cardinalBase = end - start <= 10000 || start === 100000000 ? 10 : 100;/* 基数 */
        let interVal = (end - start) / cardinalBase;
        let granularity = numLimit.find(v => interVal <= v);    /* 数值区间 */
        let shiftArr = [];
        /* 生成相应区间的客户人数数据 */  //可在外部调用一次请求,获取数据数组,在循环内获取对应的数据
        let getDists: any[] = await this.getUsersDistOfPointInterval({ start, end, granularity });
        for (let key of getDists) {
            let pointRange = `${this.changeTextUnits(key.subStart, 'toText')}-${this.changeTextUnits(key.subEnd, 'toText')}`;
            shiftArr.push({ pointRange, QTYP: key.numbers });
        }
        this.pointRangeLib = shiftArr;
        /* for (let i = start; i <= end; i += granularity) {
            if (i !== start) {
                let pointRange = `${this.changeTextUnits(i - granularity, 'toText')}-${this.changeTextUnits(i, 'toText')}`;
                let param = { startPoint: i - granularity, endPoint: i };
                // let QTYP = await this.getUsersDistOfPointInterval(param);
                shiftArr.push({ pointRange, QTYP: 50 });
            }
        }
        this.pointRangeLib = shiftArr; */
        // console.log(shiftArr);
    }

    /**
     * 获取指定积分区间的客户分布数
     */
    getUsersDistOfPointInterval = async (pointRange: any) => {
        let { start, end, granularity } = pointRange;
        return this.uqs.积分商城.GetPointDistribution.table({ start, end, granularity })
        // return Math.floor(Math.random() * 200);
    }

    /**
     * 处理积分范围
     */
    private processPointRange = () => {
        let distributionArr = this.pointRange.replace(/以(上|下)/g, '').split('-');
        if (this.pointRange.endsWith('以下')) distributionArr.unshift('0');
        if (this.pointRange.endsWith('以上')) distributionArr.push(this.maxPointRange); //1亿
        return distributionArr;
    }

    /**
     * 文字单位的转换 (数字与文字的转换)
     */
    private changeTextUnits = (key: any, changeDesc?: string) => {
        let obj = changeConditionObj;
        for (let i in obj) {
            let { limit, text, fillIn } = obj[i];
            if (changeDesc === 'toNum' && key.endsWith(text))
                return key.replace(/\.*/g, '').replace(text, '0'.repeat(key.includes('.') ? fillIn - 1 : fillIn));
            if (changeDesc === 'toText' && key >= limit)
                return `${key / limit}${text}`;
        }
        return key;
    }
}
