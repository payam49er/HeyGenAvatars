/**
 * TypeScript interfaces for HeyGen Avatar API response structure
 * Defines the shape of avatar data and API responses
 */

export interface Avatar {
  /** Unique identifier for the avatar */
  avatar_id: string;
  
  /** Display name for the avatar */
  avatar_name: string;
  
  /** Gender classification of the avatar */
  gender: 'male' | 'female';
  
  /** URL to the avatar's preview image */
  preview_image_url: string;
  
  /** URL to the avatar's preview video */
  preview_video_url: string;
  
  /** Whether this is a premium avatar */
  premium: boolean;
  
  /** Avatar type classification */
  type: string | null;
  
  /** Associated tags for the avatar */
  tags: string[] | null;
  
  /** Default voice ID for the avatar */
  default_voice_id: string | null;
}

/**
 * Detailed avatar information from the details API
 */
export interface AvatarDetails {
  /** Unique identifier for the avatar */
  avatar_id: string;
  
  /** Display name for the avatar */
  avatar_name: string;
  
  /** Gender classification of the avatar */
  gender: 'male' | 'female';
  
  /** URL to the avatar's preview image */
  preview_image_url: string;
  
  /** URL to the avatar's preview video */
  preview_video_url: string;
  
  /** Whether this is a premium avatar */
  premium: boolean;
  
  /** Avatar type classification */
  type: string | null;
  
  /** Associated tags for the avatar */
  tags: string[] | null;
  
  /** Default voice ID for the avatar */
  default_voice_id: string | null;
  
  /** Additional details from the details API */
  description?: string;
  
  /** Creation timestamp */
  created_at?: string;
  
  /** Last update timestamp */
  updated_at?: string;
  
  /** Avatar status */
  status?: string;
  
  /** Available languages */
  languages?: string[];
  
  /** Voice options */
  voices?: VoiceOption[];
  
  /** Usage statistics */
  usage_stats?: {
    total_videos: number;
    total_duration: number;
  };
}

/**
 * Voice option interface
 */
export interface VoiceOption {
  voice_id: string;
  voice_name: string;
  language: string;
  gender: 'male' | 'female';
  preview_audio_url?: string;
}

/**
 * Avatar details API response
 */
export interface AvatarDetailsResponse {
  /** Error information, null if successful */
  error: any;
  
  /** Avatar details data */
  data: AvatarDetails;
}

export interface AvatarResponse {
  /** Error information, null if successful */
  error: any;
  
  /** Response data containing avatars array and pagination info */
  data: {
    avatars: Avatar[];
    count: number;
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

/**
 * Avatar group interface for organizing avatars by categories
 */
export interface AvatarGroup {
  /** Unique identifier for the group */
  avatar_group_id: string;
  
  /** Display name for the group */
  title: string;
  
  /** Group description */
  description?: string;
  
  /** Number of avatars in this group */
  avatar_count: number;
  
  /** Whether this is a public group */
  is_public: boolean;
  
  /** Creation timestamp */
  created_at: string;
  
  /** Last update timestamp */
  updated_at: string;
  
  /** Preview image for the group */
  preview_image_url?: string;
}

export interface AvatarGroupResponse {
  /** Error information, null if successful */
  error: any;
  
  /** Response data containing avatar groups array */
  data: {
    avatar_groups: AvatarGroup[];
    count: number;
    total: number;
  };
}

/**
 * Filter options for avatar gallery
 */
export interface FilterOptions {
  gender: 'all' | 'male' | 'female';
  premiumOnly: boolean;
  selectedGroup?: string; // Added group filtering
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  page: number;
  page_size: number;
}