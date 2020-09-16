import * as React from 'react';
import { VPage, Page, List, FA, tv } from 'tonva';
import { CProduct, ProductSources } from 'product/CProduct';
import { PointProductImage } from 'tools/productImage';
import { searchKeyShow } from 'lordScreen/VSearchHeader';
import { observer } from 'mobx-react';
import { VSiteHeader } from './VSiteHeader';
import { observable } from 'mobx';
import classNames from 'classnames';
export const noProductNone: JSX.Element = <div className="mt-4 d-flex justify-content-center text-secondary">『 暂无商品 』</div>;

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
        let { getProductLibrary } = this.controller;
        this.filterGenre = undefined;
        await getProductLibrary();
    }

    protected renderPointProduct = (pointProduct: any) => {
        let { description, descriptionC, imageUrl, point, grade } = pointProduct;
        return <div className="row m-1 w-100">
            <div title={description} className="col-4 m-auto p-0"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
            <div className="col-8 small py-1">
                <div>{descriptionC}</div>
                <div className="mt-2 mb-1">{grade}</div>
                <div className="row m-0 pt-1">
                    <div className="col-5 m-0 p-0">
                        <span className="text-danger h5">{point}</span>
                        <small>分</small>
                    </div>
                </div>
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

    page = observer(() => {
        let { productLibrary, onProductSelected, filterByProductGenre, cApp } = this.controller;
        let { cGenre } = cApp;
        let siteHeader = this.renderVm(VSiteHeader);
        let genreNone = <div className="ml-4 pl-2 small text-secondary">暂无商品类型,请去新增类型 &rArr; 我的 &raquo;&raquo; 商品类型</div>
        return <>
            {siteHeader}
            <div className="border-bottom mb-1">
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
            <List items={productLibrary} item={{ render: this.renderPointProduct, onClick: (v: any) => { this.controller.currentSource = ProductSources[0]; onProductSelected(v) } }} none={noProductNone} />
        </>
    })
}

/**
 * 搜索商品库页面
 */
export class VSearchProduct extends VProduct {
    @observable searchKey: string;
    @observable searchProductLibrary: any[] = [];   /* 商品库搜索列表  */
    async open(param?: any) {
        let { searchKey, searchProduct } = param;
        this.searchKey = searchKey;
        this.searchProductLibrary = searchProduct;
        this.openPage(this.page);
    }

    refreshProduct = async () => {
        let { productLibrary } = this.controller;
        this.searchKey = undefined;
        this.searchProductLibrary = productLibrary;
    }

    page = observer(() => {
        let { onProductSelected, renderSearchHeader } = this.controller;
        let header = <div className="mx-1 mr-3 w-100">{renderSearchHeader()}</div>;
        return <Page header={header}>
            {this.searchKey && searchKeyShow(this.searchKey, this.refreshProduct)}
            <List items={this.searchProductLibrary} item={{ render: this.renderPointProduct, onClick: onProductSelected }} none={noProductNone} />
        </Page>
    })
}