import React from 'react'

import logo from '../assets/logo.png'
import name from '../assets/interviewBuddy.png'
import logo_ from '../assets/logo_.png'
import logoY from '../assets/logob.png'
import logo3 from '../assets/logo3.png'
import Login from './Login'
import Signup from './Signup'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
    const navigate=useNavigate();
    const redirectHandler=()=>{
        navigate('/');
        window.location.reload();
    }
    return (
        <div>
            <div className='w-full bg-blue-900 h-[60px] text-white flex flex-row justify-between'>
                <div className='h-full ml-3 flex flex-row items-center justify-start space-x-2 
         text-xl'>
                    
                    <div className='flex cursor-pointer' onClick={redirectHandler}>
                        <img src={logoY} width={36} alt='' className='ml-1 mr-1 mb-[1px]' />   
                        {/* <div className='bg-[#ffd700] ml-1 mr-1 w-[3px]'>  </div> */}
                        {/* <img src={name} alt='' width={300} /> */}
                        <div className='ml-1  mt-[4px] font-noto text-[24px] text-[#FFD700]  '><span className='font-light'>Interview</span><span className=' font-borel font-bold' >Buddy</span></div>  
                   </div>
                </div>
                <div className='w-1/3 h-full flex flex-row justify-end items-center mr-6'>
                    <Login></Login> /
                    <Signup></Signup>
                    
                </div>
            </div>
        </div>
    )
}

export default Navbar