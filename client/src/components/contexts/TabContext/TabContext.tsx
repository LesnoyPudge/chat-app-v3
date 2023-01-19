import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { createContext, ReactNode, useState } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';



type ProvidedTabs = Record<string, ReactNode>;

interface Tab {
    identifier: string;
    tab: ReactNode;
}

export interface TabContext<VALUES = ProvidedTabs> {
    tabs: Record<keyof VALUES, Tab>;
    currentTab: Tab;
    changeTab: Record<keyof VALUES, () => void>;
    isActive: Record<keyof VALUES, boolean>;
}

interface TabContextProvider<VALUES = ProvidedTabs> extends PropsWithChildrenAsNodeOrFunction<TabContext<VALUES>> {
    tabs: VALUES;
    initialTab?: keyof VALUES;
}

export const TabContext = createContext<TabContext | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TabContextProvider = <T extends ProvidedTabs>(props: TabContextProvider<T>) => {
    const { tabs, initialTab, children } = props;
    
    const getCurrentTab = (identifier: keyof T): Tab => ({
        identifier: identifier.toString(),
        tab: tabs[identifier],
    });

    const [currentTab, setCurrentTab] = useState<Tab>(
        () => getCurrentTab(initialTab?.toString() || Object.keys(tabs)[0]),
    );

    const changeTab = Object.keys(tabs).reduce((o, key) => ({ ...o, [key]: () => {
        if (key === currentTab.identifier) return;
        setCurrentTab(getCurrentTab(key));
    } }), {}) as Record<keyof T, () => void>;

    const transformedTabs = Object.keys(tabs).reduce((o, key) => ({ ...o, [key]: {
        identifier: key,
        tab: tabs[key],
    } }), {}) as Record<keyof T, Tab>;

    const isActive = Object.keys(tabs).reduce((o, key) => ({ 
        ...o, [key]: 
        currentTab.identifier === key, 
    }), {}) as Record<keyof T, boolean>;
    
    const contextValues: TabContext<T> = {
        tabs: transformedTabs,
        currentTab,
        changeTab,
        isActive,
    };

    return (
        <TabContext.Provider value={contextValues}>
            <ChildrenAsNodeOrFunction args={contextValues}>
                {children}
            </ChildrenAsNodeOrFunction>
        </TabContext.Provider>
    );
};