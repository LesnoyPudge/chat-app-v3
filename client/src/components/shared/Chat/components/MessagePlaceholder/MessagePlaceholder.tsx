import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, useRef } from 'react';
import { Conditional, List } from '@components';
import { createPlaceholderVariation, PlaceholderVariation } from './placeholderVariation';



interface MessagePlaceholder extends PropsWithClassName {
    displayMode: 'cozy' | 'compact';
    placeholderVariation?: PlaceholderVariation;
}

const styles = {
    wrapper: 'flex pr-4',
    firstCol: 'w-[72px] shrink-0',
    avatar: 'w-10 h-10 mx-auto rounded-full bg-primary-300',
    username: 'h-4 rounded-md bg-primary-100',
    line: 'flex flex-wrap h-4 gap-2 overflow-hidden',
    word: 'h-4 rounded-md bg-primary-300',
    attachment: 'rounded-md bg-primary-300',
    content: 'flex flex-col gap-y-2 grow',
    timestamp: 'mx-2 bg-primary-300 h-4 rounded-md',
};

export const MessagePlaceholder: FC<MessagePlaceholder> = ({
    className = '',
    displayMode,
    placeholderVariation = createPlaceholderVariation(),
}) => {
    const variationRef = useRef(placeholderVariation);
    
    return (
        <div 
            className={twClassNames(styles.wrapper, className)}
            aria-hidden
        >
            <div className={styles.firstCol}>
                <Conditional isRendered={displayMode === 'cozy'}>
                    <div className={styles.avatar}></div>
                </Conditional>

                <Conditional isRendered={displayMode === 'compact'}>
                    <div className={styles.timestamp}></div>
                </Conditional>
            </div>


            <div className={styles.content}>
                <Conditional isRendered={displayMode === 'cozy'}>
                    <div 
                        className={styles.username}
                        style={variationRef.current.username}
                    ></div>
                </Conditional>
                
                <List list={variationRef.current.lines}>
                    {(words, lineIndex) => (
                        <div className={styles.line}>
                            <List list={words}>
                                {(style, wordIndex) => (
                                    <>
                                        <Conditional isRendered={
                                            displayMode === 'compact' && 
                                            lineIndex === 0 &&
                                            wordIndex === 0
                                        }>
                                            <div 
                                                className={styles.username}
                                                style={variationRef.current.username}
                                            ></div>
                                        </Conditional>

                                        <div 
                                            className={styles.word} 
                                            style={style}
                                        ></div>
                                    </>
                                )}
                            </List>
                        </div>
                    )}
                </List>

                <Conditional isRendered={variationRef.current.withAttachment}>
                    <div 
                        className={styles.attachment}
                        style={{
                            width: `min(${variationRef.current.attachment.width}px, 100%)`,
                            height: variationRef.current.attachment.height,
                        }}
                    ></div>
                </Conditional>
            </div>
        </div>
    );
};