import React from 'react';
import { VEHICLES } from '../services/api';

interface VehicleSelectionProps {
  onSelectVehicle: (carId: number) => void;
  onLogout: () => void;
}

export const VehicleSelection: React.FC<VehicleSelectionProps> = ({
  onSelectVehicle,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-white text-black font-mono p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl border-2 border-black p-6 bg-white">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-black pb-4 mb-6 gap-3">

          <button
            id="vehicle-selection-logout-btn"
            onClick={onLogout}
            className="text-xs uppercase tracking-wider px-3 py-1.5 border border-black hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            LOGOUT
          </button>
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-l-4 border-black pl-2">
            SELECT VEHICLE
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Choose an active AGV / autonomous car unit to connect to the operator dashboard.
          </p>
        </div>

        {/* Vehicle Cards Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* CAR 1 */}
          <div className="border border-black p-5 bg-white flex flex-col justify-between">
            <div>
              <div className="text-base font-bold uppercase border-b border-black pb-2 mb-3">
                {VEHICLES[1].name}
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Vehicle ID:</span>
                  <span className="font-bold">{VEHICLES[1].vehicleId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Backend ID:</span>
                  <span className="font-bold">{VEHICLES[1].backendId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Status:</span>
                  <span className="font-bold">{VEHICLES[1].status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Assigned IP:</span>
                  <span>{VEHICLES[1].ip}</span>
                </div>
              </div>
            </div>

            <button
              id="select-car-1-btn"
              onClick={() => onSelectVehicle(1)}
              className="mt-6 w-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest py-2.5 px-4 border border-black transition-colors cursor-pointer"
            >
              SELECT CAR 1
            </button>
          </div>

          {/* CAR 2 */}
          <div className="border border-black p-5 bg-white flex flex-col justify-between">
            <div>
              <div className="text-base font-bold uppercase border-b border-black pb-2 mb-3">
                {VEHICLES[0].name}
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Vehicle ID:</span>
                  <span className="font-bold">{VEHICLES[0].vehicleId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Backend ID:</span>
                  <span className="font-bold">{VEHICLES[0].backendId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Status:</span>
                  <span className="font-bold">{VEHICLES[0].status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Assigned IP:</span>
                  <span>{VEHICLES[0].ip}</span>
                </div>
              </div>
            </div>

            <button
              id="select-car-2-btn"
              onClick={() => onSelectVehicle(0)}
              className="mt-6 w-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest py-2.5 px-4 border border-black transition-colors cursor-pointer"
            >
              SELECT CAR 2
            </button>
          </div>
        </div>

        <div className="text-[11px] text-neutral-500 border-t border-neutral-300 pt-3">
          Note: CAR 1 maps to Backend ID 1. CAR 2 maps to Backend ID 0 for OpenCV controller routing.
        </div>
      </div>
    </div>
  );
};
