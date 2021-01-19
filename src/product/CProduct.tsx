import * as React from 'react';
import { CUqBase } from 'CBase';
import { VProductOperation } from './VProductOperation';
import { VUpdateProductImage } from './VUpdateProductImage';
import { observable } from 'mobx';
import { CGenre } from '../pointShop/CGenre';
import { VProductSearchHeader } from 'lordScreen/VSearchHeader';
import { VProduct, VSearchProduct } from './VProduct';
import { tv, QueryPager, BoxId } from 'tonva';
import { momentFormat } from 'tools/momentFormat';
import { VCreationProduct } from './VCreationProduct';
import { VPointProductPost } from './VPointProductPost';
import { GLOABLE } from '../configuration';
import { VPointProductPostShow } from './VPointProductPostShow';
import { VPostOperaLabel } from './VPostOperaLabel';
import { FetchPost } from 'tools/wFeatch';
import { JDImagePath } from 'tools/productImage';
import { PointProduct } from '../model/PointProduct';
export const ProductSources = [
    { id: 1, source: '本司', sourceId: 1, type: 'self', nick:'selfsales' },
    { id: 2, source: '京东', sourceId: 2, type: 'jd.com' },
]

export const OperationAdapt = {
    EDIT: { type: 'edit', name: '修 改'},
    UPSHELF: { type: 'upShelf', name: '上 架'},
    REUPSHELF: { type: 'ReUpShelf', name: '上 架'},
    DOWNSHELF: { type: 'downShelf', name: '下 架'},
}

export class CProduct extends CUqBase {
    @observable pointProductLib: QueryPager<any> | any[];     /* 商品库 */
    @observable searchProductLib: QueryPager<any>;            /* 查询商品 */
    @observable goalProductInfo: any = {};        /* 商品信息 */
    @observable toProductUpShelf: boolean;        /* 是否上架or下架 */
    @observable isCreationProduct: boolean;       /* 是否新增商品 */

    @observable currentSource: any = ProductSources[0];    /* 当前商品源 */
    @observable searchProductsToCreation: QueryPager<any> | any[];    /* 新增商品时所查询的列表 */
    @observable pageIndex: number = 1;            /* 当前第几页 */
    @observable pageCount: number = 1;            /* 总页数 */

    @observable currentProduct: any;              /* 当前编辑帖文商品 */

    protected async internalStart(param?: any) {
        await this.searchByKey(param);
        this.closePage();
        this.openVPage(VSearchProduct, param);
    }

    tab = () => { return this.renderView(VProduct) }

    /**
     * 新增商品页
     */
    openCreationProduct = async (keyWord?:any) => {
        this.goalProductInfo = { genreShow: undefined };
        if (typeof keyWord !== 'string') {
            this.searchProductsToCreation = undefined;
            this.currentSource=ProductSources[0];
        }
        this.openVPage(VCreationProduct,keyWord);
    }

    /**
     * 帖文页面
     */
    openPointProductPost = async (pointProduct: PointProduct) => {
        this.currentProduct = pointProduct;
        this.openVPage(VPointProductPost);
    }

    /**
     * 帖文预览页面
     */
    openPointProductPostShow = async () => {
        let product = this.cApp.getPointProduct(this.currentProduct.id);
        await product.getPostViewData();
        let isScale = false;
        let { htmlFragment, productSource } = product;
        if (productSource && productSource.type === 'jd.com') isScale = true;
        this.openVPage(VPointProductPostShow, { htmlFragment: htmlFragment, isScale });
    }

    /**
     * 更新图片页
     */
    openVUpdatePicture = async (topic?: any) => {
        this.openVPage(VUpdateProductImage, topic);
    }

    /**
     * 帖文图标
     */
    renderPostOperaLabel = (pointProduct: any) => {
        return this.renderView(VPostOperaLabel, { pointProduct });
    }

    /**
     * 筛选头部
     */
    renderSearchHeader = (size?: string) => {
        return this.renderView(VProductSearchHeader, size);
    }

    productConverter = (item: any, queryResults?: { [name: string]: any[] }): PointProduct => {
        let product = this.cApp.getPointProduct(item.id);   
        product.seq = item.seq;
        product.loadListItem();
        return product;
    }

    getPointProductDetail = async(pointProduct:any) => {
        let product = this.cApp.getPointProduct(pointProduct.id);
        // product.props = undefined;
        product.productGenre = undefined;
        await product.loadProductDetail();
        return product;
    }

    getPointProductItems = async(pointProduct:any) => {
        let product = this.cApp.getPointProduct(pointProduct.id);
        if(pointProduct.seq) product.seq = pointProduct.seq;
        await product.loadListItem();
        return product;
    }

    /**
     * 获取商品库
     */
    getProductLib = async () => {
        this.pointProductLib = new QueryPager<any>(this.uqs.积分商城.GetPointProductsByPage, 10, 10);
        this.pointProductLib.setItemConverter(this.productConverter);
        await this.pointProductLib.first({keyWord:""});
    }

    /**
     * 搜索商品库中商品
     */
    searchByKey = async (key: any) => {
        this.searchProductLib = new QueryPager<any>(this.uqs.积分商城.GetPointProductsByPage, 10, 10);
        this.searchProductLib.setItemConverter(this.productConverter);
        await this.searchProductLib.first({keyWord: key});
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
        let pointProductFromGenre: any = await this.getProductsFromGenre(currentGenre);
        if (!pointProductFromGenre.length) this.pointProductLib = [];
        let newPointProducts = pointProductFromGenre.map((v: any, index) => { return { id: v.pointProduct.id, seq: index } });
        let productPromises: Promise<any>[] = [];
        for (let key of newPointProducts) { productPromises.push(this.getPointProductItems(key)); };
        let result = await Promise.all(productPromises);
        let pointProducts: any[] = result.sort((a: PointProduct, b: PointProduct) => a.props.point - b.props.point).map((v: PointProduct) => v);
        this.pointProductLib = pointProducts;
        /**
         * 存在问题，初次筛选 sort不对，因props为undefined
        let pointProductFromGenre: any = await this.getProductsFromGenre(currentGenre);
        if (!pointProductFromGenre.length) this.pointProductLib = [];
        let newPointProducts = pointProductFromGenre.map((v: any, index) => { return { id: v.pointProduct.id, seq: index } });
        let filterPointProducts: any[] = newPointProducts.map((v: any) => this.productConverter(v));
        filterPointProducts.sort((a: PointProduct, b: PointProduct) => {
            // eslint-disable-next-line array-callback-return
            if (!a.props || !b.props) return;
            return a.props.point - b.props.point;
        });
        this.pointProductLib = filterPointProducts;
        */
    }

    /**
     * 更改商品源
     */
    changeCurrentProductSource = (productSource: any) => {
        if (this.currentSource.id !== productSource.id) {
            this.currentSource = productSource;
            this.searchProductsToCreation = [];
            this.pageIndex = 1;
        }
    }

    /**
     * 搜索要添加到商品库的商品
     */
    searchToCreationProduct = async (searchTerm: any) => {
        let { keyWord,Pagination } = searchTerm;
        let { type } = this.currentSource;
        if (Pagination === undefined) this.pageIndex = 1;
        switch (type) {
            case "self":
                await this.searchSelfPointProduct(keyWord);
                return;
            case 'jd.com':
                await this.searchPointProductByJD(keyWord);
                return;
        }
    }

    /**
     * 查询来自营销产品库的可兑换产品
     */
    searchSelfPointProduct= async (keyWord: string) => {
        let { currentSalesRegion } = this.cApp;
        this.searchProductsToCreation = new QueryPager<any>(this.uqs.product.SearchPointProduct, 10, 10);
        await this.searchProductsToCreation.first({ keyWord, salesRegion: currentSalesRegion });
    }

    /**
     * 查询来自JD的产品
     */
    searchPointProductByJD = async (keyWord: string) => {
        let JDImgSize = 'n0/';
        let param = { Keyword: keyWord ,pageIndex: this.pageIndex,sortType:'price_asc' };//sortType:'price_asc' 
        let res = await FetchPost(GLOABLE.JD +'/search', JSON.stringify(param));
        let searchArr = [];
        if (res.ok) {
            let result = await res.json();
            let res1 = await this.getJDProductPrice(result.skuLib);
            if (res1 && res1.length) {
                this.pageIndex = result.pageIndex;
                this.pageCount = result.pageCount; 
                for (let key of result.hitResult) {
                    if (key.wstate === '1' && key.wyn === '1') {
                        let findPriceBySku = res1.find(v => String(v.skuId) === String(key.wareId));
                        if (findPriceBySku !== undefined)
                            searchArr.push({
                                description: key.wareName, descriptionC: key.wareName,
                                grade: undefined,
                                id: key.wareId,
                                imageUrl: JDImagePath + JDImgSize + key.imageUrl,
                                point: undefined,
                                price: findPriceBySku,
                                isValid: 1,
                                origin:key.wareId
                            });
                    }
                }
            }
        }
        this.searchProductsToCreation = searchArr;
    }

    /**
     * 获取JD产品价格
     */
    getJDProductPrice = async (sourceId: string) => {
        let result = await FetchPost(GLOABLE.JD + '/getProductSellPrice', JSON.stringify({ sku: sourceId }));
        if (!result.ok) return;
		let res = await result.json();
		if (!res || !res.length) return;
        return res;
    }

    /**
     * 选择商品
     */
    onProductSelected = async (currentProduct: any, productOrigin?: any) => {
        let product: any, getProductCompleteInfo: any, getProductDetailByJD: any;
        /* 获取商品完整信息 */
        if (productOrigin !== undefined) {
            let isExchangeProduct = await this.getProductSources(currentProduct);
            if (isExchangeProduct !== undefined) {
                product = await this.getPointProductDetail(isExchangeProduct.pointProduct);
            };
            if (isExchangeProduct === undefined && this.currentSource.type === "jd.com") {
                let resultByJD = await FetchPost(GLOABLE.JD + '/getProductDetail', JSON.stringify({ sku: currentProduct.sourceId, queryExts: 'nappintroduction' }));
                if (resultByJD.ok) getProductDetailByJD = await resultByJD.json();
            };
        } else {
            this.currentSource = ProductSources[0];
            product = await this.getPointProductDetail(currentProduct);
        };
        if (product?.props) {
            let { props, productSource, productOther } = product;
            /* let { origin, price, sourceId } = currentProduct;
            getProductCompleteInfo = { ...props, sourceId: productSource?.sourceId || sourceId, price: productOther?.price || price, origin: productOther?.origin || origin }; */
            getProductCompleteInfo = { ...props, sourceId: productSource?.sourceId, price: productOther?.price, origin: productOther?.origin };
        };
        /* 检测是否新增商品 */
        this.isCreationProduct = product?.props !== undefined ? false : true;
        /* 检测是否 上架 or 下架 */
        this.toProductUpShelf = true;/* 显示上架 */
        let fm = 'YYYY-MM-DD HH:mm:ss';
        let FormatEndDate = momentFormat(!this.isCreationProduct ? product?.props?.endDate : undefined, fm);
        let FormatnewDate = momentFormat(undefined, fm);
        if (!this.isCreationProduct && FormatnewDate <= FormatEndDate) this.toProductUpShelf = false; /* 显示下架 */

        /* 商品信息 */
        let result = this.isCreationProduct ? { ...currentProduct } : getProductCompleteInfo;
        if (getProductDetailByJD) {
            result.grade = 1 + getProductDetailByJD.saleUnit;
            result.content = getProductDetailByJD.nappintroduction.replace(/\\n/g, '');
        };
        let productGenre: any = product?.productGenre;
        this.goalProductInfo = {
            ...result,
            genreShow: productGenre ? <>{tv(productGenre, (v) => <>{v.name}</>)}</> : undefined,
            genre: productGenre,
        };
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
    }

    /**
     * 更新图片
     */
    updatedProductImage = async (imgUrl: any) => {
        this.goalProductInfo.imageUrl = imgUrl;
        this.closePage();
    }

    /**
     * 据商品id 获取对应的商品所有信息
     */
    getPointProductLibLoad = async (id: number) => {
        return await this.uqs.积分商城.PointProductLib.load(id);
    }

    /**
     * 保存帖文
     */
    onSavePointProductPost = async (content: any) => {
        let product = this.cApp.getPointProduct(this.currentProduct.id);
        product.addPointProductDetailPost(content);
    }

    /**
     * 商品操作执行
     */
    saveOperation = async (param: any) => {
        let { EDIT, UPSHELF, DOWNSHELF, REUPSHELF } = OperationAdapt;
        let { data, state } = param;
        let productInfo = { ...this.goalProductInfo, ...data };
        switch (state) {
            case EDIT.type:
                await this.editProduct(productInfo);
                return EDIT.name;
            case UPSHELF.type:
                await this.upShelfProduct(productInfo);
                return UPSHELF.name;
            case REUPSHELF.type:
                await this.editProduct(productInfo,true);
                return REUPSHELF.name;
            case DOWNSHELF.type:
                await this.downShelfProduct(productInfo);
                return DOWNSHELF.name;
            default:
                return;
        }
    }

    /**
     * 修改商品 / 重新上架
     */
    editProduct = async (productInfo: any, mustEdit?:boolean) => {
        let { point, imageUrl, startDate, endDate, id } = productInfo;
        await this.dealWithProductGenre(productInfo);
        let isToupdateProduct: any = mustEdit;
        if (!isToupdateProduct) {
            let pointProductFind = await this.getPointProductLibLoad(id);
            let { point: pfPoint, imageUrl: pfImageUrl, startDate: pfStartDate, endDate: pfEndDate } = pointProductFind;
            isToupdateProduct = pfPoint !== point || pfImageUrl !== imageUrl || pfStartDate !== startDate || pfEndDate !== endDate;
        };
        if (isToupdateProduct) await this.savePointProduct(productInfo);
        await this.getPointProductDetail(productInfo);
    }

    /**
     * 处理商品类型(公共代码)
     */
    dealWithProductGenre = async (productInfo: any) => {
        // 新增了商品类型单独删除（取消某商品的商品类型）
        let { genre } = productInfo;
        let productGenreFind = await this.getProductGenre(productInfo);
        if (genre) await this.addProductGenre(productInfo);
        if (productGenreFind) {
            if(!genre || (genre && genre.id !== productGenreFind.genre.id))
            await this.delProductGenre(productGenreFind);
        };
        /* let { genre } = productInfo;
        if (genre !== undefined) {
            // 商品类型  不存在 增类型 存在且不同 先删再增
            let productGenreFind = await this.getProductGenre(productInfo);
            await this.addProductGenre(productInfo);
            if (productGenreFind !== undefined && genre.id !== productGenreFind.genre.id)
                await this.delProductGenre(productGenreFind);
        } */
    }

    /**
     * 商品上架  (纯粹的上架,上架前所有的商品皆无类型)
     */
    upShelfProduct = async (productInfo: any) => {
        productInfo.id = undefined;
        let saveId = await this.savePointProduct(productInfo);
        productInfo.id = saveId.id;
        this.currentProduct = productInfo;
        if (productInfo.genre !== undefined) await this.addProductGenre(productInfo);
        /* 新增商品添加数据源 */
        let resSource = await this.getProductSources(productInfo);
        if (resSource === undefined)
            await this.addPointProductSource(productInfo);
        if (this.currentSource.type === "jd.com")
            await this.onSavePointProductPost(productInfo.content);
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
        return await this.uqs.积分商城.PointProductLib.save(id, { description, descriptionC, grade, point, startDate, endDate, imageUrl, isValid: isValid || 1 });
    }

    /**
     * 获取指定可兑换商品的类型
     */
    getProductGenre = async (productInfo: any) => {
        let { id } = productInfo;
        return await this.uqs.积分商城.GetPointProductGenre.obj({ pointProduct: id })
    }

    /**
     * 获取商品源(by sourceId)
     */
    getProductSources = async (pointProduct: any) => {
        return await this.uqs.积分商城.GetPointProductBySource.obj({ sourceId: pointProduct.sourceId, type: this.currentSource.type });
    }

    /**
     * 添加商品的商品源
     */
    addPointProductSource = async (pointProduct: any) => {
        let { sourceId } = pointProduct;
        await this.uqs.积分商城.PointProductSource.add({ pointProduct, arr1: [{ sourceId, type: this.currentSource.type }] })
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
}