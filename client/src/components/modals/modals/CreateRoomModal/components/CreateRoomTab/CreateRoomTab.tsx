import { FC, useContext } from 'react';
import { Button, OverlayContext, CreateRoomFormValues, TabContext, CheckBoxIndicatorSlide, RadioInputIndicator,SpriteImage, FieldLabel, RequiredWildcard, ErrorInLabel, TextInput, CreateRoomModalTabs, CheckBox, FormError, MutationErrorContext } from '@components';
import { ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../../../../components';
import { useFormikContext } from 'formik';
import { Heading, FormikRadioInput, FormikCheckBox, FormikTextInput } from '@libs';



const styles = {
    title: 'text-heading-l self-start font-medium',
    content: 'gap-5',
    radioGroup: 'flex flex-col gap-2',
    heading: 'text-xs uppercase text-color-secondary font-bold',
    radioWrapper: 'flex items-center gap-2.5 w-full',
    radioIcon: 'w-4 h-4 fill-icon-200',
    radioTitle: 'font-medium text-color-primary',
    radioDescription: 'text-sm mt-0.5',
    checkBoxContent: 'flex justify-between items-center text-color-primary font-medium',
    checkBoxInfo: 'flex gap-1 items-center',
    checkBoxIcon: 'w-4 h-4 fill-icon-200',
    checkBoxExtraInfo: 'text-sm text-color-muted mt-2',
    formError: 'mt-4',
};

export const CreateRoomTab: FC = () => {
    const { closeOverlay } = useContext(OverlayContext);
    const { changeTab } = useContext<TabContext<CreateRoomModalTabs>>(TabContext);
    const { values, isSubmitting, isValid, setTouched, validateForm } = useFormikContext<CreateRoomFormValues>();
    const error = useContext(MutationErrorContext);

    const handleNextStep = async() => {
        setTouched({ name: true }, false);
        await validateForm();

        if (isValid) changeTab.addWhiteListTab();
    };

    return (
        <>
            <ModalHeader>
                <ModalTitle className={styles.title}>
                    <>Создать комнату</>
                </ModalTitle>
            </ModalHeader>

            <ModalContent className={styles.content}>
                <div className={styles.radioGroup}>
                    <Heading className={styles.heading}>
                        <>Тип комнаты</>
                    </Heading>

                    <FormikRadioInput
                        name='type'
                        value='text'
                        label='Текстовый тип комнаты'
                    >
                        {({ checked }) => (
                            <>
                                <div className={styles.radioWrapper}>
                                    <SpriteImage
                                        className={styles.radioIcon}
                                        name='TEXT_ROOM_ICON'
                                    />

                                    <div>
                                        <div className={styles.radioTitle}>
                                            <>Text</>
                                        </div>

                                        <div className={styles.radioDescription}>
                                            <>Отправляйте сообщения, изображения, </>
                                            <>GIF, эмодзи, мнения и приколы</>
                                        </div>
                                    </div>
                                </div>

                                <RadioInputIndicator checked={checked}/>
                            </>
                        )}
                    </FormikRadioInput>

                    <FormikRadioInput
                        name='text'
                        value='voice'
                        label='Голосовой тип комнаты'
                    >
                        {({ checked }) => (
                            <>
                                <div className={styles.radioWrapper}>
                                    <SpriteImage
                                        className={styles.radioIcon}
                                        name='TEXT_ROOM_ICON'
                                    />

                                    <div>
                                        <div className={styles.radioTitle}>
                                            <>Voice</>
                                        </div>

                                        <div className={styles.radioDescription}>
                                            <>Общайтесь голосом или в видеочате и </>
                                            <>пользуйтесь функцией показа экрана</>
                                        </div>
                                    </div>
                                </div>

                                <RadioInputIndicator checked={checked}/>
                            </>
                        )}
                    </FormikRadioInput>
                </div>

                <FormikTextInput
                    name='name'
                    label='Название комнаты'
                    placeholder='новая-комната'
                    required
                >
                    {(props) => (
                        <div>
                            <FieldLabel htmlFor={props.id}>
                                {props.label}

                                <RequiredWildcard/>

                                <ErrorInLabel error={props.error}/>
                            </FieldLabel>

                            <TextInput {...props}/>
                        </div>
                    )}
                </FormikTextInput>

                <div>
                    <FormikCheckBox
                        name='isPrivate'
                        label='Название канала'
                    >
                        {(props) => (
                            <CheckBox {...props}>
                                <div className={styles.checkBoxContent}>
                                    <div className={styles.checkBoxInfo}>
                                        <SpriteImage
                                            className={styles.checkBoxIcon}
                                            name='LOCK_ICON'
                                        />

                                        <span>Приватная комната</span>
                                    </div>

                                    <CheckBoxIndicatorSlide checked={props.checked}/>
                                </div>
                            </CheckBox>
                        )}
                    </FormikCheckBox>

                    <div className={styles.checkBoxExtraInfo}>
                        <>Только выбранные участники и участники </>
                        <>с выбранными ролями смогут просматривать этот канал.</>
                    </div>

                    <FormError
                        className={styles.formError}
                        error={error}
                    />
                </div>
            </ModalContent>

            <ModalFooter>
                <Button
                    stylingPreset='lite'
                    size='medium'
                    onLeftClick={closeOverlay}
                >
                    <>Отмена</>
                </Button>

                <If condition={!values.isPrivate}>
                    <Button
                        stylingPreset='brand'
                        size='medium'
                        type='submit'
                        isLoading={isSubmitting}
                    >
                        <>Создать комнату</>
                    </Button>
                </If>

                <If condition={values.isPrivate}>
                    <Button
                        stylingPreset='brand'
                        size='medium'
                        isLoading={isSubmitting}
                        onLeftClick={handleNextStep}
                    >
                        <>Далее</>
                    </Button>
                </If>
            </ModalFooter>
        </>
    );
};