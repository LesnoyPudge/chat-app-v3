import { useTransition, UseTransitionProps } from '@react-spring/web';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { FC } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';



type AnimatedTransition = PropsWithChildrenAsNodeOrFunction<{
    style: Record<string, any>;
    isAnimatedExist: boolean;
}> & {
    isExist?: boolean;
    transitionOptions?: UseTransitionProps<boolean>;
}

const defaultTransitionOptions: UseTransitionProps<boolean> = {
    from: {
        opacity: 0,
    },
    enter: {
        opacity: 1,
    },
    leave: {
        opacity: 0,
    },
};

export const AnimatedTransition: FC<AnimatedTransition> = ({
    isExist = true,
    transitionOptions = defaultTransitionOptions,
    children,
}) => {
    const transition = useTransition(isExist, transitionOptions);

    return transition((style, isAnimatedExist) => (
        <ChildrenAsNodeOrFunction args={{ style, isAnimatedExist }}>
            {children}
        </ChildrenAsNodeOrFunction>
    ));
};