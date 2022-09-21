import { Button, ContextMenu, RefContextProvider, Tooltip, UserAvatar } from '@components';
import { FC } from 'react';

// .accountPanel {
//     background-color: #292b2f;
//     margin-top: auto;
// }

// .accountPreview {
//     display: flex;
//     align-items: center;
//     gap: 15px;
// }

// .username {
//     font-size: 1.4rem;
//     color: white;
//     font-weight: 600;
// }

// .identifier {
//     font-size: 1.2rem;
//     color: #b9bbbe;
// }

// .inner {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     height: 52px;
//     padding: 0 8px;
// }

export const UserToolBar: FC = () => {
    return (
        <div className='bg-primary-400 h-[52px] py-0 px-2 flex mt-auto items-center'>
            <RefContextProvider>
                <div className='flex items-center hover:bg-hover focus-visible:bg-hover' tabIndex={0}>
                    <UserAvatar
                        avatar='qwe'
                        status='online'
                        size={36}
                    />

                    <RefContextProvider>
                        <Button
                            className='text-white font-semibold text-sm ml-2'
                            isDefaultStyled={false}
                            onClick={() => {
                                console.log('copied');
                            }}
                        >
                            {'myName'}
                        </Button>

                        <Tooltip position='top'>
                            <>copy name</>
                        </Tooltip>
                    </RefContextProvider>
                </div>

                <ContextMenu handleLeftClick handleMiddleClick>
                    <div className='flex flex-col'>
                        <button>change status</button>
                        <button>copy username</button>
                    </div>
                </ContextMenu>
            </RefContextProvider>
            
        </div>
        // <div className={styles.accountPanel}>
        //     <div className={styles.inner}>
        //         <div className={styles.accountPreview}>
        //             <UserAvatar
        //                 userId={id}
        //             />
        //             <Tooltip 
        //                 position='top' 
        //                 content={
        //                     isThrottling 
        //                         ? 'Cкопировано' 
        //                         : 'Нажмите, чтобы скопировать'
        //                 }
        //             >
        //                 <Flex direction='column' cursor='pointer' nativeAttributes={{ onClick: handleCopy }}>
        //                     <Text fontSize={1.4} fontWeight={600} color='#fff'>
        //                         {username}
        //                     </Text>

    //                     <Text fontSize={1.2} color='#b9bbbe'>
    //                             #{identifier}
    //                     </Text>
    //                 </Flex>
    //             </Tooltip>
    //         </div>

    //         <OpenModalButton
    //             name='AppSettings'
    //         >
    //                 Settings
    //         </OpenModalButton>
    //     </div>
    // </div>
    );
};