import { FC, useContext } from 'react';
import { Button, ChangeEmailModalTabs, Image, OverlayContext, TabContext } from '@components';
import { ModalHeader, ModalTitle, ModalContent, ModalFooter, ModalContainer } from '../../../../components';
import emailConfirmationImage from '@assets/email-confirmation.png';



const styles = {
    image: `absolute top-0 left-1/2 -translate-x-1/2 
    -translate-y-1/2 h-[140px] w-[140px] object-contain`,
    header: 'pt-16',
    content: 'pb-6 text-center gap-3.5',
    footer: 'flex-col',
    button: 'w-full',
};

export const RequestCodeSlide: FC = () => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;
    const { changeTab } = useContext(TabContext) as TabContext<ChangeEmailModalTabs>;

    const sendConfirmationCode = () => {
        console.log('send conf code');
        changeTab.enterCodeSlide();
    };

    const email = 'wow@mail.ru';

    return (
        <ModalContainer className='relative'>
            <Image
                className={styles.image}
                src={emailConfirmationImage}
            />
                                        
            <ModalHeader className={styles.header}>
                <ModalTitle>
                    <>Подтверждение адреса электронной почты</>
                </ModalTitle>
            </ModalHeader>

            <ModalContent className={styles.content}>
                <p>
                    <>Подтвердите свой прошлый адрес электронной почты </>
                    <strong>{email}</strong>
                    <>, чтобы его изменить.</>
                </p>

                <p>
                    <>Нет доступа к этому адресу? Обратитесь за </>
                    <>помощью к поставщику услуг электронной почты.</>
                </p>
            </ModalContent>

            <ModalFooter className={styles.footer}>
                <Button
                    className={styles.button}
                    stylingPreset='brand'
                    size='medium'
                    onLeftClick={sendConfirmationCode}
                >
                    <>Отправить код подтверждения</>
                </Button>

                <Button
                    className={styles.button}
                    stylingPreset='lite'
                    size='medium'
                    onLeftClick={closeOverlay}
                >
                    <>Отмена</>
                </Button>
            </ModalFooter>
        </ModalContainer>
    );
};