import { useEventListener } from 'usehooks-ts';



const preventDefault = (e: Event) => e.preventDefault();

export const usePreventDefault = () => {
    useEventListener('contextmenu', preventDefault);
    useEventListener('drop', preventDefault);
    useEventListener('dragover', preventDefault);
};