import React, { useState } from 'react';
import { useBag } from '../context/BagContext';
import { Link2, FileText, Folder, Tag, Plus } from 'lucide-react';

export const QuickAddForm: React.FC = () => {
  const { addLink } = useBag();
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError('Please provide a URL.');
      return;
    }

    const normalized = normalizeUrl(url);
    if (!validateUrl(normalized)) {
      setError('Please enter a valid URL (e.g. google.com or https://example.com).');
      return;
    }

    setLoading(true);

    // Parse comma-separated tags into a deduplicated array
    const parsedTags = tagsInput
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter((tag, index, self) => tag.length > 0 && self.indexOf(tag) === index);

    try {
      await addLink(normalized, note, category, parsedTags);
      // Reset form
      setUrl('');
      setNote('');
      setCategory('');
      setTagsInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to save link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quick-add-section">
      <h2 className="section-title">
        <Plus size={20} />
        Pack a Link
      </h2>

      <form onSubmit={handleSubmit} className="quick-add-form">
        {error && <div className="error-banner">{error}</div>}

        <div className="input-group">
          <label htmlFor="quick-url">URL</label>
          <div className="input-wrapper">
            <Link2 className="input-icon" size={16} />
            <input
              id="quick-url"
              type="text"
              required
              placeholder="example.com or https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="quick-note">Note / Description</label>
          <div className="input-wrapper">
            <FileText className="input-icon" size={16} />
            <input
              id="quick-note"
              type="text"
              placeholder="What is this link about?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="quick-category">Category</label>
          <div className="input-wrapper">
            <Folder className="input-icon" size={16} />
            <input
              id="quick-category"
              type="text"
              placeholder="e.g. Work, Reading, Recipes"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="quick-tags">Tags (comma-separated)</label>
          <div className="input-wrapper">
            <Tag className="input-icon" size={16} />
            <input
              id="quick-tags"
              type="text"
              placeholder="e.g. tutorial, css, inspiration"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span> Packing...
            </>
          ) : (
            'Pack to Bag'
          )}
        </button>
      </form>
    </div>
  );
};
