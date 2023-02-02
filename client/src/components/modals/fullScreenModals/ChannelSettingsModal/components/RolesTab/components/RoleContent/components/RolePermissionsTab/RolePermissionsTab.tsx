import { FormikContextType, useFormikContext } from 'formik';
import { FC } from 'react';
import { Button, ChannelSettingsModalFormValues, CheckBoxIndicator, Conditional, SearchBar, Separator } from '@components';
import { useSearch } from '@hooks';
import { FormikCheckBox, Heading, HeadingLevel } from '@libs';



const permissionGroups = [
    {
        name: 'Основные права сервера',
        permissions: [
            {
                name: 'roleChannelControl',
                title: '',
                description: '',
            },
            {
                name: 'roleRoomControl',
                title: '',
                description: '',
            },
            {
                name: 'roleCreateInvitation',
                title: '',
                description: '',
            },
            {
                name: 'roleKickMember',
                title: '',
                description: '',
            },
            {
                name: 'roleBanMember',
                title: '',
                description: '',
            },
            {
                name: 'roleSendMessage',
                title: '',
                description: '',
            },
            {
                name: 'roleIsAdministrator',
                title: '',
                description: '',
            },
        ],
    },
];

export const RolePermissionsTab: FC = () => {
    const { values } = useFormikContext() as FormikContextType<ChannelSettingsModalFormValues>;
    const { searchValue, handleChange, handleReset } = useSearch();

    return (
        <HeadingLevel>
            <SearchBar
                className='mb-8'
                value={searchValue}
                onChange={handleChange}
                onReset={handleReset}
            />

            {permissionGroups.map((group, groupIndex) => (
                <div key={group.name}>
                    <Heading className='block text-xs text-color-secondary uppercase font-bold mb-5'>
                        <>Основные права сервера</>
                    </Heading>
            
                    {group.permissions.map((premission, premissionIndex) => {
                        const isLastGroup = groupIndex === permissionGroups.length - 1;
                        const isLastItem = premissionIndex === group.permissions.length - 1;
                        const showSeparator = !(isLastGroup && isLastItem);

                        return (
                            <div key={premission.name}>
                                <FormikCheckBox 
                                    name={premission.name}
                                    label={premission.title}
                                >
                                    {({ checked }) => (
                                        <div className='flex justify-between gap-2 mb-2'>
                                            <div className='text-color-primary font-medium'>
                                                {premission.title}
                                            </div>
        
                                            <CheckBoxIndicator checked={checked}/>
                                        </div>
                                    )}
                                </FormikCheckBox>
        
                                <div className='text-color-secondary text-sm'>
                                    {premission.description}
                                </div>
                                        
                                <Conditional isRendered={showSeparator}>
                                    <Separator spacing={20}/>
                                </Conditional>
                            </div>
                        );
                    })}
                </div>
            ))}
        </HeadingLevel>
    );
};