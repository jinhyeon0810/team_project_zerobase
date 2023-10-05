import { Routes, Route } from "react-router-dom";
import { Provider } from "jotai";
import { QueryClient, QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";
import { lazy, Suspense } from "react";
import SigninPage from "./pages/SigninPage";
import Loading from "./components/Loading/Loading";

const queryClient = new QueryClient();
const MainPage = lazy(() => import("./pages/MainPage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const DetailPage = lazy(() => import("./pages/DetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const RecommendPage = lazy(() => import("./pages/RecommendPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ChatListPage = lazy(() => import("./pages/Chat/ChatListPage"));
const ChatRoomPage = lazy(() => import("./pages/Chat/ChatRoomPage"));
const SignUp = lazy(() => import("./pages/SignupPage"));
const Editprofile = lazy(() => import("./pages/EditprofilePage"));
const Findpassword = lazy(() => import("./pages/FindpasswordPage"));
const Editpassword = lazy(() => import("./pages/EditpasswordPage"));
const SocialsignUp = lazy(() => import("./pages/SocialsignupPage"));
const GetCode = lazy(() => import("./components/Signin/GetCode"));
function App() {
  return (
    <Provider>
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<SigninPage />}></Route>
              <Route path="/login/oauth2/code/kakao" element={<GetCode />}></Route>
              <Route path="/main" element={<MainPage />}></Route>
              <Route path="/post" element={<PostPage />}></Route>
              <Route path="/edit/:postId" element={<PostPage />}></Route>
              <Route path="/detail/:postId" element={<DetailPage />}></Route>
              <Route path="/cart" element={<CartPage />}></Route>
              <Route path="/recommend" element={<RecommendPage />}></Route>
              <Route path="/profile/:profileId" element={<ProfilePage />}></Route>
              <Route path="/chatlist" element={<ChatListPage />}></Route>
              <Route path="/chat/:chatRoomId" element={<ChatRoomPage />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>
              <Route path="/editprofile" element={<Editprofile />}></Route>
              <Route path="/findPassword" element={<Findpassword />}></Route>
              <Route path="/editpassword" element={<Editpassword />}></Route>
              <Route path="/socialsignup/:userId" element={<SocialsignUp />}></Route>
            </Routes>
          </Suspense>
        </QueryClientProvider>
      </CookiesProvider>
    </Provider>
  );
}

export default App;
