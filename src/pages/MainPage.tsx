import BoardCard from "../components/Main/BoardCard";
import Footer from "../components/common/Footer";
import Header from "../components/Main/Header";
import { RxTriangleDown } from "react-icons/rx";
import { useEffect, useState, useCallback, useRef, Suspense, useTransition } from "react";
import { FaPencilAlt } from "react-icons/fa";
// import AreaModal from "../components/Main/AreaModal";
import { useNavigate } from "react-router-dom";
import { SetStateAction, useAtom, useAtomValue } from "jotai";
import { Dispatch } from "react";
import RoomExistence from "../components/Main/RoomExistence";
import { getFindRoomPostData, regionAll } from "../components/Main/ApiCall";
import { isSelectedFindRoomAtom, isSelectedHasRoomAtom, recommendAtom, regionIdAtom } from "../components/Main/Jotai";
import { getUserId } from "../components/API/TokenAction";
import RecommendModal from "../components/Main/RecommendModal";
import { JsonConfig } from "../components/API/AxiosModule";
import { lazy } from "react";

interface RegionProps {
  regionId: number;
  sido: string;
  sigg: string;
}

interface Board {
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

interface GetFindRoomProps {
  setBoardOneList: Dispatch<SetStateAction<Board[]>>;
  regionId?: number;
  setLastPostId: Dispatch<SetStateAction<number | null>>;
  userId: number | undefined;
}

const ApiCallModule = await import("../components/Main/ApiCall");
const loadMoreFindRoom = ApiCallModule.loadMoreFindRoom;
const loadMoreHasRoom = ApiCallModule.loadMoreHasRoom;
const getHasRoomPostData = ApiCallModule.getHasRoomPostData;
const AreaModal = lazy(() => import("../components/Main/AreaModal"));

const MainPage = () => {
  const [, startTransition] = useTransition();
  const navigate = useNavigate();
  const recommend = useAtomValue(recommendAtom);
  const [recommendData, setRecommendData] = useState([]);
  const [isSelectedFindRoom, setIsSelectedFindRoom] = useAtom(isSelectedFindRoomAtom);
  const [isSelectedHasRoom, setIsSelectedHasRoom] = useAtom(isSelectedHasRoomAtom);
  const [activeAreaModal, setActiveAreaModal] = useState<boolean>(false);
  const [boardOneList, setBoardOneList] = useState<Board[]>([]);
  const [boardTwoList, setBoardTwoList] = useState<Board[]>([]);
  const [regionList, setRegionList] = useState<RegionProps[]>([]);
  const [regionName, setRegionName] = useState<undefined | string>();
  const [userRegion, setUserRegion] = useState<number | undefined>();
  const [regionId, setRegionId] = useAtom(regionIdAtom);
  const [lastPostId, setLastPostId] = useState<number | null>(null);
  const target = useRef<HTMLDivElement | null>(null);
  const userId = getUserId();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    //추천인 불러오기
    JsonConfig("get", `api/personality/${userId}/1`, null, undefined)
      .then((response) => {
        setRecommendData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId]);

  //방 구해요 게시물 불러오는 함수 useCallback 씌우기 (의존성 배열 issue)
  const getFindRoomPostDataCall = useCallback(async ({ setBoardOneList, regionId, setLastPostId, userId }: GetFindRoomProps) => {
    await getFindRoomPostData({ setBoardOneList, regionId, setLastPostId, userId });
  }, []);

  //방구해요 버튼 클릭 시
  const handleFindRoom = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setBoardTwoList([]);
    setIsSelectedHasRoom(false);
    getFindRoomPostDataCall({ setBoardOneList, regionId, setLastPostId, userId });
    setIsSelectedFindRoom(true);
  };

  //방 있어요 버튼 클릭 시
  const handleHasRoom = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setBoardOneList([]);
    setIsSelectedFindRoom(false);
    getHasRoomPostData({
      setBoardTwoList,
      regionId,
      setLastPostId,
      userId,
    });

    setIsSelectedHasRoom(true);
  };

  //지역정보 (모달창) 보기
  const handleAreaModal = () => {
    startTransition(() => {
      setActiveAreaModal(!activeAreaModal);
    });
  };

  //첫화면 지역데이터 가져오기
  const regionAllCallback = useCallback(regionAll, [regionId, setRegionId, userId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (!userId) return;
    regionAllCallback({
      setRegionList,
      setUserRegion,
      setRegionId,
      regionId,
      userId,
    });
  }, [regionAllCallback, regionId, setRegionId, setRegionList, userId]);

  //첫화면 모든지역 게시물 가져오기(방구해요)
  useEffect(() => {
    setLoading(true);
    //화면에 표시되는 유저가 선택한 첫 지역담기
    const userRegionSigg = regionList?.filter((re) => {
      return re.regionId === regionId;
    });
    if (!userRegion && !userId) return;
    if (userRegion && userId) {
      setRegionName(userRegionSigg[0]?.sigg);
    }
    const fetchData = async () => {
      if (userRegion && isSelectedFindRoom && userId) {
        await getFindRoomPostDataCall({ setBoardOneList, regionId, setLastPostId, userId });
        setLoading(false);
      } else if (userRegion && isSelectedHasRoom && userId) {
        await getHasRoomPostData({
          setBoardTwoList,
          regionId,
          setLastPostId,
          userId,
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [getFindRoomPostDataCall, isSelectedFindRoom, isSelectedHasRoom, regionId, regionList, userId, userRegion]);

  // intersection callback 함수 작성
  const intersectionCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        if (isSelectedFindRoom) {
          loadMoreFindRoom({ regionId, lastPostId, userId, setBoardOneList, setLastPostId });
        } else if (isSelectedHasRoom) {
          loadMoreHasRoom({ regionId, lastPostId, userId, setBoardTwoList, setLastPostId });
        }
      }
    },
    [isSelectedFindRoom, isSelectedHasRoom, lastPostId, regionId, userId]
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

  //지역 선택 시 해당 게시물 가져오기
  const handleRegionArea = (region: RegionProps) => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (userId) {
      if (isSelectedFindRoom) {
        getFindRoomPostData({ setBoardOneList, regionId, setLastPostId, userId });
      }
      if (isSelectedHasRoom) {
        getHasRoomPostData({
          setBoardTwoList,
          regionId,
          setLastPostId,
          userId,
        });
      }
      setActiveAreaModal(false);
      setRegionName(region.sigg);
      setRegionId(region.regionId);
    }
  };

  return (
    <>
      <div className="bg-main-100 min-h-screen">
        <section className="fixed w-full z-20 top-0 left-0 shadow bg-main-100">
          {recommend &&
            recommendData.map((datas) => {
              return <RecommendModal data={datas} />;
            })}
          <Header />
          <div className="relative mt-16" onClick={handleAreaModal}>
            <div className="px-4 py-2 text-center bg-white cursor-pointer">{regionName}</div>
            <div className="absolute bottom-2 right-2 cursor-pointer">
              <RxTriangleDown className="text-3xl text-main-300" />
            </div>
            {activeAreaModal && (
              <Suspense fallback={<h1>Loading...</h1>}>
                <AreaModal regionList={regionList} handleRegionArea={handleRegionArea} />
              </Suspense>
            )}
          </div>

          <RoomExistence handleFindRoom={handleFindRoom} handleHasRoom={handleHasRoom} />
        </section>

        <section className=" mt-20 pt-20">
          {loading && (
            <div className="flex justify-center">
              <img src="/loading.gif" className="w-16 cursor-pointer" />
            </div>
          )}
          {boardOneList?.length > 0
            ? boardOneList.map((b, i) => {
                return (
                  <div key={i} className={i === 0 ? "mt-10" : ""}>
                    <BoardCard board={b} userId={userId} boardList={boardOneList} setBoardList={setBoardOneList} />
                  </div>
                );
              })
            : boardTwoList?.map((b, i) => {
                return (
                  <div key={i} className={i === 0 ? "mt-10" : ""}>
                    <BoardCard board={b} userId={userId} boardList={boardTwoList} setBoardList={setBoardTwoList} />
                  </div>
                );
              })}

          {!loading && boardOneList.length === 0 && boardTwoList.length === 0 && (
            <>
              <div className="pt-20  text-center">
                <div className="text-xl h-20">게시물이 없습니다 😅</div>
              </div>
            </>
          )}

          <div className="flex justify-end mb-10 pt-5 pb-6 mr-5">
            <div
              className="fixed bottom-20 right-5 flex justify-center items-center w-12 h-12 bg-main-300 rounded-full"
              onClick={() => navigate("/post")}
            >
              <FaPencilAlt className="cursor-pointer text-2xl text-white" />
            </div>
          </div>
        </section>
      </div>
      <div ref={target}></div>
      <Footer selected={false} userId={userId} />{" "}
    </>
  );
};

export default MainPage;
