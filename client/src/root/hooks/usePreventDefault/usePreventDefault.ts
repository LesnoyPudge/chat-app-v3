import { useEventListener } from 'usehooks-ts';



export const usePreventDefault = () => {
    const preventDefault = (e: Event) => e.preventDefault();

    // useEventListener('contextmenu', preventDefault);
    useEventListener('drop', preventDefault);
    useEventListener('dragover', preventDefault);
};