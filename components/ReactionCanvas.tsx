
import React, { useMemo } from 'react';
import type { Atom } from '../types';
import { AtomIcon } from './AtomIcon';
import { useAtomAnimation } from './hooks/useAtomAnimation';

interface ReactionCanvasProps {
  atoms: Atom[];
  isPaused: boolean;
  pauseText: string | null;
  canvasRef: React.RefObject<HTMLDivElement>;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
}

export const ReactionCanvas: React.FC<ReactionCanvasProps> = ({
  atoms,
  isPaused,
  pauseText,
  canvasRef,
  onDrop,
  onDragOver,
}) => {
  const animatedAtoms = useAtomAnimation(atoms, canvasRef, isPaused);

  // Calculate interaction lines between close atoms
  const interactionLines = useMemo(() => {
    const lines = [];
    const threshold = 150; // Distance threshold for drawing lines

    for (let i = 0; i < animatedAtoms.length; i++) {
      for (let j = i + 1; j < animatedAtoms.length; j++) {
        const atomA = animatedAtoms[i];
        const atomB = animatedAtoms[j];
        
        // Ensure atoms have coordinates (might be undefined initially)
        if (atomA.x === undefined || atomA.y === undefined || atomB.x === undefined || atomB.y === undefined) continue;

        // Correct for center position (since x/y are top-left in rendering but center in physics usually, 
        // but useAtomAnimation returns top-left. We add radius to get center)
        const centerAx = atomA.x + atomA.radius;
        const centerAy = atomA.y + atomA.radius;
        const centerBx = atomB.x + atomB.radius;
        const centerBy = atomB.y + atomB.radius;

        const dx = centerBx - centerAx;
        const dy = centerBy - centerAy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < threshold) {
          // Opacity increases as they get closer
          const opacity = Math.max(0, 1 - distance / threshold);
          lines.push(
            <line
              key={`${atomA.instanceId}-${atomB.instanceId}`}
              x1={centerAx}
              y1={centerAy}
              x2={centerBx}
              y2={centerBy}
              stroke="rgba(6, 182, 212, 0.6)" // Cyan-500 with opacity
              strokeWidth={2 * opacity}
              strokeOpacity={opacity}
              strokeDasharray="4 4"
              className="animate-pulse"
            />
          );
        }
      }
    }
    return lines;
  }, [animatedAtoms]);

  return (
    <div
      ref={canvasRef}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="flex-grow bg-slate-100 dark:bg-slate-800/50 relative overflow-hidden bg-grid dark:bg-grid"
    >
      {/* Interaction Lines Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {interactionLines}
      </svg>

      {/* Atoms Layer */}
      {animatedAtoms.map((atom) => (
        <div
          key={atom.instanceId}
          className="absolute z-10"
          style={{
            left: `${atom.x}px`,
            top: `${atom.y}px`,
            transition: isPaused ? 'left 0.5s ease-out, top 0.5s ease-out' : 'none', // Smooth transition only when converging
          }}
        >
          <AtomIcon atom={atom} isAnimating={isPaused} />
        </div>
      ))}
      
       {isPaused && pauseText && atoms.length > 0 && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="text-center bg-black/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <p className="text-2xl font-bold animate-pulse text-white">{pauseText}</p>
            </div>
         </div>
       )}
    </div>
  );
};
