"use client";

import { prizeObjectType } from "../../app/main/PrizeObjectType";

// Propsの型
interface PrizeNumItemProps {
    item: prizeObjectType;
    onAnnounce: (prizeNum: number) => void;
    onDisAnnounce: (prizeNum: number) => void;
}

const DisclosureItem: React.FC<PrizeNumItemProps> = ({ item, onAnnounce, onDisAnnounce }) => {
    // 選択状態を管理するコールバック関数
    const handleClick = () => onAnnounce(item.prizeNum);
    const handleDoubleClick = () => onDisAnnounce(item.prizeNum);

    return (
        <button onClick={handleClick} onDoubleClick={handleDoubleClick} className={`w-full max-w-3xl p-4 border-2 rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] ${item.isAnnounced ? "bg-yellow-200 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}>
            {item.isAnnounced ? (
                <>
                    <div>
                        <span className="text-xl">当選番号 : {item.winnerNum}</span>
                        <span className="text-xl ml-20">景品番号 : {item.prizeNum}</span>
                    </div>
                </>
            ) : (
                <>
                    <div className="w-full">
                        <span className="text-xl">当選番号 : {item.winnerNum}</span>
                        <span className="text-xl ml-20">景品番号 : ？</span>
                    </div>
                </>
            )}
        </button>
    );
};
export default DisclosureItem;
