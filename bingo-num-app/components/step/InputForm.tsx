"use client";

// Propsの型定義
interface InputFormProps {
    numOfPeople: number;
    setNumOfPeople: React.Dispatch<React.SetStateAction<number>>;
    numOfItems: number;
    setNumOfItems: React.Dispatch<React.SetStateAction<number>>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

// 情報入力セクション
const InputForm: React.FC<InputFormProps> = ({ numOfPeople, setNumOfPeople, numOfItems, setNumOfItems, handleSubmit }) => {
    return (
        <div className="flex flex-col">
            <form onSubmit={handleSubmit} className="mt-6  flex flex-col gap-6">
                <h2 className="text-2xl font-bold self-center">情報入力</h2>
                <section className="grid grid-cols-2 gap-10">
                    {/* 参加人数（値がNaNの時は空文字列を返すように） */}
                    <div className="flex flex-col items-center">
                        <label htmlFor="number_of_people" className="text-xl font-bold">
                            参加人数
                        </label>
                        <input type="number" id="number_of_people" name="number_of_people" placeholder="参加人数を入力" min={0} required value={Number.isNaN(numOfPeople) ? "" : numOfPeople} onChange={(e) => setNumOfPeople(e.target.valueAsNumber)} className="border-2 text-center py-4 w-md text-xl" />
                    </div>
                    {/* 景品数（値がNaNの時は空文字列を返すように） */}
                    <div className="flex flex-col items-center">
                        <label htmlFor="number_of_items" className="text-xl font-bold">
                            景品数
                        </label>
                        <input type="number" id="number_of_items" name="number_of_items" placeholder="景品数を入力" min={0} required value={Number.isNaN(numOfItems) ? "" : numOfItems} onChange={(e) => setNumOfItems(e.target.valueAsNumber)} className="border-2 text-center py-4 w-md text-xl" />
                    </div>
                </section>
                <button type="submit" className="my-4 mx-auto min-w-xs py-2.5 text-xl font-medium border-2 bg-gray-200/50 rounded-2xl hover:bg-gray-200">
                    決定
                </button>
            </form>
            <hr className="my-10 border-gray-950/50" />
            <h3 className="text-2xl font-bold text-center">このアプリについて</h3>
            <div className="self-center flex flex-col text-xl font-medium gap-2 mt-6">
                <span>このアプリは、ビンゴの当選番号周りの管理で人為的なミスを完全に防ぐために作成しました。</span>
                <br />
                <span>景品は1人につき最大1点当選<br />参加者数 ≧ 景品数 である場合でのみ処理を実行できます</span>
                <span>参加人数よりも景品数が多い場合、この場で比較的価値の低い景品から景品プールから超過分を除外します。<br />除外した景品は、次回以降のイベントに持ち越します。</span>
                <span></span>
                <span>もし、除外対象の景品を今回の景品に含めてほしいという要望があれば、景品プール内の景品と交換します。</span>
                <span>運営側の都合となり大変恐れ入りますが、<br />食品やシーズンアイテムは優先的に景品プールに含めさせていただきます。<br />高額景品や人気景品は必ず景品プールに含みます。</span>
                <br />
                <span>当選番号を割り当てる処理には公平性を確保しています。<br />シャッフルに利用しているアルゴリズム: `Fisher-Yates shuffle`</span>
                <span>当選番号の処理に不正を疑う場合は、お手数をおかけしますがソースコードを解析してください。<br />ソースコードはGitHubのリポジトリ上で公開しています。</span>
                <a href="google">リポジトリへのリンク（GitHub）</a>
            </div>
        </div>
    );
};
export default InputForm;
