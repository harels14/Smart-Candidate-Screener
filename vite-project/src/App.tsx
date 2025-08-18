import { Routes, Route } from 'react-router-dom';
import HomeFile from './HomeFile';


function App() {

  return (
    <Routes>
      <Route path="/" element={<HomeFile />} />
    </Routes>
  )
}

export default App
