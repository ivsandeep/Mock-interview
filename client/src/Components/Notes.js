import React, {useState, useCallback, useContext, useEffect} from 'react'

import { message } from 'antd'
import { SocketContext } from './context/SocketContext'
import  { jsPDF } from 'jspdf'





const Notes = () => {
    const {notes, setNotes} =useContext(SocketContext);
    const [mobileView, setMobileView] = useState(false);

    const resize=()=>{
        setMobileView(window.innerWidth<=600);
    }

    useEffect(()=>{
        resize();
        window.addEventListener('resize',resize);
    },[])
    const handleClick=(e)=>{

    }
    const downloadPdf=()=>{
        if(notes.trim().length===0){
            message.error('Please write some text to download');
            return;
        }
        const pdfDoc=new jsPDF();
        pdfDoc.text(notes,10,10);
        message.success('Your notes is downloading');
        pdfDoc.save('Notes.pdf');
    }

  return (
    <div>
        <>
            {!mobileView &&(
                <button type='primary' >

                </button>
            )}
        </>
    </div>
  )
}

export default Notes