// pages/index.js
import React from "react";

const userInfo = {
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

export async function getServerSideProps() {
  const statuses = {};
  const usernames = Object.keys(userInfo);

  // 오늘 날짜(UTC 기준, "YYYY-MM-DD")를 구함.
  const today = new Date().toISOString().split("T")[0];

  await Promise.all(
    usernames.map(async (username) => {
      try {
        // API 호출: 각 유저의 solved.ac grass 데이터 가져오기
        const res = await fetch(
          `https://solved.ac/api/v3/user/grass?handle=${username}&topic=default`
        );
        const json = await res.json();
        const grass = json.grass || [];

        // 오늘 날짜에 해당하는 객체가 있고, value가 1이면 "해결함"
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
    <div className="min-h-screen bg-gray-100 p-4 flex flex-wrap gap-4 justify-center">
      {Object.entries(userInfo).map(([username, displayName]) => {
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
  );
}

export default Home;
