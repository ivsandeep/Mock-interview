
import './App.css';
import './index.css'
import {Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import Join from './Components/Join';
import Meet from './Components/Meet'
import { ContextProvider } from './Components/context/SocketContext';


function App() {
  return (
    <div>
    <ContextProvider>
      <Routes>
        <Route path='/' element={<Home></Home>}/>
        <Route path='/join' element={<Join></Join>}/>
        <Route path='/meet' element={<Meet></Meet>}/>
      </Routes>
      </ContextProvider>
    </div>
  );
}

export default App;
