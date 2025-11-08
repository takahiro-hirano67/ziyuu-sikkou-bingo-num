"use client";

import { useState } from "react";
import { useBeforeUnload } from "react-use";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { prizeObjectType } from "./PrizeObjectType";
import InputForm from "../../components/step/InputForm";
import InProgress from "../../components/step/InProgress";
import InAnnouncement from "../../components/step/InAnnouncement";
import SelectAnnounceOrder from "@/components/step/SelectAnnounceOrder";

export default function MainPage() {
    // 基本入力情報
    const [numOfPeople, setNumOfPeople] = useState<number>(0);
    const [numOfItems, setNumOfItems] = useState<number>(0);
    const [isSelectAnnounceOrder, setIsSelectAnnounceOrder] = useState<boolean>(false);
    // // 景品番号管理
    const [prizeNumList, setPrizeNumList] = useState<prizeObjectType[]>([]);

    // アプリ状態管理
    const [step, setStep] = useState<"input" | "selectAnnounceOrder" | "inProgress" | "inAnnouncement">("input"); // 入力画面 | 景品番号選択画面 | 景品発表画面
    const [isProgress, setIsProgress] = useState<boolean>(false); // 誤リロード防止用

    // 誤リロード防止処理（リロードやページを閉じようとしたらアラートが出現）
    useBeforeUnload(isProgress);

    // リスト内の要素をランダムに入れ替える関数（公平性重視...フィッシャー・イェーツのシャッフルアルゴリズム: Fisher–Yates shuffle）
    const shuffleArray = (array: number[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            // 0からiまでのランダムなインデックスを生成
            const j = Math.floor(Math.random() * (i + 1));
            // 分割代入を使って要素を交換
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // ============================================================
    // 基本情報入力完了時の処理
    // ============================================================

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(isSelectAnnounceOrder)
        // 入力値が0以下 もしくは NaNの時は処理を実行しない
        if (numOfItems <= 0 || Number.isNaN(numOfItems) || numOfPeople <= 0 || Number.isNaN(numOfPeople)) {
            alert("不正な値、もしくは入力されていません");
            return;
        }
        // 景品数が参加者数よりも多い場合は処理を実行しない（参加者の前で除外する景品を公表する）
        if (numOfItems > numOfPeople) {
            alert(
                "景品数が参加者数よりも多い状態です。景品数を減らしてください。\n```進行例:\n今回は想定よりも参加人数が少ないため、\n景品数を参加人数に合わせます。\nそして、比較的に価値の低い景品は景品プールから除外し、\n次回以降のイベントに持ち越します。\n除外する景品の中で、今回のビンゴの景品に含めたいものはありますか？\n（もし希望があれば景品を入れ替える）\n運営側の都合となり恐れ入りますが、食品やシーズンアイテムは優先的に\n景品プールに含めさせていただきます。\n```"
            );
            return;
        }
        setIsProgress(true);

        // 景品の数だけ景品番号を生成する
        const originalList: number[] = [];
        for (let i = 1; i <= numOfItems; i++) {
            originalList.push(i);
        }
        // 景品の数に対応した当選番号を生成する
        const ShuffledList: number[] = shuffleArray(originalList.slice());

        // 景品番号と当選番号を対応付けたオブジェクトを生成
        const prizeObject: prizeObjectType[] = originalList.map((prizeNum, i) => ({
            prizeNum,
            winnerNum: ShuffledList[i],
            displayOrderNum: 0,
            isSelected: false,
            isAnnounced: false,
            memo: "",
        }));

        setPrizeNumList(prizeObject); // 景品番号のリストを更新

        // 景品発表順の選択画面
        if (isSelectAnnounceOrder === true) {
            // 並び替え画面を使う場合のみ「降順ソート」して見やすく
            const sortedPrizeObject = prizeObject
                .slice()
                .sort((a, b) => b.winnerNum - a.winnerNum)
                .map((item, index) => ({
                    ...item,
                    displayOrderNum: index + 1,
                }));
            setPrizeNumList(sortedPrizeObject);
            setStep("selectAnnounceOrder")
        }
        // 景品番号選択画面
        else {
            // ソートなし（デフォルト：景品番号順 ※当選番号はランダム）
            setStep("inProgress");
        }
    };

    // ============================================================
    // 画面移行時の処理
    // ============================================================

    const handleChangeInProgress = () => {
        if (window.confirm("景品番号の選択に移ります。よろしいですか？")) {
            // 「はい」を選択した場合の処理
            // デフォルトの並び順（景品番号順）に戻す
            const defaultSortedList = [...prizeNumList].sort((a, b) => a.prizeNum - b.prizeNum);
            setPrizeNumList(defaultSortedList)
            setStep("inProgress");
        } else {
            // 「いいえ」を選択した場合の処理
            return;
        }
    }

    const handleChangeAnnouncement = () => {
        if (window.confirm("景品発表へ移ります。よろしいですか？\n確認事項:\n・景品番号は全て配布しているか？\n・未選択の景品番号はないか？")) {
            // 「はい」を選択した場合の処理
            setStep("inAnnouncement");
        } else {
            // 「いいえ」を選択した場合の処理
            return;
        }
    };

    // ============================================================
    // 景品番号の要素に対する処理（番号選択時）
    // ============================================================

    // 景品番号をクリックすると選択済み
    const handleSelect = (prizeNum: number) => {
        setPrizeNumList((prev) => prev.map((item) => (item.prizeNum === prizeNum ? { ...item, isSelected: true } : item)));
    };
    // 景品番号をダブルクリックすると選択状態を解除（保険機能）
    const handleDisSelect = (prizeNum: number) => {
        alert("選択状態を解除しました");
        setPrizeNumList((prev) => prev.map((item) => (item.prizeNum === prizeNum ? { ...item, isSelected: false } : item)));
    };
    // メモ欄を更新する関数
    const handleUpdateMemo = (prizeNum: number, memo: string) => {
        setPrizeNumList((prev) => prev.map((item) => (item.prizeNum === prizeNum ? { ...item, memo } : item)));
    };


    // ============================================================
    // 景品番号の要素に対する処理（景品発表時）
    // ============================================================

    // 景品番号をクリックすると選択済み
    const handleAnnounce = (prizeNum: number) => {
        setPrizeNumList((prev) => prev.map((item) => (item.prizeNum === prizeNum ? { ...item, isAnnounced: true } : item)));
    };
    // 景品番号をダブルクリックすると選択状態を解除（保険機能）
    const handleDisAnnounce = (prizeNum: number) => {
        alert("発表状態を解除しました");
        setPrizeNumList((prev) => prev.map((item) => (item.prizeNum === prizeNum ? { ...item, isAnnounced: false } : item)));
    };


    // ============================================================
    // 景品発表順を並べ替える処理
    // ============================================================

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setPrizeNumList((items) => {
                const oldIndex = items.findIndex(item => item.prizeNum === active.id);  // active.id → ドラッグ元
                const newIndex = items.findIndex(item => item.prizeNum === over.id);    // over.id → ドロップ先

                // 配列を並べ替える
                const newOrderedItems = arrayMove(items, oldIndex, newIndex);

                // 必要であれば、ここで index プロパティの番号も振り直す
                return newOrderedItems.map((item, index) => ({
                    ...item,
                    displayOrderNum: index + 1
                }));
            });
        }
    }

    // ============================================================
    // 要素表示
    // ============================================================

    return (
        <div className="p-8">
            <h1 className="fixed z-20 text-2xl font-bold">ビンゴ番号管理アプリ</h1>
            <main className="mx-auto mt-4 max-w-5xl">
                {/* 参加人数と景品数を入力するフォーム */}
                {step === "input" && <InputForm numOfPeople={numOfPeople} setNumOfPeople={setNumOfPeople} numOfItems={numOfItems} setNumOfItems={setNumOfItems} isSelectAnnounceOrder={isSelectAnnounceOrder} setIsSelectAnnounceOrder={setIsSelectAnnounceOrder} handleSubmit={handleSubmit} />}
                {/* 景品発表順を選択する画面 */}
                {step === "selectAnnounceOrder" && <SelectAnnounceOrder prizeNumList={prizeNumList} handleDragEnd={handleDragEnd} handleChangeInProgress={handleChangeInProgress} />}
                {/* 景品番号選択画面 */}
                {step === "inProgress" && <InProgress numOfPeople={numOfPeople} numOfItems={numOfItems} prizeNumList={prizeNumList} handleSelect={handleSelect} handleDisSelect={handleDisSelect} handleUpdateMemo={handleUpdateMemo} handleChangeAnnounce={handleChangeAnnouncement} />}
                {/* 景品発表画面 */}
                {step === "inAnnouncement" && <InAnnouncement numOfPeople={numOfPeople} numOfItems={numOfItems} prizeNumList={prizeNumList} handleAnnounce={handleAnnounce} handleDisAnnounce={handleDisAnnounce} />}
            </main>
        </div>
    );
}
