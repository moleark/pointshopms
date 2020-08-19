import { nav, } from 'tonva';
// import { UQs } from 'uqs';
import { VMain } from 'VMain';
import { CUqApp } from 'CBase'
import { WebUser } from 'currentUser';
// import { GLOABLE } from 'configuration';
import { CMe } from 'me/CMe';
import { CLordScreen } from 'lordScreen/CLordScreen';
import { CProduct } from 'product/CProduct';
import { CGenre } from 'pointShop/CGenre';
import { CPointProduct } from 'pointShop/CPointProduct';

export class CPointMallApp extends CUqApp {
    // get uqs(): UQs { return this._uqs; }

    topKey: any;
    currentSalesRegion: any;
    currentLanguage: any;
    currentUser: WebUser;
    cLordScreen: CLordScreen;
    cMe: CMe;
    cGenre: CGenre;
    cProduct: CProduct;
    cPointProduct: CPointProduct;

    protected async internalStart() {

        // let { uqs } = this;
        // let { common } = uqs;
        // let { SalesRegion, Language } = common;
        // let [currentSalesRegion, currentLanguage] = await Promise.all([
        //     SalesRegion.load(GLOABLE.SALESREGION_CN),
        //     Language.load(GLOABLE.CHINESE),
        // ]);
        this.currentUser = new WebUser(this.uqs);
        if (this.isLogined) {
            this.currentUser.setUser(this.user);
        }
        this.cLordScreen = this.newC(CLordScreen);
        this.cMe = this.newC(CMe);
        this.cProduct = this.newC(CProduct);
        this.cPointProduct = this.newC(CPointProduct);
        this.cGenre = this.newC(CGenre);
        await this.cGenre.getProductGenres();
        this.topKey = nav.topKey();
        this.showMain();
    }

    showMain(initTabName?: string) {
        this.openVPage(VMain, initTabName);
    }
}
