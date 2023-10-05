import Header from "../components/Main/Header";
import Footer from "../components/common/Footer";
import { useState, useEffect, useCallback, useRef } from "react";
import BoardCard from "../components/Main/BoardCard";
import { JsonConfig } from "../components/API/AxiosModule";
import { getUserId } from "../components/API/TokenAction";

interface CartProps {
  postId: number;
  nickName: string;
  address: string;
  likesFlag: boolean;
  userFile: string;
  createdAt: string;
  gender: number;
  content: string;
  roomFiles: string;
  commentCount: string;
  memberId: number;
}

const CartPage = () => {
  const [lastPostId, setLastPostId] = useState();
  const [cartList, setCartList] = useState<CartProps[]>([]);
  const target = useRef<HTMLDivElement | null>(null);
  const userId = getUserId();
  const [loading, setLoading] = useState(true);

  const getLikesData = useCallback(async () => {
    const params = { lastPostId: null, size: 10 };
    await JsonConfig("get", `api/membership/like/${userId}`, null, params).then((response) => {
      setCartList(response.data.likeListPost);
      setLastPostId(response.data.lastPostId);
      setLoading(false);
    });
  }, [userId]);

  //좋아요 누른 게시물 불러오는 첫 화면
  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "auto" });
    if (!userId) return;
    getLikesData();
  }, [getLikesData, userId]);

  //좋아요 누른 게시물 무한스크롤로 가져오기
  const loadMore = useCallback(async () => {
    if (lastPostId) {
      try {
        const params = { lastPostId: lastPostId, size: 10 };
        const response = await JsonConfig("get", `api/membership/like/${userId}`, null, params);
        setCartList((prev) => [...prev, ...response.data.likeListPost]);
        setLastPostId(response.data.lastPostId);
      } catch (error) {
        console.error(error);
      }
    }
  }, [userId, lastPostId]);

  //intersection callback 함수 작성
  const intersectionCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        loadMore();
      }
    },
    [loadMore]
  );

  //관찰자가 target을 관찰시작
  useEffect(() => {
    const observer = new IntersectionObserver(intersectionCallback, {
      threshold: 1,
    });
    observer.observe(target.current as Element);
    return () => {
      observer.disconnect();
    };
  }, [intersectionCallback]);

  return (
    <>
      <div className="min-h-screen bg-main-100">
        <Header />

        <section className="mt-10  pt-5 pb-16">
          {loading && (
            <div className="flex justify-center">
              <img src="/loading.gif" className="w-16 cursor-pointer" />
            </div>
          )}
          {cartList?.map((cart: CartProps) => {
            return (
              <div key={cart.postId}>
                <BoardCard board={cart} userId={userId} boardList={cartList} setBoardList={setCartList} />
              </div>
            );
          })}
          {!loading && cartList.length === 0 && <div className="h-screen text-center p-10 text-xl"> 찜한 게시물이 없습니다 😂</div>}
          <div ref={target}></div>
        </section>
      </div>

      <Footer selected={true} userId={userId} />
    </>
  );
};

export default CartPage;
