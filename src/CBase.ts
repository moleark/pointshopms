import { CBase, CAppBase, IConstructor } from "tonva";
import { UQs } from "./uqs";
import { CPointMallApp } from "CPointMallApp";

export abstract class CUqBase extends CBase {
    get cApp(): CPointMallApp { return this._cApp; }
    protected get uqs(): UQs { return this._uqs as UQs }
}

export abstract class CUqApp extends CAppBase {
    get uqs(): UQs { return this._uqs };

    protected newC<T extends CUqBase>(type: IConstructor<T>): T {
        let c = new type(this);
        c.init();
        return c;
    }
}