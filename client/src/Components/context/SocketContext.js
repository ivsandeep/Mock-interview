import { createContext, useMemo, useState, useRef, useEffect } from "react";
import { io } from 'socket.io-client'
import Peer from 'simple-peer'

import { message } from "antd";
import { Navigate, useNavigate } from "react-router-dom";

const SocketContext = createContext();

const socket=io('http://localhost:5000');
const ContextProvider = ({ children }) => {

    // const socket = io.connect('http://localhost:5000');
    // const socket=useMemo(()=>io('http://localhost:5000'),[]);
    // socket.connect();
    console.log(socket)
    const [socketState, setSocketState] = useState(socket);
    const [me, setMe] = useState('');
    const [newMeet, setNewMeet] = useState(false);
    const [call, setCall] = useState({});
    const [stream, setStream] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const [otherUserName, setOtherUserName] = useState('');
    const [myVideoStatus, setMyVideoStatus] = useState(true);
    const [userVideoStatus, setUserVideoStatus] = useState(true);
    const [myMicStatus, setMyMicStatus] = useState(false);
    const [userMicStatus, setUserMicStatus] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [showChatBox, setShowChatBox] = useState(false);
    const [messages, setMessages] = useState([]);
    const [notes, setNotes] = useState(false);
    const [meetingCode, setMeetingCode] = useState('');
    const [notesOpen, setNotesOpen] = useState(false);
    const [quill, setQuill] = useState(null);
    const [otherUserStream, setOtherUserStream] = useState(null);
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    if (socket.connected) console.log('socket is connected')


    useEffect(() => {
        if (!navigator.onLine) alert('Connect to internet!')
    }, [navigator]);

    useEffect(() => {
        socket.on('me', (id) => {
            setMe(id);
            // console.log(me);
            // console.log(me);
        });
        socket.on('calluser', ({from, name:callerName, signal}) => {
            setCall({
                from,
                callerName,
                signal,
                isRecievedCall: true,
            });
            setOtherUserName(callerName);
        });

        socket.on('updateUserMedia', ({ type, mediaStatus }) => {
            if (!type || !mediaStatus || !mediaStatus.length)
                return;

            if (type === 'video') {
                // message.info(`User turned ${mediaStatus[0] ? 'on' : 'off'} his video`)
                setUserVideoStatus(mediaStatus[0]);
                return;
            }
            if (type === 'audio') {
                // message.info(`User ${mediaStatus[0] ? 'unmuted' : 'muted'} his mic`);
                setUserMicStatus(mediaStatus[0]);
                return;
            }
            setUserMicStatus(mediaStatus[0])
            setUserVideoStatus(mediaStatus[1]);
        });

        socket.on('callended', () => {
            setCall(null);
            message.info('User disconnected from call');
            setCallAccepted(false);
            setCallEnded(true);
        });

    }, [])



    const callUser = (id) => {
        message.info('Calling... Please wait for other user to accept the call');
        const peer = new Peer({ initiator: true, trickle: false, stream});
        setOtherUser(id);

        peer.on('signal', (data) => {
            socket.emit('calluser', {
                userToCall: id,
                from: me,
                signal: data,
                name,
            });

        });
        // Receiving a remote video stream which can be displayed in a video tag
        peer.on('stream', (currentStream) => {
            setOtherUserStream(currentStream);
            // userVideo.current.srcObject = currentStream;
        });

        socket.on('callaccepted', (signal, userName) => {
            socket.emit('updateMyMedia', {
                data: {
                    type: 'both',
                    mediaStatus: [myMicStatus, myVideoStatus],
                },
                userToUpdate: id,
            });
            setOtherUserName(userName);
            setCallAccepted(true);
            peer.signal(signal);
            message.info(`${userName} joined with you`);
        });
        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        setOtherUser(call.from);
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on('signal', (data) => {
            socket.emit('answercall', {
                name,
                signal: data,
                to: call.from,
                type: 'both',
                mediaStatus: [myMicStatus, myVideoStatus],
            })
            message.info(`${call.callerName} joined with you`);
        });

        peer.on('stream', (currentStream) => {
            setOtherUserStream(currentStream);
            // userVideo.current.srcObject = currentStream;
        })

        peer.signal(call.signal);
        connectionRef.current = peer;
    };


    const navigate=useNavigate();
    const endCall = () => {
        socket.emit('callended', otherUser);
        setCallEnded(true);
        setCallAccepted(false);
        if (connectionRef.current) connectionRef.current.destroy();
        navigate('/');
        window.location.reload();
        message.success('Meeting Ended');

    }


    const updateVideoStatus = () => {
        socket.emit('updateMyMedia', {
            data: {
                type: 'video',
                mediaStatus: [!myVideoStatus]
            },
            userToUpdate: otherUser,
        });

        stream.getVideoTracks()[0].enabled = !myVideoStatus;
        setMyVideoStatus(!myVideoStatus);
    };

    const updateMicStatus = () => {
        socket.emit('updateMyMedia', {
            data: {
                type: 'audio',
                mediaStatus: [!myMicStatus]
            },
            userToUpdate: otherUser,
        });
        stream.getAudioTracks()[0].enabled = !myMicStatus;
        setMyMicStatus(!myMicStatus);
    };





    return (
        <SocketContext.Provider
            value={{
                me,
                setMe,
                newMeet,
                setNewMeet,
                call,
                setCall,
                stream,
                setStream,
                callAccepted,
                setCallAccepted,
                callEnded,
                setCallEnded,
                name,
                setName,
                otherUser,
                setOtherUser,
                otherUserName,
                setOtherUserName,
                myVideoStatus,
                setMyVideoStatus,
                myMicStatus,
                setMyMicStatus,
                userVideoStatus,
                setUserVideoStatus,
                userMicStatus,
                setUserMicStatus,
                showEditor,
                setShowEditor,
                showChatBox,
                setShowChatBox,
                messages,
                setMessages,
                notes,
                setNotes,
                notesOpen,
                setNotesOpen,
                meetingCode,
                setMeetingCode,
                quill,
                setQuill,
                otherUserStream,
                setOtherUserStream,
                myVideo,
                userVideo,
                connectionRef,
                answerCall,
                callUser,
                endCall,
                updateVideoStatus,
                updateMicStatus,
                socketState,
            }}
        >
            {children}
        </SocketContext.Provider>
    )





}

export { SocketContext, ContextProvider };