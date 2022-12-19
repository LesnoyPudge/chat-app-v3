import { ChildrenAsNodeOrFunction } from '@components';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { createContext, FC, ReactNode, useState } from 'react';



export interface Tab {
    tab: ReactNode;
    identifier: string;
}

interface TabContexProvider extends PropsWithChildrenAsNodeOrFunction<TabContext> {
    tabs: Tab[];
    initialTabIdentifier?: string;
}

export interface TabContext {
    currentTab: Tab;
    tabs: Tab[];
    changeTab: (nextTab: string) => void;
}

export const TabContex = createContext<TabContext | undefined>(undefined);

export const TabContexProvider: FC<TabContexProvider> = ({ 
    children, 
    tabs, 
    initialTabIdentifier = tabs[0].identifier, 
}) => {
    const getTabByIdentifier = (identifier: string) => tabs.find((tab) => tab.identifier === identifier) || tabs[0];
    
    const [currentTab, setCurrentTab] = useState(() => getTabByIdentifier(initialTabIdentifier));

    const changeTab = (nextTabIdentifier: string) => {
        if (nextTabIdentifier === currentTab.identifier) return;
        setCurrentTab(getTabByIdentifier(nextTabIdentifier));
    };

    const contextValues: TabContext = {
        currentTab,
        tabs,
        changeTab,
    };

    return (
        <TabContex.Provider value={contextValues}>
            <ChildrenAsNodeOrFunction args={contextValues}>
                {children}
            </ChildrenAsNodeOrFunction>
        </TabContex.Provider>
    );
};