import { Button, ChangeEmailModal, ChangePasswordModal, ChangeUsernameModal, OverlayContextProvider, RefContextProvider } from '@components';
import { useToggle } from '@hooks';
import { Heading } from '@libs';
import { conditional } from '@utils';
import { FC } from 'react';



const styles = {
    list: 'flex flex-col gap-6 p-4 bg-primary-300 rounded-lg',
    row: 'flex w-full gap-4 items-center',
    infoWrapper: 'flex flex-col min-w-0 mr-auto',
    infoTitle: 'font-bold uppercase text-xs text-secondary mb-1',
    infoValueWrapper: 'flex gap-2',
    infoValue: 'text-primary truncated',
    revealInfoValueButton: 'text-link p-0 min-h-0 h-auto',
};

export const Content: FC = () => {
    const [isEmailRevealed, toggleIsEmailRevealed] = useToggle(false);

    const username = 'лошок111';
    const revealedEmail = 'wow@mail.ru';
    const splitedEmail = revealedEmail.split('@');
    const unrevealedEmail = '*'.repeat(splitedEmail[0].length) + '@' + splitedEmail[1];
    const email = conditional(revealedEmail, unrevealedEmail, isEmailRevealed);
    const revealEmailButtonText = conditional('Скрыть', 'Показать', isEmailRevealed);

    return (
        <ul className={styles.list}>
            <li className={styles.row}>
                <div className={styles.infoWrapper}>
                    <Heading className={styles.infoTitle}>
                        <>Имя пользователя</>
                    </Heading>

                    <div className={styles.infoValueWrapper}>
                        <span className={styles.infoValue}>
                            {username}
                        </span>
                    </div>
                </div>
    
                <OverlayContextProvider>
                    {({ openOverlay }) => (
                        <>
                            <Button
                                stylingPreset='brandNeutral'
                                label='Изменить имя'
                                hasPopup='dialog'
                                onLeftClick={openOverlay}
                            >
                                <>Изменить</>
                            </Button>

                            <ChangeUsernameModal/>
                        </>
                    )}
                </OverlayContextProvider>
            </li>

            <li className={styles.row}>
                <div className={styles.infoWrapper}>
                    <Heading className={styles.infoTitle}>
                        <>Электронная почта</>
                    </Heading>

                    <div className={styles.infoValueWrapper}>
                        <span className={styles.infoValue}>
                            {email}
                        </span>

                        <Button
                            className={styles.revealInfoValueButton}
                            stylingPreset='lite'
                            onLeftClick={toggleIsEmailRevealed}
                        >
                            {revealEmailButtonText}
                        </Button>
                    </div>
                </div>

                <OverlayContextProvider>
                    {({ openOverlay }) => (
                        <>
                            <Button
                                stylingPreset='brandNeutral'
                                label='Изменить электронную почту'
                                hasPopup='dialog'
                                onLeftClick={openOverlay}
                            >
                                <>Изменить</>
                            </Button>

                            <ChangeEmailModal/>
                        </>
                    )}
                </OverlayContextProvider>
            </li>

            <li className={styles.row}>
                <div className={styles.infoWrapper}>
                    <Heading className={styles.infoTitle}>
                        <>Пароль</>
                    </Heading>

                    <div className={styles.infoValueWrapper}>
                        <span className={styles.infoValue}>
                            <>********</>
                        </span>
                    </div>
                </div>
    
                <OverlayContextProvider>
                    {({ openOverlay }) => (
                        <>
                            <Button
                                stylingPreset='brandNeutral'
                                label='Изменить пароль'
                                hasPopup='dialog'
                                onLeftClick={openOverlay}
                            >
                                <>Изменить</>
                            </Button>

                            <ChangePasswordModal/>
                        </>
                    )}
                </OverlayContextProvider>
            </li>
        </ul>
    );
};