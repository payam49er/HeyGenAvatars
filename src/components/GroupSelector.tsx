import React from 'react';
import { Folder, FolderOpen, Users } from 'lucide-react';
import { AvatarGroup } from '../types/Avatar';

/**
 * Props interface for GroupSelector component
 */
interface GroupSelectorProps {
  /** Available avatar groups */
  groups: AvatarGroup[];
  
  /** Currently selected group ID */
  selectedGroup?: string;
  
  /** Callback for group selection changes */
  onGroupChange: (groupId?: string) => void;
  
  /** Loading state */
  loading?: boolean;
}

/**
 * Group selector component for filtering avatars by group
 * Provides a dropdown interface for selecting avatar groups
 */
export const GroupSelector: React.FC<GroupSelectorProps> = ({
  groups,
  selectedGroup,
  onGroupChange,
  loading = false
}) => {
  /**
   * Handles group selection change
   */
  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onGroupChange(value === 'all' ? undefined : value);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Folder className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Group:</span>
      </div>
      
      <div className="relative">
        <select
          value={selectedGroup || 'all'}
          onChange={handleGroupChange}
          disabled={loading}
          className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <option value="all">All Groups</option>
          {groups.map((group) => (
            <option key={group.avatar_group_id} value={group.avatar_group_id}>
              {group.title} ({group.avatar_count} avatars)
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GroupSelector;