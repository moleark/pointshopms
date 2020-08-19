import { VLordScreen } from './VLordScreen';
import { CUqBase } from 'CBase';

export class CLordScreen extends CUqBase {

    protected async internalStart() { }

    tab = () => this.renderView(VLordScreen);

    /**
     * 首屏界面去向
     */
    openInterfaceCase = async (state: any) => {
        let { cProduct, cPointProduct } = this.cApp;
        let { openProductList, openProductGenre, openProductContent, } = cProduct;
        let { openPointProduct } = cPointProduct;
        switch (state) {
            case 'productList':
                await openProductList();
                return;
            case 'productGenre':
                await openProductGenre();
                return;
            case 'creationProduct':
                await openProductContent();
                return;
            case 'pointProduct':
                await openPointProduct();
                return;
            default:
                return;
        }
    }
}