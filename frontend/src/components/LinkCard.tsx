import React, { useMemo } from 'react';
import { useBag } from '../context/BagContext';
import type { LinkItem } from '../context/BagContext';
import { Trash2, Edit2, Pin, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface LinkCardProps {
  link: LinkItem;
  onEdit: (link: LinkItem) => void;
  onDeleteRequest: (link: LinkItem) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, onEdit, onDeleteRequest }) => {
  const { togglePin } = useBag();

  const domain = useMemo(() => {
    try {
      return new URL(link.url).hostname.replace('www.', '');
    } catch (_) {
      return 'link';
    }
  }, [link.url]);

  const cardTilt = useMemo(() => {
    // Generate deterministic tilt based on link ID so it doesn't change on render
    let hash = 0;
    for (let i = 0; i < link.id.length; i++) {
      hash += link.id.charCodeAt(i);
    }
    const tiltDegrees = ((hash % 20) - 10) / 10; // Value between -1.0 and 1.0 deg
    return `${tiltDegrees}deg`;
  }, [link.id]);

  const formattedDate = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(link.created_at), { addSuffix: true });
    } catch (_) {
      return 'recently';
    }
  }, [link.created_at]);

  const handleCardClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(link.id, link.pinned);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(link);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteRequest(link);
  };

  return (
    <div
      className={`link-card ${link.pinned ? 'pinned' : ''}`}
      style={{ '--card-tilt': cardTilt } as React.CSSProperties}
      onClick={handleCardClick}
    >
      {link.pinned && (
        <div className="card-pin-status" title="Pinned to Front Pocket">
          <Pin size={12} fill="currentColor" />
        </div>
      )}

      <div className="card-top">
        <div className="card-url-domain" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {domain} <ExternalLink size={10} />
        </div>
        <h3 className="card-url-title" title={link.url}>
          {link.note || link.url}
        </h3>
        {link.note && (
          <p className="card-note" title={link.url}>
            {link.url}
          </p>
        )}
      </div>

      <div className="card-middle">
        {link.category && <span className="category-pill">{link.category}</span>}
        {link.tags && link.tags.length > 0 && (
          <div className="card-tags">
            {link.tags.map((tag) => (
              <span key={tag} className="tag-badge">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="card-bottom">
        <span className="card-date" title={new Date(link.created_at).toLocaleString()}>
          {formattedDate}
        </span>
        <div className="card-actions">
          <button
            className={`action-btn pin ${link.pinned ? 'pinned-active' : ''}`}
            onClick={handlePin}
            title={link.pinned ? 'Unpin from Pocket' : 'Pin to Front Pocket'}
          >
            <Pin size={14} fill={link.pinned ? 'currentColor' : 'none'} />
          </button>
          <button className="action-btn edit" onClick={handleEdit} title="Edit Item Details">
            <Edit2 size={14} />
          </button>
          <button className="action-btn delete" onClick={handleDelete} title="Discard from Bag">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
