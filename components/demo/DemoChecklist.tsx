'use client';

/**
 * Demo Checklist Component
 * Interactive checklist for demo presentations
 * Validates: Requirements 15.1, 15.3, 15.4
 */

import { useState, useEffect } from 'react';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { DEMO_FEATURES, type DemoFeature, getDemoProgress } from '@/lib/demoTesting';

interface DemoChecklistProps {
  onClose?: () => void;
}

export function DemoChecklist({ onClose }: DemoChecklistProps) {
  const [features, setFeatures] = useState<DemoFeature[]>(DEMO_FEATURES);
  const [progress, setProgress] = useState(getDemoProgress());

  useEffect(() => {
    setProgress(getDemoProgress());
  }, [features]);

  const toggleFeature = (featureName: string) => {
    setFeatures(prev =>
      prev.map(f =>
        f.name === featureName ? { ...f, tested: !f.tested } : f
      )
    );
  };

  const resetChecklist = () => {
    setFeatures(DEMO_FEATURES.map(f => ({ ...f, tested: false })));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Demo Checklist</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-white font-medium">
                {progress.tested} / {progress.total} ({progress.percentage}%)
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {features.map((feature, index) => (
            <div
              key={feature.name}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                feature.tested
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-white/5 border-border hover:border-primary/50'
              }`}
              onClick={() => toggleFeature(feature.name)}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    feature.tested
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-600'
                  }`}
                >
                  {feature.tested && <Check className="w-4 h-4 text-white" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className={`font-medium ${
                        feature.tested ? 'text-green-400' : 'text-white'
                      }`}
                    >
                      {feature.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-white/5 rounded">
                      {feature.path}
                    </span>
                  </div>
                  {feature.notes && (
                    <div className="mt-2 p-2 bg-white/5 rounded text-xs text-gray-400">
                      {feature.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border space-y-3">
          {/* Status */}
          {progress.percentage === 100 ? (
            <div className="flex items-center gap-2 text-green-400 bg-green-500/10 p-3 rounded-lg">
              <Check className="w-5 h-5" />
              <span className="font-medium">All features tested! Ready for demo.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">
                {progress.remaining.length} features remaining
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={resetChecklist}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
            >
              Reset Checklist
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Demo Timer Component
 * Helps track demo duration
 */
export function DemoTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const reset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-xl p-4 shadow-glow z-40">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-primary" />
        <div className="text-2xl font-mono font-bold text-white">
          {formatTime(seconds)}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1 bg-primary hover:bg-primary/90 text-white text-sm rounded-lg transition-colors"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={reset}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Demo Notes Component
 * Quick notes during presentation
 */
export function DemoNotes() {
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 left-4 px-4 py-2 bg-card border border-border rounded-lg text-white hover:bg-white/10 transition-colors z-40"
      >
        📝 Notes
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-card border border-border rounded-xl p-4 shadow-glow z-40 w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-white">Demo Notes</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Quick notes during demo..."
        className="w-full h-32 bg-white/5 border border-border rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-primary"
      />
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => setNotes('')}
          className="flex-1 px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg transition-colors"
        >
          Clear
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(notes);
          }}
          className="flex-1 px-3 py-1 bg-primary hover:bg-primary/90 text-white text-sm rounded-lg transition-colors"
        >
          Copy
        </button>
      </div>
    </div>
  );
}
