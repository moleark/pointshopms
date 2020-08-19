import React from 'react';
import { VPage, tv, Page, List, FA } from 'tonva';
import { CPointProduct } from './CPointProduct';
import { PointProductImage } from 'tools/productImage';
import { observer } from 'mobx-react';
import { searchKeyShow } from 'lordScreen/VSearchHeader';
import classNames from 'classnames';

export class VPointProduct extends VPage<CPointProduct>{
    private searchKey: string;
    private filterGenre: string;
    async open(param?: any) {
        this.searchKey = param;
        this.openPage(this.page);
    }

    private toUpDatePointProduct = async (currentPointProduct: any) => {
        let { cApp } = this.controller;
        let { cProduct } = cApp;
        cProduct.toProductUpShelf = false;
        await cProduct.onProductSelected(currentPointProduct);
    }

    private renderPointGenre = (pointProductGenre: any) => {
        let { name } = pointProductGenre;
        return <button className="btn btn-primary w-100 px-2"><small>{name}</small></button>
    }

    private renderPointProduct = (pointProduct: any) => {
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

    /**
     * 恢复所有数据
     */
    private refreshPointProduct = async () => {
        let { getPointProductLibrary } = this.controller;
        this.filterGenre = this.searchKey = undefined;
        this.controller.pointProducts = await getPointProductLibrary();
    }
    private renderGenreItem = (item: any) => {
        let { name, imgUrl } = item;
        return <div>
            <label className="w-100 d-flex flex-column justify-content-center">
                {/* <FA name="leaf" className='mt-2 text-success mb-2' size='lg' /> */}
                <div className="w-25 m-auto"><PointProductImage chemicalId={imgUrl ? imgUrl : ':0-0268.png'} className="w-100" /></div>
                <div className='text-dark small'>{name}</div>
            </label>
        </div>
    }

    private page = observer(() => {
        let { pointProducts, renderSearchHeader, cApp, filterByProductGenre } = this.controller;
        let { cGenre } = cApp;
        let header = renderSearchHeader();
        let none = <div className="d-flex justify-content-center text-secondary small mt-5">暂无可兑换商品</div>;
        let genreNone = <div className="py-1 pl-2 small text-secondary">暂无商品类型,请去新增类型 &rArr; 我的 &raquo;&raquo; 商品类型</div>
        return <Page header={header}>
            <>
                {this.searchKey && searchKeyShow(this.searchKey, this.refreshPointProduct)}
                <div className="border-bottom">
                    <div className="w-24c mt-1 mx-3 d-flex justify-content-between">
                        <small>商品类型：{this.filterGenre}</small>
                        <span className={classNames(!this.filterGenre && 'd-none')} onClick={this.refreshPointProduct}>
                            <FA name="times-circle-o" className="text-danger" />
                        </span>
                    </div>
                    {/* <List items={cGenre.productGenres}
                        item={{
                            render: this.renderPointGenre,
                            onClick: (genre) => { this.searchKey = undefined; filterByProductGenre(genre); this.filterGenre = genre.name; },
                            className: "m-1"
                        }}
                        className="mb-1 mx-3 bg-light d-flex flex-wrap" none={genreNone} /> */}
                    <List className="d-flex flex-wrap py-2 text-center bg-transparent"
                        items={cGenre.productGenres}
                        item={{
                            render: this.renderGenreItem,
                            onClick: (genre) => { this.searchKey = undefined; filterByProductGenre(genre); this.filterGenre = genre.name; },
                            className: 'w-25 bg-transparent'
                        }} none={genreNone} />
                </div>
            </>
            <List items={pointProducts} item={{ render: this.renderPointProduct, onClick: this.toUpDatePointProduct }} none={none} />
        </Page>
    })
}
