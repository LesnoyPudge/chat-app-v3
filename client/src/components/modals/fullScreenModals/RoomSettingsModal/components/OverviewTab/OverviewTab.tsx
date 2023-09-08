import { FormikCheckBox, FormikTextInput, Heading } from '@libs';
import { FC, useCallback } from 'react';
import { Button, CheckBox, CheckBoxIndicatorSlide, FieldLabel,SpriteImage, OverlayContextProvider, RoomSettingsModalFormValues, RoomWhitelistModal, Separator, TextInput, ErrorInLabel, RequiredWildcard } from '@components';
import { TabTitle } from '../../../components';
import { twClassNames } from '@utils';
import { AllowedRolesAndMembers } from './components';
import { useFormikContext } from 'formik';
import { SliceEntityState } from '@types';



const styles = {
    wrapper: 'pt-[60px] pl-10',
    inner: 'rounded overflow-hidden',
    topSide: {
        base: 'p-4 bg-primary-300 transition-all',
        checked: 'bg-primary-500',
    },
    checkBoxInner: 'flex items-center gap-2',
    checkBoxIcon: 'w-5 h-5 fill-icon-100',
    checkBoxText: 'font-semibold',
    checkBox: 'ml-auto',
    description: 'text-xs mt-2.5',
    bottomSide: 'bg-primary-300',
    bottomFirst: 'p-4 flex gap-2 justify-between items-center',
    bottomFirstText: 'text-xs font-bold uppercase',
    separator: 'mx-4',
};

export const OverviewTab: FC = () => {
    const { values, setFieldValue } = useFormikContext<RoomSettingsModalFormValues>();

    const setValue = useCallback((whiteList: Pick<SliceEntityState.Room, 'whiteList'>['whiteList']) => {
        setFieldValue('whiteList', whiteList);
    }, [setFieldValue]);

    return (
        <div className={styles.wrapper}>
            <TabTitle>
                <>Обзор</>
            </TabTitle>

            <FormikTextInput
                name='name'
                label='Название комнаты'
            >
                {(props) => (
                    <>
                        <FieldLabel htmlFor={props.id}>
                            {props.label}

                            <RequiredWildcard/>

                            <ErrorInLabel error={props.error}/>
                        </FieldLabel>

                        <TextInput
                            {...props}
                        />
                    </>
                )}
            </FormikTextInput>

            <Separator spacing={32}/>

            <FormikCheckBox
                name='isPrivate'
                label='Настройки приватности комнаты'
            >
                {(props) => (
                    <div className={styles.inner}>
                        <div
                            className={twClassNames(
                                styles.topSide.base,
                                { [styles.topSide.checked]: props.checked },
                            )}
                        >
                            <div className={styles.checkBoxInner}>
                                <SpriteImage
                                    className={styles.checkBoxIcon}
                                    name='LOCK_ICON'
                                />

                                <span className={styles.checkBoxText}>
                                    <>Приватная комната</>
                                </span>

                                <CheckBox
                                    className={styles.checkBox}
                                    {...props}
                                >
                                    <CheckBoxIndicatorSlide
                                        checked={props.checked}
                                    />
                                </CheckBox>
                            </div>

                            <div className={styles.description}>
                                <>Если сделать комнату приватной, только выбранные </>
                                <>вами участники и роли смогут просматривать её.</>
                            </div>
                        </div>

                        <If condition={props.checked}>
                            <div className={styles.bottomSide}>
                                <div className={styles.bottomFirst}>
                                    <Heading className={styles.bottomFirstText}>
                                        <>Кто может получать доступ к этой комнате?</>
                                    </Heading>

                                    <OverlayContextProvider>
                                        {({ isOverlayExist, openOverlay }) => (
                                            <>
                                                <Button
                                                    hasPopup='dialog'
                                                    isActive={isOverlayExist}
                                                    label='Добавить участников или роли'
                                                    stylingPreset='brand'
                                                    size='medium'
                                                    onLeftClick={openOverlay}
                                                >
                                                    <>Добавить участников или роли</>
                                                </Button>

                                                <RoomWhitelistModal
                                                    whiteList={values.whiteList}
                                                    handleChange={setValue}
                                                />
                                            </>
                                        )}
                                    </OverlayContextProvider>
                                </div>

                                <Separator
                                    className={styles.separator}
                                    spacing={0}
                                />

                                <AllowedRolesAndMembers/>
                            </div>
                        </If>
                    </div>
                )}
            </FormikCheckBox>
        </div>
    );
};