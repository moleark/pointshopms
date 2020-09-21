import * as React from "react";
import { consts } from "consts";
import { CMedia } from "./CMedia";
import { observer } from "mobx-react";
import { VPage, Page, SearchBox, List } from "tonva";
import copy from 'copy-to-clipboard';

export class VFile extends VPage<CMedia> {
    async open() {
        this.openPage(this.page)
    }

    private page = observer(() => {

        let { pageFile, searchMadiaKey, addAddFile, onScrollBottom } = this.controller;

        let right = <div className="w-19c d-flex">
            <SearchBox className="w-80 mt-1 mr-2" size='sm' onSearch={(key: string) => searchMadiaKey(key, 2)} placeholder={this.t('搜索文件')} />
            <div onClick={addAddFile}>
                <span className="ml-2 iconfont icon-jiahao1 mr-2"
                    style={{ fontSize: "26px", color: "white" }}>
                </span>
            </div>
        </div>;

        let none = (
            <div className="my-3 mx-2">
                <span className="text-muted small">[{this.t('noposts')}]</span>
            </div>
        );

        return <Page header={this.t('文件')} headerClassName={consts.headerClass} right={right} onScrollBottom={onScrollBottom}>
            <List before={""} none={none} items={pageFile} item={{ render: this.renderItem }} />
        </Page>;
    })


    private copyClick = (e: any, path: any) => {
        let el = e.target as HTMLElement;
        let innerHTML = el.innerHTML;
        copy(path);
        el.innerHTML = '<div class="text-center text-danger samll"><small>' + this.t('copysuccess') + '</small></div>';
        setTimeout(() => {
            el.innerHTML = innerHTML;
        }, 1000);

    }

    private preview = (path: any) => {
        window.open(path, '_blank')
    }

    private renderItem = (item: any, index: number) => {
        let { delFile, editFile } = this.controller;
        let { caption, path, id, types } = item;
        let icon = types.id === 2 ? "iconfont icon-PDF mx-3" : "iconfont icon-shipin mx-3";
        return <div key={index} className="row py-2 cursor-pointer">
            <div className="col-10 d-flex" onClick={() => this.preview(item.path)}>
                <div className={icon} style={{ fontSize: "35px" }}></div>
                <div>
                    <div className="mr-3 strong">{caption}</div>
                    <div className="small">{path}</div>
                </div>
            </div>
            <div className="col-2 pt-2">
                <span className="iconfont icon-xiugai1 mx-2" onClick={() => editFile(id)}></span>
                <span className="iconfont icon-shanchu mx-2" onClick={() => delFile(id)}></span>
                <span onClick={(e) => this.copyClick(e, path)}> {this.t('copy')}</span>
            </div>
        </div >
    }

}
