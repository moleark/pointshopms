import * as React from 'react';
import { VPage, Page, tv, List, FA, LMR, Scroller } from 'tonva';
import { CProduct, ProductSources } from 'product/CProduct';
import { PointProductImage } from 'tools/productImage';
import { observer } from 'mobx-react';
import { noProductNone } from './VProduct';
import { observable } from 'mobx';
import { GLOABLE } from 'configuration';

export class VCreationProduct extends VPage<CProduct>{
    private genreInput: HTMLInputElement;
    @observable private searchIsBlank: boolean = false;
    @observable selectedProductSource: any
    async open(param?: any) {
        this.openPage(this.page);
    }

    private renderPointProduct = (pointProduct: any) => {
        let { imageUrl, description, descriptionC, radioy, unit } = pointProduct;
        return <div className="row m-1 w-100">
            <div title={description} className="col-4 m-0 p-0"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
            <div className="col-8 small py-1">
                <div>{descriptionC}</div>
                <div className="my-2">{radioy}{unit}</div>
            </div>
        </div>
    }

    private renderDataSources = (dataSource: any) => {
        let { source } = dataSource;
        return <span className="m-1 text-light bg-primary py-1 px-2 rounded-lg small">{source}</span>;
    }

    private selectSource = async (productSource: any) => {
        this.selectedProductSource = productSource;
    }

    private searchProduct = async () => {
        let { searchToCreationProduct } = this.controller;
        if (!this.genreInput.value || !this.selectedProductSource) {
            this.searchIsBlank = true;
            setTimeout(() => this.searchIsBlank = false, GLOABLE.TIPDISPLAYTIME);
            return;
        }
        let keyWord = this.genreInput.value;
        this.genreInput.value = '';
        await searchToCreationProduct({ keyWord, productSource: this.selectedProductSource });
    }

    private onScrollBottom = async (scroller: Scroller) => {
        scroller.scrollToBottom();
        let { searchProductsToCreation } = this.controller;
        searchProductsToCreation.more();
    }

    private page = observer(() => {
        let { searchProductsToCreation, onProductSelected } = this.controller;
        let right = <button className="btn btn-primary w-100" onClick={this.searchProduct}><FA name="search" /></button>

        return <Page header="商品新增-新版" onScrollBottom={this.onScrollBottom}>
            <div className="p-2 border-bottom">
                <div className="d-flex flex-column mb-2">
                    <div className="my-1">商品源：<small>{this.selectedProductSource ? this.selectedProductSource.type : null}</small></div>
                    <List items={ProductSources} item={{ render: this.renderDataSources, onClick: this.selectSource }} className="d-flex bg-white w-100 flex-wrap" none="暂无商品源" />
                </div>
                <LMR right={right}>
                    <input ref={v => this.genreInput = v} type="text" placeholder="请先选择商品源,再输入商品名称" className="form-control"></input>
                </LMR>
                {this.searchIsBlank ? <div className="text-danger mt-1 small">{`${!this.genreInput.value ? '请输入查询名称' : !this.selectedProductSource ? '请选择商品源' : ''}`}</div> : null}
            </div>
            <List items={searchProductsToCreation} item={{ render: this.renderPointProduct, onClick: onProductSelected }} none={noProductNone} />
        </Page>
    })
}
