import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkinApi } from '@/services/api';
import type { Checkin } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export const History = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    try {
      setLoading(true);
      const data = await checkinApi.getAll();
      setCheckins(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('このチェックインを削除しますか？')) {
      return;
    }

    try {
      await checkinApi.delete(id);
      setCheckins(checkins.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.detail || '削除に失敗しました');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (checkin: Checkin) => {
    const parts = [];
    if (checkin.prefecture) parts.push(checkin.prefecture);
    if (checkin.city) parts.push(checkin.city);
    if (checkin.address_detail) parts.push(checkin.address_detail);

    return parts.length > 0 ? parts.join('') : '住所情報なし';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">チェックイン履歴</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                ホーム
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center">
            <div className="text-gray-600">読み込み中...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : checkins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">チェックイン履歴がありません</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
            >
              チェックインする
            </button>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {checkins.map((checkin) => (
                <li key={checkin.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-indigo-600">
                            {formatDate(checkin.checked_at)}
                          </p>
                          <button
                            onClick={() => handleDelete(checkin.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            削除
                          </button>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-900">
                            📍 {formatAddress(checkin)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            緯度: {checkin.latitude.toFixed(6)}, 経度: {checkin.longitude.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};
