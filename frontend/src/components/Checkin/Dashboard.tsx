import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CheckinButton } from './CheckinButton';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCheckinSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => {
      navigate('/history');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">位置情報記録サービス</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/history')}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                履歴
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
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8">
            現在地をチェックイン
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            ボタンを押して、現在地を記録しましょう
          </p>

          <CheckinButton onSuccess={handleCheckinSuccess} />

          <div className="mt-12 bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">使い方</h3>
            <ol className="text-left space-y-2 text-gray-700">
              <li>1. 「チェックイン」ボタンを押します</li>
              <li>2. ブラウザの位置情報許可を求められたら「許可」を選択</li>
              <li>3. 自動的に現在地が記録されます</li>
              <li>4. 「履歴」から過去のチェックインを確認できます</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};
