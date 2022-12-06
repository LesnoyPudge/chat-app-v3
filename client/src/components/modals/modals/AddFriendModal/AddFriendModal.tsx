import { ModalWindow, OverlayContext } from '@components';
import { FC, useContext } from 'react';



export const AddFriendModal: FC = () => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;

    return (
        <ModalWindow>
            <div className='bg-primary-500 p-4'>
                <div>add friend modal</div>
                <button onClick={closeOverlay}>close</button>
            </div>
        </ModalWindow>
    );
};