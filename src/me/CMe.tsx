import { CUqBase } from '../CBase';
import { VMe } from './VMe';
import { QueryPager } from 'tonva';
import { observable } from 'mobx';

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

    tab = () => this.renderView(VMe);
}