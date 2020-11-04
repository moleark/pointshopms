import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, List, FA, Form, UiCustom, NumSchema, UiSchema, StringSchema, } from 'tonva';
import { CLottery } from './CLottery';
import { PointProductImage } from 'tools/productImage';
import { observable } from 'mobx';
import { MinusPlusWidget } from 'tools/minusPlusWidget';
const schema = [
    { name: 'id', type: 'number' } as NumSchema,
    // { name: 'product', type: 'object' } as ObjectSchema,
    { name: 'descriptionC', type: 'string' } as StringSchema,
    { name: 'quantity', type: 'number' } as NumSchema,
    { name: 'imageUrl', type: 'string' } as StringSchema,
];

export class VLotteryProduct extends VPage<CLottery> {
    @observable protected isAddProduct: boolean = false;    /* 是否新增抽奖产品 */
    async open(param?: any) {
        this.openPage(this.page);
    }

    private uiSchema: UiSchema = {
        items: {
            id: { visible: false },
            // product: { visible: false },
            descriptionC: { visible: false },
            quantity: {
                widget: 'custom',
                label: null,
                className: 'text-center',
                WidgetClass: MinusPlusWidget,
                onChanged: this.controller.onQuantityChanged as any
            } as UiCustom,
            imageUrl: { visible: false }
        }
    }

    private delLotteryProducts = async (product: any, index: number) => {
        let { delLotteryProducts, getTotalPR } = this.controller;
        this.controller.lotteryProducts.splice(index, 1);
        await delLotteryProducts(product);
        getTotalPR();
    }

    protected renderLotteryProduct = (product: any, index: number) => {
        let { imageUrl, descriptionC } = product;
        return <div className="row m-1 w-100">
            <div className="col-4 m-auto p-0"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
            <div className="col-8 small py-1 position-relative d-flex flex-column justify-content-between">
                <div>{descriptionC}</div>
                {
                    !this.isAddProduct ?
                        <div className="d-flex justify-content-end pr-2 text-primary small position-absolute" style={{ top: 3, right: -3 }}
                            onClick={() => this.delLotteryProducts(product, index)}>
                            <FA name={'trash'} size="2x" />
                        </div> : null
                }
                <div className="d-flex justify-content-between mt-2 p-0">
                    <h5 className="align-self-center mb-3">概率<small>(%)</small></h5>
                    <Form schema={schema} uiSchema={this.uiSchema} formData={product} className="mr-2" />
                </div>
            </div>
        </div>
    }

    protected page = observer(() => {
        let { totalPR, lotteryProducts, openLotteryProductQueryLib } = this.controller;
        let right = <div className="small mr-2" style={{ color: 'rgb(59,169,246)' }} onClick={openLotteryProductQueryLib}>
            <FA name="plus-square-o" size="2x" />
        </div>;
        let none = <div className="mt-3 text-secondary d-flex justify-content-center">『 无抽奖商品 』</div>
        return <Page header="抽奖商品" right={right}>
            <div className="py-2">
                <div className="px-2 small">概率总和: <span className="text-danger h6">{totalPR}%</span></div>
                <List items={lotteryProducts} item={{ render: this.renderLotteryProduct }} none={none} className="mt-2" />
            </div>
        </Page>
    })
}

export class VLotteryProductQueryLib extends VLotteryProduct {
    @observable isAddProduct: boolean = true;

    protected page = observer(() => {
        let { QProductLib } = this.controller;
        let none = <div className="mt-3 text-secondary d-flex justify-content-center">『 无商品 』</div>;

        return <Page header="商品库">
            <div className="py-2">
                <List items={QProductLib} item={{ render: this.renderLotteryProduct }} none={none} className="mt-2" />
            </div>
        </Page>
    })
}