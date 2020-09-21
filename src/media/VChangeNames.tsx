import * as React from 'react';
import { VPage, Form, UiSchema, Schema, Page, Edit, ItemSchema, List } from "tonva";
import { observer } from 'mobx-react';
import { consts } from 'consts';
import { CMedia } from './CMedia';
import { observable } from 'mobx';

export class VChangeNames extends VPage<CMedia> {

    private form: Form;
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
        console.log(id, 'id')
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
    render(): JSX.Element {
        return <this.page />
    }


    setSlideShow = async () => {
        let { current, updateSlideShow } = this.controller;
        this.showTips = "";
        setTimeout(() => {
            this.showTips = "none";
        }, 2000);
        await updateSlideShow(current.id, undefined, undefined, undefined, 0, 1)
    }

    private page = observer(() => {
        let { current, showPickCat, pageImageCat } = this.controller;
        let right = <div>
            <button type="button"
                className="btn btn-sm btn-success mr-3"
                onClick={this.setSlideShow} >{this.t('设为轮播图')}
            </button>
            <button type="button"
                className="btn btn-sm btn-success mr-3"
                onClick={() => showPickCat("0")} >{this.t('分类')}
            </button>
            <button type="button"
                className="btn btn-sm btn-success mr-3"
                onClick={this.onClickSaveButton} >{this.t('submit')}
            </button>
        </div >;
        return <Page header={this.t('editorpicture')}
            right={right}
            headerClassName={consts.headerClass}>
            <div className="mx-3 py-2 h-100 d-flex flex-column">
                <Edit data={current}
                    schema={this.schema}
                    uiSchema={this.uiSchema}
                    onItemChanged={this.onItemChanged}
                />
                <div className="py-2 my-1 text-primary" >
                    <strong>类型</strong>
                </div>
                <List before={""} none={"无"} items={pageImageCat} item={{ render: this.renderItem }} />
            </div>
            <div className="w-100 text-center">
                <div className="text-center text-white small px-2" style={{ width: '20%', margin: '-30rem auto 0 auto', padding: '4px', borderRadius: '3px', backgroundColor: '#505050', display: this.showTips }}>设置完成</div>
            </div>
        </Page>
    })

    private renderItem = (item: any, index: number) => {
        let { delImageCat } = this.controller
        let { name, id } = item
        return (
            <div className="pl-2 pl-sm-3 pr-2 pr-sm-3 py-2 d-flex">
                <div className="d-flex flex-fill mx-2"  >
                    <span>{name}</span>
                </div>
                <div>
                    <span className="text-danger" onClick={() => delImageCat(id)}>
                        <span className="iconfont icon-shanchu pl-1"></span>
                    </span>
                </div>
            </div>
        );
    };
}