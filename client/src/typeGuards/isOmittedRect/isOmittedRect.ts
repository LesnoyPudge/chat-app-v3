import { isObject } from '@reExport';
import { OmittedRect } from '@types';



type RectFields = {
    [K in keyof OmittedRect]: K; 
}

const omittedRectFields: RectFields = {
    bottom: 'bottom',
    height: 'height',
    left: 'left',
    right: 'right',
    top: 'top',
    width: 'width',
};

export const isOmittedRect = (possibleRect: unknown): possibleRect is OmittedRect => {
    if (!isObject(possibleRect)) return false;
    
    return (
        omittedRectFields.bottom in possibleRect &&
        omittedRectFields.height in possibleRect &&
        omittedRectFields.left in possibleRect &&
        omittedRectFields.right in possibleRect &&
        omittedRectFields.top in possibleRect &&
        omittedRectFields.width in possibleRect
    );
};