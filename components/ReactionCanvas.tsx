
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
  onAtomSelect?: (atom: Atom) => void;
}

export const ReactionCanvas: React.FC<ReactionCanvasProps> = ({
  atoms,
  isPaused,
  pauseText,
  canvasRef,
  onDrop,
  onDragOver,
  onAtomSelect,
}) => {
  const animatedAtoms = useAtomAnimation(atoms, canvasRef, isPaused);

  const interactionLines = useMemo(() => {
    const lines = [];
    const threshold = 150;

    for (let i = 0; i < animatedAtoms.length; i++) {
      for (let j = i + 1; j < animatedAtoms.length; j++) {
        const atomA = animatedAtoms[i];
        const atomB = animatedAtoms[j];
        if (atomA.x === undefined || atomA.y === undefined || atomB.x === undefined || atomB.y === undefined) continue;

        const centerAx = atomA.x + atomA.radius;
        const centerAy = atomA.y + atomA.radius;
        const centerBx = atomB.x + atomB.radius;
        const centerBy = atomB.y + atomB.radius;

        const dx = centerBx - centerAx;
        const dy = centerBy - centerAy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < threshold) {
          const opacity = Math.max(0, 1 - distance / threshold);
          lines.push(
            <line
              key={`${atomA.instanceId}-${atomB.instanceId}`}
              x1={centerAx}
              y1={centerAy}
              x2={centerBx}
              y2={centerBy}
              stroke="rgba(6, 182, 212, 0.4)"
              strokeWidth={1}
              strokeOpacity={opacity}
              strokeDasharray="2 2"
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
      className="flex-grow bg-white dark:bg-slate-950 relative overflow-hidden"
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {interactionLines}
      </svg>

      {animatedAtoms.map((atom) => (
        <div
          key={atom.instanceId}
          onClick={() => onAtomSelect?.(atom)}
          className="absolute z-10 cursor-pointer transition-transform hover:scale-125"
          style={{
            left: `${atom.x}px`,
            top: `${atom.y}px`,
            transition: isPaused ? 'left 0.5s ease-out, top 0.5s ease-out' : 'transform 0.2s',
          }}
        >
          <AtomIcon atom={atom} isAnimating={isPaused} />
        </div>
      ))}
      
       {isPaused && pauseText && atoms.length > 0 && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="text-center bg-black/40 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <p className="text-xl font-bold text-white">{pauseText}</p>
            </div>
         </div>
       )}
    </div>
  );
};
