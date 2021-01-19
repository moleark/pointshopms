import { GLOABLE } from 'configuration';
import { CPointShopMsApp } from 'CPointShopMsApp';
import { observable } from 'mobx';
import { BoxId } from 'tonva';

export class PointProduct {
	private cApp: CPointShopMsApp;

	id: number;
	seq?: number;
	@observable.ref props: any;
	@observable.ref productGenre: any;
	@observable.ref productSource: any;
	@observable.ref productDetailPost: any;
	@observable.ref productOther: any;
	@observable.ref htmlFragment: any;

	constructor(cApp: CPointShopMsApp, id: number | BoxId) {
		this.cApp = cApp;
		this.id = typeof id === 'object' ? id.id : id;
	}

	async loadListItem() {
		await this.loadBase();
		let promises: PromiseLike<any>[] = [
			this.loadProductSource(),
			this.loadProductDetailPost(),
		];
		await Promise.all(promises);
		await this.loadProductPriceAOrigin();
	}

	async loadProductDetail() {
		await this.loadBase();
		let promises: PromiseLike<any>[] = [
			this.loadProductGenre(),
			this.loadProductSource(),
		];
		await Promise.all(promises);
		await this.loadProductPriceAOrigin();
	}

	private async loadBase() {
		// if (this.props) return;
		let ret = await this.cApp.cProduct.getPointProductLibLoad(this.id);// this.cApp.uqs.积分商城.PointProductLib.load(this.id);
		this.props = ret;
	}

	async loadProductGenre() {
		if (this.productGenre) return;
		let ret = await this.cApp.uqs.积分商城.GetPointProductGenre.obj({ pointProduct: this.id });
		this.productGenre = ret ? ret.genre : ret;
	}

	async loadProductSource() {/* 获取商品源与商品关系(by pointProduct) */
		if (this.productSource) return;
		let ret = await this.cApp.uqs.积分商城.PointProductSource.obj({ pointProduct: this.id, sourceId: undefined });
		this.productSource = ret;
	}

	async loadProductPriceAOrigin() {
		if (this.productOther || !this.productSource) return;
		let { sourceId, type } = this.productSource;
		let ret: any;
		if (type === 'self') {
			ret = await this.getSelfProductPrice(sourceId);
			ret = { ...ret, price: ret?.retail };
		};
		if (type === 'jd.com') {
			ret = await this.getJDProductPrice(sourceId);
			ret = { ...ret, origin: sourceId };
		};
		this.productOther = ret;
	}

	async loadProductDetailPost() {
		if (this.productDetailPost) return;
		let ret = await this.cApp.uqs.积分商城.PointProductDetail.obj({ pointProduct: this.id });
		this.productDetailPost = ret ? ret.content : ret;
	}

	/**
	 * 获取自营产品价格
	 */
	getSelfProductPrice = async (sourceId: string) => {
		return await this.cApp.uqs.product.GetPointProductMoreBySource.obj({ pack: sourceId, salesRegion: this.cApp.currentSalesRegion });
	}

	/**
	 * 获取JD产品价格
	 */
	getJDProductPrice = async (sourceId: string) => {
		let result = await this.cApp.cProduct.getJDProductPrice(sourceId);
		if (!result) return;
		return result[0];
	}

	/**
	 * 获取帖文预览相关数据
	 */
	getPostViewData = async () => {
		await this.getPointProductDetailPostHtml();
		await this.loadProductSource();
	};

	/**
	 * 获取商品帖文预览内容(编译后)
	 */
	getPointProductDetailPostHtml = async () => {
		if (this.htmlFragment) return;
		let result = await window.fetch(GLOABLE.CONTENTSITE + '/partial/pointproductdetail/' + this.id);
		if (!result.ok) return;
		let content = await result.text();
		this.htmlFragment = content;
	}

	/**
	 * 添加商品帖文
	 */
	addPointProductDetailPost = async (content: any) => {
		await this.cApp.uqs.积分商城.PointProductDetail.add({ pointProduct: this.id, content: content });
		this.productDetailPost = undefined;
		await this.loadProductDetailPost();
	}
}
