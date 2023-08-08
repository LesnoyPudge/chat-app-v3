import { OverlayContextProvider } from '@components';
import { FormikFileUploadContext } from '@libs';
import { FC, useContext } from 'react';
import { FileDropModal, OverflowModal, SizeModal } from './components';



export const AttachmentsModals: FC = () => {
    const { addErrorListener } = useContext(FormikFileUploadContext);

    return (
        <>
            <OverlayContextProvider>
                {({ openOverlay }) => {
                    addErrorListener.onAmountLimit(openOverlay);

                    return (
                        <OverflowModal/>
                    );
                }}
            </OverlayContextProvider>

            <OverlayContextProvider>
                {({ openOverlay }) => {
                    addErrorListener.onSizeLimit(openOverlay);

                    return (
                        <SizeModal/>
                    );
                }}
            </OverlayContextProvider>

            <OverlayContextProvider>
                <FileDropModal/>
            </OverlayContextProvider>
        </>
    );
};