import { FC, memo } from 'react';



export type MFC<T = any> = React.MemoExoticComponent<FC<T>>;

type WithMemoType = <T>(Component: FC<T>, displayName?: string) => React.MemoExoticComponent<FC<T>>

export const WithMemo: WithMemoType = (Component, displayName) => {
    const MemoizedComponent = memo(Component);
    MemoizedComponent.displayName = `Memoized${Component.displayName || Component.name || displayName || 'Component'}`;
    return MemoizedComponent;
};