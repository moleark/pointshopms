import { BoxId, nav, UserCache, } from 'tonva';
// import { UQs } from 'uqs';
import { VMain } from 'VMain';
import { CUqApp } from 'CBase'
import { WebUser } from 'currentUser';
import { CMe } from 'me/CMe';
import { CLordScreen } from 'lordScreen/CLordScreen';
import { CProduct } from 'product/CProduct';
import { CGenre } from 'pointShop/CGenre';
import { CPointProduct } from 'pointShop/CPointProduct';
import { CLottery } from 'pointShop/CLottery';
import { CReport } from 'report/CReport';
import { GLOABLE } from 'configuration';
import { CMedia } from 'media/CMedia';
import { res } from 'res';
import { CPosts } from 'posts/CPosts';
import { PointProduct } from 'model';
// import { CMedia } from 'media-ng-07/src';
import { CBrandDiscount } from './brandDiscount/CBrandDiscount';

export class CPointShopMsApp extends CUqApp {
    // get uqs(): UQs { return this._uqs; }
    private cache: Map<number, PointProduct>;
    topKey: any;
    currentSalesRegion: any;
    currentLanguage: any;
    currentUser: WebUser;
    cLordScreen: CLordScreen;
    cMe: CMe;
    cGenre: CGenre;
    cProduct: CProduct;
    cPointProduct: CPointProduct;
    cLottery: CLottery;
    cReport: CReport;
    cMedia: CMedia;
    cPosts: CPosts;
    cBrandDiscount: CBrandDiscount;

    private userCache: UserCache<any>;
    protected async internalStart() {

        let { uqs } = this;
        let { common } = uqs;
        let { SalesRegion, Language } = common;
        let [currentSalesRegion, currentLanguage] = await Promise.all([
            SalesRegion.load(GLOABLE.SALESREGION_CN),
            Language.load(GLOABLE.CHINESE),
        ]);
        this.currentSalesRegion = currentSalesRegion;
        this.currentLanguage = currentLanguage;

        this.setRes(res);
        let userLoader = async (userId: number): Promise<any> => {
            let model = await this.uqs.hr.SearchEmployeeByid.query({ _id: userId });
            return model?.ret?.[0];
        }
        this.userCache = new UserCache(userLoader);


        this.currentUser = new WebUser(this.uqs);
        if (this.isLogined) {
            this.currentUser.setUser(this.user);
        }
        this.cache = new Map();
        this.cLordScreen = this.newC(CLordScreen);
        this.cMe = this.newC(CMe);
        this.cProduct = this.newC(CProduct);
        await this.cProduct.getProductLib();
        this.cPointProduct = this.newC(CPointProduct);
        this.cGenre = this.newC(CGenre);
        await this.cGenre.getProductGenres();
        this.cLottery = this.newC(CLottery);
        this.cReport = this.newC(CReport);
        this.cMedia = this.newC(CMedia);
        this.cPosts = this.newC(CPosts);
        this.cBrandDiscount = this.newC(CBrandDiscount);
        this.topKey = nav.topKey();

        // this.cBrandDiscount.openBrandDiscount();
        // this.cLottery.openLotteryProduct();
        // this.cReport.openPointsDist();
        // this.cReport.openProductViews();
        // this.cProduct.openCreationProduct();
        this.showMain();
    }

    showMain(initTabName?: string) {
        this.openVPage(VMain, initTabName);
    }

    renderUser(userId: number) {
        let val = this.userCache.getValue(userId);
        switch (typeof val) {
            case 'undefined':
            case 'number':
                return userId;
        };
        return val.name;
    }

    useUser(userId: number) {
        this.userCache.use(userId);
    }

    getPointProduct(id: number | BoxId): PointProduct {
        if (!id) return;
        if (typeof id === 'object') id = id.id;
        let product = this.cache.get(id);
        if (!product) {
            product = new PointProduct(this, id);
            this.cache.set(id, product);
        }
        return product;
    }
}
