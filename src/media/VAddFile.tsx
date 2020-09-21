import * as React from "react";
import _ from 'lodash';
import { consts } from "consts";
import { CMedia } from "./CMedia";
import { observer } from "mobx-react";
import { VPage, UiSchema, Schema, UiInputItem, Page, Form, Context, nav } from "tonva";
import { observable } from "mobx";
import { FileUploader } from "upLoader/upLoader";
import { MadiaType } from "configuration";
/* eslint-disable */
export class VAddFile extends VPage<CMedia> {

    @observable private media: any;
    @observable private mediaPath: string;
    private form: Form;
    private mediaType: any = MadiaType.PDF;

    async open(media: any) {
        this.media = media;
        this.openPage(this.page);
    }

    private onAddSalesTask = async (model: any) => {
        if (!this.form) return;
        await this.form.buttonClick("submit");
    }

    private get mediaId() { return this.media && this.media.id; }
    private getMediaPath(resId: string): string { return nav.resUrl + (resId.substr(1)) }

    private onFormButtonClick = async (name: string, context: Context) => {
        this.closePage(1);
        let param = _.clone(context.form.data);
        param.path = this.mediaPath;
        param.types = this.getFileExtension(param.path);
        await this.controller.saveItem(this.mediaId, param);
    }
    private getFileExtension = (path: any) => {
        var fileExtension = path.substring(path.lastIndexOf('.') + 1);
        if (fileExtension === "pdf") {
            return 2;
        } else {
            return 3;
        }
    }

    private uiSchema: UiSchema = {
        items: {
            caption: { widget: 'text', label: this.t('title') } as UiInputItem,
            submit: { widget: 'button', label: this.t('submit') }
        }
    };

    private schema: Schema = [
        { name: 'caption', type: 'string', required: true },
    ];

    private onSaved = (resId: string): Promise<void> => {
        this.mediaPath = this.getMediaPath(resId);
        this.closePage();
        return;
    }


    private onUploadFilePDF = () => {
        this.media = this.form.data;
        this.mediaType = MadiaType.PDF;
        this.openPageElement(<FileUploader onSaved={this.onSaved} />);
    }

    private page = observer(() => {
        let image: any;
        let saveButton: any;
        if (this.mediaPath) {
            image = <div className="m-3 text-center w-max-30c border"><img className="w-8c h-8c border" src={this.mediaPath} /></div>;
            saveButton = <div className="px-1 ">
                <div className="text-content text-center">
                    <button type="button" className="btn btn-primary mx-2 col-11" onClick={this.onAddSalesTask} >{this.t('save')}</button>
                </div>
            </div>;
        }
        else {
            image = <div className="text-content text-center">
                <button className="btn btn-primary mr-3" onClick={this.onUploadFilePDF}>{this.t('上传文件')}</button>
            </div>;
        }

        return <Page header={this.t('上传文件')} headerClassName={consts.headerClass}>
            <div className="mx-3">
                <Form ref={v => this.form = v} className="my-3"
                    formData={this.media}
                    schema={this.schema}
                    uiSchema={this.uiSchema}
                    onButtonClick={this.onFormButtonClick}
                    requiredFlag={true}
                />
            </div>
            {image}
            {saveButton}
        </Page>
    })
}