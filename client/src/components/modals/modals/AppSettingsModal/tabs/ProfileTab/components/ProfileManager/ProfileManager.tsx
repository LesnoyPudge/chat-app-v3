import { Button } from '@components';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { SettingsGroup } from '../../../components';
import { Banner, Header, Content } from './components';



const styles = {
    wrapper: 'flex flex-col',
    userInfo: 'flex flex-col gap-4 p-4 bg-primary-500 rounded-b-lg',
    content: 'flex flex-col gap-6 p-4 bg-primary-300 rounded-lg',
};

export const ProfileManager: FC<PropsWithClassName> = ({
    className = '',
}) => {
    return (
        <SettingsGroup>
            <div className={twClassNames(styles.wrapper, className)}>
                <Banner/>
                
                <div className={styles.userInfo}>
                    <Header/>

                    <Content/>
                </div>
            </div>
        </SettingsGroup>
    );
};