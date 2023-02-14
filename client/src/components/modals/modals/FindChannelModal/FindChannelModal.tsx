import { FC, useContext } from 'react';
import { Button, ModalWindow, OverlayContext, SearchBar } from '@components';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../components';
import { useTextInput } from '@hooks';



export const FindChannelModal: FC = () => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;
    const { value, handleChange, handleReset } = useTextInput();

    return (
        <ModalWindow label='Поиск каналов' withBackdrop>
            <ModalContainer className='w-[min(620px,calc(100vw-40px))]'>
                <ModalHeader>
                    <ModalTitle>
                        <>Поиск публичных каналов каналов</>
                    </ModalTitle>
                </ModalHeader>

                <ModalContent>
                    <SearchBar
                        placeholder='Введите название канала'
                        label='Поиск по названию канала'
                        value={value}
                        onChange={handleChange}
                        onReset={handleReset}
                    />
                </ModalContent>

                <ModalFooter>
                    <Button
                        stylingPreset='brandNeutral'
                        size='medium'
                        onLeftClick={closeOverlay}
                    >
                        <>Закрыть</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};