// 景品番号オブジェクトの型定義
export type prizeObjectType = {
    prizeNum: number;           // 景品番号
    winnerNum: number;          // 当選番号
    displayOrderNum: number;    // 発表順
    isSelected: boolean;        // 景品番号を選択したかどうか
    isAnnounced: boolean;       // 景品を発表したかどうか
    memo: string;               // メモ
};
