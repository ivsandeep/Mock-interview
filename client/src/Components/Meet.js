import React, { useContext, useState, useEffect } from 'react';
import './Meet.css'
import { SocketContext } from './context/SocketContext'
import Spinner from '../utils/Spinner';
import Navbar from './Navbar'
import Options from './Options';
import { FaMicrophone, FaMicrophoneAltSlash } from 'react-icons/fa'
import { MdDownload } from 'react-icons/md'
import spin1 from '../assets/spin1.gif'
import noteIcon from '../assets/note2.png'
import saveAs from 'file-saver'
import { pdfExporter } from 'quill-to-pdf'
import { message } from 'antd';
import Editor from './Editor';
import {useParams} from 'react-router-dom'

const Meet = (props) => {
  let code=useParams();

  // console.log(code);
  const url=`${window.location.origin}${window.location.pathname}`;
  console.log(url)
  const [meetingInfoCard, setMeetingInfoCard]=useState(false);
  const {
    me,
    call,
    callAccepted,
    callEnded,
    name,
    myVideo,
    userVideo,
    stream,
    setStream,
    myVideoStatus,
    myMicStatus,
    userVideoStatus,
    userMicStatus,
    showEditor,
    otherUserStream,
    otherUser,
    otherUserName,
    quill,
    setQuill,
    
  } = useContext(SocketContext);
  // const notify=call.isRec
  
  const [mobileView, setMobileView] = useState(false);
  const [loading, setLoading] = useState(true);

  const resize = () => {
    setMobileView(window.innerWidth <= 600);
  }

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);

  }, [])
// console.log(me,otherUser);
  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    if (stream) {
      myVideo.current.srcObject = stream;
      return;
    }
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      .then((res) => {
        res.getAudioTracks()[0].enabled = false;
        setStream(res);
        myVideo.current.srcObject = res;
      })
  }, [loading]);


  useEffect(() => {
    if (myVideo.current)
      myVideo.current.srcObject = stream;
  }, [myVideoStatus])

  useEffect(() => {
    if (userVideo.current)
      userVideo.current.srcObject = otherUserStream;
      // console.log(otherUserStream);
  }, [otherUserStream, userVideoStatus, loading]);


  const downloadPdf = async () => {
    const delta = quill.getContents();
    const pdfAsBlob = await pdfExporter.generatePdf(delta);
    message.success('Downloading your whiteboard');
    saveAs(pdfAsBlob, 'whiteboard.pdf');
  };

  console.log()

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'white',
      }}>
        <Spinner starting />
      </div>
    )
  }


  return (
    <div className={showEditor ? ('flex-div') : (' flex-div hide-editor')} >
      <div className='left'>
        <Navbar />
        <div className='video-div'>{' '}
          <div className={callAccepted ? ('video-frames') : ('video-frames v-size')}>

            <div className='video-frame '>
              {stream ? (
                <>
                  {myMicStatus ? <FaMicrophone /> : <FaMicrophoneAltSlash />}
                  {myVideoStatus ? (
                    <video className='video-ref' width={250} height={140} src='' ref={myVideo} autoPlay >
                    </video>
                  ) : (
                    <div className='video-ref img-bg'>
                      <img src={spin1} alt='' />
                    </div>
                  )
                  }
                  <div className='name'>{name} (you)</div>
                </>
              ) : (
                <Spinner />
              )
              }
            </div>
            {
              callAccepted && !callEnded && (
                <div className='video-frame '>
                  {userMicStatus ? <FaMicrophone /> : <FaMicrophoneAltSlash />}
                  {
                    userVideoStatus ? (
                      <video className='video-ref' width={250} height={140} src='' ref={userVideo} autoPlay >

                      </video>
                    ) : (
                      <div className='video-ref img-bg'>
                        <img src={spin1} alt='' />
                      </div>
                    )
                  }
                  <div className='name'>{otherUserName}</div>
                </div>
              )
            }
          </div>
        </div>
         {
          (<div className='bar'>
            <Options history={props.history} />
          </div>)
        }
      </div>
      {!mobileView && showEditor && (
        <div className='right'>
          <div className='editor-div'>
            <div className='head'>
              <div className='head-title'>
                <img width={30} src={noteIcon} alt='' />
                <h3 className='m-auto text-base'>whiteboard</h3>
              </div>
              <button className='download' onClick={() => downloadPdf()} title='Download Whiteboard'>
                <MdDownload />
              </button>
            </div>
            <Editor />
          </div>
        </div>
      )}
      {meetingInfoCard && 
    <div></div>
      }

    </div>
  )
}

export default Meet