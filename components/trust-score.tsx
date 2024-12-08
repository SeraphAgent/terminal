interface TrustScoreProps {
  score: number;
}

export function TrustScore({ score }: TrustScoreProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-black/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-green-400 text-sm">{score.toFixed(1)}%</span>
    </div>
  );
}