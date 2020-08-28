import { CUqBase } from 'CBase';
import { observable } from 'mobx';
import { VPointProduct, VSearchPointProduct } from './VPointProduct';
import { VPointProductSearchHeader } from 'lordScreen/VSearchHeader';
import { QueryPager } from 'tonva';

export class CPointProduct extends CUqBase {
    @observable pointProducts: any[] = [];    /* 可兑换商品 */
    protected async internalStart(param?: any) {
        await this.getPointProductLibrary();
        let searchPointProduct = await this.searchPointProduct(param);
        this.closePage();
        this.openVPage(VSearchPointProduct, { searchKey: param, searchPointProduct });
    }

    /**
     * 积分商城
     */
    openPointProduct = async () => {
        let { cProduct } = this.cApp;
        cProduct.goalProductInfo.genreShow = undefined;
        await this.getPointProductLibrary();
        this.openVPage(VPointProduct);
    }

    /**
     * 筛选头部
     */
    renderSearchHeader = (size?: string) => {
        return this.renderView(VPointProductSearchHeader, size);
    }

    /**
     * 据类型筛选商品  ------------------------------ 已无 pack 需要uq
     */
    filterByProductGenre = async (currentGenre: any) => {
        let { cProduct } = this.cApp;
        let pointProductFromGenre = await this.getProductsFromGenre(currentGenre);
        let filterPointProducts = [];
        if (pointProductFromGenre.length) {
            for (let key of pointProductFromGenre) {
                let searchpointProductByKey = await cProduct.getPointProductLibLoad(key.product.id)
                filterPointProducts.push(searchpointProductByKey);
            }
        }
        // if (pointProductByCurrentGenre.length) {
        //     for (let key of pointProductByCurrentGenre) {
        //         let searchpointProductByKey = await this.getSpecifyPointProduct({ product: key.product, pack: key.pack });
        //         filterPointProducts.push(searchpointProductByKey);
        //     }
        // }
        this.pointProducts = filterPointProducts;
    }

    /**
     * 获取指定分类所属的商品
     */
    getProductsFromGenre = async (genre: any) => {
        return await this.uqs.积分商城.PointProductGenre.table({ genre, pointproduct: undefined });
    }

    /**
     * 获取可兑换的商品
     */
    getPointProductLibrary = async () => {
        this.pointProducts = await this.uqs.积分商城.GetPointProduct.table({ startPoint: 0, endPoint: 50000 });
    }

    /**
     * 搜索可兑换商品      ----------------------需更改 现为id搜索 需品名、积分等条件符合
     */
    searchPointProduct = async (product: string) => {
        return await this.uqs.积分商城.PointProduct.table({ product });
    }

    /**
     * 获取指定可兑换商品的类型
     */
    getProductGenre = async (productInfo: any) => {
        let { id } = productInfo;
        // return await this.uqs.积分商城.PointProductGenre.obj({ product, pack });
        return await this.uqs.积分商城.GetPointProductGenre.obj({ pointProduct: id })
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
        let { genre, id } = productInfo;
        await this.uqs.积分商城.PointProductGenre.add({ genre: genre.id, arr1: [{ pointProduct: id }] });
        // await this.uqs.积分商城.PointProductGenre.add({ genre, product, arr1: [{ pack }] });
    }

    /**
     * 添加可兑换商品
     */
    addPointProduct = async (productInfo: any) => {
        let { product, pack, point, startDate, endDate, imageUrl } = productInfo;
        await this.uqs.积分商城.PointProduct.add({ product, arr1: [{ pack, point, startDate, endDate, imageUrl }] });
    }

    /**
     * 删除指定可兑换商品的类型
     */
    delProductGenre = async (productInfo: any) => {
        let { product, pack, genre, pointProduct, } = productInfo;
        await this.uqs.积分商城.PointProductGenre.del({ genre: genre.id, arr1: [{ pointProduct: pointProduct.id }] });
        // await this.uqs.积分商城.PointProductGenre.del({ genre, product, arr1: [{ pack }] });
    }

    /**
     * 删除指定可兑换商品
     */
    delPointProduct = async (productInfo: any) => {
        let { product, pack } = productInfo;
        await this.uqs.积分商城.PointProduct.del({ product, arr1: [{ pack }] });
    }

    tab = () => {
        let { cGenre } = this.cApp;
        cGenre.getProductGenres();
        this.getPointProductLibrary();
        return this.renderView(VPointProduct);
    }

}

