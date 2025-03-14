// pages/index.js
import React from "react";

// 일반 사용자 목록
const normalUsers = {
  tjwndnjs7: "서주원",
  kunzatt2501: "김용명",
  codena_1025: "강수진",
  hanahyun1: "한재서",
  bsh7931: "배성훈",
  jump6746: "김종명",
  rkdwldms42: "강지은",
  sktndid1203: "박수양",
  t0mat0: "김유정",
  zyu22: "지유림",
};

// 특별 사용자: smooo2만 따로 관리
const specialUser = {
  smooo2: "박성문",
};
function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  // 월은 0부터 시작하므로 +1 해줍니다.
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function getKSTDate() {
  const date = new Date();
  // UTC 기준으로 생성된 date에 9시간(9 * 60 * 60 * 1000 밀리초)를 더합니다.
  date.setTime(date.getTime() + 9 * 60 * 60 * 1000);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function getYesterKSTDate() {
  const date = new Date();
  // UTC 기준으로 생성된 date에 9시간(9 * 60 * 60 * 1000 밀리초)를 더합니다.
  date.setTime(date.getTime() + 9 * 60 * 60 * 1000);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day - 1}`;
}
function getYesterDay() {
  const date = new Date();
  const year = date.getFullYear();
  // 월은 0부터 시작하므로 +1 해줍니다.
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day - 1}`;
}
export async function getServerSideProps() {
  const statuses = {};
  // 두 그룹을 합쳐서 전체 사용자로 관리
  const allUsers = { ...specialUser, ...normalUsers };
  const usernames = Object.keys(allUsers);

  // 오늘 날짜(UTC 기준, "YYYY-MM-DD") kst
  const today = getKSTDate();

  // 어제 날짜 계산 (밀리초 단위 86,400,000 = 1일)
  const yesterday = getYesterKSTDate();

  await Promise.all(
    usernames.map(async (username) => {
      try {
        // 각 사용자의 solved.ac grass 데이터 API 호출
        const res = await fetch(
          `https://solved.ac/api/v3/user/grass?handle=${username}&topic=default`
        );
        const json = await res.json();
        const grass = json.grass || [];

        const solvedToday = grass.some((item) => item.date === today);
        const solvedYesterday = grass.some((item) => item.date === yesterday);

        statuses[username] = {
          today: solvedToday ? "해결" : "미해결",
          yesterday: solvedYesterday ? "해결" : "미해결",
        };
      } catch (error) {
        console.error(`Error fetching ${username}:`, error);
        statuses[username] = {
          today: "에러",
          yesterday: "에러",
        };
      }
    })
  );

  return { props: { statuses } };
}

// 상태에 따른 배지 색상
function getBadgeColor(status) {
  switch (status) {
    case "해결":
      return " text-green-700";
    case "미해결":
      return " text-red-700";
    case "에러":
      return "bg-gray-200 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function Home({ statuses }) {
  return (
    <div className="w-max-[1200px] bg-gray-50 flex flex-col items-center py-10 px-4 font-sans">
      {/* 페이지 타이틀 */}
      <h1 className="text-xl font-bold text-gray-800 mb-8">1일 1알골</h1>

      {/* 특별 사용자 섹션 */}
      <div className="mb-6 w-full max-w-4xl flex flex-col items-center gap-4">
        {Object.entries(specialUser).map(([username, displayName]) => {
          const userStatus = statuses[username] || {
            today: "로딩중...",
            yesterday: "로딩중...",
          };

          return (
            <div
              key={username}
              className="w-full  bg-white rounded-lg shadow-md px-4 py-3 flex flex-col gap-2 items-center justify-center"
            >
              <div className="">
                <p className="text-xl font-semibold text-indigo-600">
                  {displayName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={` rounded-full text-sm font-medium ${getBadgeColor(
                    userStatus.yesterday
                  )}`}
                >
                  어제 : {userStatus.yesterday}
                </div>
                <div
                  className={` rounded-full text-sm font-medium ${getBadgeColor(
                    userStatus.today
                  )}`}
                >
                  오늘: {userStatus.today}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 일반 사용자 섹션 */}
      <div className="flex-wrap flex justify-center items-start gap-5 ">
        {Object.entries(normalUsers).map(([username, displayName]) => {
          const userStatus = statuses[username] || {
            today: "로딩중...",
            yesterday: "로딩중...",
          };

          return (
            <div className="bg-white rounded-lg shadow-md px-12 py-4 flex-col gap-2 flex items-center w-[240]">
              {/* 사용자 이름 */}
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold text-gray-800">
                  {displayName}
                </p>
                <p className="text-xs text-gray-400">{`@${username}`}</p>
              </div>

              {/* 상태 표시 */}
              <div className="flex gap-3 items-center justify-center">
                <div
                  className={`rounded-lg text-sm font-medium w-fit whitespace-nowrap ${getBadgeColor(
                    userStatus.yesterday
                  )}`}
                >
                  어제: {userStatus.yesterday}
                </div>
                /
                <div
                  className={`rounded-lg text-sm font-medium w-fit whitespace-nowrap ${getBadgeColor(
                    userStatus.today
                  )}`}
                >
                  오늘: {userStatus.today}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
