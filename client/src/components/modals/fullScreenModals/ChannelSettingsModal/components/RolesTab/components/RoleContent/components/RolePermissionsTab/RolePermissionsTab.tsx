import { FC, useContext, useMemo } from 'react';
import { Image, CheckBoxIndicatorSlide, Separator, TabContext, TabPanel, CheckBox } from '@components';
import { FormikCheckBox, Heading, HeadingLevel } from '@libs';
import { RoleContentTabs } from '../..';
import { IMAGES } from '@generated';



interface RolePermissionsTab {
    value: string;
}

const permissionGroups = [
    {
        name: 'Основные права сервера',
        permissions: [
            {
                name: 'roleChannelControl',
                title: 'Управлять каналом',
                description: 'Даёт участникам право менять внешний вид этого канала.',
            },
            {
                name: 'roleRoomControl',
                title: 'Управлять комнатами',
                description: 'Позволяет участникам создавать, редактировать и удалять комнаты.',
            },
        ],
    },
    {
        name: 'Права участников',
        permissions: [
            {
                name: 'roleCreateInvitation',
                title: 'Создание приглашения',
                description: 'Позволяет участникам приглашать на этот сервер новых участников.',
            },
            {
                name: 'roleKickMember',
                title: 'Выгонять участников',
                description: 'Позволяет участникам удалять с этого канала других участников. Выгнанные участники смогут вернуться, только получив новое приглашение.',
            },
            {
                name: 'roleBanMember',
                title: 'Банить участников',
                description: 'Позволяет участникам навсегда банить на этом канале других участников.',
            },
        ],
    },
    {
        name: 'Права текстового канала',
        permissions: [
            {
                name: 'roleSendMessage',
                title: 'Отправлять сообщения',
                description: 'Позволяет участникам отправлять сообщения на текстовых каналах.',
            },
        ],
    },
    {
        name: 'Расширенные права',
        permissions: [
            {
                name: 'roleIsAdministrator',
                title: 'Администратор',
                description: 'Участники с этим правом имеют все права и обходят особые права и ограничения канала (например, эти участники получают доступ ко всем приватным комнатам).',
            },
        ],
    },
];

const styles = {
    wrapper: 'flex flex-col flex-1',
    permissionNotFoundWrapper: 'flex flex-col items-center gap-4',
    permissionNotFoundImage: 'w-[85px] h-[85px]',
    permissionNotFoundText: 'text-sm text-color-secondary',
    list: 'pr-4 pb-[60px]',
    permissionGroupTitle: 'block text-xs text-color-secondary uppercase font-bold mb-5',
    permissionCheckBox: 'flex justify-between gap-2 mb-2',
    permissionTitle: 'text-color-primary font-medium',
    permissionDescription: 'text-color-secondary text-sm',
};

export const RolePermissionsTab: FC<RolePermissionsTab> = ({ value }) => {
    const { tabPanelProps } = useContext<TabContext<RoleContentTabs>>(TabContext);

    const filteredPermissionGroups = useMemo(() => {
        return permissionGroups.filter((group) => {
            console.log(value);
            return !!group.permissions.filter((permission) => {
                const matchInTitle = permission.title.toLowerCase().includes(value.toLowerCase());
                const matchInDescription = permission.description.toLowerCase().includes(value.toLowerCase());
                return matchInTitle || matchInDescription;
            }).length;
        });
    }, [value]);

    const showPermissions = !!filteredPermissionGroups.length;

    return (
        <HeadingLevel>
            <TabPanel
                className={styles.wrapper + ' relative'}
                {...tabPanelProps.permissions}
            >
                <If condition={!showPermissions}>
                    <div className={styles.permissionNotFoundWrapper}>
                        <Image
                            className={styles.permissionNotFoundImage}
                            src={IMAGES.COMMON.NOT_FOUND_IMAGE.PATH}
                        />

                        <div className={styles.permissionNotFoundText}>
                            <>Права не найдены</>
                        </div>
                    </div>
                </If>

                <If condition={showPermissions}>
                    <div className={styles.list}>
                        {filteredPermissionGroups.map((group, groupIndex) => (
                            <div key={group.name}>
                                <Heading className={styles.permissionGroupTitle}>
                                    {group.name}
                                </Heading>

                                {group.permissions.map((permission, permissionIndex) => {
                                    const isLastGroup = groupIndex === permissionGroups.length - 1;
                                    const isLastItem = permissionIndex === group.permissions.length - 1;
                                    const showSeparator = !(isLastGroup && isLastItem);

                                    return (
                                        <div key={permission.name}>
                                            <FormikCheckBox
                                                name={permission.name}
                                                label={permission.title}
                                            >
                                                {(props) => (
                                                    <CheckBox
                                                        className={styles.permissionCheckBox}
                                                        {...props}
                                                    >
                                                        <div className={styles.permissionTitle}>
                                                            {permission.title}
                                                        </div>

                                                        <CheckBoxIndicatorSlide checked={props.checked}/>
                                                    </CheckBox>
                                                )}
                                            </FormikCheckBox>

                                            <div className={styles.permissionDescription}>
                                                {permission.description}
                                            </div>

                                            <If condition={showSeparator}>
                                                <Separator spacing={20}/>
                                            </If>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </If>
            </TabPanel>
        </HeadingLevel>
    );
};