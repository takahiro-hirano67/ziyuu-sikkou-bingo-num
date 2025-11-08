"use client";

import Image from "next/image";
import description_image from "@/imges/description_image.png"

// Propsの型定義
interface InputFormProps {
    numOfPeople: number;
    setNumOfPeople: React.Dispatch<React.SetStateAction<number>>;
    numOfItems: number;
    setNumOfItems: React.Dispatch<React.SetStateAction<number>>;
    isSelectAnnounceOrder: boolean;
    setIsSelectAnnounceOrder: React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

// 情報入力セクション
const InputForm: React.FC<InputFormProps> = ({ numOfPeople, setNumOfPeople, numOfItems, setNumOfItems, isSelectAnnounceOrder, setIsSelectAnnounceOrder, handleSubmit }) => {
    return (
        <div className="flex flex-col">
            <form onSubmit={handleSubmit} className="mt-6  flex flex-col gap-6">
                <h2 className="text-3xl font-bold self-center">情報入力</h2>
                <section className="grid grid-cols-2 gap-10">
                    {/* 参加人数（値がNaNの時は空文字列を返すように） */}
                    <div className="flex flex-col items-center">
                        <label htmlFor="number_of_people" className="text-xl font-bold">
                            参加人数
                        </label>
                        <input type="number" id="number_of_people" name="number_of_people" placeholder="参加人数を入力" min={0} max={1000} required value={Number.isNaN(numOfPeople) ? "" : numOfPeople} onChange={(e) => setNumOfPeople(e.target.valueAsNumber)} className="border-2 text-center py-4 w-md text-xl" />
                    </div>
                    {/* 景品数（値がNaNの時は空文字列を返すように） */}
                    <div className="flex flex-col items-center">
                        <label htmlFor="number_of_items" className="text-xl font-bold">
                            景品数
                        </label>
                        <input type="number" id="number_of_items" name="number_of_items" placeholder="景品数を入力" min={0} max={1000} required value={Number.isNaN(numOfItems) ? "" : numOfItems} onChange={(e) => setNumOfItems(e.target.valueAsNumber)} className="border-2 text-center py-4 w-md text-xl" />
                    </div>
                </section>
                <section className="flex flex-col items-center gap-2">
                    <label htmlFor="select_announce_order" className="text-xl font-bold">景品発表順を入れ替える</label>
                    <input type="checkbox" id="select_announce_order" name="select_announce_order" checked={isSelectAnnounceOrder} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsSelectAnnounceOrder(e.target.checked)}　 className="size-8 ms-2 text-sm font-medium text-gray-900" />
                </section>
                <button type="submit" className="my-4 mx-auto min-w-xs py-2.5 text-xl font-medium border-2 bg-gray-200/50 rounded-2xl hover:bg-gray-200">
                    決定
                </button>
            </form>
            <hr className="my-10 border-gray-950/50" />
            <h3 className="text-3xl font-bold text-center">このアプリについて</h3>
            <div className="self-center flex flex-col text-xl font-medium gap-2 mt-6">
                <span>このアプリは、ビンゴの当選番号周りの管理で人為的なミスを完全に防ぐために作成しました。</span>
                <br />
                <h4 className="text-2xl font-bold">アプリの概要</h4>
                <span>景品は1人につき最大1点当選<br />参加者数 ≧ 景品数 である場合でのみ処理を実行できます</span>
                <span>参加人数よりも景品数が多い場合、この場で比較的価値の低い景品から景品プールから超過分を除外します。<br />除外した景品は、次回以降のイベントに持ち越します。</span>
                <span></span>
                <span>もし、除外対象の景品を今回の景品に含めてほしいという要望があれば、景品プール内の景品と交換します。</span>
                <span>運営側の都合となり大変恐れ入りますが、<br />食品やシーズンアイテムは優先的に景品プールに含めさせていただきます。<br />高額景品や人気景品は必ず景品プールに含みます。</span>
                <br />
                <h4 className="text-2xl font-bold">主な変数について</h4>
                <span>景品id（現実）:<br />・1～景品総数<br />・数値が低いほど価値が高い。<br />・数値が高いほど比較的価値が低く、高い値から順に景品プールから除外される。<br />・景品idと参加者が選択する景品番号は連動していません。<br />・景品idと自動で割り当てられる当選番号は連動しています。</span>
                <span>参加人数:<br />・ビンゴに参加する人数の総数。<br />・ビンゴ開始前に必ず参加人数を再確認します。<br />・ビンゴ開始後の途中参加は不可能です。</span>
                <span>景品数:<br />・景品プール内に含む景品数<br />・必ず`参加者数 ≧ 景品数`となるよう調整。</span>
                <span>景品番号:<br />・1～景品プール内の景品数<br />・ビンゴした人は、一度だけ選択可能。</span>
                <span>当選番号:<br />・景品番号に対応してランダムに割り当てられる。<br />・景品発表の際に初めて判明する</span>
                <br />
                <h4 className="text-2xl font-bold">イメージ画像</h4>
                <div className="border-3">
                    <Image src={description_image} alt="イメージ画像" sizes="(max-width: 768px) 100vw, 50vw" className="flex-1 w-full h-auto object-cover"/>
                </div>
                <br />
                <h4 className="text-2xl font-bold">公平性について</h4>
                <span>当選番号を割り当てる処理には公平性を確保しています。<br />シャッフルに利用しているアルゴリズム: `Fisher-Yates shuffle`</span>
                <span>当選番号の処理に不正を疑う場合は、お手数をおかけしますがソースコードを解析してください。<br />ソースコードはGitHubのリポジトリ上で公開しています。</span>
                <a className="text-blue-600" href="https://github.com/takahiro-hirano67/ziyuu-sikkou-bingo-num.git">リポジトリへのリンク（GitHub）: https://github.com/takahiro-hirano67/ziyuu-sikkou-bingo-num.git</a>
            </div>
        </div>
    );
};
export default InputForm;
