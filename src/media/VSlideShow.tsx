import * as React from "react";
import { CMedia } from './CMedia';
import { VPage, Page, FA, Loading } from "tonva";
import { observer } from "mobx-react";
import { consts } from "consts";

export class VSlideShow extends VPage<CMedia> {
    async open() {
        this.openPage(this.page);
    }

    private page = observer(() => {

        let { pageSlideShow, pickImage } = this.controller;
        let right = <span onClick={pickImage} className="mx-2 iconfont icon-jiahao1 cursor-pointer" style={{ fontSize: "1.7rem", color: "white" }}></span>
        let { items, loading } = pageSlideShow;
        let divItems: any;
        if (!items) {
            divItems = (loading === true) ?
                <div className="m-5"><Loading /></div>
                :
                <div className="my-3 mx-2 text-warning">
                    <span className="text-primary" >{this.t('nopicture')}</span>
                </div>;
        } else {
            divItems = items.map((v, index) => {
                return this.renderItem(v, index);
            });
        }

        return <Page header={this.t('轮播图')} headerClassName={consts.headerClass} right={right}>
            <div className="mx-3">
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4">
                    {divItems}
                </div>
            </div>
        </Page>;
    })


    private preview = (path: any) => {
        window.open(path, '_blank')
    }


    private renderItem = (item: any, index: number) => {
        let { delSlideShow, showEditSlideShow } = this.controller;

        let { caption, path, image, sort, types } = item;
        let imgStyle = {
            backgroundImage: `url(${path})`,
        }
        let type = types ? "是" : "否";
        let divImg = <div className="d-flex align-items-center bg-white rounded  cursor-pointer"
            onClick={() => this.preview(item.path)}>
            <div className="w-100 h-100 bg-center-img h-min-12c " style={imgStyle}>
            </div>
        </div>;

        return <div key={index} className="col px-3 py-2 border-bottom border-dark">
            <div className="text-info bg-light p-2 d-flex text-nowrap cursor-pointer border-bottom">
                <div className="d-flex flex-fill"  >
                    <div className="overflow-hidden flex-fill small">{caption}</div>
                    <div className="iconfont icon-shanchu pl-1" onClick={() => delSlideShow(image)} ></div>
                </div>
            </div>
            {divImg}
            <div className="text-info bg-light p-2 d-flex text-nowrap cursor-pointer border-bottom">
                <div className="d-flex  flex-fill smallPath small my-2  text-primary cursor-pointer position-relative">
                    <div className="overflow-hidden flex-fill small px-3">发布：{type}</div>
                    <div className="overflow-hidden flex-fill small px-3">排序：{sort}</div>
                    <div onClick={() => showEditSlideShow(item)}><FA name="edit" /></div>
                </div>
            </div>
        </div>;

    }
}