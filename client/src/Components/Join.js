import React, { useContext, useEffect, useRef, } from 'react'
import { SocketContext } from './context/SocketContext'
import { message } from 'antd'
import Navbar from './Navbar';
import Spinner from '../utils/Spinner';
import { useNavigate, Link, useParams, redirect } from 'react-router-dom'
import Footer  from './Footer';
const Join = (props) => {
  const {
    callAccepted,
    name,
    setName,
    stream,
    setStream,
    callUser,
    meetingCode,
    setMeetingCode,
    newMeet,
    // myVideo,
  } = useContext(SocketContext);

  const myPreviewVideo = useRef({});
  const navigate = useNavigate();
  const params = useParams();
  // console.log(params);
  // console.log('1st'+stream);
  // console.log(myPreviewVideo);

  useEffect(() => {
    console.log(meetingCode);
    console.log(newMeet);
    // if (!newMeet && meetingCode.length === 0) {
    //   navigate('/join/'+meetingCode+ '/');
    //   window.location.reload();
    //   return;
    // }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((res) => {
        res.getAudioTracks()[0].enabled = false;
        setStream(res);
        if(myPreviewVideo.current)
        myPreviewVideo.current.srcObject = res;
      });
  }, []);


  





  useEffect(() => {
    if (callAccepted)
      navigate('/meet');
  }, [callAccepted, navigate])

  console.log(newMeet);
  console.log(meetingCode);










  return (
    <div className='max-w-screen max-h-screen'>
      <Navbar />

      <div className=' max-w-[10/12] h-[450px]  m-auto flex flex-col items-center justify-center '>
        <h1 className='text-3xl mb-3 '>Your Video</h1>
        <div>
          {
            stream ?
              (
                <video className=' border-2 rounded-md' ref={myPreviewVideo} width={300} height={160} src='' autoPlay muted></video>
              ) :
              (
                <Spinner />
              )
          }
        </div>

        <div>
          {
            stream &&
            (
              <div className='mt-4 flex flex-col'>
                <input className='w-[300px] border-2 rounded-md p-1' type='text' placeholder='Enter Your Name' value={name} onChange={(e) => {
                  setName(e.target.value);
                }}
                />
                <div className=' mt-3 flex flex-row justify-end space-x-2'>
                  {
                    newMeet ? (
                      <Link to={`/meet/${meetingCode}`}>
                        <button className='w-[40px] border-2 border-l-violet-900 rounded-md ' onClick={() => {
                          if (name.trim().length === 0) {
                            message.error('Please enter your name');
                            return;
                          }
                        }}>
                          Start
                        </button>

                      </Link>
                    ) :
                      (
                        <button onClick={() => {
                          if (name.trim().length === 0) {
                            message.error("Please enter your name"); return;

                          }
                          callUser(meetingCode);
                        }}>
                          Join Now
                        </button>
                      )
                  }
                  <button onClick={() => {
                    setMeetingCode('');
                    navigate('/');
                    window.location.reload();
                  }}>
                    Cancel
                  </button>
                </div>

              </div>
            )
          }
        </div>
      </div>
      <Footer/>
    </div >
  )
}

export default Join