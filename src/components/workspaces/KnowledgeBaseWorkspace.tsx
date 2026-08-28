import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Sparkles,
  ChevronRight,
  Tag,
} from "lucide-react";
import {
  CompanyProfile,
  ORBI_ECOSYSTEM_KNOWLEDGE_ITEMS,
  OrbiKnowledgeItem,
  ORBI_KNOWLEDGE_CATEGORY_LABELS,
  buildOrbiKnowledgeBaseSummary,
  answerFromOrbiKnowledgeBase,
} from "../../data";

interface KnowledgeBaseWorkspaceProps {
  companyProfile: CompanyProfile;
}

export const KnowledgeBaseWorkspace: React.FC<KnowledgeBaseWorkspaceProps> = ({
  companyProfile,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArticle, setSelectedArticle] = useState<OrbiKnowledgeItem>(
    ORBI_ECOSYSTEM_KNOWLEDGE_ITEMS[0]
  );
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswerResult, setAiAnswerResult] = useState<any>(null);

  const kbSummary = React.useMemo(
    () => buildOrbiKnowledgeBaseSummary(ORBI_ECOSYSTEM_KNOWLEDGE_ITEMS),
    []
  );

  const filteredArticles = ORBI_ECOSYSTEM_KNOWLEDGE_ITEMS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shortAnswer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.detailedAnswer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleTestAiQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    const result = answerFromOrbiKnowledgeBase(aiQuestion, "short");
    setAiAnswerResult(result);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <span>Knowledge Base &bull; Base de Conocimiento Inteligente</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Artículos, preguntas frecuentes y directrices de respuesta automatizada para {companyProfile.companyName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            {kbSummary.total} Artículos Indexados
          </span>
        </div>
      </div>

      {/* Semantic QA Testing Sandbox */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Motor de Búsqueda y Recuperación Semántica</span>
        </h3>

        <form onSubmit={handleTestAiQuery} className="flex gap-2">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="Pregunta de prueba (ej: ¿Cuáles son las directrices de seguridad o qué servicios ofrece la empresa?)..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl transition"
          >
            Consultar Base
          </button>
        </form>

        {aiAnswerResult && (
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase block">
              Respuesta Recuperada (Status: {aiAnswerResult.status})
            </span>
            <p className="text-slate-200 leading-relaxed font-sans">
              {aiAnswerResult.answerText}
            </p>
            {aiAnswerResult.matchedItem && (
              <p className="text-[11px] text-slate-400 font-mono">
                Artículo coincidente: <span className="text-cyan-300">{aiAnswerResult.matchedItem.title}</span> (Score: {aiAnswerResult.matchScore})
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main Grid: Articles Catalog + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Search & Article List */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar artículos..."
                className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="all">Todas</option>
              {Object.entries(ORBI_KNOWLEDGE_CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-2 space-y-1.5 max-h-[500px] overflow-y-auto">
            {filteredArticles.map((art) => {
              const isSelected = selectedArticle?.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className={`p-3 rounded-xl cursor-pointer border transition ${
                    isSelected
                      ? "bg-cyan-500/10 border-cyan-500/40 text-white"
                      : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{art.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                    {art.shortAnswer}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {ORBI_KNOWLEDGE_CATEGORY_LABELS[art.category]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Article Detail Card */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4 shadow-xl">
          {selectedArticle ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                    {ORBI_KNOWLEDGE_CATEGORY_LABELS[selectedArticle.category]}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {selectedArticle.title}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  ID: {selectedArticle.id}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  Respuesta Rápida
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.shortAnswer}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  Respuesta Detallada
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.detailedAnswer}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  Palabras Clave Canónicas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedArticle.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-cyan-400" />
                      <span>{kw}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-12">
              Selecciona un artículo para ver su contenido completo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
