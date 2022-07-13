import { startSession, QueryOptions, ClientSession } from 'mongoose';



type QueryOptionsType = (extraOptionsObject?: QueryOptions) => QueryOptions;
type OnCommitType = (cb: () => void) => ClientSession;
interface ITransactionCallbackArgs {
    queryOptions: QueryOptionsType, 
    onCommit: OnCommitType,
}
type TransactionContainerType = <F extends (args: ITransactionCallbackArgs) => ReturnType<F>>(fn: F) => Promise<ReturnType<F>>;

export const transactionContainer: TransactionContainerType = async(fn) => {
    const session = await startSession();

    let transactionCounter = 0;
    let successfullyCommitted = true;

    const onCommit: OnCommitType = (cb) => session.once('ended', () => {
        if (successfullyCommitted && transactionCounter === 0) return cb();
    });

    const queryOptions: QueryOptionsType = (extraOptionsObject) => {
        const optionsObject = { session };
        if (!optionsObject) return optionsObject;
        const mergedOptionsObject = { ...optionsObject, ...extraOptionsObject };

        return mergedOptionsObject;
    };
    
    try {
        session.startTransaction();
        transactionCounter++;
        const data = await fn({ queryOptions, onCommit });
        transactionCounter--;
        await session.commitTransaction();
        await session.endSession();
        console.log('tranaction ends without errors');

        return data;
    } catch(error) {
        console.log('aborting transaction');
        successfullyCommitted = false;
        transactionCounter--;
        await session.abortTransaction();
        await session.endSession();

        throw(error);
    }
};