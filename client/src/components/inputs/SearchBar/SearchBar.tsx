import { Button, Icon } from '@components';
import classNames from 'classnames';
import { FC, useRef } from 'react';
import { twMerge } from 'tailwind-merge';



interface ISearchBar {
    className?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReset: () => void;
}

const baseClassName = `bg-primary-500 rounded-md w-full text-normal 
flex flex-shrink-0`;
const iconClassName = `h-2/3 aspect-square m-auto fill-icon-200 
group-hover:fill-icon-100 group-active:fill-icon-100
group-focus-visible:fill-icon-100`;

export const SearchBar: FC<ISearchBar> = ({
    className = '',
    placeholder = 'Поиск',
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
        <div className={twMerge(classNames(baseClassName, className))}>
            <input
                className='py-1 px-2 w-full'
                type='text' 
                placeholder={placeholder}
                value={value}
                ref={inputRef}
                onChange={onChange}
            />

            {
                <Button
                    className='h-full aspect-square flex shrink-0 group'
                    isDefaultStyled={false}
                    onClick={handleClick}
                >
                    {
                        value 
                            ? <Icon
                                iconId='cross-icon'
                                className={iconClassName}
                            />

                            : <Icon
                                iconId='search-icon'
                                className={iconClassName}
                            />
                    }
                </Button>
            }
        </div>
    );
};