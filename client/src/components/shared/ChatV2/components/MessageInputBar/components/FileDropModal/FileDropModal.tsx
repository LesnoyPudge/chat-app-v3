import { FileUploadHandler, useFileDrop } from '@hooks';
import { getHTML } from '@utils';
import { FC, useContext, useRef } from 'react';
import { ModalWindow, OverlayContext } from '@components';
import { useUpdateEffect } from 'usehooks-ts';
import { Content } from '../Content';



interface FileDropModal {
    handleFileUpload: FileUploadHandler;
}

const styles = {
    content: 'bg-brand pointer-events-none',
};

export const FileDropModal: FC<FileDropModal> = ({
    handleFileUpload,
}) => {
    const { openOverlay, closeOverlay } = useContext(OverlayContext);
    const appRef = useRef(getHTML().app);
    const isDragOver = useFileDrop(handleFileUpload, appRef);

    useUpdateEffect(() => {
        isDragOver ? openOverlay() : closeOverlay();
    }, [isDragOver]);

    return (
        <ModalWindow 
            label='Загрузить файл' 
            withBackdrop 
            noBackdropPointerEvents
            noContainerPointerEvents
        >
            <Content
                className={styles.content}
                header='Загрузить файл' 
                content='Вы можете добавить комментарий к загружаемому файлу.'
            />
        </ModalWindow>
    );
};