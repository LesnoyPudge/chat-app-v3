import { AnimatedTransition, ArrowFocusContextProvider, ArrowFocusItem, Button, ChannelSettingsModalFormValues, FieldLabel, Icon, OverlayContextProvider, OverlayItem, RefContextProvider, RelativelyPositioned, RequiredWildcard } from '@components';
import { FormikColorPicker } from '@libs';
import { animated } from '@react-spring/web';
import { PropsWithClassName } from '@types';
import { getTransitionOptions, isHEXLight, twClassNames } from '@utils';
import { useFormikContext } from 'formik';
import { FC } from 'react';



const colors = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#e91e63',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#95a5a6',
    '#607d8b',
    '#11806a',
    '#1f8b4c',
    '#206694',
    '#71368a',
    '#ad1457',
    '#c27c0e',
    '#a84300',
    '#992d22',
    '#979c9f',
    '#546e7a',
];

const defaultColor = '#99aab5';

const colorPickerTransitionOptions = getTransitionOptions.withOpacity({
    from: { translateX: '10px' },
    enter: { translateX: '0px' },
    leave: { translateX: '10px' },
});

const styles = {
    description: 'mb-2 text-sm',
    content: 'flex gap-2.5',
    button: 'relative flex shrink-0 w-[66px] h-[50px] p-2.5 rounded',
    buttonIcon: '',
    colorDropperIcon: {
        base: 'absolute top-0 right-0 m-0.5 w-3.5 h-3.5 fill-white',
        dark: 'fill-black',
    },
    extraButtonsArea: 'flex gap-2.5 flex-wrap',
    extraButtonWrapper: 'text-0',
    extraButton: 'w-5 h-5 p-0.5 rounded',
    checkIcon: {
        base: 'w-full h-full opacity-0 fill-white',
        active: 'opacity-100',
        dark: 'fill-black',
    },
};

export const RoleColor: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { setFieldValue, values } = useFormikContext<ChannelSettingsModalFormValues>();

    const setColor = (color: string) => setFieldValue('roleColorHEX', color);

    const getIsActive = (color: string) => values.roleColorHEX === color;

    const getLabel = (color: string) => getIsActive(color) ? `Цвет выбран: ${color}` : `Выбрать цвет ${color}`;

    return (
        <div className={twClassNames(className)}>
            <FieldLabel>
                <>Цвет роли</>

                <RequiredWildcard/>
            </FieldLabel>

            <div className={styles.description}>
                <>Для участников используется цвет высшей роли, которую они имеют.</>
            </div>
            
            <ArrowFocusContextProvider 
                list={[]} 
                orientation='horizontal'
            >
                <div className={styles.content}>
                    <Button 
                        className={styles.button}
                        style={{ backgroundColor: defaultColor }}
                        isActive={getIsActive(defaultColor)}
                        label={getLabel(defaultColor)}
                        onLeftClick={() => setColor(defaultColor)}
                    >
                        <Icon
                            className={twClassNames(
                                styles.checkIcon.base,
                                { 
                                    [styles.checkIcon.active]: getIsActive(defaultColor),
                                    [styles.checkIcon.dark]: isHEXLight(defaultColor),
                                },
                            )}
                            iconId='check-icon'
                        />
                    </Button>

                    <OverlayContextProvider>
                        {({ openOverlay, isOverlayExist }) => (
                            <RefContextProvider>
                                {({ targetRef }) => (
                                    <>
                                        <Button 
                                            className={styles.button}
                                            style={{ backgroundColor: values.roleColorHEX }}
                                            hasPopup='dialog'
                                            label='Выбрать пользовательский цвет'
                                            isActive={isOverlayExist}
                                            onLeftClick={openOverlay}
                                        >
                                            <Icon
                                                className={twClassNames(
                                                    styles.colorDropperIcon.base,
                                                    { [styles.colorDropperIcon.dark]: isHEXLight(values.roleColorHEX) },
                                                )}
                                                iconId='dropper-icon'
                                            />

                                            <Icon
                                                className={twClassNames(
                                                    styles.checkIcon.base,
                                                    { 
                                                        [styles.checkIcon.active]: getIsActive(values.roleColorHEX),
                                                        [styles.checkIcon.dark]: isHEXLight(values.roleColorHEX), 
                                                    },
                                                )}
                                                iconId='check-icon'
                                            />
                                        </Button>
                            
                                        <AnimatedTransition 
                                            isExist={isOverlayExist} 
                                            transitionOptions={colorPickerTransitionOptions}
                                        >
                                            {({ style, isAnimatedExist }) => (
                                                <OverlayItem 
                                                    isRendered={isAnimatedExist}
                                                    closeOnClickOutside
                                                    closeOnEscape
                                                    focused
                                                    blocking
                                                >
                                                    <animated.div style={style}>
                                                        <RelativelyPositioned 
                                                            preferredAlignment='right'
                                                            spacing={10}
                                                            targetRefOrRect={targetRef}
                                                        >
                                                            <div 
                                                                role='dialog' 
                                                                aria-label='Выберите пользовательский цвет'
                                                            >
                                                                <FormikColorPicker name='roleColorHEX'/>
                                                            </div>
                                                        </RelativelyPositioned>
                                                    </animated.div>
                                                </OverlayItem>
                                            )}
                                        </AnimatedTransition>
                                    </>
                                )}
                            </RefContextProvider>
                        )}
                    </OverlayContextProvider>

                    <div className={styles.extraButtonsArea}>
                        {colors.map((color) => (
                            <ArrowFocusItem 
                                className={styles.extraButtonWrapper} 
                                id={color} 
                                key={color}
                            >
                                {({ tabIndex }) => (
                                    <Button
                                        className={styles.extraButton}
                                        style={{
                                            backgroundColor: color,
                                        }}
                                        tabIndex={tabIndex}
                                        isActive={getIsActive(color)}
                                        label={getLabel(color)}
                                        onLeftClick={() => setColor(color)}
                                    >
                                        <Icon
                                            className={twClassNames(
                                                styles.checkIcon.base,
                                                { 
                                                    [styles.checkIcon.active]: getIsActive(color),
                                                    [styles.checkIcon.dark]: isHEXLight(color), 
                                                },
                                            )}
                                            iconId='check-icon'
                                        />
                                    </Button>
                                )}
                            </ArrowFocusItem>
                        ))}
                    </div>
                </div>
            </ArrowFocusContextProvider>
        </div>
    );
};