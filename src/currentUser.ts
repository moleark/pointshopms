import { User } from 'tonva';
import { BoxId } from 'tonva';
import { observable } from 'mobx';
import { UQs } from './uqs';

export class WebUser {

    id: number;
    name: string;
    nick?: string;
    icon?: string;
    guest: number;
    token: string;

    @observable firstName: string;
    gender: string;
    salutation: string;
    @observable organizationName: string;
    departmentName: string;

    telephone: string;
    @observable mobile: string;
    email: string;
    fax: string;
    address: BoxId;
    addressString: string;
    zipCode: string;
    private _user: User;

    private webUserSettings: any;

    private uqs: UQs;


    constructor(uqs: UQs) {// cUsqWebUser: CUq, cUsqCustomer: CUq) {
        this.uqs = uqs;
    }

    setUser = async (user: User) => {
        if (user !== undefined) {
            this._user = user;
            this.id = user.id;
            this.name = user.name;
            this.nick = user.nick;
            this.icon = user.icon;
            this.guest = user.guest;
            this.token = user.token;

            await this.loadWebUser();
        }
    }

    private async loadWebUser() {
        let { id, _user } = this;
        if (_user !== undefined) {
            let webUser = await this.uqs.webuser.WebUser.load(id);
            if (webUser) {
                let { firstName, gender, salutation, organizationName, departmentName } = webUser;
                this.firstName = firstName;
                this.gender = gender;
                this.salutation = salutation;
                this.organizationName = organizationName;
                this.departmentName = departmentName;
            }
            let contact = await this.uqs.webuser.WebUserContact.obj({ webUser: this.id });
            if (contact) {
                let { telephone, mobile, email, fax, address, addressString, zipCode } = contact;
                this.telephone = telephone;
                this.mobile = mobile;
                this.email = email;
                this.fax = fax;
                this.address = address;
                this.addressString = addressString;
                this.zipCode = zipCode;
            }
            this.webUserSettings = await this.uqs.webuser.WebUserSetting.obj({ webUser: this.id }) || { webUser: this.id };
        }
    }

    get isLogined(): boolean {
        return this._user !== undefined;
    }

    async getContacts(): Promise<any[]> {
        return await this.uqs.webuser.WebUserContacts.table({ webUser: this.id });
    }

    async addContact(contactId: number) {
        await this.uqs.webuser.WebUserContacts.add({ webUser: this.id, arr1: [{ contact: contactId }] });
    }

    async delContact(contactId: number) {
        await this.uqs.webuser.WebUserContacts.del({ webUser: this.id, arr1: [{ contact: contactId }] });
    }

    async getSetting() {
        return this.webUserSettings;
    }

    async setDefaultShippingContact(contactId: BoxId) {
        this.webUserSettings.shippingContact = contactId;
        this.saveDefaultSettings();
    }

    async setDefaultInvoiceContact(contactId: BoxId) {
        this.webUserSettings.invoiceContact = contactId;
        this.saveDefaultSettings();
    }

    async setDefaultInvoice(invoiceTypeId: BoxId, invoiceInfoId: BoxId) {
        this.webUserSettings.invoiceType = invoiceTypeId;
        this.webUserSettings.invoiceInfo = invoiceInfoId;
        this.saveDefaultSettings();
    }

    async saveDefaultSettings() {
        await this.uqs.webuser.WebUserSetting.add(this.webUserSettings);
    }


    async changeWebUser(webUser: any) {
        await this.uqs.webuser.WebUser.save(this.id, webUser);
        await this.loadWebUser();
    }

    async changeWebUserContact(webUserContact: any) {
        webUserContact.webUser = this.id;
        await this.uqs.webuser.WebUserContact.add(webUserContact);
        await this.loadWebUser();
    }
};

