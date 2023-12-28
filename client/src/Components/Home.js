import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import person from '../assets/person.png'
import Footer from './Footer'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { SocketContext } from './context/SocketContext'
import { useParams } from 'react-router-dom'
import { message } from 'antd'
import { nanoid } from 'nanoid'


const Home = (props) => {
  const { meetingCode, setMeetingCode, setNewMeet } = useContext(SocketContext);
  const [inputMeetingCode,setInputMeetingCode]=useState('');
  const [prevent, setPrevent]=useState(false);
  // const location= useLocation();
  const navigate=useNavigate();
  useEffect(() => {
    // if (paramsCode.length) {
      // if (paramsCode.substring(0, 5) === '?ref=') return;
      // setMeetingCode(id);
    // }
    setNewMeet(null);
  }, [])

  const startMeeting=()=>{
    // const id = nanoid(8);
    // setMeetingCode(id);
    setNewMeet(true);
    setPrevent(true);
    // console.log(id);
    navigate('/join');
  }
  const inputHandler=(e)=>{
    // e.preventDefault();
    // console.log(e.target.value);
    // setInputMeetingCode(e.target.value);
    setMeetingCode(e.target.value);

  }
  const joinMeeting=() => {
    // console.log(meetingCode);
    if (meetingCode.trim().length===0){
      message.error('Please enter the meeting code');
      return;
    }
    navigate('/join');
  }

  return (
    <div className='max-w-screen max-h-screen'>
      <Navbar></Navbar>

      <br>

      </br>
      <div className=' m-auto flex flex-row items-center justify-between w-10/12 h-[430px]  gap-2'>
        <div className='p-4 w-1/2 h-[400px]  flex flex-col items-start justify-start'>
          <div className='mt-4 text-2xl'>Seamless Interview Experience <br /> <div className='mt-2 text-5xl font-semibold'>Ace Your <span className='text-blue-800'>Next Job!</span> </div>  </div>
          <div className='flex text-l text-gray-600 '>
            Elevate Your Skills with Our Interactive Online 1:1 Interview WebApp.

          </div>
          <div className='mt-[60px] flex flex-col space-y-2 items-start'>
            {/* <Link to={`join/#init`} > */}
              <button className='bg-blue-700 w-[330px]  p-2 text-lg rounded-md text-white hover:bg-blue-800' onClick={startMeeting}> Start meeting </button>
               {/* </Link> */}
            <span className='text-gray-600 m-auto'>OR</span>
            <div className='flex flex-col space-x-3'>
              <input className=' w-[330px] border-2 p-2 rounded-md border-gray-300' type='text' placeholder='Enter your meeting code' value={meetingCode || ''} onChange={inputHandler} />
              <div className='mt-2 w-full flex flex-row justify-end '>
                {/* <Link to={`join/${meetingCode}`}> */}
                  <button onClick={joinMeeting} className='mr-3 w-[120px] bg-blue-700  p-2 text-md rounded-md text-white hover:bg-blue-800 '>Join meeting</button>

                {/* </Link> */}

              </div>
            </div>
          </div>
        </div>

        <div className='w-1/2 h-full text-blue-400 flex justify-center items-center'>
          <img width={380} src={person} alt='' />
        </div>
      </div>
      <Footer></Footer>
    </div>

  )
}

export default Home