import { cn } from '@utils';
import { FC, useRef } from 'react';
import { List, Placeholder } from '@components';
import { createPlaceholderVariation } from './placeholderVariation';
import { RT } from '@lesnoypudge/types-utils-react/namespace';
import { useMemoSelectorV2 } from '@redux/hooks';
import { AppSelectors } from '@redux/features';



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

export const MessagePlaceholder: FC<RT.PropsWithClassName> = ({
    className = '',
}) => {
    const variationRef = useRef(createPlaceholderVariation());
    const {settings} = useMemoSelectorV2(AppSelectors.selectMe);

    const isCozy = settings.messageDisplayMode === 'cozy';
    const isCompact = !isCozy;

    return (
        <Placeholder
            className={cn(styles.wrapper, className)}
            title='Загрузка сообщения...'
        >
            <div className={styles.firstCol}>
                <If condition={isCozy}>
                    <div className={styles.avatar}></div>
                </If>

                <If condition={isCompact}>
                    <div className={styles.timestamp}></div>
                </If>
            </div>


            <div className={styles.content}>
                <If condition={isCozy}>
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
                                            isCompact &&
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
        </Placeholder>
    );
};