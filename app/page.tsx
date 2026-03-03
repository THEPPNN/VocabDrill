"use client";

import { useState } from "react";
import vocabData from "@/data/vocabulary.json";

// เพิ่ม Interface สำหรับรองรับ id ที่อาจจะมีหรือไม่มี
type WordEntry = {
  id?: string | number; // เพิ่ม id เข้าไปตรงนี้
  word: string;
  type: string;
  similar: string | string[];
  translation: string;
  examples: string[];
};

type VocabSet = "ox5000" | "daily_life_sentences";

const setLabels: Record<VocabSet, string> = {
  ox5000: "Oxford Vocabulary",
  daily_life_sentences: "500 Daily Life Sentences"
};

export default function VocabPage() {
  // แก้ไขจุดที่ 1: กำหนด Type ให้ State เลย
  const [selectedSet, setSelectedSet] = useState<VocabSet>("ox5000");
  const [openIds, setOpenIds] = useState<Set<string | number>>(new Set());

  const words: WordEntry[] = (vocabData as any)[selectedSet] || [];

  const toggleWord = (id: string | number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // แก้ไขจุดที่ 2: ใช้ Type Assertion ตอนรับค่าจาก Select
  const handleSetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSet(e.target.value as VocabSet);
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
              className="appearance-none bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-lg px-4 py-2 pr-9 focus:outline-none cursor-pointer"
            >
              <option value="ox5000">Oxford Vocabulary</option>
              <option value="daily_life_sentences">Daily Sentences</option>
            </select>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 pt-5 pb-2">
        <p className="text-xs text-white/30 uppercase tracking-widest">
          {/* ตอนนี้ TypeScript จะไม่ฟ้องบรรทัดนี้แล้วเพราะ selectedSet เป็น VocabSet แล้ว */}
          {setLabels[selectedSet]} — {words.length} รายการ
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-3">
        {words.map((entry, index) => {
          const uniqueKey = entry.id ?? index;
          const isOpen = openIds.has(uniqueKey);

          const similarText = Array.isArray(entry.similar)
            ? entry.similar.join(" · ")
            : entry.similar;

          return (
            <div key={uniqueKey} className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
              <div 
                className="flex items-center justify-between px-5 py-4 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => toggleWord(uniqueKey)}
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-lg font-semibold text-white tracking-wide">
                    {index + 1}. {entry.word}
                  </span>

                  {entry.type && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      entry.type === "verb" ? "text-emerald-400 bg-emerald-400/10" :
                      entry.type === "noun" ? "text-yellow-400 bg-yellow-400/10" :
                      "text-red-400 bg-red-400/10"
                    }`}>
                      {entry.type}
                    </span>
                  )}

                  {similarText && !isOpen && (
                    <span className="text-xs text-white/30 hidden sm:inline italic">
                      {similarText.length > 30 ? similarText.substring(0, 30) + "..." : similarText}
                    </span>
                  )}
                </div>

                <button
                  className={`ml-4 shrink-0 text-xs font-medium px-4 py-1.5 rounded-full border transition-all ${
                    isOpen ? "bg-white text-black" : "border-white/20 text-white/60"
                  }`}
                >
                  {isOpen ? "ซ่อน" : "แปล"}
                </button>
              </div>

              {isOpen && (
                <div className="px-5 py-4 bg-white/5 border-t border-white/10 space-y-4 animate-in fade-in duration-300">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">ความหมาย</p>
                    <p className="text-base text-yellow-300 font-medium">
                      {entry.translation || similarText || "ไม่มีคำแปล"}
                    </p>
                  </div>

                  {entry.examples && entry.examples.length > 0 && (
                    <div>
                      <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-2">ตัวอย่าง</p>
                      <ul className="space-y-2">
                        {entry.examples.map((ex, i) => (
                          <li key={i} className="flex gap-3 text-sm text-white/70 leading-relaxed">
                            <span className="text-white/20 font-mono">{i + 1}.</span>
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