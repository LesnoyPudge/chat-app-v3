import { Button, Conditional,SpriteImage, Ref, RoomSettingsModalFormValues, Scrollable, Separator, Tooltip, UserAvatar , MoveFocusInside } from '@components';
import { useKeyboardNavigation } from '@hooks';
import { Heading } from '@libs';
import { useFormikContext } from 'formik';
import { FC, useRef } from 'react';

import { ViewportList } from 'react-viewport-list';



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

    const roles = Array.from(values.allowedRoles).map((id) => ({
        id,
        name: `role name ${id}`,
        color: 'red',
    }));
    const members = Array.from(values.allowedMembers).map((id) => ({
        id,
        username: `member name ${id}`,
        avatar: 'https://i.pravatar.cc/50',
    }));

    const rolesRef = useRef(roles);
    const rolesNavigation = useKeyboardNavigation(rolesRef, undefined, {
        virtualized: true,
    });

    const membersRef = useRef(members);
    const membersNavigation = useKeyboardNavigation(membersRef, undefined, {
        virtualized: true,
    });

    const removeItem = (name: 'allowedRoles' | 'allowedMembers', id: string) => {
        const newValue = new Set(values[name]);
        newValue.delete(id);
        setFieldValue(name, newValue);
    };

    const showRoles = !!values.allowedRoles.size;
    const showMembers = !!values.allowedMembers.size;
    const showBoth = showRoles && showMembers;

    return (
        <Scrollable
            className={styles.scrollbar}
            label='Роли и участники'
            focusable
            small
            followContentSize
        >
            <Conditional isRendered={showRoles}>
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
                            {(role) => {
                                const handleRemove = () => removeItem('allowedRoles', role.id);

                                return (
                                    <MoveFocusInside
                                        enabled={rolesNavigation.getIsFocused(role.id)}
                                        key={role.id}
                                    >
                                        <li className={styles.item}>
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
                                                            onLeftClick={handleRemove}
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
                                );
                            }}
                        </ViewportList>
                    </ul>
                </div>
            </Conditional>

            <Conditional isRendered={showBoth}>
                <Separator
                    className={styles.separator}
                    spacing={0}
                />
            </Conditional>

            <Conditional isRendered={showMembers}>
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
                            {(member) => {
                                const handleRemove = () => removeItem('allowedMembers', member.id);

                                return (
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
                                                avatarId={member.avatar}
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
                                                            onLeftClick={handleRemove}
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
                                );
                            }}
                        </ViewportList>
                    </ul>
                </div>
            </Conditional>
        </Scrollable>
    );
};