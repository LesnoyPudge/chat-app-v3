import { List, Scrollable } from "@components";
import { FC } from "react";
import { Controls, Participant } from "./components";
import { useMemoSelectorV2 } from "@redux/hooks";
import { AppSelectors } from "@redux/features";
import { ScrollableV2 } from "src/dev/WIP/ScrollableV2";



const styles = {
    wrapper: `flex flex-col justify-between items-center gap-3 p-4`,
    list: 'flex w-fit gap-6 mx-auto p-1.5',
}

export const Conversation: FC = () => {
    const {id} = useMemoSelectorV2(AppSelectors.selectMe)

    return (
        <div className={styles.wrapper}>
            <ScrollableV2 direction="horizontal">
                <div className={styles.list}>
                    <List list={[
                        {id: id}, 
                        {id: 'zxc'}, 
                        {id: 'zxc2'},
                        {id: 'zxc3'},
                        {id: 'zxc4'}, 
                        {id: 'zxc5'},
                        {id: 'zxc6'}
                    ]}>
                        {({id}) => (
                            <Participant 
                                key={id} 
                                userId={id}
                            />
                        )}
                    </List>
                </div>
            </ScrollableV2>

            <Controls/>
        </div>
    )
}