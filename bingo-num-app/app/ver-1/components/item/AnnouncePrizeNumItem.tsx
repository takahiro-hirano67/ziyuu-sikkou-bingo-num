"use client";

import { prizeObjectType } from "../../PrizeObjectType";

// Propsの型
interface PrizeNumItemProps {
    item: prizeObjectType;
}

const AnnouncePrizeNumItem: React.FC<PrizeNumItemProps> = ({ item }) => {


    return (
        <button className={`min-h-25 min-w-30 flex flex-col gap-2 p-4 border-2 rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] ${item.isAnnounced ? "bg-yellow-200" : ""}`}>
            {item.isAnnounced ? (
                <>
                    <span className="text-xl">引換番号 : {item.prizeNum}<br />当選番号 : {item.winnerNum}</span>
                    <span>{item.memo}</span>
                </>
            ) : (
                <>
                    <span className="text-xl">引換番号 : {item.prizeNum}<br />当選番号 : ？</span>
                    <span>{item.memo}</span>
                </>
            )}
        </button>
    );
};
export default AnnouncePrizeNumItem;
