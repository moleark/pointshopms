import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FA, View } from 'tonva';
import { CProduct } from './CProduct';

export class VPostOperaLabel extends View<CProduct> {
    @observable private isPosTExist: boolean;
    render(param: any): JSX.Element {
        return <this.content param={param} />;
    }

    private getPostOpera = async (pointProduct: any) => {
        let getPost = await this.controller.getPointProductDetailPost(pointProduct);
        this.isPosTExist = getPost !== undefined ? true : false;
    }

    private content = observer((param: any): any => {
        let { pointProduct, postSource } = param.param;
        let { openPointProductPost } = this.controller;
        if (pointProduct.isPosTExist) {
            this.isPosTExist = pointProduct.isPosTExist;
        } else {
            this.getPostOpera(pointProduct);
        }
        return <div className="d-flex justify-content-end mx-2" onClick={(e) => { e.stopPropagation(); openPointProductPost(pointProduct, this.isPosTExist ? '编辑' : '创建', postSource) }}>
            <div>帖文</div>
            <div>
                {
                    this.isPosTExist
                        ? <span><FA name="edit" size="lg" className="mx-2 text-primary" /></span>
                        : <span><FA name="plus-circle" size="lg" className="mx-2 text-success" /></span>
                }
            </div>
        </div>
    });
}
