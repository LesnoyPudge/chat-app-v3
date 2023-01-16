import { FC } from 'react';
import { Button, Icon } from '@components';
import { PropsWithClassName } from '@types';
import { conditional, twClassNames } from '@utils';



interface PasswordTextToggleButton extends PropsWithClassName {
    type: 'password' | 'text';
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
    const iconId = conditional('password-eye-on', 'password-eye-off', type === 'password');

    return (
        <Button
            className={twClassNames(styles.button, className)}
            onLeftClick={onToggle}
        >
            <Icon 
                className={styles.icon}
                iconId={iconId}
            />
        </Button>
    );
};