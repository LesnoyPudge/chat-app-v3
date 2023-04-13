import { List, Static } from '@components';
import { PropsWithInnerRef } from '@types';
import { FC, memo, PropsWithChildren } from 'react';
import { createPlaceholderVariation, MessagePlaceholder } from '../MessagePlaceholder';



const styles = {
    placeholderList: 'flex flex-col gap-4',
};

const list = Array(15).fill(null).map(() => createPlaceholderVariation());

export const ChatMessagePlaceholderList: FC<PropsWithInnerRef<HTMLDivElement>> = ({
    innerRef,
}) => {
    const modeTMP = 'cozy';

    return (
        <Static>
            <div
                className={styles.placeholderList}
                aria-hidden
                ref={innerRef}
            >
                <List list={list}>
                    {(variation) => (
                        <MessagePlaceholder
                            displayMode={modeTMP}
                            placeholderVariation={variation}
                        />
                    )}
                </List>
            </div>
        </Static>
    );
};