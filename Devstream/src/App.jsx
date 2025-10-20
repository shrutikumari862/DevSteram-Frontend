


import { Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/Home.page';
import EditorPage from './components/pages/Editor.page';
import EntryPage from './components/pages/Entry.page';

function App() {
  

  return (
    <>
    <div className='bg-black h-screen w-full flex justify-center items-center'>
      <Routes>
        <Route path="/" element={<EntryPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
      </div>
    </>
  )
}

export default App
