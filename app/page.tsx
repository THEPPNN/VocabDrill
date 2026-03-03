"use client";

import { useState } from "react";
import vocabData from "@/data/vocabulary.json";

type WordEntry = {
  word: string;
  type: string;
  similar: string[];
  translation: string;
  examples: string[];
};

type VocabSet = "ox5000" | "daily_life_sentences";

const setLabels: Record<VocabSet, string> = {
  ox5000: "Oxford Vocabulary",
  daily_life_sentences: "500 Daily Life Sentences"
};
export default function VocabPage() {
  const [selectedSet, setSelectedSet] = useState<string>("ox5000");
  const [openIds, setOpenIds] = useState<Set<string | number>>(new Set());

  const words: WordEntry[] = (vocabData as any)[selectedSet] || [];

  const toggleWord = (id: string | number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSet(e.target.value);
    setOpenIds(new Set());
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">📖 VocabDrill</h1>
            <p className="text-sm text-white/40 mt-1">ฝึกภาษาอังกฤษ</p>
          </div>

          <div className="relative">
            <select
              value={selectedSet}
              onChange={handleSetChange}
              className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-lg px-4 py-2 pr-9 focus:outline-none cursor-pointer"
            >
              <option value="ox5000">Oxford Vocabulary</option>
              <option value="daily_life_sentences">Daily Sentences</option>
            </select>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 pt-5 pb-2">
        <p className="text-xs text-white/30 uppercase tracking-widest">
          {setLabels[selectedSet] || selectedSet} — {words.length} รายการ
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-3">
        {words.map((entry, index) => {
          // ใช้ id ถ้ามี ถ้าไม่มีใช้ index แทน เพื่อกัน Error Key ซ้ำ
          const uniqueKey = entry.id ?? index;
          const isOpen = openIds.has(uniqueKey);

          // จัดการเรื่อง similar ที่อาจเป็น string หรือ array
          const similarText = Array.isArray(entry.similar)
            ? entry.similar.join(" · ")
            : entry.similar;

          return (
            <div key={uniqueKey} className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
              <div className="flex items-center justify-between px-5 py-4 hover:bg-white/10 transition-colors">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-lg font-semibold text-white tracking-wide">
                    {index + 1}. {entry.word}
                  </span>

                  {/* แสดง Type เฉพาะเมื่อมีข้อมูล */}
                  {entry.type && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${entry.type === "verb" ? "text-emerald-400 bg-emerald-400/10" :
                        entry.type === "noun" ? "text-yellow-400 bg-yellow-400/10" :
                          "text-red-400 bg-red-400/10"
                      }`}>
                      {entry.type}
                    </span>
                  )}

                  {similarText && (
                    <span className="text-xs text-white/30 hidden sm:inline">
                      {similarText}
                    </span>
                  )}
                </div>

                {!entry.id && (
                     <button
                     onClick={() => toggleWord(uniqueKey)}
                     className={`ml-4 shrink-0 text-xs font-medium px-4 py-1.5 rounded-full border transition-all ${isOpen ? "bg-white text-black" : "border-white/20 text-white/60"
                       }`}
                   >
                     {isOpen ? "ซ่อน" : "แปล"}
                   </button>
                )}
              
              </div>

              {/* ส่วนแสดงเนื้อหาเมื่อกดเปิด */}
              {isOpen && (
                <div className="px-5 py-4 bg-white/5 border-t border-white/10 space-y-4">
                  {/* แสดงคำแปล (รองรับทั้ง field translation หรือ similar ในกรณีประโยค) */}
                  <div>
                    <p className="text-xs text-white/30 uppercase mb-1">ความหมาย</p>
                    <p className="text-base text-yellow-300 font-medium">
                      {entry.translation || similarText || "ไม่มีคำแปล"}
                    </p>
                  </div>

                  {/* แสดงตัวอย่างเฉพาะเมื่อมีข้อมูล */}
                  {entry.examples && entry.examples.length > 0 && (
                    <div>
                      <p className="text-xs text-white/30 uppercase mb-2">ตัวอย่าง</p>
                      <ul className="space-y-2">
                        {entry.examples.map((ex, i) => (
                          <li key={i} className="flex gap-3 text-sm text-white/70">
                            <span className="text-white/20">{i + 1}.</span>
                            <span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}