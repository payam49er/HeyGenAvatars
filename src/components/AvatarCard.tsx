import React, { useState, useRef } from 'react';
import { Play, Crown, User, Info } from 'lucide-react';
import { Avatar } from '../types/Avatar';
import { AvatarUtils } from '../services/HeyGenService';

/**
 * Props interface for AvatarCard component
 */
interface AvatarCardProps {
  /** Avatar data to display */
  avatar: Avatar;
  
  /** Callback when avatar details are requested */
  onShowDetails?: (avatarId: string) => void;
}

/**
 * Individual avatar card component
 * Displays avatar preview image, video on hover, and metadata
 */
export const AvatarCard: React.FC<AvatarCardProps> = ({ avatar, onShowDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * Handles video playback on hover
   */
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && !videoError) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        videoRef.current?.play().catch(() => {
          setVideoError(true);
        });
      }, 100);
    }
  };

  /**
   * Handles video pause on mouse leave
   */
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  /**
   * Handles image loading errors
   */
  const handleImageError = () => {
    setImageError(true);
  };

  /**
   * Handles video loading errors
   */
  const handleVideoError = () => {
    setVideoError(true);
  };

  /**
   * Handles details button click
   */
  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowDetails?.(avatar.avatar_id);
  };

  return (
    <div
      className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {/* Preview image */}
        {!imageError ? (
          <img
            src={avatar.preview_image_url}
            alt={avatar.avatar_name}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isHovered && !videoError ? 'opacity-0' : 'opacity-100'
            }`}
          />
        ) : (
          // Fallback when image fails to load
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {AvatarUtils.getAvatarInitials(avatar.avatar_name)}
              </span>
            </div>
          </div>
        )}

        {/* Preview video (shown on hover) */}
        {!videoError && (
          <video
            ref={videoRef}
            src={avatar.preview_video_url}
            onError={handleVideoError}
            muted
            loop
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Play button overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'bg-black/20' : 'bg-black/0'
        }`}>
          <div className={`w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}>
            <Play className="w-5 h-5 text-gray-800 ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Premium badge */}
        {avatar.premium && (
          <div className="absolute top-3 right-3">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium shadow-lg">
              <Crown className="w-3 h-3" />
              Premium
            </div>
          </div>
        )}

        {/* Gender badge */}
        <div className="absolute top-3 left-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${
            avatar.gender === 'female'
              ? 'bg-pink-100 text-pink-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {avatar.gender === 'female' ? '♀' : '♂'} {avatar.gender}
          </div>
        </div>

        {/* Details button */}
        {onShowDetails && (
          <div className="absolute bottom-3 right-3">
            <button
              onClick={handleDetailsClick}
              className={`p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 ${
                isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
              }`}
              title="View details"
            >
              <Info className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        )}
      </div>

      {/* Avatar information */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {AvatarUtils.formatAvatarName(avatar.avatar_name)}
        </h3>
        
        <p className="text-sm text-gray-500 mb-2">
          ID: {avatar.avatar_id}
        </p>

        {/* Additional metadata */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Preview available</span>
          {avatar.default_voice_id && (
            <span>Voice included</span>
          )}
        </div>
      </div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default AvatarCard;