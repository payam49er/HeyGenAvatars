import React from 'react';
import { Folder, Users, Calendar, Lock, Globe } from 'lucide-react';
import { AvatarGroup } from '../types/Avatar';
import { AvatarUtils } from '../services/HeyGenService';

/**
 * Props interface for GroupCard component
 */
interface GroupCardProps {
  /** Avatar group data to display */
  group: AvatarGroup;
  
  /** Whether this group is currently selected */
  isSelected?: boolean;
  
  /** Callback for group selection */
  onSelect: (groupId: string) => void;
}

/**
 * Individual avatar group card component
 * Displays group information and allows selection
 */
export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  isSelected = false,
  onSelect
}) => {
  /**
   * Handles group card click
   */
  const handleClick = () => {
    onSelect(group.avatar_group_id);
  };

  /**
   * Formats the creation date for display
   */
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative bg-white rounded-xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-200' 
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* Preview image or placeholder */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        {group.preview_image_url ? (
          <img
            src={group.preview_image_url}
            alt={group.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <Folder className="w-8 h-8 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {AvatarUtils.getAvatarInitials(group.title)}
              </span>
            </div>
          </div>
        )}

        {/* Privacy badge */}
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium shadow-sm ${
            group.is_public
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {group.is_public ? (
              <>
                <Globe className="w-3 h-3" />
                Public
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                Private
              </>
            )}
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Group information */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {AvatarUtils.formatGroupTitle(group.title)}
        </h3>
        
        {group.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {AvatarUtils.truncateDescription(group.description, 80)}
          </p>
        )}

        {/* Group metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{group.avatar_count} avatars</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(group.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default GroupCard;