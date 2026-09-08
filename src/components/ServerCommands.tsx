import React from 'react';

interface ServerCommandsProps {
  onCommand: (commandKey: string) => void;
  lastConfirmation?: string | null;
  disabled?: boolean;
}

export const ServerCommands: React.FC<ServerCommandsProps> = ({
  onCommand,
  lastConfirmation,
  disabled = false,
}) => {
  const commands = [
    {
      key: 'B',
      label: 'CAPTURE BACKGROUND',
      hotkey: 'B',
      variant: 'default',
    },
    {
      key: 'P',
      label: 'GENERATE PATH',
      hotkey: 'P',
      variant: 'default',
    },
    {
      key: 'SPACE',
      label: 'START / RUN',
      hotkey: 'SPACE',
      variant: 'default',
    },
    {
      key: 'X',
      label: 'EMERGENCY STOP',
      hotkey: 'X',
      variant: 'emergency', // Red styling as strictly specified
    },
    {
      key: 'S',
      label: 'SERVER START',
      hotkey: 'S',
      variant: 'default',
    },
    {
      key: 'R',
      label: 'RESET',
      hotkey: 'R',
      variant: 'default',
    },
  ];

  return (
    <div className="border border-black bg-white font-mono">
      {/* SECTION HEADER */}
      <div className="border-b border-black px-4 py-2.5 bg-neutral-100 flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-wider">SERVER COMMANDS</h2>
        <span className="text-[10px] text-neutral-500 uppercase">
          KEYBOARD SHORTCUTS ENABLED: [B] [P] [SPACE] [X] [S] [R]
        </span>
      </div>

      <div className="p-4">
        {/* BUTTONS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {commands.map((cmd) => {
            const isEmergency = cmd.variant === 'emergency';

            return (
              <button
                key={cmd.key}
                id={`btn-cmd-${cmd.key.toLowerCase()}`}
                type="button"
                disabled={disabled}
                onClick={() => onCommand(cmd.key)}
                className={`flex flex-col items-center justify-center p-3 border text-xs font-bold transition-colors cursor-pointer text-center ${
                  isEmergency
                    ? 'border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white active:bg-red-700'
                    : 'border-black bg-white text-black hover:bg-black hover:text-white active:bg-neutral-800'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="text-[10px] font-normal opacity-70 mb-0.5">
                  [{cmd.hotkey}]
                </span>
                <span className="tracking-wide uppercase leading-tight">
                  {cmd.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* CONFIRMATION / STATUS BANNER */}
        {lastConfirmation && (
          <div
            id="command-status-banner"
            className="mt-3 p-2 border border-black bg-neutral-100 text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold">LAST COMMAND STATUS:</span>
              <span>{lastConfirmation}</span>
            </div>
            <span className="text-[10px] text-neutral-500 uppercase">PROTOTYPE MODE</span>
          </div>
        )}
      </div>
    </div>
  );
};
