"use client";

import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { arrayMove } from "@dnd-kit/sortable";
import { prizeObjectType } from "@/app/main/PrizeObjectType";
import { useState } from "react";

interface Props {
    prizeNumList: prizeObjectType[];
    handleDragEnd: (event: DragEndEvent) => void;
    handleChangeInProgress: () => void;
}

export default function SelectAnnounceOrder({ prizeNumList, handleDragEnd, handleChangeInProgress }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold mt-10">景品発表順の設定</h2>
            <button onClick={handleChangeInProgress} className="my-4 mx-auto min-w-xs py-2.5 text-xl font-medium border-2 bg-gray-200/50 rounded-2xl hover:bg-gray-200">景品番号の選択へ進む</button>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={prizeNumList.map((i) => i.prizeNum)} strategy={verticalListSortingStrategy}>
                    {prizeNumList.map((item) => (
                            <SortableItem key={item.prizeNum} item={item}  />
                        ))}
                </SortableContext>
            </DndContext>
        </div>
    );
}

function SortableItem({ item }: { item: prizeObjectType; }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: item.prizeNum,
    });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center justify-between bg-white border rounded-lg p-3 shadow-sm" {...attributes} {...listeners}>
            <span className="font-bold text-gray-700">当選番号: {item.winnerNum}</span>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">発表順</span>
                <span>{item.displayOrderNum}</span>
            </div>
        </div>
    );
}
