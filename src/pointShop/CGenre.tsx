import { observable } from 'mobx';
import { VProductGenre } from './VProductGenre';
import { CUqBase } from 'CBase';
import { EditProductGenre } from './EditProductGenre';

export class CGenre extends CUqBase {
    private fromGenreSelect: boolean;
    @observable productGenres: any[] = [];
    async internalStart(fromGenreSelect: boolean) {
        this.fromGenreSelect = fromGenreSelect;
        await this.getProductGenres();
        this.openVPage(VProductGenre);
    }

    /**
    * 商品类型修改页
    */
    openEditProductGenre = async (currentGenre: any) => {
        this.openVPage(EditProductGenre, currentGenre);
    }

    /**
     * 获取所有的分类
     */
    getProductGenres = async () => {
        this.productGenres = await this.uqs.积分商城.Genre.all();
    }

    /**
    * 创建商品类型  -------------图标imgUrl：'1'---------------
    */
    creationGenre = async (currentGenre: string) => {
        let { 积分商城 } = this.uqs;
        let { id } = await 积分商城.Genre.save(undefined, { name: currentGenre });
        let creationGenre = await 积分商城.Genre.load(id);
        this.productGenres.push(creationGenre);
    }

    /**
    * 修改商品类型
    */
    onSaveGenre = async (currentGenre: any) => {
        let { 积分商城 } = this.uqs;
        let { id, name, imgUrl } = currentGenre;
        // let rawData = await 积分商城.Genre.load(id);/* 原始数据 */
        // let { name: rname, imgUrl: rimgUrl } = rawData
        // if (name !== rname || imgUrl !== rimgUrl) {
        //     await 积分商城.Genre.save(id, { name, imgUrl });
        //     let findGenreIndex = this.productGenres.findIndex((v: any) => v.id === id);
        //     this.productGenres.splice(findGenreIndex, 1, currentGenre);
        // }

        await 积分商城.Genre.save(id, { name });
        let findGenreIndex = this.productGenres.findIndex((v: any) => v.id === id);
        this.productGenres.splice(findGenreIndex, 1, currentGenre);

        this.closePage();
    }

    /**
     * 删除商品类型
     */
    delGenre = async (currentGenre: any) => {
        let index = this.productGenres.findIndex(v => v.genre === currentGenre.genre);
        this.productGenres.splice(index, 1);
    }

    /**
     * 选择商品类型
     */
    onGenreSelected = (currentGenre: any) => {
        if (this.fromGenreSelect) {
            this.backPage();
            this.returnCall(currentGenre);
        }
    }
}
