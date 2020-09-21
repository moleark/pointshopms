import * as React from "react";
import { CMedia } from './CMedia';
import { VPage, Page, EasyTime, Tuid, FA, LMR, tv } from "tonva";
import { observer } from "mobx-react";
import { consts } from "consts";

export class VShowImg extends VPage<CMedia> {
    async open() {
        this.openPage(this.page);
    }

    private page = observer(() => {
        let { current } = this.controller;
        let { caption, author, template, $update } = current;
        let date = <span><EasyTime date={$update} /></span>;
        let isMe = Tuid.equ(author, this.controller.user.id);
        let right = isMe && <button className="btn btn-sm btn-success mr-2 align-self-center"><FA name="pencil-square-o" /></button>

        let divUser = this.controller.cApp.renderUser(author.id);
        return <Page header={this.t('editorpicture')} headerClassName={consts.headerClass} right={right}>
            <div className="p-3">
                <div className="small text-muted p-1">{this.t('title')}</div>
                <div className="mb-1 h6 px-3 py-2 bg-white">{caption}</div>
                <LMR className="mb-3 px-3 small text-black-50" right={date}>
                    {divUser}
                </LMR>
                <div className="small text-muted p-1">{this.t('describe')}</div>
                <div className="small text-muted p-1">{this.t('content')}</div>
                <div className="small text-muted p-1">{this.t('template')}</div>
                <div className="mb-3 px-3 py-2 bg-white h6">
                    {tv(template, (values) => <>{values.caption}</>, undefined, () => <small className="text-muted" >[无]</small>)}
                </div>
            </div>
        </Page>;
    })
}