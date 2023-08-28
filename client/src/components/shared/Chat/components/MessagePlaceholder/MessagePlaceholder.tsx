import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, useRef } from 'react';
import {  List } from '@components';
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
                <If condition={displayMode === 'cozy'}>
                    <div className={styles.avatar}></div>
                </If>

                <If condition={displayMode === 'compact'}>
                    <div className={styles.timestamp}></div>
                </If>
            </div>


            <div className={styles.content}>
                <If condition={displayMode === 'cozy'}>
                    <div 
                        className={styles.username}
                        style={variationRef.current.username}
                    ></div>
                </If>
                
                <List list={variationRef.current.lines}>
                    {(words, lineIndex) => (
                        <div className={styles.line}>
                            <List list={words}>
                                {(style, wordIndex) => (
                                    <>
                                        <If condition={
                                            displayMode === 'compact' && 
                                            lineIndex === 0 &&
                                            wordIndex === 0
                                        }>
                                            <div 
                                                className={styles.username}
                                                style={variationRef.current.username}
                                            ></div>
                                        </If>

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

                <If condition={variationRef.current.withAttachment}>
                    <div 
                        className={styles.attachment}
                        style={{
                            width: `min(${variationRef.current.attachment.width}px, 100%)`,
                            height: variationRef.current.attachment.height,
                        }}
                    ></div>
                </If>
            </div>
        </div>
    );
};