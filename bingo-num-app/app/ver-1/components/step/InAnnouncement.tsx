"use client";

import { prizeObjectType } from "../../PrizeObjectType";
import AnnouncePrizeNumItem from "../item/AnnouncePrizeNumItem";
import ShowInfo from "../common/ShowInfo";
import ExportButtons from "../common/ExportButtons";
import DisclosureItem from "../item/DisclosureItem";

// Propsの型定義
interface InAnnouncementProps {
    numOfPeople: number;
    numOfItems: number;
    prizeNumList: prizeObjectType[];
    handleAnnounce: (prizeNum: number) => void;
    handleDisAnnounce: (prizeNum: number) => void;
}

// 番号選択画面（ビンゴ中）
const InAnnouncement: React.FC<InAnnouncementProps> = ({ numOfPeople, numOfItems, prizeNumList, handleAnnounce, handleDisAnnounce }) => {
    // 残り景品数の変数（景品数 - 発表された引換番号の数）
    const restPrizes = numOfItems - prizeNumList.filter((item) => item.isAnnounced === true).length;
    return (
        <div className="mt-6 flex flex-col h-screen">
            <div className="flex flex-col flex-[1_1_54%] border-b-2 border-gray-300 overflow-y-auto">
                <div className="sticky top-0 bg-white z-10">
                    <h2 className="text-2xl text-center font-bold">景品発表</h2>
                    {/* 進行情報表示 */}
                    <ShowInfo numOfPeople={numOfPeople} numOfItems={numOfItems} prizeNumList={prizeNumList} mode="announce" />
                </div>
                {/* 引換番号一覧 (引換番号〇, 当選番号✖, 引換番号順) */}
                <section className="mt-8 grid grid-cols-5 gap-8">
                    {prizeNumList.map((item: prizeObjectType) => (
                        // prizeNum はユニークなので key に指定
                        <AnnouncePrizeNumItem key={item.prizeNum} item={item} />
                    ))}
                </section>
                {restPrizes === 0 ? (
                    <div className="self-center flex flex-col items-center gap-2 mt-6">
                        <span className="text-3xl font-bold">参加していただき、</span>
                        <span className="text-3xl font-bold">ありがとうございました！</span>
                        <br />
                        <span className="text-xl font-bold">最後に、アンケートへのご協力をお願いします。</span>
                        <span className="text-xl font-bold">（スライドに戻ります...）</span>
                        <ExportButtons prizeNumList={prizeNumList} title="bingo_results" />
                    </div>
                ) : (
                    <div className="self-center mt-6"></div>
                )}
            </div>
            <div className="flex-[1_1_46%] overflow-y-auto  p-4">
                {/* 発表順リスト (引換番号✖, 当選番号〇, 当選番号順) */}
                <section className="mt-8 flex flex-col items-center gap-6">
                    {prizeNumList
                        .slice() // 元のリストの状態を破壊しないようにコピー
                        .sort((a, b) => b.winnerNum - a.winnerNum)              // 当選番号の降順（価値が低い順）
                        .sort((a, b) => a.displayOrderNum - b.displayOrderNum)  // 景品発表順 ※景品発表順を入れ替えてなければdisplayOrderNumは全て"0"
                        .map((item: prizeObjectType) => (
                            // prizeNum はユニークなので key に指定
                            <DisclosureItem key={item.prizeNum} item={item} onAnnounce={handleAnnounce} onDisAnnounce={handleDisAnnounce} />
                        ))}
                </section>
            </div>
        </div>
    );
};
export default InAnnouncement;
