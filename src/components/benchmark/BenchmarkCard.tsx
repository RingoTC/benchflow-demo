import React, { useState, useRef, useCallback } from 'react';
import './BenchmarkCard.css';

export interface BenchmarkCardProps {
  title: string;
  description: string;
  organization: {
    icon: string;
    name: string;
  };
  benchmarkUrl: string;
  highlight?: boolean;
  onExpand?: (expanded: boolean) => void;
}

const BenchmarkCard: React.FC<BenchmarkCardProps> = ({
  title,
  description,
  organization,
  benchmarkUrl,
  highlight = false,
  onExpand,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (highlight) {
      setIsHovered(true);
      onExpand?.(true);
    }
  }, [highlight, onExpand]);

  const handleMouseLeave = useCallback(() => {
    if (highlight) {
      setIsHovered(false);
      onExpand?.(false);
    }
  }, [highlight, onExpand]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (highlight && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      setIsHovered(!isHovered);
      onExpand?.(!isHovered);
    }
  }, [highlight, isHovered, onExpand]);

  if (!highlight) {
    return (
      <a 
        href={benchmarkUrl}
        className="benchmark-card__text-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${title} benchmark`}
      >
        {title}
      </a>
    );
  }

  return (
    <div 
      className="benchmark-card-container"
      role="article"
      aria-expanded={isHovered}
    >
      <div 
        ref={cardRef}
        className={`benchmark-card ${isHovered ? 'expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyPress={handleKeyPress}
        tabIndex={0}
        aria-label={`${title} benchmark card`}
      >
        <div className="benchmark-card__content">
          <div className="benchmark-card__header">
            <h2 className="benchmark-card__title">{title}</h2>
          </div>
        </div>

        <div 
          className="benchmark-card__expanded-content"
          aria-hidden={!isHovered}
        >
          <div className="benchmark-card__header">
            <h2 className="benchmark-card__title">{title}</h2>
            <a 
              href={benchmarkUrl}
              className="benchmark-card__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${title} benchmark details`}
            />
          </div>
          
          <div className="benchmark-card__expandable">
            <p className="benchmark-card__description">{description}</p>
            
            <div className="benchmark-card__organization">
              <img 
                src={organization.icon} 
                alt={`${organization.name} icon`}
                className="benchmark-card__organization-icon" 
                loading="lazy"
              />
              <span className="benchmark-card__organization-name">
                {organization.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BenchmarkCard); 