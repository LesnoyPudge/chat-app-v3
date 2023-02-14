import { SearchBar, TabContextProvider } from '@components';
import { FC } from 'react';
import { Content, Navigation } from './components';
import { useTextInput } from '@hooks';



export type AppPageTabs = typeof tabs;

const tabs = {
    onlineFriends: '',
    allFriends: '',
    friendRequests: '',
    blocked: '',
};

const styles = {
    wrapper: 'flex flex-col h-full py-4 px-5 overflow-hidden',
    searchBar: 'w-auto h-9 mx-2.5 mb-5',
};

export const AppPage: FC = () => {
    const { value, handleChange, handleReset } = useTextInput();
    
    return (
        <TabContextProvider tabs={tabs}>
            <Navigation/>
            
            <div className={styles.wrapper + ''}>
                <SearchBar
                    className={styles.searchBar}
                    placeholder='Поиск по имени'
                    label='Имя пользователя'
                    value={value}
                    onChange={handleChange}
                    onReset={handleReset}
                />

                <Content value={value}/>
            </div>
            
        </TabContextProvider>
    );
};