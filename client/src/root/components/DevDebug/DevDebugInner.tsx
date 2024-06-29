import { OverlayContext, OverlayContextProvider, OverlayItem } from '@components';
import { useEventListener } from '@hooks';
import { FC, useContext, useRef } from 'react';
import { DevDebugContent } from './DevDebugContent';
import { KEY } from '@lesnoypudge/utils';



const DevDebugInner: FC = () => {
    const overlayApiRef = useRef<ReturnType<typeof useContext<OverlayContext>>>();

    useEventListener('keydown', (e) => {
        if (e.altKey || e.metaKey) return;
        if (!(e.shiftKey && e.ctrlKey && e.key === 'P')) return;
        if (!overlayApiRef.current) return;

        e.preventDefault();

        overlayApiRef.current.openOverlay();
    }, document);

    useEventListener('keydown', (e) => {
        if (e.key !== KEY.Slash) return;

        console.clear()
    }, window)

    return (
        <OverlayContextProvider>
            {(api) => {
                overlayApiRef.current = api;

                return (
                    <OverlayItem
                        isRendered={api.isOverlayExist}
                        blockable
                        blocking
                        closeOnEscape
                        focused
                    >
                        <DevDebugContent/>
                    </OverlayItem>
                );
            }}
        </OverlayContextProvider>
    );
};

export default DevDebugInner;