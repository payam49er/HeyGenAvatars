import { AvatarResponse, AvatarGroupResponse, AvatarDetailsResponse, PaginationParams } from '../types/Avatar';

/**
 * Service class for HeyGen API interactions
 * Handles all API calls and data fetching operations
 */
export class HeyGenService {
  private static readonly API_BASE_URL = 'https://api.heygen.com/v2';
  private static readonly API_KEY = 'YzEwY2M3ZTBjMGMzNGJjNmFlMDY1ZTU2YjczMzU0ZmMtMTc1MTA1NzAwMQ==';
  private static readonly DEFAULT_PAGE_SIZE = 20;

  /**
   * Fetches avatars from HeyGen API with pagination support
   * @param params - Pagination parameters (page and page_size)
   * @param groupId - Optional group ID to filter avatars by group
   * @returns Promise<AvatarResponse> - Avatar data with pagination info or error information
   */
  static async fetchAvatars(
    params: PaginationParams = { page: 1, page_size: this.DEFAULT_PAGE_SIZE },
    groupId?: string
  ): Promise<AvatarResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        page_size: params.page_size.toString()
      });

      // Add group filter if specified
      if (groupId) {
        queryParams.append('avatar_group_id', groupId);
      }

      const response = await fetch(`${this.API_BASE_URL}/avatars?${queryParams}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-api-key': this.API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AvatarResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching avatars:', error);
      
      // Fallback to mock data for development/demo purposes
      return this.getMockAvatarData(params, groupId);
    }
  }

  /**
   * Fetches avatar groups from HeyGen API
   * @param includePublic - Whether to include public groups (default: false)
   * @returns Promise<AvatarGroupResponse> - Avatar groups data or error information
   */
  static async fetchAvatarGroups(includePublic: boolean = false): Promise<AvatarGroupResponse> {
    try {
      const queryParams = new URLSearchParams({
        include_public: includePublic.toString()
      });

      const response = await fetch(`${this.API_BASE_URL}/avatar_group.list?${queryParams}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-api-key': this.API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AvatarGroupResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching avatar groups:', error);
      
      // Fallback to mock data for development/demo purposes
      return this.getMockGroupData();
    }
  }

  /**
   * Fetches detailed information for a specific avatar
   * @param avatarId - The ID of the avatar to fetch details for
   * @returns Promise<AvatarDetailsResponse> - Detailed avatar information or error
   */
  static async fetchAvatarDetails(avatarId: string): Promise<AvatarDetailsResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/avatar/${avatarId}/details`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-api-key': this.API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AvatarDetailsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching avatar details:', error);
      
      // Fallback to mock data for development/demo purposes
      return this.getMockAvatarDetails(avatarId);
    }
  }

  /**
   * Provides mock avatar data as fallback when API is unavailable
   * Simulates pagination behavior for development
   * @param params - Pagination parameters
   * @param groupId - Optional group ID filter
   * @returns Promise<AvatarResponse> - Mock avatar data with pagination
   */
  private static async getMockAvatarData(params: PaginationParams, groupId?: string): Promise<AvatarResponse> {
    // Simulate a larger dataset for pagination testing
    const allMockAvatars = [
      {
        avatar_id: "Abigail_expressive_2024112501",
        avatar_name: "Abigail (Upper Body)",
        gender: "female" as const,
        preview_image_url: "https://files2.heygen.ai/avatar/v3/1ad51ab9fee24ae88af067206e14a1d8_44250/preview_target.webp",
        preview_video_url: "https://files2.heygen.ai/avatar/v3/1ad51ab9fee24ae88af067206e14a1d8_44250/preview_video_target.mp4",
        premium: false,
        type: null,
        tags: null,
        default_voice_id: null
      },
      {
        avatar_id: "Abigail_standing_office_front",
        avatar_name: "Abigail Office Front",
        gender: "female" as const,
        preview_image_url: "https://files2.heygen.ai/avatar/v3/463208b6cad140d2b263535826838e3a_39240/preview_target.webp",
        preview_video_url: "https://files2.heygen.ai/avatar/v3/463208b6cad140d2b263535826838e3a_39240/preview_video_target.mp4",
        premium: false,
        type: null,
        tags: null,
        default_voice_id: null
      },
      {
        avatar_id: "Abigail_standing_office_side",
        avatar_name: "Abigail Office Side",
        gender: "female" as const,
        preview_image_url: "https://files2.heygen.ai/avatar/v3/9886d46db7f24260bb219c756ca0d759_39250/preview_target.webp",
        preview_video_url: "https://files2.heygen.ai/avatar/v3/9886d46db7f24260bb219c756ca0d759_39250/preview_video_target.mp4",
        premium: false,
        type: null,
        tags: null,
        default_voice_id: null
      },
      // Add more mock avatars to simulate pagination
      ...Array.from({ length: 50 }, (_, i) => ({
        avatar_id: `mock_avatar_${i + 4}`,
        avatar_name: `Avatar ${i + 4}`,
        gender: (i % 2 === 0 ? "male" : "female") as const,
        preview_image_url: "https://files2.heygen.ai/avatar/v3/1ad51ab9fee24ae88af067206e14a1d8_44250/preview_target.webp",
        preview_video_url: "https://files2.heygen.ai/avatar/v3/1ad51ab9fee24ae88af067206e14a1d8_44250/preview_video_target.mp4",
        premium: i % 5 === 0, // Every 5th avatar is premium
        type: null,
        tags: null,
        default_voice_id: null
      }))
    ];

    // Filter by group if specified (mock implementation)
    let filteredAvatars = allMockAvatars;
    if (groupId && groupId !== 'all') {
      // Simulate group filtering by taking a subset based on group ID
      const groupIndex = parseInt(groupId.replace('group_', '')) || 1;
      const startIndex = (groupIndex - 1) * 15;
      const endIndex = startIndex + 15;
      filteredAvatars = allMockAvatars.slice(startIndex, endIndex);
    }

    // Simulate pagination
    const startIndex = (params.page - 1) * params.page_size;
    const endIndex = startIndex + params.page_size;
    const paginatedAvatars = filteredAvatars.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredAvatars.length / params.page_size);

    return {
      error: null,
      data: {
        avatars: paginatedAvatars,
        count: paginatedAvatars.length,
        total: filteredAvatars.length,
        page: params.page,
        page_size: params.page_size,
        total_pages: totalPages
      }
    };
  }

  /**
   * Provides mock avatar group data as fallback when API is unavailable
   * @returns Promise<AvatarGroupResponse> - Mock avatar group data
   */
  private static async getMockGroupData(): Promise<AvatarGroupResponse> {
    const mockGroups = [
      {
        avatar_group_id: "group_1",
        title: "Business Professionals",
        description: "Professional avatars for corporate presentations and business content",
        avatar_count: 15,
        is_public: true,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-20T14:30:00Z",
        preview_image_url: "https://files2.heygen.ai/avatar/v3/1ad51ab9fee24ae88af067206e14a1d8_44250/preview_target.webp"
      },
      {
        avatar_group_id: "group_2",
        title: "Casual & Friendly",
        description: "Approachable avatars perfect for educational content and casual presentations",
        avatar_count: 12,
        is_public: true,
        created_at: "2024-01-10T09:15:00Z",
        updated_at: "2024-01-18T16:45:00Z",
        preview_image_url: "https://files2.heygen.ai/avatar/v3/463208b6cad140d2b263535826838e3a_39240/preview_target.webp"
      },
      {
        avatar_group_id: "group_3",
        title: "Healthcare & Medical",
        description: "Professional medical avatars for healthcare communications",
        avatar_count: 8,
        is_public: true,
        created_at: "2024-01-12T11:20:00Z",
        updated_at: "2024-01-22T13:10:00Z",
        preview_image_url: "https://files2.heygen.ai/avatar/v3/9886d46db7f24260bb219c756ca0d759_39250/preview_target.webp"
      },
      {
        avatar_group_id: "group_4",
        title: "Creative & Artistic",
        description: "Unique and creative avatars for artistic and innovative content",
        avatar_count: 10,
        is_public: false,
        created_at: "2024-01-08T15:30:00Z",
        updated_at: "2024-01-25T10:20:00Z"
      }
    ];

    return {
      error: null,
      data: {
        avatar_groups: mockGroups,
        count: mockGroups.length,
        total: mockGroups.length
      }
    };
  }

  /**
   * Provides mock avatar details data as fallback when API is unavailable
   * @param avatarId - The avatar ID to generate mock details for
   * @returns Promise<AvatarDetailsResponse> - Mock avatar details data
   */
  private static async getMockAvatarDetails(avatarId: string): Promise<AvatarDetailsResponse> {
    const mockDetails = {
      avatar_id: avatarId,
      avatar_name: avatarId.includes('Abigail') ? 'Abigail Professional' : 'Professional Avatar',
      gender: avatarId.includes('female') || avatarId.includes('Abigail') ? 'female' as const : 'male' as const,
      preview_image_url: "https://files2.heygen.ai/avatar/v3/1ad51ab9fee24ae88af067206e14a1d8_44250/preview_target.webp",
      preview_video_url: "https://files2.heygen.ai/avatar/v3/1ad51ab9fee24ae88af067206e14a1d8_44250/preview_video_target.mp4",
      premium: false,
      type: "professional",
      tags: ["business", "professional", "corporate"],
      default_voice_id: "voice_001",
      description: "A professional avatar perfect for business presentations and corporate communications. Features natural expressions and professional attire.",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-20T14:30:00Z",
      status: "active",
      languages: ["en-US", "en-GB", "es-ES", "fr-FR"],
      voices: [
        {
          voice_id: "voice_001",
          voice_name: "Professional Female",
          language: "en-US",
          gender: "female" as const,
          preview_audio_url: "https://example.com/voice_preview.mp3"
        },
        {
          voice_id: "voice_002",
          voice_name: "Business Casual",
          language: "en-US",
          gender: "female" as const,
          preview_audio_url: "https://example.com/voice_preview2.mp3"
        }
      ],
      usage_stats: {
        total_videos: 1250,
        total_duration: 45600 // in seconds
      }
    };

    return {
      error: null,
      data: mockDetails
    };
  }
}

/**
 * Utility functions for avatar data processing
 */
export class AvatarUtils {
  /**
   * Formats avatar name for display
   * @param name - Raw avatar name
   * @returns Formatted display name
   */
  static formatAvatarName(name: string): string {
    return name.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  /**
   * Generates avatar initials for fallback display
   * @param name - Avatar name
   * @returns Two-letter initials
   */
  static getAvatarInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Formats avatar group title for display
   * @param title - Raw group title
   * @returns Formatted display title
   */
  static formatGroupTitle(title: string): string {
    return title.trim();
  }

  /**
   * Gets a short description for a group
   * @param description - Full description
   * @param maxLength - Maximum length for truncation
   * @returns Truncated description
   */
  static truncateDescription(description: string | undefined, maxLength: number = 100): string {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
  }

  /**
   * Formats duration from seconds to human readable format
   * @param seconds - Duration in seconds
   * @returns Formatted duration string
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  /**
   * Formats date for display
   * @param dateString - ISO date string
   * @returns Formatted date string
   */
  static formatDate(dateString: string): string {
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
  }
}