import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FA, View } from 'tonva';
import { CProduct } from './CProduct';
import classNames from 'classnames';

export class VPostOperaLabel extends View<CProduct> {
    @observable private isPosTExist: boolean =false;
    render(param: any): JSX.Element {
        let { pointProduct } = param;
        if (pointProduct.productDetailPost) this.isPosTExist = true;
        return <this.content param={param} />;
    }

    private content = observer((param: any): any => {
        let { pointProduct } = param.param;
        let { openPointProductPost } = this.controller; 
        return <div className="mx-2 float-right pt-2 pl-3" onClick={(e) => { e.stopPropagation(); openPointProductPost(pointProduct) }}>
                帖文<span><FA name={this.isPosTExist ? 'edit' :'plus-circle'} size="lg" className={classNames('mx-2', this.isPosTExist ?'text-primary':'text-success')} /></span>
        </div>
    });
}



/* export class VPostOperaLabel extends View<CProduct> {
    @observable private isPosTExist: boolean;
    render(param: any): JSX.Element {
        let { pointProduct } = param;
        console.log('pointProduct',pointProduct);
        
        if (pointProduct.isPosTExist) this.isPosTExist = pointProduct.isPosTExist;
        else this.getPostOpera(pointProduct);
        return <this.content param={param} />;
    }

    private getPostOpera = async (pointProduct: any) => {
        let getPost = await this.controller.getPointProductDetailPost(pointProduct);
        this.isPosTExist = getPost !== undefined ? true : false;
    }

    private content = observer((param: any): any => {
        let { pointProduct, postSource } = param.param;
        let { openPointProductPost } = this.controller; 
        return <div className="d-flex justify-content-end mx-2" onClick={(e) => { e.stopPropagation(); openPointProductPost(pointProduct, this.isPosTExist , postSource) }}>
            <div>帖文</div>
            <div>
                <span><FA name={this.isPosTExist ? 'edit' :'plus-circle'} size="lg" className={classNames('mx-2', this.isPosTExist ?'text-primary':'text-success')} /></span>
            </div>
        </div>
    });
} */
