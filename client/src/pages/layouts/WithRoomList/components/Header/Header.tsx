import { Button, Conditional, Icon, TopBar } from '@components';
import { useNavigator, useToggle } from '@hooks';
import { conditional, twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    topBar: 'relative px-4 hover:bg-hover',
    button: 'flex justify-between items-center w-full h-full',
};

export const Header: FC = () => {
    const { params } = useNavigator();
    const [isOpen, toggleIsOpen] = useToggle();

    const iconId = conditional('cross-icon', 'dropdown-arrow-icon', isOpen);
    const channelLabel = `Канал ${params.channelId} ${params.roomId}`;
    
    return (
        <TopBar className={twClassNames(styles.topBar, { 'bg-hover': isOpen })}>
            <Button
                className={styles.button}
                onLeftClick={toggleIsOpen}
            >
                <span className='font-semibold text-primary'>
                    {channelLabel}
                </span>

                <Icon
                    className='w-4 h-4 fill-icon-100'
                    iconId={iconId}
                />
            </Button>

            <Conditional isRendered={isOpen}>
                <div className='absolute top-full left-0 translate-y-[8px] w-full px-4'>
                    <ul className='bg-primary-500 h-full py-1.5 px-2 rounded-md'>
                        <li>
                            <Button>
                                <>Пригласить друзей</>
                            </Button>
                        </li>
                        
                        <li>
                            <Button>
                                <>Настройки канала</>
                            </Button>
                        </li>

                        <li>
                            <Button>
                                <>Покинуть канал</>
                            </Button>
                        </li>

                        <li>
                            <Button>
                                <>Удалить канал</>
                            </Button>
                        </li>
                    </ul>
                </div>
            </Conditional>
        </TopBar>
    );
};