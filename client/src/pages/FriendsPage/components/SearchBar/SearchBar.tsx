import { Button, Icon } from '@components';
import { FC, useRef } from 'react';
import { twMerge } from 'tailwind-merge';



interface ISearchBar {
    className?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReset: () => void;
}

export const SearchBar: FC<ISearchBar> = ({
    className = '',
    value,
    onChange,
    onReset,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    
    const focusOnSearch = () => inputRef.current && inputRef.current.focus();
    const handleClick = () => {
        if (value) return onReset();
        return focusOnSearch();
    };

    return (
        <div 
            className={twMerge(`bg-primary-500 rounded-md w-full text-normal 
            h-9 flex flex-shrink-0 ${className}`)}
        >
            <input
                className='py-1 px-2 w-full'
                type='text' 
                placeholder='Поиск по имени'
                value={value}
                ref={inputRef}
                onChange={onChange}
            />

            {
                <Button
                    className='h-9 w-9 flex shrink-0 group'
                    isDefaultStyled={false}
                    onClick={handleClick}
                >
                    {
                        value 
                            ? <Icon
                                iconId='cross-icon'
                                className='m-auto fill-icon-200 
                                group-hover:fill-icon-100 group-active:fill-icon-100
                                group-focus-visible:fill-icon-100'
                                height={24}
                                width={24}
                            />

                            : <Icon
                                iconId='search-icon'
                                className='m-auto fill-icon-200 
                                group-hover:fill-icon-100 group-active:fill-icon-100
                                group-focus-visible:fill-icon-100'
                                height={24}
                                width={24}
                            />
                    }
                </Button>
            }
        </div>
    );
};