import { Button } from '@components';
import { FC } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { useThrottle } from '@hooks';
import { fpsToMs, twClassNames } from '@utils';
import { PropsWithClassName } from '@types';



interface ColorPicker extends PropsWithClassName {
    color: string;
    onChange: (color: string) => void;
}

const styles = {
    colorPicker: `flex flex-col p-4 gap-4 shrink-0 pointer-events-auto
    bg-primary-200 rounded-md shadow-elevation-high color-picker`,
    presetsWrapper: 'flex gap-1 justify-between',
    presetButton: 'w-8 h-8 rounded-md overflow-hidden',
    presetColor: 'w-full h-full',
};

const defaultColors = ['#e3722c', '#5b0da9', '#0da9a9', '#5ba90d'];

export const ColorPicker: FC<ColorPicker> = ({
    className = '',
    color,
    onChange,
}) => {
    const { throttle } = useThrottle();
    const handleChange = throttle(onChange, fpsToMs(60));

    const avatarColor = '#a90d0e';
    const colorsPresets = [avatarColor, ...defaultColors];

    return (
        <div className={twClassNames(styles.colorPicker, className)}>
            <HexColorPicker 
                color={color} 
                onChange={handleChange}
            />

            <HexColorInput 
                color={color}
                prefix='#' 
                prefixed
                onChange={handleChange} 
            />

            <div className={styles.presetsWrapper}>
                {colorsPresets.map((color, index) => (
                    <Button 
                        className={styles.presetButton}
                        isntStyled 
                        onClick={() => onChange(color)}   
                        key={index}
                    >
                        <div 
                            className={styles.presetColor}
                            style={{ backgroundColor: color }}
                        ></div>
                    </Button>
                ))}
            </div>
        </div>
    );
};