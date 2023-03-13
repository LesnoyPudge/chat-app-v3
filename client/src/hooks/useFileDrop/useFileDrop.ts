import { isRef } from '@typeGuards';
import { useState, useRef, RefObject, useEffect, useCallback, useMemo } from 'react';



type UseFileDrop = (
    onFileDrop: (files: FileList | null) => void,
    element?: RefObject<HTMLElement> | HTMLElement,
) => boolean;

export const useFileDrop: UseFileDrop = (
    onFileDrop,
    element,
) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const dragOverCounterRef = useRef(0);
    const targetRef = useRef(isRef(element) ? element.current! : document);

    const counterHelpers = useMemo(() => ({
        reset: () => dragOverCounterRef.current = 0,
        increase:  () => dragOverCounterRef.current++,
        reduce:  () => dragOverCounterRef.current = Math.max(0, dragOverCounterRef.current - 1),
        isZero: () => dragOverCounterRef.current === 0,
    }), []);

    const changeDragOverState = useCallback(() => {
        const newState = !!dragOverCounterRef.current;
        if (newState !== isDragOver) setIsDragOver(newState);
    }, [isDragOver]);
 
    const listeners = useMemo(() => ({
        handleDragEnter: (e: Event) => {
            const event = e as DragEvent;
            
            if (!event.dataTransfer || event.dataTransfer.types.indexOf('Files') === -1) return;

            counterHelpers.increase();
            changeDragOverState();
        },
        handleDragLeave: () => {
            if (counterHelpers.isZero()) return;
            counterHelpers.reduce();
            changeDragOverState();
        },
        handleDrop: (e: DragEvent) => {
            if (counterHelpers.isZero()) return;
            counterHelpers.reset();
            changeDragOverState();

            if (!e.dataTransfer?.files) return;

            onFileDrop(e.dataTransfer.files);
        },
    }), [changeDragOverState, counterHelpers, onFileDrop]);

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