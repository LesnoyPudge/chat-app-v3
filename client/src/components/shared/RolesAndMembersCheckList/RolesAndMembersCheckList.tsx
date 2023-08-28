import {  Scrollable, Image, Button, CheckBoxIndicatorCheck,SpriteImage, UserAvatar , MoveFocusInside } from '@components';
import { Heading } from '@libs';
import { ObjectWithId, PropsWithClassName } from '@types';
import { FC, useRef } from 'react';
import { ViewportList } from 'react-viewport-list';
import notFoundImage from '@assets/not-found-image.svg';
import { twClassNames } from '@utils';
import { useKeyboardNavigation, useRefWithSetter } from '@hooks';




export interface RolesAndMembersCheckList extends PropsWithClassName {
    roles: (ObjectWithId & {
        name: string;
        color: string;
    })[];
    members: (ObjectWithId & {
        username: string;
        avatar: string;
    })[];
    checkRole: (id: string) => void;
    checkMember: (id: string) => void;
    getIsRoleChecked: (id: string) => boolean;
    getIsMemberChecked: (id: string) => boolean;
}

const styles = {
    heading: 'text-xs uppercase bold mb-2',
    list: 'mb-2',
    singleNotFound: 'flex justify-center items-center h-full font-medium text-sm',
    notFoundWrapper: 'flex flex-col h-full justify-center items-center',
    notFoundImage: 'w-[85px] h-[85px] mb-4',
    notFoundText: 'text-sm text-color-secondary',
    item: {
        base: `flex w-full items-center py-2 px-1.5 rounded 
        hover:bg-primary-hover focus-visible:bg-primary-hover`,
        active: 'bg-primary-selected',
    },
    checkBoxIndicator: 'mr-4',
    itemImage: 'w-5 h-5',
    itemName: 'ml-2 text-sm font-medium truncate',
};

export const RolesAndMembersCheckList: FC<RolesAndMembersCheckList> = ({
    className = '',
    roles,
    members,
    checkMember,
    checkRole,
    getIsMemberChecked,
    getIsRoleChecked,
}) => {
    // const [viewport, viewportRef, setViewport] = useStateAndRef<HTMLElement | null>(null);
    const [viewportRef, setViewport] = useRefWithSetter<HTMLElement | null>(null);

    const rolesRef = useRef(roles);
    const rolesNavigation = useKeyboardNavigation(rolesRef, undefined, {
        virtualized: true,
    });

    const membersRef = useRef(members);
    const membersNavigation = useKeyboardNavigation(membersRef, undefined, {
        virtualized: true,
    });

    const isRolesFound = !!roles.length;
    const isMembersFound = !!members.length;
    const isAnyFound = isRolesFound || isMembersFound;

    return (
        <Scrollable
            className={className}
            small
            focusable
            label='Список ролей и участников'
            followContentSize
            setScrollableWrapper={setViewport}
        >
            <If condition={isAnyFound}>
                <Heading className={styles.heading}>
                    <>Роли</>
                </Heading>

                <If condition={isRolesFound}>
                    <ul
                        className={styles.list}
                        ref={rolesNavigation.setRoot}
                        tabIndex={0}
                    >
                        <ViewportList
                            items={roles}
                            initialPrerender={10}
                            viewportRef={viewportRef}
                            onViewportIndexesChange={rolesNavigation.setViewportIndexes}
                        >
                            {(role) => {
                                const handleRoleCheck = () => checkRole(role.id);
                                const isRoleChecked = getIsRoleChecked(role.id);

                                return (
                                    <MoveFocusInside
                                        enabled={rolesNavigation.getIsFocused(role.id)}
                                        key={role.id}
                                    >
                                        <li>
                                            <Button
                                                className={twClassNames(
                                                    styles.item.base,
                                                    { [styles.item.active]: isRoleChecked },
                                                )}
                                                label={`Добавить роль ${role.name}`}
                                                isActive={isRoleChecked}
                                                tabIndex={rolesNavigation.getTabIndex(role.id)}
                                                onLeftClick={handleRoleCheck}
                                            >
                                                <CheckBoxIndicatorCheck
                                                    className={styles.checkBoxIndicator}
                                                    checked={isRoleChecked}
                                                />

                                                <SpriteImage
                                                    className={styles.itemImage}
                                                    style={{ fill: role.color }}
                                                    name='ROLE_SHIELD_ICON'
                                                />

                                                <div className={styles.itemName}>
                                                    {role.name}
                                                </div>
                                            </Button>
                                        </li>
                                    </MoveFocusInside>
                                );
                            }}
                        </ViewportList>
                    </ul>
                </If>

                <If condition={!isRolesFound}>
                    <div className={styles.singleNotFound}>
                        <>Роли не найдены</>
                    </div>
                </If>

                <Heading className={styles.heading}>
                    <>Участники</>
                </Heading>

                <If condition={isMembersFound}>
                    <ul
                        className={styles.list}
                        ref={membersNavigation.setRoot}
                        tabIndex={0}
                    >
                        <ViewportList
                            items={members}
                            initialPrerender={10}
                            viewportRef={viewportRef}
                            onViewportIndexesChange={membersNavigation.setViewportIndexes}
                        >
                            {(member) => {
                                const handleMemberCheck = () => checkMember(member.id);
                                const isMemberChecked = getIsMemberChecked(member.id);

                                return (
                                    <MoveFocusInside
                                        enabled={membersNavigation.getIsFocused(member.id)}
                                        key={member.id}
                                    >
                                        <li>
                                            <Button
                                                className={twClassNames(
                                                    styles.item.base,
                                                    { [styles.item.active]: isMemberChecked },
                                                )}
                                                label={`Добавить участника ${member.username}`}
                                                isActive={isMemberChecked}
                                                tabIndex={membersNavigation.getTabIndex(member.id)}
                                                onLeftClick={handleMemberCheck}
                                            >
                                                <CheckBoxIndicatorCheck
                                                    className={styles.checkBoxIndicator}
                                                    checked={isMemberChecked}
                                                />

                                                <UserAvatar
                                                    className={styles.itemImage}
                                                    avatarId={member.avatar}
                                                    username={member.username}
                                                />

                                                <div className={styles.itemName}>
                                                    {member.username}
                                                </div>
                                            </Button>
                                        </li>
                                    </MoveFocusInside>
                                );
                            }}
                        </ViewportList>
                    </ul>
                </If>

                <If condition={!isMembersFound}>
                    <div className={styles.singleNotFound}>
                        <>Участники не найдены</>
                    </div>
                </If>
            </If>

            <If condition={!isAnyFound}>
                <div className={styles.notFoundWrapper}>
                    <Image
                        className={styles.notFoundImage}
                        src={notFoundImage}
                    />

                    <div className={styles.notFoundText}>
                        <>Роли и участники не найдены</>
                    </div>
                </div>
            </If>
        </Scrollable>
    );
};