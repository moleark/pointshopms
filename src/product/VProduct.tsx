import * as React from 'react';
import { VPage, Page, tv, List, FA } from 'tonva';
import { CProduct, ProductSources } from 'product/CProduct';
import { PointProductImage } from 'tools/productImage';
import { searchKeyShow } from 'lordScreen/VSearchHeader';
import { observer } from 'mobx-react';
import { VSiteHeader } from './VSiteHeader';
import { observable } from 'mobx';
export const noProductNone: JSX.Element = <div className="mt-4 d-flex justify-content-center text-secondary">『 暂无商品 』</div>;
export class VProduct extends VPage<CProduct>{
    async open(param?: any) {

        this.openPage(this.page);
    }

    render(param?: any): JSX.Element {
        return <this.page />
    }

    // protected renderPointProduct = (pointProduct: any) => {
    //     let { product, pack, imageUrl } = pointProduct;
    //     return <>
    //         {tv(product, (v) => {
    //             return <div className="row m-1 w-100">
    //                 <div title={v.description} className="col-4 m-0 p-0"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
    //                 {tv(pack, (c) => {
    //                     return <div className="col-8 small py-1">
    //                         <div>{v.descriptionC}</div>
    //                         <div className="my-2">{c.radioy}{c.unit}</div>
    //                     </div>
    //                 })}
    //             </div>
    //         })}
    //     </>
    // }

    protected renderPointProduct = (pointProduct: any) => {
        let { description, descriptionC, imageUrl, point } = pointProduct;
        return <div className="row m-1 w-100">
            <div title={description} className="col-4 m-0 p-0"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
            <div className="col-8 small py-1">
                <div>{descriptionC}</div>
                {
                    point && <div className="row m-0 pt-1">
                        <div className="col-5 m-0 p-0">
                            <span className="text-danger h5">{point}</span>
                            <small>分</small>
                        </div>
                    </div>
                }
            </div>
        </div>
    }

    page = observer(() => {
        // console.log(this.controller.cApp.uqs.积分商城);
        let { productLibrary, onProductSelected, renderSearchHeader, openCreationProduct } = this.controller;
        // let header = <div className="mx-1">{renderSearchHeader()}</div>
        // let right = <span className="fa-stack mr-2" onClick={openCreationProduct}>
        //     <i className="fa fa-circle fa-stack-2x text-white"></i>
        //     <i className="fa fa-plus fa-stack-1x text-success"></i>
        // </span>

        // return <Page header={header} back="none" right={right}>
        //     <div className="px-3 pt-3">{header}</div>
        //     {this.searchKey && searchKeyShow(this.searchKey, this.refreshProduct)}
        //     <List items={productLibrary} item={{ render: this.renderPointProduct, onClick: onProductSelected }} none="暂无商品" />
        // </Page>
        let siteHeader = this.renderVm(VSiteHeader);
        return <>
            {siteHeader}
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

    /**
    * 恢复所有数据
    */
    protected refreshProduct = async () => {
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