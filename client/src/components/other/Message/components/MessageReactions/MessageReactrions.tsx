import { IMessage } from '@backendTypes';
import { AnimatedTransition, Button, Conditional, Emoji, EmojiCode, EmojiPicker, Icon, List, OverlayContextProvider, OverlayItem, RefContextProvider, RelativelyPositioned, Tooltip } from '@components';
import { animated } from '@react-spring/web';
import { PropsWithClassName } from '@types';
import { conditional, twClassNames } from '@utils';
import { FC, useContext } from 'react';
import { MessageContext } from '../../Message';



interface MessageReactions extends PropsWithClassName {
    message: IMessage & {reactions: {code: EmojiCode, users: string[]}[]};
    addReaction: (code: EmojiCode) => void;
}

const styles = {
    wrapper: 'flex flex-wrap gap-1',
    emojiButton: {
        base: `flex items-center py-0.5 px-1.5 rounded-md 
        text-sm transition-all duration-100 hover:bg-primary-hover`,
        active: 'bg-brand hover:bg-brand-hover text-white',
    },
    emoji: 'w-4 h-4 mr-1.5',
    addReactionButton: 'fill-icon-200 hover:fill-icon-100 focus-visible:fill-icon-100',
    addReactionIcon: 'w-4 h-4 mx-1',
    tooltip: 'text-sm',
};

export const MessageReactions: FC<MessageReactions> = ({
    className = '',
    addReaction,
    message,
}) => {
    const showReactions = !!message.reactions.length;

    return (
        <Conditional isRendered={showReactions}>
            <div 
                className={twClassNames(styles.wrapper, className)}
                role='group'
                aria-label='Реакции'
            >
                <List list={message.reactions}>
                    {({ code, users }) => {
                        const isActive = users.includes('3');
                        const label = conditional(
                            `Убрать эмодзи ${code}`, 
                            `Добавить эмодзи ${code}`,
                            isActive,
                        );

                        return (
                            <RefContextProvider>
                                <Button 
                                    className={twClassNames(
                                        styles.emojiButton.base,
                                        { [styles.emojiButton.active]: isActive },
                                    )}
                                    label={label}
                                    isActive={isActive}
                                    onLeftClick={() => addReaction(code)}
                                >
                                    <Emoji
                                        className={styles.emoji}
                                        code={code}
                                    />

                                    <div>{users.length}</div>
                                </Button>

                                <Tooltip 
                                    className={styles.tooltip}
                                    preferredAlignment='top' 
                                    spacing={5}
                                    dependencyList={[isActive]}
                                >
                                    {label}
                                </Tooltip>
                            </RefContextProvider>
                        );
                    }}
                </List>
                        
                <OverlayContextProvider>
                    {({ isOverlayExist, openOverlay }) => (
                        <RefContextProvider>
                            {({ targetRef }) => (
                                <>
                                    <Button
                                        className={styles.addReactionButton}
                                        hasPopup='dialog'
                                        label='Выбрать реакцию'
                                        isActive={isOverlayExist}
                                        onLeftClick={openOverlay}
                                    >
                                        <Icon
                                            className={styles.addReactionIcon}
                                            iconId='add-reaction-icon'
                                        />
                                    </Button>

                                    <Tooltip 
                                        className={styles.tooltip}
                                        preferredAlignment='top'
                                        spacing={5}
                                    >
                                        <>Выбрать реакцию</>
                                    </Tooltip>

                                    <AnimatedTransition isExist={isOverlayExist}>
                                        {({ isAnimatedExist, style }) => (
                                            <OverlayItem 
                                                isRendered={isAnimatedExist}
                                                blocking
                                                closeOnClickOutside
                                                closeOnEscape
                                                focused
                                            >
                                                <animated.div 
                                                    role='dialog'
                                                    aria-label='Добавьте реакцию'
                                                    style={style}
                                                >
                                                    <RelativelyPositioned
                                                        targetRefOrRect={targetRef}
                                                        preferredAlignment='right'
                                                        swappableAlignment
                                                    >
                                                        <EmojiPicker onEmojiAdd={addReaction}/>
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
            </div>
        </Conditional>
    );
};

// const styles = {
//     wrapper: 'flex flex-wrap gap-1',
//     emojiButton: {
//         base: `flex items-center py-0.5 px-1.5 rounded-md 
//         text-sm transition-all duration-100 hover:bg-primary-hover`,
//         active: 'bg-brand hover:bg-brand-hover text-white',
//     },
//     emoji: 'w-4 h-4 mr-1.5',
//     addReactionButton: 'fill-icon-200 hover:fill-icon-100 focus-visible:fill-icon-100',
//     addReactionIcon: 'w-4 h-4 mx-1',
//     tooltip: 'text-sm',
// };

// export const MessageReactions: FC<PropsWithClassName> = ({
//     className = '',
// }) => {
//     const { message, handleAddReaction } = useContext(MessageContext) as MessageContext;
//     const showReactions = !!message.reactions.length;

//     return (
//         <Conditional isRendered={showReactions}>
//             <div 
//                 className={twClassNames(styles.wrapper, className)}
//                 role='group'
//                 aria-label='Реакции'
//             >
//                 <List list={message.reactions}>
//                     {({ code, users }) => {
//                         const isActive = users.includes('3');
//                         const label = conditional(
//                             `Убрать эмодзи ${code}`, 
//                             `Добавить эмодзи ${code}`,
//                             isActive,
//                         );

//                         return (
//                             <RefContextProvider>
//                                 <Button 
//                                     className={twClassNames(
//                                         styles.emojiButton.base,
//                                         { [styles.emojiButton.active]: isActive },
//                                     )}
//                                     label={label}
//                                     isActive={isActive}
//                                     onLeftClick={() => handleAddReaction(code)}
//                                 >
//                                     <Emoji
//                                         className={styles.emoji}
//                                         code={code}
//                                     />

//                                     <div>{users.length}</div>
//                                 </Button>

//                                 <Tooltip 
//                                     className={styles.tooltip}
//                                     preferredAlignment='top' 
//                                     spacing={5}
//                                     dependencyList={[isActive]}
//                                 >
//                                     {label}
//                                 </Tooltip>
//                             </RefContextProvider>
//                         );
//                     }}
//                 </List>
                        
//                 <OverlayContextProvider>
//                     {({ isOverlayExist, openOverlay }) => (
//                         <RefContextProvider>
//                             {({ targetRef }) => (
//                                 <>
//                                     <Button
//                                         className={styles.addReactionButton}
//                                         hasPopup='dialog'
//                                         label='Выбрать реакцию'
//                                         isActive={isOverlayExist}
//                                         onLeftClick={openOverlay}
//                                     >
//                                         <Icon
//                                             className={styles.addReactionIcon}
//                                             iconId='add-reaction-icon'
//                                         />
//                                     </Button>

//                                     <Tooltip 
//                                         className={styles.tooltip}
//                                         preferredAlignment='top'
//                                         spacing={5}
//                                     >
//                                         <>Выбрать реакцию</>
//                                     </Tooltip>

//                                     <AnimatedTransition isExist={isOverlayExist}>
//                                         {({ isAnimatedExist, style }) => (
//                                             <OverlayItem 
//                                                 isRendered={isAnimatedExist}
//                                                 blocking
//                                                 closeOnClickOutside
//                                                 closeOnEscape
//                                                 focused
//                                             >
//                                                 <animated.div 
//                                                     role='dialog'
//                                                     aria-label='Добавьте реакцию'
//                                                     style={style}
//                                                 >
//                                                     <RelativelyPositioned
//                                                         targetRefOrRect={targetRef}
//                                                         preferredAlignment='right'
//                                                         swappableAlignment
//                                                     >
//                                                         <EmojiPicker onEmojiAdd={handleAddReaction}/>
//                                                     </RelativelyPositioned>
//                                                 </animated.div>
//                                             </OverlayItem>
//                                         )}
//                                     </AnimatedTransition>
//                                 </>
//                             )}
//                         </RefContextProvider>
//                     )}
//                 </OverlayContextProvider>
//             </div>
//         </Conditional>
//     );
// };