import { Button, TabContext, TabContex } from '@components';
import { twClassNames } from '@utils';
import classNames from 'classnames';
import { FC, PropsWithChildren, useContext } from 'react';



interface TabNavigationButton extends PropsWithChildren {
    identifier: 'OnlineFriends' | 'AllFriends' | 'Blocked' | 'IncomingRequests';
}

const styles = {
    base: `px-2 py-0.5 rounded text-secondary 
    font-semibold transition-all duration-75 shrink-0`,
    active: 'text-primary bg-active',
    notActive: `hover:text-normal hover:bg-hover focus-visible:text-normal 
    focus-visible:bg-hover active:text-primary active:bg-active`,
};

export const TabNavigationButton: FC<TabNavigationButton> = ({ children, identifier }) => {
    const { changeTab, currentTab } = useContext(TabContex) as TabContext;
    const isActive = identifier === currentTab.identifier;
    const handleChangeTab = () => changeTab(identifier);

    return (
        <Button
            className={twClassNames(styles.base, {
                [styles.active]: isActive,
                [styles.notActive]: !isActive,
            })}
            isActive={isActive}
            onLeftClick={handleChangeTab}
        >
            {children}
        </Button>
    );
};