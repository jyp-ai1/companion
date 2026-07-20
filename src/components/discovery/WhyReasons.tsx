export function WhyReasons({
  reasons,
  title = "추천 이유",
  className = "",
  compact = false,
}: {
  reasons: string[];
  title?: string;
  className?: string;
  compact?: boolean;
}) {
  if (reasons.length === 0) return null;
  return (
    <div className={className}>
      {!compact && (
        <p className="mb-2 text-sm font-medium text-gray-700">{title}</p>
      )}
      <ul className={`space-y-1 ${compact ? "text-xs text-gray-500" : "text-sm text-gray-600"}`}>
        {reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
