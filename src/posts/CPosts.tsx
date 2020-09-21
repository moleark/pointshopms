import * as React from "react";
import _ from "lodash";
import { CUqBase } from "../CBase";
import { observable } from "mobx";
import { QueryPager, } from "tonva";

import { MadiaType } from "configuration";

/* eslint-disable */
export class CPosts extends CUqBase {
    @observable pagePosts: QueryPager<any>;
    @observable pageMedia: QueryPager<any>;

    protected async internalStart(param: any) { }

    onScrollBottom = async () => {
        await this.pagePosts.more();
    };

    searchMadiaKey = async (key: string) => {
        this.pageMedia = new QueryPager(this.uqs.webBuilder.SearchImage, 15, 30);
        this.pageMedia.first({ key: key, types: MadiaType.IAMGE });
    };

    onPickedImage = (id: number) => {
        this.closePage();
        this.returnCall(this.uqs.webBuilder.Image.boxId(id));
    };
}