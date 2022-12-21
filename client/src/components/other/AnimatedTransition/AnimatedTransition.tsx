import { useTransition, UseTransitionProps } from '@react-spring/web';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { FC } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';
import { getTransitionOptions } from '@utils';



type AnimatedTransition = PropsWithChildrenAsNodeOrFunction<{
    style: Record<string, never>;
    isAnimatedExist: boolean;
}> & {
    isExist?: boolean;
    transitionOptions?: UseTransitionProps<boolean>;
}

const defaultTransitionOptions = getTransitionOptions.withOpacity();

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