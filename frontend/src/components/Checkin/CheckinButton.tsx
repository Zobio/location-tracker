import { useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { checkinApi } from '@/services/api';

interface CheckinButtonProps {
  onSuccess?: () => void;
}

export const CheckinButton = ({ onSuccess }: CheckinButtonProps) => {
  const { latitude, longitude, error, loading, getLocation } = useGeolocation();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckin = async () => {
    setMessage('');

    getLocation();

    if (latitude && longitude) {
      try {
        setSubmitting(true);
        await checkinApi.create({
          latitude,
          longitude,
          checked_at: new Date().toISOString(),
        });
        setMessage('チェックインしました！');
        onSuccess?.();
      } catch (err: any) {
        setMessage(err.response?.data?.detail || 'チェックインに失敗しました');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleCheckin}
        disabled={loading || submitting}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg disabled:opacity-50 transition-all transform hover:scale-105"
      >
        {loading || submitting ? '処理中...' : '📍 チェックイン'}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded max-w-md">
          {message}
        </div>
      )}

      {latitude && longitude && !submitting && (
        <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded">
          位置: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </div>
      )}
    </div>
  );
};
