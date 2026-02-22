// bingo-num-app/components/steps/AnnouncePrizeStep.tsx

"use client"

import { useMemo } from "react";
// 型定義
import type { PrizeObject } from "@/types";
// カスタムフック
import { useBingoState } from '@/hooks/useBingoState';

// ============================================================
// 【ステップ4：景品発表コンポーネント】
// ポイント:
// - 発表順リストをクリックすることで、対応する引換番号と景品名を公開する。
// ============================================================

interface AnnouncePrizeStepProps {
    prizeObjectList: PrizeObject[];
    setPrizeObjectList: React.Dispatch<React.SetStateAction<PrizeObject[]>>;
    numberOfPeople: number;
    activePrizes: PrizeObject[];
    numberOfActivePrizes: number;
}

function AnnouncePrizeStep({
    setPrizeObjectList,
    numberOfPeople,
    activePrizes,
    numberOfActivePrizes
}: AnnouncePrizeStepProps) {

    // useBingoState フックからハンドラを取得
    const {
        handleAnnouncePrize, // 景品発表
        handleUnannouncePrize, // 景品発表状態解除
    } = useBingoState();


    // 発表済みの景品数
    const announcedPrizesCount = activePrizes.filter(p => p.isAnnounced).length;
    // 残りの未発表景品数
    const remainingPrizesCount = numberOfActivePrizes - announcedPrizesCount;
    // 全て発表済みか
    const allPrizesAnnounced = remainingPrizesCount === 0;

    // 中段グリッド表示用：景品番号順にソートされたリスト
    const prizesSortedByNum = useMemo(() => {
        return [...activePrizes].sort((a, b) => (a.prizeNum || 0) - (b.prizeNum || 0));
    }, [activePrizes]);

    // 下段リスト表示用：発表順にソートされたリスト
    const prizesSortedByOrder = useMemo(() => {
        return [...activePrizes].sort((a, b) => a.displayOrderNum - b.displayOrderNum);
    }, [activePrizes]);


    return (
        <div className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Step 4: 景品発表</h2>
            <p className="text-gray-600 mb-2">下の「景品発表リスト」をクリックすると、景品名と番号が公開されます。ダブルクリックで発表を取り消せます。</p>

            {/* --- 上部：情報 --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 p-4 bg-gray-100 rounded-lg">
                <div className="flex flex-col justify-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-md font-medium text-gray-500">参加人数</span>
                    <span className="text-2xl font-bold text-gray-800">{numberOfPeople}</span>
                </div>
                <div className="flex flex-col justify-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-md font-medium text-gray-500">景品数</span>
                    <span className="text-2xl font-bold text-blue-600">{numberOfActivePrizes}</span>
                </div>
                <div className="flex flex-col justify-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-md font-medium text-gray-500">残り (未発表)</span>
                    <span className={`text-2xl font-bold ${remainingPrizesCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {remainingPrizesCount}
                    </span>
                </div>
            </div>

            {/* --- 中部：景品番号グリッド (結果表示) --- */}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">引換番号 対応表</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
                {prizesSortedByNum.map(prize => (
                    <AnnounceNumberBox key={prize.id} prize={prize} />
                ))}
            </div>

            {/* --- 下部：景品発表リスト --- */}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">景品発表リスト (発表順)</h3>
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {prizesSortedByOrder.map(prize => (
                        <AnnouncePrizeItem
                            key={prize.id}
                            prize={prize}
                            onAnnounce={handleAnnouncePrize}
                            onUnannounce={handleUnannouncePrize}
                        />
                    ))}
                </ul>
            </div>

            {/* --- 完了メッセージ --- */}
            {allPrizesAnnounced && (
                <div className="mt-8 p-6 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-lg text-center">
                    <p className="text-2xl font-semibold">
                        すべての景品が発表されました！
                    </p>
                    <p className="mt-2">お疲れ様でした！</p>
                </div>
            )}

        </div>
    );
}
export default AnnouncePrizeStep


// ============================================================
// 中段の景品番号ボックス (表示のみ)
// ============================================================

function AnnounceNumberBox({ prize }: { prize: PrizeObject }) {
    const isAnnounced = prize.isAnnounced;
    return (
        <div
            className={`flex flex-col justify-between h-36 w-full rounded-lg border-2 p-3 text-center transition-all duration-300
        ${isAnnounced
                    ? 'bg-yellow-100 border-yellow-300 shadow-lg scale-105' // 発表済み
                    : 'bg-gray-100 border-gray-300' // 未発表
                }`}
        >
            {/* 景品番号 */}
            <div className="text-2xl font-bold text-gray-800">{prize.prizeNum}</div>

            {/* 景品名 */}
            <div className="text-md font-semibold wrap-break-word my-1 min-h-10 flex items-center justify-center">
                {isAnnounced ? (
                    <span className="text-blue-700">{prize.prizeName}</span>
                ) : (
                    <span className="text-2xl font-bold text-gray-400">
                        ???
                    </span>
                )}
            </div>

            {/* メモ */}
            <div className="text-sm text-gray-600 truncate" title={prize.memo}>
                {prize.memo || '(メモなし)'}
            </div>
        </div>
    );
}

// ============================================================
// 下段の景品リストアイテム (状態制御)
// ============================================================

function AnnouncePrizeItem({ prize, onAnnounce, onUnannounce }: {
    prize: PrizeObject;
    onAnnounce: (id: string) => void;
    onUnannounce: (id: string) => void;
}) {
    const isAnnounced = prize.isAnnounced;

    const handleClick = () => {
        if (!isAnnounced) {
            onAnnounce(prize.id);
        }
    };

    const handleDoubleClick = () => {
        if (isAnnounced) {
            onUnannounce(prize.id);
        }
    };

    return (
        <li
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            className={`flex items-center justify-between p-4 transition-all duration-300
        ${isAnnounced
                    ? 'bg-green-100 cursor-not-allowed' // 発表済み
                    : 'bg-white hover:bg-gray-50 cursor-pointer' // 未発表
                }`}
        >
            {/* 発表順 と 景品名 */}
            <div className="flex items-center gap-3 overflow-hidden">
                <span className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold
            ${isAnnounced ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}
        `}>
                </span>
                <span className={`text-lg font-medium truncate ${isAnnounced ? 'text-green-800' : 'text-gray-800'}`}>
                    {prize.prizeName}
                </span>
            </div>

            {/* 景品番号 */}
            <div className="flex items-center gap-3 shrink-0 ml-4">
                {isAnnounced ? (
                    <>
                        <span className='text-xl font-medium text-gray-600 bg-none'>景品番号：</span>
                        <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-lg font-bold shadow">{prize.prizeNum}</span>
                    </>
                ) : (
                    <>
                        <span className='text-xl font-medium text-gray-600'>景品番号：</span>
                        <span className="text-2xl font-bold text-gray-400">???</span>
                    </>
                )}
            </div>
        </li>
    );
}