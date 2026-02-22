// bingo-num-app/utils/shuffle.ts

// ============================================================
// 【Fisher-Yates (Knuth) シャッフルアルゴリズム】
// 配列をランダムに並べ替えるために使用します。
// @param array シャッフル対象の配列
// @returns シャッフル後の新しい配列
// ============================================================

export const fisherYatesShuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array]; // 元の配列をコピー
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // ES6の分割代入を使用して要素を交換
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};