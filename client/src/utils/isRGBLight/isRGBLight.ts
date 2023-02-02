import { RGB } from '@types';



export const isRGBLight = ({ r, g, b }: RGB) => {
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186;
};