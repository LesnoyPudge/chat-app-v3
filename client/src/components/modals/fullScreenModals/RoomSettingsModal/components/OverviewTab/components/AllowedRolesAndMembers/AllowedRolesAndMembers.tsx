import { Button,SpriteImage, Ref, RoomSettingsModalFormValues, Scrollable, Separator, Tooltip, UserAvatar , MoveFocusInside } from '@components';
import { useEntitySubscription, useKeyboardNavigation } from '@hooks';
import { Heading } from '@libs';
import { useFormikContext } from 'formik';
import { FC, useRef } from 'react';
import { ViewportList } from 'react-viewport-list';
import { SUBSCRIBABLE_ENTITIES } from '@shared';
import { SliceEntityState } from '@types';



const styles = {
    scrollbar: 'max-h-[400px]',
    section: 'p-4',
    heading: 'mb-4',
    separator: 'mx-4',
    item: 'flex items-center gap-2 pb-4 px-1',
    image: 'h-5 w-5',
    name: 'text-sm',
    button: 'w-4 h-4 ml-auto',
    icon: 'w-full h-full fill-icon-100',
};

export const AllowedRolesAndMembers: FC = () => {
    const { values, setFieldValue } = useFormikContext<RoomSettingsModalFormValues>();

    const roles = useEntitySubscription<SliceEntityState.Role>(SUBSCRIBABLE_ENTITIES.ROLE, values.whiteList.roles);
    const members = useEntitySubscription<SliceEntityState.User>(SUBSCRIBABLE_ENTITIES.USER, values.whiteList.users);

    const rolesRef = useRef(roles);
    const rolesNavigation = useKeyboardNavigation(rolesRef, undefined, {
        virtualized: true,
    });

    const membersRef = useRef(members);
    const membersNavigation = useKeyboardNavigation(membersRef, undefined, {
        virtualized: true,
    });

    const removeRole = (id: string) => {
        const newWhiteList: RoomSettingsModalFormValues['whiteList'] = {
            roles: values.whiteList.roles.filter((roleId) => roleId !== id),
            users: values.whiteList.users,
        };

        setFieldValue('whiteList', newWhiteList);
    };

    const removeMember = (id: string) => {
        const newWhiteList: RoomSettingsModalFormValues['whiteList'] = {
            roles: values.whiteList.roles,
            users: values.whiteList.users.filter((userId) => userId !== id),
        };

        setFieldValue('whiteList', newWhiteList);
    };

    const showRoles = !!roles.length;
    const showMembers = !!members.length;
    const showBoth = showRoles && showMembers;
    const nothingToShow = !showMembers && !showRoles;

    return (
        <If condition={!nothingToShow}>
            <Scrollable
                className={styles.scrollbar}
                label='Роли и участники'
                focusable
                small
                followContentSize
            >
                <If condition={showRoles}>
                    <div className={styles.section}>
                        <Heading className={styles.heading}>
                            <>Роли</>
                        </Heading>

                        <ul
                            tabIndex={0}
                            ref={rolesNavigation.setRoot}
                        >
                            <ViewportList
                                items={roles}
                                onViewportIndexesChange={rolesNavigation.setViewportIndexes}
                            >
                                {(role) => (
                                    <li key={role.id}>
                                        <MoveFocusInside
                                            className={styles.item}
                                            enabled={rolesNavigation.getIsFocused(role.id)}
                                        >
                                            <SpriteImage
                                                className={styles.image}
                                                style={{ fill: role.color }}
                                                name='ROLE_SHIELD_ICON'
                                            />

                                            <span className={styles.name}>
                                                {role.name}
                                            </span>

                                            <Ref<HTMLButtonElement>>
                                                {(ref) => (
                                                    <>
                                                        <Button
                                                            className={styles.button}
                                                            label='Лишить доступа к комнате'
                                                            tabIndex={rolesNavigation.getTabIndex(role.id)}
                                                            innerRef={ref}
                                                            onLeftClick={() => removeRole(role.id)}
                                                        >
                                                            <SpriteImage
                                                                className={styles.icon}
                                                                name='GARBAGE_CAN_ICON'
                                                            />
                                                        </Button>

                                                        <Tooltip
                                                            preferredAlignment='top'
                                                            leaderElementRef={ref}
                                                        >
                                                            <>Лишить доступа к комнате</>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </Ref>
                                        </MoveFocusInside>
                                    </li>
                                )}
                            </ViewportList>
                        </ul>
                    </div>
                </If>

                <If condition={showBoth}>
                    <Separator
                        className={styles.separator}
                        spacing={0}
                    />
                </If>

                <If condition={showMembers}>
                    <div className={styles.section}>
                        <Heading className={styles.heading}>
                            <>Участники</>
                        </Heading>

                        <ul
                            ref={membersNavigation.setRoot}
                            tabIndex={0}
                        >
                            <ViewportList
                                items={members}
                                onViewportIndexesChange={membersNavigation.setViewportIndexes}
                            >
                                {(member) => (
                                    <MoveFocusInside
                                        enabled={membersNavigation.getIsFocused(member.id)}
                                        key={member.id}
                                    >
                                        <li
                                            className={styles.item}
                                            key={member.id}
                                        >
                                            <UserAvatar
                                                className={styles.image}
                                                avatarId={member.avatarId}
                                                username={member.username}
                                            />

                                            <span className={styles.name}>
                                                {member.username}
                                            </span>

                                            <Ref<HTMLButtonElement>>
                                                {(ref) => (
                                                    <>
                                                        <Button
                                                            className={styles.button}
                                                            label='Лишить доступа к комнате'
                                                            tabIndex={membersNavigation.getTabIndex(member.id)}
                                                            innerRef={ref}
                                                            onLeftClick={() => removeMember(member.id)}
                                                        >
                                                            <SpriteImage
                                                                className={styles.icon}
                                                                name='GARBAGE_CAN_ICON'
                                                            />
                                                        </Button>

                                                        <Tooltip
                                                            preferredAlignment='top'
                                                            leaderElementRef={ref}
                                                        >
                                                            <>Лишить доступа к комнате</>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </Ref>
                                        </li>
                                    </MoveFocusInside>
                                )}
                            </ViewportList>
                        </ul>
                    </div>
                </If>
            </Scrollable>
        </If>
    );
};