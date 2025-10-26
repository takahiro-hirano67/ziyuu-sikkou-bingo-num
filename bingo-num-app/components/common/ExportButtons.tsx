"use client";

import React from "react";
import { prizeObjectType } from "@/app/main/PrizeObjectType";

interface ExportButtonsProps {
  prizeNumList: prizeObjectType[];
  title?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ prizeNumList, title = "bingo_results" }) => {
  // --- CSV生成 ---
  const downloadCSV = () => {
    if (!prizeNumList || prizeNumList.length === 0) {
      alert("エクスポートするデータがありません。");
      return;
    }

    const header: (keyof prizeObjectType)[] = ["prizeNum", "winnerNum", "isSelected", "isAnnounced", "memo"];
    const rows = prizeNumList.map((p) =>
      header
        .map((key) => {
          const val = p[key];
          const s = val === null || val === undefined ? "" : String(val);
          // カンマ・改行・ダブルクオートを含む場合はダブルクオートで囲む
          return s.includes(",") || s.includes("\n") || s.includes('"')
            ? `"${s.replace(/"/g, '""')}"`
            : s;
        })
        .join(",")
    );

    // UTF-8 with BOM（Excelでも文字化けしない）
    const csvContent = "\uFEFF" + [header.join(","), ...rows].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${title}_${ts}.csv`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={downloadCSV}
        className="border px-3 py-2 rounded bg-white hover:bg-gray-50"
      >
        CSVをダウンロード
      </button>
    </div>
  );
};

export default ExportButtons;