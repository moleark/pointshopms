import * as React from 'react';
import { VPage, Page, SearchBox, Loading, Tuid } from "tonva";
import { CMedia } from "./CMedia";
import { observer } from 'mobx-react';
import { consts } from 'consts';

export class VPickImage extends VPage<CMedia> {
    async open() {
        this.openPage(this.page);
    }

    render(): JSX.Element {
        return <this.page />
    }

    private page = observer(() => {
        let { pageMedia, searchMadiaKey } = this.controller;

        let right = <SearchBox className="w-80 mt-2 mr-2"
            size='sm'
            onSearch={(key: string) => searchMadiaKey(key, 1)}
            placeholder={this.t('selectpicture')} />;

        let { items, loading } = pageMedia;
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
        return <Page header={this.t('selectpicture')} headerClassName={consts.headerClass} right={right}>
            <div className="mx-3">
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4">
                    {divItems}
                </div>
            </div>
        </Page>;
    })

    private itemClick = (item: any) => {
        this.controller.onPickedImage(item.id);
    };

    private renderItem = (item: any, index: number) => {
        let { caption, path, author } = item;
        let isMe = Tuid.equ(author, this.controller.user.id);
        console.log(isMe, 'item')

        let imgStyle = {
            backgroundImage: `url(${path})`,
        }
        let divImg = <div className="d-flex align-items-center bg-white rounded  cursor-pointer"
            onClick={(e) => this.itemClick(item)}>
            <div className="w-100 h-100 bg-center-img h-min-12c" style={imgStyle}>
            </div>
        </div>;

        return <div key={index} className="col px-3 py-2 border-bottom border-dark" >
            <div className="text-info bg-light p-2 d-flex text-nowrap cursor-pointer border-bottom">
                <div className="d-flex flex-fill" >
                    <div className="overflow-hidden flex-fill small">{caption}</div>
                </div>
            </div>
            {divImg}
            <div className="smallPath small my-2 text-muted cursor-pointer position-relative">
                <span>{path}</span>
                <small className="position-absolute text-muted" style={{ right: 0, bottom: 0 }}></small>
            </div>
        </div>;

    }
}