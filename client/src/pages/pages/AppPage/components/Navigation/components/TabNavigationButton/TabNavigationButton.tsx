import { Button, ITabContext, TabContex } from '@components';
import classNames from 'classnames';
import { FC, PropsWithChildren, useContext } from 'react';



interface ITabNavigationButton extends PropsWithChildren {
    identifier: 'OnlineFriends' | 'AllFriends' | 'Blocked' | 'IncomingRequests';
}

export const TabNavigationButton: FC<ITabNavigationButton> = ({ children, identifier }) => {
    const { changeTab, currentTab } = useContext(TabContex) as ITabContext;
    const isActive = identifier === currentTab.identifier;
    const handleChangeTab = () => changeTab(identifier);

    return (
        <Button
            className={classNames(
                'px-2 py-0.5 rounded text-secondary font-semibold transition-all duration-75 shrink-0',
                {
                    'text-primary bg-active': isActive,
                    [`hover:text-normal hover:bg-hover focus-visible:text-normal 
                    focus-visible:bg-hover active:text-primary active:bg-active`]: !isActive,
                },
            )}
            isActive={isActive}
            isntStyled
            onClick={handleChangeTab}
        >
            {children}
        </Button>
    );
};