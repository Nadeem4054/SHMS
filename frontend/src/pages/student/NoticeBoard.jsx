import { useState, useEffect } from 'react';
import { 
  FaBullhorn, 
  FaSpinner, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaBell,
  FaCalendar,
  FaUser
} from 'react-icons/fa';
import { noticeService } from '../../services/api';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastViewed, setLastViewed] = useState(null);

  useEffect(() => {
    fetchNotices();
    // Load last viewed time from localStorage
    const stored = localStorage.getItem('noticesLastViewed');
    if (stored) {
      setLastViewed(new Date(stored));
    }
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await noticeService.getAllNotices(true); // Only active notices
      setNotices(response.data);
      // Mark as viewed
      localStorage.setItem('noticesLastViewed', new Date().toISOString());
      setLastViewed(new Date());
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      normal: 'bg-blue-100 text-blue-800 border-blue-200',
      important: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200'
    };
    const icons = {
      normal: FaInfoCircle,
      important: FaExclamationTriangle,
      urgent: FaBell
    };
    const Icon = icons[priority];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[priority]}`}>
        <Icon className="mr-1" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      normal: 'border-blue-200 bg-blue-50',
      important: 'border-orange-200 bg-orange-50',
      urgent: 'border-red-200 bg-red-50'
    };
    return colors[priority] || colors.normal;
  };

  const isNewNotice = (notice) => {
    if (!lastViewed) return false;
    return new Date(notice.createdAt) > lastViewed;
  };

  const getUnreadCount = () => {
    if (!lastViewed) return notices.length;
    return notices.filter(notice => new Date(notice.createdAt) > lastViewed).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <FaBullhorn className="text-2xl text-primary-600" />
            {getUnreadCount() > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {getUnreadCount()}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Notice Board</h2>
            <p className="text-gray-600 mt-1">Stay updated with latest announcements</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {notices.length} {notices.length === 1 ? 'notice' : 'notices'}
          </span>
          {getUnreadCount() > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              {getUnreadCount()} new
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Notices</p>
              <p className="text-2xl font-bold text-gray-800">{notices.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaBullhorn className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Important</p>
              <p className="text-2xl font-bold text-orange-600">{notices.filter(n => n.priority === 'important').length}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaExclamationTriangle className="text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Urgent</p>
              <p className="text-2xl font-bold text-red-600">{notices.filter(n => n.priority === 'urgent').length}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FaBell className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBullhorn className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Notices Available</h3>
            <p className="text-gray-500">Check back later for new announcements</p>
          </div>
        ) : (
          notices.map((notice) => (
            <div 
              key={notice._id} 
              className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${getPriorityColor(notice.priority)} ${
                isNewNotice(notice) ? 'ring-2 ring-primary-200' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaBullhorn className="text-primary-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{notice.title}</h3>
                      {getPriorityBadge(notice.priority)}
                      {isNewNotice(notice) && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap mb-4">{notice.content}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center space-x-1">
                        <FaUser className="text-xs" />
                        <span>{notice.createdBy?.name || 'Admin'}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <FaCalendar className="text-xs" />
                        <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span>•</span>
                      <span>{new Date(notice.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty State for Unread */}
      {getUnreadCount() === 0 && notices.length > 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">You're all caught up! No new notices.</p>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
