import { ModalWindow } from '@components';
import { FC } from 'react';



export const AddFriendModal: FC = () => {
    return (
        <ModalWindow withBackdrop>
            {({ closeOverlay }) => (
                <div className='bg-primary-500 p-4'>
                    <div>add friend modal</div>
                    <button onClick={closeOverlay}>close</button>
                </div>
            )}
        </ModalWindow>
    );
};