import { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';



const overlayLayer = document.getElementById('overlay-layer') as HTMLElement;

export const OverlayLayer: FC<PropsWithChildren> = ({ children }) => {
    return createPortal(children, overlayLayer);
};