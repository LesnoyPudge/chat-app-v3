import { Button, CheckBoxIndicatorCheck,SpriteImage, Image, List, ModalWindow, OverlayContext, Scrollable, SearchBar, UserAvatar , MoveFocusInside } from '@components';
import { FC, useContext, useRef } from 'react';
import { ModalContainer, ModalHeader, ModalTitle, ModalContent, ModalFooter, ModalSubtitle } from '../../components';
import { useKeyboardNavigation, useTextInput, useSet } from '@hooks';
import { twClassNames } from '@utils';
import { IMAGES } from '@generated';




interface AddMemberToRoleModal {
    roleId: string;
}

const styles = {
    title: 'font-semibold',
    subtitle: 'flex items-center gap-1 text-color-base',
    subtitleIcon: 'w-4 h-4',
    searchBar: 'h-9 mb-4',
    contentBlock: 'flex items-center justify-center h-[260px]',
    scrollable: 'h-full',
    list: 'flex flex-col',
    item: {
        base: 'flex items-center w-full py-2 px-1.5 hover:bg-primary-hover',
        active: 'bg-primary-active',
    },
    indicator: 'mr-4',
    avatar: 'h-6 w-6 mr-2',
    username: 'truncate text-sm',
    notFound: 'flex flex-col items-center gap-4 text-sm',
    notFoundImage: 'h-[85px] w-[85px]',
};

const members = [...Array(60)].map((_, i) => ({
    id: `id ${i}`,
    name: `member ${i}`,
    avatar: 'https://i.pravatar.cc/50',
}));

export const AddMemberToRoleModal: FC<AddMemberToRoleModal> = ({
    roleId,
}) => {
    const { closeOverlay } = useContext(OverlayContext);
    const [membersId, membersIdHelpers] = useSet<string>();
    const { value, handleChange, handleReset } = useTextInput();

    const role = {
        id: roleId,
        name: 'new role1',
        color: 'red',
    };

    const filteredMembers = members.filter((member) => member.name.includes(value));

    const filteredMembersRef = useRef(filteredMembers);
    const {
        getIsFocused,
        getTabIndex,
        setRoot,
        withFocusSet,
    } = useKeyboardNavigation(filteredMembersRef);

    const noMembers = !members.length;
    const showFilteredMembers = !!filteredMembers.length;

    const noOneChecked = !membersId.size;

    const handleAdd = () => {
        if (noOneChecked) return;
        console.log('add', Array.from(membersId));
    };

    return (
        <ModalWindow
            label='Добавить участников'
            withBackdrop
        >
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle className={styles.title}>
                        <>Добавить участников</>
                    </ModalTitle>

                    <ModalSubtitle className={styles.subtitle}>
                        <SpriteImage
                            className={styles.subtitleIcon}
                            name='ROLE_SHIELD_ICON'
                            style={{ fill: role.color }}
                        />

                        <div>{role.name}</div>
                    </ModalSubtitle>
                </ModalHeader>

                <ModalContent>
                    <SearchBar
                        className={styles.searchBar}
                        label='Поиск по участникам'
                        placeholder='Поиск по участникам'
                        value={value}
                        onChange={handleChange}
                        onReset={handleReset}
                    />

                    <div className={styles.contentBlock}>
                        <If condition={!noMembers}>
                            <If condition={showFilteredMembers}>
                                <Scrollable
                                    className={styles.scrollable}
                                    small
                                >
                                    <ul
                                        className={styles.list}
                                        ref={setRoot}
                                        tabIndex={0}
                                        aria-label='Список участников'
                                    >
                                        <List list={filteredMembers}>
                                            {({ id, name, avatar }) => {
                                                const toggleMember = () => membersIdHelpers.toggle(id);
                                                const isActive = membersIdHelpers.has(id);

                                                return (
                                                    <li>
                                                        <MoveFocusInside enabled={getIsFocused(id)}>
                                                            <Button
                                                                className={twClassNames(
                                                                    styles.item.base,
                                                                    { [styles.item.active]: isActive },
                                                                )}
                                                                label={`Выбрать ${name}`}
                                                                tabIndex={getTabIndex(id)}
                                                                isActive={isActive}
                                                                onLeftClick={withFocusSet(id, toggleMember)}
                                                            >
                                                                <CheckBoxIndicatorCheck
                                                                    className={styles.indicator}
                                                                    checked={isActive}
                                                                />

                                                                <UserAvatar
                                                                    className={styles.avatar}
                                                                    avatarId={avatar}
                                                                    username={name}
                                                                />

                                                                <div className={styles.username}>
                                                                    {name}
                                                                </div>
                                                            </Button>
                                                        </MoveFocusInside>
                                                    </li>
                                                );
                                            }}
                                        </List>
                                    </ul>
                                </Scrollable>
                            </If>

                            <If condition={!showFilteredMembers}>
                                <div className={styles.notFound}>
                                    <Image
                                        className={styles.notFoundImage}
                                        src={IMAGES.COMMON.NOT_FOUND_IMAGE.PATH}
                                    />

                                    <div>
                                        <>Участники не найдены</>
                                    </div>
                                </div>
                            </If>
                        </If>

                        <If condition={noMembers}>
                            <div>
                                <>На данном канале нет участников</>
                            </div>
                        </If>
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

                    <Button
                        stylingPreset='brand'
                        size='medium'
                        isDisabled={noOneChecked}
                        onLeftClick={handleAdd}
                    >
                        <>Добавить</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};