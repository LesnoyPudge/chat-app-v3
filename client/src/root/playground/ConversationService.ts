import { autoBind, debounce, derivedPromise, ListenerStore } from "@lesnoypudge/utils";
import { socketIO } from "@root/features";



const createLock = () => {
    let derivedPromiseResult: ReturnType<typeof derivedPromise<void>>;

    const lock = () => {
        derivedPromiseResult = derivedPromise();
        return derivedPromiseResult[0];
    };

    const unlock = () => {
        derivedPromiseResult[1].resolve();
    }
    
    return {
        lock,
        unlock,
    }
}

type UserId = string;

type Offer = {
    userId: UserId;
    conversationId: string,
    offer: RTCSessionDescriptionInit,
}

type Conversation = {
    id: string;
    participants: UserId[];
    data?: {
        createdAt: number;
        initiator: UserId;
        offersByUserId: Record<UserId, Offer>;
    }
}

type IncomingConversations = Offer[];

type OnIncomingConversationsChange = (
    newIncomingConversations: IncomingConversations,
) => void;

export class ConversationService {
    userId: string;
    stunServers?: string[];
    peerConnection: RTCPeerConnection | null;
    localStream?: MediaStream;
    incomingConversations: Map<string, Offer>;
    incomingConversationsListenerStore: ListenerStore<
        null, 
        [IncomingConversations]
    >;
    currentConversationId: string | null;
    dataChannel: RTCDataChannel | null;
    candidates: Set<RTCIceCandidate>;

    constructor(userId: string) {
        this.userId = userId;
        this.incomingConversations = new Map();
        this.incomingConversationsListenerStore = new ListenerStore();
        this.currentConversationId = null;
        this.peerConnection = null;
        this.dataChannel = null;
        this.candidates = new Set()

        autoBind(this)

        // @ts-expect-error
        socketIO.on('Conversation_incomingOffer', this.handleIncomingOffer)
        // @ts-expect-error
        socketIO.on('Conversation_incomingAnswer', this.handleIncomingAnswer)
        // @ts-expect-error
        socketIO.on('Conversation_incomingCandidate', this.handleIncomingCandidate)
    }

    cleanup() {
        this.closeConnection()
        // @ts-expect-error
        socketIO.off('Conversation_incomingOffer', this.handleIncomingOffer)
        // @ts-expect-error
        socketIO.off('Conversation_incomingAnswer', this.handleIncomingAnswer)
        // @ts-expect-error
        socketIO.off('Conversation_incomingCandidate', this.handleIncomingCandidate)
    }

    private async fetchStunServers() {
        if (this.stunServers) return this.stunServers;

        const url = [
            'https://raw.githubusercontent.com/',
            'pradt2/always-online-stun/master/valid_hosts.txt'
        ].join('');
        
        const stunServers = await (
            fetch(url)
            .then((res) => res.text())
            .catch(() => undefined)
        );
        if (!stunServers) {
            return [
                'stun:stun1.l.google.com:19302', 
                'stun:stun2.l.google.com:19302'
            ];
        }
    
        this.stunServers = (
            stunServers
            .split('\n')
            .filter(Boolean)
            .map((server) => {
                return `stun:${server}`;
            })
        );

        return this.stunServers;
    }

    private async getConnection() {
        console.log('getConnection', this)
        if (this.peerConnection) return this.peerConnection;

        this.stunServers = await this.fetchStunServers();

        this.peerConnection = new RTCPeerConnection({
            // iceCandidatePoolSize: 10,
            iceServers: [{
                urls: this.stunServers.slice(0, 5),
            }],
        });

        return this.peerConnection;
    }

    private async getLocalMediaStream() {
        this.localStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                noiseSuppression: true,
                echoCancellation: true,
            },
        }).catch(() => undefined)

        return this.localStream;
    }

    private closeConnection() {
        if (!this.peerConnection) return;

        this.peerConnection.close();
        this.peerConnection = null;
    }

    sendMessage(message: string) {
        if (!this.dataChannel) {
            console.log('data channel not set')
            return;
        }

        this.dataChannel.send(message);

        document.querySelector('#chat')?.appendChild(
            (() => {
                const el = document.createElement('div')
                el.innerText = message;
                
                return el
            })()
        )
    }

    private async handleIncomingCandidate(
        cId: string,
        candidate: string,
    ) {
        const _candidate = JSON.parse(candidate) as RTCIceCandidate;
        const connection = await this.getConnection();

        if (!connection.remoteDescription) {
            this.candidates.add(_candidate)
            
            return;
        }

        await connection.addIceCandidate(
            new RTCIceCandidate(_candidate)
        )
    }

    private async handleIncomingOffer(
        cId: string,
        offer: string,
    ) {
        console.log('handle incoming offer')
        const _offer = JSON.parse(offer) as RTCSessionDescriptionInit;
        const connection = await this.getConnection();
        
        // const debouncedIceHandler = () =>  {
        //     const answer = JSON.stringify(connection.localDescription);
        //     console.log('answer from ice creation', answer)
        
        //     // @ts-expect-error
        //     socketIO.emit('Conversation_answerFromClient', answer);
        // }
        connection.onicecandidate = (e) =>  {
            // const answer = JSON.stringify(connection.localDescription);
            // console.log('answer from ice creation', answer)
            if (!e.candidate) return;
            console.log('should be string', JSON.stringify(e.candidate))
            socketIO.emit(
                // @ts-expect-error
                'Conversation_candidateFromClient', 
                JSON.stringify(e.candidate)
            );
        }

        connection.ondatachannel= (e) => {
            this.dataChannel = e.channel;
            this.dataChannel.onmessage = (e) => {
                document.querySelector('#chat')?.appendChild(
                    (() => {
                        const el = document.createElement('div')
                        el.innerText = e.data;
                        
                        return el
                    })()
                )
            }
            e.channel.onopen = (e) => console.log("open!!!!");
            e.channel.onclose = (e) => console.log("closed!!!!!!");
            
        }
      
        await connection.setRemoteDescription(_offer)

        this.candidates.forEach((candidate) => {
            connection.addIceCandidate(new RTCIceCandidate(candidate))
        })
      
        const answer = await connection.createAnswer()
        await connection.setLocalDescription(answer)

        
        // @ts-expect-error
        socketIO.emit('Conversation_answerFromClient', JSON.stringify(answer));
    }

    private async handleIncomingAnswer(
        cId: string, 
        answer: string,
    ) {
        const _answer = JSON.parse(answer) as RTCSessionDescriptionInit;
        const connection = await this.getConnection();

        console.log('handle answer', connection.signalingState)
        
        // if (connection.signalingState !== 'have-local-offer') return;

        await connection.setRemoteDescription(_answer)

        this.candidates.forEach((candidate) => {
            connection.addIceCandidate(new RTCIceCandidate(candidate))
        })

        console.log('connection is open', _answer)
    }

    async join(conversationId: string) {
        const connection = await this.getConnection();
        const localStream = await this.getLocalMediaStream();
        this.dataChannel = connection.createDataChannel('channel');
        
        this.dataChannel.onmessage = (e) => {
            document.querySelector('#chat')?.appendChild(
                (() => {
                    const el = document.createElement('div')
                    el.innerText = e.data;
                    
                    return el
                })()
            )
        }
        this.dataChannel.onopen = (e) => console.log('connection is open', e.timeStamp);

        const debouncedIceHandler = (
            e: RTCPeerConnectionIceEvent
        ) => {
            if (!e.candidate) return;
            console.log('should be string', JSON.stringify(e.candidate))
            socketIO.emit(
                // @ts-expect-error
                'Conversation_candidateFromClient', 
                JSON.stringify(e.candidate)
            )

            // const offer = JSON.stringify(connection.localDescription);
            // console.log('offer on ice creation', offer)
            // // @ts-expect-error
            // socketIO.emit('Conversation_offerFromClient', offer)
        }

        connection.onicecandidate = debouncedIceHandler;

        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer)
        
        // @ts-expect-error
        socketIO.emit('Conversation_offerFromClient', JSON.stringify(offer))
    }

    leave() {
        console.log('leave')
        this.closeConnection()
    }


    private async onAnswer(id: string, answer: any) {

    }
}