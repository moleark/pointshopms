import * as React from 'react';
import { VPage, Page, List, FA, Scroller, QueryPager } from 'tonva';
import { CProduct, ProductSources } from 'product/CProduct';
import { PointProductImage } from 'tools/productImage';
import { searchKeyShow } from 'lordScreen/VSearchHeader';
import { observer } from 'mobx-react';
import { VSiteHeader } from './VSiteHeader';
import { observable } from 'mobx';
import classNames from 'classnames';
export const noProductNone: JSX.Element = <div className="mt-4 d-flex justify-content-center text-secondary">『 暂无商品 』</div>;

export function renderPropItem(caption: string, value: any, captionClass?: string) {
    if (value === null || value === undefined || value === '0') return null;
    let capClass = captionClass ? classNames(captionClass) : classNames("text-muted");
    let valClass = captionClass ? classNames(captionClass) : "";
    return <>
        <div className={classNames("col-6 col-sm-2 pr-0 small align-self-center", capClass)}> {caption}</div>
        <div className={classNames("col-6 col-sm-4", valClass)}>{value}</div>
    </>;
}

export class VProduct extends VPage<CProduct>{
    private filterGenre: string;
    async open(param?: any) {
        this.openPage(this.page);
    }

    render(param?: any): JSX.Element {
        return <this.page />
    }

    /**
     * 恢复所有数据
     */
    refreshProduct = async () => {
        let { getProductLib } = this.controller;
        this.filterGenre = undefined;
        await getProductLib();
    }

    renderPostOperaLabel = (pointProduct: any) => {
        return this.controller.renderPostOperaLabel(pointProduct)
    }

    protected renderPointProduct = (pointProduct: any) => {
        let { productOther } = pointProduct;
        let { description, descriptionC, imageUrl, point, grade } = pointProduct.props || pointProduct;
        let price = productOther?.price ? <span className="text-danger h5 ">￥{productOther.price}</span> : null;
        return <div className="row m-1 w-100">
            <div title={description} className="col-lg-3 col-sm-4 col-4 m-auto p-0"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
            <div className="col-lg-9 col-sm-8 col-8 small py-1">
                <div>{descriptionC}</div>
                <div className="row m-0 pt-1">
                    {renderPropItem('产品编号', productOther?.origin,'pt-1')}
                    {renderPropItem('规格', grade,'pt-1')}
                    {renderPropItem('价格', price,"pt-1 my-0")}
                    {renderPropItem('积分', <><span className="text-danger h5">{point}</span><small>分</small></>,'pt-1')}
                </div>
                <div className="py-2 mr-lg-5 mt-sm-4">{this.renderPostOperaLabel(pointProduct)}</div>
            </div>
        </div>
    }

    private renderGenreItem = (item: any) => {
        let { name, imageUrl } = item;
        return <div>
            <label className="w-100 d-flex flex-column justify-content-center">
                {
                    imageUrl
                        ? <div className="m-auto" style={{ width: '30%' }}><PointProductImage chemicalId={imageUrl ? imageUrl : ':0-0268.png'} className="w-100" /></div>
                        : <FA name="leaf" className='mt-2 text-success mb-2' size='lg' />
                }
                <div className='text-dark small'>{name}</div>
            </label>
        </div>
    }

    private loadPointProductMore = async() => {
        this.controller.cApp.cProduct.start('');
    }

    retnderPointProductList = (pointProduct:any) => {
        let { onProductSelected } = this.controller;
        return <List items={pointProduct} item={{ render: this.renderPointProduct, onClick: onProductSelected }} none={noProductNone} />
    }

    page = observer(() => {
        let { pointProductLib, filterByProductGenre, cApp } = this.controller;
        let { cGenre } = cApp;
        let siteHeader = this.renderVm(VSiteHeader);
        let genreNone = <div className="ml-4 pl-2 small text-secondary">暂无商品类型,请去新增类型 &rArr; 我的 &raquo;&raquo; 商品类型</div>
        let pointProducts = (pointProductLib instanceof Array) ? pointProductLib : pointProductLib?.items?.slice(0, 10);
        let loadProductMoreUI: JSX.Element;
        if (!(pointProductLib instanceof Array) && pointProducts?.length >= 10) {
            loadProductMoreUI = <div className="py-4 text-center text-dark border-top cursor-pointer" onClick={this.loadPointProductMore}><FA name="hand-o-right" className="text-primary" size="lg" /> 加载更多</div>
        };

        return <div className="bg-light">
            {siteHeader}
            <div className="border-bottom mb-1 bg-light pt-2">
                <div className="w-24c mt-1 mx-3 d-flex justify-content-between">
                    <small className={classNames(cGenre.productGenres.length && 'mb-2')}>商品类型：{this.filterGenre}</small>
                    <span className={classNames(!this.filterGenre && 'd-none')} onClick={this.refreshProduct}>
                        <FA name="times-circle-o" className="text-danger" />
                    </span>
                </div>
                <List className="d-flex flex-wrap py-2 text-center bg-transparent"
                    items={cGenre.productGenres}
                    item={{
                        render: this.renderGenreItem,
                        onClick: (genre) => { filterByProductGenre(genre); this.filterGenre = genre.name; },
                        className: 'w-25 bg-transparent'
                    }} none={genreNone} />
            </div>
            {this.retnderPointProductList(pointProducts)}
            {loadProductMoreUI}
        </div>
    })
}

/**
 * 搜索商品库页面
 */
export class VSearchProduct extends VProduct {
    @observable searchKey: string;
    async open(param?: any) {
        this.searchKey = param;
        this.openPage(this.page);
    }

    onScrollBottom = async (scroller: Scroller) => {
        scroller.scrollToBottom();
        let { searchProductLib } = this.controller;
        searchProductLib.more();
    }

    refreshProduct = async () => {
        let { searchByKey } = this.controller;
        this.searchKey = undefined;
        await searchByKey('');
    }

    page = observer(() => {
        let { renderSearchHeader, searchProductLib } = this.controller;
        let header = <div className="mx-1 mr-3 w-100">{renderSearchHeader()}</div>;
        return <Page header={header} headerClassName="bg-light" onScrollBottom={this.onScrollBottom}>
            {this.searchKey && searchKeyShow(this.searchKey, this.refreshProduct)}
            <div className="mb-1">{this.retnderPointProductList(searchProductLib)}</div>
        </Page>
    })
}