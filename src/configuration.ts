import { AppConfig, env } from "tonva";
import { jnkTop } from "./me/loginTop";
import { tvs } from "tvs";

export const appConfig: AppConfig = {
    appName: '百灵威系统工程部/pointshopms',
    version: '1.0.3',
    tvs: tvs,
    loginTop: jnkTop,
    oem: '百灵威',
};

const GLOABLE_PRODUCTION = {
    CHINA: 44,
    CHINESE: 196,
    SALESREGION_CN: 1,
    TIPDISPLAYTIME: 3000,
    CONTENTSITE: "https://web.jkchemical.com",
    JD: 'https://joint.jkchemical.com/jd',
}

const GLOABLE_TEST = {
    CHINA: 43,
    CHINESE: 197,
    SALESREGION_CN: 4,
    TIPDISPLAYTIME: 3000,
    CONTENTSITE: "https://c.jkchemical.com/jk-web",
    // JD: 'http://localhost:3016/jd',
    JD: 'https://c.jkchemical.com/joint/jd',
}

// 生产配置
export const MadiaType = {
    IAMGE: 1,
    PDF: 2,
    VIDEO: 3,
    NOTIMAGE: 0
};

export const GLOABLE = env.testing === true ? GLOABLE_TEST : GLOABLE_PRODUCTION;