import React, { useState } from 'react';
import './BenchmarkCard.css';

export interface BenchmarkCardProps {
  title: string;
  description: string;
  organization: {
    icon: string;
    name: string;
  };
  benchmarkUrl: string;
  position: {
    x: number;
    y: number;
  };
  onExpand?: (expanded: boolean) => void;
}

const BenchmarkCard: React.FC<BenchmarkCardProps> = ({
  title,
  description,
  organization,
  benchmarkUrl,
  onExpand,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onExpand?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onExpand?.(false);
  };

  return (
    <div 
      className={`benchmark-card ${isHovered ? 'expanded' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="benchmark-card__content">
        <div className="benchmark-card__header">
          <h2 className="benchmark-card__title">{title}</h2>
          <a 
            href={benchmarkUrl}
            className="benchmark-card__link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View benchmark details"
          />
        </div>
        
        <div className="benchmark-card__expandable">
          <p className="benchmark-card__description">{description}</p>
          
          <div className="benchmark-card__organization">
            <img 
              src={organization.icon} 
              alt={`${organization.name} icon`}
              className="benchmark-card__organization-icon" 
            />
            <span className="benchmark-card__organization-name">
              {organization.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkCard; 