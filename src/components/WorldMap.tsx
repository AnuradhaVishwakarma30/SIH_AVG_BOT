import React, { useState } from 'react';
import { DashboardState } from '../types';

interface WorldMapProps {
  state: DashboardState;
  onCellClick?: (x: number, y: number) => void;
}

const GRID_SIZE = 30; // 30 x 30 grid

export const WorldMap: React.FC<WorldMapProps> = ({ state, onCellClick }) => {
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);

  const {
    selectedCarId,
    ip,
    pathSize,
    robotStatus,
    backgroundStatus,
    currentCell,
    heading,
    startCoordinate,
    goalPoint,
    path,
    obstacles,
    selectedCoordinates,
  } = state;

  // Build coordinate sets for quick O(1) cell lookup
  const pathSet = new Set(path.map(([x, y]) => `${x},${y}`));
  const obstacleSet = new Set(obstacles.map(([x, y]) => `${x},${y}`));

  const isRobot = (x: number, y: number) =>
    currentCell && currentCell[0] === x && currentCell[1] === y;
  const isStart = (x: number, y: number) =>
    startCoordinate && startCoordinate[0] === x && startCoordinate[1] === y;
  const isGoal = (x: number, y: number) =>
    goalPoint && goalPoint[0] === x && goalPoint[1] === y;
  const isSelected = (x: number, y: number) =>
    selectedCoordinates && selectedCoordinates[0] === x && selectedCoordinates[1] === y;

  // Render SVG or Canvas. An SVG gives vector precision, accessible DOM, and zero blur on all displays.
  const cellSize = 18; // 18px * 30 = 540px width/height + coordinate gutters
  const gutter = 24;
  const totalWidth = GRID_SIZE * cellSize + gutter;
  const totalHeight = GRID_SIZE * cellSize + gutter;

  return (
    <div className="border border-black bg-white font-mono flex flex-col h-full">
      {/* SECTION HEADER */}
      <div className="border-b border-black px-4 py-2.5 bg-neutral-100 flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-wider">
          WORLD MAP (30 × 30 OPENCV ENVIRONMENT GRID)
        </h2>
        {hoveredCell ? (
          <div className="text-[11px] text-black font-semibold">
            CURSOR: ({hoveredCell[0]}, {hoveredCell[1]})
          </div>
        ) : (
          <div className="text-[11px] text-neutral-500">
            CLICK CELL TO INSPECT COORDINATE
          </div>
        )}
      </div>

      {/* TOP WORLD MAP DATA BAR (Section 8) */}
      <div className="border-b border-black p-3 bg-white grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        <div className="border border-neutral-300 p-2 bg-neutral-50">
          <div className="text-[10px] text-neutral-500 uppercase">SELECTED BOT</div>
          <div className="font-bold text-sm">{selectedCarId !== null ? selectedCarId : '-'}</div>
        </div>

        <div className="border border-neutral-300 p-2 bg-neutral-50">
          <div className="text-[10px] text-neutral-500 uppercase">IP</div>
          <div className="font-bold text-xs truncate">{ip || '192.168.1.50'}</div>
        </div>

        <div className="border border-neutral-300 p-2 bg-neutral-50">
          <div className="text-[10px] text-neutral-500 uppercase">PATH</div>
          <div className="font-bold text-sm">{pathSize} CELLS</div>
        </div>

        <div className="border border-neutral-300 p-2 bg-neutral-50">
          <div className="text-[10px] text-neutral-500 uppercase">STATUS</div>
          <div
            className={`font-bold text-sm ${
              robotStatus === 'RUNNING' ? 'text-black' : 'text-neutral-700'
            }`}
          >
            {robotStatus}
          </div>
        </div>

        <div className="border border-neutral-300 p-2 bg-neutral-50 col-span-2 sm:col-span-1">
          <div className="text-[10px] text-neutral-500 uppercase">BACKGROUND</div>
          <div className="font-bold text-xs truncate uppercase">
            {backgroundStatus}
          </div>
        </div>
      </div>

      {/* 30x30 GRID DISPLAY */}
      <div className="p-3 flex-1 flex flex-col items-center justify-center overflow-auto bg-neutral-50">
        <div className="inline-block border border-black bg-white p-2 shadow-none">
          <svg
            width={totalWidth}
            height={totalHeight}
            className="block select-none cursor-crosshair"
            aria-label="30x30 World Map Grid"
          >
            {/* Top axis coordinate labels */}
            {Array.from({ length: 7 }).map((_, i) => {
              const val = i === 6 ? 29 : i * 5;
              const xPos = gutter + val * cellSize + cellSize / 2;
              return (
                <text
                  key={`top-axis-${val}`}
                  x={xPos}
                  y={14}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="monospace"
                  fill="#666"
                >
                  {val}
                </text>
              );
            })}

            {/* Left axis coordinate labels */}
            {Array.from({ length: 7 }).map((_, i) => {
              const val = i === 6 ? 29 : i * 5;
              const yPos = gutter + val * cellSize + cellSize / 2 + 3;
              return (
                <text
                  key={`left-axis-${val}`}
                  x={14}
                  y={yPos}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="monospace"
                  fill="#666"
                >
                  {val}
                </text>
              );
            })}

            {/* Grid cells */}
            <g transform={`translate(${gutter}, ${gutter})`}>
              {/* Background grid lines */}
              {Array.from({ length: GRID_SIZE }).map((_, r) =>
                Array.from({ length: GRID_SIZE }).map((_, c) => {
                  const key = `${c},${r}`;
                  const isObstacle = obstacleSet.has(key);
                  const isPathNode = pathSet.has(key);
                  const isCurRobot = isRobot(c, r);
                  const isStartPoint = isStart(c, r);
                  const isGoalPoint = isGoal(c, r);
                  const isSelectedCell = isSelected(c, r);

                  // Base cell fill
                  let fill = '#ffffff';
                  if (isObstacle) fill = '#111111';
                  else if (isPathNode) fill = '#e5e5e5';
                  else if (isSelectedCell) fill = '#d4d4d4';

                  return (
                    <g
                      key={`cell-${c}-${r}`}
                      onClick={() => onCellClick && onCellClick(c, r)}
                      onMouseEnter={() => setHoveredCell([c, r])}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <rect
                        x={c * cellSize}
                        y={r * cellSize}
                        width={cellSize}
                        height={cellSize}
                        fill={fill}
                        stroke="#d4d4d4"
                        strokeWidth="0.75"
                      />

                      {/* Path waypoint indicator dot */}
                      {isPathNode && !isObstacle && !isCurRobot && !isStartPoint && !isGoalPoint && (
                        <circle
                          cx={c * cellSize + cellSize / 2}
                          cy={r * cellSize + cellSize / 2}
                          r={2}
                          fill="#666666"
                        />
                      )}

                      {/* Selected cell crosshair box */}
                      {isSelectedCell && !isCurRobot && !isStartPoint && !isGoalPoint && (
                        <rect
                          x={c * cellSize + 2}
                          y={r * cellSize + 2}
                          width={cellSize - 4}
                          height={cellSize - 4}
                          fill="none"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* Start Point Marker [ S ] */}
                      {isStartPoint && (
                        <g>
                          <rect
                            x={c * cellSize + 1.5}
                            y={r * cellSize + 1.5}
                            width={cellSize - 3}
                            height={cellSize - 3}
                            fill="#000000"
                          />
                          <text
                            x={c * cellSize + cellSize / 2}
                            y={r * cellSize + cellSize / 2 + 3.5}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="bold"
                            fill="#ffffff"
                          >
                            S
                          </text>
                        </g>
                      )}

                      {/* Goal Point Marker [ G ] */}
                      {isGoalPoint && (
                        <g>
                          <rect
                            x={c * cellSize + 1.5}
                            y={r * cellSize + 1.5}
                            width={cellSize - 3}
                            height={cellSize - 3}
                            fill="#000000"
                          />
                          <text
                            x={c * cellSize + cellSize / 2}
                            y={r * cellSize + cellSize / 2 + 3.5}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="bold"
                            fill="#ffffff"
                          >
                            G
                          </text>
                        </g>
                      )}

                      {/* Robot Marker [ R → ] with heading */}
                      {isCurRobot && (
                        <g
                          transform={`translate(${c * cellSize + cellSize / 2}, ${
                            r * cellSize + cellSize / 2
                          }) rotate(${heading})`}
                        >
                          <circle r={cellSize / 2 - 1.5} fill="#000000" />
                          {/* Heading arrow pointing along 0 deg (right) */}
                          <polygon
                            points={`0,-4 7,0 0,4`}
                            fill="#ffffff"
                          />
                          <circle cx="-1" cy="0" r="1" fill="#ffffff" />
                        </g>
                      )}
                    </g>
                  );
                })
              )}

              {/* Path polyline connecting waypoints */}
              {path.length > 1 && (
                <polyline
                  points={path
                    .map(([px, py]) => `${px * cellSize + cellSize / 2},${py * cellSize + cellSize / 2}`)
                    .join(' ')}
                  fill="none"
                  stroke="#555555"
                  strokeWidth="1.25"
                  strokeDasharray="3 2"
                />
              )}
            </g>
          </svg>
        </div>
      </div>

      {/* MAP LEGEND */}
      <div className="border-t border-black p-2.5 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-4 bg-black text-white text-[9px] font-bold text-center leading-4">
              R
            </span>
            <span>Robot ({currentCell ? `${currentCell[0]},${currentCell[1]}` : '-'}) {heading.toFixed(1)}°</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-4 bg-black text-white text-[9px] font-bold text-center leading-4">
              S
            </span>
            <span>Start ({startCoordinate ? `${startCoordinate[0]},${startCoordinate[1]}` : '-'})</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-4 bg-black text-white text-[9px] font-bold text-center leading-4">
              G
            </span>
            <span>Goal ({goalPoint ? `${goalPoint[0]},${goalPoint[1]}` : '-'})</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-4 bg-black border border-black"></span>
            <span>Obstacle ({obstacles.length})</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-4 bg-neutral-200 border border-neutral-400"></span>
            <span>A* Path ({path.length} cells)</span>
          </div>
        </div>

        <div className="text-[10px] text-neutral-500 uppercase">
          Grid: 30×30 [0..29]
        </div>
      </div>
    </div>
  );
};
