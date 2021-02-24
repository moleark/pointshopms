import { CUqBase } from 'CBase';
import { observable } from 'mobx';
import { QueryPager } from 'tonva';
import { VBrandDiscount } from './VBrandDiscount';
import { VProductBrandSearchHeader } from '../lordScreen/VSearchHeader';
import { VCreateBrandDiscount } from './VCreateBrandDiscount';

export class CBrandDiscount extends CUqBase {
    @observable brandMinDiscounts: QueryPager<any>;
    @observable brands: any[]=[];
    protected async internalStart(search:string) {
        this.brands = await this.searchBrand(search);
        this.closePage();
        this.openVPage(VCreateBrandDiscount,this.brands);
    }

    /**
     * 品牌折扣页面
     */
    openBrandDiscount = async () => {
        await this.getBrandMinDiscount();
        this.openVPage(VBrandDiscount)
    }

    /**
     * 筛选头部
     */
    renderSearchHeader = (size?: string) => {
        return this.renderView(VProductBrandSearchHeader, size);
    }

    productConverter = (item: any, queryResults?: { [name: string]: any[] }): any => {
        item.disabled = true;
        return item;
    }

    /**
     * 获取已有的品牌折扣列表
     */
    getBrandMinDiscount = async () => {
        this.brandMinDiscounts = new QueryPager<any>(this.uqs.积分商城.getBrandMinDiscount, 10, 15);
        this.brandMinDiscounts.setItemConverter(this.productConverter);
        await this.brandMinDiscounts.first({});
    }

    /**
     * 检索品牌
     */
    searchBrand = async (brand:string) => {
       return await this.uqs.product.Brand.search(brand,0,40);
    }

    /**
     * 创建品牌折扣
     */
    createBrandDiscount = async (brandParam: any) => {
        let { brand, discount } = brandParam;
        let getBrandDiscount = await this.getBrandDiscount(brand);
        let param = {
            brand: brand,
            discount: Math.round((100 - Number(discount)) * 100) / 100 / 100,
            isValid: getBrandDiscount?.isValid || 1
        };
        await this.addBrandMinDiscount(param);
        this.closePage();
    }

    /**
     * 获取指定品牌折扣
     */
    getBrandDiscount = async (id: number) => {
        return await this.uqs.积分商城.BrandMinDiscount.obj({ brand: id });
    }

    /**
     * 添加or修改品牌折扣
     */
    addBrandMinDiscount = async (param: any) => {
        let { brand, discount, isValid } = param;
        await this.uqs.积分商城.BrandMinDiscount.add({ brand: brand, discount: discount, isValid: isValid });
    }

    /**
     * 删除品牌折扣（该品牌不设置折扣） 暂未使用
     */
    delBrandMinDiscount = async (param: any) => {
        let { brand, discount, isValid } = param;
        await this.uqs.积分商城.BrandMinDiscount.del({ brand: brand, discount: discount, isValid: isValid });
    }

    /**
     * 批量保存品牌折扣 （暂不做）
     */
    saveBrandDisCount = async (brandDisCounts: Array<any>) => {
        /* let param = {
            brand: 2,
            discount: 0.20,
            isValid: 1
        };
        await this.addBrandMinDiscount(param); */

        /* let promise: PromiseLike<any>[] = [];
        brandDisCounts.forEach((v: any) => {
            promise.push(this.addBrandMinDiscount(v));
        });
         */
        // await Promise.all(promise);
        // this.closePage();
    }
}