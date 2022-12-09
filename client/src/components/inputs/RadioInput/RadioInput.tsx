import { Button } from '@components';
import { twClassNames } from '@utils';
import { FC, useState } from 'react';



interface IRadioInput {
    name: string;
    value: string;
    description: string;
}

const styles = {
    wrapper: {
        base: `flex p-2.5 rounded-md cursor-pointer w-full text-secondary 
        hover:text-primary bg-primary-300 hover:bg-primary-100`,
        active: 'text-primary bg-primary-100',
    },
    indicatorWrapper: 'flex shrink-0 w-6 h-6 rounded-full border-2 border-current',
    indicatorInner: {
        base: 'm-auto w-3 h-3 rounded-full bg-current',
        notActive: 'scale-0',
    },
    description: 'font-medium ml-3.5',
};

export const RadioInput: FC<IRadioInput> = ({
    name,
    value,
    description,
}) => {
    const [isActive, setIsActive] = useState(false);

    const handleChange = () => {
        console.log('change');
        setIsActive(prev => !prev);
    };

    return (
        <>
            <Button
                className={twClassNames(
                    styles.wrapper.base, 
                    { [styles.wrapper.active]: isActive },
                )}
            >
                <div className={styles.indicatorWrapper}>
                    <div 
                        className={twClassNames(
                            styles.indicatorInner.base, 
                            { [styles.indicatorInner.notActive]: !isActive },
                        )}
                    ></div>
                </div>

                <div className={styles.description}>
                    {description}
                </div>
            </Button>
            
            <input 
                name={name}
                value={value}
                type='radio' 
                checked={isActive}
                tabIndex={-1}
                onChange={handleChange}
            />
        </>
        
    // <label 
    //     className={twClassNames(
    //         styles.wrapper.base, 
    //         { [styles.wrapper.active]: isActive },
    //     )}
    //     tabIndex={0}
    // >
            
    //     <input 
    //         name={name}
    //         value={value}
    //         type='radio' 
    //         checked={isActive}
    //         tabIndex={-1}
    //         onChange={handleChange}
    //     />
           

    //     <div className={styles.indicatorWrapper}>
    //         <div 
    //             className={twClassNames(
    //                 styles.indicatorInner.base, 
    //                 { [styles.indicatorInner.notActive]: !isActive },
    //             )}
    //         ></div>
    //     </div>

    //     <div className={styles.description}>
    //         {description}
    //     </div>
    // </label>
    );
};