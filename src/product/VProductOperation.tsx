import * as React from 'react';
import { VPage, Page, FA, LMR, Form, UiSchema, UiInputItem, Schema, Context, tv } from 'tonva';
import { CProduct } from 'product/CProduct';
import { observer } from 'mobx-react';
import { productPointValidation } from 'tools/inputValidations';
import { PointProductImage } from 'tools/productImage';
import classNames from 'classnames';
import { observable } from 'mobx';
import { GLOABLE } from 'configuration';
import { momentFormat } from 'tools/momentFormat';
const schema: Schema = [
    { name: 'point', type: 'string', required: true },
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date', required: true },
];

export class VProductOperation extends VPage<CProduct>{
    @observable private productGenreIsBlank: boolean = false;    /* 类型是否选择 */
    @observable private productIsBlank: boolean = false;    /* 商品是否选择 */
    @observable private tips: string;    /* 提示 */
    private currentState: string;    /* 当前执行的状态 */
    private form: Form;
    private uiSchema: UiSchema = {
        items: {
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
        if (!isSelectedGenre) {
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
        let { toProductUpShelf } = this.controller;
        return <button className={classNames('btn btn-primary', toProductUpShelf ? 'w-50' : 'w-8c')}
            onClick={() => { this.currentState = currentState; this.onSaveOperating(); }}>
            {name}</button>
    }

    private productSelectEntry = (entryDesc: string, action: any, entrySelectedResul: any, tip?: any) => {
        let chevronRight = <FA name="chevron-right" className="cursor-pointer" />;
        return <div className="row bg-white d-flex align-items-center px-3 py-2 border-bottom" onClick={action}>
            <div className="col-4 col-sm-2  text-muted">{entryDesc}:</div>
            <div className="col-8 col-sm-10">
                <LMR className="w-100 align-items-center" right={chevronRight}>
                    {entrySelectedResul}
                </LMR>
            </div>
            {tip}
        </div>
    }

    private page = observer(() => {
        let { toProductSelect, toGenreSelect, openVUpdatePicture, toProductUpShelf, goalProductInfo } = this.controller;
        let { genreShow, productSelectDesc, product, pack, imageUrl, point, startDate, endDate } = goalProductInfo;
        startDate = momentFormat(startDate); endDate = momentFormat(endDate);
        let genreData = { point, startDate, endDate };

        let header = `商品${toProductUpShelf ? '新增' : '修改'}`;
        let footer = <div className="d-flex justify-content-around">
            {
                toProductUpShelf
                    ? this.operateButtonUI('上 架', 'upShelf')
                    : <>
                        {this.operateButtonUI('修 改', 'edit')}
                        {this.operateButtonUI('下 架', 'downShelf')}
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
                {tv(product, (v) => {
                    return <div className="m-1 w-100 d-flex flex-column position-relative">
                        <div title={v.description} className="w-75 m-auto"><PointProductImage chemicalId={imageUrl} className="w-100" /></div>
                        {/* <div title={v.description} className="w-75 m-auto">{<Image src={imageUrl} altImage={altimagePath} />}</div> */}
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
                        {/* {
                            tv(pack, (c) => {
                                return <div className="d-flex flex-column ">
                                    <>{v.description}</>
                                    <div className="d-flex justify-content-between mt-2 mr-2">
                                        <div className="pt-2">{c.radioy}{c.unit}</div>
                                        <button onClick={() => openVUpdatePicture()} className="btn btn-primary w-6c ml-auto" >
                                            <small>更新图片</small>
                                        </button>
                                    </div>
                                </div>
                            })
                        } */}
                    </div>
                })}
            </div>

            {
                product && <div className="container text-left border-bottom">
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
