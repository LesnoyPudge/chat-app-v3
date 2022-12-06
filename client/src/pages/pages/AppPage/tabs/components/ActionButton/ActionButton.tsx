import { Button, Icon, RefContextProvider, Tooltip } from '@components';
import { twClassNames } from '@utils';
import { FC, ReactNode } from 'react';



interface IActionButton {
    buttonClassName?: string;
    iconClassName?: string;
    iconId: string;
    tooltipContent: ReactNode;
    onClick: () => void;
}

const styles = {
    button: `flex shrink-0 rounded-full h-9 w-9
    bg-primary-300 hover:bg-primary-500 focus-visible:bg-primary-500
    group-1-focus-within:bg-primary-500
    group-1-hover:bg-primary-500 fill-icon-300
    hover:fill-icon-200 focus-visible:fill-icon-200`,
    icon: 'h-5 w-5 m-auto',
};

export const ActionButton: FC<IActionButton> = ({
    buttonClassName = '',
    iconClassName = '',
    iconId,
    tooltipContent,
    onClick,
}) => {
    return (
        <RefContextProvider>
            <Button 
                className={twClassNames(styles.button, buttonClassName)}
                isntStyled
                onClick={onClick}
            >
                <Icon
                    iconId={iconId}
                    className={twClassNames(styles.icon, iconClassName)}
                />
            </Button>

            <Tooltip preferredAligment='top'>
                {tooltipContent}
            </Tooltip>
        </RefContextProvider>
    );
};