"use client";

import { prizeObjectType } from "../../PrizeObjectType";
import Image from "next/image";
import edit_icon from "@/imges/edit_icon.svg";

// Propsの型
interface PrizeNumItemProps {
    item: prizeObjectType;
    onSelect: (prizeNum: number) => void;
    onDisSelect: (prizeNum: number) => void;
    onUpdateMemo: (prizeNum: number, memo: string) => void;
}

const PrizeNumItem: React.FC<PrizeNumItemProps> = ({ item, onSelect, onDisSelect, onUpdateMemo }) => {
    // 選択状態を管理するコールバック関数
    const handleClick = () => onSelect(item.prizeNum);
    const handleDoubleClick = () => onDisSelect(item.prizeNum);

    // メモ編集
    const handleMemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateMemo(item.prizeNum, e.target.value);
    };

    return (
        <button onClick={handleClick} onDoubleClick={handleDoubleClick} className={`min-h-25 min-w-30 flex flex-col gap-2 p-4 border-2 rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] ${item.isSelected ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}>
            {item.isSelected ? (
                <>
                    <span className="text-xl">{item.prizeNum} : 選択済み</span>
                    <div
                        className="flex gap-1 max-w-full"
                        // clickの伝播を留める
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}
                    >
                        <label htmlFor={`memo-${item.prizeNum}`}>
                            <Image src={edit_icon} alt="メモ編集" width={20} height={20} />
                        </label>
                        <input type="text" id={`memo-${item.prizeNum}`} value={item.memo} onChange={handleMemoChange} className="max-w-[80%] border-2 border-gray-950/40 rounded-sm text-center focus:bg-white" />
                    </div>
                </>
            ) : (
                <>
                    <span className="text-xl">{item.prizeNum}</span>
                </>
            )}
        </button>
    );
};
export default PrizeNumItem;
