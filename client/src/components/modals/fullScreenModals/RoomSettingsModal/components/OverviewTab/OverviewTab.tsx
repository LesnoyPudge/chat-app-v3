import { FormikCheckBox, FormikTextInput, Heading } from '@libs';
import { FC } from 'react';
import { Button, CheckBox, CheckBoxIndicatorSlide, Conditional, FieldLabel, Icon, OverlayContextProvider, RoomSettingsModalFormValues, RoomWhitelistModal, Separator, TextInput } from '@components';
import { TabTitle } from '../../../components';
import { twClassNames } from '@utils';
import { AllowedRolesAndMembers } from './components';
import { useFormikContext } from 'formik';



const styles = {
    wrapper: 'pt-[60px] pl-10',
};

export const OverviewTab: FC = () => {
    const { values, setFieldValue } = useFormikContext<RoomSettingsModalFormValues>();

    const members = Array(10).fill(null).map((_, i) => ({
        id: i.toString(),
        username: `username ${i}`,
        avatar: 'https://i.pravatar.cc/50',
    }));

    const roles = Array.from(values.allowedRoles).map((_, i) => ({
        id: i.toString(),
        name: `role name ${i}`,
        color: 'red',
    }));

    const onSubmit = ({
        members,
        roles,
    }: {
        members: Set<string>;
        roles: Set<string>;
    }) => {
        const newRoles = new Set([...Array.from(roles), ...Array.from(values.allowedRoles)]);
        const newMembers = new Set([...Array.from(members), ...Array.from(values.allowedMembers)]);
        setFieldValue('allowedRoles', newRoles);
        setFieldValue('allowedMembers', newMembers);
    };

    return (
        <div className={styles.wrapper}>
            <TabTitle>
                <>Обзор</>
            </TabTitle>
            
            <FormikTextInput
                name='roomName'
                label='Название комнаты'
            >
                {(props) => (
                    <>
                        <FieldLabel htmlFor={props.id}>
                            {props.label}
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
                    <div className='rounded overflow-hidden'>
                        <div className={twClassNames('p-4 bg-primary-300 transition-all', {
                            'bg-primary-500': props.checked,
                        })}>
                            <div className='flex items-center gap-2'>
                                <Icon
                                    className='w-5 h-5 fill-icon-100'
                                    iconId='lock-icon'
                                />

                                <span className='font-semibold'>
                                    <>Приватная комната</>
                                </span>

                                <CheckBox
                                    className='ml-auto'
                                    {...props}
                                >
                                    <CheckBoxIndicatorSlide
                                        checked={props.checked}
                                    />
                                </CheckBox>
                            </div>

                            <div className='text-xs mt-2.5'>
                                <>Если сделать комнату приватной, только выбранные </>
                                <>вами участники и роли смогут просматривать её.</>
                            </div>
                        </div>

                        <Conditional isRendered={props.checked}>
                            <div className='bg-primary-300'>
                                <div className='p-4 flex gap-2 justify-between items-center'>
                                    <Heading className='text-xs font-bold uppercase'>
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
                                                    members={members}
                                                    roles={roles}
                                                    onSubmit={onSubmit}
                                                />
                                            </>
                                        )}
                                    </OverlayContextProvider>
                                </div>

                                <Separator 
                                    className='mx-4'
                                    spacing={0}
                                />

                                <AllowedRolesAndMembers/>
                            </div>
                        </Conditional>
                    </div>
                )}
            </FormikCheckBox>
        </div>
    );
};