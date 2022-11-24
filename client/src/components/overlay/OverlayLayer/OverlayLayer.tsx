import { getHTML } from '@utils';
import { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';



const overlayLayer = getHTML().overlayLayer;

export const OverlayLayer: FC<PropsWithChildren> = ({ children }) => {
    return createPortal(children, overlayLayer);
};