import { useEventListener, useStateAndRef, useLatest } from '@hooks';
import { useRef, RefObject } from 'react';



type UseFileDrop = (
    onFileDrop: (files: FileList | null) => void,
    element: RefObject<HTMLElement>,
) => boolean;

export const useFileDrop: UseFileDrop = (
    onFileDrop,
    element,
) => {
    const [isDragOver, isDragOverRef, setIsDragOver] = useStateAndRef(false);
    const dragOverCounterRef = useRef(0);
    const onFileDropSaved = useLatest(onFileDrop);

    const counterHelpersRef = useRef({
        reset: () => dragOverCounterRef.current = 0,
        increase:  () => dragOverCounterRef.current++,
        reduce:  () => dragOverCounterRef.current = Math.max(0, dragOverCounterRef.current - 1),
        isZero: () => dragOverCounterRef.current === 0,
    });

    const changeDragOverStateRef = useRef(() => {
        const newState = !!dragOverCounterRef.current;
        if (newState === isDragOverRef.current) return;
        setIsDragOver(newState);
    });

    const listenersRef = useRef({
        handleDragEnter: (e: DragEvent) => {
            if (!e.dataTransfer || e.dataTransfer.types.indexOf('Files') === -1) return;

            counterHelpersRef.current.increase();
            changeDragOverStateRef.current();
        },
        handleDragLeave: () => {
            if (counterHelpersRef.current.isZero()) return;
            counterHelpersRef.current.reduce();
            changeDragOverStateRef.current();
        },
        handleDrop: (e: DragEvent) => {
            if (counterHelpersRef.current.isZero()) return;
            counterHelpersRef.current.reset();
            changeDragOverStateRef.current();

            if (!e.dataTransfer?.files) return;

            onFileDropSaved.current(e.dataTransfer.files);
        },
    });

    useEventListener('dragenter', listenersRef.current.handleDragEnter, element);
    useEventListener('dragleave', listenersRef.current.handleDragLeave, element);
    useEventListener('drop', listenersRef.current.handleDrop, element);

    return isDragOver;
};