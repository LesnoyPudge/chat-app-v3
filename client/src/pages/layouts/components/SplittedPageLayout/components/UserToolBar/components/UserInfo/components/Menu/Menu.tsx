import { Button, OverlayContext } from '@components';
import { useThrottle } from '@hooks';
import { AppSelectors } from '@redux/features';
import { useMemoSelector } from '@redux/hooks';
import { conditional, copyToClipboard } from '@utils';
import { FC, useContext } from 'react';



export const Menu: FC = () => {
    const username = useMemoSelector((s) => AppSelectors.selectMe(s).username);
    const { throttle, isThrottling } = useThrottle();
    const { closeOverlay } = useContext(OverlayContext);

    const handleCopy = throttle(() => copyToClipboard(username), 2000);

    const copyNameText = isThrottling ? 'Скопировано!' : 'Скопировать имя';

    return (
        <div className='flex flex-col bg-primary-600 p-2.5'>
            <div>
                <>Выбрать статус:</>
            </div>

            <ul>
                <li>icon: авто</li>
                <li>icon: невидим</li>
                <li>icon: не беспокоить</li>
                <li>icon: сон</li>
            </ul>

            {/* <Button onLeftClick={closeOverlay}>
                <></>
            </Button> */}

            <Button
                onLeftClick={handleCopy}
            >
                {copyNameText}
            </Button>
        </div>
    );
};