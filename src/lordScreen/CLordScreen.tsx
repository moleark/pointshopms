import { VLordScreen } from './VLordScreen';
import { CUqBase } from 'CBase';

export class CLordScreen extends CUqBase {

    protected async internalStart() { }

    tab = () => this.renderView(VLordScreen);

    /**
     * 首屏界面去向
     */
    openInterfaceCase = async (state: any) => {
        let { cProduct, cPointProduct, cMe } = this.cApp;
        let { openProductList, openCreationProduct, } = cProduct;
        switch (state) {
            case 'productList':
                await openProductList();
                return;
            case 'productGenre':
                await cMe.openProductGenre();
                return;
            case 'creationProduct':
                await openCreationProduct();
                return;
            case 'pointProduct':
                await cPointProduct.openPointProduct();
                return;
            default:
                return;
        }
    }
}