import { Button, Icon } from '@components';
import { conditional, twClassNames } from '@utils';
import { FC, useRef } from 'react';



interface ISearchBar {
    className?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReset: () => void;
}

const styles = {
    wrapper: `bg-primary-500 rounded-md w-full text-normal 
    flex flex-shrink-0`,
    input: 'py-1 px-2 w-full',
    button: 'h-full aspect-square flex shrink-0 group',
    icon: `h-2/3 aspect-square m-auto fill-icon-300 
    group-hover:fill-icon-200 group-active:fill-icon-200
    group-focus-visible:fill-icon-200`,
};

export const SearchBar: FC<ISearchBar> = ({
    className = '',
    placeholder = 'Поиск',
    value,
    onChange,
    onReset,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    
    const handleClick = () => {
        if (value) return onReset();
        inputRef.current && inputRef.current.focus();
    };

    const iconId = conditional('cross-icon', 'search-icon', !!value);

    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <input
                className={styles.input}
                type='text' 
                placeholder={placeholder}
                value={value}
                ref={inputRef}
                onChange={onChange}
            />

            {
                <Button
                    className={styles.button}
                    onLeftClick={handleClick}
                >
                    <Icon
                        iconId={iconId}
                        className={styles.icon}
                    />
                </Button>
            }
        </div>
    );
};