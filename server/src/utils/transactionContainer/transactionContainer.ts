import { startSession, QueryOptions, ClientSession } from 'mongoose';



type QueryOptionsType = (extraOptionsObject?: QueryOptions) => QueryOptions;
type OnCommitType = (fn: () => void) => ClientSession;

export const transactionContainer = async<F extends (
    {
        queryOptions, 
        onCommit,
    }: {
        queryOptions: QueryOptionsType, 
        onCommit: OnCommitType,
    }
) => ReturnType<F>>(fn: F) => {
    const session = await startSession();

    let transactionCounter = 0;
    let successfullyCommitted = true;

    const onCommit: OnCommitType = (fn) => session.once('ended', () => {
        if (successfullyCommitted || transactionCounter === 0) return fn();
    });

    const queryOptions: QueryOptionsType = (extraOptionsObject) => {
        const optionsObject = {session};
        if (!optionsObject) return optionsObject;
        const mergedOptionsObject = {...optionsObject, ...extraOptionsObject};

        return mergedOptionsObject;
    };
    
    try {
        session.startTransaction();
        transactionCounter++;
        const data = await fn({queryOptions, onCommit});
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