import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BenchmarkCard, { BenchmarkCardProps } from './BenchmarkCard';
import './BenchmarkWall.css';

type Benchmark = Omit<BenchmarkCardProps, 'position'>;

// Configuration constants
const TOTAL_ROWS = 6;
const WIDE_ROW_INDICES = [1, 4];
const BASE_ITEMS_MULTIPLIER = 1.33;

const BenchmarkWall: React.FC = () => {
  const { t } = useTranslation();
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Calculate row configuration
  const rowConfig = useMemo(() => {
    const baseItemsPerRow = Math.floor(benchmarks.length / TOTAL_ROWS);
    const extraItemsForWideRow = Math.floor(baseItemsPerRow * BASE_ITEMS_MULTIPLIER);

    return {
      baseItemsPerRow,
      extraItemsForWideRow,
      getRowBounds: (rowIndex: number) => {
        let startIndex = 0;
        let currentIndex = 0;

        for (let i = 0; i < rowIndex; i++) {
          currentIndex += WIDE_ROW_INDICES.includes(i) ? extraItemsForWideRow : baseItemsPerRow;
        }
        startIndex = currentIndex;
        currentIndex += WIDE_ROW_INDICES.includes(rowIndex) ? extraItemsForWideRow : baseItemsPerRow;

        return {
          start: startIndex,
          end: Math.min(currentIndex, benchmarks.length)
        };
      }
    };
  }, [benchmarks.length]);

  // Memoize the grid content
  const gridContent = useMemo(() => {
    if (loading || error) {
      return null;
    }

    return Array.from({ length: TOTAL_ROWS }, (_, rowIndex) => {
      const { start, end } = rowConfig.getRowBounds(rowIndex);
      const rowItems = benchmarks.slice(start, end);
      const isWideRow = WIDE_ROW_INDICES.includes(rowIndex);

      return (
        <React.Fragment key={`row-${rowIndex}`}>
          <div 
            className={`benchmark-wall__row${isWideRow ? '--wide' : ''}`}
            role="row"
          >
            {rowItems.map((benchmark, index) => (
              <div
                key={`${benchmark.title}-${start + index}`}
                className={`benchmark-wall__item ${expandedIndex === (start + index) ? 'expanding' : ''}`}
                role="gridcell"
              >
                <BenchmarkCard 
                  {...benchmark}
                  onExpand={(expanded) => setExpandedIndex(expanded ? (start + index) : null)}
                />
              </div>
            ))}
          </div>
          {rowIndex === 2 && <div className="benchmark-wall__grid-gap" role="presentation" />}
        </React.Fragment>
      );
    });
  }, [benchmarks, expandedIndex, rowConfig, loading, error]);

  useEffect(() => {
    const fetchBenchmarks = async () => {
      try {
        const response = await fetch('./data/greatAnimationCards.json');
        if (!response.ok) {
          throw new Error(t('FetchError'));
        }
        const data: Benchmark[] = await response.json();
        setBenchmarks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('UnknownError'));
      } finally {
        setLoading(false);
      }
    };

    fetchBenchmarks();
  }, [t]);


  // Render error state
  if (error) {
    return (
      <div className="benchmark-wall" role="alert">
        <div className="benchmark-wall__error">
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
            }}
            className="benchmark-wall__retry-button"
          >
            {t('Retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="benchmark-wall">
      <div className="benchmark-wall__title" role="heading" aria-level={1}>
        <span>{t('FindTheRightBenchmark')}</span>
      </div>
      <div className="benchmark-wall__grid" role="grid">
        {gridContent}
      </div>
    </div>
  );
};

export default BenchmarkWall; 