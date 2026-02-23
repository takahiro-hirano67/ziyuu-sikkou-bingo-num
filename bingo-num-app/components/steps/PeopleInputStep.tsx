// bingo-num-app/components/steps/PeopleInputStep.tsx

"use client"

// DND-Kit ライブラリのインポート
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragEndEvent } from '@dnd-kit/core';
// Heroicons ライブラリのインポート（アイコン用）
import { ArrowUturnLeftIcon, Bars3Icon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
// 型定義
import type { PrizeObject, Step } from '@/types';
// 配列シャッフル処理
import { fisherYatesShuffle } from '@/utils/shuffle';


// ============================================================
// 【ステップ2：参加人数入力 & 景品数調整コンポーネント】
// ポイント:
// - 参加人数を入力し、景品リストの発表順をドラッグ＆ドロップで並べ替える。
// - 参加人数より景品が多い場合は、景品を除外して数を調整するよう誘導。
// （参加人数より景品が多い場合はそもそも実行しない。）
// ============================================================

interface PeopleInputStepProps {
    prizeObjectList: PrizeObject[];
    setPrizeObjectList: React.Dispatch<React.SetStateAction<PrizeObject[]>>;
    numberOfPeople: number;
    setNumberOfPeople: React.Dispatch<React.SetStateAction<number>>;
    setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
    activePrizes: PrizeObject[]; // 有効な景品リスト
    numberOfActivePrizes: number; // 有効な景品数
    toggleExcludePrize: (id: string) => void; // 景品の「除外」・「復元」を切り替える
    handleDragEnd: (event: DragEndEvent) => void; // ドラッグ＆ドロップ終了時
}


function PeopleInputStep({
    prizeObjectList,
    setPrizeObjectList,
    numberOfPeople,
    setNumberOfPeople,
    setCurrentStep,
    activePrizes,
    numberOfActivePrizes,
    toggleExcludePrize,
    handleDragEnd,
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

    // ------------------------------------------------------------
    // 決定ボタン（景品番号の割り当て）を押した時の処理（次のステップに移行）
    // ------------------------------------------------------------

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
export default PeopleInputStep


// ============================================================
// 並べ替え可能な景品リストアイテム
// ============================================================

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
                    aria-label="並べ替え用のドラッグハンドル"
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