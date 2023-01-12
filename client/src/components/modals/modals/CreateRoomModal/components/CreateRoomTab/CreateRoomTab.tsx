import { FC, useContext } from 'react';
import { Conditional, Button, OverlayContext, CreateRoomFormValues, TabContext, RadioInput, ChildrenAsNodeOrFunction } from '@components';
import { ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../../../../components';
import { FormikContextType, useField, useFormikContext } from 'formik';
import { Heading } from '@libs';
import { PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { twClassNames } from '@utils';



export const CreateRoomTab: FC = () => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;
    const { changeTab } = useContext(TabContext) as TabContext;
    const { values } = useFormikContext() as FormikContextType<CreateRoomFormValues>;

    const handleGoToNextStep = () => changeTab('AddWhiteListTab');

    return (
        <>
            <ModalHeader>
                <ModalTitle>
                    <>Создать канал</>
                </ModalTitle>
            </ModalHeader>

            <ModalContent>
                <div>
                    <Heading>
                        <>Тип комнаты</>
                    </Heading>

                    <RadioInput
                        name='roomType'
                        value='text'
                        description=''
                    />

                    <RadioInput
                        name='roomType'
                        value='voice'
                        description=''
                    />

                    <RI
                        name='roomType'
                        value='text'
                        label=''
                    >
                        <span>radio <strong>text</strong></span>
                    </RI>

                    <RI
                        name='roomType'
                        value='voice'
                        label=''
                    >
                        <span>radio <strong>voice</strong></span>
                    </RI>
                </div>
            </ModalContent>

            <ModalFooter>
                <Button
                    stylingPreset='lite'
                    size='medium'
                    onLeftClick={closeOverlay}
                >
                    <>Отмена</>
                </Button>

                <Conditional isRendered={!values.isPrivate}>
                    <Button
                        stylingPreset='brand'
                        size='medium'
                        type='submit'
                    >
                        <>Создать комнату</>
                    </Button>
                </Conditional>

                <Conditional isRendered={values.isPrivate}>
                    <Button
                        stylingPreset='brand'
                        size='medium'
                        onLeftClick={handleGoToNextStep}
                    >
                        <>Далее</>
                    </Button>
                </Conditional>
            </ModalFooter>
        </>
    );
};

interface ChildrenArgs {
    checked: boolean;
}

interface RI extends 
PropsWithChildrenAsNodeOrFunction<ChildrenArgs>,
PropsWithClassName {
    name: string;
    value: string | number;
    label: string;
    indicatorPosition?: 'start' | 'end';
}

const styles = {
    wrapper: 'relative min-h-[47px] group',
    input: 'absolute z-[1] inset-0 opacity-0 text-0 cursor-pointer peer',
    inner: {
        base: `flex gap-3.5 p-2.5 rounded-md absolute inset-0 z-0 
        text-secondary bg-primary-300 peer-focus-visible:focused
        peer-focus-visible:text-primary peer-focus-visible:bg-primary-100
        group-hover:text-primary group-hover:bg-primary-100`,
        active: 'text-primary bg-primary-100',
    },
    indicatorWrapper: 'flex shrink-0 w-6 h-6 rounded-full border-2 border-current',
    indicatorInner: {
        base: 'm-auto w-3 h-3 scale-0 rounded-full bg-current transition-all',
        active: 'scale-100',
    },
};

const RI: FC<RI> = ({
    className = '',
    name,
    value,
    label,
    indicatorPosition = 'start',
    children,
}) => {
    const [{ value: radioGroupValue, onChange }] = useField(name);
    const checked = value === radioGroupValue;

    const indicator = (
        <div className={styles.indicatorWrapper}>
            <div 
                className={twClassNames(
                    styles.indicatorInner.base, 
                    { [styles.indicatorInner.active]: checked },
                )}
            ></div>
        </div>
    );

    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <input 
                className={styles.input}
                type='radio' 
                name={name} 
                checked={checked}
                value={value}
                aria-label={label}
                onChange={onChange}
            />

            <div className={twClassNames(
                styles.inner.base, 
                { [styles.inner.active]: checked },
            )}>
                <Conditional isRendered={indicatorPosition === 'start'}>
                    {indicator}
                </Conditional>

                <ChildrenAsNodeOrFunction args={{ checked }}>
                    {children}
                </ChildrenAsNodeOrFunction>

                <Conditional isRendered={indicatorPosition === 'end'}>
                    {indicator}
                </Conditional>
            </div>
        </div>
    );
};