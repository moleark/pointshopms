import * as React from 'react';
import { nav, Page, Image, VPage } from 'tonva';
import { Prop, IconText, FA, PropGrid, LMR } from 'tonva';
import { observer } from 'mobx-react';
import { EditMeInfo } from './EditMeInfo';
import { CMe } from './CMe';
import { appConfig } from 'configuration';

export class VMe extends VPage<CMe> {

    async open(param?: any) {

    }

    private exit() {
        nav.showLogout();
    }

    private changePassword = async () => {
        await nav.changePassword();
    }

    private openProuctGenre = async () => {
        await this.controller.openProductGenre();
    }

    private openLottery = async () => {
        await this.controller.openLottery();
    }

    private openProductViews = async () => {
        let { cApp } = this.controller;
        let { cReport } = cApp;
        await cReport.openProductViews();
    }

    private openPointsDist = async () => {
        let { cApp } = this.controller;
        let { cReport } = cApp;
        await cReport.openPointsDist();
    }

    private meInfo = observer(() => {
        let { user } = nav;
        if (user === undefined) return null;
        let { id, name, nick, icon } = user;
        return <LMR className="py-2 cursor-pointer w-100"
            left={<Image className="w-3c h-3c mr-3" src={icon} />}
            right={<FA className="align-self-end" name="angle-right" />}
            onClick={() => {
                this.openVPage(EditMeInfo);
            }}>
            <div>
                <div>{userSpan(name, nick)}</div>
                <div className="small"><span className="text-muted">ID:</span> {id > 10000 ? id : String(id + 10000).substr(1)}</div>
            </div>
        </LMR>;
    });

    render() {
        const { user } = nav;
        let aboutRows: Prop[] = [
            '',
            {
                type: 'component',
                component: <div className="w-100 d-flex justify-content-between">
                    <IconText iconClass="text-info mr-2" icon="smile-o" text="关于本APP" />
                    <div className="py-2 small">V{appConfig.version}</div>
                </div>,
            }
        ];

        let rows: Prop[];
        if (user === undefined) {
            rows = aboutRows;
            rows.push(
                {
                    type: 'component',
                    component: <button className="btn btn-success w-100 my-2" onClick={() => nav.showLogin(undefined, true)}>
                        <FA name="sign-out" size="lg" /> 请登录
                    </button>
                },
            );
        }
        else {
            let logOutRows: Prop[] = [
                '',
                {
                    type: 'component',
                    bk: '',
                    component: <button className="btn btn-danger w-100" onClick={this.exit}>
                        <FA name="sign-out" size="lg" /> 退出登录
                </button>
                },
            ];

            rows = [
                '',
                {
                    type: 'component',
                    component: <this.meInfo />
                },
                '',
                {
                    type: 'component',
                    component: <IconText iconClass="text-info mr-2" icon="th-large" text="商品类型" />,
                    onClick: this.openProuctGenre
                },
                {
                    type: 'component',
                    component: <IconText iconClass="text-info mr-2" icon="life-ring" text="抽奖商品" />,
                    onClick: this.openLottery
                },
                '',
                {
                    type: 'component',
                    component: <IconText iconClass="text-info mr-2" icon="eye" text="商品浏览量" />,
                    onClick: this.openProductViews
                },
                {
                    type: 'component',
                    component: <IconText iconClass="text-info mr-2" icon="cubes" text="客户积分分布" />,
                    onClick: this.openPointsDist
                },
                '',
                {
                    type: 'component',
                    component: <IconText iconClass="text-info mr-2" icon="key" text="修改密码" />,
                    onClick: this.changePassword
                },
            ]
            rows.push(...aboutRows, ...logOutRows);
        }
        return <Page header="我的">
            <PropGrid rows={[...rows]} values={{}} />
        </Page>
    }
}


function userSpan(name: string, nick: string): JSX.Element {
    return nick ?
        <><b>{nick} &nbsp; <small className="muted">{name}</small></b></>
        : <b>{name}</b>
}