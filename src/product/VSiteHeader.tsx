import * as React from 'react';
import { LMR, View } from 'tonva';
import logo from '../images/logo.png';
import { CProduct } from './CProduct';

export class VSiteHeader extends View<CProduct> {
    render() {
        let { openCreationProduct, renderSearchHeader } = this.controller;
        let left = <img className="m-1 ml-2 h-3c" src={logo} alt="logo" />;
        let right = <span className="fa-stack mr-2 mt-1 small" onClick={openCreationProduct}>
            <i className="fa fa-circle-o fa-stack-2x text-success"></i>
            <i className="fa fa-plus fa-stack-1x text-success"></i>
        </span>
        return <div style={{ borderBottom: '1px dashed #dee2e6' }}>
            <LMR className="mb-1 py-1 align-items-center bg-white" left={left} right={right}>
                <div className="mt-1 mx-3">
                    {renderSearchHeader()}
                </div>
            </LMR>
        </div>
    }
}