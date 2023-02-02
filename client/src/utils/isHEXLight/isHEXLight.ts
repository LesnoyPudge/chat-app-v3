import { hexToRgb } from '../hexToRgb';
import { isRGBLight } from '../isRGBLight';



export const isHEXLight = (hex: string) => {
    return isRGBLight(hexToRgb(hex));
};