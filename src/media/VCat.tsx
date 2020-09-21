import * as React from "react";
import { consts } from "consts";
import { CMedia } from "./CMedia";
import { observer } from "mobx-react";
import { VPage, Page, List } from "tonva";
import { observable } from "mobx";

export class VCat extends VPage<CMedia> {
    @observable capton: any;
    @observable pageCat: any;
    async open(param: any) {
        this.pageCat = param.pageCat;
        this.capton = param.name;
        this.openPage(this.page);
    }

    private page = observer(() => {
        return <Page header={this.capton} headerClassName={consts.headerClass}
            onScrollBottom={this.onScrollBottom}>
            <List before={""} items={this.pageCat} item={{ render: this.renderItem }} />
        </Page>;
    })

    private onScrollBottom = async () => {
        await this.controller.pageMedia.more();
    }
    private renderItem = (item: any, index: number) => {
        let { name, id } = item;
        return (
            <div className="pl-2 pl-sm-3 pr-2 pr-sm-3 py-3 d-flex ">
                <div className="mx-2 w-50 small" >
                    <span>{name}</span>
                </div>
                <div className="w-25 text-right w-7c" onClick={() => this.controller.showCatImage(id)} >
                    <span className="p-2 small pl-4 text-primary cursor-pointer">
                        图 片
                </span>
                </div>
                <div className="w-25  text-right w-7c" onClick={() => this.controller.showCat(item)} >
                    <span className="p-2 small pl-4 text-primary cursor-pointer iconfont icon-jiantouyou" style={{ fontSize: "12px" }}>
                    </span>
                </div>
            </div >
            /* <div className="pl-2 pl-sm-3 pr-2 pr-sm-3 pt-2 pb-3 d-flex">
                 <div className="d-flex flex-fill mx-2"  >
                     <span>{name}</span>
                 </div>
                 <div className="d-flex">
                     <div >
                         <button className="btn btn-outline-info mx-2 px-3" onClick={() => this.controller.showCatImage(id)}>
                             图片
                         </button>
                     </div>
                     <div className="small d-flex cursor-pointer text-primary text-right w-7c ">
                         <button className="btn btn-outline-info mx-2 px-3" onClick={() => this.controller.showCat(item)}>
                             下一级
                         </button>
                     </div>
                 </div>
             </div >*/
        );
    };

}
