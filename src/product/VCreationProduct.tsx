import * as React from 'react';
import { VPage, Page, List, FA, LMR, Scroller} from 'tonva';
import { CProduct, ProductSources } from 'product/CProduct';
import { PointProductImage } from 'tools/productImage';
import { observer } from 'mobx-react';
import { noProductNone } from './VProduct';
import { observable } from 'mobx';
import { GLOABLE } from 'configuration';
import classNames from 'classnames';

export class VCreationProduct extends VPage<CProduct>{
    private genreInput: HTMLInputElement;
    @observable private searchIsBlank: boolean = false;
    @observable Pagination: boolean = false;
    @observable searchKey: string;
    @observable searchPlaceholder: string='输入商品名称、编号';
    async open(param?: any) {
        if (param !== undefined) this.searchKey = param;
        this.openPage(this.page);
    }

    private renderPointProduct = (pointProduct: any) => {
        let { imageUrl, description, descriptionC, radioy, unit, price , retail } = pointProduct;
        let { currentSource } = this.controller;        
        let showPrice = currentSource.type=== "jd.com" ? (price ? price.price :'') : retail;
        return <div className="row m-1 w-100">
            <div title={description} className="col-4 m-0 p-0"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
            <div className="col-8 small py-1">
                <div>{descriptionC}</div>
                <div className="my-2">{radioy}{unit}</div>
                {showPrice ? <div className="text-danger h5 mt-1">￥{showPrice}</div> : null}
            </div>
        </div>
    }

    private ProductSelected = async (pointProduct: any) => {
        let { onProductSelected ,currentSource} = this.controller;
        let { description, descriptionC, radioy, unit, product, id, imageUrl,retail,price } = pointProduct;
        let pointProductInfo;
        if (currentSource.id !== 2) {
            pointProductInfo = { description, descriptionC, grade: `${radioy}${unit}`, id: undefined, imageUrl: product.obj.imageUrl, point: undefined, sourceId: id.id,  price:retail, isValid: 1 };
        } else {
            pointProductInfo = { description, descriptionC, grade: undefined, id: undefined, imageUrl: imageUrl, point: undefined, sourceId: id, price:price.price, isValid: 1 };
        }
        await onProductSelected(pointProductInfo, '新增');
    }

    private renderDataSources = (dataSource: any) => {
        let { source, id } = dataSource;
        return <span className={classNames(this.controller.currentSource.id === id ? 'text-light bg-primary' : 'text-primary', 'm-1 border-primary border py-1 px-2 rounded-lg small')}>{source}</span>;
    }

    private searchProduct = async () => {
        let { searchToCreationProduct,currentSource } = this.controller;
        if (!this.genreInput.value || !currentSource) {
            this.searchIsBlank = true;
            setTimeout(() => this.searchIsBlank = false, GLOABLE.TIPDISPLAYTIME);
            return;
        }
        this.searchKey = this.genreInput.value;
        this.genreInput.value = '';
        await searchToCreationProduct({ keyWord:this.searchKey });
    }

    private changePageIndex = async (page:number) => {
        let { searchToCreationProduct, pageIndex, pageCount,openCreationProduct } = this.controller;
        if ((page > 0 && pageIndex < pageCount) || (page < 0 && pageIndex >= 2)) {
            this.controller.pageIndex += page;
            await searchToCreationProduct({ keyWord: this.searchKey, Pagination: true });
            this.closePage();
            await openCreationProduct(this.searchKey);
        }
    }

    private onScrollBottom = async (scroller: Scroller) => {
        scroller.scrollToBottom();
        let { searchProductsToCreation } = this.controller;
        if (!(searchProductsToCreation instanceof Array)) {
            searchProductsToCreation.more();
        }
    }

    private renderPagination = () => {
        let { pageIndex, pageCount} = this.controller;
        return <div className="d-flex px-3 justify-content-between">
                <button
                    onClick={()=>this.changePageIndex(-1)}
                    className={classNames('btn', pageIndex === 1 ? 'disabled btn-light border border-secondary' : 'btn-primary')}>prev</button>
                <div className="text-center align-self-center"><span className="text-primary">{pageIndex}</span>/{pageCount}</div>
                <button
                    onClick={()=>this.changePageIndex(1)}
                    className={classNames('btn', pageIndex === pageCount ? 'disabled btn-light border border-secondary' : 'btn-primary')}>next</button>
            </div>
    }

    private page = observer(() => {
        let { searchProductsToCreation, currentSource, changeCurrentProductSource} = this.controller;
        let LMRRight = <button className="btn btn-primary w-100" onClick={this.searchProduct}><FA name="search" /></button>
        let footer = undefined;
        if ((searchProductsToCreation instanceof Array) && searchProductsToCreation.length)
            footer = this.renderPagination();
        
        return <Page header="商品新增" onScrollBottom={this.onScrollBottom} footer={footer}>
            <div className="p-2 border-bottom bg-white">
                <div className="d-flex flex-column mb-2">
                    <div className="my-1">商品源：<small>{currentSource ? currentSource.type : null}</small></div>
                    <List items={ProductSources} item={{ render: this.renderDataSources, onClick: (v: any) => { changeCurrentProductSource(v) } }} className="d-flex bg-white w-100 flex-wrap" none="暂无商品源" />
                </div>
                <LMR right={LMRRight}>
                    <form onSubmit={(e) => { e.preventDefault(); this.searchProduct() }} >
                        <input ref={v => this.genreInput = v} type="text" placeholder={currentSource.type === 'jd.com' ? '输入商品名称' :'输入商品名称、编号'} className="form-control"></input>
                    </form>
                </LMR>
                {this.searchIsBlank ? <div className="text-danger mt-1 small">{`${!this.genreInput.value ? '请输入商品名称' : !currentSource ? '请选择商品源' : ''}`}</div> : null}
            </div>
                <List items={searchProductsToCreation !== undefined ? searchProductsToCreation : []}
                    item={{ render: this.renderPointProduct, onClick: this.ProductSelected }} none={noProductNone} />
        </Page>
    })
}