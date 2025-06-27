import React from 'react';
import { Filter, Users, User } from 'lucide-react';
import { FilterOptions, AvatarGroup } from '../types/Avatar';
import GroupSelector from './GroupSelector';

/**
 * Props interface for FilterControls component
 */
interface FilterControlsProps {
  /** Current filter state */
  filters: FilterOptions;
  
  /** Callback for filter changes */
  onFiltersChange: (filters: FilterOptions) => void;
  
  /** Available avatar groups */
  groups: AvatarGroup[];
  
  /** Callback for group selection changes */
  onGroupChange: (groupId?: string) => void;
  
  /** Total count of avatars across all pages */
  totalCount: number;
  
  /** Count of avatars on current page */
  currentPageCount: number;
  
  /** Current page number */
  currentPage: number;
  
  /** Total number of pages */
  totalPages: number;
  
  /** Loading state */
  loading?: boolean;
}

/**
 * Filter controls component for avatar gallery
 * Provides gender filtering, premium filter options, and group selection with pagination info
 */
export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFiltersChange,
  groups,
  onGroupChange,
  totalCount,
  currentPageCount,
  currentPage,
  totalPages,
  loading = false
}) => {
  /**
   * Handles gender filter changes
   * @param gender - Selected gender filter value
   */
  const handleGenderChange = (gender: 'all' | 'male' | 'female') => {
    onFiltersChange({ ...filters, gender });
  };

  /**
   * Handles premium filter toggle
   */
  const handlePremiumToggle = () => {
    onFiltersChange({ ...filters, premiumOnly: !filters.premiumOnly });
  };

  /**
   * Gets the selected group name for display
   */
  const getSelectedGroupName = (): string => {
    if (!filters.selectedGroup) return 'All Groups';
    const selectedGroup = groups.find(g => g.avatar_group_id === filters.selectedGroup);
    return selectedGroup ? selectedGroup.title : 'Unknown Group';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="space-y-4">
        {/* Filter header with pagination info */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Filter Avatars</h3>
            <span className="text-sm text-gray-500">
              ({currentPageCount} on page {currentPage} of {totalPages} • {totalCount} total)
            </span>
          </div>

          {/* Active filters summary */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Showing:</span>
            <span className="font-medium">{getSelectedGroupName()}</span>
            {filters.gender !== 'all' && (
              <>
                <span>•</span>
                <span className="font-medium capitalize">{filters.gender}</span>
              </>
            )}
            {filters.premiumOnly && (
              <>
                <span>•</span>
                <span className="font-medium">Premium Only</span>
              </>
            )}
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center justify-between flex-wrap gap-6">
          {/* Group selector */}
          <GroupSelector
            groups={groups}
            selectedGroup={filters.selectedGroup}
            onGroupChange={onGroupChange}
            loading={loading}
          />

          <div className="flex items-center gap-6">
            {/* Gender filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Gender:</span>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => handleGenderChange('all')}
                  disabled={loading}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 disabled:opacity-50 ${
                    filters.gender === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  All
                </button>
                <button
                  onClick={() => handleGenderChange('male')}
                  disabled={loading}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 border-l border-gray-200 disabled:opacity-50 ${
                    filters.gender === 'male'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Male
                </button>
                <button
                  onClick={() => handleGenderChange('female')}
                  disabled={loading}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 border-l border-gray-200 disabled:opacity-50 ${
                    filters.gender === 'female'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Female
                </button>
              </div>
            </div>

            {/* Premium filter */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.premiumOnly}
                onChange={handlePremiumToggle}
                disabled={loading}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
              <span className="text-sm font-medium text-gray-700">Premium Only</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;