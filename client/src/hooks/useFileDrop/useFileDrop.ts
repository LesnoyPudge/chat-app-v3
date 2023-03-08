import { isRef } from '@typeGuards';
import { EncodedFile } from '@types';
import { encodeFiles, EncodeFilesOptions, EncodeFilesResult } from '@utils';
import { useState, useRef, RefObject, useEffect, useCallback, useMemo } from 'react';
import { useSet } from 'react-use';
import { useCounter, useEventListener, useMap } from 'usehooks-ts';



type UseFileDrop = (
    options?: {
        multiple?: boolean; 
        accept?: string;
    },
    elementRef?: RefObject<HTMLElement>,
) => {
    files: EncodedFile[] | null;
    isDragOver: boolean;
};

// export const useFileDrop: UseFileDrop = (
//     options = {}, 
//     elementRef,
// ) => {
//     const {
//         accept = options.accept || '',
//         multiple = options.multiple || true,
//     } = options;

//     const [files, setFiles] = useState<EncodedFile[] | null>(null);
//     const [isDragOver, setIsDragOver] = useState(false);
//     const dragOverCounter = useRef(0);
//     const documentRef = useRef(document);
//     const targetRef = useRef(!!elementRef && !!elementRef.current ? elementRef.current : document);


//     const handleDragOver = useCallback(() => {
//         if (dragOverCounter.current !== 0 && !isDragOver) return setIsDragOver(true);
//         if (dragOverCounter.current === 0 && isDragOver) return setIsDragOver(false);
//     }, [isDragOver]);
    
//     const handleDragEnter = useCallback(() => {
//         dragOverCounter.current++;
//         handleDragOver();
//     }, [handleDragOver]);

//     const handleDragLeave = useCallback(() => {
//         dragOverCounter.current--;
//         handleDragOver();
//     }, [handleDragOver]);

//     const dragOverCounterReset = useCallback(() => {
//         dragOverCounter.current = 0;
//         handleDragOver();
//     }, [handleDragOver]);

//     const handleDrop = useCallback((e: DragEvent) => {
//         if (!isDragOver) return;

//         dragOverCounterReset();

//         if (!e.dataTransfer?.files) return;

//         encodeFiles(Object.values(e.dataTransfer.files)).then((transferredFiles) => {
//             setFiles(transferredFiles);
//         });
//     }, [dragOverCounterReset, isDragOver]);

//     useEffect(() => {
//         if (elementRef && !elementRef.current) return;
//         const target = elementRef ? elementRef.current! : document;

//         target.addEventListener('dragenter', handleDragEnter);
//         target.addEventListener('dragleave', handleDragLeave);
//         document.addEventListener('drop', handleDrop);

//         return () => {
//             target.removeEventListener('dragenter', handleDragEnter);
//             target.removeEventListener('dragleave', handleDragLeave);
//             document.removeEventListener('drop', handleDrop);
//         };
//     }, [handleDragLeave, handleDragEnter, elementRef, handleDrop]);
    
//     return {
//         files,
//         isDragOver,
//     };
// };




type UseFileDropV2 = (
    onFileDrop: (files: EncodeFilesResult) => void,
    options?: EncodeFilesOptions,
    element?: RefObject<HTMLElement> | HTMLElement,
) => boolean;

export const useFileDrop: UseFileDropV2 = (
    onFileDrop,
    options = {},
    element,
) => {
    // const [files, filesHelpers] = useMap<string, EncodedFile>();
    const [isDragOver, setIsDragOver] = useState(false);
    const dragOverCounterRef = useRef(0);
    const targetRef = useRef(isRef(element) ? element.current! : document);

    const counterHelpers = useMemo(() => ({
        reset: () => dragOverCounterRef.current = 0,
        increase:  () => dragOverCounterRef.current++,
        reduce:  () => dragOverCounterRef.current = Math.min(0, dragOverCounterRef.current - 1),
    }), []);

    const changeDragOverState = useCallback(() => {
        const newState = !!dragOverCounterRef.current;
        if (newState !== isDragOver) setIsDragOver(newState);
    }, [isDragOver]);
 
    const listeners = useMemo(() => ({
        handleDragEnter: (e: Event) => {
            console.log('enter');
            const event = e as DragEvent;
            if (!event.dataTransfer || event.dataTransfer.types.indexOf('Files') === -1) return;
            console.log('?', event.dataTransfer);
            counterHelpers.increase();
            changeDragOverState();
        },
        handleDragLeave: () => {
            counterHelpers.reduce();
            changeDragOverState();
        },
        handleDrop: (e: DragEvent) => {
            counterHelpers.reset();
            changeDragOverState();

            if (!e.dataTransfer?.files) return;

            encodeFiles(Object.values(e.dataTransfer.files), options).then(onFileDrop);
        },
    }), [changeDragOverState, counterHelpers, onFileDrop, options]);

    useEffect(() => {
        const target = targetRef.current;
        if (!target) return;

        target.addEventListener('dragenter', listeners.handleDragEnter);
        target.addEventListener('dragleave', listeners.handleDragLeave);
        document.addEventListener('drop', listeners.handleDrop);

        return () => {
            target.removeEventListener('dragenter', listeners.handleDragEnter);
            target.removeEventListener('dragleave', listeners.handleDragLeave);
            document.removeEventListener('drop', listeners.handleDrop);
        };
    }, [listeners]);
    
    return isDragOver;
};