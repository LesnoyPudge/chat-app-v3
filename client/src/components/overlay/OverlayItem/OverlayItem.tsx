import { Conditional, FocusHolder, OverlayContext, OverlayPortal } from '@components';
import { getHTML } from '@utils';
import { FC, PropsWithChildren, useContext, useRef } from 'react';
import ReactFocusLock from 'react-focus-lock';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';



interface OverlayItem extends PropsWithChildren {
    blockable?: boolean;
    blocking?: boolean;
    closeOnEscape?: boolean;
    closeOnClickOutside?: boolean;
    isRendered?: boolean;
    focused?: boolean;
}

export const OverlayItem: FC<OverlayItem> = ({
    blockable = false,
    blocking = false,
    closeOnEscape = false,
    closeOnClickOutside = false,
    isRendered = true,
    focused = false,
    children,
}) => {
    const { closeOverlay, isOverlayExist } = useContext(OverlayContext) as OverlayContext;
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const isBlocked = () => {
        const wrapper = wrapperRef.current;
        const overlayItems = [...getHTML().overlay.childNodes] as HTMLDivElement[];
        const filtredItems = overlayItems.filter(node => node === wrapper || node.dataset.blocking === 'true');
        return wrapper !== filtredItems[filtredItems.length - 1];
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!closeOnEscape) return;
        if (!wrapperRef.current) return;
        if (!e.target) return;
        if (e.code !== 'Escape') return;
        if (!blockable) return closeOverlay();
        if (!isBlocked()) return closeOverlay();
    };

    const onClick = () => {
        if (!wrapperRef.current) return;
        if (!closeOnClickOutside) return;
        if (!isBlocked()) return closeOverlay();
    };

    useOnClickOutside(wrapperRef, onClick, 'mouseup');
    useEventListener('keydown', handleKeyDown);

    return (
        <Conditional isRendered={isRendered}>
            <OverlayPortal>
                <div 
                    className='overlay-item-wrapper'
                    data-blocking={blocking}
                    ref={wrapperRef}
                >
                    <ReactFocusLock 
                        returnFocus
                        disabled={!isOverlayExist || !focused}
                    >
                        <FocusHolder>
                            {children}
                        </FocusHolder>
                    </ReactFocusLock>
                </div>
            </OverlayPortal>
        </Conditional>
    );
};