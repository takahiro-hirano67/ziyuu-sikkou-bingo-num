"use client";

import { prizeObjectType } from "../../app/main/PrizeObjectType";
import AnnouncePrizeNumItem from "../item/AnnouncePrizeNumItem";
import ShowInfo from "../common/ShowInfo";
import ExportButtons from "../common/ExportButtons";

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
    // 残り景品数の変数（景品数 - 発表された景品番号の数）
    const restPrizes = numOfItems - prizeNumList.filter((item) => item.isAnnounced === true).length;
    return (
        <div className="mt-6  flex flex-col gap-6">
            <h2 className="text-2xl text-center font-bold">景品発表</h2>
            {/* 進行情報表示 */}
            <ShowInfo numOfPeople={numOfPeople} numOfItems={numOfItems} prizeNumList={prizeNumList} mode="announce" />
            {/* 景品番号一覧 */}
            <section className="mt-8 grid grid-cols-5 gap-8 text-center">
                {prizeNumList.map((item: prizeObjectType) => (
                    // prizeNum はユニークなので key に指定
                    <AnnouncePrizeNumItem key={item.prizeNum} item={item} onAnnounce={handleAnnounce} onDisAnnounce={handleDisAnnounce} />
                ))}
            </section>
            {restPrizes === 0 ? (
                <div className="self-center flex flex-col items-center gap-2 mt-6">
                    <span className="text-3xl font-bold">参加していただき、</span>
                    <span className="text-3xl font-bold">ありがとうございました！</span>
                    <br />
                    <span className="text-xl font-bold">最後に、アンケートへのご協力をお願いします。</span>
                    <span className="text-xl font-bold">（スライドに戻ります...）</span>
                    <ExportButtons  prizeNumList={prizeNumList} title="bingo_results" />
                </div>
            ) : (
                <div className="self-center mt-6"></div>
            )}
        </div>
    );
};
export default InAnnouncement;
