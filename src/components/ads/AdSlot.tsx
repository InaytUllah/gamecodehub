interface AdSlotProps {
  slot: string;
  className?: string;
}

export function AdSlot({ slot, className = "" }: AdSlotProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-800/50 ${className}`}
      data-ad-slot={slot}
    >
      Ad Space ({slot})
    </div>
  );
}
