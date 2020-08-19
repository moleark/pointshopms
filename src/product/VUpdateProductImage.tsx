import * as React from 'react';
import { VPage, ImageUploader } from 'tonva';
import { CProduct } from 'product/CProduct';

export class VUpdateProductImage extends VPage<CProduct>{
    private label: string = '图片上传';
    async open(param?: any) {
        if (param !== undefined) this.label = typeof param === 'string' ? param : param.topic;
        new Promise<any>((resolve, reject) => {
            this.openPage(this.page, { resolve: resolve, reject: reject });
        }).then(async (imgUrl) => {
            let { updatedProductImage } = this.controller;
            switch (this.label) {
                case '更新图片':
                    await updatedProductImage(imgUrl);
                    break;
                default:
                    break;
            }
        })
    }
    private page = (props: { resolve: (value: any) => void, reject: (resean?: any) => void }) => {
        let { resolve } = props;
        return <ImageUploader
            label={this.label}
            onSaved={(resId): Promise<void> => { resolve(resId); return; }}
        />
    }
}
