// bingo-num-app/app/page.tsx

"use client";

// Heroicons ライブラリのインポート（アイコン用）
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
// カスタムフック
import { useBingoState } from '@/hooks/useBingoState';
// Step コンポーネント
import AnnouncePrizeStep from '@/components/steps/AnnouncePrizeStep'; // Step 4 景品発表
import PeopleInputStep from '@/components/steps/PeopleInputStep'; // Step 2 人数入力
import PrizeInputStep from '@/components/steps/PrizeInputStep'; // Step 1 景品入力
import SelectPrizeNumStep from '@/components/steps/SelectPrizeNumStep'; // Step 3 景品番号選択

// ============================================================
// 【アプリメインコンポーネント】
// ============================================================

export default function Home() {

    // useBingoState フックからステートとハンドラを受け取る
    const {
        // --- State ---
        currentStep, // アプリの現在のステップ
        setCurrentStep,
        prizeObjectList, // すべての景品オブジェクトのリスト
        setPrizeObjectList,
        numberOfPeople, // 参加人数
        setNumberOfPeople,
        setIsProgress, // アプリの状態

        // --- Derived State ---
        activePrizes, // 有効な景品のリスト
        numberOfActivePrizes, // 有効な景品数

        // --- Actions & Handlers ---
        resetApp, // アプリの状態をリセット

        // Step 2
        toggleExcludePrize, // 景品の「除外」・「復元」を切り替える
        handleDragEnd, // ドラッグ＆ドロップ終了時
        // Step 3
        handleSelectPrize, // 景品選択
        handleDeselectPrize, // 景品選択状態解除
        handleMemoChange, // メモ欄の更新
        // Step 4
        handleAnnouncePrize, // 景品発表
        handleUnannouncePrize, // 景品発表状態解除

    } = useBingoState()

    // ------------------------------------------------------------
    // 現在のステップに応じて表示するコンポーネントを切り替える
    // ------------------------------------------------------------

    const renderStep = () => {
        switch (currentStep) {

            // --- Step 1 景品入力 ---
            case "prizeInput":
                return (
                    <PrizeInputStep
                        setIsProgress={setIsProgress}
                        setPrizeObjectList={setPrizeObjectList}
                        setCurrentStep={setCurrentStep}
                    />
                );

            // --- Step 2 人数入力 ---
            case "peopleInput":
                return (
                    <PeopleInputStep
                        prizeObjectList={prizeObjectList}
                        setPrizeObjectList={setPrizeObjectList}
                        numberOfPeople={numberOfPeople}
                        setNumberOfPeople={setNumberOfPeople}
                        setCurrentStep={setCurrentStep}
                        activePrizes={activePrizes}
                        numberOfActivePrizes={numberOfActivePrizes}
                        // ハンドラーを渡す
                        toggleExcludePrize={toggleExcludePrize}
                        handleDragEnd={handleDragEnd}
                    />
                );

            // --- Step 3 景品番号選択 ---
            case "selectPrizeNum":
                return (
                    <SelectPrizeNumStep
                        prizeObjectList={prizeObjectList}
                        setPrizeObjectList={setPrizeObjectList}
                        numberOfPeople={numberOfPeople}
                        setCurrentStep={setCurrentStep}
                        activePrizes={activePrizes}
                        numberOfActivePrizes={numberOfActivePrizes}
                        // ハンドラーを渡す
                        handleSelectPrize={handleSelectPrize}
                        handleDeselectPrize={handleDeselectPrize}
                        handleMemoChange={handleMemoChange}
                    />
                );

            // --- Step 4 景品発表 ---
            case "AnnouncePrize":
                return (
                    <AnnouncePrizeStep
                        prizeObjectList={prizeObjectList}
                        setPrizeObjectList={setPrizeObjectList}
                        numberOfPeople={numberOfPeople}
                        activePrizes={activePrizes}
                        numberOfActivePrizes={numberOfActivePrizes}
                        // ハンドラーを渡す
                        handleAnnouncePrize={handleAnnouncePrize}
                        handleUnannouncePrize={handleUnannouncePrize}
                    />
                );
            default:
                return null;
        }
    };

    // ------------------------------------------------------------
    // レンダリング
    // ------------------------------------------------------------

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-6 md:px-12 md:py-6 lg:px-24 lg:py-6 bg-gray-50 font-sans text-gray-900">
            {/* --- ヘッダー --- */}
            <div className="z-10 w-full max-w-4xl items-center justify-between lg:flex mb-4">
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                    景品番号管理アプリ
                </h1>
                {/* リセットボタン */}
                <button
                    onClick={resetApp}
                    className="flex items-center gap-2 mt-4 lg:mt-0 px-4 py-2 bg-red-500 text-lg text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200"
                >
                    <ArrowUturnLeftIcon className="w-5 h-5" />
                    リセット
                </button>
            </div>

            {/* --- メインコンテンツ（ステップごと） --- */}
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
                {renderStep()}
            </div>

            {/* --- フッター --- */}
            <footer className="mt-10 text-center text-gray-500 text-sm">
                <p>愛知工業大学 自由ヶ丘執行委員会</p>
            </footer>
        </main>
    );
}