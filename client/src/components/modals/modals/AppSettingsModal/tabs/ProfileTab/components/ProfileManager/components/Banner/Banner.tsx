import { Button, Icon, ModalContextProvider, RefContextProvider, Tooltip } from '@components';
import { twClassNames } from '@utils';
import { FC, useState } from 'react';
import { ColorPicker } from './components';



const styles = {
    banner: `flex justify-end items-start p-4 h-[100px] 
    w-full rounded-t-lg`,
    bannerButton: {
        base: `flex w-10 h-10 bg-primary-300 rounded-full 
        fill-icon-200 hover:fill-icon-100 focus-visible:fill-icon-100`,
        active: 'fill-icon-100',
    },
    bannerIcon: 'w-4 h-4 m-auto transition-none',
};

export const Banner: FC = () => {
    const [bannerColor, setBannerColor] = useState('#ffffff');

    return (
        <div className={styles.banner} style={{ backgroundColor: bannerColor }}>
            <ModalContextProvider>
                {({ toggleModal, isOpen }) => (
                    <RefContextProvider>
                        <Button
                            className={twClassNames(
                                styles.bannerButton.base, 
                                {
                                    [styles.bannerButton.active]: isOpen,
                                },
                            )}
                            isntStyled
                            onClick={toggleModal}
                        >
                            <Icon
                                className={styles.bannerIcon}
                                iconId='dropper-icon'
                            />
                        </Button>

                        <ColorPicker
                            color={bannerColor}
                            onChange={setBannerColor}
                        />

                        <Tooltip position='top'>
                            <>Изменить цвет баннера</>
                        </Tooltip>
                    </RefContextProvider>
                )}
            </ModalContextProvider>
        </div>
    );
};