import * as React from 'react';
import { VPage, TabCaptionComponent, Page } from 'tonva';
import { CPointMallApp } from 'CPointMallApp';

const color = (selected: boolean) => selected === true ? 'text-primary' : 'text-muted';

export class VMain extends VPage<CPointMallApp> {
    async open(param?: any) {
        this.openPage(this.render);
    }
    render = (param?: any): JSX.Element => {
        let { cMe, cProduct, cPointProduct } = this.controller;
        let faceTabs = [
            { name: 'home', label: '首页', icon: 'home', content: cProduct.tab, notify: undefined },
            { name: 'me', label: '积分商品', icon: 'diamond', content: cPointProduct.tab },
            { name: 'me', label: '我的', icon: 'user', content: cMe.tab }
        ].map(v => {
            let { name, label, icon, content, notify } = v;
            return {
                name: name,
                caption: (selected: boolean) => TabCaptionComponent(label, icon, color(selected)),
                content: content,
                notify: notify,
            }
        });
        return <Page header={false} tabsProps={{ tabs: faceTabs }}>
        </Page >;
    }
}