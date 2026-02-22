"use client";

import React, { useState, useMemo } from 'react';
import { useBeforeUnload } from "react-use"; // 誤リロード防止用
// DND-Kit ライブラリのインポート
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// Heroicons ライブラリのインポート（アイコン用）
import { TrashIcon, ArrowUturnLeftIcon, Bars3Icon, CheckIcon } from '@heroicons/react/24/outline';

// --- 型定義 ---

/**
 * 景品オブジェクトの型
 */
type PrizeObject = {
    id: string; // dnd-kit用の一意のID
    prizeName: string; // 景品名
    prizeNum: number | null; // 景品番号 (引換番号)
    displayOrderNum: number; // 景品発表順
    isSelected: boolean; // 景品番号が選択されたか (Step 3)
    isAnnounced: boolean; // 景品が発表されたか (Step 4)
    isExcluded: boolean; // 景品が除外されたか (Step 2)
    memo: string; // メモ (Step 3)
};

/**
 * アプリの現在のステップを示す型
 */
type Step = "prizeInput" | "peopleInput" | "selectPrizeNum" | "AnnouncePrize";

// --- ユーティリティ関数 ---

/**
 * Fisher-Yates (Knuth) シャッフルアルゴリズム
 * 配列をランダムに並べ替えるために使用します。
 * @param array シャッフル対象の配列
 * @returns シャッフル後の新しい配列
 */
const fisherYatesShuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array]; // 元の配列をコピー
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // ES6の分割代入を使用して要素を交換
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};


// --- メインコンポーネント (app/page.tsx) ---

export default function Home() {
    // アプリの現在のステップを管理
    const [currentStep, setCurrentStep] = useState<Step>("prizeInput");
    // すべての景品オブジェクトのリストを管理
    const [prizeObjectList, setPrizeObjectList] = useState<PrizeObject[]>([]);
    // 参加人数を管理
    const [numberOfPeople, setNumberOfPeople] = useState<number>(0);

    // アプリの状態管理
    const [isProgress, setIsProgress] = useState<boolean>(false); // 誤リロード防止用

    // 誤リロード防止処理（リロードやページを閉じようとしたらアラートが出現）
    useBeforeUnload(isProgress);

    /**
     * アプリの状態を初期化（リセット）する関数
     */
    const resetApp = () => {
        // ユーザーに確認
        if (window.confirm("最初からやり直しますか？すべてのデータがリセットされます。")) {
            setCurrentStep("prizeInput");
            setPrizeObjectList([]);
            setNumberOfPeople(0);
            setIsProgress(false);
        }
    };

    // --- 計算済みプロパティ (useMemoでパフォーマンス最適化) ---

    // 除外されていない景品（有効な景品）のリスト
    const activePrizes = useMemo(
        () => prizeObjectList.filter((prize) => !prize.isExcluded),
        [prizeObjectList]
    );

    // 有効な景品数
    const numberOfActivePrizes = activePrizes.length;

    /**
     * 現在のステップに応じて表示するコンポーネントを切り替える
     */
    const renderStep = () => {
        switch (currentStep) {
            case "prizeInput":
                return (
                    <PrizeInputStep
                        setIsProgress={setIsProgress}
                        setPrizeObjectList={setPrizeObjectList}
                        setCurrentStep={setCurrentStep}
                    />
                );
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
                    />
                );
            case "selectPrizeNum":
                return (
                    <SelectPrizeNumStep
                        prizeObjectList={prizeObjectList}
                        setPrizeObjectList={setPrizeObjectList}
                        numberOfPeople={numberOfPeople}
                        setCurrentStep={setCurrentStep}
                        activePrizes={activePrizes}
                        numberOfActivePrizes={numberOfActivePrizes}
                    />
                );
            case "AnnouncePrize":
                return (
                    <AnnouncePrizeStep
                        prizeObjectList={prizeObjectList}
                        setPrizeObjectList={setPrizeObjectList}
                        numberOfPeople={numberOfPeople}
                        activePrizes={activePrizes}
                        numberOfActivePrizes={numberOfActivePrizes}
                    />
                );
            default:
                return null;
        }
    };

    // --- レンダリング ---
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


// --- ステップ1：景品入力コンポーネント ---
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

    /**
     * 決定ボタン押下時の処理
     */
    const handleSubmit = () => {
        if (currentPrizeCount === 0) {
            alert("景品を1つ以上入力してください。");
            return;
        }

        // 景品オブジェクトの配列を生成
        const newPrizeObjectList: PrizeObject[] = currentPrizes.map((name, index) => ({
            id: crypto.randomUUID(), // dnd-kit用の一意ID
            prizeName: name.trim(),
            prizeNum: null,
            displayOrderNum: index + 1, // 発表順（入力順で初期化）
            isSelected: false,
            isAnnounced: false,
            isExcluded: false,
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


// --- ステップ2：参加人数入力 & 景品数調整コンポーネント ---
interface PeopleInputStepProps {
    prizeObjectList: PrizeObject[];
    setPrizeObjectList: React.Dispatch<React.SetStateAction<PrizeObject[]>>;
    numberOfPeople: number;
    setNumberOfPeople: React.Dispatch<React.SetStateAction<number>>;
    setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
    activePrizes: PrizeObject[]; // 有効な景品リスト
    numberOfActivePrizes: number; // 有効な景品数
}

function PeopleInputStep({
    prizeObjectList,
    setPrizeObjectList,
    numberOfPeople,
    setNumberOfPeople,
    setCurrentStep,
    activePrizes,
    numberOfActivePrizes
}: PeopleInputStepProps) {

    // 除外された景品数
    const excludedPrizesCount = prizeObjectList.length - numberOfActivePrizes;

    // 決定ボタンを押せるかどうかの条件（参加人数 ≧ 景品数, かつ景品数 > 0, かつ参加人数 > 0）
    const canProceed = numberOfPeople >= numberOfActivePrizes && numberOfActivePrizes > 0 && numberOfPeople > 0;

    // dnd-kit センサーの初期化（ポインターとキーボード）
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    /**
     * 景品の「除外」「復元」をトグルする
     * @param id トグル対象の景品ID
     */
    const toggleExcludePrize = (id: string) => {
        setPrizeObjectList(prevList => {
            // 対象の景品のisExcludedを反転
            const newList = prevList.map(prize =>
                prize.id === id ? { ...prize, isExcluded: !prize.isExcluded } : prize
            );
            // 発表順（displayOrderNum）を更新
            // （並べ替えロジックと競合するため、ここでは順序は変更しない）
            return newList;
        });
    };

    /**
     * ドラッグ＆ドロップ終了時の処理
     * @param event DNDイベント
     */
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setPrizeObjectList((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                // arrayMoveで並べ替え後、displayOrderNumをインデックスに基づいて再割り当て
                return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
                    ...item,
                    displayOrderNum: index + 1,
                }));
            });
        }
    };

    /**
     * 決定ボタン（景品番号の割り当て）押下時の処理
     */
    const handleSubmit = () => {
        if (!canProceed) {
            alert("参加人数が景品数（除外を除く）以上になるように設定してください。");
            return;
        }

        // 1. 有効な景品リスト (activePrizes は props から取得)

        // 2. 景品番号リスト [1, 2, ..., numOfItems] を生成
        const prizeNumbers = Array.from({ length: numberOfActivePrizes }, (_, i) => i + 1);

        // 3. 有効な景品リストをシャッフル
        const shuffledPrizes = fisherYatesShuffle(activePrizes);

        // 4. シャッフルした景品に景品番号を割り当て (高速化のためMap使用)
        const prizedMap = new Map<string, number>();
        shuffledPrizes.forEach((prize, index) => {
            prizedMap.set(prize.id, prizeNumbers[index]);
        });

        // 5. 元のリスト（prizeObjectList）を更新
        setPrizeObjectList(prevList =>
            prevList.map(prize => {
                // MapにIDが存在（＝有効な景品）なら、景品番号を設定
                if (prizedMap.has(prize.id)) {
                    return { ...prize, prizeNum: prizedMap.get(prize.id)! };
                }
                return prize; // 除外された景品は prizeNum: null のまま
            })
        );

        setCurrentStep("selectPrizeNum"); // 次のステップへ
    };

    return (
        <div className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Step 2: 参加人数入力 & 景品調整</h2>

            {/* --- 上部：入力欄 --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 p-6 bg-gray-100 rounded-lg">
                {/* 参加人数入力 */}
                <div>
                    <label htmlFor="peopleInput" className="block text-xl font-medium text-gray-700 mb-1">
                        参加人数
                    </label>
                    <input
                        id="peopleInput"
                        type="number"
                        min={0}
                        value={numberOfPeople === 0 ? '' : numberOfPeople} // 0の場合は空表示
                        onChange={(e) => setNumberOfPeople(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                        placeholder="例: 10"
                    />
                </div>
                {/* 有効な景品数 */}
                <div className="flex flex-col justify-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-lg font-medium text-gray-500">現在の景品数 (有効)</span>
                    <span className="text-2xl font-bold text-blue-600">{numberOfActivePrizes}</span>
                </div>
                {/* 除外した景品数 */}
                <div className="flex flex-col justify-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-lg font-medium text-gray-500">除外した景品数</span>
                    <span className="text-2xl font-bold text-gray-600">{excludedPrizesCount}</span>
                </div>
            </div>

            {/* --- 警告メッセージ --- */}
            {!canProceed && (
                <div className="mb-4 p-4 text-lg bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-lg">
                    <p className="font-semibold">
                        {numberOfPeople <= 0 ? "参加人数を入力してください。" : "参加人数が有効な景品数以上である必要があります。"}
                    </p>
                    <p className="text-md">
                        （ 現在：{numberOfPeople} (参加人数) vs {numberOfActivePrizes} (景品数) ）
                    </p>
                </div>
            )}

            {/* --- 下部：景品リスト (DND) --- */}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">景品リスト (発表順)</h3>
            <p className="text-md text-gray-500 mb-4">ドラッグ&ドロップで発表順を変更できます。参加人数より景品が多い場合は「除外」してください。</p>

            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={prizeObjectList.map(p => p.id)} // IDの配列を渡す
                        strategy={verticalListSortingStrategy} // 垂直方向のソート
                    >
                        <ul className="divide-y divide-gray-200">
                            {/* 発表順（displayOrderNum）でソートして表示 */}
                            {prizeObjectList
                                .sort((a, b) => a.displayOrderNum - b.displayOrderNum)
                                .map((prize) => (
                                    <SortablePrizeItem
                                        key={prize.id}
                                        prize={prize}
                                        toggleExcludePrize={toggleExcludePrize}
                                    />
                                ))}
                        </ul>
                    </SortableContext>
                </DndContext>
            </div>

            {/* --- 決定ボタン --- */}
            <div className="mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={!canProceed} // 条件を満たさないと無効
                    className="flex items-center gap-2 float-right px-8 py-3 mb-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <CheckIcon className="w-5 h-5" />
                    景品番号を割り当て
                </button>
            </div>
        </div>
    );
}

/**
 * Step 2用：並べ替え可能な景品リストアイテム
 */
function SortablePrizeItem({ prize, toggleExcludePrize }: { prize: PrizeObject; toggleExcludePrize: (id: string) => void; }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: prize.id }); // IDで紐付け

    // ドラッグ&ドロップ中のスタイル
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isExcluded = prize.isExcluded;

    return (
        <li
            ref={setNodeRef} // ドラッグ&ドロップノード参照
            style={style}
            className={`flex items-center justify-between p-4 ${isExcluded ? 'bg-gray-200 opacity-60' : 'bg-white'}`}
        >
            <div className="flex items-center gap-4">
                {/* ドラッグハンドル */}
                <button
                    {...attributes} // DND属性
                    {...listeners} // DNDリスナー
                    className={`cursor-grab touch-none p-2 rounded ${isExcluded ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-100'}`}
                    disabled={isExcluded} // 除外中はDND不可
                >
                    <Bars3Icon className="w-5 h-5" />
                </button>
                {/* 発表順 と 景品名 */}
                <span className={`text-lg font-medium ${isExcluded ? 'text-gray-600 line-through' : 'text-gray-800'}`}>
                    {prize.displayOrderNum}. {prize.prizeName}
                </span>
            </div>
            {/* 除外/復元ボタン */}
            <button
                onClick={() => toggleExcludePrize(prize.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isExcluded
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
            >
                {isExcluded ? <ArrowUturnLeftIcon className="w-4 h-4" /> : <TrashIcon className="w-4 h-4" />}
                {isExcluded ? '復元' : '除外'}
            </button>
        </li>
    );
}


// --- ステップ3：景品番号選択コンポーネント ---
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

    // 選択済みの景品数
    const selectedPrizesCount = activePrizes.filter(p => p.isSelected).length;
    // 残りの未選択の景品数
    const remainingPrizesCount = numberOfActivePrizes - selectedPrizesCount;
    // 全て選択済みか
    const allPrizesSelected = remainingPrizesCount === 0;

    /**
     * 景品番号をクリック（選択）
     * @param prizeNum 選択された景品番号
     */
    const handleSelectPrize = (prizeNum: number) => {
        setPrizeObjectList(prevList =>
            prevList.map(prize =>
                prize.prizeNum === prizeNum ? { ...prize, isSelected: true } : prize
            )
        );
    };

    /**
     * 景品番号をダブルクリック（選択解除）
     * @param prizeNum 解除された景品番号
     */
    const handleDeselectPrize = (prizeNum: number) => {
        setPrizeObjectList(prevList =>
            prevList.map(prize =>
                prize.prizeNum === prizeNum ? { ...prize, isSelected: false, memo: "" } : prize // メモもリセット
            )
        );
    };

    /**
     * メモ欄の更新
     * @param prizeNum 対象の景品番号
     * @param memo 入力されたメモ
     */
    const handleMemoChange = (prizeNum: number, memo: string) => {
        setPrizeObjectList(prevList =>
            prevList.map(prize =>
                prize.prizeNum === prizeNum ? { ...prize, memo: memo } : prize
            )
        );
    };

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

            {/* --- 下部：決定ボタン --- */}
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

/**
 * Step 3用：景品番号ボックス
 */
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


// --- ステップ4：景品発表コンポーネント ---
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

    // 発表済みの景品数
    const announcedPrizesCount = activePrizes.filter(p => p.isAnnounced).length;
    // 残りの未発表景品数
    const remainingPrizesCount = numberOfActivePrizes - announcedPrizesCount;
    // 全て発表済みか
    const allPrizesAnnounced = remainingPrizesCount === 0;

    /**
     * 景品（発表順リスト）をクリック（発表）
     * @param id 発表する景品のID
     */
    const handleAnnouncePrize = (id: string) => {
        setPrizeObjectList(prevList =>
            prevList.map(prize =>
                prize.id === id ? { ...prize, isAnnounced: true } : prize
            )
        );
    };

    /**
     * 景品（発表順リスト）をダブルクリック（発表取り消し）
     * @param id 取り消す景品のID
     */
    const handleUnannouncePrize = (id: string) => {
        setPrizeObjectList(prevList =>
            prevList.map(prize =>
                prize.id === id ? { ...prize, isAnnounced: false } : prize
            )
        );
    };

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

/**
 * Step 4用：中段の景品番号ボックス (発表用)
 */
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

/**
 * Step 4用：下段の景品リストアイテム (発表用)
 */
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