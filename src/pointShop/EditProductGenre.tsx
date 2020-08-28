import * as React from 'react';
import { VPage, Page, Form, Schema, UiSchema, Context, UiInputItem, FA, UiImageItem } from 'tonva';
import { CProduct } from 'product/CProduct';
import { productGenreValidation } from 'tools/inputValidations';
import { CGenre } from './CGenre';
// import { PointProductImage } from 'tools/productImage';
import { observer } from 'mobx-react';
const schema: Schema = [
    { name: 'id', type: 'id', required: false },
    { name: 'imageUrl', type: 'image', required: false },
    { name: 'name', type: 'string', required: true },
];

export class EditProductGenre extends VPage<CGenre>{
    private currentGenre: any;
    private form: Form;
    private uiSchema: UiSchema = {
        items: {
            id: { visible: false },
            imageUrl: { widget: 'image', label: '图标' } as UiImageItem,
            name: { widget: 'text', label: '类型', placeholder: '商品类型', rules: productGenreValidation } as UiInputItem,
            submit: { widget: 'button', label: '提交' },
        }
    }

    async open(param?: any) {
        this.currentGenre = param;
        this.openPage(this.page);
    }

    private onSaveGenre = async () => {
        if (!this.form) return;
        await this.form.buttonClick("submit");
    }

    private onFormButtonClick = async (name: string, context: Context) => {
        await this.controller.onSaveGenre(context.form.data);
    }

    private onDelGenre = async () => {
        if (await this.vCall(VConfirmDeleteGenre, this.currentGenre) === true) {
            await this.controller.delGenre(this.currentGenre);
            this.closePage();
        };
    }

    private page = observer(() => {
        // let { cApp } = this.controller;
        // let { cProduct } = cApp;
        let buttonDel: any = <></>;
        // let buttonDel: any = <button className="btn btn-sm btn-success mr-2" onClick={this.onDelGenre}>删除</button>;
        let footer = <button type="button" className="btn btn-primary w-100" onClick={this.onSaveGenre}>修改</button>;

        return <Page header="类型信息" footer={footer} right={buttonDel}>
            <div className="alert alert-warning m-0 py-1 small"><FA name="exclamation-circle" /> 点击图片区域即可更换图标</div>
            <div className="App-container container text-left">
                {/* <div className="d-flex flex-column">
                    <div className="w-75 m-auto"><PointProductImage chemicalId={iconUrl} className="w-100" /></div>
                    <button onClick={() => cProduct.openVUpdatePicture({ topic: '上传分类图标', genre: this.currentGenre })}
                        className="btn btn-primary w-6c ml-auto small mt-1">
                        上传图标
                    </button>
                </div> */}
                <Form ref={v => this.form = v} className="mb-3"
                    schema={schema}
                    uiSchema={this.uiSchema}
                    formData={this.currentGenre}
                    onButtonClick={this.onFormButtonClick}
                    fieldLabelSize={3} />
            </div>
        </Page>
    })
}



export class VConfirmDeleteGenre extends VPage<CProduct> {
    async open(contact: any) {
        this.openPage(this.page, contact);
    }

    private onConfirm = async () => {
        await this.returnCall(true);
        this.closePage();
    }

    private onCancel = async () => {
        await this.returnCall(false);
        this.closePage();
    }

    private page = (contact: any) => {
        return <Page header="删除类型" back="close">
            <div className="w-75 mx-auto border border-primary rounded my-3 p-3 bg-white">
                <div className="text-center">
                    <FA name='exclamation-circle text-warning fa-2x' />
                    <h6 className="text-center mt-2">是否删除该类型？</h6>
                </div>
                <div className="d-flex mt-3 justify-content-center">
                    <button className="btn btn-danger mr-3" onClick={this.onConfirm}>删除类型</button>
                    <button className="btn btn-outline-info mr-3" onClick={this.onCancel}>取消</button>
                </div>
            </div>
        </Page>;
    }
}
