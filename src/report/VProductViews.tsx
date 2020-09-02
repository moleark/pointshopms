import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, List, } from 'tonva';
import { CReport } from './CReport';
import { noProductNone } from 'product/VProduct';
import { PointProductImage } from 'tools/productImage';

export class VProductViews extends VPage<CReport> {

    async open(param?: any) {
        this.openPage(this.page);
    }

    protected renderPointProduct = (pointProduct: any) => {
        let { description, descriptionC, imageUrl, point, grade } = pointProduct;
        return <div className="row m-1 w-100">
            <div title={description} className="col-4 m-auto p-0"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
            <div className="col-8 small py-1">
                <div>{descriptionC}</div>
                <div className="mt-2 mb-1">{grade}</div>
                <div className="row m-0 pt-1 d-flex justify-content-between">
                    <div className="col-5 m-0 p-0">
                        <span className="text-danger h5">{point}</span>
                        <small>分</small>
                    </div>
                    <div>浏览量：1</div>
                </div>
            </div>
        </div>
    }

    private page = observer(() => {
        let { browsedProductLib, cApp, renderSearchHeader } = this.controller;
        let { cProduct } = cApp;
        // cProduct.productLibrary
        let header = <div className="w-100 px-2 d-flex justify-content-between">
            <span className="align-self-center">商品浏览量</span>
            <div className="w-50">{renderSearchHeader()}</div>
        </div>

        return <Page header={header}>
            <List items={browsedProductLib} item={{ render: this.renderPointProduct }} none={noProductNone} />
        </Page>
    })
}