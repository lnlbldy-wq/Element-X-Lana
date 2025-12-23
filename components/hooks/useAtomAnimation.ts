
import React, { useState, useEffect, useRef } from 'react';
import type { Atom } from '../../types';

// Constants for physics simulation
const VELOCITY_DECAY = 0.98;
const PUSH_FORCE = 0.5;
const BOUNDARY_DAMPING = -0.7;

interface AnimatedAtom extends Atom {
  vx: number;
  vy: number;
}

export const useAtomAnimation = (
  initialAtoms: Atom[],
  canvasRef: React.RefObject<HTMLDivElement>,
  isPaused: boolean, // This is effectively 'isConverging' now
) => {
  const [animatedAtoms, setAnimatedAtoms] = useState<AnimatedAtom[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Sync state when new atoms are added externally
  useEffect(() => {
    setAnimatedAtoms(prevAtoms => {
      const newAtoms = initialAtoms.map(initialAtom => {
        const existing = prevAtoms.find(p => p.instanceId === initialAtom.instanceId);
        if (existing) {
          return existing;
        }
        
        // Use provided coordinates or pick a safe starting point
        const startX = initialAtom.x ?? 100;
        const startY = initialAtom.y ?? 100;

        return {
          ...initialAtom,
          x: startX,
          y: startY,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
        };
      });
      // Keep only atoms currently in the simulation
      return newAtoms.filter(a => initialAtoms.some(i => i.instanceId === a.instanceId));
    });
  }, [initialAtoms]);

  useEffect(() => {
    const animate = () => {
      if (!canvasRef.current) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }
      
      const rect = canvasRef.current.getBoundingClientRect();
      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

      // Skip physics if layout isn't ready
      if (canvasWidth === 0 || canvasHeight === 0) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }

      setAnimatedAtoms(prevAtoms => {
        if (prevAtoms.length === 0) return prevAtoms;

        if (isPaused) {
            // Convergence effect (smooth move to center)
             return prevAtoms.map((atom, index) => {
                const angle = (index / prevAtoms.length) * 2 * Math.PI;
                const clusterRadius = 40;
                const targetX = (canvasWidth / 2) + Math.cos(angle) * clusterRadius;
                const targetY = (canvasHeight / 2) + Math.sin(angle) * clusterRadius;
                
                const newX = (atom.x ?? 0) + (targetX - (atom.x ?? 0)) * 0.1;
                const newY = (atom.y ?? 0) + (targetY - (atom.y ?? 0)) * 0.1;
                
                return {...atom, x: newX, y: newY, vx: 0, vy: 0};
            });
        }
        
        // Manual copy to avoid stringify overhead
        const newAtoms: AnimatedAtom[] = prevAtoms.map(a => ({ ...a }));

        for (let i = 0; i < newAtoms.length; i++) {
          let atomA = newAtoms[i];
          let ax = atomA.x ?? 0;
          let ay = atomA.y ?? 0;

          // Boundary collision
          if (ax + atomA.radius > canvasWidth) {
            ax = canvasWidth - atomA.radius;
            atomA.vx *= BOUNDARY_DAMPING;
          } else if (ax - atomA.radius < 0) {
            ax = atomA.radius;
            atomA.vx *= BOUNDARY_DAMPING;
          }
          
          if (ay + atomA.radius > canvasHeight) {
            ay = canvasHeight - atomA.radius;
            atomA.vy *= BOUNDARY_DAMPING;
          } else if (ay - atomA.radius < 0) {
            ay = atomA.radius;
            atomA.vy *= BOUNDARY_DAMPING;
          }

          // Inter-atom collisions
          for (let j = i + 1; j < newAtoms.length; j++) {
            let atomB = newAtoms[j];
            let bx = atomB.x ?? 0;
            let by = atomB.y ?? 0;
            
            const dx = bx - ax;
            const dy = by - ay;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = atomA.radius + atomB.radius;

            if (distance < minDistance && distance > 0) {
              const angle = Math.atan2(dy, dx);
              const overlap = minDistance - distance;
              const moveX = (overlap / 2) * Math.cos(angle);
              const moveY = (overlap / 2) * Math.sin(angle);

              ax -= moveX;
              ay -= moveY;
              bx += moveX;
              by += moveY;
              
              const forceX = PUSH_FORCE * Math.cos(angle);
              const forceY = PUSH_FORCE * Math.sin(angle);
              atomA.vx -= forceX;
              atomA.vy -= forceY;
              atomB.vx += forceX;
              atomB.vy += forceY;
              
              atomB.x = bx;
              atomB.y = by;
            }
          }
          
          atomA.x = ax + atomA.vx;
          atomA.y = ay + atomA.vy;
          atomA.vx *= VELOCITY_DECAY;
          atomA.vy *= VELOCITY_DECAY;
        }

        return newAtoms;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPaused, canvasRef]);

  // Adjust coordinates for top-left rendering relative to radius
  return animatedAtoms.map(a => ({
      ...a,
      x: (a.x ?? 0) - a.radius,
      y: (a.y ?? 0) - a.radius,
  }));
};
