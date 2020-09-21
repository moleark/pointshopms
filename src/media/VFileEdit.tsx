import * as React from 'react';
import { VPage, UiSchema, Schema, Page, Edit, ItemSchema } from "tonva";
import { observer } from 'mobx-react';
import { consts } from 'consts';
import { CMedia } from './CMedia';
import { observable } from 'mobx';

export class VFileEdit extends VPage<CMedia> {

    @observable showTips: any = "none";
    async open() {
        this.openPage(this.page);
    }

    private onItemChanged = async (itemSchema: ItemSchema, newValue: any, preValue: any) => {
        let { name } = itemSchema;
        this.controller.current[name] = newValue;
    }
    private onClickSaveButton = async () => {
        let { current } = this.controller;
        let id = current && current.id;
        await this.controller.saveItem(id, current);
        this.closePage();
    }

    private uiSchema: UiSchema = {
        items: {
            caption: { widget: 'text', label: this.t('title') },
            submit: { widget: 'button', label: this.t('submit') }
        }
    };

    private schema: Schema = [
        { name: 'caption', type: 'string', required: true },
    ];

    private page = observer(() => {
        let { current } = this.controller;
        let right = <div>
            <button type="button"
                className="btn btn-sm btn-success mr-3"
                onClick={this.onClickSaveButton} >{this.t('submit')}
            </button>
        </div >;
        return <Page header={this.t('editorpicture')} headerClassName={consts.headerClass} right={right}>
            <div className="mx-3 py-2 h-100 d-flex flex-column">
                <Edit data={current} schema={this.schema} uiSchema={this.uiSchema} onItemChanged={this.onItemChanged} />
            </div>
        </Page>
    })

}