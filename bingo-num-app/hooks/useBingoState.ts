// bingo-num-app/hooks/useBingoState.ts

// ============================================================
// すべてのハンドラーを統合した useBingoState フック
// 1つのファイルにロジックを集約することで、「データがどこでどのように更新されているか」が
// このファイルを見るだけで完結する。
// ============================================================

import type { PrizeObject, Step } from '@/types';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';
import { useBeforeUnload } from "react-use"; // 誤リロード防止用

export const useBingoState = () => {
    // ============================================================
    // アプリケーション全体の状態 (State)
    // ============================================================

    // アプリの現在のステップを管理
    const [currentStep, setCurrentStep] = useState<Step>("prizeInput");
    // すべての景品オブジェクトのリストを管理
    const [prizeObjectList, setPrizeObjectList] = useState<PrizeObject[]>([]);
    // 参加人数を管理
    const [numberOfPeople, setNumberOfPeople] = useState<number>(0);
    // アプリの状態管理（誤リロード防止用）
    const [isProgress, setIsProgress] = useState<boolean>(false);

    // 誤リロード防止処理（リロードやページを閉じようとしたらアラートが出現）
    useBeforeUnload(isProgress);


    // ============================================================
    // 派生状態 (Derived State - useMemoで最適化)
    // ============================================================

    // 除外されていない景品（有効な景品）のリスト
    const activePrizes = useMemo(
        () => prizeObjectList.filter((prize) => !prize.isExcluded),
        [prizeObjectList]
    );

    // 有効な景品数
    const numberOfActivePrizes = activePrizes.length;


    // ============================================================
    // グローバルアクション
    // ============================================================

    /**
     * アプリの状態を初期化（リセット）する関数
     **/
    const resetApp = () => {
        if (window.confirm("最初からやり直しますか？すべてのデータがリセットされます。")) {
            setCurrentStep("prizeInput");
            setPrizeObjectList([]);
            setNumberOfPeople(0);
            setIsProgress(false);
        }
    };


    // ============================================================
    // Step 2 用のハンドラー (参加人数入力 & 景品数調整)
    // ============================================================

    /**
     * 景品の「除外」「復元」をトグルする
     * @param id トグル対象の景品ID
     **/
    const toggleExcludePrize = (id: string) => {
        setPrizeObjectList(prevList => {
            // 対象の景品のisExcludedを反転
            return prevList.map(prize =>
                prize.id === id ? { ...prize, isExcluded: !prize.isExcluded } : prize
            );
        });
    };

    /**
     * ドラッグ＆ドロップ終了時の処理 (発表順の並べ替え)
     * @param event DNDイベント
     **/
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


    // ============================================================
    // Step 3 用のハンドラー (景品番号選択)
    // ============================================================

    /**
     * 景品番号をクリック（選択）
     * @param prizeNum 選択された景品番号
     **/
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
     **/
    const handleDeselectPrize = (prizeNum: number) => {
        setPrizeObjectList(prevList =>
            prevList.map(prize =>
                // 選択解除時はメモもリセットする
                prize.prizeNum === prizeNum ? { ...prize, isSelected: false, memo: "" } : prize
            )
        );
    };

    /**
     * メモ欄の更新
     * @param prizeNum 対象の景品番号
     * @param memo 入力されたメモ
     **/
    const handleMemoChange = (prizeNum: number, memo: string) => {
        setPrizeObjectList(prevList =>
            prevList.map(prize =>
                prize.prizeNum === prizeNum ? { ...prize, memo: memo } : prize
            )
        );
    };


    // ============================================================
    // Step 4 用のハンドラー (景品発表)
    // ============================================================

    /**
     * 景品（発表順リスト）をクリック（発表）
     * @param id 発表する景品のID
     **/
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
     **/
    const handleUnannouncePrize = (id: string) => {
        setPrizeObjectList(prevList =>
            prevList.map(prize =>
                prize.id === id ? { ...prize, isAnnounced: false } : prize
            )
        );
    };

    // ============================================================
    // 戻り値 (コンポーネントで必要なものを全てエクスポート)
    // ============================================================
    return {
        // State
        currentStep, // アプリの現在のステップ
        setCurrentStep,
        prizeObjectList, // すべての景品オブジェクトのリスト
        setPrizeObjectList,
        numberOfPeople, // 参加人数
        setNumberOfPeople,
        setIsProgress, // アプリの状態

        // Derived State
        activePrizes, // 有効な景品のリスト
        numberOfActivePrizes, // 有効な景品数

        // Actions & Handlers
        resetApp, // アプリの状態をリセット
        toggleExcludePrize, // 景品の「除外」・「復元」を切り替える
        handleDragEnd, // ドラッグ＆ドロップ終了時
        handleSelectPrize, // 景品選択
        handleDeselectPrize, // 景品選択状態解除
        handleMemoChange, // メモ欄の更新
        handleAnnouncePrize, // 景品発表
        handleUnannouncePrize, // 景品発表状態解除
    };
};