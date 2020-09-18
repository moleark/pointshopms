import * as React from 'react';
import { VPage, Page } from 'tonva';
import { CProduct } from 'product/CProduct';
import { observer } from 'mobx-react';


export class VPointProductPost extends VPage<CProduct>{
    textarea: HTMLTextAreaElement;


    async open(param?: any) {
        this.openPage(this.page, { type: param });
    }

    onSave = async () => {
        this.controller.htmlFragment = this.textarea.value;
        this.textarea.value = '';
        this.controller.closePage()
    }

    private page = observer((param) => {
        let { htmlFragment } = this.controller;
        let { type } = param;
        let header = `${type}帖文`;//https://cs.jkchemical.com/webbuilder/
        let right = <div>
            <button onClick={() => { document.location.href = "http://localhost:7799?type=otherfiles" }} type="button" className="btn btn-sm btn-success mr-3">图片</button>
            <button onClick={() => { this.onSave() }} type="button" className="btn btn-sm btn-success mr-3">保存</button>
        </div>;

        return <Page header={header} right={right}>
            <div className="mx-3 py-2 h-100 d-flex flex-column">
                <textarea ref={tt => this.textarea = tt} className="flex-fill mb-2" defaultValue={htmlFragment} rows={20} />
            </div >
        </Page >
    })
}
