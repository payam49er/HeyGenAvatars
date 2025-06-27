import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, Mic, Globe, Tag, Crown, Play, Pause } from 'lucide-react';
import { AvatarDetails, VoiceOption } from '../types/Avatar';
import { HeyGenService, AvatarUtils } from '../services/HeyGenService';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

/**
 * Props interface for AvatarDetailsModal component
 */
interface AvatarDetailsModalProps {
  /** Avatar ID to fetch details for */
  avatarId: string;
  
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Callback to close the modal */
  onClose: () => void;
}

/**
 * Modal component for displaying detailed avatar information
 * Fetches and displays comprehensive avatar details including voice options and usage stats
 */
export const AvatarDetailsModal: React.FC<AvatarDetailsModalProps> = ({
  avatarId,
  isOpen,
  onClose
}) => {
  const [details, setDetails] = useState<AvatarDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  /**
   * Fetches avatar details when modal opens
   */
  useEffect(() => {
    if (isOpen && avatarId) {
      fetchAvatarDetails();
    }
  }, [isOpen, avatarId]);

  /**
   * Fetches detailed avatar information from the API
   */
  const fetchAvatarDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await HeyGenService.fetchAvatarDetails(avatarId);
      
      if (response.error) {
        throw new Error('Failed to fetch avatar details');
      }
      
      setDetails(response.data);
    } catch (err) {
      console.error('Error fetching avatar details:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles voice preview playback
   */
  const handleVoicePlay = (voiceId: string) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
    } else {
      setPlayingVoice(voiceId);
      // In a real implementation, you would play the audio here
      setTimeout(() => setPlayingVoice(null), 3000); // Simulate 3-second preview
    }
  };

  /**
   * Handles modal close with cleanup
   */
  const handleClose = () => {
    setDetails(null);
    setError(null);
    setPlayingVoice(null);
    onClose();
  };

  /**
   * Handles backdrop click to close modal
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Avatar Details</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="p-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="p-8">
              <ErrorDisplay message={error} onRetry={fetchAvatarDetails} />
            </div>
          ) : details ? (
            <div className="p-6 space-y-6">
              {/* Avatar preview section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Avatar media */}
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={details.preview_image_url}
                      alt={details.avatar_name}
                      className="w-full h-full object-cover"
                    />
                    {details.premium && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium shadow-lg">
                          <Crown className="w-4 h-4" />
                          Premium
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Preview video */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <video
                      src={details.preview_video_url}
                      controls
                      className="w-full h-full object-cover"
                      poster={details.preview_image_url}
                    />
                  </div>
                </div>

                {/* Avatar information */}
                <div className="space-y-6">
                  {/* Basic info */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {AvatarUtils.formatAvatarName(details.avatar_name)}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {details.description || 'Professional AI avatar for your video content.'}
                    </p>
                    
                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">ID:</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {details.avatar_id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">Gender:</span>
                        <span className="capitalize">{details.gender}</span>
                      </div>
                      {details.type && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Type:</span>
                          <span className="capitalize">{details.type}</span>
                        </div>
                      )}
                      {details.status && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Status:</span>
                          <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                            details.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {details.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {details.tags && details.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {details.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {details.languages && details.languages.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Supported Languages
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {details.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Usage statistics */}
                  {details.usage_stats && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Usage Statistics
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {details.usage_stats.total_videos.toLocaleString()}
                          </div>
                          <div className="text-sm text-blue-800">Total Videos</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {AvatarUtils.formatDuration(details.usage_stats.total_duration)}
                          </div>
                          <div className="text-sm text-green-800">Total Duration</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    {details.created_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Created: {AvatarUtils.formatDate(details.created_at)}</span>
                      </div>
                    )}
                    {details.updated_at && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Updated: {AvatarUtils.formatDate(details.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Voice options */}
              {details.voices && details.voices.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    Available Voices ({details.voices.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {details.voices.map((voice) => (
                      <div
                        key={voice.voice_id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{voice.voice_name}</h5>
                          {voice.preview_audio_url && (
                            <button
                              onClick={() => handleVoicePlay(voice.voice_id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              title="Preview voice"
                            >
                              {playingVoice === voice.voice_id ? (
                                <Pause className="w-4 h-4 text-blue-500" />
                              ) : (
                                <Play className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Language: {voice.language}</div>
                          <div className="capitalize">Gender: {voice.gender}</div>
                          <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                            {voice.voice_id}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AvatarDetailsModal;