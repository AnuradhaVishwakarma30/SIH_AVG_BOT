import React, { useState, useEffect, useCallback } from 'react';
import { DashboardState, CommandLogEntry } from '../types';
import { Header } from './Header';
import { WorldMap } from './WorldMap';
import { LiveData } from './LiveData';
import { ServerCommands } from './ServerCommands';
import { CommandLog } from './CommandLog';
import { OperatorGuide } from './OperatorGuide';
import { sendCommand, VEHICLES } from '../services/api';

interface DashboardProps {
  state: DashboardState;
  onUpdateState: (updater: (prev: DashboardState) => DashboardState) => void;
  onChangeVehicle: () => void;
  onLogout: () => void;
  logs: CommandLogEntry[];
  onAddLog: (command: string, status: string, isError?: boolean) => void;
  onClearLogs: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  state,
  onUpdateState,
  onChangeVehicle,
  onLogout,
  logs,
  onAddLog,
  onClearLogs,
}) => {
  const [lastConfirmation, setLastConfirmation] = useState<string | null>(null);

  const activeVehicle = state.selectedCarId !== null ? VEHICLES[state.selectedCarId] : null;
  const vehicleName = activeVehicle ? activeVehicle.vehicleId : 'UNKNOWN';

  // Central command handler called by BOTH buttons and keyboard shortcuts
  const handleSendCommand = useCallback(
    async (commandKey: string) => {
      const upperKey = commandKey.toUpperCase();
      try {
        const res = await sendCommand(upperKey, state.selectedCarId);

        // Apply state updates depending on command
        onUpdateState((prev) => {
          let updated = { ...prev };

          if (res.robotStatusChange) {
            updated.robotStatus = res.robotStatusChange;
          }

          if (res.backgroundStatusChange) {
            updated.backgroundStatus = res.backgroundStatusChange;
          }

          if (upperKey === 'P') {
            // Recalculate / reaffirm path size
            updated.pathSize = updated.path.length;
          }

          if (upperKey === 'R') {
            // Reset to defaults
            updated.robotStatus = 'STOPPED';
            updated.backgroundStatus = 'Not Captured';
            updated.selectedCoordinates = updated.startCoordinate;
          }

          return updated;
        });

        const statusText = res.message;
        setLastConfirmation(`[${upperKey}] ${statusText}`);
        onAddLog(upperKey, statusText, upperKey === 'X');
      } catch (err: any) {
        const errorText = err?.message || 'Command failed';
        setLastConfirmation(`[${upperKey}] ERROR: ${errorText}`);
        onAddLog(upperKey, `ERROR: ${errorText}`, true);
      }
    },
    [state.selectedCarId, onUpdateState, onAddLog]
  );

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }

      const key = e.key.toUpperCase();

      if (key === 'B') {
        e.preventDefault();
        handleSendCommand('B');
      } else if (key === 'P') {
        e.preventDefault();
        handleSendCommand('P');
      } else if (e.code === 'Space' || key === ' ') {
        e.preventDefault();
        handleSendCommand('SPACE');
      } else if (key === 'X') {
        e.preventDefault();
        handleSendCommand('X');
      } else if (key === 'S') {
        e.preventDefault();
        handleSendCommand('S');
      } else if (key === 'R') {
        e.preventDefault();
        handleSendCommand('R');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSendCommand]);

  // World Map Cell Click (select coordinate)
  const handleCellClick = (x: number, y: number) => {
    onUpdateState((prev) => ({
      ...prev,
      selectedCoordinates: [x, y],
    }));
    onAddLog('SELECT', `Selected target coordinate (${x}, ${y})`);
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-black font-mono flex flex-col">
      {/* HEADER */}
      <Header
        selectedCarId={state.selectedCarId !== null ? state.selectedCarId : 1}
        onChangeVehicle={onChangeVehicle}
        onLogout={onLogout}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4">
        {/* TOP ROW: WORLD MAP (65-70%) + LIVE DATA (30-35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* WORLD MAP */}
          <div className="lg:col-span-8 flex flex-col">
            <WorldMap state={state} onCellClick={handleCellClick} />
          </div>

          {/* LIVE DATA */}
          <div className="lg:col-span-4 flex flex-col">
            <LiveData state={state} />
          </div>
        </div>

        {/* SERVER COMMANDS */}
        <section aria-label="Server Commands">
          <ServerCommands
            onCommand={handleSendCommand}
            lastConfirmation={lastConfirmation}
          />
        </section>

        {/* COMMAND LOG */}
        <section aria-label="Command Log">
          <CommandLog logs={logs} onClearLogs={onClearLogs} />
        </section>

        {/* OPERATOR GUIDE */}
        <section aria-label="Operator Guide">
          <OperatorGuide />
        </section>
      </main>

    
    </div>
  );
};
