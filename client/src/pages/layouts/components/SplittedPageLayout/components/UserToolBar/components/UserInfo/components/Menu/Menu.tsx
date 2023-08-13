import { Button, List, OverlayContext, UserStatus } from '@components';
import { useMountedApiWrapper, useThrottle } from '@hooks';
import { AppSelectors, UserApi } from '@redux/features';
import { useMemoSelector } from '@redux/hooks';
import { copyToClipboard, noop, twClassNames } from '@utils';
import { FC, useContext } from 'react';
import { Entities } from '@shared';
import { STATUS_LABEL } from '@vars';



const extraStatuses = Object.keys({
    default: null,
    invisible: null,
    afk: null,
    dnd: null,
} satisfies Record<Entities.User.ExtraStatus, null>);

const styles = {
    wrapper: `flex flex-col bg-primary-600 p-2.5 gap-1 shadow-elevation-high 
    pointer-events-auto rounded-sm min-w-[200px]`,
    button: 'flex gap-3 items-center w-full justify-start group/button',
    status: `w-3.5 h-3.5 group-hover/button:fill-white 
    group-focus-visible/button:fill-white group-data-[loading=true]/button:fill-white`,
    copyButton: 'data-[active=true]:text-white data-[active=true]:bg-positive',
};

export const Menu: FC = () => {
    const username = useMemoSelector((s) => AppSelectors.selectMe(s).username);
    const extraStatus = useMemoSelector((s) => AppSelectors.selectMe(s).extraStatus);
    const { throttle, isThrottling } = useThrottle();
    const { closeOverlay } = useContext(OverlayContext);
    const [updateProfile, { isLoading }] = UserApi.useUserProfileUpdateMutation();
    const { apiWrapper } = useMountedApiWrapper();

    const handleCopy = () => {
        copyToClipboard(username);
        throttle(noop, 2000)();
    };

    const setStatus = (newStatus: Entities.User.ExtraStatus) => {
        return () => {
            if (isLoading) return;

            apiWrapper(
                updateProfile({ extraStatus: newStatus }),
                closeOverlay,
            );
        };
    };

    const getSetStatusButtonLabel = (newStatus: Entities.User.ExtraStatus) => {
        return (
            `Выбрать статус: "${STATUS_LABEL[newStatus]}". 
            Ваш текущий статус: "${STATUS_LABEL[extraStatus]}}"`
        );
    };

    const copyNameText = isThrottling ? 'Скопировано!' : 'Скопировать имя';

    return (
        <div className={styles.wrapper}>
            <List list={extraStatuses}>
                {(item) => (
                    <Button
                        className={styles.button}
                        stylingPreset='invisibleBrand'
                        size='small'
                        label={getSetStatusButtonLabel(item)}
                        isLoading={isLoading}
                        onLeftClick={setStatus(item)}
                        role='menuitem'
                    >
                        <UserStatus
                            className={styles.status}
                            status='online'
                            extraStatus={item}
                        />

                        {STATUS_LABEL[item]}
                    </Button>
                )}
            </List>

            <Button
                className={twClassNames(styles.button, styles.copyButton)}
                stylingPreset='invisibleBrand'
                size='small'
                onLeftClick={handleCopy}
                role='menuitem'
                isActive={isThrottling}
            >
                {copyNameText}
            </Button>
        </div>
    );
};