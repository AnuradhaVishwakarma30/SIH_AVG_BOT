export type RobotStatus = 'STOPPED' | 'RUNNING';
export type BackgroundStatus = 'Captured' | 'Not Captured';
export type ConnectionStatus = 'ONLINE' | 'OFFLINE';

export interface VehicleInfo {
  name: string;
  vehicleId: string;
  backendId: number;
  status: string;
  ip: string;
}

export interface DashboardState {
  selectedCarId: number | null; // 1 for CAR-01, 0 for CAR-02
  selectedCoordinates: [number, number] | null;
  startCoordinate: [number, number] | null;
  goalPoint: [number, number] | null;
  currentCell: [number, number] | null;
  heading: number;
  obstacleCount: number;
  pathSize: number;
  backgroundStatus: BackgroundStatus;
  robotStatus: RobotStatus;
  connectionStatus: ConnectionStatus;
  fps: number;
  path: [number, number][];
  obstacles: [number, number][];
  ip: string;
}

export interface CommandLogEntry {
  id: string;
  timestamp: string;
  vehicle: string;
  command: string;
  status: string;
  isError?: boolean;
}
