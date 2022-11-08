import { Button, Icon, RefContextProvider, Tooltip } from '@components';
import { twClassNames } from '@utils';
import { FC, ReactNode } from 'react';



interface IToolBarButton {
    className?: string;
    isActive?: boolean;
    defaultIconId: string;
    activeIconId?: string;
    defaultTooltipContent: ReactNode;
    activeTooltipContent?: ReactNode;
    onClick: () => void;
}

const styles = {
    button: `h-8 w-8 flex shrink-0 rounded group 
    hover:bg-hover focus-visible:bg-hover`,
    icon: `w-5 h-5 m-auto fill-icon-200 
    group-hover:fill-icon-100 group-focus-visible:fill-icon-100`,
};

export const ToolBarButton: FC<IToolBarButton> = ({
    className = '',
    isActive = false,
    defaultIconId,
    activeIconId,
    defaultTooltipContent,
    activeTooltipContent,
    onClick,
}) => {
    const currentIcon = (isActive && activeIconId) ? activeIconId : defaultIconId;
    const currentTooltipContent = (isActive && activeTooltipContent) ? activeTooltipContent : defaultTooltipContent;

    return (
        <RefContextProvider>
            <Button 
                className={twClassNames(styles.button, className)}
                isntStyled
                onClick={onClick}
            >
                <Icon
                    className={styles.icon}
                    iconId={currentIcon}
                />
            </Button>

            <Tooltip position='top'>
                {currentTooltipContent}
            </Tooltip>
        </RefContextProvider>
    );
};