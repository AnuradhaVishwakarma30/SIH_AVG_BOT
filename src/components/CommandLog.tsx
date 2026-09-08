import React, { useRef, useEffect } from 'react';
import { CommandLogEntry } from '../types';

interface CommandLogProps {
  logs: CommandLogEntry[];
  onClearLogs: () => void;
}

export const CommandLog: React.FC<CommandLogProps> = ({ logs, onClearLogs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of log when new entry arrives
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="border border-black bg-white font-mono">
      {/* HEADER */}
      <div className="border-b border-black px-4 py-2.5 bg-neutral-100 flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-wider">COMMAND LOG</h2>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-neutral-500 uppercase">
            {logs.length} ENTRIES
          </span>
          <button
            id="clear-log-btn"
            onClick={onClearLogs}
            className="text-[10px] uppercase border border-black px-2 py-0.5 bg-white hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            CLEAR LOG
          </button>
        </div>
      </div>

      {/* SCROLLABLE LOG LIST */}
      <div
        ref={logContainerRef}
        className="h-44 overflow-y-auto p-3 text-xs divide-y divide-neutral-200 bg-neutral-50 font-mono"
      >
        {logs.length === 0 ? (
          <div className="text-neutral-500 text-xs py-4 text-center">
            No command log entries recorded.
          </div>
        ) : (
          logs.map((entry) => {
            const isEmergencyOrError = entry.isError || entry.command === 'X';

            return (
              <div
                key={entry.id}
                className={`py-1.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 ${
                  isEmergencyOrError ? 'text-red-600 bg-red-50 px-1 border-l-2 border-red-600' : 'text-black'
                }`}
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-neutral-500 text-[11px]">{entry.timestamp}</span>
                  <span className="text-neutral-400">|</span>
                  <span className="font-bold text-[11px] px-1 bg-white border border-neutral-300">
                    {entry.vehicle}
                  </span>
                  <span className="text-neutral-400">|</span>
                  <span className="font-bold text-[11px] min-w-[36px]">
                    {entry.command}
                  </span>
                  <span className="text-neutral-400">|</span>
                </div>
                <div className="truncate text-xs font-medium">
                  {entry.status}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-black px-3 py-1.5 bg-white text-[10px] text-neutral-500 flex justify-between">
        <span>Format: [TIMESTAMP] | [VEHICLE] | [COMMAND] | [RESULT]</span>
        <span>AUTONOMOUS MOBILE ROBOT TELEMETRY LOGGER</span>
      </div>
    </div>
  );
};
