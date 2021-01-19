import * as React from 'react';
import { VPage, Page } from 'tonva';
import { CProduct } from 'product/CProduct';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

export class VPointProductPostShow extends VPage<CProduct>{
    @observable isScale: boolean;
    @observable htmlFragment: string = '';  /* 商品帖文预览内容 */
    async open(param: any) {
        let { htmlFragment, isScale } = param;
        this.isScale = isScale;
        this.htmlFragment = htmlFragment;
        this.openPage(this.page);
    }

    setDetailMobSize = () => {
        setTimeout(() => {
            let getDetail_mob = document.querySelector('.reset-z-detail_mob');
            let getTable__01 = document.getElementById('__01');
            let viewP = 750;
            if (getTable__01) viewP = getTable__01.offsetWidth;
            let scaleW = window.innerWidth <= 575 ? window.innerWidth / viewP : 1;
            getDetail_mob.setAttribute('style', `transform:scale(${scaleW})`);
        }, 50);
    }

    private page = observer(() => {
        if(this.isScale) this.setDetailMobSize();
        return <Page header='预览帖文'>
            <div style={{height:`${window.innerHeight}px`}}>
                <div dangerouslySetInnerHTML={{ __html: this.htmlFragment || '' }} className="reset-z-detail_mob"></div>
            </div>
        </Page >
    })
}

/* (function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      // 根据设备的比例调整初始font-size大小
        if (clientWidth > 640) clientWidth = 640;
         docEl.style.fontSize= 10 * (clientWidth / 320) + 'px'
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window) */