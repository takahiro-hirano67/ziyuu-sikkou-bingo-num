// bingo-num-app/types/index.ts

// --- 型定義 ---

// ============================================================
// 景品オブジェクトの型
// ============================================================
export type PrizeObject = {
    id: string; // dnd-kit用の一意のID
    prizeName: string; // 景品名
    prizeNum: number | null; // 景品番号 (引換番号)
    displayOrderNum: number; // 景品発表順
    isSelected: boolean; // 景品番号が選択されたか (Step 3)
    isAnnounced: boolean; // 景品が発表されたか (Step 4)
    isExcluded: boolean; // 景品が除外されたか (Step 2)
    memo: string; // メモ (Step 3)
};


// ============================================================
// アプリの現在のステップを示す型
// ============================================================

export type Step = "prizeInput" | "peopleInput" | "selectPrizeNum" | "announcePrize";