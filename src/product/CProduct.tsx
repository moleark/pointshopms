import * as React from 'react';
import { CUqBase } from 'CBase';
import { VProductOperation, matchSelecText } from './VProductOperation';
import { VUpdateProductImage } from './VUpdateProductImage';
import { observable } from 'mobx';
import { CGenre } from '../pointShop/CGenre';
import { VProductSearchHeader } from 'lordScreen/VSearchHeader';
import { VProduct, VSearchProduct } from './VProduct';
import { tv, QueryPager } from 'tonva';
import { momentFormat } from 'tools/momentFormat';
import { VCreationProduct } from './VCreationProduct';
export const ProductSources = [
    { id: 1, source: '本司', sourceId: 1, type: 'selfsales' },
    { id: 2, source: '京东', sourceId: 2, type: 'jd.com' },
]

export const OperationAdapt = {
    EDIT: { type: 'edit', name: '修 改', tip: '修改' },
    UPSHELF: { type: 'upShelf', name: '上 架', tip: '上架' },
    DOWNSHELF: { type: 'downShelf', name: '下 架', tip: '下架' },
}
export class CProduct extends CUqBase {
    @observable goalProductInfo: any = {};     /* 商品信息 */
    // @observable productSources: any[] = [];    /* 商品源 */
    @observable productLibrary: any[] = [];    /* 商品库 */
    @observable currentSource: any;               /* 当前商品源 */
    @observable searchProductsToCreation: QueryPager<any>;    /* 新增商品时所查询的列表 */
    @observable isSelectedGenre: boolean = false;        /* 商品类型是否选择 */
    @observable toProductUpShelf: boolean;                 /* 商品操作的意图(上架or修改) */
    private fromProductCreation: boolean;      /* 从新增去选择商品 */  //改版后看新增如何处理，可不需要改属性
    @observable isCreationProduct: boolean;      /* 从新增去选择商品 */
    protected async internalStart(param?: any) {
        let searchProduct = await this.searchByKey(param);
        // this.renderView(VProduct, param);
        this.currentSource = ProductSources[0]
        this.closePage();
        this.openVPage(VSearchProduct, { searchKey: param, searchProduct });
    }

    tab = () => {
        return this.renderView(VProduct);
    }

    /**
     * 商品库
     */
    openProductList = async () => {
        // this.toProductUpShelf = true;
        this.goalProductInfo.genreShow = undefined;
        await this.getProductLibrary();
        this.openVPage(VProduct);
    }

    /**
     * 新增商品
     */
    openCreationProduct = async () => {
        // this.toProductUpShelf = true;
        this.fromProductCreation = true;
        this.goalProductInfo = { productSelectDesc: undefined, genreShow: undefined };
        // this.productSources = await this.getProductSources();
        // this.productSources = ProductSources
        // this.searchProductsToCreation = [];
        await this.searchSelfPointProductGenre('本司');
        this.openVPage(VCreationProduct);
        // this.openVPage(VProductOperation);
    }

    /**
     * 获取商品源
     */
    getProductSources = async (pointProduct: any) => {
        return await this.uqs.积分商城.PointProductSource.obj({ pointProduct, sourceId: undefined });
        // return productSources;
    }

    /**
     * 搜索商品库中商品
     */
    searchByKey = async (key: string) => {
        let result = await this.uqs.积分商城.PointProductLib.search(key, 0, 100);
        return await this.getFurtherReq(result);
        // return await this.uqs.积分商城.PointProduct.table({ product: key });
    }

    /**
     * 搜索要添加到商品库的商品  -----------------------------数据替换
     */
    searchToCreationProduct = async (searchTerm: any) => {
        // console.log(searchTerm);
        let { keyWord, productSource } = searchTerm;
        let { sourceId } = productSource;
        this.currentSource = productSource;
        switch (sourceId) {
            case 1:
                await this.searchSelfPointProductGenre(keyWord);
                return;
            case 2:
                console.log('第三方');
                return;
            default:
                return;
        }

        // this.searchProductsToCreation = this.productLibrary;
    }

    /**
     * 查询来自营销产品库的可兑换产品     ------------------------- uq --bug
     */
    searchSelfPointProductGenre = async (keyWord: string) => {
        let { currentSalesRegion } = this.cApp;
        this.searchProductsToCreation = new QueryPager<any>(this.uqs.product.SearchPointProduct, 10, 10);
        await this.searchProductsToCreation.first({ keyWord, salesRegion: currentSalesRegion });
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
            await this.getProductLibrary();
            this.openVPage(VProduct);
        } else {
            this.closePage(1);
        }
    }

    /**
     * 选择商品
     */
    onProductSelected = async (currentProduct: any) => {
        let { id, endDate, grade } = currentProduct;
        let { PRODUCTSELECT } = matchSelecText;
        let { cPointProduct } = this.cApp;
        let { genre, genreShow } = this.goalProductInfo;
        /* genreShow 保持状态或初始化  */
        genreShow = typeof genreShow === 'string' ? genreShow : undefined;
        /* 检测是否新增商品 */
        let isExchangeProduct = await this.getPointProductLibLoad(id);
        this.isCreationProduct = isExchangeProduct !== undefined ? false : true
        /* 检测是否 上架 or 下架 */
        this.toProductUpShelf = true;/* 显示上架 */
        if (!this.isCreationProduct && momentFormat() <= endDate) this.toProductUpShelf = false; /* 显示下架 */
        // let isExchangeProduct = await cPointProduct.getSpecifyPointProduct(currentProduct);
        // this.toProductUpShelf = isExchangeProduct !== undefined ? false : true;


        /* 商品是否有类型 */
        let productGenre = await cPointProduct.getProductGenre(currentProduct);
        /* let genreLibrary = await this.uqs.积分商城.Genre.all();
        let productGenre;
        if (genreLibrary.length) {
            for (let key of genreLibrary) {
                productGenre = await this.uqs.积分商城.PointProductGenre.obj({ genre: 1, pointProduct: currentProduct });
                if (productGenre !== undefined) break;
            }
        } */

        /* 商品信息 */
        this.goalProductInfo = {
            ...currentProduct,
            productSelectDesc: PRODUCTSELECT.name,
            genreShow: productGenre ? <>{tv(productGenre.genre, (v) => <>{v.name}</>)}</> : undefined, //可为genreShow,也可为undefined
            genre: productGenre ? productGenre.genre : genre,
            grade,
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
     * 更新图片页
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
        // this.productLibrary = await this.uqs.积分商城.GetPointProduct.table({ startPoint: 0, endPoint: Infinity });
        let result = await this.uqs.积分商城.PointProductLib.all();
        this.productLibrary = await this.getFurtherReq(result);
    }

    /**
     * 进一步获取商品所有信息
     */
    getFurtherReq = async (dataList: any) => {
        let arr: any[] = [];
        if (dataList.length) {
            for (let key of dataList) {
                let res = await this.getPointProductLibLoad(key.id);
                arr.push(res);
            }
        }
        return arr;
    }

    /**
     * 据商品id 获取对应的商品所有信息
     */
    getPointProductLibLoad = async (id: number) => {
        return await this.uqs.积分商城.PointProductLib.load(id);
    }

    /**
     * 商品操作执行
     */
    saveOperation = async (param: any) => {
        let { EDIT, UPSHELF, DOWNSHELF } = OperationAdapt;
        let { data, state } = param;
        let productInfo = { ...this.goalProductInfo, ...data };
        this.isSelectedGenre = false;
        /* 检测是否有商品源 */
        let resSource = await this.getProductSources(productInfo);
        if (!resSource) await this.addPointProductSource(productInfo);
        switch (state) {
            case EDIT.type:
                await this.editProduct(productInfo);
                return EDIT.tip;
            case UPSHELF.type:
                await this.upShelfProduct(productInfo);
                return UPSHELF.tip;
            case DOWNSHELF.type:
                await this.downShelfProduct(productInfo);
                return DOWNSHELF.tip;
            default:
                return;
        }
    }

    /**
     * 修改商品   -------------------------商品类型的添加删除bug-------------------------
     */
    editProduct = async (productInfo: any) => {
        let { cPointProduct } = this.cApp;
        let { product, pack, point, imageUrl, genre, startDate, endDate, id } = productInfo;
        let productGenreFind = await cPointProduct.getProductGenre(productInfo);
        let pointProductFind = await this.getPointProductLibLoad(id);
        let { point: pfPoint, imageUrl: pfImageUrl, startDate: pfStartDate, endDate: pfEndDate } = pointProductFind;
        // let pointProductFind = await cPointProduct.getSpecifyPointProduct(productInfo);

        /* 商品类型  不存在 增类型 存在且不同 先删再增 */
        await cPointProduct.addProductGenre(productInfo);
        if (productGenreFind !== undefined && genre.id !== productGenreFind.genre.id)
            await cPointProduct.delProductGenre(productGenreFind);
        /* if (productGenreFind !== undefined && genre.id !== productGenreFind.genre.id) {
            await cPointProduct.delProductGenre(productGenreFind);
            await cPointProduct.addProductGenre(productInfo);
        } else {
            await cPointProduct.addProductGenre(productInfo);
        } */

        /* 商品信息  积分、图片、上下架日期 任意不同去更新  */
        pfStartDate = momentFormat(pfStartDate);
        pfEndDate = momentFormat(pfEndDate);
        let isToupdateProduct = pfPoint !== point || pfImageUrl !== imageUrl || pfStartDate !== startDate || pfEndDate !== endDate;
        if (isToupdateProduct)
            await this.savePointProduct(productInfo);
    }

    /**
     * 商品上架  (纯粹的上架,上架前所有的商品皆无类型)
     */
    upShelfProduct = async (productInfo: any) => {
        let { cPointProduct } = this.cApp;
        await cPointProduct.addProductGenre(productInfo);
        productInfo.id = undefined;
        await this.savePointProduct(productInfo);
    }

    /**
     * 商品下架
     */
    downShelfProduct = async (productInfo: any) => {
        productInfo.endDate = momentFormat();
        await this.savePointProduct(productInfo);

        /* let { cPointProduct } = this.cApp;
        let productGenreFind = await cPointProduct.getProductGenre(productInfo);
        if (productGenreFind)
            await cPointProduct.delProductGenre(productInfo); */

    }

    /**
     * 修改可兑换商品信息
     */
    savePointProduct = async (productInfo: any) => {
        let { id, description, descriptionC, grade, point, startDate, endDate, imageUrl, isValid } = productInfo;
        await this.uqs.积分商城.PointProductLib.save(id, { description, descriptionC, grade, point, startDate, endDate, imageUrl, isValid });
    }

    /**
     * 添加商品的商品源
     */
    addPointProductSource = async (pointProduct: any) => {
        let { sourceId, type } = this.currentSource;
        type = type === 'selfsales' ? 'self' : type;
        await this.uqs.积分商城.PointProductSource.add({ pointProduct, arr1: [{ sourceId, type }] })
    }
}
