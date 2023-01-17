import { FC, useContext } from 'react';
import { Conditional, Button, OverlayContext, CreateRoomFormValues, TabContext, CheckBoxIndicator, RadioInputIndicator, Icon, FieldLabel, RequiredWildcard, ErrorMessage, TextInput } from '@components';
import { ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../../../../components';
import { FormikContextType, useFormikContext } from 'formik';
import { Heading, FormikRadioInput, FormikCheckBox, FormikTextInput } from '@libs';



const styles = {
    title: 'text-heading-l self-start font-medium',
    content: 'gap-5',
    radioGroup: 'flex flex-col gap-2',
    heading: 'text-xs uppercase text-secondary font-bold',
    radioWrapper: 'flex items-center gap-2.5 w-full',
    radioIcon: 'w-4 h-4 fill-icon-200',
    radioTitle: 'font-medium text-primary',
    radioDescription: 'text-sm mt-0.5',
    checkBoxContent: 'flex justify-between items-center text-primary font-medium',
    checkBoxInfo: 'flex gap-1 items-center',
    checkBoxIcon: 'w-4 h-4 fill-icon-200',
    checkBoxExtraInfo: 'text-sm text-muted mt-2',
};

export const CreateRoomTab: FC = () => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;
    const { changeTab } = useContext(TabContext) as TabContext;
    const { values } = useFormikContext() as FormikContextType<CreateRoomFormValues>;

    const handleGoToNextStep = () => changeTab('AddWhiteListTab');

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
                        name='roomType'
                        value='text'
                        label='Текстовый тип комнаты'
                    >
                        {({ checked }) => (
                            <>
                                <div className={styles.radioWrapper}>
                                    <Icon
                                        className={styles.radioIcon}
                                        iconId='text-room-icon'
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
                        name='roomType'
                        value='voice'
                        label='Голосовой тип комнаты'
                    >
                        {({ checked }) => (
                            <>
                                <div className={styles.radioWrapper}>
                                    <Icon
                                        className={styles.radioIcon}
                                        iconId='text-room-icon'
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
                    {(textInputProps) => (
                        <div>
                            <FieldLabel htmlFor={textInputProps.id}>
                                <>Название комнаты</>
    
                                <RequiredWildcard/>
    
                                <ErrorMessage hidden={!textInputProps.error}>
                                    {textInputProps.error}
                                </ErrorMessage>
                            </FieldLabel>
        
                            <TextInput {...textInputProps}/>
                        </div>
                    )}
                </FormikTextInput>

                <div>
                    <FormikCheckBox 
                        name='isPrivate'
                        label='Название канала'                    
                    >
                        {({ checked }) => (
                            <div className={styles.checkBoxContent}>
                                <div className={styles.checkBoxInfo}>
                                    <Icon
                                        className={styles.checkBoxIcon}
                                        iconId='lock-icon'
                                    />

                                    <span>Приватная комната</span>
                                </div>

                                <CheckBoxIndicator checked={checked}/>
                            </div>
                        )}
                    </FormikCheckBox>

                    <div className={styles.checkBoxExtraInfo}>
                        <>Только выбранные участники и участники </>
                        <>с выбранными ролями смогут просматривать этот канал.</>
                    </div>
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

                <Conditional isRendered={!values.isPrivate}>
                    <Button
                        stylingPreset='brand'
                        size='medium'
                        type='submit'
                    >
                        <>Создать комнату</>
                    </Button>
                </Conditional>

                <Conditional isRendered={values.isPrivate}>
                    <Button
                        stylingPreset='brand'
                        size='medium'
                        onLeftClick={handleGoToNextStep}
                    >
                        <>Далее</>
                    </Button>
                </Conditional>
            </ModalFooter>
        </>
    );
};