import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWatchlistStore } from '../store/uiStore';

const WatchlistPage = () => {
  const { watchlist, toggle } = useWatchlistStore();

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-6 h-6 text-red-400 fill-current" />
          <h1 className="text-3xl font-black">Watchlist</h1>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-24 text-zinc-500">
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">Your watchlist is empty</p>
            <p className="text-sm mt-1">Heart a company on any report to add it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {watchlist.map((ticker, i) => (
                <motion.div
                  key={ticker}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 flex items-center justify-between transition-all group"
                >
                  <div>
                    <span className="text-2xl font-black text-white">{ticker}</span>
                    <Link
                      to="/"
                      state={{ ticker }}
                      className="block text-xs text-emerald-400 mt-1 hover:text-emerald-300 transition-colors"
                    >
                      Analyze →
                    </Link>
                  </div>
                  <button
                    onClick={() => toggle(ticker)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-xl hover:bg-red-500/10"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WatchlistPage;
