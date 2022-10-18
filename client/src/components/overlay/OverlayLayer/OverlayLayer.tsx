import { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';



interface IOverlayLayer extends PropsWithChildren {
    isRendered?: boolean;
}

const overlayLayer = document.getElementById('overlay-root') as HTMLElement;

export const OverlayLayer: FC<IOverlayLayer> = ({ 
    children,
    isRendered = true,
}) => {
    const content = isRendered ? children : null;
    return createPortal(content, overlayLayer);
};