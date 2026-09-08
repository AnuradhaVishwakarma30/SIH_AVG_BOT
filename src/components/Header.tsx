import React from 'react';
import { VEHICLES } from '../services/api';

interface HeaderProps {
  selectedCarId: number;
  onChangeVehicle: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCarId,
  onChangeVehicle,
  onLogout,
}) => {
  const vehicle = VEHICLES[selectedCarId] || {
    vehicleId: `CAR-${selectedCarId}`,
    backendId: selectedCarId,
  };

  return (
    <header className="border-b-2 border-black bg-white px-4 py-3 font-mono">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
       

        {/* Status + Actions */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Selected Vehicle Badge */}
          <div className="border border-black px-3 py-1.5 bg-neutral-100 flex items-center gap-3">
            <div>
              <span className="text-neutral-500 uppercase">Selected Vehicle: </span>
              <span className="font-bold">{vehicle.vehicleId}</span>
            </div>
            <div className="h-3 w-px bg-neutral-400"></div>
            <div>
              <span className="text-neutral-500 uppercase">Backend ID: </span>
              <span className="font-bold">{vehicle.backendId}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              id="header-change-vehicle-btn"
              onClick={onChangeVehicle}
              className="border border-black px-3 py-1.5 bg-white text-black hover:bg-neutral-100 font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              CHANGE VEHICLE
            </button>
            <button
              id="header-logout-btn"
              onClick={onLogout}
              className="border border-black px-3 py-1.5 bg-white text-black hover:bg-neutral-100 font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
