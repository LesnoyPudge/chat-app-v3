import { FC } from 'react';
import { ModalWindow } from '@components';
import { Content } from '../Content';



export const OverflowModal: FC = () => {
    return (
        <ModalWindow 
            label='Слишком много вложений' 
            withBackdrop
            noContainerPointerEvents
        >
            <Content
                className='bg-danger'
                header='Слишком много вложений!'
                content='Вы можете загрузить не более 9 файлов одновременно!'
            />
        </ModalWindow>
    );
};