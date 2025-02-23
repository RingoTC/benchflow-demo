import React, { useEffect, useState, useRef } from 'react';
import BenchmarkCard, { BenchmarkCardProps } from './BenchmarkCard';
import './BenchmarkWall.css';

interface BenchmarkWithPosition extends Omit<BenchmarkCardProps, 'position'> {
  position: {
    x: number;
    y: number;
  };
}

const BenchmarkWall: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkWithPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const wallRef = useRef<HTMLDivElement>(null);

  const generateSafePosition = (index: number) => {
    // Define safe margins to ensure cards can expand without hitting edges
    const MARGIN = 20; // Increased margin to ensure space for expansion
    
    // Divide the wall into a grid
    const ROWS = 3;
    const COLS = 4;
    
    // Calculate base position
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    
    // Calculate safe zones that account for card expansion
    const safeZoneWidth = (100 - 2 * MARGIN) / (COLS - 1);
    const safeZoneHeight = (100 - 2 * MARGIN) / (ROWS - 1);
    
    // Position within safe zones
    const x = MARGIN + (safeZoneWidth * col);
    const y = MARGIN + (safeZoneHeight * row);
    
    // Add small random offset within safe limits
    const maxOffset = 5; // Reduced random offset to stay within safe zones
    const randomX = x + (Math.random() - 0.5) * maxOffset;
    const randomY = y + (Math.random() - 0.5) * maxOffset;

    return {
      x: Math.max(MARGIN, Math.min(100 - MARGIN, randomX)),
      y: Math.max(MARGIN, Math.min(100 - MARGIN, randomY))
    };
  };

  useEffect(() => {
    const fetchBenchmarks = async () => {
      try {
        const response = await fetch('/data/greatAnimationCards.json');
        if (!response.ok) {
          throw new Error('Failed to fetch benchmarks');
        }
        const data: Omit<BenchmarkCardProps, 'position'>[] = await response.json();
        
        const benchmarksWithPosition = data.map((benchmark, index) => ({
          ...benchmark,
          position: generateSafePosition(index)
        }));

        setBenchmarks(benchmarksWithPosition);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBenchmarks();
  }, []);

  if (loading) {
    return <div className="benchmark-wall__loading">Loading benchmarks...</div>;
  }

  if (error) {
    return <div className="benchmark-wall__error">{error}</div>;
  }

  return (
    <div className="benchmark-wall" ref={wallRef}>
      {benchmarks.map((benchmark, index) => (
        <div
          key={`${benchmark.title}-${index}`}
          className={`benchmark-wall__item ${expandedIndex === index ? 'expanding' : ''}`}
          style={{
            left: `${benchmark.position.x}%`,
            top: `${benchmark.position.y}%`,
            transform: 'translate(-50%, -50%)' // Center the card at its position
          }}
        >
          <BenchmarkCard 
            {...benchmark} 
            position={benchmark.position}
            onExpand={(expanded) => setExpandedIndex(expanded ? index : null)}
          />
        </div>
      ))}
    </div>
  );
};

export default BenchmarkWall; 