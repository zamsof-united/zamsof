import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './Pages/About';
import Newss from './Pages/News';
import Contact from './components/Contact/Contact';
import Home from './components/Home/Home';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/news" element={<Newss/>}/>
         </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;