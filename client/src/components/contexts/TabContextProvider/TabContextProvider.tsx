import { Conditional } from '@components';
import { twClassNames } from '@utils';
import classNames from 'classnames';
import { createContext, FC, ReactNode, useState } from 'react';



export interface ITab {
    tab: ReactNode;
    identifier: string;
}

interface ITabContexProviderProps {
    children?: (args: ITabContext) => JSX.Element;
    tabs: ITab[];
    initialTabIdentifier?: string;
}

export interface ITabContext {
    currentTab: ITab;
    tabs: ITab[];
    changeTab: (nextTab: string) => void;
}

export const TabContex = createContext<ITabContext | undefined>(undefined);

export const TabContexProvider: FC<ITabContexProviderProps> = ({ 
    children, 
    tabs, 
    initialTabIdentifier = tabs[0].identifier, 
}) => {
    const getTabByIdentifier = (identifier: string) => tabs.find((tab) => tab.identifier === identifier) || tabs[0];
    
    const [currentTab, setCurrentTabIdentifier] = useState(getTabByIdentifier(initialTabIdentifier));

    const changeTab = (nextTabIdentifier: string) => {
        if (nextTabIdentifier === currentTab.identifier) return;
        setCurrentTabIdentifier(getTabByIdentifier(nextTabIdentifier));
    };

    const contextValues: ITabContext = {
        currentTab,
        tabs,
        changeTab,
    };

    return (
        <TabContex.Provider value={contextValues}>
            <Conditional isRendered={!!children}>
                {children && children({ ...contextValues })} 
            </Conditional>
            
            <Conditional isRendered={!children}>
                {tabs.map(({ tab, identifier }) => {
                    const isHidden = currentTab.identifier !== identifier;
                    const className = twClassNames('contents', { 'hidden': isHidden });

                    return (
                        <div
                            className={className}
                            key={identifier} 
                        >
                            {tab}
                        </div>
                    );
                })}
            </Conditional>
        </TabContex.Provider>
    );
};