import * as React from 'react';
import { VPage, Page, tv, List, FA } from 'tonva';
import { CProduct } from 'product/CProduct';
import { PointProductImage } from 'tools/productImage';
import { searchKeyShow } from 'lordScreen/VSearchHeader';
import { observer } from 'mobx-react';

export class VProduct extends VPage<CProduct>{
    private searchKey: string;
    async open(param?: any) {
        this.searchKey = param;
        this.openPage(this.page);
    }

    private renderPointProduct = (pointProduct: any) => {
        let { product, pack, imageUrl } = pointProduct;
        return <>
            {tv(product, (v) => {
                return <div className="row m-1 w-100">
                    <div title={v.description} className="col-4 m-0 p-0"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
                    {tv(pack, (c) => {
                        return <div className="col-8 small py-1">
                            <div>{v.descriptionC}</div>
                            <div className="my-2">{c.radioy}{c.unit}</div>
                        </div>
                    })}
                </div>
            })}
        </>
    }

    /**
    * 恢复所有数据
    */
    private refreshProduct = async () => {
        let { getProductLibrary } = this.controller;
        this.searchKey = undefined;
        this.controller.productLibrary = await getProductLibrary();
    }

    private page = observer(() => {
        let { productLibrary, onProductSelected, renderSearchHeader } = this.controller;
        let header = renderSearchHeader();
        return <Page header={header}>
            {this.searchKey && searchKeyShow(this.searchKey, this.refreshProduct)}
            <List items={productLibrary} item={{ render: this.renderPointProduct, onClick: onProductSelected }} none="暂无商品" />
        </Page>
    })
}
