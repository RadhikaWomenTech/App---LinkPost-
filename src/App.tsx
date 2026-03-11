/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  Layout, 
  Lightbulb, 
  Users, 
  Zap,
  RefreshCw
} from 'lucide-react';
import Markdown from 'react-markdown';
import { generateLinkedInPost } from './services/gemini';

const PRESET_TOPICS = [
  "First Principles Thinking in UI",
  "Jobs to be Done (JTBD) Framework",
  "Systems Thinking for Product Designers",
  "The Power of Emotional Design",
  "Designing for Accessibility first",
  "The Ethics of Dark Patterns"
];

export default function App() {
  const [topic, setTopic] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setCopied(false);

    try {
      const post = await generateLinkedInPost(topic);
      setGeneratedPost(post || '');
    } catch (err) {
      console.error(err);
      setError('Failed to generate post. Please check your connection or API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedPost) return;
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#5A5A40] selection:text-white">
      {/* Header */}
      <header className="border-b border-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#5A5A40] rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">LinkedIn Post Writer</h1>
          </div>
          <nav className="hidden sm:flex gap-6 text-sm font-medium opacity-60">
            <a href="#" className="hover:opacity-100 transition-opacity">Techniques</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Templates</a>
            <a href="#" className="hover:opacity-100 transition-opacity">History</a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-8">
            <section>
              <h2 className="text-4xl font-serif italic mb-4">Want to post on LinkedIn?</h2>
              <p className="text-[#5A5A40] opacity-80 leading-relaxed">
                Give your thoughts, and I can write the post for you.
              </p>
            </section>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="relative">
                <textarea
                  id="topic-input"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Share your thoughts or a design topic here..."
                  className="w-full h-32 p-4 bg-white border border-black/10 rounded-2xl focus:ring-2 focus:ring-[#5A5A40] focus:border-transparent outline-none transition-all resize-none shadow-sm"
                />
                <button
                  type="submit"
                  disabled={isLoading || !topic.trim()}
                  className="absolute bottom-4 right-4 bg-[#5A5A40] text-white p-2 rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg"
                >
                  {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </form>

            <section>
              <h3 className="text-xs uppercase tracking-widest font-semibold opacity-40 mb-4">Quick Ideas</h3>
              <div className="flex flex-wrap gap-2">
                {PRESET_TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className="px-3 py-1.5 bg-white border border-black/5 rounded-full text-sm hover:border-[#5A5A40] hover:text-[#5A5A40] transition-colors shadow-sm"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {generatedPost ? (
                <motion.div
                  key="post"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl border border-black/5 shadow-xl overflow-hidden"
                >
                  <div className="p-6 border-b border-black/5 flex items-center justify-between bg-[#FDFDFB]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5A5A40] to-[#8A8A60] flex items-center justify-center text-white font-bold">
                        D
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Your LinkedIn Draft</div>
                        <div className="text-[10px] uppercase tracking-wider opacity-40">Ready to post</div>
                      </div>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F0] hover:bg-[#E5E5E0] rounded-xl text-sm font-medium transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-8 prose prose-slate max-w-none">
                    <div className="markdown-body">
                      <Markdown>{generatedPost}</Markdown>
                    </div>
                  </div>
                  <div className="p-6 bg-[#FDFDFB] border-top border-black/5 flex gap-4">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                      ))}
                    </div>
                    <span className="text-xs opacity-40 italic">Liked by other designers...</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] rounded-3xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                    <Layout className="w-8 h-8 opacity-20" />
                  </div>
                  <h3 className="text-xl font-medium opacity-40 mb-2">Your post will appear here</h3>
                  <p className="text-sm opacity-30 max-w-[240px]">
                    Share your design thinking insights with your network every day.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100">
                {error}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-black/5 mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 opacity-40 text-xs uppercase tracking-widest font-semibold">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Community</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Fast Gen</span>
          </div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span>Insights</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Powered</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
