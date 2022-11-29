import { Button, IRefContext, RefContext } from '@components';
import { FC, useContext } from 'react';
import { Modal } from 'src/components/modals/components';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { useThrottle } from '@hooks';
import { fpsToMs } from '@utils';



interface IColorPicker {
    color: string;
    onChange: (color: string) => void;
}

const styles = {
    colorPicker: `flex flex-col p-4 gap-4 shrink-0 
    bg-primary-400 color-picker`,
    presetsWrapper: 'flex gap-1 justify-between',
    presetButton: 'w-8 h-8 rounded-md overflow-hidden',
    presetColor: 'w-full h-full',
};

const defaultColors = ['#190709', '#5b0da9', '#0da9a9', '#5ba90d'];

export const ColorPicker: FC<IColorPicker> = ({
    color,
    onChange,
}) => {
    const { target } = useContext(RefContext) as IRefContext;
    const { throttle } = useThrottle();

    const animationProps = {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 75 },
    };

    const handleChange = throttle(onChange, fpsToMs(60));

    const avatarColor = '#a90d0e';
    const colorsPresets = [avatarColor, ...defaultColors];

    return (
        <Modal
            animationProps={animationProps} 
            withoutBackdrop
        >
            <div className={styles.colorPicker}>
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
        </Modal>
    );
};