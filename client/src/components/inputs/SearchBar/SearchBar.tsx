import { Button, Icon, TextInput, TextInputWrapper } from '@components';
import { conditional, twClassNames } from '@utils';
import { FC, useRef } from 'react';



interface SearchBar {
    className?: string;
    placeholder?: string;
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReset: () => void;
}

const styles = {
    button: `flex shrink-0 h-full aspect-square rounded fill-icon-300 
    hover:fill-icon-200 focus-visible:fill-icon-200`,
    icon: 'h-2/3 aspect-square m-auto',
};

export const SearchBar: FC<SearchBar> = ({
    className = '',
    placeholder = 'Поиск',
    label,
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
    const buttonLabel = conditional('Очистить поиск', 'Перейти к поиску', !!value);

    return (
        <TextInputWrapper className={className}>
            <TextInput
                className='h-full'
                name='search'
                placeholder={placeholder}
                value={value}
                label={label}
                inputRef={inputRef}
                onChange={onChange}
            />

            <Button
                className={styles.button}
                label={buttonLabel}
                onLeftClick={handleClick}
            >
                <Icon
                    className={styles.icon}
                    iconId={iconId}
                />
            </Button>
        </TextInputWrapper>
    );
};