import { PickAnimated, SpringValues, useTransition, UseTransitionProps } from '@react-spring/web';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { ChildrenAsNodeOrFunction } from '@components';
import { getTransitionOptions } from '@utils';



type AnimatedTransition<T extends UseTransitionProps<boolean>> = PropsWithChildrenAsNodeOrFunction<{
    style: SpringValues<PickAnimated<T>>;
    isAnimatedExist: boolean;
}> & {
    isExist?: boolean;
    transitionOptions?: T;
}

const defaultTransitionOptions = getTransitionOptions.withOpacity();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AnimatedTransition = <T extends UseTransitionProps<boolean> | object>(props: AnimatedTransition<T>) => {
    const {
        transitionOptions = defaultTransitionOptions,
        isExist = true,
        children,
    } = props;

    const transition = useTransition(isExist, transitionOptions);
    
    return transition((style, isAnimatedExist) => (
        <ChildrenAsNodeOrFunction args={{ style, isAnimatedExist }}>
            {children}
        </ChildrenAsNodeOrFunction>
    ));
};