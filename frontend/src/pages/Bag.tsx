import React, { useState, useEffect, useMemo } from 'react';
import { useBag } from '../context/BagContext';
import type { LinkItem } from '../context/BagContext';
import { LinkCard } from '../components/LinkCard';
import { EditLinkModal } from '../components/EditLinkModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { Navbar } from '../components/Navbar';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Bookmark,
  Pin,
  HelpCircle,
} from 'lucide-react';

export const Bag: React.FC = () => {
  const { links, loading, error, deleteLink } = useBag();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

  // Modals state
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Extract unique categories and tags from current links
  const uniqueCategories = useMemo(() => {
    const categories = links
      .map((link) => link.category)
      .filter((cat): cat is string => cat !== null && cat.trim().length > 0);
    return Array.from(new Set(categories)).sort();
  }, [links]);

  const uniqueTags = useMemo(() => {
    const tags = links.flatMap((link) => link.tags || []);
    return Array.from(new Set(tags)).sort();
  }, [links]);

  // Filter and Sort links
  const filteredLinks = useMemo(() => {
    let result = [...links];

    // 1. Filter by search query
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (link) =>
          link.url.toLowerCase().includes(query) ||
          (link.note && link.note.toLowerCase().includes(query)) ||
          (link.category && link.category.toLowerCase().includes(query)) ||
          link.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // 2. Filter by category
    if (selectedCategory) {
      result = result.filter(
        (link) => link.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 3. Filter by tag
    if (selectedTag) {
      result = result.filter((link) =>
        link.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // 4. Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === 'alphabetical') {
        const titleA = a.note || a.url;
        const titleB = b.note || b.url;
        return titleA.localeCompare(titleB);
      }
      return 0;
    });

    return result;
  }, [links, debouncedSearch, selectedCategory, selectedTag, sortBy]);

  // Separate pinned vs unpinned
  const pinnedLinks = useMemo(() => {
    return filteredLinks.filter((link) => link.pinned);
  }, [filteredLinks]);

  const unpinnedLinks = useMemo(() => {
    return filteredLinks.filter((link) => !link.pinned);
  }, [filteredLinks]);

  const handleDeleteConfirm = async () => {
    if (deletingLink) {
      try {
        await deleteLink(deletingLink.id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Content Area */}
      <main className="container" style={{ padding: '20px', flex: 1 }}>
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Controls Panel */}
          <div className="controls-panel">
            <div className="search-filter-inputs">
              {/* Search Bar */}
              <div className="input-wrapper search-input-wrapper">
                <Search className="input-icon" size={16} />
                <input
                  type="text"
                  placeholder="Search URL, note, category or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Dropdown */}
              <div className="input-wrapper select-filter-wrapper">
                <Filter className="input-icon" size={16} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="sort-wrapper">
              <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Sort: Newest packed</option>
                <option value="oldest">Sort: Oldest packed</option>
                <option value="alphabetical">Sort: Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Tags Chips Bar */}
          {uniqueTags.length > 0 && (
            <div className="tag-chips-row">
              <button
                className={`filter-chip ${selectedTag === '' ? 'active' : ''}`}
                onClick={() => setSelectedTag('')}
              >
                All Tags
              </button>
              {uniqueTags.map((tag) => (
                <button
                  key={tag}
                  className={`filter-chip ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {error && <div className="error-banner" style={{ marginBottom: '20px' }}>{error}</div>}

          {/* Links View State */}
          {loading && links.length === 0 ? (
            <div className="empty-state">
              <span className="loading-spinner" style={{ borderColor: 'var(--olive-light) rgba(0,0,0,0.1) rgba(0,0,0,0.1) rgba(0,0,0,0.1)', width: '30px', height: '30px' }}></span>
              <p style={{ marginTop: '15px' }}>Unpacking the bag contents...</p>
            </div>
          ) : links.length === 0 ? (
            /* Total Empty State */
            <div className="empty-state">
              <Bookmark size={48} className="empty-icon" />
              <h3>Your Bag is empty</h3>
              <p>Pack your first digital findings using the form on the left side.</p>
            </div>
          ) : filteredLinks.length === 0 ? (
            /* Filter Empty State */
            <div className="empty-state">
              <HelpCircle size={48} className="empty-icon" />
              <h3>No items match your search</h3>
              <p>Try refining your filters or tags to locate the item.</p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: '15px' }}
                onClick={handleClearFilters}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Front Pocket (Pinned Links) */}
              {pinnedLinks.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div className="pocket-divider">
                    <span className="pocket-title">
                      <Pin size={14} fill="currentColor" />
                      Front Pocket
                    </span>
                  </div>
                  <div className="links-grid">
                    {pinnedLinks.map((link) => (
                      <LinkCard
                        key={link.id}
                        link={link}
                        onEdit={setEditingLink}
                        onDeleteRequest={setDeletingLink}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Main Bag (Unpinned Links) */}
              <div>
                {pinnedLinks.length > 0 && (
                  <div className="pocket-divider">
                    <span className="pocket-title">Main Compartment</span>
                  </div>
                )}
                <div className="links-grid">
                  {unpinnedLinks.map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onEdit={setEditingLink}
                      onDeleteRequest={setDeletingLink}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      {/* Edit Modal */}
      <EditLinkModal
        isOpen={editingLink !== null}
        link={editingLink}
        onClose={() => setEditingLink(null)}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deletingLink !== null}
        itemName={deletingLink ? deletingLink.note || deletingLink.url : ''}
        onClose={() => setDeletingLink(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
