import * as React from 'react';
import { Image } from 'tonva';

const imagePath = "https://www.jkchemical.com/static/Structure/";
const pointProductImagePath = "https://www.jkchemical.com/static/images/pointshop";
export const altimagePath = "https://www.jkchemical.com/static/Structure/999.png";
export const JDImagePath = 'http://img13.360buyimg.com/';

interface ProductImageProps {
    className?: string;
    style?: React.CSSProperties;
    chemicalId: string;
}

export function ProductImage(props: ProductImageProps) {

    let { style, className, chemicalId } = props;
    return <Image src={chemicalId && (imagePath + chemicalId.substr(0, 3) + '/' + chemicalId + '.png')}
        style={style} className={className} altImage={altimagePath} />;
}

export function PointProductImage(props: ProductImageProps) {

    let { style, className, chemicalId } = props;
    if (chemicalId && chemicalId.startsWith(JDImagePath))
        return <img src={chemicalId} alt="" className="w-100" />;

    if (chemicalId && /[0-9]$/.test(chemicalId))
        chemicalId = pointProductImagePath + '/' + chemicalId + '.png';

    return <Image src={chemicalId && chemicalId}
        style={style} className={className} altImage={altimagePath} />;
}

