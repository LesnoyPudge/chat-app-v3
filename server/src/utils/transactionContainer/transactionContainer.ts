import { startSession, QueryOptions, ClientSession } from 'mongoose';



type QueryOptionsType = (options?: QueryOptions) => QueryOptions;
type OnCommitType = (cb: () => Promise<void> | void) => ClientSession;
interface ITransactionCallbackArgs {
    queryOptions: QueryOptionsType, 
    onCommit: OnCommitType,
}
type TransactionContainerType = <F extends (args: ITransactionCallbackArgs) => ReturnType<F>>(fn: F) => Promise<ReturnType<F>>;

export const transactionContainer: TransactionContainerType = async(fn) => {
    const session = await startSession();

    const transaction = {
        depth: 0,
        ok: false,
        success: () => {
            transaction.depth = 0;
            transaction.ok = true;
        },
        fail: () => {
            transaction.depth = 0;
            transaction.ok = false;
        },
        isSuccessful: () => {
            return transaction.ok && transaction.depth === 0;
        },
        stepIn: () => {
            transaction.depth++;
        },
        stepOut: () => {
            transaction.depth = Math.max(0, transaction.depth - 1);
        },
    };

    const onCommit: OnCommitType = (cb) => session.once('ended', async() => {
        if (transaction.isSuccessful()) return await cb();
    });

    const queryOptions: QueryOptionsType = (options = {}) => {
        return {
            session, 
            lean: true, 
            ...options, 
        };
    };
    
    try {
        session.startTransaction();
        transaction.stepIn();
        const data = await fn({ queryOptions, onCommit });
        transaction.stepOut();
        await session.commitTransaction();
        await session.endSession();
        transaction.success();

        return data;
    } catch(error) {
        transaction.fail();
        await session.abortTransaction();
        await session.endSession();

        throw(error);
    }
};