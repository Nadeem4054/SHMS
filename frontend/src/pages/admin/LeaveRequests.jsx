import { useState, useEffect } from 'react';
import { 
  FaCheck, 
  FaTimes, 
  FaFilter, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUserFriends, 
  FaEnvelope, 
  FaPhone,
  FaBed,
  FaUser,
  FaSearch,
  FaSpinner
} from 'react-icons/fa';
import { leaveService } from '../../services/api';
import { toast } from 'react-toastify';

const AdminLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(null);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await leaveService.getAllLeaveRequests(filter);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setProcessing(id);
      const adminRemarks = remarks[id] || 'Approved by Admin';
      await leaveService.approveLeaveRequest(id, adminRemarks);
      toast.success('Leave request approved and guardian notified!');
      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    const adminRemarks = remarks[id];
    if (!adminRemarks) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(id);
      await leaveService.rejectLeaveRequest(id, adminRemarks);
      toast.success('Leave request rejected');
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    } finally {
      setProcessing(null);
    }
  };

  const handleRemarkChange = (id, value) => {
    setRemarks(prev => ({ ...prev, [id]: value }));
  };

  const filteredRequests = requests.filter(req => 
    req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Approved': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'Rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
          Leave Management
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {['All', 'Pending', 'Approved', 'Rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'bg-white dark:bg-dark-surface text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover border border-gray-200 dark:border-dark-border'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by student name, room, or destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-4xl text-primary-600" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="bg-gray-100 dark:bg-dark-hover w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaFilter className="text-gray-400 text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">No requests found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try changing your filters or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredRequests.map((request) => (
            <div 
              key={request._id}
              className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Column: Student & Leave Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                          {request.studentName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 dark:text-white text-lg">{request.studentName}</h3>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FaBed className="mr-1 text-primary-500" /> Room {request.roomNumber}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-dark-hover/30 p-4 rounded-xl">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <span className="w-24 text-gray-500 dark:text-gray-400 font-medium uppercase text-[10px]">Type:</span>
                          <span className="font-semibold text-gray-800 dark:text-white">{request.leaveType}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="w-24 text-gray-500 dark:text-gray-400 font-medium uppercase text-[10px]">Dates:</span>
                          <span className="text-gray-800 dark:text-white">
                            {new Date(request.fromDate).toLocaleDateString()} - {new Date(request.toDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="w-24 text-gray-500 dark:text-gray-400 font-medium uppercase text-[10px]">Destination:</span>
                          <span className="text-gray-800 dark:text-white">{request.destination}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400 font-medium uppercase text-[10px] mb-1">Reason:</span>
                        <p className="text-sm text-gray-800 dark:text-white italic bg-white dark:bg-dark-surface p-2 rounded border border-gray-100 dark:border-dark-border">
                          "{request.reason}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Guardian Info */}
                  <div className="lg:w-1/4 space-y-3 lg:border-l lg:pl-6 border-gray-100 dark:border-dark-border">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guardian Info</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <FaUserFriends className="mr-2 text-primary-500 w-4" />
                        <span className="truncate">{request.guardianName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <FaEnvelope className="mr-2 text-primary-500 w-4" />
                        <span className="truncate">{request.guardianEmail}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <FaPhone className="mr-2 text-primary-500 w-4" />
                        <span>{request.guardianContact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions (for Pending only) */}
                  {request.status === 'Pending' && (
                    <div className="lg:w-1/4 space-y-4 lg:border-l lg:pl-6 border-gray-100 dark:border-dark-border">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Remarks / Rejection Reason</label>
                        <textarea
                          placeholder="Write remarks here... (required for rejection)"
                          value={remarks[request._id] || ''}
                          onChange={(e) => handleRemarkChange(request._id, e.target.value)}
                          className="w-full text-sm p-3 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all h-24 resize-none"
                        ></textarea>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request._id)}
                          disabled={processing === request._id}
                          className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/20"
                        >
                          {processing === request._id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          disabled={processing === request._id}
                          className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-500/20"
                        >
                          {processing === request._id ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Show Remarks for non-pending */}
                  {request.status !== 'Pending' && request.adminRemarks && (
                    <div className="lg:w-1/4 lg:border-l lg:pl-6 border-gray-100 dark:border-dark-border">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Admin Remarks</h4>
                        <div className={`p-4 rounded-xl text-sm italic ${
                          request.status === 'Approved' ? 'bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-300 border border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-300 border border-red-100 dark:border-red-900/30'
                        }`}>
                          "{request.adminRemarks}"
                        </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLeaveRequests;
