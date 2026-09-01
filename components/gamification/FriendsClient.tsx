'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useUser, LEAGUES, getLeagueByXP } from '@/context/UserContext';
import { playButtonClick, playGemDing, playLevelUpFanfare } from '@/lib/soundEffects';

interface FriendUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarUrl?: string;
  board: string;
  specialization: string;
  xp: number;
  streak: number;
  league: string;
  leagueEmoji: string;
  isOnline: boolean;
  isFollowing: boolean;
  highFived?: boolean;
}

interface FriendActivity {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  avatar: string;
  avatarUrl?: string;
  action: string;
  detail: string;
  timeAgo: string;
  icon: string;
  color: string;
}

const INITIAL_SUGGESTED_FRIENDS: FriendUser[] = [
  {
    id: 'f-1',
    name: 'Aarav Sharma',
    username: 'aarav_cbse',
    avatar: 'AS',
    board: 'CBSE Class 12',
    specialization: 'Physics & Mathematics',
    xp: 2840,
    streak: 24,
    league: 'Champion League',
    leagueEmoji: '👑',
    isOnline: true,
    isFollowing: true,
  },
  {
    id: 'f-2',
    name: 'Rohan Gupta',
    username: 'rohan_bseb',
    avatar: 'RG',
    board: 'Bihar Board (BSEB)',
    specialization: 'Mathematics & Chemistry',
    xp: 2610,
    streak: 19,
    league: 'Master League',
    leagueEmoji: '💎',
    isOnline: true,
    isFollowing: true,
  },
  {
    id: 'f-3',
    name: 'Priya Verma',
    username: 'priya_cbse',
    avatar: 'PV',
    board: 'CBSE Class 12',
    specialization: 'Organic Chemistry',
    xp: 2490,
    streak: 18,
    league: 'Master League',
    leagueEmoji: '💎',
    isOnline: false,
    isFollowing: true,
  },
  {
    id: 'f-4',
    name: 'Devansh Pandey',
    username: 'devansh_up',
    avatar: 'DP',
    board: 'UP Board',
    specialization: 'Optics & Mechanics',
    xp: 1940,
    streak: 12,
    league: 'Elite League',
    leagueEmoji: '🥇',
    isOnline: false,
    isFollowing: false,
  },
  {
    id: 'f-5',
    name: 'Sneha Kulkarni',
    username: 'sneha_k',
    avatar: 'SK',
    board: 'CBSE Class 12',
    specialization: 'Physical Chemistry',
    xp: 1820,
    streak: 11,
    league: 'Elite League',
    leagueEmoji: '🥇',
    isOnline: true,
    isFollowing: false,
  },
  {
    id: 'f-6',
    name: 'Kavya Nair',
    username: 'kavya_isc',
    avatar: 'KN',
    board: 'ICSE / ISC',
    specialization: 'Genetics & Biology',
    xp: 1690,
    streak: 9,
    league: 'Elite League',
    leagueEmoji: '🥇',
    isOnline: false,
    isFollowing: false,
  },
  {
    id: 'f-7',
    name: 'Arjun Singh',
    username: 'arjun_bseb',
    avatar: 'AS',
    board: 'Bihar Board (BSEB)',
    specialization: 'Inorganic Chemistry',
    xp: 1540,
    streak: 8,
    league: 'Elite League',
    leagueEmoji: '🥇',
    isOnline: true,
    isFollowing: false,
  },
  {
    id: 'f-8',
    name: 'Ananya Roy',
    username: 'ananya_cbse',
    avatar: 'AR',
    board: 'CBSE Class 12',
    specialization: 'Integral Calculus',
    xp: 1410,
    streak: 7,
    league: 'Achiever League',
    leagueEmoji: '🔷',
    isOnline: false,
    isFollowing: false,
  },
];

const INITIAL_ACTIVITIES: FriendActivity[] = [
  {
    id: 'act-1',
    userId: 'f-1',
    userName: 'Aarav Sharma',
    userHandle: 'aarav_cbse',
    avatar: 'AS',
    action: 'Scored 100% in Physics Electrostatics Mock',
    detail: '+120 XP earned • 24 Day Streak Active 🔥',
    timeAgo: '12m ago',
    icon: 'electric_bolt',
    color: '#eab308',
  },
  {
    id: 'act-2',
    userId: 'f-2',
    userName: 'Rohan Gupta',
    userHandle: 'rohan_bseb',
    avatar: 'RG',
    action: 'Promoted to Master League 💎',
    detail: 'Top 3 in Bihar Board Weekly Standings',
    timeAgo: '45m ago',
    icon: 'military_tech',
    color: '#06b6d4',
  },
  {
    id: 'act-3',
    userId: 'f-3',
    userName: 'Priya Verma',
    userHandle: 'priya_cbse',
    avatar: 'PV',
    action: 'Completed 5 Organic Chemistry Chapter Tests',
    detail: 'Accuracy: 95.2% • +85 XP',
    timeAgo: '2h ago',
    icon: 'science',
    color: '#8b5cf6',
  },
  {
    id: 'act-4',
    userId: 'f-5',
    userName: 'Sneha Kulkarni',
    userHandle: 'sneha_k',
    avatar: 'SK',
    action: 'Reached 10-Day Daily Streak Milestone',
    detail: 'Earned 50 Gems 💎 Reward',
    timeAgo: '4h ago',
    icon: 'local_fire_department',
    color: '#f97316',
  },
];

export function FriendsClient() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'friends' | 'find' | 'activity'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [friendsList, setFriendsList] = useState<FriendUser[]>(INITIAL_SUGGESTED_FRIENDS);
  const [activities, setActivities] = useState<FriendActivity[]>(INITIAL_ACTIVITIES);
  const [selectedFriend, setSelectedFriend] = useState<FriendUser | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Restore follow status from local storage
  useEffect(() => {
    try {
      const savedFollowing = localStorage.getItem('edustride_following_ids');
      if (savedFollowing) {
        const ids: string[] = JSON.parse(savedFollowing);
        setFriendsList((prev) =>
          prev.map((f) => ({
            ...f,
            isFollowing: ids.includes(f.id) || f.isFollowing,
          }))
        );
      }
    } catch (e) {
      console.warn('Failed to load friends state:', e);
    }
  }, []);

  const toggleFollow = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    playButtonClick();

    setFriendsList((prev) => {
      const updated = prev.map((f) => {
        if (f.id === id) {
          const nextState = !f.isFollowing;
          if (nextState) playGemDing();
          return { ...f, isFollowing: nextState };
        }
        return f;
      });

      const followingIds = updated.filter((f) => f.isFollowing).map((f) => f.id);
      localStorage.setItem('edustride_following_ids', JSON.stringify(followingIds));
      return updated;
    });
  };

  const handleHighFive = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    playLevelUpFanfare();

    setFriendsList((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return { ...f, highFived: true };
        }
        return f;
      })
    );
  };

  const handleCopyInviteLink = () => {
    playButtonClick();
    const handle = user.username || 'scholar';
    const inviteUrl = `https://one.nainix.me/@${handle}`;
    navigator.clipboard?.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const myFriends = useMemo(() => {
    return friendsList.filter((f) => f.isFollowing);
  }, [friendsList]);

  const discoverList = useMemo(() => {
    let list = friendsList;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.username.toLowerCase().includes(q) ||
          f.board.toLowerCase().includes(q) ||
          f.specialization.toLowerCase().includes(q)
      );
    }
    return list;
  }, [friendsList, searchQuery]);

  return (
    <main className="w-full min-h-screen bg-[#f4f5fa] pb-32 font-sans select-none overflow-x-hidden">
      
      {/* ─── 1. Header Hero (Friends & Connections) ─── */}
      <div className="w-full bg-gradient-to-b from-[#ddd6fe] via-[#ede9fe] to-[#f4f5fa] pt-4 pb-4 px-4 sm:px-6">
        <div className="max-w-md mx-auto space-y-3">
          
          {/* Header Title & Status */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#7c3aed] text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  Study Network
                </span>
                <span className="text-[10px] font-black text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full border border-violet-200">
                  {myFriends.length} Following
                </span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl font-black text-[#1e293b] mt-1 leading-tight">
                Friends & Study Peers
              </h1>
            </div>

            {/* Invite Button Icon */}
            <button
              type="button"
              onClick={handleCopyInviteLink}
              className="px-3 py-2 rounded-2xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex items-center gap-1.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#0f172a] transition-all cursor-pointer shrink-0"
              title="Share your invite profile link"
            >
              <span className="material-symbols-outlined text-[18px] text-[#7c3aed]">
                {copiedLink ? 'check' : 'person_add'}
              </span>
              <span className="text-xs font-black text-slate-900">
                {copiedLink ? 'Copied!' : 'Invite'}
              </span>
            </button>
          </div>

          {/* User's Shareable Handle Capsule */}
          <div className="p-3 rounded-2xl bg-white border-2 border-[#e2e8f0] shadow-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#9333ea] text-white font-black text-xs flex items-center justify-center overflow-hidden shrink-0 border border-violet-300">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black text-slate-800 leading-tight truncate">
                  Your Unique Study Handle
                </p>
                <p className="text-xs font-extrabold text-[#7c3aed] truncate">
                  @{user.username || 'scholar_12'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyInviteLink}
              className="px-2.5 py-1 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-[11px] border border-violet-200 transition-colors shrink-0 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Segmented Tab Switcher (Friends / Find / Activity) */}
          <div className="bg-white/90 p-1 rounded-2xl border-2 border-[#e2e8f0] shadow-2xs flex items-center">
            {[
              { id: 'friends', label: `My Friends (${myFriends.length})`, icon: 'group' },
              { id: 'find', label: 'Find Peers', icon: 'person_search' },
              { id: 'activity', label: 'Activity', icon: 'notifications_active' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playButtonClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#7c3aed] text-white shadow-xs'
                    : 'text-[#64748b] hover:text-[#1e293b]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 space-y-3 mt-2">

        {/* ─── TAB 1: MY FRIENDS / FOLLOWING LIST ─── */}
        {activeTab === 'friends' && (
          <div className="space-y-2.5">
            {myFriends.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 text-center border-2 border-[#e2e8f0] space-y-3">
                <div className="w-16 h-16 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mx-auto text-3xl">
                  👥
                </div>
                <h3 className="font-heading font-black text-slate-800 text-base">
                  No Study Friends Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Follow your classmates and peer scholars to track their progress, send high-fives, and compete on leaderboards!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('find')}
                  className="px-4 py-2 rounded-2xl bg-[#7c3aed] text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Discover Classmates 🔍
                </button>
              </div>
            ) : (
              myFriends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => {
                    playButtonClick();
                    setSelectedFriend(friend);
                  }}
                  className="bg-white rounded-2xl p-3.5 border-2 border-b-4 border-[#e2e8f0] hover:border-slate-300 shadow-2xs flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-98"
                >
                  {/* Avatar & Online status */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 border-2 border-violet-200 text-violet-900 font-black text-sm flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                        {friend.avatarUrl ? (
                          <img src={friend.avatarUrl} alt={friend.name} className="w-full h-full object-cover" />
                        ) : (
                          friend.avatar
                        )}
                      </div>
                      {friend.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-200" title="Online now" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-slate-900 truncate">
                          {friend.name}
                        </h4>
                        <span className="text-[10px]" title={friend.league}>
                          {friend.leagueEmoji}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-[#7c3aed] truncate">
                          @{friend.username}
                        </span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                          🔥 {friend.streak}d
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: High-Five & XP */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right hidden xs:block">
                      <span className="text-xs font-black text-slate-900 block leading-tight">
                        {friend.xp} <span className="text-[9px] text-slate-400 font-bold">XP</span>
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold block">
                        {friend.board.replace(' Class 12', '').replace(' (BSEB)', '')}
                      </span>
                    </div>

                    {/* High-Five Button */}
                    <button
                      type="button"
                      onClick={(e) => handleHighFive(friend.id, e)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-90 flex items-center gap-1 border ${
                        friend.highFived
                          ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      }`}
                      title="Send a celebratory high-five!"
                    >
                      <span>{friend.highFived ? '🎉' : '👏'}</span>
                      <span className="text-[10px] font-black">{friend.highFived ? 'Sent!' : 'Cheer'}</span>
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* ─── TAB 2: FIND & DISCOVER FRIENDS ─── */}
        {activeTab === 'find' && (
          <div className="space-y-3">
            
            {/* Search Input Box */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, @handle or board..."
                className="w-full pl-9 pr-3 py-2 bg-white rounded-2xl border-2 border-[#e2e8f0] text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:border-[#7c3aed] outline-none shadow-2xs transition-colors"
              />
            </div>

            {/* Suggested Peers List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Suggested Scholars ({discoverList.length})
                </span>
                <span className="text-[10px] text-[#7c3aed] font-bold">
                  Class 12 Peers
                </span>
              </div>

              {discoverList.map((peer) => (
                <div
                  key={peer.id}
                  onClick={() => {
                    playButtonClick();
                    setSelectedFriend(peer);
                  }}
                  className="bg-white rounded-2xl p-3 border-2 border-[#e2e8f0] hover:border-slate-300 shadow-2xs flex items-center justify-between gap-3 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                      {peer.avatarUrl ? (
                        <img src={peer.avatarUrl} alt={peer.name} className="w-full h-full object-cover" />
                      ) : (
                        peer.avatar
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-black text-slate-900 truncate">
                          {peer.name}
                        </h4>
                        <span className="text-[10px]">{peer.leagueEmoji}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-[#7c3aed] truncate">
                          @{peer.username}
                        </span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {peer.board.replace(' Class 12', '')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Follow / Unfollow Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFollow(peer.id, e)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 shrink-0 ${
                      peer.isFollowing
                        ? 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                        : 'bg-[#7c3aed] text-white shadow-xs hover:bg-[#6d28d9]'
                    }`}
                  >
                    {peer.isFollowing ? 'Following' : '+ Follow'}
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ─── TAB 3: FRIEND ACTIVITY FEED ─── */}
        {activeTab === 'activity' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Live Peer Milestones
              </span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Real-time
              </span>
            </div>

            {activities.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-2xl p-3.5 border-2 border-[#e2e8f0] shadow-2xs space-y-2 transition-all hover:border-violet-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-200 text-violet-800 font-black text-xs flex items-center justify-center shrink-0">
                      {act.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 leading-tight truncate">
                        {act.userName}
                      </p>
                      <p className="text-[10px] font-bold text-[#7c3aed] truncate">
                        @{act.userHandle}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 shrink-0">
                    {act.timeAgo}
                  </span>
                </div>

                {/* Milestone Detail Card */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white shadow-2xs"
                    style={{ backgroundColor: act.color }}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {act.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-snug">
                      {act.action}
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">
                      {act.detail}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* ─── Friend Details Inspection Modal ─── */}
      {selectedFriend && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5 duration-200">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-black text-lg flex items-center justify-center overflow-hidden shrink-0 border-2 border-white shadow-xs">
                  {selectedFriend.avatarUrl ? (
                    <img src={selectedFriend.avatarUrl} alt={selectedFriend.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedFriend.avatar
                  )}
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-slate-900">
                    {selectedFriend.name}
                  </h3>
                  <p className="text-xs font-bold text-[#7c3aed]">
                    @{selectedFriend.username}
                  </p>
                  <p className="text-[11px] text-slate-400 font-semibold">
                    {selectedFriend.board}
                  </p>
                </div>
              </div>
              
              <span className="text-xs font-black text-violet-700 bg-violet-100 px-2.5 py-1 rounded-full border border-violet-200 flex items-center gap-1">
                <span>{selectedFriend.leagueEmoji}</span>
                <span>{selectedFriend.league.replace(' League', '')}</span>
              </span>
            </div>

            {/* Specialization */}
            <div className="my-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase font-black text-slate-400 block">
                Primary Focus / Strength
              </span>
              <span className="text-xs font-black text-slate-800 mt-0.5 block">
                {selectedFriend.specialization}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-center my-3.5">
              <div className="p-3 rounded-2xl bg-violet-50/70 border border-violet-200">
                <span className="text-[10px] text-violet-600 uppercase font-black block">Total Score</span>
                <span className="text-xs font-black text-violet-950 mt-0.5 block">{selectedFriend.xp} XP</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-[10px] text-amber-600 uppercase font-black block">Daily Streak</span>
                <span className="text-xs font-black text-amber-950 mt-0.5 block">{selectedFriend.streak} Days 🔥</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mt-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleFollow(selectedFriend.id)}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer active:scale-95 border ${
                    selectedFriend.isFollowing
                      ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-600'
                      : 'bg-[#7c3aed] text-white border-[#6d28d9] shadow-sm'
                  }`}
                >
                  {selectedFriend.isFollowing ? 'Unfollow' : '+ Follow Scholar'}
                </button>

                <button
                  type="button"
                  onClick={() => handleHighFive(selectedFriend.id)}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm flex items-center gap-1"
                >
                  <span>👏</span>
                  <span>Cheer</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  playButtonClick();
                  setSelectedFriend(null);
                }}
                className="w-full py-2 rounded-2xl bg-slate-900 text-white text-xs font-black transition-all cursor-pointer active:scale-95"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
