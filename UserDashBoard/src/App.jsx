import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import AppTop from './AppTop';
import Courses from './Courses';
import Landing from './Landing';
import './App.css';
import { userState } from './store/atoms/user';
import {
   RecoilRoot,
   useSetRecoilState,
} from 'recoil';
import axios from 'axios';
import CourseDetails from './CourseDetails';
import PurchasedCourse from './PurchasedCourse';


function App() {

   return (
      <RecoilRoot>
         <div style={{ width: "100vw", height: "100vh", backgroundColor: "#eeeeee" }}>
            <Router>
               <AppTop></AppTop>
               <Init></Init>
               <Routes>
                  <Route path={"/courses"} element={<Courses />}></Route>
                  <Route path={"/signin"} element={<SignIn />} />
                  <Route path={"/signup"} element={<SignUp />} />
                  <Route path={"/courseDetails/:courseId"} element={<CourseDetails />} />
                  <Route path={"/purchasedCourse"} element={<PurchasedCourse />} />
                  <Route path={"/"} element={<Landing />}></Route>
               </Routes>
            </Router>
         </div>
      </RecoilRoot>

   );
}
function Init() {
   const setUser = useSetRecoilState(userState);
   const initUser = async () => {
      try {
         const response = await axios.get("http://localhost:3000/user/me", {
            headers: {
               "Authorization": "Bearer " + localStorage.getItem("token")
            }
         })

         if (response.data.username) {
            setUser({ isLoading: false, userEmail: response.data.username })
         }
         else {
            console.log("no username");
            setUser({ isLoading: false, userEmail: null })
         }
      }
      catch (e) {
         setUser({ isLoading: false, userEmail: null })
      }
   };
   initUser();
}

export default App;
