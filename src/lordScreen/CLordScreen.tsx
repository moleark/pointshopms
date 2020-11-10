import { VLordScreen } from './VLordScreen';
import { CUqBase } from 'CBase';

export class CLordScreen extends CUqBase {

    protected async internalStart() { }

    tab = () => this.renderView(VLordScreen);

    /**
     * 首屏界面去向
     */
    openInterfaceCase = async (state: any) => {
        let { cPointProduct, cMe } = this.cApp;
        switch (state) {
            case 'productGenre':
                await cMe.openProductGenre();
                return;
            case 'pointProduct':
                await cPointProduct.openPointProduct();
                return;
            default:
                return;
        }
    }
}