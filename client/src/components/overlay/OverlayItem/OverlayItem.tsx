import { Conditional, IOverlayContext, OverlayContext, OverlayPortal } from '@components';
import { getHTML } from '@utils';
import { FC, PropsWithChildren, useContext, useEffect, useRef } from 'react';
import ReactFocusLock from 'react-focus-lock';



interface IOverlayItem extends PropsWithChildren {
    blockable?: boolean;
    blocking?: boolean;
    focused?: boolean;
    closeOnEscape?: boolean;
    isRendered?: boolean;
}

export const OverlayItem: FC<IOverlayItem> = ({
    blockable = false,
    blocking = false,
    focused = false,
    closeOnEscape = false,
    isRendered = true,
    children,
}) => {
    const { close } = useContext(OverlayContext) as IOverlayContext;
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!closeOnEscape) return;
            if (!wrapperRef.current) return;
            if (e.code !== 'Escape') return;
            if (!blockable) return close();

            const wrapper = wrapperRef.current;
            const overlayItems = [...getHTML().overlay.childNodes] as HTMLDivElement[];
            const filtredItems = overlayItems.filter(node => node === wrapper || node.dataset.blocking === 'true');
            const isBlocked = wrapper !== filtredItems[filtredItems.length - 1];

            if (!isBlocked) return close();
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [blockable, close, closeOnEscape]);

    return (
        <Conditional isRendered={isRendered}>
            <OverlayPortal>
                <div 
                    className='pointer-events-none fixed top-0 left-0 right-0 bottom-0'
                    data-blocking={blocking}
                    ref={wrapperRef}
                >
                    <ReactFocusLock returnFocus disabled={focused}>
                        <div className='pointer-events-auto'>
                            {children}
                        </div>
                    </ReactFocusLock>
                </div>
            </OverlayPortal>
        </Conditional>
    );
};