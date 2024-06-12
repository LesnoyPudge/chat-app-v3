import { ModalWindow } from '@components';
import { FC } from 'react';
import { Content } from '../Content';



export const SizeModal: FC = () => {
    return (
        <ModalWindow 
            label='Слишком большой размер' 
            withBackdrop
        >
            <Content
                className='bg-danger'
                header='Ваши файлы слишком большие'
                // todo считывать макс размер из контекста кастомной формы
                // а не хардкодить
                content='Максимальный размер файла: 8 МБ.'
            />
        </ModalWindow>
    );
};