import { FC, useContext } from 'react';
import { Conditional, Button, OverlayContext, CreateRoomFormValues, TabContext, CheckBoxIndicator, RadioInputIndicator, Icon, FieldLabel, PasswordTextToggleButton, PasswordTextToggle, RequiredWildcard, ErrorMessage, TextInputWrapper } from '@components';
import { ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../../../../components';
import { FormikContextType, useFormikContext } from 'formik';
import { Heading, FormikRadioInput, FormikCheckBox, FormikTextInput } from '@libs';
import { TI } from 'src/components/inputs/TextInput/TI';



const styles = {
    content: 'gap-5',
    radioGroup: 'flex flex-col gap-2',
    heading: 'text-xs uppercase text-secondary font-bold',
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
                <ModalTitle>
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
                                <div className='flex items-center gap-3 w-full'>
                                    <Icon
                                        className='w-4 h-4 fill-icon-200'
                                        iconId='text-room-icon'
                                    />
                                    
                                    <div>
                                        <strong>text</strong>

                                        <div>some bullshit</div>
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
                                <div className='flex items-center gap-3 w-full'>
                                    <Icon
                                        className='w-4 h-4 fill-icon-200'
                                        iconId='voice-room-icon'
                                    />
                                    
                                    <div>
                                        <strong>voice</strong>

                                        <div>some bullshit 2</div>
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
                    placeholder='новыая-комната'
                    required
                />

                <PasswordTextToggle initialType='password'>
                    {({ type, toggleType }) => (
                        <div>
                            <FieldLabel htmlFor='1'>
                                <>Password Field</>

                                <RequiredWildcard/>

                                <ErrorMessage>
                                    <>Необходимо заполнить поле</>
                                </ErrorMessage>
                            </FieldLabel>
    
                            <TextInputWrapper>
                                <TI
                                    name='name'
                                    label='Some'
                                    type={type}
                                    id='1'
                                />
    
                                <PasswordTextToggleButton
                                    type={type}
                                    onToggle={toggleType}
                                />
                            </TextInputWrapper>
                        </div>
                    )}
                </PasswordTextToggle>

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