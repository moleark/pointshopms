import * as React from 'react';
import { VPage, Page } from 'tonva';
import { CProduct } from 'product/CProduct';
import { observer } from 'mobx-react';


export class VPointProductPost extends VPage<CProduct>{
    textarea: HTMLTextAreaElement;

    async open(param?: any) {
        this.openPage(this.page);
    }

    onSave = async () => {
        if (this.textarea.value !== '') {
            let { onSavePointProductPost } = this.controller;
            await onSavePointProductPost(this.textarea.value)
        }
        // this.textarea.value = '';
    }

    private page = observer(() => {
        let { currentPostContent, postType, openPointProductPostShow, cApp } = this.controller;
        let { cMedia } = cApp
        let header = `${postType !== undefined ? postType : ''}帖文`;
        let right = <div>
            {currentPostContent && <button onClick={openPointProductPostShow} type="button" className="btn btn-sm btn-success mr-3">预览</button>}
            <button onClick={() => cMedia.openMainPage()} type="button" className="btn btn-sm btn-success mr-3">图片</button>
            {/* <button onClick={() => { document.location.href = "http://localhost:7799?type=otherfiles" }} type="button" className="btn btn-sm btn-success mr-3">图片</button> */}
            <button onClick={() => { this.onSave() }} type="button" className="btn btn-sm btn-success mr-3">保存</button>
        </div>;

        return <Page header={header} right={right}>
            <div ref={this.refIframe} className='py-1'>
                <textarea ref={tt => this.textarea = tt} className="w-100 h-100" defaultValue={currentPostContent} />
            </div >
            {/* <div className="mx-3 py-2 h-100 d-flex flex-column">
                <textarea ref={tt => this.textarea = tt} className="flex-fill mb-2" defaultValue={currentPostContent} rows={25} />
            </div > */}
        </Page >
    })

    private refIframe = (ifrm: HTMLIFrameElement) => {
        if (!ifrm) return;
        let article = ifrm.parentElement.parentElement;
        let header = (article.querySelector('section.tv-page-header') as HTMLElement);
        ifrm.style.height = (window.innerHeight - header.clientHeight) + 'px';
        article.parentElement.style.overflowY = 'hidden';
    }
}
