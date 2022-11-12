import { IMessage } from '@backendTypes';
import { Conditional, MFC, Time, UserAvatar, WithMemo } from '@components';



interface IMessageItem {
    message: IMessage;
    isHeadless?: boolean;
    tabIndex: number;
}

export const MessageItem: MFC<IMessageItem> = WithMemo(({ 
    message,
    isHeadless = false,
    tabIndex,
}) => {
    return (
        <li 
            className='hover:bg-message 
            focus-visible:bg-message focus-within:bg-message
            flex group'
            key={message.id}
            tabIndex={tabIndex}
        >
            <div className='w-[72px] flex justify-center shrink-0'>
                <Conditional isRendered={isHeadless}>
                    <Time
                        className='opacity-0 group-hover:opacity-100 
                        group-focus-visible:opacity-100 
                        group-focus-within:opacity-100'
                        date={message.createdAt} 
                        format='HH:mm'
                    />
                </Conditional>

                <Conditional isRendered={!isHeadless}>
                    <UserAvatar
                        className='h-10 w-10'
                        avatar='https://i.pravatar.cc/52'
                    />
                </Conditional>
            </div>

            <div className='flex flex-col w-full'>
                <Conditional isRendered={!isHeadless}>
                    <div className='flex gap-2'>
                        <span className='font-semibold'>username</span>
                        
                        <Time 
                            date={message.createdAt} 
                            format='dd.MM.yyyy'
                        />
                    </div>
                </Conditional>

                <div>
                    {message.content}
                </div>

                <Conditional isRendered={!!message.atttachments.length}>
                    <ul className='flex flex-col w-full gap-2'>
                        {message.atttachments.map((atttachment, index) => {
                            return (
                                <li className='' key={index}>
                                    atttachment #{index}
                                </li>
                            );
                        })}
                    </ul>
                </Conditional>
            </div>
        </li>
    );
});