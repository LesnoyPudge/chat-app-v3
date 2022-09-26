import { ModalContext, IModalContext } from '@components';
import { FC, useContext } from 'react';
import { Modal } from '../../components/Modal';



export const AddFriendModal: FC = () => {
    const { closeModal } = useContext(ModalContext) as IModalContext;

    return (
        <Modal>
            <div className='bg-primary-500 p-4'>
                <div>add friend modal</div>
                <button onClick={closeModal}>close</button>
            </div>
        </Modal>
    );
};