"use client";

import { prizeObjectType } from "../../app/main/PrizeObjectType";
import ShowInfo from "../common/ShowInfo";
import PrizeNumItem from "../item/PrizeNumItem";

// Propsの型定義
interface InProgressProps {
    numOfPeople: number;
    numOfItems: number;
    prizeNumList: prizeObjectType[];
    handleSelect: (prizeNum: number) => void;
    handleDisSelect: (prizeNum: number) => void;
    handleUpdateMemo: (prizeNum: number, memo: string) => void;
    handleChangeAnnounce: () => void;
}

// 番号選択画面（ビンゴ中）
const InProgress: React.FC<InProgressProps> = ({ numOfPeople, numOfItems, prizeNumList, handleSelect, handleDisSelect, handleUpdateMemo, handleChangeAnnounce }) => {
    // 残り景品数の変数（景品数 - 選択された景品番号の数）
    const restPrizes = numOfItems - prizeNumList.filter((item) => item.isSelected === true).length;
    return (
        <div className="mt-6  flex flex-col gap-6">
            <h2 className="text-2xl text-center font-bold">番号選択</h2>
            {/* 進行情報表示 */}
            <ShowInfo numOfPeople={numOfPeople} numOfItems={numOfItems} prizeNumList={prizeNumList} mode="progress" />
            {/* 景品番号一覧 */}
            <section className="mt-8 grid grid-cols-5 gap-8 text-center">
                {prizeNumList.map((item: prizeObjectType) => (
                    // prizeNum はユニークなので key に指定
                    <PrizeNumItem key={item.prizeNum} item={item} onSelect={handleSelect} onDisSelect={handleDisSelect} onUpdateMemo={handleUpdateMemo} />
                ))}
            </section>
            {/* 景品発表へ移行するボタン（全て選択されるまでクリックできない） */}
            {restPrizes === 0 ? (
                <div className="self-center mt-6">
                    <button onClick={handleChangeAnnounce} className="border-2 p-4 rounded-2xl text-xl font-medium bg-yellow-200/50 hover:bg-yellow-200">景品発表へ移る</button>
                </div>
            ) : (
                <div className="self-center mt-6">
                    <button className="border-2 p-4 rounded-2xl text-xl font-medium bg-gray-200/50 hover:bg-gray-200 cursor-not-allowed">景品発表へ移る</button>
                </div>
            )}
        </div>
    );
};
export default InProgress;
