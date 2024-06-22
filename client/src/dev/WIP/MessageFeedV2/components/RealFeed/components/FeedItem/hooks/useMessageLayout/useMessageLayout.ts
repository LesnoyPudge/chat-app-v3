import { useContextSelectable } from "@lesnoypudge/utils-react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { FeedContext } from "../../../../../FeedContextProvider";
import { pick } from "@lesnoypudge/utils";



type useMessageLayoutProps = {
    id: string;
    isFocused: boolean;
}

export const useMessageLayout = ({
    id,
    isFocused,
}: useMessageLayoutProps) => {
    const messageWrapperRef = useRef<HTMLDivElement | null>(null);
    const messageRef = useRef<HTMLElement | null>(null);
    const {
        normalizedViewportItemRefs,
    } = useContextSelectable(FeedContext, (v) => pick(
        v,
        'normalizedViewportItemRefs',
    ))

    useEffect(() => {
        if (!messageRef.current || !messageWrapperRef.current) return;
        if (!normalizedViewportItemRefs.current) return;

        const refs = normalizedViewportItemRefs.current;

        refs.set(id, {
            messageRef,
            messageWrapperRef,
        });

        return () => {
            refs.delete(id);
        }; 
    }, [id, normalizedViewportItemRefs]);

    useLayoutEffect(() => {
        if (!messageRef.current) return;
        if (!isFocused) return;

        messageRef.current.focus({ preventScroll: true });
    }, [isFocused]);

    return {
        messageRef,
        messageWrapperRef
    }
}