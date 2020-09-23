import * as React from 'react';
import { CUqBase } from 'CBase';
import { VProductOperation } from './VProductOperation';
import { VUpdateProductImage } from './VUpdateProductImage';
import { observable } from 'mobx';
import { CGenre } from '../pointShop/CGenre';
import { VProductSearchHeader } from 'lordScreen/VSearchHeader';
import { VProduct, VSearchProduct } from './VProduct';
import { tv, QueryPager } from 'tonva';
import { momentFormat } from 'tools/momentFormat';
import { VCreationProduct } from './VCreationProduct';
import { VPointProductPost } from './VPointProductPost';
import { GLOABLE } from '../configuration';
import { VPointProductPostShow } from './VPointProductPostShow';
export const ProductSources = [
    { id: 1, source: '本司', sourceId: 1, type: 'selfsales' },
    { id: 2, source: '京东', sourceId: 2, type: 'jd.com' },
]

export const OperationAdapt = {
    EDIT: { type: 'edit', name: '修 改', tip: '修改' },
    UPSHELF: { type: 'upShelf', name: '上 架', tip: '上架' },
    REUPSHELF: { type: 'ReUpShelf', name: '上 架', tip: '上架' },
    DOWNSHELF: { type: 'downShelf', name: '下 架', tip: '下架' },
}

export class CProduct extends CUqBase {
    @observable goalProductInfo: any = {};        /* 商品信息 */
    @observable productLibrary: any[] = [];       /* 商品库 */
    @observable searchProductLibrary: any[] = []; /* 查询商品 */
    @observable currentSource: any;               /* 当前商品源 */
    @observable searchProductsToCreation: QueryPager<any>;    /* 新增商品时所查询的列表 */
    @observable isSelectedGenre: boolean = false;             /* 商品类型是否选择 */
    @observable toProductUpShelf: boolean;                    /* 是否上架or下架 */
    @observable isCreationProduct: boolean;                   /* 是否新增商品 */
    @observable htmlFragment: string = '';                    /* 商品帖文预览内容 */
    @observable postType: string = '';                        /* 商品帖文类型 */
    @observable currentProduct: any;                          /* 当前编辑帖文商品 */
    @observable currentPostContent: string = '';              /* 当前帖文内容 */

    protected async internalStart(param?: any) {
        let searchProduct = await this.searchByKey(param);
        searchProduct = await this.isPosTExist(searchProduct);
        this.searchProductLibrary = searchProduct;
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
        this.goalProductInfo.genreShow = undefined;
        await this.getProductLibrary();
        this.openVPage(VProduct);
    }

    /**
     * 新增商品
     */
    openCreationProduct = async () => {
        this.goalProductInfo = { genreShow: undefined };
        this.searchProductsToCreation = undefined;
        // await this.searchSelfPointProductGenre('本司');
        this.openVPage(VCreationProduct);
    }

    /**
     * 帖文页面
     */
    openPointProductPost = async (pointProduct: any, type?: string) => {
        this.postType = type;
        this.currentProduct = pointProduct;
        if (this.postType === '编辑')
            this.currentPostContent = await this.getPointProductDetailPost(pointProduct);
        else this.currentPostContent = undefined;
        this.openVPage(VPointProductPost);
    }

    /**
     * 帖文预览页面
     */
    openPointProductPostShow = async () => {
        this.htmlFragment = await this.getPointProductDetailPostHtml(this.currentProduct);
        this.openVPage(VPointProductPostShow);
    }

    /**
     * 搜索商品库中商品
     */
    searchByKey = async (key: any) => {
        return await this.uqs.积分商城.PointProductLib.search(key, 0, 100);
        // return await this.getFurtherReq(result);
    }

    /**
     * 搜索要添加到商品库的商品  -----------------------------第三方 京东暂未对接
     */
    searchToCreationProduct = async (searchTerm: any) => {
        let { keyWord, productSource } = searchTerm;
        let { sourceId, type } = productSource;
        this.currentSource = productSource;

        switch (type) {
            case "selfsales":
                await this.searchSelfPointProductGenre(keyWord);
                return;
            case 'jd.com':
                // await this.searchSelfPointProductGenre('京东'); //此处判别uq需更换
                return;
            default:
                return;
        }
    }

    /**
     * 查询来自营销产品库的可兑换产品
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
     * 选择商品
     */
    onProductSelected = async (currentProduct: any, productOrigin?: any) => {
        let { id, descriptionC } = currentProduct;
        let productGenre = undefined;
        /* 获取商品完整信息 */
        let getProductCompleteInfo = undefined;
        if (productOrigin !== undefined) {
            let isExchangeProduct = await this.getProductSources(currentProduct);
            if (isExchangeProduct !== undefined) {
                getProductCompleteInfo = await this.getPointProductLibLoad(isExchangeProduct.pointProduct.id);
                productGenre = await this.getProductGenre(getProductCompleteInfo);
            }
        } else {
            getProductCompleteInfo = await this.getPointProductLibLoad(id);
            productGenre = await this.getProductGenre(currentProduct);
        }
        let { genre, genreShow } = this.goalProductInfo;
        /* genreShow 保持状态或初始化  */
        genreShow = typeof genreShow === 'string' ? genreShow : undefined;
        /* 检测是否新增商品 */
        this.isCreationProduct = getProductCompleteInfo !== undefined ? false : true
        /* 检测是否 上架 or 下架 */
        this.toProductUpShelf = true;/* 显示上架 */
        if (!this.isCreationProduct && momentFormat() <= getProductCompleteInfo.endDate) this.toProductUpShelf = false; /* 显示下架 */
        /* 商品是否有类型 */
        // let productGenre = await this.getProductGenre(productOrigin !== undefined ? getProductCompleteInfo : currentProduct);
        // if (!this.isCreationProduct) productGenre = await this.getProductGenre(currentProduct);
        /* 商品信息 */
        // let result = this.isCreationProduct ? { ...(product ? { ...product.obj, sourceId: id.id } : {}), radiox, radioy, unit, grade: `${radioy}${unit}` } : getProductCompleteInfo;
        let result = this.isCreationProduct ? { ...currentProduct } : getProductCompleteInfo;
        this.goalProductInfo = {
            ...result,
            // ...currentProduct,
            genreShow: productGenre ? <>{tv(productGenre.genre, (v) => <>{v.name}</>)}</> : undefined, //可为genreShow,也可为undefined
            genre: productGenre ? productGenre.genre : genre,
        };
        this.isSelectedGenre = productGenre !== undefined ? true : (genreShow ? true : false);
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
    updatedProductImage = async (imgUrl: any) => {
        this.goalProductInfo.imageUrl = imgUrl;
        this.closePage();
    }

    /**
     * 获取商品库
     */
    getProductLibrary = async () => {
        this.productLibrary = await this.uqs.积分商城.PointProductLib.all();
        // this.productLibrary = await this.getFurtherReq(result);
    }

    /**
     * 进一步获取商品所有信息
     */
    /* getFurtherReq = async (dataList: any) => {
        let arr: any[] = [];
        if (dataList.length) {
            for (let key of dataList) {
                let res = await this.getPointProductLibLoad(key.id);
                arr.push(res);
            }
        }
        return arr;
    } */

    /**
     * 据商品id 获取对应的商品所有信息
     */
    getPointProductLibLoad = async (id: number) => {
        return await this.uqs.积分商城.PointProductLib.load(id);
    }

    /*
     * 获取商品帖文
     */
    getPointProductDetailPost = async (pointProduct: any) => {
        let findPostContent = await this.uqs.积分商城.PointProductDetail.obj({ pointProduct });
        return findPostContent !== undefined ? findPostContent.content : undefined;
    }

    /**
     * 获取商品帖文预览内容(编译后)
     */
    getPointProductDetailPostHtml = async (pointProduct: any) => {
        let result = await window.fetch(GLOABLE.CONTENTSITE + '/partial/pointproductdetail/' + pointProduct.id);
        if (result.ok) {
            let content = await result.text();
            return content;
        }
    }

    /**
     * 保存帖文
     */
    onSavePointProductPost = async (content: any) => {
        this.currentProduct.content = content;
        for (let key in this.searchProductLibrary) {
            if (this.searchProductLibrary[key].id === this.currentProduct.id) {
                this.searchProductLibrary[key].isPosTExist = true;
            }
        }
        await this.addPointProductDetailPost(this.currentProduct);

        this.closePage();
    }

    /**
     * 处理列表数据是否有帖文
     */
    isPosTExist = async (pointProduct: any) => {
        let shiftArr = [];
        if (pointProduct.length) {
            for (let key of pointProduct) {
                let as = await this.getPointProductDetailPost(key)
                shiftArr.push({ ...key, isPosTExist: as !== undefined ? true : false });
            }
        }
        return shiftArr;
    }

    /**
     * 添加商品帖文
     */
    addPointProductDetailPost = async (pointProduct: any) => {
        let { content } = pointProduct;
        await this.uqs.积分商城.PointProductDetail.add({ pointProduct, content });
    }

    /**
     * 删除商品帖文(存在问题，弃用)
     */
    delPointProductDetailPost = async (pointProduct: any) => {
        await this.uqs.积分商城.PointProductDetail.del({ arr1: [{ pointProduct: pointProduct.id }] });
    }

    /**
     * 商品操作执行
     */
    saveOperation = async (param: any) => {
        let { EDIT, UPSHELF, DOWNSHELF, REUPSHELF } = OperationAdapt;
        let { data, state } = param;
        let productInfo = { ...this.goalProductInfo, ...data };
        this.isSelectedGenre = false;
        /* 检测是否有商品源(上架使用) */
        // let resSource = await this.getProductSources(productInfo);
        // if (!resSource) await this.addPointProductSource(productInfo);
        switch (state) {
            case EDIT.type:
                await this.editProduct(productInfo);
                return EDIT.tip;
            case UPSHELF.type:
                await this.upShelfProduct(productInfo);
                return UPSHELF.tip;
            case REUPSHELF.type:
                await this.reUpShelfProduct(productInfo);
                return REUPSHELF.tip;
            case DOWNSHELF.type:
                await this.downShelfProduct(productInfo);
                return DOWNSHELF.tip;
            default:
                return;
        }
    }

    /**
     * 修改商品
     */
    editProduct = async (productInfo: any) => {
        let { point, imageUrl, genre, startDate, endDate, id } = productInfo;
        let pointProductFind = await this.getPointProductLibLoad(id);
        let { point: pfPoint, imageUrl: pfImageUrl, startDate: pfStartDate, endDate: pfEndDate } = pointProductFind;
        await this.dealWithProductGenre(productInfo);
        /* 商品信息  积分、图片、上下架日期 任意不同去更新  */
        pfStartDate = momentFormat(pfStartDate);
        pfEndDate = momentFormat(pfEndDate);
        let isToupdateProduct = pfPoint !== point || pfImageUrl !== imageUrl || pfStartDate !== startDate || pfEndDate !== endDate;
        if (isToupdateProduct)
            await this.savePointProduct(productInfo);
    }

    /**
     * 处理商品类型(公共代码)
     */
    dealWithProductGenre = async (productInfo: any) => {
        let { genre } = productInfo;
        if (genre !== undefined) {
            /* 商品类型  不存在 增类型 存在且不同 先删再增 */
            let productGenreFind = await this.getProductGenre(productInfo);
            await this.addProductGenre(productInfo);
            if (productGenreFind !== undefined && genre.id !== productGenreFind.genre.id)
                await this.delProductGenre(productGenreFind);
        }
    }

    /**
     * 重新上架
     */
    reUpShelfProduct = async (productInfo: any) => {
        await this.dealWithProductGenre(productInfo);
        await this.savePointProduct(productInfo);
    }

    /**
     * 商品上架  (纯粹的上架,上架前所有的商品皆无类型)
     */
    upShelfProduct = async (productInfo: any) => {
        productInfo.id = undefined;
        await this.savePointProduct(productInfo);
        let isExchangeProduct: any[] = await this.searchByKey(productInfo.descriptionC.slice(0, 40));
        let res;
        for (let key of isExchangeProduct) {
            if (key.descriptionC === productInfo.descriptionC)
                res = await this.getPointProductLibLoad(key.id);
        }
        productInfo.id = res.id;
        if (productInfo.genre !== undefined) await this.addProductGenre(productInfo);
        /* 新增商品添加数据源 */
        let resSource = await this.getProductSources(productInfo);
        if (resSource === undefined)
            await this.addPointProductSource(productInfo);
    }

    /**
     * 商品下架
     */
    downShelfProduct = async (productInfo: any) => {
        productInfo.endDate = momentFormat();
        await this.savePointProduct(productInfo);
    }

    /**
     * 修改可兑换商品信息
     */
    savePointProduct = async (productInfo: any) => {
        let { id, description, descriptionC, grade, point, startDate, endDate, imageUrl, isValid } = productInfo;
        await this.uqs.积分商城.PointProductLib.save(id, { description, descriptionC, grade, point, startDate, endDate, imageUrl, isValid: 1 });
    }

    /**
     * 获取商品源
     */
    getProductSources = async (pointProduct: any) => {
        let type = this.currentSource.type === "selfsales" ? 'self' : this.currentSource.type;
        // return await this.uqs.积分商城.PointProductSource.obj({ pointProduct, sourceId: pointProduct.sourceId });
        return await this.uqs.积分商城.GetPointProductBySource.obj({ sourceId: pointProduct.sourceId, type });
    }

    /**
     * 添加商品的商品源
     */
    addPointProductSource = async (pointProduct: any) => {
        let { type } = this.currentSource;
        let { sourceId } = pointProduct;
        type = type === 'selfsales' ? 'self' : type;
        await this.uqs.积分商城.PointProductSource.add({ pointProduct, arr1: [{ sourceId, type }] })
    }


    /**
     * 获取指定分类所属的商品
     */
    getProductsFromGenre = async (genre: any) => {
        return await this.uqs.积分商城.PointProductGenre.table({ genre, pointproduct: undefined });
    }

    /**
     * 据类型筛选商品
     */
    filterByProductGenre = async (currentGenre: any) => {
        let pointProductFromGenre = await this.getProductsFromGenre(currentGenre);
        let filterPointProducts = [];
        if (pointProductFromGenre.length) {
            for (let key of pointProductFromGenre) {
                let searchpointProductByKey = await this.getPointProductLibLoad(key.pointProduct.id)
                if (searchpointProductByKey !== undefined)
                    filterPointProducts.push(searchpointProductByKey);
            }
        }
        this.productLibrary = filterPointProducts;
    }

    /**
     * 添加可兑换商品及类型
     */
    addProductGenre = async (productInfo: any) => {
        let { genre, id } = productInfo;
        await this.uqs.积分商城.PointProductGenre.add({ genre: genre.id, arr1: [{ pointProduct: id }] });
    }

    /**
     * 删除指定可兑换商品的类型
     */
    delProductGenre = async (productInfo: any) => {
        let { genre, pointProduct } = productInfo;
        await this.uqs.积分商城.PointProductGenre.del({ genre: genre.id, arr1: [{ pointProduct: pointProduct.id }] });
    }

    /**
     * 获取指定可兑换商品的类型
     */
    getProductGenre = async (productInfo: any) => {
        let { id } = productInfo;
        return await this.uqs.积分商城.GetPointProductGenre.obj({ pointProduct: id })
    }

}
