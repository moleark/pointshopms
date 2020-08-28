import * as React from 'react';
import { View, nav, FA } from 'tonva';
import { SearchBox } from 'tonva';
import { CUqBase } from 'CBase';
import classNames from 'classnames';

export class VSearchHeader extends View<CUqBase> {
    protected placeholder: string = '搜索商品名称';
    private onSearch = async (key: string, param: 'home' | 'insearch' | 'productdetail') => {
        let { topKey } = this.controller.cApp;
        if (param !== 'home') {
            nav.popTo(topKey);
        }
        this.controller.start(key);
    }

    render(param: 'home' | 'insearch' | 'productdetail') {
        let size: any = param === 'home' ? "md" : 'sm';
        return <SearchBox className={classNames("w-100", 'mr-3')}
            size={size}
            onSearch={(key: string) => this.onSearch(key, param)}
            placeholder={this.placeholder} />
    }
}

export class VProductSearchHeader extends VSearchHeader { }


export class VPointProductSearchHeader extends VSearchHeader {
    placeholder: string = '搜索积分商品';
}

export function searchKeyShow(searchKey: string, action: any) {// close remove times-circle  times-circle-o
    return <div className="bg-white d-flex justify-content-between py-1 px-3 border-bottom">
        <span><small className="small text-muted">搜索: </small>{searchKey}</span>
        <span onClick={action}><FA name="times-circle-o" className="text-danger" /></span>
    </div>
}