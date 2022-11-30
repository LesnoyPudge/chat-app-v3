import { getHTML } from '@utils';
import { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';



export const OverlayPortal: FC<PropsWithChildren> = ({ children }) => {
    return createPortal(children, getHTML().overlay);
};