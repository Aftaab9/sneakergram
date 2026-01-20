'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TrendingUp, Users } from 'lucide-react';

interface PollOption {
  id: string;
  sneaker: string;
  image: string;
  votes: number;
}

interface SneakerPollProps {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVote?: string;
  onVote: (optionId: string) => void;
}

export function SneakerPoll({
  question,
  options,
  totalVotes,
  userVote,
  onVote,
}: SneakerPollProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(userVote);

  const handleVote = (optionId: string) => {
    if (!selectedOption) {
      setSelectedOption(optionId);
      onVote(optionId);
    }
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      {/* Poll Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">{question}</h3>
      </div>

      {/* Poll Options */}
      <div className="space-y-3">
        {options.map(option => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOption === option.id;
          const isWinning = option.votes === Math.max(...options.map(o => o.votes)) && totalVotes > 0;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={!!selectedOption}
              className={`w-full relative overflow-hidden rounded-lg border transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : selectedOption
                  ? 'border-border bg-card cursor-default'
                  : 'border-border bg-card hover:border-gray-600 hover:bg-gray-900'
              }`}
            >
              {/* Progress Bar */}
              {selectedOption && (
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    isWinning ? 'bg-primary/20' : 'bg-gray-800/50'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              {/* Content */}
              <div className="relative flex items-center gap-3 p-3">
                {/* Sneaker Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                  <Image
                    src={option.image}
                    alt={option.sneaker}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>

                {/* Sneaker Name */}
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{option.sneaker}</p>
                  {selectedOption && (
                    <p className="text-sm text-gray-400 mt-1">
                      {percentage}% ({option.votes} votes)
                    </p>
                  )}
                </div>

                {/* Checkmark for selected */}
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Poll Footer */}
      <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
        <Users className="w-4 h-4" />
        <span>{totalVotes.toLocaleString()} votes</span>
        {!selectedOption && <span className="ml-auto text-primary">Tap to vote</span>}
      </div>
    </div>
  );
}
