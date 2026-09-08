import React from 'react';
import { DashboardState } from '../types';

interface LiveDataProps {
  state: DashboardState;
}

export const LiveData: React.FC<LiveDataProps> = ({ state }) => {
  const formatCoord = (coord: [number, number] | null) => {
    if (!coord) return '-';
    return `(${coord[0]}, ${coord[1]})`;
  };

  const rows = [
    {
      label: 'Coordinates Selected',
      value: formatCoord(state.selectedCoordinates),
      note: 'Operator target point',
    },
    {
      label: 'Start Coordinate',
      value: formatCoord(state.startCoordinate),
      note: 'Origin waypoint',
    },
    {
      label: 'Goal Point',
      value: formatCoord(state.goalPoint),
      note: 'Destination waypoint',
    },
    {
      label: 'Current Cell',
      value: formatCoord(state.currentCell),
      note: 'Grid position',
    },
    {
      label: 'Heading',
      value: `${state.heading.toFixed(1)}°`,
      note: 'Euler yaw angle',
    },
    {
      label: 'Obstacles Detected',
      value: state.obstacleCount.toString(),
      note: 'OpenCV contour count',
    },
    {
      label: 'Path Size',
      value: `${state.pathSize} cells`,
      note: 'A* computed route',
    },
    {
      label: 'Background',
      value: state.backgroundStatus,
      note: 'Camera calibration',
    },
    {
      label: 'Robot Status',
      value: state.robotStatus,
      note: state.robotStatus === 'RUNNING' ? 'In autonomous transit' : 'Stationary / standby',
      highlight: state.robotStatus === 'RUNNING',
    },
    {
      label: 'Connection',
      value: state.connectionStatus,
      note: 'Local network link',
    },
    {
      label: 'FPS',
      value: state.fps.toString(),
      note: 'CV processing rate',
    },
  ];

  return (
    <div className="border border-black bg-white font-mono flex flex-col h-full">
      {/* HEADER */}
      <div className="border-b border-black px-4 py-2.5 bg-neutral-100 flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-wider">LIVE DATA</h2>
        <span className="text-[10px] text-neutral-500 uppercase">TELEMETRY STREAM</span>
      </div>

      {/* TWO COLUMN LIST / TABLE */}
      <div className="p-0 flex-1 overflow-auto divide-y divide-neutral-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black bg-neutral-50 text-[10px] text-neutral-500 uppercase">
              <th className="py-2 px-3 font-semibold">Telemetry Parameter</th>
              <th className="py-2 px-3 font-semibold text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 text-xs">
            {rows.map((row) => (
              <tr
                key={row.label}
                className={`hover:bg-neutral-50 transition-colors ${
                  row.highlight ? 'bg-neutral-100 font-semibold' : ''
                }`}
              >
                <td className="py-2.5 px-3">
                  <div className="text-xs text-neutral-900 font-medium">{row.label}</div>
                  <div className="text-[10px] text-neutral-500">{row.note}</div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-black text-xs">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER NOTICE */}
      <div className="border-t border-black p-2 bg-neutral-50 text-[10px] text-neutral-500">
        // DATA SOURCE: LOCAL STATE / READY FOR PYTHON OPENCV
      </div>
    </div>
  );
};
