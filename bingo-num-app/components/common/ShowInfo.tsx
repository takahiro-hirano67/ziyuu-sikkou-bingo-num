"use client";

import { prizeObjectType } from "../../app/main/PrizeObjectType";

// Propsの型定義
interface ShowInfoProps {
    numOfPeople: number;
    numOfItems: number;
    prizeNumList: prizeObjectType[];
    mode: string;
}

// 番号選択画面（ビンゴ中）
const ShowInfo: React.FC<ShowInfoProps> = ({ numOfPeople, numOfItems, prizeNumList, mode }) => {
    // 残り景品数の変数（景品数 - 発表された景品番号の数）
    const restNumOfPrizes = numOfItems - prizeNumList.filter((item) => item.isSelected === true).length;
    const restNumOfAnnouncePrizes = numOfItems - prizeNumList.filter((item) => item.isAnnounced === true).length;

    return (
        <section className="grid grid-cols-3 gap-10">
            {/* 参加人数 */}
            <div className="flex flex-col gap-1 items-center py-2 border-2 border-gray-950/80 rounded-xl shadow-[0px_4px_6px_rgba(0,0,0,0.1)]">
                <span className="text-2xl">参加人数</span>
                <span className="text-xl">{numOfPeople}人</span>
            </div>
            {/* 景品数 */}
            <div className="flex flex-col gap-1 items-center py-2 border-2 border-gray-950/80 rounded-xl shadow-[0px_4px_6px_rgba(0,0,0,0.1)]">
                <span className="text-2xl">景品数</span>
                <span className="text-xl">{numOfItems}点</span>
            </div>
            {/* 残り景品数 */}
            <div className="flex flex-col gap-1 items-center py-2 border-2 border-gray-950/80 rounded-xl shadow-[0px_4px_6px_rgba(0,0,0,0.1)]">
                <span className="text-2xl">{mode === "progress" ? `残りの景品番号数` : `未発表の景品数`}</span>
                <span className="text-xl">{mode === "progress" ? `${restNumOfPrizes}` : `${restNumOfAnnouncePrizes}`}点</span>
            </div>
        </section>
    );
};
export default ShowInfo;
