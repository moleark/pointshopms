import * as React from 'react';
import { VPage, Page, FA, LMR, Form, UiSchema, UiInputItem, Schema, Context, tv, UiSelect } from 'tonva';
import { CProduct, OperationAdapt } from 'product/CProduct';
import { observer } from 'mobx-react';
import { productPointValidation } from 'tools/inputValidations';
import { PointProductImage } from 'tools/productImage';
import classNames from 'classnames';
import { observable } from 'mobx';
import { GLOABLE } from 'configuration';
import { momentFormat } from 'tools/momentFormat';
const schema: Schema = [
    // { name: 'grade', type: 'string', required: true },
    { name: 'point', type: 'string', required: true },
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date', required: true },
];

const selectList = [
    { value: "1件", title: "1件" },
    { value: "1个", title: "1个" }
]

export const matchSelecText = {
    PRODUCTSELECT: { name: '重新选择商品', color: 'text-primary' }
}

export class VProductOperation extends VPage<CProduct>{
    @observable private productGenreIsBlank: boolean = false;    /* 类型是否选择 */
    @observable private productIsBlank: boolean = false;    /* 商品是否选择 */
    @observable private tips: string;    /* 提示 */
    private currentState: string;    /* 当前执行的状态 */
    private form: Form;
    private uiSchema: UiSchema = {
        items: {
            // grade: { widget: 'select', label: '规格', list: selectList } as UiSelect,
            point: { widget: 'text', label: '积分', placeholder: '设置商品积分', rules: productPointValidation } as UiInputItem,
            startDate: { widget: 'date', label: '上架日期' } as UiInputItem,
            endDate: { widget: 'date', label: '下架日期' } as UiInputItem,
            submit: { widget: 'button', label: '提交' },
        }
    }

    async open(param?: any) {
        this.openPage(this.page);
    }

    private onSaveOperating = async () => {
        if (!this.form) {
            this.productIsBlank = true;
            setTimeout(() => this.productIsBlank = false, GLOABLE.TIPDISPLAYTIME);
            return;
        }
        let { isSelectedGenre } = this.controller;
        if (!isSelectedGenre && this.currentState !== OperationAdapt.DOWNSHELF.type) {
            this.productGenreIsBlank = true;
            setTimeout(() => this.productGenreIsBlank = false, GLOABLE.TIPDISPLAYTIME);
            return;
        }
        await this.form.buttonClick("submit");
    }

    private onFormButtonClick = async (name: string, context: Context) => {
        let { closePage, saveOperation } = this.controller;
        let tipMainPart = await saveOperation({ data: context.form.data, state: this.currentState });
        this.tips = `此商品${tipMainPart}成功！`;
        // if (this.tips)
        //     setTimeout(() => this.tips = undefined, 1000);
        // setTimeout(() => closePage(1), 500);
    }

    private tipsUI = observer(() => {
        let tipsUI = <></>;
        if (this.tips) {
            tipsUI = <div className="alert alert-success" role="alert">
                <FA name="check-circle" className="text-warning float-left mr-3" size="2x"></FA>
                {this.tips}
            </div>
        }
        return tipsUI;
    })

    private operateButtonUI = (name: string, currentState: string) => {
        let { isCreationProduct } = this.controller;
        return <button className={classNames('btn btn-primary', isCreationProduct ? 'w-50' : 'w-8c')}
            onClick={() => { this.currentState = currentState; this.onSaveOperating(); }}>
            {name}</button>
    }

    private matchSelecTextDisplay = (text: any) => {
        let { PRODUCTSELECT } = matchSelecText;
        switch (text) {
            case PRODUCTSELECT.name:
                return PRODUCTSELECT.color;
            default:
                return;
        }
    }

    private productSelectEntry = (entryDesc: string, action: any, entrySelectedResul: any, tip?: any) => {
        let chevronRight = <FA name="chevron-right" className="cursor-pointer" />;
        let color = this.matchSelecTextDisplay(entrySelectedResul);
        return <div className="row bg-white d-flex align-items-center px-3 py-2 border-bottom" onClick={action}>
            <div className='col-4 col-sm-2  text-muted'>{entryDesc}:</div>
            <div className="col-8 col-sm-10">
                <LMR className='w-100 align-items-center' right={chevronRight}>
                    <div className={classNames(color)} style={{ color }}>{entrySelectedResul}</div>
                </LMR>
            </div>
            {tip}
        </div>
    }

    private page = observer(() => {
        let { EDIT, UPSHELF, DOWNSHELF } = OperationAdapt;
        let { toProductSelect, toGenreSelect, openVUpdatePicture, toProductUpShelf, isCreationProduct, goalProductInfo } = this.controller;
        let { genreShow, productSelectDesc, imageUrl, point, startDate, endDate, description, descriptionC, grade, radioy, unit } = goalProductInfo;
        grade = grade !== undefined ? grade : (radioy && unit ? `${radioy}${unit}` : '');
        startDate = startDate !== undefined ? momentFormat(startDate) : startDate;
        endDate = endDate !== undefined ? momentFormat(endDate) : endDate;
        let genreData = { point, startDate, endDate, grade };

        let header = `商品${isCreationProduct ? '新增' : '修改'}`;
        let footer = <div className="d-flex justify-content-around">
            {
                isCreationProduct
                    ? this.operateButtonUI(UPSHELF.name, UPSHELF.type)
                    : <>
                        {this.operateButtonUI(EDIT.name, EDIT.type)}
                        {
                            toProductUpShelf
                                ? this.operateButtonUI(UPSHELF.name, UPSHELF.type)
                                : this.operateButtonUI(DOWNSHELF.name, DOWNSHELF.type)
                        }
                    </>
            }
        </div>
        let productGenreBlankTip = this.productGenreIsBlank ? <div className="text-danger small my-2 d-flex m-auto">必须选择商品类型</div> : null;
        let productBlankTip = this.productIsBlank ? <div className="text-danger small my-2 d-flex m-auto">必须选择商品</div> : null;

        return <Page header={header} footer={footer}>
            <div className="position-fixed" style={{ top: '45%', left: '10%', right: '10%', zIndex: 3 }}>{React.createElement(this.tipsUI)}</div>

            {this.productSelectEntry('商品选择', toProductSelect, productSelectDesc ? productSelectDesc : '选择商品', productBlankTip)}
            {this.productSelectEntry('商品类型', toGenreSelect, genreShow ? genreShow : '选择商品类型', productGenreBlankTip)}

            <div className="px-3 py-2">
                <div className="text-muted">商品信息:</div>
                <div className="m-1 w-100 d-flex flex-column position-relative">
                    <div title={description} className="w-75 m-auto"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
                    <small className="pt-1">{descriptionC}</small>
                    <div className="d-flex justify-content-between px-1 align-items-center">
                        <>{grade}</>
                        <button onClick={() => openVUpdatePicture('更新图片')}
                            className="btn btn-primary w-6c ml-auto" > {/*position-absolute style={{ right: 10, bottom: -30 }} */}
                            <small>更新图片</small>
                        </button>
                    </div>
                </div>
                {/* {tv(product, (v) => {
                    return <div className="m-1 w-100 d-flex flex-column position-relative">
                        <div title={v.description} className="w-75 m-auto"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
                        {
                            tv(pack, (c) => {
                                return <div className="d-flex flex-column ">
                                    <>{v.description}</>
                                    <div className="pt-2">{c.radioy}{c.unit}</div>
                                </div>
                            })
                        }
                        <button onClick={() => openVUpdatePicture('更新图片')}
                            className="btn btn-primary w-6c ml-auto position-absolute" style={{ right: 10, bottom: -5 }}>
                            <small>更新图片</small>
                        </button>
                    </div>
                })} */}
            </div>

            {
                <div className="container text-left border-bottom">
                    <Form ref={v => this.form = v}
                        schema={schema}
                        uiSchema={this.uiSchema}
                        formData={genreData}
                        onButtonClick={this.onFormButtonClick}
                        fieldLabelSize={3} />
                </div>
            }
        </Page >
    })
}
