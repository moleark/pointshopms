import * as React from "react";
import { consts } from "consts";
import { CMedia } from "./CMedia";
import { observer } from "mobx-react";
import { VPage, UiSchema, Schema, UiInputItem, Page, Form, Context } from "tonva";
import { observable } from "mobx";
/* eslint-disable */
export class VEditSlideShow extends VPage<CMedia> {
    @observable private media: any;
    private form: Form;
    async open(media: any) {
        this.media = media;
        this.openPage(this.page);
    }

    private onAdd = async () => {
        if (!this.form) return;
        await this.form.buttonClick("submit");
    }

    private onFormButtonClick = async (name: string, context: Context) => {
        this.closePage(1);
        let { caption, description, src, types, sort } = context.form.data;
        await this.controller.updateSlideShow(this.media.image.id, caption, description, src, types, sort);
    }

    private uiSchema: UiSchema = {
        items: {
            caption: { widget: 'text', label: this.t('标题') } as UiInputItem,
            description: { widget: 'text', label: this.t('说明') } as UiInputItem,
            src: { widget: 'text', label: this.t('链接') } as UiInputItem,
            types: { widget: 'checkbox', label: this.t('是否发布') } as UiInputItem,
            sort: { widget: 'updown', label: this.t('排序') } as UiInputItem,
            submit: { widget: 'button', label: this.t('submit') }
        }
    };

    private schema: Schema = [
        { name: 'caption', type: 'string', required: true },
        { name: 'description', type: 'string', required: true },
        { name: 'src', type: 'string', required: true },
        { name: 'types', type: 'string', required: true },
        { name: 'sort', type: 'string', required: true },
    ];

    private page = observer(() => {

        let right = <button type="button" onClick={this.onAdd} className="btn btn-sm btn-success mr-3">{this.t('submit')}</button>;
        return <Page header={this.t('editorpicture')} headerClassName={consts.headerClass} right={right}>
            <div className="mx-3">
                <Form ref={v => this.form = v} className="my-3"
                    formData={this.media}
                    schema={this.schema}
                    uiSchema={this.uiSchema}
                    onButtonClick={this.onFormButtonClick}
                    requiredFlag={true}
                />
            </div>
        </Page>
    })
}