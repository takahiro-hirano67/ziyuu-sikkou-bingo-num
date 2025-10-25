"use client";

import { prizeObjectType } from "../../app/main/PrizeObjectType";

// Propsの型
interface PrizeNumItemProps {
    item: prizeObjectType;
    onAnnounce: (prizeNum: number) => void;
    onDisAnnounce: (prizeNum: number) => void;
}

const AnnouncePrizeNumItem: React.FC<PrizeNumItemProps> = ({ item, onAnnounce, onDisAnnounce  }) => {
    // 選択状態を管理するコールバック関数
    const handleClick = () => onAnnounce(item.prizeNum);
    const handleDoubleClick = () => onDisAnnounce(item.prizeNum);

    return (
        <button onClick={handleClick} onDoubleClick={handleDoubleClick} className={`min-h-25 min-w-30 flex flex-col gap-2 p-4 border-2 rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] ${item.isAnnounced ? "bg-yellow-200 cursor-not-allowed" : "hover:bg-gray-100"}`}>
            {item.isAnnounced ? (
                <>
                    <span className="text-xl">景品番号 : {item.prizeNum}<br />当選番号 : {item.winnerNum}</span>
                    <span>{item.memo}</span>
                </>
            ) : (
                <>
                    <span className="text-xl">景品番号 : {item.prizeNum}<br />当選番号 : ？</span>
                    <span>{item.memo}</span>
                </>
            )}
        </button>
    );
};
export default AnnouncePrizeNumItem;
