import React, {useState, useEffect, useCallback, useContext} from 'react'

import 'quill/dist/quill.snow.css'
import Quill from 'quill';
import { SocketContext } from './context/SocketContext';
import 'highlight.js/styles/github.css'
import hljs from 'highlight.js';

const toolBarOptions=[
  ['bold', 'italic', 'underline', 'strike' ],
  ['blockquote', 'code-block'],
  [{header:1}, {header:2}],
  [{list:'ordered'},{list:'bullet'}],
  [{script:'sub'}, {script:'super'}],
  [{indent:'-1'}, {indent:'+1'}],
  [{direction:'rtl'}],
  [{size:['small','false','large','huge']}],
  [{header:[1,2,3,4,5,6,false]}],
  [{color:[]},{background:[]}],
  [{font:[]}],
  [{align:[]}],
  ['clean'],
]

hljs.configure({
  languages:[
    'c++',
    'java',
    'javascript',
    'ruby',
    'python',
    'swift',
    'golang',
    'html',
  ],
})



const Editor = () => {
  const {
    otherUser,
    socketState:socket,
    quill,
    setQuill,
  }=useContext(SocketContext);

  useEffect(()=>{
    if(!socket || !quill || !otherUser) return;
    const handler=(delta, oldDelta, source)=>{
      if(source!=='user') return;
      socket.emit('send-changes',delta,otherUser);
    };

    quill.on('text-change', handler);
    return ()=>{
      quill.off('text-change',handler);
    };
  },[socket,quill]);

  useEffect(()=>{
    if(!socket || !quill) return;
    const handler=(delta)=>{
      quill.updateContents(delta);
    };
    socket.on('receive-changes',handler);
    return ()=>{
      socket.off('receive-changes',handler);
    };
  },[socket,quill]);


  const editorRef=useCallback((editorWrapper)=>{
    if(editorWrapper===null) return;

    editorWrapper.innerHTML='';
    const editor=document.createElement('div');
    editorWrapper.append(editor);
    
    const q=new Quill(editor,{
      theme:'snow',
      modules:{
        syntax:{
          highlight:(text)=>hljs.highlightAuto(text).value,
        },
        toolbar:toolBarOptions,
      },
    });
    if(quill) q.setContents(quill.getContents());
    setQuill(q);
  },[])


  return (
    <div>
        <div className='' ref={editorRef}></div>
    </div>
  )
}

export default Editor