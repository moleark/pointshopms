import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, FA, List, tv, Scroller, LMR } from 'tonva';
import { CBrandDiscount } from './CBrandDiscount';
import { Slider, InputNumber, Row, Col } from 'antd';
import { observable } from 'mobx';
import { VCreateBrandDiscount } from './VCreateBrandDiscount';

export class VBrandDiscount extends VPage<CBrandDiscount> {
    @observable modifyDiscountList: any[] = [];   /* 修改折扣的品牌列表 */
    @observable list: any[] = [];
    async open(param?: any) {
        this.list = [].concat(this.controller.brandMinDiscounts?.items || []);
        this.openPage(this.page)
    }

    renderDiscount = (item: any) => {
        let { brand, discount,disabled } = item;
        let value = (1 - discount) * 100;
        let findChange = this.modifyDiscountList.find((v: any) => v.brand.id === brand.id);
        let right = <div className="mr-2 mt-1 col-12">
            <span onClick={()=>{item.disabled = !item.disabled;}}><FA name={ disabled ? 'edit': 'undo'} className="text-primary mr-2" /></span>
            {!disabled && findChange && <span onClick={() => { this.saveBrandDisCount(item) }}><FA name='save' className="text-primary mr-2" /></span>}
        </div>;

        let onChange = (value: any) => {
            let findCurBrandIndex = this.modifyDiscountList.findIndex((v: any) => v.brand.id === brand.id);
            let nowDiscount = (1 - value / 100).toFixed(2);
            if (findCurBrandIndex === -1) this.modifyDiscountList.push({ ...item, discount: nowDiscount });
            else this.modifyDiscountList[findCurBrandIndex].discount = nowDiscount;
        }
        
        return <LMR className="w-100" right={right}>
            <div className="row mx-0 py-2">
                <div className={`col-12 col-sm-4 small py-1`}>
                    {tv(brand, (v) => <>{v.name}</>)}
                </div>
            <div className="col-12 col-sm-8 small">
               <IntegerStep defaultValue={value} disabled={disabled} inputValue={value} onChange={(v:any)=>{ onChange(v);}} />
            </div>
        </div>
        </LMR>
    }

    onScrollBottom = async (scroller: Scroller) => {
        let { brandMinDiscounts } = this.controller;
        if(this.list.length !== brandMinDiscounts.items.length) scroller.scrollToBottom();
        await brandMinDiscounts.more();
        this.list =  this.controller.brandMinDiscounts?.items.map((v: any) => v);
    }

    saveBrandDisCount = async (item: any) => {
        let findCurBrandIndex = this.modifyDiscountList.findIndex((v: any) => v.brand.id === item.brand.id);
        item.discount = Number(this.modifyDiscountList[findCurBrandIndex].discount);
        await this.controller.addBrandMinDiscount(item);
        this.list.forEach((v: any) => {if (v.brand.id === item.brand.id) v.disabled = true;});
        this.modifyDiscountList.splice(findCurBrandIndex, 1);
    }

    private page = observer(() => {
        let { saveBrandDisCount } = this.controller;
        /* 批量保存 暂不做
        let batchSaveUI: JSX.Element;
        if (this.modifyDiscountList.length)
            batchSaveUI = <button className="btn btn-sm btn-success mr-3" onClick={() => { saveBrandDisCount(this.modifyDiscountList) }} >保存</button>; */
        let right = <>
            <button className="btn btn-sm btn-primary mr-3" onClick={()=>{this.openVPage(VCreateBrandDiscount)}}>创 建</button>
            {/* {batchSaveUI} */}
        </>
        return <Page header="品牌折扣" right={right} onScrollBottom={this.onScrollBottom}>
            <List items={this.list} item={{render:this.renderDiscount}} none={''} />
        </Page>
    })
}


class IntegerStep extends React.Component<any> {

    state = {
        inputValue: 1,
    };

    constructor(props:any) {
        super(props);
        this.state = {
            inputValue: props.inputValue
        };
    }

    onChange = value => {
        this.setState({
            inputValue: value,
        });
        this.props.onChange(value);
    };

    render() {
        let { defaultValue,disabled } = this.props;
        const { inputValue } = this.state;
        const marks = {
            0: '0%',
            100: {
                style: {color: '#f50'},
                label: <strong>100%</strong>,
            },
        };
        return (
        <Row>
            <Col span={16}>
                <Slider
                    min={0}
                    max={100}
                    onChange={this.onChange}
                    value={typeof inputValue === 'number' ? inputValue : 0}
                    defaultValue={defaultValue}
                    marks={marks}
                    disabled={disabled}
                />
            </Col>
            <Col span={4}>
                <InputNumber
                    min={0}
                    max={100}
                    className='ml-3 mr-2'
                    value={inputValue}
                    defaultValue={defaultValue}
                    onChange={this.onChange}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    disabled={disabled}
                    />
            </Col>
        </Row>
        );
    }
}