import { ArrowFocusItem, Button, Conditional, ArrowFocusContextProvider } from '@components';
import { FC, PropsWithChildren } from 'react';



const PlaygroundInner: FC = () => {
    const list = [{ id: '1' }, { id: '2' }, { id: '3' }];

    return (
        <>
            <ArrowFocusContextProvider list={list} direction='both'>
                <div className='w-screen h-screen'>
                    {list.map((item) => (
                        <ArrowFocusItem id={item.id} key={item.id}>
                            {({ isFocusable, isFocused, tabIndex }) => (
                                <Button
                                    stylingPreset='brand'
                                    size='medium'
                                    tabIndex={tabIndex}
                                >
                                    <>{item.id}: {isFocused ? 'focused' : 'none'} {isFocusable ? 'focusable' : 'none'}</>
                                </Button>
                            )}
                        </ArrowFocusItem>
                    ))}
                </div>
            </ArrowFocusContextProvider>
        </>
    );
};

const enabled = false;

export const Playground: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Conditional isRendered={!enabled}>
                {children}
            </Conditional>

            <Conditional isRendered={enabled}>
                <PlaygroundInner/>
            </Conditional>
        </>
    );
};