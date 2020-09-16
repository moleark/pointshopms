import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, List, tv } from 'tonva';
import { CReport } from './CReport';
import { noProductNone } from 'product/VProduct';
import { PointProductImage } from 'tools/productImage';
import { observable } from 'mobx';
// import { searchKeyShow } from 'lordScreen/VSearchHeader';

export class VProductViews extends VPage<CReport> {
    @observable searchKey: string;
    async open(param?: any) {
        this.searchKey = param;
        this.openPage(this.page);
    }

    protected renderPointProduct = (pointProduct: any) => {
        let { imageUrl, point, visits, id } = pointProduct;
        return <>
            {tv(id, (v) => {
                return <div className="row m-1 w-100">
                    <div title={v.description} className="col-4 m-auto p-0"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
                    <div className="col-8 small py-1 d-flex flex-column justify-content-between">
                        <div>{v.descriptionC}</div>
                        <div className="mt-2 mb-1">{v.grade}</div>
                        <div className="row m-0 p-0">
                            <div className="col-5 m-0 p-0">
                                <span className="text-danger h5">{point}</span><small>分</small>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">浏览量：{visits}</div>
                    </div>
                </div>
            })}
        </>
    }

    /**
     * 恢复所有数据
     */
    refreshProduct = async () => {
        let { getBrowsedProductLib } = this.controller;
        this.searchKey = undefined;
        await getBrowsedProductLib();
    }

    private page = observer(() => {
        let { browsedProductLib, cApp, renderSearchHeader, openPointProductVisitRecord } = this.controller;
        let header = <div className="w-100 pr-2 d-flex justify-content-between">
            <span className="align-self-center">浏览量PV</span>
            {/* <div className="w-50">{renderSearchHeader()}</div> */}
        </div>

        return <Page header={header}>
            {/* {searchKeyShow(this.searchKey, this.refreshProduct)} */}
            <List items={browsedProductLib} item={{ render: this.renderPointProduct }} none={noProductNone} />
        </Page>
    })
}