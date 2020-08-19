import * as React from 'react';
import { CLordScreen } from './CLordScreen';
import { observer } from 'mobx-react';
import { VPage, Page, FA } from 'tonva';

export class VLordScreen extends VPage<CLordScreen> {
    private lordScreenCase: any[] = [
        { caption: '商品库', state: 'productList', icon: 'list-ul' },
        // { caption: '商品类型', state: 'productGenre', icon: 'th-large' },
        { caption: '新增商品', state: 'creationProduct', icon: 'plus-circle' },
        { caption: '积分商品', state: 'pointProduct', icon: 'diamond' },
    ];
    async open(param?: any) { }

    render(param?: any): JSX.Element {
        return <this.pageContent />
    }

    private interfaceCase = () => {
        let { openInterfaceCase } = this.controller
        return <div className="d-flex w-100 my-3 flex-wrap px-1 text-center">
            {
                this.lordScreenCase.map(((os, index) => {
                    let { caption, state, icon } = os;
                    return <div key={index} className="d-flex flex-column align-items-center cursor-pointer mb-3 py-2 px-1 mx-2 rounded"
                        style={{ color: '#436EEE', background: '#F2F2F2', width: '20%' }}
                        onClick={() => openInterfaceCase(state)}>
                        <FA name={icon} className="fa-2x" />
                        <small className="text-muted">{caption}</small>
                    </div>;
                }))
            }
        </div>
    }

    private pageContent = observer(() => {
        return <Page header="PointShopMs" back="none">
            {this.interfaceCase()}
        </Page>
    })
}