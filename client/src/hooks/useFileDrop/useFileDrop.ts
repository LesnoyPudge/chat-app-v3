import { EncodedFile } from '@types';
import { encodeFiles } from '@utils';
import { useState, useRef, RefObject, useEffect, useCallback } from 'react';



type UseFileDrop = (
    options?: {
        multiple?: boolean; 
        accept?: string;
    },
    elementRef?: RefObject<HTMLElement>,
) => {
    files: EncodedFile | EncodedFile[] | null;
    isDragOver: boolean;
};

export const useFileDrop: UseFileDrop = (
    {
        multiple = false, 
        accept = '',
    } = {}, 
    elementRef,
) => {
    const [files, setFiles] = useState<EncodedFile | EncodedFile[] | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const dragOverCounter = useRef(0);

    const handleDragOver = useCallback(() => {
        if (dragOverCounter.current !== 0 && !isDragOver) return setIsDragOver(true);
        if (dragOverCounter.current === 0 && isDragOver) return setIsDragOver(false);
    }, [isDragOver]);

    const handleDragEnter = useCallback(() => {
        dragOverCounter.current++;
        handleDragOver();
    }, [handleDragOver]);

    const handleDragLeave = useCallback(() => {
        dragOverCounter.current--;
        handleDragOver();
    }, [handleDragOver]);

    const dragOverCounterReset = useCallback(() => {
        dragOverCounter.current = 0;
        handleDragOver();
    }, [handleDragOver]);

    const handleDrop = useCallback((e: DragEvent) => {
        if (!isDragOver) return;

        dragOverCounterReset();

        if (!e.dataTransfer?.files) return;

        encodeFiles(Object.values(e.dataTransfer.files), multiple).then((transferedFiles) => {
            setFiles(transferedFiles);
            console.log(transferedFiles);
        });
    }, [dragOverCounterReset, isDragOver, multiple]);

    useEffect(() => {
        if (elementRef && !elementRef.current) return;
        const target = elementRef ? elementRef.current! : document;

        target.addEventListener('dragenter', handleDragEnter);
        target.addEventListener('dragleave', handleDragLeave);
        document.addEventListener('drop', handleDrop);

        return () => {
            target.removeEventListener('dragenter', handleDragEnter);
            target.removeEventListener('dragleave', handleDragLeave);
            document.removeEventListener('drop', handleDrop);
        };
    }, [handleDragLeave, handleDragEnter, elementRef, handleDrop]);
    
    return {
        files,
        isDragOver,
    };
};