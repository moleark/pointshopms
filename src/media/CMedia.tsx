import * as React from "react";
import _ from "lodash";
import { CUqBase } from "../CBase";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { VMain } from "./VMain";
import { QueryPager } from "tonva";
import { VShowImg } from "./VShowImg";
import { VEdit } from "./VEdit";
import { VChangeNames } from "./VChangeNames";
import { VCat } from "./VCat";
import { VPickCat } from "./VPickCat";
import { VCatImage } from "./VCatImage";
import { VSlideShow } from "./VSlideShow";
import { VPickImage } from "posts/VPickImage";
import { VEditSlideShow } from "./VEditSlideShow";
import { VFile } from "./VFile";
import { VAddFile } from "./VAddFile";
import { MadiaType } from "configuration";
import { VFileEdit } from "./VFileEdit";

export class CMedia extends CUqBase {
    @observable pageMedia: QueryPager<any>;
    @observable current: any;

    @observable pageImageCat: QueryPager<any>;
    @observable pageCatImage: QueryPager<any>;
    @observable pageSlideShow: QueryPager<any>;
    @observable pageFile: QueryPager<any>;

    protected async internalStart(param: any) { }

    searchMadiaKey = async (key: string, types: number) => {
        this.pageMedia = new QueryPager(this.uqs.webBuilder.SearchImage, 15, 30);
        this.pageMedia.first({ key: key, types: types });
    };

    onScrollBottom = async () => {
        await this.pageMedia.more();
    }

    //添加文件
    saveItem = async (id: any, param: any) => {
        let { caption, path, types } = param;
        let pa = { caption: caption, path: path, author: this.user.id, isValid: 1, types: types };
        let ret = await this.uqs.webBuilder.Image.save(id, pa);
        if (types === MadiaType.IAMGE) {
            if (id) {
                let item = this.pageMedia.items.find(v => v.id === id);
                if (item !== undefined) {
                    _.merge(item, param);
                    item.$update = new Date();
                }
                this.current = item;
            } else {
                param.id = ret.id;
                param.$create = new Date();
                param.$update = new Date();
                this.pageMedia.items.unshift(param);
                this.current = param;
            }
            this.searchMadiaKey("", MadiaType.IAMGE);
        } else {
            this.searcFileKey("", MadiaType.NOTIMAGE);
        }

    };

    onAddClick = () => {
        this.current = undefined;
        this.openVPage(VEdit);
    };

    onimgNames = async (id: number) => {
        this.current = await this.uqs.webBuilder.Image.load(id);
        await this.searchImageCat(id);
        this.openVPage(VChangeNames);
    }

    render = observer(() => {
        return this.renderView(VMain);
    });

    showMedia = async (id: number) => {
        await this.searchImageCat(id);
        this.current = await this.uqs.webBuilder.Image.load(id);
        this.openVPage(VShowImg);
    };

    loadList = async () => {
        this.searchMadiaKey("", MadiaType.IAMGE);
    };

    onRem = async (id: number) => {
        this.current = await this.uqs.webBuilder.Image.save(id, { isValid: 0 });
        this.searchMadiaKey("", MadiaType.IAMGE);
    }

    //图片分类--PICK
    showPickCat = async (parent: string) => {
        let pageCat = new QueryPager(this.uqs.webBuilder.SearchCat, 15, 100);
        pageCat.first({ parent: parent });
        this.openVPage(VPickCat, pageCat)
    }

    onPickCat = async (image: any, cat: any) => {
        await this.uqs.webBuilder.ImageCat.add({ image: image, arr1: [{ cat: cat }] });
        await this.searchImageCat(image);
    }

    searchImageCat = async (image: any) => {
        this.pageImageCat = new QueryPager(this.uqs.webBuilder.SearchImageCat, 15, 30);
        this.pageImageCat.first({ image: image });
    };

    delImageCat = async (cat: any) => {
        await this.uqs.webBuilder.ImageCat.del({ image: this.current.id, arr1: [{ cat: cat }] });
        this.pageImageCat = new QueryPager(this.uqs.webBuilder.SearchImageCat, 15, 30);
        this.pageImageCat.first({ image: this.current.id });
    };

    //图片分类--SHOW
    showCat = async (param: any) => {
        let { id, name } = param
        let pageCat = new QueryPager(this.uqs.webBuilder.SearchCat, 15, 30);
        pageCat.first({ parent: param });
        let pageCats = { pageCat, id, name }
        this.openVPage(VCat, pageCats)
    }

    showCatImage = async (cat: any) => {
        await this.searchCatImage("", cat);
        this.openVPage(VCatImage, cat);
    }

    searchCatImage = async (key: any, cat: any) => {
        this.pageCatImage = new QueryPager(this.uqs.webBuilder.SearchCatImage, 15, 30);
        this.pageCatImage.first({ key: key, cat: cat });
    };


    //轮播图
    showSlideShow = async () => {
        await this.searchSlideShow();
        this.openVPage(VSlideShow);
    }

    searchSlideShow = () => {
        this.pageSlideShow = new QueryPager(this.uqs.webBuilder.SearchSlideShow, 15, 30);
        this.pageSlideShow.first({});
    }


    pickImage = async () => {
        this.searchMadiaKey("", MadiaType.IAMGE);
        return await this.vCall(VPickImage);
    };

    onPickedImage = async (image: any) => {
        this.closePage();
        await this.uqs.webBuilder.UpdateSlideShow.submit({ image: image, caption: undefined, description: undefined, src: undefined, types: 0, sort: 1 })
        await this.searchSlideShow();
    };

    delSlideShow = async (image: any) => {
        //await this.uqs.webBuilder.SlideShow.del({ image: image.id, arr1: [{}] })
        await this.uqs.webBuilder.DeleteSlideShow.submit({ _image: image.id });
        await this.searchSlideShow();
    }

    showEditSlideShow = (param: any) => {
        this.openVPage(VEditSlideShow, param);
    }
    updateSlideShow = async (image: any, caption: any, description: any, src: any, types: any, sort: any) => {
        let type = types ? 1 : 0;
        await this.uqs.webBuilder.UpdateSlideShow.submit({ image: image, types: type, caption: caption, description: description, src: src, sort: sort })
        await this.searchSlideShow();
    }

    //其他文件
    //搜索其他文件
    searcFileKey = async (key: string, types: number) => {
        this.pageFile = new QueryPager(this.uqs.webBuilder.SearchImage, 15, 30);
        this.pageFile.first({ key: key, types: types });
    };
    //显示其他文件列表
    showOtherMedia = async () => {
        await this.searcFileKey("", MadiaType.NOTIMAGE);
        this.openVPage(VFile);
    }
    //显示其他文件
    addAddFile = () => {
        this.openVPage(VAddFile);
    }
    //删除文件
    delFile = async (id: number) => {
        this.current = await this.uqs.webBuilder.Image.save(id, { isValid: 0 });
        await this.searchMadiaKey("", MadiaType.NOTIMAGE);
    };
    //编辑文件
    editFile = async (id: number) => {
        this.current = await this.uqs.webBuilder.Image.load(id);
        this.openVPage(VFileEdit);
    }


    tab = () => {
        return <this.render />;
    };

    openMainPage = async () => {
        await this.searchMadiaKey('', 1);
        this.openVPage(VMain);
    }
}
