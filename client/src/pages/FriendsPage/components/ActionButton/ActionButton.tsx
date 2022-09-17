import { Button, Icon, RefContextProvider, Tooltip, TooltipPositionsType } from '@components';
import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';



interface IActionButton {
    buttonClassName?: string;
    iconClassName?: string;
    iconId: string;
    tooltipContent: ReactNode;
    tooltipPosition?: TooltipPositionsType;
    onClick: () => void;
}

export const ActionButton: FC<IActionButton> = ({
    buttonClassName = '',
    iconClassName = '',
    iconId,
    tooltipContent,
    tooltipPosition = 'top',
    onClick,
}) => {
    return (
        <RefContextProvider>
            <Button 
                className={twMerge(`flex shrink-0 rounded-full h-9 w-9
                bg-primary-300 hover:bg-primary-500 focus-visible:bg-primary-500
                group-1-focus-within:bg-primary-500
                group-1-hover:bg-primary-500 group-2 ${buttonClassName}`)}
                isDefaultStyled={false}
                onClick={onClick}
            >
                <Icon
                    iconId={iconId}
                    className={twMerge(`h-5 w-5 m-auto fill-icon-300 
                    group-2-hover:fill-icon-100
                    group-2-focus-visible:fill-icon-100 ${iconClassName}`)}
                />
            </Button>

            <Tooltip position={tooltipPosition}>
                {tooltipContent}
            </Tooltip>
        </RefContextProvider>
    );
};