import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, Page, LMR, List, FA } from 'tonva';
import { VConfirmDeleteGenre } from './EditProductGenre';
import { CGenre } from './CGenre';
import { observable } from 'mobx';
import { GLOABLE } from 'configuration';
import { PointProductImage } from 'tools/productImage';

export class VProductGenre extends VPage<CGenre> {
    private genreInput: HTMLInputElement;
    @observable private creationGenreIsBlink: boolean = false;
    async open(param?: any) {
        this.openPage(this.page);
    }

    /**
     * 创建商品类型
     */
    private creationGenre = async () => {
        if (this.genreInput.value) {
            let { creationGenre } = this.controller;
            let createGenre = this.genreInput.value;
            this.genreInput.value = '';
            await creationGenre(createGenre);
        } else {
            this.creationGenreIsBlink = true;
            setTimeout(() => this.creationGenreIsBlink = false, GLOABLE.TIPDISPLAYTIME);
        }
    }

    private editGenre = async (currentGenre: any) => {
        let { openEditProductGenre } = this.controller;
        await openEditProductGenre(currentGenre)
    }

    private delGenre = async (currentGenre: any) => {
        let { delGenre } = this.controller;
        if (await this.vCall(VConfirmDeleteGenre, currentGenre) === true) {
            await delGenre(currentGenre);
        };
    }

    /**
     * 商品类型操作
     */
    private genreActionIcon = (icon: string, action: Function, currentGenre: any) => {
        return <span className="align-self-center px-2" onClick={(e) => { e.stopPropagation(); action(currentGenre); }}> <FA name={icon} /></span>
    }

    private renderItemGenre = (currentGenre: any) => {
        let right = <div className="d-flex pt-2 px-2 cursor-pointer text-info">
            {this.genreActionIcon('edit', this.editGenre, currentGenre)}
            {/* {this.genreActionIcon('trash', this.delGenre, currentGenre)} */}
        </div>
        return <LMR right={right}>
            <div className="pt-2 px-2">
                <span className=" m-auto"><PointProductImage chemicalId={currentGenre.imgUrl ? currentGenre.imgUrl : '1'} className="w-4c" /></span>
                {currentGenre.name}</div>
        </LMR>;
    }

    private page = observer(() => {
        let { productGenres, onGenreSelected } = this.controller;
        let right = <button className="btn btn-primary w-100" onClick={this.creationGenre}>创建</button>
        let none = <div className="mt-3 text-secondary d-flex justify-content-center">『 无商品类型 』</div>
        let creationGenreTipUI = this.creationGenreIsBlink ? <small className="text-danger ml-2">必须填商品类型</small> : null;
        return <Page header="商品类型">
            <div className="px-2 py-3">
                <LMR right={right}>
                    <input ref={v => this.genreInput = v} type="text" placeholder="输入创建的商品类型" className="form-control"></input>
                </LMR>
                {creationGenreTipUI}
                <List items={productGenres} item={{ render: this.renderItemGenre, onClick: onGenreSelected, }} none={none} className="mt-2" />
            </div>
        </Page>
    })
}