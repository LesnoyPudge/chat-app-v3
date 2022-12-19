import { ModalWindow } from '@components';
import { FC } from 'react';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../components';



export const AddFriendModal: FC = () => {
    return (
        <ModalWindow withBackdrop>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>
                        title
                    </ModalTitle>

                    <ModalSubtitle>
                        subtitle
                    </ModalSubtitle>
                </ModalHeader>

                <ModalContent>
                    content
                </ModalContent>

                <ModalFooter>
                    footer
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};