import { useState, useEffect } from 'react';
import { 
  FaPaperPlane, 
  FaHistory, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaUserFriends,
  FaEnvelope,
  FaPhone,
  FaRedo
} from 'react-icons/fa';
import { leaveService } from '../../services/api';
import { toast } from 'react-toastify';

const LeaveRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'

  const [formData, setFormData] = useState({
    leaveType: 'Day Outing',
    fromDate: '',
    toDate: '',
    destination: '',
    reason: '',
    guardianName: '',
    guardianEmail: '',
    guardianContact: ''
  });

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const response = await leaveService.getMyLeaveRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to load leave history');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await leaveService.submitLeaveRequest(formData);
      toast.success('Leave request submitted successfully!');
      setFormData({
        leaveType: 'Day Outing',
        fromDate: '',
        toDate: '',
        destination: '',
        reason: '',
        guardianName: '',
        guardianEmail: '',
        guardianContact: ''
      });
      fetchMyLeaves();
      setActiveTab('history');
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReapply = (request) => {
    setFormData({
      leaveType: request.leaveType,
      fromDate: '',
      toDate: '',
      destination: request.destination,
      reason: request.reason,
      guardianName: request.guardianName,
      guardianEmail: request.guardianEmail,
      guardianContact: request.guardianContact
    });
    setActiveTab('new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
      Approved: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200',
      Rejected: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
    };
    const icons = {
      Pending: FaClock,
      Approved: FaCheckCircle,
      Rejected: FaTimesCircle
    };
    const Icon = icons[status] || FaClock;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        <Icon className="mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
          Leave / Outing Request
        </h2>
        <div className="flex bg-white dark:bg-dark-surface p-1 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              activeTab === 'new' 
                ? 'bg-primary-600 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover'
            }`}
          >
            <FaPaperPlane className="text-sm" />
            <span>New Request</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              activeTab === 'history' 
                ? 'bg-primary-600 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover'
            }`}
          >
            <FaHistory className="text-sm" />
            <span>History</span>
          </button>
        </div>
      </div>

      {activeTab === 'new' ? (
        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-md overflow-hidden transition-colors duration-300 border border-gray-100 dark:border-dark-border">
          <div className="p-6 border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-hover/30">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Submit New request</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details below to request for leave or outing.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Leave Details</h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Leave Type</label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="Day Outing">Day Outing</option>
                    <option value="Overnight">Overnight</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From Date</label>
                    <input
                      type="datetime-local"
                      name="fromDate"
                      value={formData.fromDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To Date</label>
                    <input
                      type="datetime-local"
                      name="toDate"
                      value={formData.toDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Destination</label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Home, Karachi, Library"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="Briefly explain the reason for your leave"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  ></textarea>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Guardian Info</h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Guardian Name</label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Guardian Email</label>
                  <input
                    type="email"
                    name="guardianEmail"
                    value={formData.guardianEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Guardian Contact</label>
                  <input
                    type="tel"
                    name="guardianContact"
                    value={formData.guardianContact}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800/30">
                  <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start">
                    <span className="mr-2 mt-0.5">ℹ️</span>
                    An automated email will be sent to your guardian upon approval of this leave request.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-dark-border">
              <button
                type="submit"
                disabled={submitting}
                className={`px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-primary-500/30 hover:bg-primary-700 transform hover:-translate-y-0.5 transition-all flex items-center space-x-2 ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-dark-surface h-48 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
              <FaHistory className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No leave requests found</p>
              <button 
                onClick={() => setActiveTab('new')}
                className="mt-4 text-primary-600 hover:underline text-sm font-semibold"
              >
                Submit your first request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requests.map((request) => (
                <div 
                  key={request._id}
                  className="bg-white dark:bg-dark-surface rounded-xl shadow-md border border-gray-100 dark:border-dark-border overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-white text-lg">{request.leaveType}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Submitted on {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FaCalendarAlt className="mr-2 text-primary-500" />
                        <span>
                          {new Date(request.fromDate).toLocaleDateString()} - {new Date(request.toDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FaMapMarkerAlt className="mr-2 text-primary-500" />
                        <span>{request.destination}</span>
                      </div>
                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                        <span className="mr-2 text-primary-500">📝</span>
                        <span className="line-clamp-2 italic">"{request.reason}"</span>
                      </div>
                    </div>

                    {request.status === 'Rejected' && (
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">REJECTION REASON:</p>
                        <p className="text-sm text-red-700 dark:text-red-300">{request.adminRemarks}</p>
                        <button
                          onClick={() => handleReapply(request)}
                          className="mt-3 flex items-center space-x-1 text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          <FaRedo className="text-xs" />
                          <span>Re-apply with Changes</span>
                        </button>
                      </div>
                    )}

                    {request.status === 'Approved' && (request.adminRemarks) && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                        <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-1">ADMIN REMARKS:</p>
                        <p className="text-sm text-green-700 dark:text-green-300">{request.adminRemarks}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-5 py-3 bg-gray-50 dark:bg-dark-hover/30 border-t border-gray-100 dark:border-dark-border flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <FaUserFriends className="mr-1" /> {request.guardianName}
                    </span>
                    <span className="flex items-center">
                      <FaPhone className="mr-1" /> {request.guardianContact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;
