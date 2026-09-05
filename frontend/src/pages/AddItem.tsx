import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBag } from '../context/BagContext';
import { Link2, FileText, Folder, Tag, Plus, CheckCircle2, ShoppingBag } from 'lucide-react';

export const AddItem: React.FC = () => {
  const { addLink } = useBag();
  const navigate = useNavigate();

  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

    const parsedTags = tagsInput
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag, index, self) => tag.length > 0 && self.indexOf(tag) === index);

    try {
      await addLink(normalized, note, category, parsedTags);
      
      // Reset Form & Show Toast
      setUrl('');
      setNote('');
      setCategory('');
      setTagsInput('');
      setToastMessage('Item packed successfully into your bag!');

      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save item to bag.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={20} className="toast-icon" />
          <span>{toastMessage}</span>
          <button className="btn-toast-action" onClick={() => navigate('/bag')}>
            <ShoppingBag size={14} /> View Bag
          </button>
        </div>
      )}

      <div className="add-item-container">
        <div className="quick-add-section" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <h2 className="section-title">
            <Plus size={22} />
            Pack a New Item
          </h2>

          <form onSubmit={handleSubmit} className="quick-add-form">
            {error && <div className="error-banner">{error}</div>}

            <div className="input-group">
              <label htmlFor="item-url">URL</label>
              <div className="input-wrapper">
                <Link2 className="input-icon" size={18} />
                <input
                  id="item-url"
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
              <label htmlFor="item-note">Note / Description</label>
              <div className="input-wrapper">
                <FileText className="input-icon" size={18} />
                <input
                  id="item-note"
                  type="text"
                  placeholder="What is this link about?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="item-category">Category</label>
              <div className="input-wrapper">
                <Folder className="input-icon" size={18} />
                <input
                  id="item-category"
                  type="text"
                  placeholder="e.g. Work, Reading, Recipes"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="item-tags">Tags (comma-separated)</label>
              <div className="input-wrapper">
                <Tag className="input-icon" size={18} />
                <input
                  id="item-tags"
                  type="text"
                  placeholder="e.g. tutorial, css, inspiration"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading-spinner"></span> Packing...
                  </>
                ) : (
                  'Pack to Bag'
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/bag')}
                disabled={loading}
              >
                Go to Bag
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
