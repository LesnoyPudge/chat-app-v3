import { Button, List, MoveFocusInside } from '@components';
import { useKeyboardNavigation } from '@hooks';
import { triggerGlobalReset } from '@redux/globalReset';
import { ObjectWithId } from '@types';
import { objectKeysToIdArray } from '@utils';
import { FC, useRef } from 'react';
import { axeReact } from '../../helpers/components';
import { AnyFunction } from 'ts-essentials';
import { Key } from 'ts-key-enum';
import { openTranslationWindow } from '@i18n';



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

    setDarkTheme: () => {
        document.documentElement.dataset.theme = 'dark';
    },

    setLightTheme: () => {
        document.documentElement.dataset.theme = 'light';
    },

    setAutoTheme: () => {
        document.documentElement.dataset.theme = 'auto';
    },

    openTranslationWindow,
} satisfies Actions;

const styles = {
    wrapper: 'fixed left-1/2 -translate-x-1/2 pointer-events-auto w-[400px] max-w-full',
    inner: 'flex flex-col gap-2 m-3 p-3 bg-black text-white font-semibold',
    button: 'data-[active="true"]:bg-white data-[active="true"]:text-black',
};

export const DevDebugContent: FC = () => {
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

    return (
        <>
            <div className={styles.wrapper}>
                <div
                    className={styles.inner}
                    ref={setRoot}
                    tabIndex={0}
                >
                    <div>
                        <>{Key.ArrowUp} / {Key.ArrowDown}</>
                    </div>

                    <List list={Object.keys(actions)}>
                        {(key) => {
                            return (
                                <MoveFocusInside enabled={getIsFocused(key)}>
                                    <Button
                                        className={styles.button}
                                        isActive={getIsFocused(key)}
                                        tabIndex={getTabIndex(key)}
                                        onLeftClick={withFocusSet(key, actions[key])}
                                    >
                                        {key}
                                    </Button>
                                </MoveFocusInside>
                            );
                        }}
                    </List>
                </div>
            </div>
        </>
    );
};