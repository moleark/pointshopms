import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, Form, Schema, UiInputItem, UiSchema, UiSelect, Context, } from 'tonva';
import { CReport } from './CReport';
import { Chart, Interval, Tooltip, Point, Line, Slider, LineAdvance } from 'bizcharts';
import { observable } from 'mobx';

const schema: Schema = [
    { name: 'pointRange', type: 'string', required: true },
];

export const PointRangeLibForm: any[] = [
    { value: '0-10万', title: '0-10万' },
    { value: '20万-30万', title: '20万-30万' },
    { value: '30万-40万', title: '30万-40万' },
    { value: '40万-50万', title: '40万-50万' },
    { value: '50万-100万', title: '50万-100万' },
    { value: '100万-1000万', title: '100万-1000万' },
    { value: '1000万以上', title: '1000万以上' },
]

export class VPointsDist extends VPage<CReport> {
    private form: Form;
    async open(param?: any) {
        this.openPage(this.page);
    }
    private uiSchema: UiSchema = {
        items: {
            pointRange: { widget: 'select', label: '积分范围', list: this.controller.maxPointRangeLib } as UiSelect,
            submit: { widget: 'button', label: '提交' },
        }
    }

    private onSaveInquire = async () => {
        if (!this.form) return;
        await this.form.buttonClick("submit");
    }

    private onFormButtonClick = async (name: string, context: Context) => {
        let { queryPointDistribution } = this.controller;
        await queryPointDistribution(context.form.data);
    }

    private page = observer(() => {
        let { pointRangeLib, pointRange } = this.controller;
        let footer = <div className="w-100 d-flex justify-content-center">
            <button onClick={() => { this.onSaveInquire() }} className="btn btn-primary w-50">查询</button>
        </div>

        return <Page header="积分分布" footer={footer}>

            <div className="container text-left mt-1 border-bottom">
                <Form ref={v => this.form = v}
                    schema={schema}
                    uiSchema={this.uiSchema}
                    formData={{ pointRange }}
                    onButtonClick={this.onFormButtonClick}
                    fieldLabelSize={3} />
            </div>
            {/* <Chart height={200} autoFit data={pointRangeLib} interactions={['active-region']} padding={[20, 40, 70, 30]} >
                <Point position="pointRange*QTYP" />
                <Tooltip shared />
            </Chart> */}
            <Chart
                padding="auto"
                appendPadding={[10, 5, 0, 5]}
                autoFit
                animate
                height={300}
                data={pointRangeLib}
                scale={{ value: { min: 1 } }}
            >
                {/* <Line position="pointRange*QTYP" /> */}
                <LineAdvance
                    shape="smooth"
                    point
                    area
                    position="pointRange*QTYP"
                    color="rgb(95,147,249)"
                />
                {/* <Point position="pointRange*QTYP" adjust="stack" shape='hollow-hexagon' /> */}
                <Slider
                    start={0}
                    end={1}
                    textStyle={{ fontWeight: 'bold' }}
                    formatter={(v, d, i) => {
                        return `${v}`;
                    }}
                />
            </Chart>
        </Page>
    })
}