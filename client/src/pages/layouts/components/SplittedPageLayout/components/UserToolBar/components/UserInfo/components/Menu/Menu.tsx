import { Button, List, OverlayContext } from '@components';
import { useThrottle } from '@hooks';
import { AppSelectors, UserApi } from '@redux/features';
import { useMemoSelector } from '@redux/hooks';
import { copyToClipboard, noop, twClassNames } from '@utils';
import { FC, useContext } from 'react';
import { Entities } from '@shared';
import { STATUS_LABEL } from '@vars';
import { useIsMounted } from 'usehooks-ts';



const extraStatuses = Object.keys({
    default: null,
    invisible: null,
    afk: null,
    dnd: null,
} satisfies Record<Entities.User.ExtraStatus, null>);

const styles = {
    wrapper: `flex flex-col bg-primary-600 p-2.5 shadow-elevation-high 
    pointer-events-auto rounded-sm min-w-[200px]`,
    button: `flex justify-between gap-1 py-1.5 px-2 h-8 text-color-secondary rounded-sm
    hover:text-white focus-visible:text-white hover:bg-brand focus-visible:bg-brand 
    transition-all data-[loading=true]:animate-pulse`,
    copyButton: 'data-[active=true]:text-white data-[active=true]:bg-positive',
};

export const Menu: FC = () => {
    const username = useMemoSelector((s) => AppSelectors.selectMe(s).username);
    const extraStatus = useMemoSelector((s) => AppSelectors.selectMe(s).extraStatus);
    const { throttle, isThrottling } = useThrottle();
    const isMounted = useIsMounted();
    const { closeOverlay } = useContext(OverlayContext);
    const [updateProfile, { isLoading }] = UserApi.useUserProfileUpdateMutation();

    const handleCopy = () => {
        copyToClipboard(username);
        throttle(noop, 2000)();
    };

    const setStatus = (newStatus: Entities.User.ExtraStatus) => {
        return () => {
            if (isLoading) return;

            updateProfile({
                extraStatus: newStatus,
            }).then((v) => {
                if (!('data' in v)) return;
                if (isMounted()) closeOverlay();
            });
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
                        label={getSetStatusButtonLabel(item)}
                        isLoading={isLoading}
                        onLeftClick={setStatus(item)}
                        role='menuitem'
                    >
                        {STATUS_LABEL[item]}
                    </Button>
                )}
            </List>

            <Button
                className={twClassNames(styles.button, styles.copyButton)}
                onLeftClick={handleCopy}
                role='menuitem'
                isActive={isThrottling}
            >
                {copyNameText}
            </Button>
        </div>
    );
};