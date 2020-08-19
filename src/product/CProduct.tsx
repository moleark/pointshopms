import * as React from 'react';
import { CUqBase } from 'CBase';
import { VProductOperation } from './VProductOperation';
import { VUpdateProductImage } from './VUpdateProductImage';
import { observable } from 'mobx';
import { CGenre } from '../pointShop/CGenre';
import { VProductSearchHeader } from 'lordScreen/VSearchHeader';
import { VProduct } from './VProduct';
import { tv } from 'tonva';
import { momentFormat } from 'tools/momentFormat';

export class CProduct extends CUqBase {
    @observable goalProductInfo: any = {};    /* 商品信息 */
    @observable productLibrary: any[] = [];    /* 商品库 */
    @observable isSelectedGenre: boolean = false;    /* 商品类型是否选择 */
    toProductUpShelf: boolean;    /* 商品操作的意图(上架or修改) */
    private fromProductCreation: boolean;    /* 从新增去选择商品 */
    protected async internalStart(param?: any) {
        await this.searchByKey(param);
        this.openVPage(VProduct, param);
    }

    /**
     * 商品库
     */
    openProductList = async () => {
        this.toProductUpShelf = true;
        this.goalProductInfo.genreShow = undefined;
        this.productLibrary = await this.getProductLibrary();
        this.openVPage(VProduct);
    }

    /**
     * 商品类型
     */
    openProductGenre = async () => {
        let genreList = this.newC(CGenre);
        await genreList.start(false);
    }

    /**
     * 新增商品
     */
    openProductContent = async () => {
        this.toProductUpShelf = true;
        this.fromProductCreation = true;
        this.goalProductInfo = { productSelectDesc: undefined, genreShow: undefined };
        this.openVPage(VProductOperation);
    }

    /**
     * 搜索商品    uq调的是point的,需更换
     */
    searchByKey = async (key: string) => {
        this.productLibrary = await this.uqs.积分商城.PointProduct.table({ product: key });
        this.closePage();
    }

    /**
     * 筛选头部
     */
    renderSearchHeader = (size?: string) => {
        return this.renderView(VProductSearchHeader, size);
    }

    /**
     * 去选择商品
     */
    toProductSelect = async () => {
        if (this.fromProductCreation) {
            this.productLibrary = await this.getProductLibrary();
            this.openVPage(VProduct);
        } else {
            this.closePage(1);
        }
    }

    /**
     * 选择商品
     */
    onProductSelected = async (currentProduct: any) => {
        let { cPointProduct } = this.cApp;
        let { genre, genreShow } = this.goalProductInfo;
        /* genreShow 保持状态或初始化  */
        genreShow = typeof genreShow === 'string' ? genreShow : undefined;
        /* 商品是否已上架  上架的商品去修改 */
        let isExchangeProduct = await cPointProduct.getSpecifyPointProduct(currentProduct)
        this.toProductUpShelf = isExchangeProduct !== undefined ? false : true;
        /* 商品是否有类型 */  /* ------------- 存在问题 map传值需全部参数 ------------- */
        // let productGenre = await cPointProduct.getProductGenre(currentProduct);
        let { product, pack } = currentProduct;
        let genreLibrary = await this.uqs.积分商城.Genre.all();
        let productGenre;
        if (genreLibrary.length) {
            for (let key of genreLibrary) {
                /* ------------------------ */
                productGenre = await this.uqs.积分商城.PointProductGenre.obj({ genre: key, product, pack });
                if (productGenre !== undefined) break;
            }
        }

        /* 商品信息 */
        this.goalProductInfo = {
            ...currentProduct,
            productSelectDesc: <span className="text-primary">重新选择商品</span>,
            genreShow: productGenre ? <>{tv(productGenre.genre, (v) => <>{v.name}</>)}</> : genreShow,
            genre: productGenre ? productGenre.genre : genre,
        };

        this.isSelectedGenre = productGenre !== undefined ? true : (genreShow ? true : false);
        this.fromProductCreation = false;

        this.openVPage(VProductOperation);
    }

    /**
     * 商品类型选择
     */
    toGenreSelect = async () => {
        let cGenre = this.newC(CGenre);
        let productGenreSelected = await cGenre.call<any>(true);
        this.goalProductInfo.genreShow = productGenreSelected.name;
        this.goalProductInfo.genre = productGenreSelected;
        this.isSelectedGenre = true;
    }

    /**
     * 更新图片页(上传)
     */
    openVUpdatePicture = async (topic?: any) => {
        this.openVPage(VUpdateProductImage, topic);
    }

    /**
     * 更新图片
     */
    updatedProductImage = async (imgUrl) => {
        this.goalProductInfo.imageUrl = imgUrl;
        this.closePage();
    }

    /**
     * 获取商品库
     */
    getProductLibrary = async () => {
        return await this.uqs.积分商城.GetPointProduct.table({ startPoint: 0, endPoint: Infinity });
    }

    /**
     * 商品操作执行
     */
    saveOperation = async (param: any) => {
        let { data, state } = param;
        let productInfo = { ...this.goalProductInfo, ...data };
        // delete productInfo.productSelectDesc;
        // delete productInfo.genreShow;
        this.isSelectedGenre = false;
        switch (state) {
            case 'edit':
                await this.editProduct(productInfo);
                return "修改";
            case 'upShelf':
                await this.upShelfProduct(productInfo);
                return "上架";
            case 'downShelf':
                await this.downShelfProduct(productInfo);
                return "下架";
            default:
                return;
        }
    }
    /* ----------------- cPointProduct.getProductGenre 存在问题 ----------------------- */
    /**
     * 修改商品
     */
    editProduct = async (productInfo: any) => {
        let { cPointProduct } = this.cApp;
        let { point, imageUrl, genre, product, pack, startDate, endDate } = productInfo;
        let productGenreFind = await cPointProduct.getProductGenre(productInfo);
        let pointProductFind = await cPointProduct.getSpecifyPointProduct(productInfo);
        let { point: pfPoint, imageUrl: pfImageUrl, startDate: pfStartDate, endDate: pfEndDate } = pointProductFind;

        /* 商品类型   不存在 增类型 存在且不同 先删再增 */
        // if (productGenreFind !== undefined) {// await this.uqs.积分商城.PointProductGenre.del({ genre, product, arr1: [{ pack }] });
        //     if (genre.id !== productGenreFind.genre.id) {
        //         await cPointProduct.delProductGenre(productInfo);
        //         await cPointProduct.addProductGenre(productInfo);
        //     }
        // } else {
        //     await cPointProduct.addProductGenre(productInfo);
        // }

        /* 商品信息  积分、图片、上下架日期 任意不同去更新  */
        pfStartDate = momentFormat(pfStartDate);
        pfEndDate = momentFormat(pfEndDate);

        let isToupdateProduct = pfPoint !== point || pfImageUrl !== imageUrl || pfStartDate !== startDate || pfEndDate !== endDate;
        // if (isToupdateProduct) {
        //     await cPointProduct.delPointProduct(productInfo);
        //     await cPointProduct.addPointProduct(productInfo);
        // }
    }

    /**
     * 商品上架  (纯粹的上架,上架前所有的商品皆无类型)
     */
    upShelfProduct = async (productInfo: any) => {
        let { cPointProduct } = this.cApp;
        await cPointProduct.addProductGenre(productInfo);
        await cPointProduct.addPointProduct(productInfo);
    }

    /**
     * 商品下架 (需区分：有无类型 )
     */
    downShelfProduct = async (productInfo: any) => {
        let { cPointProduct } = this.cApp;
        /* ----------------- 下架商品的类别是单个  不可带参数genre ----------------- */
        let productGenreFind = await cPointProduct.getProductGenre(productInfo);
        if (productGenreFind)
            await cPointProduct.delProductGenre(productInfo);
        await cPointProduct.delPointProduct(productInfo);
    }
}
