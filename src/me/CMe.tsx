import { CUqBase } from '../CBase';
import { VMe } from './VMe';
import { QueryPager } from 'tonva';
import { observable } from 'mobx';
import { CLottery } from 'pointShop/CLottery';
import { CGenre } from 'pointShop/CGenre';

export class CMe extends CUqBase {

    @observable pageHavingAudit: QueryPager<any>;
    @observable pageHavingRefuse: QueryPager<any>;

    protected async internalStart() {

    }

    async changeWebUser(webUser: any) {
        let { currentUser } = this.cApp;
        await currentUser.changeWebUser(webUser);
    }

    async changeWebUserContact(webUserContact: any) {
        let { currentUser } = this.cApp;
        await currentUser.changeWebUserContact(webUserContact);
    }

    /**
     * 商品类型
     */
    async openProductGenre() {
        let genreList = this.newC(CGenre);
        await genreList.start(false);
    }

    /**
     * 抽奖产品
     */
    async openLottery() {
        let lottery = this.newC(CLottery);
        await lottery.start();
    }

    tab = () => this.renderView(VMe);
}