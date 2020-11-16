import React from 'react';
import { VPage, tv, Page, List, FA } from 'tonva';
import { CPointProduct } from './CPointProduct';
import { PointProductImage } from 'tools/productImage';
import { observer } from 'mobx-react';
import { searchKeyShow } from 'lordScreen/VSearchHeader';
import classNames from 'classnames';
import { observable } from 'mobx';

export class VPointProduct extends VPage<CPointProduct>{
    private filterGenre: string;
    async open(param?: any) {
        this.openPage(this.page);
    }

    render(param?: any): JSX.Element {
        return <this.page />
    }

    private toUpDatePointProduct = async (currentPointProduct: any) => {
        /* let { cApp } = this.controller;
        let { cProduct } = cApp;
        cProduct.toProductUpShelf = false;
        await cProduct.onProductSelected(currentPointProduct); */
    }

    private renderPointGenre = (pointProductGenre: any) => {
        let { name } = pointProductGenre;
        return <button className="btn btn-primary w-100 px-2"><small>{name}</small></button>
    }

    renderPointProduct = (pointProduct: any) => {
        let { product, pack, point, imageUrl } = pointProduct;
        return <>
            {tv(product, (v) => {
                return <div className="row m-1 w-100">
                    <div title={v.description} className="col-4 m-0 p-0"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
                    {tv(pack, (c) => {
                        return <div className="col-8 small">
                            <div>{v.descriptionC}</div>
                            <div className="my-2">{c.radioy}{c.unit}</div>
                            <div className="row m-0 p-0">
                                <div className="col-5 m-0 p-0">
                                    <span className="text-danger h5">{point}</span>
                                    <small>分</small>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            })}
        </>
    }

    /* ---------------------布局要更换-------------------- */
    renderPointProduct1 = (pointProduct: any) => {
        let { description, descriptionC, point, imageUrl } = pointProduct;
        return <div className="row m-1 w-100">
            <div title={description} className="col-4 m-0 p-0"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
            <div className="col-8 small">
                <div>{descriptionC}</div>
                {/* <div className="my-2">{c.radioy}{c.unit}</div> */}
                <div className="row m-0 p-0">
                    <div className="col-5 m-0 p-0">
                        <span className="text-danger h5">{point}</span>
                        <small>分</small>
                    </div>
                </div>
            </div>
        </div>
    }

    /**
     * 恢复所有数据
     */
    refreshPointProduct = async () => {
        let { getPointProductLibrary } = this.controller;
        this.filterGenre = undefined;
        await getPointProductLibrary();
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

    page = observer(() => {
        let { pointProducts, renderSearchHeader, cApp, filterByProductGenre } = this.controller;
        let { cGenre } = cApp;
        let header = <div className="w-100 px-2 d-flex justify-content-between "><span className="w-75 m-auto">{renderSearchHeader()}</span></div>
        let none = <div className="d-flex justify-content-center text-secondary small mt-5">暂无可兑换商品</div>;
        let genreNone = <div className="py-1 pl-2 small text-secondary">暂无商品类型,请去新增类型 &rArr; 我的 &raquo;&raquo; 商品类型</div>
        return <Page header={header} back='none'>
            <>
                <div className="border-bottom">
                    <div className="w-24c mt-1 mx-3 d-flex justify-content-between">
                        <small>商品类型：{this.filterGenre}</small>
                        <span className={classNames(!this.filterGenre && 'd-none')} onClick={this.refreshPointProduct}>
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
            </>
            <List items={pointProducts} item={{ render: (v: any) => { if (v.product) { return this.renderPointProduct(v) } else { return this.renderPointProduct1(v) } } }} none={none} />
        </Page>
    })
}


/**
 * 搜索积分商品页面
 */
export class VSearchPointProduct extends VPointProduct {
    @observable searchKey: string;
    @observable searchPointProduct: any[] = []; /* 搜索的积分商品列表 */
    async open(param?: any) {
        let { searchKey, searchPointProduct } = param;
        this.searchKey = searchKey;
        this.searchPointProduct = searchPointProduct;
        this.openPage(this.page);
    }
    refreshPointProduct = async () => {
        let { pointProducts } = this.controller;
        this.searchKey = undefined;
        this.searchPointProduct = pointProducts;
    }
    page = observer(() => {
        let { renderSearchHeader } = this.controller;
        let header = <div className="w-100 px-2">{renderSearchHeader()}</div>
        let none = <div className="d-flex justify-content-center text-secondary small mt-5">暂无可兑换商品</div>;
        return <Page header={header}>
            <>
                {this.searchKey && searchKeyShow(this.searchKey, this.refreshPointProduct)}
            </>
            <List items={this.searchPointProduct} item={{ render: this.renderPointProduct }} none={none} />
        </Page>
    })
}