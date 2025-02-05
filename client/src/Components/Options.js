import React, { useContext, useState, useEffect } from 'react';
import Notes from './Notes';
import Switch from '../utils/Switch';
import { SocketContext } from './context/SocketContext';
// import { SlOptionsVertical } from 'react-icons/sl'
import { Button, message } from 'antd';
import { HiMiniVideoCamera, HiMiniVideoCameraSlash } from 'react-icons/hi2'
import { MdCallEnd } from 'react-icons/md'
import { BsFillChatLeftTextFill, BsMicFill, BsMicMuteFill } from 'react-icons/bs'


const Options = (props) => {
  // const [callId, setCallId] = useState('');
  const {
    me,
    call,
    callAccepted,
    callEnded,
    // name,
    setCall,
    // setName,
    answerCall,
    endCall,
    myVideoStatus,
    myMicStatus,
    updateMicStatus,
    updateVideoStatus,
    showEditor,
    showChatBox,
    setShowChatBox,
  } = useContext(SocketContext);
  console.log(me);
  const [open, setOpen] = useState(true);
  // const [anchorEl, setAnchorEl] = useState(null);
  const [mobileView, setMobileView] = useState(false);
  const resize = () => {
    setMobileView(window.innerWidth <= 600);
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
  }, []);

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };


  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  useEffect(() => {
    if (call && call.isRecievedCall && !callAccepted) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [call, callEnded]);

  console.log(call);




  return (
    <>
      <div className={showEditor ? ('bg-blue-900 w-full m-auto p-[10px] flex items-center justify-start space-x-5 rounded-tl-2 rounded-tr-2 rounded-bl-0 rounded-br-0 h-[50px]') : ('flex flex-row m-auto w-full bg-blue-800 h-[56px] items-center  justify-center')}>

        <div className='flex flex-row item-center justify-center'>
          {/* Switch */}

            {/* !mobileView && */}
            <div class="group relative m-12 flex justify-center bg-white w-[45px] pl-2 h-[45px] items-center rounded-full cursor-pointer ">
              <button class="rounded  text-sm text-white shadow-sm"> <Switch /> </button>
              <span class="absolute bottom-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Interview Mode</span>
            </div>

          {/* Video button */}
          <div class="group relative m-12 flex justify-center bg-white w-[45px] h-[45px] items-center rounded-full cursor-pointer">
            <button onClick={() => updateVideoStatus()} > {myVideoStatus ? <HiMiniVideoCamera size={20} /> : <HiMiniVideoCameraSlash size={20} />} </button>
            <span class="absolute bottom-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">{myVideoStatus ? 'Turn Off Video' : 'Turn on Video'}</span>
          </div>
          {/* Mic button */}
          <div class="group relative m-12 flex justify-center bg-white w-[45px] h-[45px] items-center rounded-full cursor-pointer">
            <button onClick={() => updateMicStatus()} >
              {myMicStatus ? (<BsMicFill size={20} />) : (<BsMicMuteFill size={20} />)} </button>
            <span class="absolute bottom-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">{myMicStatus ? 'Turn off mic' : 'Turn on mic'}</span>
          </div>
          {/* Chat */}
          <div class="group relative m-12 flex justify-center bg-white w-[45px] h-[45px] items-center rounded-full cursor-pointer">
            <button onClick={() => {
              setShowChatBox(!showChatBox);
            }} className={!myVideoStatus ? ('bg-gray-400') : ('bg-white')}> <BsFillChatLeftTextFill size={20} /> </button>
            <span class="absolute bottom-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Chat</span>
          </div>
          {/* End call */}
          <div class="group relative m-12 flex justify-center items-center w-[45px] h-[45px] bg-red-800 rounded-full cursor-pointer">
            <button onClick={() => { endCall(); }} > <MdCallEnd size={20} color='white' /> </button>
            <span class="absolute bottom-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">End call</span>
          </div>
        </div>









        <Notes />
      </div>
      <div>
        {call && open && (
          <div open={open} className='fixed inset-0  flex items-start justify-end m-2'>
            <div className='flex pr-0 flex-col w-[200px] h-[120px] rounded-lg bg-blue-900'>
              <div className='flex m-auto flex-col items-center justify-center text-white'>Meet Call</div>
              <div className='flex items-center justify-center'>
                <div className='text-md text-white'>
                  <p>{call.callerName} wants to join with you</p>
                  <div className='flex justify-between items-center'>
                    <Button
                      type='primary'
                      onClick={() => {
                        answerCall();
                        setOpen(false);
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      type='primary'
                      onClick={() => {
                        setCall(null);
                        setOpen(false);
                      }}
                    >
                      Deny
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Options