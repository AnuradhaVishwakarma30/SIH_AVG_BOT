import { useState } from 'react';
import { Login } from './components/Login';
import { VehicleSelection } from './components/VehicleSelection';
import { Dashboard } from './components/Dashboard';
import { DashboardState, CommandLogEntry } from './types';
import { getInitialDashboardState, VEHICLES } from './services/api';

type Screen = 'LOGIN' | 'VEHICLE_SELECTION' | 'DASHBOARD';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [dashboardState, setDashboardState] = useState<DashboardState | null>(null);

  // Formatted timestamp helper HH:MM:SS
  const getTimestamp = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  // Centralized command logs
  const [logs, setLogs] = useState<CommandLogEntry[]>([
    {
      id: 'log-0',
      timestamp: '22:14:03',
      vehicle: 'SYSTEM',
      command: 'SYSTEM',
      status: 'Dashboard ready',
    },
    {
      id: 'log-1',
      timestamp: '22:14:10',
      vehicle: 'CAR-01',
      command: 'SELECT',
      status: 'Vehicle selected',
    },
    {
      id: 'log-2',
      timestamp: '22:14:18',
      vehicle: 'CAR-01',
      command: 'B',
      status: 'Background captured',
    },
    {
      id: 'log-3',
      timestamp: '22:14:26',
      vehicle: 'CAR-01',
      command: 'P',
      status: 'Path generated',
    },
    {
      id: 'log-4',
      timestamp: '22:14:31',
      vehicle: 'CAR-01',
      command: 'SPACE',
      status: 'Autonomous run started',
    },
  ]);

  const addLog = (command: string, status: string, isError: boolean = false) => {
    const vehicleCode =
      selectedCarId !== null && VEHICLES[selectedCarId]
        ? VEHICLES[selectedCarId].vehicleId
        : 'SYSTEM';

    const newEntry: CommandLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: getTimestamp(),
      vehicle: vehicleCode,
      command,
      status,
      isError,
    };

    setLogs((prev) => [...prev, newEntry]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  // Transition: Login Success -> Vehicle Selection
  const handleLoginSuccess = () => {
    setCurrentScreen('VEHICLE_SELECTION');
  };

  // Transition: Vehicle Selected -> Main Dashboard
  const handleSelectVehicle = (carId: number) => {
    setSelectedCarId(carId);
    const initialState = getInitialDashboardState(carId);
    setDashboardState(initialState);

    const vehicleInfo = VEHICLES[carId];
    addLog('SELECT', `Vehicle ${vehicleInfo.name} (${vehicleInfo.vehicleId}, Backend ID: ${vehicleInfo.backendId}) selected`);
    setCurrentScreen('DASHBOARD');
  };

  // Transition: Change Vehicle -> Vehicle Selection
  const handleChangeVehicle = () => {
    setCurrentScreen('VEHICLE_SELECTION');
  };

  // Transition: Logout -> Login (Clears selected vehicle and state)
  const handleLogout = () => {
    setSelectedCarId(null);
    setDashboardState(null);
    setCurrentScreen('LOGIN');
  };

  // RENDER BASED ON STRICT APPLICATION FLOW:
  // 1. LOGIN
  // 2. CAR SELECTION
  // 3. MAIN DASHBOARD

  if (currentScreen === 'LOGIN') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentScreen === 'VEHICLE_SELECTION') {
    return (
      <VehicleSelection
        onSelectVehicle={handleSelectVehicle}
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'DASHBOARD' && dashboardState !== null && selectedCarId !== null) {
    return (
      <Dashboard
        state={dashboardState}
        onUpdateState={(updater) => {
          setDashboardState((prev) => (prev ? updater(prev) : prev));
        }}
        onChangeVehicle={handleChangeVehicle}
        onLogout={handleLogout}
        logs={logs}
        onAddLog={addLog}
        onClearLogs={handleClearLogs}
      />
    );
  }

  // Fallback safe state
  return <Login onLoginSuccess={handleLoginSuccess} />;
}
