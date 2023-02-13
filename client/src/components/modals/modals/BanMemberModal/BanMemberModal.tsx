import { Button, ModalWindow, OverlayContext, TextArea } from '@components';
import { ChangeEvent, FC, useContext, useState } from 'react';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../components';



interface BanMemberModal {
    memberId: string;
    channelId: string;
}

export const BanMemberModal: FC<BanMemberModal> = ({
    memberId,
    channelId,
}) => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;
    const [value, setValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value);

    const member = {
        id: memberId,
        name: 'someMember',
    };

    const handleBan = () => console.log('ban');

    return (
        <ModalWindow 
            label={`Забанить пользователя ${member.name}`} 
            withBackdrop
        >
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle className='text-base text-color-primary font-semibold'>
                        <>Хотите заблокировать <strong>{member.name}</strong>?</>
                    </ModalTitle>
                </ModalHeader>

                <ModalContent>
                    <TextArea
                        value=''
                        maxLength={512}
                        onChange={() => ''}
                    />
                </ModalContent>

                <ModalFooter>
                    <Button
                        stylingPreset='lite'
                        size='medium'
                        onLeftClick={closeOverlay}
                    >
                        <>Отмена</>
                    </Button>

                    <Button
                        stylingPreset='brandDanger'
                        size='medium'
                        onLeftClick={handleBan}
                    >
                        <>Забанить</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};