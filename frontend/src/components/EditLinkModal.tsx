import React, { useState, useEffect } from 'react';
import { useBag } from '../context/BagContext';
import type { LinkItem } from '../context/BagContext';
import { X, Link2, FileText, Folder, Tag } from 'lucide-react';

interface EditLinkModalProps {
  isOpen: boolean;
  link: LinkItem | null;
  onClose: () => void;
}

export const EditLinkModal: React.FC<EditLinkModalProps> = ({ isOpen, link, onClose }) => {
  const { updateLink } = useBag();
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (link) {
      setUrl(link.url);
      setNote(link.note || '');
      setCategory(link.category || '');
      setTagsInput(link.tags.join(', '));
      setError(null);
    }
  }, [link]);

  if (!isOpen || !link) return null;

  const normalizeUrl = (input: string): string => {
    let clean = input.trim();
    if (!/^https?:\/\//i.test(clean)) {
      clean = `https://${clean}`;
    }
    return clean;
  };

  const validateUrl = (testUrl: string): boolean => {
    try {
      new URL(testUrl);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError('URL is required.');
      return;
    }

    const normalized = normalizeUrl(url);
    if (!validateUrl(normalized)) {
      setError('Please enter a valid URL.');
      return;
    }

    setLoading(true);

    const parsedTags = tagsInput
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter((tag, index, self) => tag.length > 0 && self.indexOf(tag) === index);

    try {
      await updateLink(link.id, {
        url: normalized,
        note: note,
        category: category,
        tags: parsedTags,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save link updates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Pack Info</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {error && <div className="error-banner">{error}</div>}

            <div className="input-group">
              <label htmlFor="edit-url">URL</label>
              <div className="input-wrapper">
                <Link2 className="input-icon" size={16} />
                <input
                  id="edit-url"
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="edit-note">Note / Description</label>
              <div className="input-wrapper">
                <FileText className="input-icon" size={16} />
                <input
                  id="edit-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="edit-category">Category</label>
              <div className="input-wrapper">
                <Folder className="input-icon" size={16} />
                <input
                  id="edit-category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="edit-tags">Tags (comma-separated)</label>
              <div className="input-wrapper">
                <Tag className="input-icon" size={16} />
                <input
                  id="edit-tags"
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
