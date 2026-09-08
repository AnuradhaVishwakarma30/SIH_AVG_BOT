import React, { useState } from 'react';

export const OperatorGuide: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const steps = [
    {
      num: '01',
      title: 'Login',
      desc: 'Login using the provided credentials.',
    },
    {
      num: '02',
      title: 'Select Vehicle',
      desc: 'Select Car 1 or Car 2.',
    },
    {
      num: '03',
      title: 'Verify Coordinates',
      desc: 'Check selected, start and goal coordinates.',
    },
    {
      num: '04',
      title: 'Capture Background',
      desc: 'Press B to capture the background.',
    },
    {
      num: '05',
      title: 'Generate Path',
      desc: 'Press P to generate the path.',
    },
    {
      num: '06',
      title: 'Start Vehicle',
      desc: 'Press SPACE to start autonomous operation.',
    },
    {
      num: '07',
      title: 'Monitor',
      desc: 'Monitor robot position, heading, obstacles and path.',
    },
    {
      num: '08',
      title: 'Emergency Stop',
      desc: 'Press X when the robot needs to stop.',
    },
  ];

  return (
    <div className="border border-black bg-white font-mono">
      {/* HEADER / TOGGLE BAR */}
      <div className="border-b border-black px-4 py-2.5 bg-neutral-100 flex justify-between items-center">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider inline-block mr-2">
            OPERATOR GUIDE
          </h2>
          <span className="text-[10px] text-neutral-500 uppercase">
            HOW TO OPERATE
          </span>
        </div>
        <button
          id="operator-guide-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-xs font-bold border border-black px-2.5 py-0.5 bg-white hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          {isCollapsed ? '[+] EXPAND' : '[-] COLLAPSE'}
        </button>
      </div>

      {/* CONTENT */}
      {!isCollapsed && (
        <div className="p-4 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {steps.map((step) => (
              <div
                key={step.num}
                className="border border-neutral-300 p-2.5 bg-neutral-50"
              >
                <div className="font-bold text-black flex items-center justify-between border-b border-neutral-200 pb-1 mb-1.5">
                  <span>{step.num} — {step.title}</span>
                </div>
                <div className="text-[11px] text-neutral-700 leading-relaxed">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-neutral-200 text-[10px] text-neutral-500 flex flex-wrap justify-between gap-2">
          
            <span>SYSTEM STANDBY: USE EMERGENCY STOP [X] TO INTERRUPT AT ANY TIME</span>
          </div>
        </div>
      )}
    </div>
  );
};
