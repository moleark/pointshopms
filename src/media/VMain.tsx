import * as React from "react";
import { consts } from "consts";
import { CMedia } from "./CMedia";
import { observer } from "mobx-react";
import { VPage, Page, SearchBox, Loading, FA, Tuid, LMR } from "tonva";
import copy from 'copy-to-clipboard';

export class VMain extends VPage<CMedia> {
    async open() {
        this.openPage(this.page);
    }

    render(member: any): JSX.Element {
        return <this.page />
    }

    private page = observer(() => {
        let { pageMedia, searchMadiaKey, onAddClick, showCat, showSlideShow, showOtherMedia, onScrollBottom } = this.controller;
        let right = <div className="w-19c d-flex">
            <SearchBox className="w-80 mt-1 mr-2"
                size='sm'
                onSearch={(key: string) => searchMadiaKey(key, 1)}
                placeholder={this.t('searchpicture')} />
            <div onClick={onAddClick}>
                {/* <span className="mx-2 iconfont icon-jiahao1 "
                    style={{ fontSize: "26px", color: "white" }}>
                </span> */}
                <FA name="plus-square-o" size="2x" className="mt-1 mr-2" />
            </div>
        </div>;
        let { items, loading } = pageMedia;
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

        return <Page header={this.t('其他文件')} headerClassName={consts.headerClass} right={right}
            onScrollBottom={onScrollBottom}>

            <LMR className="bg-white py-3 my-1" right={<i className=" px-2 iconfont icon-more"></i>} onClick={() => showCat({ name: "图片分类", id: 0 })} >
                <div className="mx-3 px-2 font-weight-bold">图片分类</div>
            </LMR>
            <LMR className="bg-white py-3 my-1" right={<i className=" px-2 iconfont icon-more"></i>} onClick={showSlideShow} >
                <div className="mx-3 px-2 font-weight-bold">轮播图</div>
            </LMR>
            <LMR className="bg-white py-3 my-1" right={<i className=" px-2 iconfont icon-more"></i>} onClick={showOtherMedia} >
                <div className="mx-3 px-2 font-weight-bold">其他文件</div>
            </LMR>

            <div className="mx-3">
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4">
                    {divItems}
                </div>
            </div>
        </Page>;
    })


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
                <div className="smallPath small my-2 text-muted cursor-pointer"
                    onClick={(e) => this.copyClick(e, path)}>
                    <span>{path}</span>
                    <span><small className=" text-muted float-right" >{this.t('copy')}</small></span>
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
            <div className="smallPath small my-2 text-muted cursor-pointer "
                onClick={(e) => this.copyClick(e, path)}>
                <span>{path}</span>
                <span><small className=" text-muted float-right" >{this.t('copy')}</small></span>
            </div>
        </div>;

    }
}
/*
<button
style={{ fontWeight: 550, padding: '0 5px', fontSize: '12px' }}
className="mt-2 btn btn-outline-primary"
onClick={this.copyClick}>
{this.t('copy')}
</button >
*/