interface StatusAlertProps {
  message: string;
  maintenanceEnd?: string | null;
}

export function StatusAlert({ message, maintenanceEnd }: StatusAlertProps) {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
      <div className="flex items-start gap-3">
        <svg className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <p className="font-medium text-yellow-800 dark:text-yellow-200">{message}</p>
          {maintenanceEnd && (
            <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
              Expected to end: {new Date(maintenanceEnd).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
