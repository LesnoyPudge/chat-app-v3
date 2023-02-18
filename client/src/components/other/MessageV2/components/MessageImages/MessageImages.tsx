import { twClassNames } from '@utils';
import { FC } from 'react';
import { Button, Image, List } from '@components';



const styles = {
    wrapper: {
        base: 'grid gap-1 max-w-[550px]',
        layout: {
            9: 'grid-cols-3 grid-rows-3 ',
        },
    },
    items: {
        base: 'relative rounded-md overflow-hidden bg-primary-500',
        layout: {
            9: '',
        },
    },
};

const itemsCount = 9;
export const MessageImages: FC = () => {
    return (
        <div className={twClassNames(
            styles.wrapper.base,
            styles.wrapper.layout[itemsCount],
        )}>
            <List list={[...Array(itemsCount)]}>
                {(_, i) => (
                    <Button 
                        className={twClassNames(
                            styles.items.base,
                            styles.items.layout[itemsCount],
                        )}
                    >
                        <Image
                            className='w-full h-full'
                            src='https://i.pravatar.cc/90'
                            alt={`Вложение №${i}`}
                        />
                    </Button>
                )}
            </List>
        </div>
    );
};