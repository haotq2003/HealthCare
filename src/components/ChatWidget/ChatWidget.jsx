import React, { useState, useEffect, useRef } from 'react';
import { FaRegCommentDots } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';
import Swal from 'sweetalert2';
import './ChatWidget.scss';
import { API_URL } from '../../config/apiURL';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('list'); // 'list' | 'chat'
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  // const [conversations, setConversations] = useState(mockConversations); // No longer used
  // const [messages, setMessages] = useState([]); // No longer used
  // const [qaThreads, setQaThreads] = useState([]); // No longer used
  const [customerList, setCustomerList] = useState([]);
  const [replyInput, setReplyInput] = useState('');
  // State cho lịch sử hỏi đáp của customer
  const [userQA, setUserQA] = useState([]);
  const [isSending, setIsSending] = useState(false);
  // Badge số tin nhắn mới
  const [unreadCount, setUnreadCount] = useState(0);

  // Ref cho chat-body
  const chatBodyRef = useRef(null);

  // Lấy role từ localStorage
  let role = '';
  try {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    role = user?.role || '';
  } catch {}
  const isStaff = role === 'Staff';

  // Fetch QAThreads for staff
  useEffect(() => {
    if (open && isStaff) {
      fetchQAThreads();
    }
    // eslint-disable-next-line
  }, [open, isStaff]);

  const fetchQAThreads = async () => {
    try {
      const res = await fetch(`${API_URL}/api/QAThreads?page=1&size=100`, {
        headers: { 'accept': '*/*' }
      });
      const data = await res.json();
      if (data.success) {
        // Group by customerId
        const grouped = Object.values(
          data.data.items.reduce((acc, item) => {
            if (!acc[item.customerId]) {
              acc[item.customerId] = {
                customerId: item.customerId,
                customerName: item.customerName,
                threads: []
              };
            }
            acc[item.customerId].threads.push(item);
            return acc;
          }, {})
        );
        setCustomerList(grouped);
        // Nếu đang ở view chat, cập nhật lại selected theo customerId
        if (view === 'chat' && selected) {
          const updated = grouped.find(c => c.customerId === selected.customerId);
          if (updated) setSelected(updated);
        }
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể tải danh sách câu hỏi',
        confirmButtonText: 'Đồng ý'
      });
    }
  };

  // Lấy lịch sử hỏi đáp cho customer khi mở chat
  useEffect(() => {
    if (open && !isStaff) {
      fetchUserQA();
    }
    // eslint-disable-next-line
  }, [open, isStaff]);

  const fetchUserQA = async () => {
    let customerId = '';
    let token = '';
    try {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      customerId = user?.id || '';
      token = localStorage.getItem('accessToken') || '';
    } catch {/* ignore parse error */}
    if (!customerId) return;
    try {
      const res = await fetch(`${API_URL}/api/QAThreads?page=1&size=20`, {
        headers: {
          'accept': '*/*',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (data.success) {
        // Lọc chỉ các câu hỏi của customer hiện tại
        setUserQA(data.data.items.filter(item => item.customerId === customerId));
      }
    } catch {/* ignore fetch error */}
  };

  // Auto scroll for customer
  useEffect(() => {
    if (!isStaff && open && chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [userQA, open, isStaff]);

  // Auto scroll for staff
  useEffect(() => {
    if (isStaff && open && chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [selected, open, isStaff]);

  // Auto reload hội thoại mỗi 1s cho staff khi là staff (kể cả khi chat đang đóng)
  useEffect(() => {
    let interval;
    if (isStaff) {
      interval = setInterval(() => {
        fetchQAThreads();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStaff]);

  // Auto reload chat mỗi 1s cho customer (kể cả khi chat đang đóng)
  useEffect(() => {
    let interval;
    if (!isStaff) {
      interval = setInterval(() => {
        fetchUserQA();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStaff]);

  // Tính số tin nhắn mới cho staff
  useEffect(() => {
    // Nếu đang ở view chat, reset badge về 0
    if (open && isStaff && view === 'chat') {
      setUnreadCount(0);
      return;
    }
    // Nếu đang đóng chat hoặc ở view khác, tính lại số câu hỏi chưa trả lời
    if (isStaff && customerList.length > 0) {
      let count = 0;
      customerList.forEach(customer => {
        count += customer.threads.filter(t => !t.answer).length;
      });
      setUnreadCount(count);
    }
  }, [customerList, open, isStaff, view]);

  // Tính số tin nhắn mới cho customer (số answer mới)
  useEffect(() => {
    if (!open && !isStaff && userQA.length > 0) {
      // Lưu lastReadAnswerIds vào localStorage
      const lastRead = JSON.parse(localStorage.getItem('lastReadAnswerIds') || '{}');
      let count = 0;
      userQA.forEach(item => {
        if (item.answer && lastRead[item.id] !== item.answer) count++;
      });
      setUnreadCount(count);
    }
    if (open) setUnreadCount(0);
  }, [userQA, open, isStaff]);

  // Khi customer mở chat, cập nhật lastReadAnswerIds
  useEffect(() => {
    if (open && !isStaff && userQA.length > 0) {
      const lastRead = {};
      userQA.forEach(item => {
        if (item.answer) lastRead[item.id] = item.answer;
      });
      localStorage.setItem('lastReadAnswerIds', JSON.stringify(lastRead));
    }
  }, [open, isStaff, userQA]);

  // Đóng chat khi click ra ngoài chat-widget-box
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      const chatBox = document.querySelector('.chat-widget-box');
      if (chatBox && !chatBox.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Gửi tin nhắn trong giao diện Staff
  const handleSendStaff = async () => {
    if (!replyInput.trim() || !selected) return;
    const unanswered = selected.threads.find(t => !t.answer);
    if (!unanswered) return;
    // Lấy accessToken từ localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi xác thực',
        text: 'Không tìm thấy token xác thực. Vui lòng đăng nhập lại.',
        confirmButtonText: 'Đồng ý'
      });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/QAThreads/answer/customer/${selected.customerId}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ answer: replyInput }),
      });
      if (!res.ok) throw new Error('Gửi câu trả lời thất bại');
      setReplyInput('');
      // Optimistic update: cập nhật selected.threads ngay lập tức
      setSelected(prev => ({
        ...prev,
        threads: prev.threads.map(t =>
          t.id === unanswered.id ? { ...t, answer: replyInput, answeredAt: new Date().toISOString() } : t
        )
      }));
      // Fetch lại để đồng bộ với server
      await fetchQAThreads();
      setTimeout(() => {
        if (chatBodyRef.current) {
          chatBodyRef.current.scrollTo({
            top: chatBodyRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || 'Có lỗi xảy ra khi gửi câu trả lời.',
        confirmButtonText: 'Đồng ý'
      });
    }
  };

  // Gửi tin nhắn trong giao diện chat mini cũ
  const handleSend = async () => {
    if (!input.trim()) return;
    let customerId = '';
    setIsSending(true);
    try {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      customerId = user?.id || '';
    } catch {/* ignore parse error */}
    if (!customerId) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không tìm thấy thông tin người dùng.',
        confirmButtonText: 'Đồng ý'
      });
      setIsSending(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/QAThreads`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
          customerId: customerId,
        }),
      });
      if (!res.ok) throw new Error('Gửi câu hỏi thất bại');
    setInput('');
      await fetchUserQA(); // Tự động cập nhật lịch sử
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || 'Có lỗi xảy ra khi gửi câu hỏi.',
        confirmButtonText: 'Đồng ý'
      });
    }
    setIsSending(false);
  };

  // const currentConv = conversations.find(c => c.id === selected?.id); // No longer used

  // Helper to get first letter of name
  const getInitial = (name) => name ? name.trim().charAt(0).toUpperCase() : '?';

  // Auto update selected when customerList changes (for staff in chat view)
  useEffect(() => {
    if (isStaff && view === 'chat' && selected && customerList.length > 0) {
      const updated = customerList.find(c => c.customerId === selected.customerId);
      if (updated) {
        // So sánh sâu, nếu threads khác thì cập nhật
        const oldThreadIds = (selected.threads || []).map(t => t.id + (t.answer || ''));
        const newThreadIds = (updated.threads || []).map(t => t.id + (t.answer || ''));
        if (oldThreadIds.join(',') !== newThreadIds.join(',')) {
          setSelected(updated);
        }
      }
    }
  }, [customerList, selected, isStaff, view]);

  return (
    <>
      <div className="chat-float-btn" style={{position:'fixed'}} onClick={() => { setOpen(!open); setView('list'); }}>
        <FaRegCommentDots size={32} color="#fff" />
        {unreadCount > 0 && (
          <span className="chat-badge">{unreadCount}</span>
        )}
      </div>
      {open && isStaff && (
        <div className="chat-widget-box staff-list">
          {view === 'list' && (
            <div className="chat-conv-list">
              <div className="chat-header">
                <span>Tất cả khách hàng</span>
                <button onClick={() => setOpen(false)}>×</button>
              </div>
              <div className="conv-list-body">
                {customerList.map(customer => (
                  <div
                    key={customer.customerId}
                    className="conv-item"
                    onClick={() => { setSelected(customer); setView('chat'); }}
                  >
                    <div className="avatar avatar-initial">{getInitial(customer.customerName)}</div>
                    <div className="info">
                      <div className="name">{customer.customerName}</div>
                      <div
                        className="last"
                        style={customer.threads.some(t => !t.answer) ? { fontWeight: 'bolder', color: '#000000' } : {}}
                      >
                        {(() => {
                          // Lấy thread mới nhất theo answeredAt (nếu có), nếu không thì lấy cuối cùng
                          const sorted = [...customer.threads].sort((a, b) => {
                            if (!a.answeredAt && !b.answeredAt) return 0;
                            if (!a.answeredAt) return 1;
                            if (!b.answeredAt) return -1;
                            return new Date(a.answeredAt) - new Date(b.answeredAt);
                          });
                          const latest = sorted[sorted.length-1];
                          // Nếu đã trả lời thì hiển thị answer, chưa thì hiển thị question
                          return latest?.answer ? latest.answer : latest?.question;
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {view === 'chat' && selected && (
            <div className="chat-detail">
              <div className="chat-header">
                <button onClick={() => setView('list')} className="back-btn"><IoChevronBack size={22} /></button>
                <span className="name">{selected.customerName}</span>
                <button onClick={() => setOpen(false)} style={{marginLeft: 'auto'}}>×</button>
              </div>
              <div className="chat-body messenger-style" ref={chatBodyRef}>
                {(() => {
                  // Tạo mảng message: mỗi question và answer là 1 message
                  const messages = [];
                  // Sort threads: item chưa trả lời (answeredAt null) luôn nằm cuối cùng, còn lại sort theo answeredAt tăng dần
                  const sortedThreads = [...selected.threads].sort((a, b) => {
                    if (!a.answeredAt && !b.answeredAt) return 0;
                    if (!a.answeredAt) return 1;
                    if (!b.answeredAt) return -1;
                    return new Date(a.answeredAt) - new Date(b.answeredAt);
                  });
                  sortedThreads.forEach(thread => {
                    messages.push({
                      id: thread.id + '-q',
                      type: 'customer',
                      text: thread.question,
                      name: selected.customerName
                    });
                    if (thread.answer) {
                      messages.push({
                        id: thread.id + '-a',
                        type: 'staff',
                        text: thread.answer,
                        name: 'Staff'
                      });
                    }
                  });
                  return messages.map((msg) => {
                    const isMe = (isStaff && msg.type === 'staff') || (!isStaff && msg.type === 'user');
                    // Staff: mình là staff, tin staff là bên phải, customer là bên trái
                    // Avatar chỉ cho bên gửi đến
                    return (
                      <div
                        key={msg.id}
                        className={`messenger-msg ${isMe ? 'me' : 'them'}`}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          marginBottom: 10,
                          justifyContent: isMe ? 'flex-end' : 'flex-start'
                        }}
                      >
                        {!isMe && (
                          <div className="avatar avatar-initial small-avatar" style={{margin: '0 6px'}}>
                            {getInitial(msg.name)}
                          </div>
                        )}
                        {isMe && <div style={{width:24,margin:'0 6px'}}></div>}
                        <div
                          className="msg-bubble"
                          style={{
                            background: isMe ? '#2563EB' : '#f1f0f0',
                            color: isMe ? '#fff' : '#222',
                            borderRadius: isMe
                              ? '18px 18px 4px 18px'
                              : '18px 18px 18px 4px',
                            padding: '8px 14px',
                            maxWidth: '70%',
                            minWidth: 40,
                            textAlign: 'left',
                            wordBreak: 'break-word',
                            marginLeft: isMe ? 'auto' : 0,
                            marginRight: !isMe ? 'auto' : 0
                          }}
                  >
                    {msg.text}
                        </div>
                  </div>
                    );
                  });
                })()}
              </div>
              <div className="chat-input">
                <input
                  value={replyInput}
                  onChange={e => setReplyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendStaff()}
                  placeholder={(() => {
                    if (!selected) return '';
                    const unanswered = selected.threads.find(t => !t.answer);
                    return unanswered ? 'Nhập câu trả lời...' : 'Không còn câu hỏi cần trả lời';
                  })()}
                  disabled={!selected || !selected.threads.some(t => !t.answer)}
                />
                <button onClick={handleSendStaff} disabled={!selected || !selected.threads.some(t => !t.answer)}>Gửi</button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Các role khác vẫn dùng chat mini cũ */}
      {open && !isStaff && (
        <div className="chat-widget-box">
          <div className="chat-header">
            <span>Hỗ trợ trực tuyến</span>
            <button onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chat-body messenger-style" ref={chatBodyRef}>
            {userQA.length === 0 && (
              <div style={{color:'#888',textAlign:'center',marginTop:24}}>Chưa có câu hỏi nào.</div>
            )}
            {/* Tạo mảng message kiểu Messenger */}
            {(() => {
              // Tạo mảng message: mỗi question và answer là 1 message
              const messages = [];
              const customerName = isStaff && selected ? selected.customerName : (userQA[0]?.customerName || '');
              const staffName = 'Staff';
              const threads = isStaff && selected ? selected.threads : userQA;
              // Sort threads: item chưa trả lời (answeredAt null) luôn nằm cuối cùng, còn lại sort theo answeredAt tăng dần
              const sortedThreads = [...threads].sort((a, b) => {
                if (!a.answeredAt && !b.answeredAt) return 0;
                if (!a.answeredAt) return 1;
                if (!b.answeredAt) return -1;
                return new Date(a.answeredAt) - new Date(b.answeredAt);
              });
              sortedThreads.forEach(item => {
                messages.push({
                  id: item.id + '-q',
                  type: 'question',
                  text: item.question,
                  name: customerName,
                  time: item.createdAt || item.answeredAt
                });
                if (item.answer) {
                  messages.push({
                    id: item.id + '-a',
                    type: 'answer',
                    text: item.answer,
                    name: staffName,
                    time: item.answeredAt
                  });
                }
              });
              return messages.map((msg) => {
                // Xác định phía gửi đi: customer gửi question, staff gửi answer
                let isMine = false;
                if (isStaff) {
                  // Staff: mình gửi answer, nhận question
                  isMine = msg.type === 'answer';
                } else {
                  // Customer: mình gửi question, nhận answer
                  isMine = msg.type === 'question';
                }
                if (isMine) {
                  // Tin nhắn của mình: sát phải, không avatar
                  return (
                    <div
                      key={msg.id}
                      className="messenger-msg my-msg"
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        marginBottom: 10,
                        justifyContent: 'flex-end'
                      }}
                    >
                      <div style={{width:24,margin:'0 6px'}}></div>
                      <div
                        className="msg-bubble"
                        style={{
                          background: '#2563EB',
                          color: '#fff',
                          borderRadius: '18px 18px 4px 18px',
                          padding: '8px 14px',
                          maxWidth: '70%',
                          minWidth: 40,
                          textAlign: 'left',
                          wordBreak: 'break-word',
                          marginLeft: 'auto',
                          marginRight: 0
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                } else {
                  // Tin nhắn đến: sát trái, có avatar
                  return (
                    <div
                      key={msg.id}
                      className="messenger-msg their-msg"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                        justifyContent: 'flex-start'
                      }}
                    >
                      <div className="avatar avatar-initial small-avatar" style={{margin: '0 6px'}}>
                        {getInitial(msg.name)}
                      </div>
                      <div
                        className="msg-bubble"
                        style={{
                          background: '#f1f0f0',
                          color: '#222',
                          borderRadius: '18px 18px 18px 4px',
                          padding: '8px 14px',
                          maxWidth: '70%',
                          minWidth: 40,
                          textAlign: 'left',
                          wordBreak: 'break-word',
                          marginLeft: 0,
                          marginRight: 'auto'
                        }}
              >
                {msg.text}
              </div>
                    </div>
                  );
                }
              });
            })()}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isSending && handleSend()}
              placeholder="Nhập câu hỏi..."
              disabled={isSending}
            />
            <button onClick={handleSend} disabled={isSending}>{isSending ? 'Đang gửi...' : 'Gửi'}</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget; 