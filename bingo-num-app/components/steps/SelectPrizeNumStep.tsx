// bingo-num-app/components/steps/SelectPrizeNumStep.tsx

"use client"

import { useMemo } from "react";
// アイコン
import { CheckIcon } from '@heroicons/react/24/outline';
// 型定義
import type { PrizeObject, Step } from "@/types";
// カスタムフック
import { useBingoState } from '@/hooks/useBingoState';

// ============================================================
// 【ステップ3: 景品番号選択コンポーネント】
// ポイント:
// - ビンゴした人が選んだ引換番号を「選択状態」にする。
// - メモ（当選者名・学籍番号など）を記録可能。
// ============================================================

interface SelectPrizeNumStepProps {
    prizeObjectList: PrizeObject[];
    setPrizeObjectList: React.Dispatch<React.SetStateAction<PrizeObject[]>>;
    numberOfPeople: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
    activePrizes: PrizeObject[];
    numberOfActivePrizes: number;
}

function SelectPrizeNumStep({
    setPrizeObjectList,
    numberOfPeople,
    setCurrentStep,
    activePrizes,
    numberOfActivePrizes
}: SelectPrizeNumStepProps) {

    // useBingoState フックからハンドラを取得
    const {
        handleSelectPrize, // 景品選択
        handleDeselectPrize, // 景品選択状態解除
        handleMemoChange, // メモ欄の更新
    } = useBingoState();

    // 選択済みの景品数
    const selectedPrizesCount = activePrizes.filter(p => p.isSelected).length;
    // 残りの未選択の景品数
    const remainingPrizesCount = numberOfActivePrizes - selectedPrizesCount;
    // 全て選択済みか
    const allPrizesSelected = remainingPrizesCount === 0;

    // 景品番号順にソートされた有効な景品リスト（グリッド表示用）
    const sortedActivePrizes = useMemo(() => {
        return [...activePrizes].sort((a, b) => (a.prizeNum || 0) - (b.prizeNum || 0));
    }, [activePrizes]);

    return (
        <div className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Step 3: 景品番号選択</h2>
            <p className="text-gray-600 text-lg mb-4">ビンゴした人が引換番号を選択します。クリックで選択、ダブルクリックで解除できます。</p>

            {/* --- 上部：情報 --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-100 rounded-lg">
                <div className="flex flex-col justify-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-md font-medium text-gray-500">参加人数</span>
                    <span className="text-2xl font-bold text-gray-800">{numberOfPeople}</span>
                </div>
                <div className="flex flex-col justify-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-md font-medium text-gray-500">景品数</span>
                    <span className="text-2xl font-bold text-blue-600">{numberOfActivePrizes}</span>
                </div>
                <div className="flex flex-col justify-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-md font-medium text-gray-500">残り (未選択)</span>
                    <span className={`text-2xl font-bold ${remainingPrizesCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {remainingPrizesCount}
                    </span>
                </div>
            </div>

            {/* --- 中部：景品番号グリッド --- */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {sortedActivePrizes.map(prize => (
                    <PrizeNumberBox
                        key={prize.id}
                        prize={prize}
                        onSelect={handleSelectPrize}
                        onDeselect={handleDeselectPrize}
                        onMemoChange={handleMemoChange}
                    />
                ))}
            </div>

            {/* --- 警告メッセージ --- */}
            {!allPrizesSelected && (
                <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-lg">
                    <p className="font-semibold">
                        すべての景品が選択されると、景品発表に移れます。
                    </p>
                </div>
            )}

            {/* --- 下部：決定ボタン（次のステップへ） --- */}
            <div className="mt-8 text-right">
                <button
                    onClick={() => setCurrentStep("AnnouncePrize")}
                    disabled={!allPrizesSelected} // 全て選択されるまで無効
                    className="px-8 py-3 bg-green-600 text-lg text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    景品発表へ移る
                </button>
            </div>
        </div>
    );
}
export default SelectPrizeNumStep


// ============================================================
// 景品番号ボックス（並べるもの）
// ============================================================

function PrizeNumberBox({ prize, onSelect, onDeselect, onMemoChange }: {
    prize: PrizeObject;
    onSelect: (prizeNum: number) => void;
    onDeselect: (prizeNum: number) => void;
    onMemoChange: (prizeNum: number, memo: string) => void;
}) {
    const prizeNum = prize.prizeNum!; // このステップでは必ず存在する
    const isSelected = prize.isSelected;

    const handleClick = () => {
        if (!isSelected) {
            onSelect(prizeNum);
        }
    };

    const handleDoubleClick = () => {
        if (isSelected) {
            onDeselect(prizeNum);
        }
    };

    return (
        <div className="flex flex-col">
            {/* 景品番号ボタン */}
            <button
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                className={`relative flex items-center justify-center h-20 w-full rounded-lg border-2 transition-all duration-200
            ${isSelected
                        ? 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed shadow-inner' // 選択済み
                        : 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 hover:border-blue-400 cursor-pointer shadow-sm' // 未選択
                    }`}
            >
                <span className="text-3xl font-bold">{prizeNum}</span>
                {isSelected && <CheckIcon className="w-6 h-6 absolute top-1 right-1 text-gray-600" />}
            </button>

            {/* 選択済みの場合はメモ欄を表示 */}
            {isSelected && (
                <input
                    type="text"
                    value={prize.memo}
                    onChange={(e) => onMemoChange(prizeNum, e.target.value)}
                    placeholder="メモ (例: 学籍番号)"
                    className="w-full mt-2 p-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
            )}
        </div>
    );
}