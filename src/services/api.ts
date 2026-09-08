/**
 * API Service Layer for Autonomous Mobile Robot / AGV System
 * 
 * ==============================================================================
 * FUTURE BACKEND INTEGRATION HERE
 * ==============================================================================
 * This module isolates all communication with the Python + OpenCV server.
 * The UI components call the functions exported below, keeping backend logic
 * decoupled from UI rendering.
 * 
 * TO CONNECT YOUR EXISTING PYTHON + OPENCV SERVER:
 * 
 * 1. HTTP API ENDPOINTS:
 *    - Base URL: Configure your server address (e.g., http://localhost:5000 or http://192.168.1.X:8000)
 *    - Commands: POST /api/command { command: 'B' | 'P' | 'SPACE' | 'X' | 'S' | 'R', vehicleId: 0 | 1 }
 *    - Telemetry: GET /api/telemetry?vehicleId={0|1}
 * 
 * 2. WEBSOCKET STREAMING (OpenCV Video / Realtime Telemetry):
 *    - Connect to ws://<server-ip>:<port>/ws/telemetry
 *    - Listen for frame events, robot position [x, y], heading, and obstacle grid matrices.
 *    - Call updateRobotPosition(data), updatePath(data), updateObstacles(data).
 * 
 * 3. NO FAKE WEBSOCKET:
 *    - In prototype mode, this file returns local deterministic mock data.
 *    - Real network socket calls will replace the mock responses below.
 * ==============================================================================
 */

import { DashboardState, VehicleInfo } from '../types';

export const VEHICLES: Record<number, VehicleInfo> = {
  1: {
    name: 'CAR 1',
    vehicleId: 'CAR-01',
    backendId: 1,
    status: 'READY',
    ip: '192.168.1.50',
  },
  0: {
    name: 'CAR 2',
    vehicleId: 'CAR-02',
    backendId: 0,
    status: 'READY',
    ip: '192.168.1.51',
  },
};

// Initial mock path (30x30 coordinate system) for Car 1
const MOCK_PATH_CAR_1: [number, number][] = [
  [29, 29], [28, 28], [27, 27], [26, 26], [25, 25],
  [24, 24], [23, 23], [22, 22], [21, 21], [20, 20],
  [19, 19], [18, 18], [17, 18], [16, 18], [15, 18],
  [14, 18], [13, 19], [12, 20], [10, 22], [8, 24],
  [6, 26], [5, 28], [4, 29]
];

const MOCK_OBSTACLES_CAR_1: [number, number][] = [
  [16, 12],
  [17, 12],
  [18, 12],
  [10, 15],
  [11, 15],
  [22, 8],
];

// Initial mock path for Car 2
const MOCK_PATH_CAR_2: [number, number][] = [
  [28, 2], [26, 4], [24, 6], [22, 8], [20, 10],
  [18, 12], [16, 14], [14, 16], [12, 18], [10, 20],
  [8, 22], [6, 24], [5, 25]
];

const MOCK_OBSTACLES_CAR_2: [number, number][] = [
  [12, 10],
  [13, 10],
  [20, 18],
];

/**
 * Get initial dashboard state for selected vehicle
 */
export function getInitialDashboardState(vehicleId: number): DashboardState {
  if (vehicleId === 1) {
    return {
      selectedCarId: 1,
      selectedCoordinates: [29, 34],
      startCoordinate: [29, 34],
      goalPoint: [4, 30],
      currentCell: [18, 8],
      heading: 44.8,
      obstacleCount: 3,
      pathSize: 23,
      backgroundStatus: 'Captured',
      robotStatus: 'STOPPED',
      connectionStatus: 'ONLINE',
      fps: 30,
      path: MOCK_PATH_CAR_1,
      obstacles: MOCK_OBSTACLES_CAR_1,
      ip: VEHICLES[1].ip,
    };
  }

  // Car 2 (Backend ID 0)
  return {
    selectedCarId: 0,
    selectedCoordinates: [28, 2],
    startCoordinate: [28, 2],
    goalPoint: [5, 25],
    currentCell: [18, 12],
    heading: 92.5,
    obstacleCount: 3,
    pathSize: 13,
    backgroundStatus: 'Not Captured',
    robotStatus: 'STOPPED',
    connectionStatus: 'ONLINE',
    fps: 30,
    path: MOCK_PATH_CAR_2,
    obstacles: MOCK_OBSTACLES_CAR_2,
    ip: VEHICLES[0].ip,
  };
}

/**
 * Select vehicle
 * FUTURE BACKEND INTEGRATION:
 * Make an HTTP request or send WebSocket frame to notify Python server of active vehicle
 */
export async function selectVehicle(vehicleId: number): Promise<{ success: boolean; vehicle: VehicleInfo }> {
  // FUTURE: await fetch(`/api/vehicles/select`, { method: 'POST', body: JSON.stringify({ vehicleId }) })
  const vehicle = VEHICLES[vehicleId];
  if (!vehicle) {
    throw new Error(`Invalid vehicle ID: ${vehicleId}`);
  }
  return { success: true, vehicle };
}

/**
 * Send command to Python/OpenCV robot server
 * Command keys:
 *   B: Capture Background
 *   P: Generate Path
 *   SPACE: Start / Run
 *   X: Emergency Stop
 *   S: Server Start
 *   R: Reset
 * 
 * FUTURE BACKEND INTEGRATION:
 * Send POST /api/command or WebSocket packet:
 * ws.send(JSON.stringify({ type: 'COMMAND', command, vehicleId }));
 */
export async function sendCommand(
  command: string,
  vehicleId: number | null
): Promise<{ success: boolean; message: string; robotStatusChange?: 'STOPPED' | 'RUNNING'; backgroundStatusChange?: 'Captured' | 'Not Captured' }> {
  // Standardized logging description
  const commandMap: Record<string, { desc: string; robotStatus?: 'STOPPED' | 'RUNNING'; bgStatus?: 'Captured' | 'Not Captured' }> = {
    B: { desc: 'Background captured', bgStatus: 'Captured' },
    P: { desc: 'Path generated' },
    SPACE: { desc: 'Autonomous run started', robotStatus: 'RUNNING' },
    X: { desc: 'Emergency Stop', robotStatus: 'STOPPED' },
    S: { desc: 'Server started' },
    R: { desc: 'System reset to defaults', robotStatus: 'STOPPED', bgStatus: 'Not Captured' },
  };

  const action = commandMap[command] || { desc: `Executed command [${command}]` };

  // In prototype mode: simulated local response
  return {
    success: true,
    message: action.desc,
    robotStatusChange: action.robotStatus,
    backgroundStatusChange: action.bgStatus,
  };
}

/**
 * Fetch latest telemetry for vehicle
 * FUTURE BACKEND INTEGRATION:
 * Poll HTTP endpoint or attach to WebSocket onmessage handler.
 */
export async function getTelemetry(vehicleId: number): Promise<Partial<DashboardState>> {
  // FUTURE: const res = await fetch(`/api/telemetry?vehicleId=${vehicleId}`); return res.json();
  return getInitialDashboardState(vehicleId);
}

/**
 * Callback placeholder for dynamic map updates from OpenCV
 * FUTURE BACKEND INTEGRATION:
 * Pass parsed frame matrix data or grid occupancy grid into state.
 */
export function updateMap(data: any): void {
  // FUTURE: Parse occupancy grid from Python OpenCV server
  console.log('[API placeholder] updateMap received:', data);
}

/**
 * Callback placeholder for updating robot pose [x, y, theta]
 * FUTURE BACKEND INTEGRATION:
 * Call this from WebSocket event listener.
 */
export function updateRobotPosition(data: { x: number; y: number; heading: number }): void {
  // FUTURE: Update robot coordinates in state
  console.log('[API placeholder] updateRobotPosition:', data);
}

/**
 * Callback placeholder for A* planned path
 * FUTURE BACKEND INTEGRATION:
 * Call this when Python planner finishes generating waypoints.
 */
export function updatePath(data: [number, number][]): void {
  console.log('[API placeholder] updatePath:', data);
}

/**
 * Callback placeholder for detected obstacles
 * FUTURE BACKEND INTEGRATION:
 * Call this when OpenCV detector outputs obstacle coordinates.
 */
export function updateObstacles(data: [number, number][]): void {
  console.log('[API placeholder] updateObstacles:', data);
}

/**
 * Connect to Python server WebSocket
 * FUTURE BACKEND INTEGRATION:
 * Instantiate new WebSocket(SERVER_WS_URL) and wire event listeners.
 */
export function connectToServer(): void {
  // FUTURE: Connect WebSocket
  console.log('[API placeholder] connectToServer called - Ready for Python/OpenCV socket');
}

/**
 * Disconnect from Python server WebSocket
 * FUTURE BACKEND INTEGRATION:
 * socket.close()
 */
export function disconnectFromServer(): void {
  // FUTURE: Disconnect WebSocket
  console.log('[API placeholder] disconnectFromServer called');
}
