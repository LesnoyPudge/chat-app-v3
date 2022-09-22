import { Button, Icon, RefContextProvider, Tooltip } from '@components';
import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';



interface IToolBarButton {
    className?: string;
    isActive?: boolean;
    defaultIconId: string;
    activeIconId?: string;
    defaultTooltipContent: ReactNode;
    activeTooltipContent?: ReactNode;
    onClick: () => void;
}

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
                className={twMerge(`h-8 w-8 flex shrink-0 rounded group hover:bg-hover focus-visible:bg-hover ${className}`)}
                isDefaultStyled={false}
                onClick={onClick}
            >
                <Icon
                    className='m-auto fill-icon-200 group-hover:fill-icon-100 group-focus-visible:fill-icon-100'
                    iconId={currentIcon}
                    height={20}
                    width={20}
                />
            </Button>

            <Tooltip position='top'>
                {currentTooltipContent}
            </Tooltip>
        </RefContextProvider>
    );
};