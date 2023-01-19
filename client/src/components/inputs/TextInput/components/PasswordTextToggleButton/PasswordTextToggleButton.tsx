import { FC, useEffect, useRef } from 'react';
import { Button, Icon } from '@components';
import { PropsWithClassName } from '@types';
import { conditional, twClassNames } from '@utils';



type TepeState = 'password' | 'text'

interface PasswordTextToggleButton extends PropsWithClassName {
    type: TepeState;
    onToggle: () => void;
}

const styles = {
    button: 'h-10 aspect-square p-2 rounded fill-icon-300 hover:fill-icon-100 focus-visible:fill-icon-100',
    icon: 'h-full w-full',
};

export const PasswordTextToggleButton: FC<PasswordTextToggleButton> = ({
    className = '',
    type,
    onToggle,
}) => {
    const initialType = useRef<TepeState>();
    const iconId = conditional('password-eye-on', 'password-eye-off', type === 'password');
    const isPressed = initialType.current && initialType.current !== type;
    const label = conditional(
        'Показать пароль', 
        'Скрыть пароль', 
        type === 'password',
    );

    useEffect(() => {
        if (initialType.current) return;

        initialType.current = type;
    }, [type]);

    return (
        <Button
            className={twClassNames(styles.button, className)}
            isActive={isPressed}
            label={label}
            onLeftClick={onToggle}
        >
            <Icon 
                className={styles.icon}
                iconId={iconId}
            />
        </Button>
    );
};