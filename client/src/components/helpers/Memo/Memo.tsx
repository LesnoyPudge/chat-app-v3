import isObject from 'is-object';
import { memo, PropsWithChildren } from 'react';
import { shallowEqual } from 'react-redux';



export const Memo = memo<PropsWithChildren>(({ children }) => {
    return (
        <>
            {children}
        </>
    );
}, (f, s) => {
    if (isObject(f.children) && isObject(s.children)) {
        return shallowEqual(f.children.props, s.children.props);
    }

    return shallowEqual(f.children, s.children);
});

Memo.displayName = 'Memo';
