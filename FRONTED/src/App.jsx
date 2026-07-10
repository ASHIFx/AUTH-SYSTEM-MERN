import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/SignUp'
import Verify from './pages/Verify'
import ForgotPassword from './pages/ForgotPassword'
import NewPassword from './pages/NewPassword'
import HomePage from './pages/HomePage'
import ProtectedRoute from './component/ProtectedRoute'
import AuthGoogle from './component/authGoogle';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<Verify/>}/>
      <Route path="/password/reset" element={<ForgotPassword/>}/>
      <Route path="/password/new" element={<NewPassword/>}/>
      <Route path="/oauth-success" element={<AuthGoogle />} />
       <Route path="/home" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App