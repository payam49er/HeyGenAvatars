import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Avatar, AvatarGroup, FilterOptions, PaginationParams } from '../types/Avatar';
import { HeyGenService } from '../services/HeyGenService';
import AvatarCard from './AvatarCard';
import AvatarDetailsModal from './AvatarDetailsModal';
import FilterControls from './FilterControls';
import PaginationControls from './PaginationControls';
import GroupCard from './GroupCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import { Layers, Grid3X3 } from 'lucide-react';

/**
 * Main avatar gallery component with pagination and group support
 * Manages avatar data fetching, filtering, pagination, group organization, and display
 */
export const AvatarGallery: React.FC = () => {
  // State management
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [groups, setGroups] = useState<AvatarGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'avatars' | 'groups'>('avatars');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    gender: 'all',
    premiumOnly: false
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(20); // Fixed page size

  /**
   * Fetches avatar groups from HeyGen API
   */
  const fetchGroups = useCallback(async () => {
    try {
      setGroupsLoading(true);
      const response = await HeyGenService.fetchAvatarGroups(false);
      
      if (response.error) {
        console.warn('Failed to fetch avatar groups, continuing without groups');
        setGroups([]);
      } else {
        setGroups(response.data.avatar_groups);
      }
    } catch (err) {
      console.warn('Error fetching avatar groups:', err);
      setGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  }, []);

  /**
   * Fetches avatar data from HeyGen API with pagination and group filtering
   * @param page - Page number to fetch
   * @param resetPage - Whether to reset to first page (used for filter changes)
   */
  const fetchAvatars = useCallback(async (page: number = currentPage, resetPage: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const paginationParams: PaginationParams = {
        page: resetPage ? 1 : page,
        page_size: pageSize
      };
      
      const response = await HeyGenService.fetchAvatars(paginationParams, filters.selectedGroup);
      
      if (response.error) {
        throw new Error('Failed to fetch avatars from API');
      }
      
      setAvatars(response.data.avatars);
      setTotalPages(response.data.total_pages);
      setTotalItems(response.data.total);
      
      if (resetPage) {
        setCurrentPage(1);
      } else {
        setCurrentPage(response.data.page);
      }
    } catch (err) {
      console.error('Error fetching avatars:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters.selectedGroup]);

  // Load groups and avatars on component mount
  useEffect(() => {
    fetchGroups();
    fetchAvatars(1, true);
  }, []);

  // Refetch avatars when group selection changes
  useEffect(() => {
    if (!groupsLoading) {
      fetchAvatars(1, true);
    }
  }, [filters.selectedGroup]);

  /**
   * Filtered avatars based on current filter state
   * Note: In a real implementation, filters would be applied server-side
   * This client-side filtering is for demonstration purposes
   */
  const filteredAvatars = useMemo(() => {
    if (!avatars) return [];
    
    return avatars.filter(avatar => {
      // Gender filter
      if (filters.gender !== 'all' && avatar.gender !== filters.gender) {
        return false;
      }
      
      // Premium filter
      if (filters.premiumOnly && !avatar.premium) {
        return false;
      }
      
      return true;
    });
  }, [avatars, filters]);

  /**
   * Handles filter changes from FilterControls component
   * Resets to first page when filters change
   */
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // In a real implementation, you would fetch new data with filters applied server-side
    // For now, we'll just apply client-side filtering
  };

  /**
   * Handles group selection changes
   */
  const handleGroupChange = (groupId?: string) => {
    setFilters(prev => ({ ...prev, selectedGroup: groupId }));
  };

  /**
   * Handles group selection from group cards
   */
  const handleGroupSelect = (groupId: string) => {
    setFilters(prev => ({ ...prev, selectedGroup: groupId }));
    setViewMode('avatars');
  };

  /**
   * Handles page changes from PaginationControls component
   */
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      fetchAvatars(page);
      // Scroll to top of gallery when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Handles retry action from ErrorDisplay component
   */
  const handleRetry = () => {
    if (viewMode === 'groups') {
      fetchGroups();
    } else {
      fetchAvatars(currentPage);
    }
  };

  /**
   * Handles view mode toggle
   */
  const handleViewModeChange = (mode: 'avatars' | 'groups') => {
    setViewMode(mode);
  };

  /**
   * Handles avatar details modal
   */
  const handleShowAvatarDetails = (avatarId: string) => {
    setSelectedAvatarId(avatarId);
  };

  /**
   * Handles closing avatar details modal
   */
  const handleCloseAvatarDetails = () => {
    setSelectedAvatarId(null);
  };

  // Loading state for initial load
  if ((loading && (!avatars || avatars.length === 0)) || (groupsLoading && (!groups || groups.length === 0) && viewMode === 'groups')) {
    return <LoadingSpinner />;
  }

  // Error state for initial load
  if (error && (!avatars || avatars.length === 0) && viewMode === 'avatars') {
    return <ErrorDisplay message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-6">
      {/* View mode toggle */}
      <div className="flex items-center justify-center">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
          <button
            onClick={() => handleViewModeChange('avatars')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
              viewMode === 'avatars'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            Browse Avatars
          </button>
          <button
            onClick={() => handleViewModeChange('groups')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2 border-l border-gray-200 ${
              viewMode === 'groups'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            Browse Groups ({groups ? groups.length : 0})
          </button>
        </div>
      </div>

      {viewMode === 'groups' ? (
        /* Groups view */
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Avatar Groups
            </h2>
            <p className="text-gray-600">
              Organize your avatars by categories and themes. Select a group to browse its avatars.
            </p>
          </div>

          {groups && groups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <GroupCard
                  key={group.avatar_group_id}
                  group={group}
                  isSelected={filters.selectedGroup === group.avatar_group_id}
                  onSelect={handleGroupSelect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Groups Available
              </h3>
              <p className="text-gray-600 mb-4">
                No avatar groups were found. You can still browse all avatars.
              </p>
              <button
                onClick={() => handleViewModeChange('avatars')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
              >
                Browse All Avatars
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Avatars view */
        <div className="space-y-6">
          {/* Filter controls */}
          <FilterControls
            filters={filters}
            onFiltersChange={handleFiltersChange}
            groups={groups || []}
            onGroupChange={handleGroupChange}
            totalCount={totalItems}
            currentPageCount={filteredAvatars.length}
            currentPage={currentPage}
            totalPages={totalPages}
            loading={loading}
          />

          {/* Loading overlay for page changes */}
          {loading && avatars && avatars.length > 0 && (
            <div className="relative">
              <div className="absolute inset-0 bg-white/75 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-gray-600 font-medium">Loading page {currentPage}...</span>
                </div>
              </div>
            </div>
          )}

          {/* Avatar grid */}
          {filteredAvatars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAvatars.map((avatar) => (
                <AvatarCard 
                  key={avatar.avatar_id} 
                  avatar={avatar} 
                  onShowDetails={handleShowAvatarDetails}
                />
              ))}
            </div>
          ) : (!avatars || avatars.length === 0) && !loading ? (
            // Empty state
            <ErrorDisplay 
              message="No avatars found. Please try again later." 
              onRetry={handleRetry}
            />
          ) : (
            // No results state (when filters are applied)
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No avatars match your filters
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filter settings to see more results.
              </p>
              <button
                onClick={() => setFilters({ gender: 'all', premiumOnly: false })}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </div>
      )}

      {/* Avatar Details Modal */}
      {selectedAvatarId && (
        <AvatarDetailsModal
          avatarId={selectedAvatarId}
          isOpen={!!selectedAvatarId}
          onClose={handleCloseAvatarDetails}
        />
      )}
    </div>
  );
};

export default AvatarGallery;