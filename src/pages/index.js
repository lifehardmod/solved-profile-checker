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

export async function getServerSideProps() {
  const statuses = {};
  // 두 그룹을 합쳐서 전체 사용자로 관리
  const allUsers = { ...specialUser, ...normalUsers };
  const usernames = Object.keys(allUsers);

  // 오늘 날짜(UTC 기준, "YYYY-MM-DD")
  const today = new Date().toISOString().split("T")[0];

  await Promise.all(
    usernames.map(async (username) => {
      try {
        // 각 사용자의 solved.ac grass 데이터 API 호출
        const res = await fetch(
          `https://solved.ac/api/v3/user/grass?handle=${username}&topic=default`
        );
        const json = await res.json();
        const grass = json.grass || [];

        // 오늘 날짜의 데이터가 있고, value가 1이면 "해결함"
        const solved = grass.some(
          (item) => item.date === today && item.value === 1
        );
        statuses[username] = solved ? "해결함" : "해결하지 않음";
      } catch (error) {
        console.error(`Error fetching ${username}:`, error);
        statuses[username] = "에러 발생";
      }
    })
  );

  return { props: { statuses } };
}

function Home({ statuses }) {
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col gap-8 items-center">
      {/* 특별 사용자 카드 */}
      {Object.entries(specialUser).map(([username, displayName]) => {
        const status = statuses[username] || "로딩중...";
        let bgColor;
        if (status === "해결함") {
          bgColor = "bg-green-500";
        } else if (status === "해결하지 않음") {
          bgColor = "bg-red-500";
        } else {
          bgColor = "bg-gray-300";
        }
        return (
          <div
            key={username}
            className="relative flex flex-col items-center p-4 border border-gray-200 rounded-md shadow-sm w-64 overflow-hidden"
          >
            {/* 반짝거리는 배경 효과 (예시: 노란색 펄스 효과) */}
            <div className="absolute inset-0 bg-yellow-300 opacity-50 rounded-md animate-pulse" />
            <div className="relative z-10 text-lg font-semibold mb-2">
              {displayName}
            </div>
            <div
              className={`relative z-10 ${bgColor} text-white px-3 py-1 rounded`}
            >
              {status}
            </div>
          </div>
        );
      })}

      {/* 일반 사용자 카드 */}
      <div className="flex flex-wrap gap-4 justify-center">
        {Object.entries(normalUsers).map(([username, displayName]) => {
          const status = statuses[username] || "로딩중...";
          let bgColor;
          if (status === "해결함") {
            bgColor = "bg-green-500";
          } else if (status === "해결하지 않음") {
            bgColor = "bg-red-500";
          } else {
            bgColor = "bg-gray-300";
          }
          return (
            <div
              key={username}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-md shadow-sm w-64"
            >
              <div className="text-lg font-semibold mb-2">{displayName}</div>
              <div className={`${bgColor} text-white px-3 py-1 rounded`}>
                {status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
