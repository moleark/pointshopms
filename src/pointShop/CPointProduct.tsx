import { CUqBase } from 'CBase';
import { observable } from 'mobx';
import { VPointProduct } from './VPointProduct';
import { VPointProductSearchHeader } from 'lordScreen/VSearchHeader';

export class CPointProduct extends CUqBase {
    @observable pointProducts: any[] = [];    /* 可兑换商品 */
    protected async internalStart(param?: any) {
        this.pointProducts = await this.searchPointProduct(param);
        this.closePage();
        this.openVPage(VPointProduct, param);
    }

    /**
     * 积分商城
     */
    openPointProduct = async () => {
        let { cProduct } = this.cApp;
        cProduct.goalProductInfo.genreShow = undefined;
        this.pointProducts = await this.getPointProductLibrary();
        this.openVPage(VPointProduct);
    }

    /**
     * 筛选头部
     */
    renderSearchHeader = (size?: string) => {
        return this.renderView(VPointProductSearchHeader, size);
    }

    /**
     * 据类型筛选商品
     */
    filterByProductGenre = async (currentGenre: any) => {
        let pointProductByCurrentGenre = await this.uqs.积分商城.PointProductGenre.table({ genre: currentGenre });
        let filterPointProducts = [];
        if (pointProductByCurrentGenre.length) {
            for (let key of pointProductByCurrentGenre) {
                let searchpointProductByKey = await this.getSpecifyPointProduct({ product: key.product, pack: key.pack });
                filterPointProducts.push(searchpointProductByKey);
            }
        }
        this.pointProducts = filterPointProducts;
    }

    /**
     * 获取可兑换的商品
     */
    getPointProductLibrary = async () => {
        return await this.uqs.积分商城.GetPointProduct.table({ startPoint: 0, endPoint: 50000 });
    }

    /**
     * 搜索可兑换商品                 需更改 现为id搜索 需品名、积分等条件符合
     */
    searchPointProduct = async (product: string) => {
        return await this.uqs.积分商城.PointProduct.table({ product });
    }

    /**
     * 获取指定可兑换商品的类型   ---------------------- (不需要携带genre查询)
     */
    getProductGenre = async (productInfo: any) => {
        let { product, pack } = productInfo;
        return await this.uqs.积分商城.PointProductGenre.obj({ product, pack });
    }

    /**
     * 获取指定的可兑换商品信息
     */
    getSpecifyPointProduct = async (productInfo: any) => {
        let { product, pack } = productInfo;
        return await this.uqs.积分商城.PointProduct.obj({ product, pack });
    }

    /**
     * 添加可兑换商品及类型
     */
    addProductGenre = async (productInfo: any) => {
        let { product, pack, genre } = productInfo;
        await this.uqs.积分商城.PointProductGenre.add({ genre, product, arr1: [{ pack }] });
    }

    /**
     * 添加可兑换商品
     */
    addPointProduct = async (productInfo: any) => {
        let { product, pack, point, startDate, endDate, imageUrl } = productInfo;
        await this.uqs.积分商城.PointProduct.add({ product, arr1: [{ pack, point, startDate, endDate, imageUrl }] });
    }

    /**
     * 删除指定可兑换商品的类型    ---------------------- (不需要genre)
     */
    delProductGenre = async (productInfo: any) => {
        let { product, pack, genre } = productInfo;
        await this.uqs.积分商城.PointProductGenre.del({ genre, product, arr1: [{ pack }] });
    }

    /**
     * 删除指定可兑换商品
     */
    delPointProduct = async (productInfo: any) => {
        let { product, pack } = productInfo;
        await this.uqs.积分商城.PointProduct.del({ product, arr1: [{ pack }] });
    }

}

