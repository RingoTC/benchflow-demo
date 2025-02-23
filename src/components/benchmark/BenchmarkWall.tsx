import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BenchmarkCard, { BenchmarkCardProps } from './BenchmarkCard';
import './BenchmarkWall.css';

type Benchmark = Omit<BenchmarkCardProps, 'position'>;

const BenchmarkWall: React.FC = () => {
  const { t } = useTranslation();
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchBenchmarks = async () => {
      try {
        const response = await fetch('/data/greatAnimationCards.json');
        if (!response.ok) {
          throw new Error('Failed to fetch benchmarks');
        }
        const data: Benchmark[] = await response.json();
        setBenchmarks(data);
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

  // 计算每行应该显示的元素数量
  const baseItemsPerRow = Math.floor(benchmarks.length / 6); // 基础每行元素数
  const extraItemsForWideRow = Math.floor(baseItemsPerRow * 1.33); // 宽行的元素数（增加33%）

  // 计算每行的起始和结束索引
  const getRowBounds = (rowIndex: number) => {
    let startIndex = 0;
    let currentIndex = 0;

    for (let i = 0; i < rowIndex; i++) {
      currentIndex += (i === 1 || i === 4) ? extraItemsForWideRow : baseItemsPerRow;
    }
    startIndex = currentIndex;
    currentIndex += (rowIndex === 1 || rowIndex === 4) ? extraItemsForWideRow : baseItemsPerRow;

    return {
      start: startIndex,
      end: Math.min(currentIndex, benchmarks.length)
    };
  };

  return (
    <div className="benchmark-wall">
      <div className="benchmark-wall__title">
        <span>{t('FindTheRightBenchmark')}</span>
      </div>
      <div className="benchmark-wall__grid">
        {Array.from({ length: 6 }, (_, rowIndex) => {
          const { start, end } = getRowBounds(rowIndex);
          const rowItems = benchmarks.slice(start, end);

          return (
            <div 
              key={`row-${rowIndex}`}
              className={`benchmark-wall__row${rowIndex === 1 || rowIndex === 4 ? '--wide' : ''}`}
            >
              {rowItems.map((benchmark, index) => (
                <div
                  key={`${benchmark.title}-${start + index}`}
                  className={`benchmark-wall__item ${expandedIndex === (start + index) ? 'expanding' : ''}`}
                >
                  <BenchmarkCard 
                    {...benchmark}
                    position={{ x: 0, y: 0 }}
                    onExpand={(expanded) => setExpandedIndex(expanded ? (start + index) : null)}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BenchmarkWall; 