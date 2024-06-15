import { ChildrenAsNodeOrFunction, OverlayContext, OverlayContextProvider } from "@components";
import { PropsWithChildrenAsNodeOrFunction } from "@types";
import { FC } from "react";
import { OverflowModal, SizeModal } from "..";




type ChildrenArgs = {
    sizeModalHelpers: OverlayContext;
    overflowModalHelpers: OverlayContext;
}

export const AlertOverlays: FC<PropsWithChildrenAsNodeOrFunction<ChildrenArgs>> = ({
    children,
}) => {
    return (
        <OverlayContextProvider>
            {(sizeModalHelpers) => (
                <>
                    <OverlayContextProvider>
                        {(overflowModalHelpers) => (
                            <>
                                <ChildrenAsNodeOrFunction args={{
                                    sizeModalHelpers,
                                    overflowModalHelpers,
                                }}>
                                    {children}
                                </ChildrenAsNodeOrFunction>

                                <OverflowModal/>
                            </>
                        )}
                    </OverlayContextProvider>

                    <SizeModal/>
                </>
            )}
        </OverlayContextProvider>
    );
};