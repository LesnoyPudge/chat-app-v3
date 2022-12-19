import { createContext, FC, PropsWithChildren, useState } from 'react';
import { ChildrenAsNodeOrFunction, Conditional, ITab, ModalWindow, TabContexProvider } from '@components';
import { EnterCodeSlide, EnterNewEmailSlide, RequestCodeSlide } from './slides';
import { Formik } from 'formik';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { animated, useTransition } from '@react-spring/web';



interface FirstFormPart {
    accessCode: string;
}

interface SecondFormPart {
    email: string;
    password: string;
}

type FormValues = FirstFormPart & SecondFormPart;

const initialValues: FormValues = {
    accessCode: '',
    email: '',
    password: '',
};

const tabs: ITab[] = [
    {
        identifier: 'RequestCodeSlide',
        tab: <RequestCodeSlide/>,
    },
    {
        identifier: 'EnterCodeSlide',
        tab: <EnterCodeSlide/>,
    },
    {
        identifier: 'EnterNewEmailSlide',
        tab: <EnterNewEmailSlide/>,
    },
];

export const ChangeEmailModal: FC = () => {
    return (
        <ModalWindow withBackdrop>
            {({ closeOverlay }) => {
                const handleSubmit = (values: FirstFormPart | SecondFormPart) => {
                    console.log('step', values);
                };

                return (
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        <TabContexProvider tabs={tabs}>
                            {({ currentTab, changeTab }) => (
                                <>
                                    <div className='overflow-x-hidden'>
                                        <div className='w-fit'>
                                            <Slide isExist={currentTab.identifier === 'RequestCodeSlide'}>
                                                <RequestCodeSlide/>
                                            </Slide>

                                            <Slide isExist={currentTab.identifier === 'EnterCodeSlide'}>
                                                <EnterCodeSlide/>
                                            </Slide>

                                            <Slide isExist={currentTab.identifier === 'EnterNewEmailSlide'}>
                                                <EnterNewEmailSlide/>
                                            </Slide>
                                        </div>
                                    </div>

                                    <div className='flex gap-2'>
                                        <button onClick={() => changeTab('RequestCodeSlide')}>
                                            <>1</>
                                        </button>

                                        <button onClick={() => changeTab('EnterCodeSlide')}>
                                            <>2</>
                                        </button>

                                        <button onClick={() => changeTab('EnterNewEmailSlide')}>
                                            <>3</>
                                        </button>
                                    </div>
                                </>
                            )}
                        </TabContexProvider>

                        {/* <div className=''>
                                <RequestCodeSlide/>
                            </div>

                            <div className=''>
                                <EnterCodeSlide/>
                            </div>

                            <div className=''>
                                <EnterNewEmailSlide/>
                            </div> */}
                    </Formik>
                );
            }}
        </ModalWindow>
    );
};

interface Slide extends PropsWithChildren {
    isExist: boolean;
}

const Slide: FC<Slide> = ({
    isExist,
    children,
}) => {
    const transition = useTransition(isExist, {
        from: {
            transform: 'translateX(100%)',
        },
        enter: {
            transform: 'translateX(0%)',
        },
        leave: {
            transform: 'translateX(-100%)',
        },
        config: {
            duration: 150,
        },
    });

    return transition((style, isRendered) => (
        <Conditional isRendered={isRendered}>
            <animated.div style={style}>
                {children}
            </animated.div>
        </Conditional>
    ));
};





interface SliderContext {
    some?: string;
}

const SliderContext = createContext<SliderContext | undefined>(undefined);

const SliderContextProvider: FC<PropsWithChildrenAsNodeOrFunction<SliderContext>> = ({ children }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const goToNext = () => {
        setCurrentSlide(prev => prev + 1);
    };

    const goToPrev = () => {
        setCurrentSlide(prev => prev - 1);
    };

    const goTo = (to: number) => {
        setCurrentSlide(to);
    };

    const contextValues: SliderContext = {

    };

    return (
        <ChildrenAsNodeOrFunction args={contextValues}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};