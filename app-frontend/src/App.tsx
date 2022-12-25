import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UserManagement from './pages/UserManagement';
import BookManagement from './pages/BookManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/login" element={ <Login/> }/>
        <Route path="/register" element={ <Register/> }/>
        <Route path="/manage-user" element={ <UserManagement/> }/>
        <Route path="/manage-book" element={ <BookManagement/> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
