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
    GetPointProductMoreBySource: Query;
}
export interface UqHr {
    employee: Tuid;
    SearchEmployeeByid: Query;
    SearchTeam: Query;
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

export interface WebBuilder {
    Image: Tuid;
    SearchImage: Query;
    ImageCat: Map;
    SearchImageCat: Query;
    SearchCatImage: Query;
    SearchCat: Query;
    UpdateSlideShow: Action;
    DeleteSlideShow: Action;
    SearchSlideShow: Query;
}

export interface UqPointShop {
    PointBook: Book;
    getPoints: Query;
    Genre: Tuid;
    PointProductGenre: Map;
    PointProductGenreDelete: Action;
    PointExchangeSheet: Sheet;
    GetPointProduct: Query;
    PointProduct: Map;
    PointProductLib: Tuid;
    PointProductSource: Map;
    PointProductDetail: Map;
    PointProductHotStat: Book;
    SetPointProductVisits: Action;
    GetPointProductGenre: Query;
    PointProductVisitHistory: History;
    GetHotPointProducts: Query;
    GetPointDistribution: Query;
    GetMaxPoints: Query;
    GetVisitPointProducts: Query;
    GetPointProductBySource: Query;
    GetPointProductsByPage: Query;
}

export interface UQs {
    hr: UqHr;
    product: UqProduct;
    common: UqCommon;
    webuser: UqWebUser;
    webBuilder: WebBuilder;
    积分商城: UqPointShop;
}
