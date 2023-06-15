import { startSession, ClientSession } from 'mongoose';



class Transaction {
    session: ClientSession | null;
    private ok: boolean;
    private depth: number;

    constructor() {
        this.session = null;
        this.ok = false;
        this.depth = 0;
    }

    async start() {
        if (this.depth !== 0) {
            this.depth++;
            return;
        }

        this.session = await startSession();
        this.session.startTransaction();
        this.ok = false;
        this.depth++;
    }

    async end() {
        if (!this.session) return;

        this.depth--;

        if (this.depth !== 0) return;

        await this.session.commitTransaction();

        this.ok = true;
        
        await this.session.endSession();
        
        this.session = null;
        this.ok = false;
    }

    async error() {
        this.ok = false;
        this.depth = 0;

        await this.session?.abortTransaction();
        await this.session?.endSession();

        this.session = null;
    }

    onCommit(cb: CallableFunction) {
        if (!this.session) return;

        this.session.once('ended', async() => {
            if (transaction.ok) await cb();
        });
    }
}

type TransactionContainer = <F extends (args: Pick<Transaction, 'session' | 'onCommit'>) => ReturnType<F>>(fn: F) => Promise<ReturnType<F>>;

const transaction = new Transaction();

export const transactionContainer: TransactionContainer = async(fn) => {
    try {
        await transaction.start();

        const data = await fn({ 
            session: transaction.session, 
            onCommit: transaction.onCommit.bind(transaction), 
        });

        await transaction.end();

        return data;
    } catch (error) {
        await transaction.error();
        throw error;
    }
};
//     session: ClientSession;
//     ok: boolean;

//     constructor(session: ClientSession) {
//         this.session = session;
//         this.ok = false;
//     }

//     async start() {
//         this.session.startTransaction();
//     }

//     async end() {
//         this.ok = true;

//         await this.session.commitTransaction();
//         await this.session.endSession();
//     }

//     async error() {
//         this.ok = false;
        
//         await this.session.abortTransaction();
//         await this.session.endSession();
//     }
// }

// export const transactionContainer: TransactionContainer = async(fn) => {
//     const session = await startSession();
//     const transaction = new Transaction(session);

//     const onCommit: OnCommit = (cb) => session.once('ended', async() => {
//         if (transaction.ok) await cb();
//     });
//     // let depth = 0;
//     try {
//         await transaction.start();
//         // depth++;
//         // console.log(depth);
//         const data = await fn({ session, onCommit });

//         await transaction.end();
//         // depth--;
//         // console.log(depth);
//         return data;
//     } catch(error) {
//         await transaction.error();
//         // depth--;
//         // console.log(depth);
//         throw(error);
//     }
// };