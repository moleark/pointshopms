import { Tuid, Map, Query, Action, Sheet, Book } from "tonva";

export interface UqProduct {
    ProductX: Tuid;
    PriceX: Map;
    AgentPrice: Map;
    ProductChemical: Map;
    Brand: Tuid;
    Stuff: Tuid;
    GetRootCategory: Query;
    GetRootCategories: Query;
    GetChildrenCategory: Query;
    SearchProduct: Query;
    SearchProductByCategory: Query;
    GetFutureDeliveryTime: Query;
    SearchPointProduct: Query;
}

export interface UqCommon {
    SalesRegion: Tuid;
    Language: Tuid;
    Address: Tuid;
    InvoiceType: Tuid;
    GetCountryProvinces: Query;
    GetProvinceCities: Query;
    GetCityCounties: Query;
}

export interface UqWebUser {
    WebUser: Tuid;
    WebUserContact: Map;
    WebUserSetting: Map;
    WebUserCustomer: Map;
    WebUserContacts: Map;
    getPendingAuditUser: Query;
    auditPendingUser: Action;
    AuditPendingUserRefuseReason: Tuid;
    auditPendingUserRefuse: Action;
    WebUserBuyerAccount: Map;
    SearchHavingAuditUser: Query;
    SearchHavingRefuseUser: Query;
}



export interface UqPointShop {
    PointBook: Book;
    getPoints: Query;
    Genre: Tuid;
    PointProductGenre: Map;
    PointExchangeSheet: Sheet;
    GetPointProduct: Query;
    PointProduct: Map;
    PointProductLib: Tuid;
    PointProductSource: Map;
    PointProductHotStat: Book;
    SetPointProductVisits: Action;
    GetPointProductGenre: Query;
    PointProductVisitHistory: History;
    GetHotPointProducts: Query;
}

export interface UQs {
    product: UqProduct;
    common: UqCommon;
    webuser: UqWebUser;
    积分商城: UqPointShop;
}
