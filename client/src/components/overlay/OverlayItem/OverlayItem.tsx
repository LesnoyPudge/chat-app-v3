import { Conditional, IOverlayContext, OverlayContext, OverlayPortal } from '@components';
import { getHTML } from '@utils';
import { FC, PropsWithChildren, useContext, useRef } from 'react';
import ReactFocusLock, { MoveFocusInside } from 'react-focus-lock';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';



interface IOverlayItem extends PropsWithChildren {
    blockable?: boolean;
    blocking?: boolean;
    closeOnEscape?: boolean;
    closeOnClickOutside?: boolean;
    isRendered?: boolean;
}

export const OverlayItem: FC<IOverlayItem> = ({
    blockable = false,
    blocking = false,
    closeOnEscape = false,
    closeOnClickOutside = false,
    isRendered = true,
    children,
}) => {
    const { close, isExist } = useContext(OverlayContext) as IOverlayContext;
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!closeOnEscape) return;
        if (!wrapperRef.current) return;
        if (!e.target) return;
        if (e.code !== 'Escape') return;
        if (!blockable) return close();
 
        const target = e.target as HTMLElement;
        const wrapper = wrapperRef.current;

        if (wrapper === target || wrapper.contains(target)) return close();
    };

    const onClick = () => {
        if (!wrapperRef.current) return;
        if (!closeOnClickOutside) return;

        const wrapper = wrapperRef.current;
        const overlayItems = [...getHTML().overlay.childNodes] as HTMLDivElement[];
        const filtredItems = overlayItems.filter(node => node === wrapper || node.dataset.blocking === 'true');
        const isBlocked = wrapper !== filtredItems[filtredItems.length - 1];

        if (!isBlocked) return close(isExist);
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
                    <ReactFocusLock returnFocus>
                        <div className='pointer-events-auto focus-hidden' tabIndex={0}>
                            {/* <MoveFocusInside> */}
                            {children}
                            {/* </MoveFocusInside> */}
                        </div>
                    </ReactFocusLock>
                </div>
            </OverlayPortal>
        </Conditional>
    );
};