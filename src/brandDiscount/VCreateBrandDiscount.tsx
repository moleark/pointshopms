import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, Form, UiSchema, UiInputItem, Context, Schema, FA, List } from 'tonva';
import { CBrandDiscount } from './CBrandDiscount';
import { brandMinDiscountValidation } from '../tools/inputValidations';
import { observable } from 'mobx';
import classNames from 'classnames';

const schema: Schema = [
    { name: 'brand', type: 'string', required: false },
    { name: 'discount', type: 'string', required: true },
];

export class VCreateBrandDiscount extends VPage<CBrandDiscount> {
    private form: Form;
    @observable searchBrands: any[] = [];
    private uiSchema: UiSchema = {
        items: {
            brand:{visible:false},
            discount: { widget: 'text', label: '品牌折扣', placeholder: '品牌折扣',rules:brandMinDiscountValidation} as UiInputItem,
            submit: { widget: 'button', label: '提交' },
        }
    }
    async open(param?: any) {
        this.searchBrands = param?.map((v: any) => { return { ...v, show: false } }) || [];
        this.openPage(this.page)
    }

    private creatBrandDiscount = async () => {
        if (!this.form) return;
        await this.form.buttonClick("submit");
    }

    private onFormButtonClick = async (name: string, context: Context) => {
        let { data } = context;
        await this.controller.createBrandDiscount(data);
    }

    renderBrands = (item: any,index:number) => {
        let { name, show, discount, id } = item;
        return <div className="row mx-0 flex-column" style={{background:!show? '#f5f5f5':'#ffffff'}}>
            <div className="py-2 px-3 w-100" >
                <span>{name}</span>
                <FA name={show ? 'angle-up' : 'angle-down'} className={classNames('float-right', show ? 'text-primary' :'')} />
            </div>
            {
                show
                ? <div onClick={(e: React.MouseEvent) => { e.stopPropagation() }} className="p-2" style={{ borderTop: '1px dashed #cccccc' }} >
                    <Form ref={v => this.form = v}
                        schema={schema}
                        uiSchema={this.uiSchema}
                        formData={{ brand: id, discount: discount }}
                        onButtonClick={this.onFormButtonClick}
                        fieldLabelSize={3} />
                    <div className="d-flex">
                        <button className="btn btn-primary w-50 mx-auto" onClick={()=>{this.creatBrandDiscount()}}>{!discount ?'创 建':'修改'}</button>
                    </div>
                    </div>
                :null
            }
        </div>
    }

    selectBrands = async (item: any) => {
        let findBrand = await this.controller.getBrandDiscount(item.id);
        await this.searchBrands.forEach((v: any) => {
            if (v.id === item.id) {
                v.discount = findBrand ? (1 - findBrand.discount) * 100 : null;
                v.show = !v.show;
            }
            else v.show = false;
        });
    };

    private page = observer(() => {
        let header = this.controller.renderSearchHeader();
        return <Page header={header}>
            <List items={this.searchBrands} item={{render:this.renderBrands,onClick: this.selectBrands }} />
        </Page>
    })
}


 /* return <div className="row mx-0 flex-column">
            <div className="collapsed py-2 px-3 w-100" data-toggle="collapse" data-target={`#collapse${id}`} aria-expanded="false">
                <span>{name}</span>
                <FA name={show ? 'sort-asc' : 'sort-desc'} className="float-right" />
            </div>
            <div id={`collapse${id}`} className="collapse p-2" data-parent="#accordionExample" style={{ borderTop: '1px dashed #cccccc' }} >
                <div onClick={(e: React.MouseEvent) => { e.stopPropagation() }}>
                    <Form ref={v => this.form = v}
                        schema={schema}
                        uiSchema={this.uiSchema}
                        formData={{brand:id, discount}}
                        onButtonClick={this.onFormButtonClick}
                        fieldLabelSize={3} />
                    <div className="d-flex">
                        <button className="btn btn-primary w-50 mx-auto" onClick={()=>{this.creatBrandDiscount()}}>创 建</button>
                    </div>
                </div>
            </div>
        </div> */