// bingo-num-app/components/steps/PrizeInputStep.tsx

"use client"

import { useMemo, useState } from "react";
// 型定義
import type { PrizeObject, Step } from "@/types";

// ============================================================
// 【ステップ1：景品入力コンポーネント】
// ポイント:
// - 景品リストを改行区切りで入力。
// ============================================================

interface PrizeInputStepProps {
    setIsProgress: React.Dispatch<React.SetStateAction<boolean>>;
    setPrizeObjectList: React.Dispatch<React.SetStateAction<PrizeObject[]>>;
    setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
}

function PrizeInputStep({ setPrizeObjectList, setCurrentStep, setIsProgress }: PrizeInputStepProps) {

    // テキストエリアの入力値を管理
    const [prizeInputText, setPrizeInputText] = useState("");

    // テキストエリアの入力に基づいて現在の景品リスト（文字列配列）を計算
    const currentPrizes = useMemo(() => {
        // 改行で分割し、空行を除去
        return prizeInputText.split('\n').filter(name => name.trim() !== '');
    }, [prizeInputText]);

    // 現在の景品数
    const currentPrizeCount = currentPrizes.length;

    // ------------------------------------------------------------
    // 決定ボタン押下時の処理（次のステップへ移行）
    // ------------------------------------------------------------

    const handleSubmit = () => {
        if (currentPrizeCount === 0) {
            alert("景品を1つ以上入力してください。");
            return;
        }

        // 景品オブジェクトの配列を生成
        const newPrizeObjectList: PrizeObject[] = currentPrizes.map((name, index) => ({
            id: crypto.randomUUID(), // dnd-kit用の一意ID
            prizeName: name.trim(), // 景品名
            prizeNum: null, // 景品番号
            displayOrderNum: index + 1, // 発表順（入力順で初期化）
            isSelected: false, // 選択状態
            isAnnounced: false, // 発表状態
            isExcluded: false, // 除外状態
            memo: "",
        }));
        setIsProgress(true); // アプリ処理開始（以降はリロードやページを閉じようとした際に確認アラートが発生）
        setPrizeObjectList(newPrizeObjectList);
        setCurrentStep("peopleInput"); // 次のステップへ
    };

    return (
        <div className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Step 1: 景品入力</h2>
            <p className="text-lg text-gray-600 mb-6">景品名を1行に1つずつ入力してください。<br />（メモ帳などからのコピー＆ペーストを推奨します）</p>

            {/* 現在の景品数を表示 */}
            <div className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg">
                <span className="text-xl font-medium text-gray-800">
                    現在の景品数: <span className="text-blue-600 text-2xl font-bold">{currentPrizeCount}</span>
                </span>
            </div>

            {/* 景品入力テキストエリア */}
            <textarea
                value={prizeInputText}
                onChange={(e) => setPrizeInputText(e.target.value)}
                rows={15}
                className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder={"例：\n旅行券\nワイヤレスイヤホン\nモバイルバッテリー\n・\n・\n・"} />

            {/* 決定ボタン */}
            <div className="mt-8 text-center">
                <button
                    onClick={handleSubmit}
                    disabled={currentPrizeCount === 0} // 景品が0の場合は無効
                    className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    参加人数入力へ進む
                </button>
            </div>
        </div>
    );
}
export default PrizeInputStep