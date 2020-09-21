import * as React from "react";
import { consts } from "consts";
import { CMedia } from "./CMedia";
import { observer } from "mobx-react";
import { VPage, Page, SearchBox, Loading, FA, Tuid } from "tonva";
import copy from 'copy-to-clipboard';

export class VCatImage extends VPage<CMedia> {

    private cat: any
    async open(param: any) {
        this.cat = param;
        this.openPage(this.page)
    }

    private page = observer(() => {
        let { pageCatImage, searchCatImage, onAddClick } = this.controller;
        let right = <div className="w-19c d-flex">
            <SearchBox className="w-80 mt-1 mr-2"
                size='sm'
                onSearch={(key: string) => searchCatImage(key, this.cat)}
                placeholder={this.t('searchpicture')} />
            <div onClick={onAddClick}>
                <span className="ml-2 iconfont icon-jiahao1 mr-2"
                    style={{ fontSize: "26px", color: "white" }}>
                </span>
            </div>
        </div>;
        let { items, loading } = pageCatImage;
        let divItems: any;
        if (!items) {
            divItems = (loading === true) ?
                <div className="m-5"><Loading /></div>
                :
                <div className="my-3 mx-2 text-warning">
                    <span className="text-primary" >{this.t('nopicture')}</span>
                </div>;
        }
        else {
            divItems = items.map((v, index) => {
                return this.renderItem(v, index);
            });
        }
        return <Page header={this.t('picture')} headerClassName={consts.headerClass} right={right} onScrollBottom={this.onScrollBottom}>
            <div className="mx-3">
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4">
                    {divItems}
                </div>
            </div>
        </Page>;
    })

    private onScrollBottom = async () => {
        await this.controller.pageMedia.more();
    }

    private copyClick = (e: any, path: any) => {
        let el = e.target as HTMLElement;
        let innerHTML = el.innerHTML;
        copy(path);
        el.innerHTML = '<div class="text-center text-danger w-100"> <span style="color:transparent">- - - - - -</span> url ' + this.t('copysuccess') + '<span style="color:transparent">- - - - - -</span> </div>';
        setTimeout(() => {
            el.innerHTML = innerHTML;
        }, 1000);
        //alert(this.t('copysuccess'))
    }

    private preview = (path: any) => {
        window.open(path, '_blank')
    }

    private renderItem = (item: any, index: number) => {
        let { onRem } = this.controller;
        let { caption, path, id, author } = item;
        let isMe = Tuid.equ(author, this.controller.user.id);
        console.log(isMe, 'item')
        let { onimgNames } = this.controller
        let imgStyle = {
            backgroundImage: `url(${path})`,
        }
        //let right = <div className="border p-1"><img className="h-4c w-4c" src={path} /></div>;

        let divImg = <div className="d-flex align-items-center bg-white rounded  cursor-pointer"
            onClick={() => this.preview(item.path)}>
            <div className="w-100 h-100 bg-center-img h-min-12c" style={imgStyle}>
            </div>
        </div>;
        if (isMe) {
            return <div key={index} className="col px-3 py-2 border-bottom border-dark">
                <div className="text-info bg-light p-2 d-flex text-nowrap cursor-pointer border-bottom">
                    <div className="d-flex flex-fill" onClick={() => onimgNames(id)} >
                        <div className="overflow-hidden flex-fill small">{caption}</div>
                        <div className=""><FA name="edit" /></div>
                    </div>
                    <div className="iconfont icon-shanchu pl-1" onClick={() => onRem(id)}></div>
                </div>

                {divImg}
                <div className="smallPath small my-2 text-muted cursor-pointer position-relative"
                    onClick={(e) => this.copyClick(e, path)}>
                    <span>{path}</span>
                    <small className="position-absolute text-muted" style={{ right: 0, bottom: 0 }}>{this.t('copy')}</small>
                </div>
            </div>;

        }
        return <div key={index} className="col px-3 py-2 border-bottom border-dark">
            <div className="text-info bg-light p-2 d-flex text-nowrap cursor-pointer border-bottom">
                <div className="d-flex flex-fill" onClick={() => onimgNames(id)} >
                    <div className="overflow-hidden flex-fill small">{caption}</div>
                    <div className=""><FA name="edit" /></div>
                </div>
            </div>

            {divImg}
            <div className="smallPath small my-2 text-muted cursor-pointer position-relative"
                onClick={(e) => this.copyClick(e, path)}>
                <span>{path}</span>
                <small className="position-absolute text-muted" style={{ right: 0, bottom: 0 }}>{this.t('copy')}</small>
            </div>
        </div>;

    }
}
