import { Button, List, OverlayContext, OverlayContextProvider, OverlayItem } from '@components';
import { useEventListener, useKeyboardNavigation } from '@hooks';
import { triggerGlobalReset } from '@redux/globalReset';
import { ObjectWithId } from '@types';
import { objectKeysToIdArray } from '@utils';
import { FC, useContext, useRef } from 'react';
import { MoveFocusInside } from 'react-focus-lock';
import { axeReact } from '../../helpers/components';
import { AnyFunction } from 'ts-essentials';
import { Key } from 'ts-key-enum';



type Actions = Record<string, AnyFunction>;

const actions = {
    toggleElementsOutline: () => {
        const currentValue = document.documentElement.dataset.outline as 'false' | 'true';
        document.documentElement.dataset.outline = currentValue === 'false' ? 'true' : 'false';
    },
    resetReduxStore: triggerGlobalReset,
    runAxe: axeReact,
    clearConsole: console.clear,
    logElementsCount: () => {
        console.log(`${document.querySelectorAll('*').length} DOM elements`);
    },
} satisfies Actions;

const styles = {
    wrapper: 'fixed left-1/2 -translate-x-1/2 pointer-events-auto w-[400px] max-w-full',
    inner: 'flex flex-col gap-2 m-3 p-3 bg-black text-white font-semibold',
    button: 'data-[active="true"]:bg-white data-[active="true"]:text-black',
};

const DevDebugContent: FC = () => {
    const focusableList = useRef<ObjectWithId[]>(objectKeysToIdArray(actions));
    const {
        getIsFocused,
        getTabIndex,
        setRoot,
        withFocusSet,
    } = useKeyboardNavigation(
        focusableList,
        null,
        { loop: true, direction: 'vertical' },
    );

    useEventListener('focusin', (e) => {
        console.log('focus', e.target);
    }, document);
    useEventListener('focusout', (e) => {
        // console.log('blur', e.target);
    }, document);

    return (
        <div className={styles.wrapper}>
            <div
                className={styles.inner}
                tabIndex={0}
                ref={setRoot}
            >
                <div>
                    <>{Key.ArrowUp} / {Key.ArrowDown}</>
                </div>

                <List list={Object.keys(actions)}>
                    {(key) => {
                        console.log(key, getTabIndex(key));
                        return (
                            <MoveFocusInside disabled={!getIsFocused(key)}>
                                <Button
                                    className={styles.button}
                                    isActive={getIsFocused(key)}
                                    tabIndex={getTabIndex(key)}
                                    onLeftClick={withFocusSet(key, actions[key])}
                                >
                                    {key} {getTabIndex(key)}
                                </Button>
                            </MoveFocusInside>
                        );
                    }}
                </List>
            </div>
        </div>
    );
};

const DevDebugInner: FC = () => {
    const overlayApiRef = useRef<ReturnType<typeof useContext<OverlayContext>>>();

    useEventListener('keydown', (e) => {
        if (e.altKey || e.metaKey) return;
        if (!(e.shiftKey && e.ctrlKey && e.key === 'P')) return;
        if (!overlayApiRef.current) return;

        e.preventDefault();

        overlayApiRef.current.openOverlay();
    }, document);

    return (
        <OverlayContextProvider>
            {(api) => {
                overlayApiRef.current = api;

                return (
                    <OverlayItem
                        isRendered={api.isOverlayExist}
                        blockable
                        blocking
                        closeOnEscape
                        focused
                    >
                        <DevDebugContent/>
                    </OverlayItem>
                );
            }}
        </OverlayContextProvider>
    );
};

export default DevDebugInner;