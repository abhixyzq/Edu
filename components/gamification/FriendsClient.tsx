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
  const { user, addGems } = useUser();
  const [activeTab, setActiveTab] = useState<'friends' | 'refer' | 'find' | 'activity'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [friendsList, setFriendsList] = useState<FriendUser[]>(INITIAL_SUGGESTED_FRIENDS);
  const [activities, setActivities] = useState<FriendActivity[]>(INITIAL_ACTIVITIES);
  const [selectedFriend, setSelectedFriend] = useState<FriendUser | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);

  // Simulated referral counts from localStorage
  const [referralCount, setReferralCount] = useState(2);

  useEffect(() => {
    try {
      const storedCount = localStorage.getItem('edustride_referral_count');
      if (storedCount) setReferralCount(parseInt(storedCount, 10));

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

  const referralUrl = useMemo(() => {
    const handle = user.username || 'scholar_12';
    return typeof window !== 'undefined'
      ? `${window.location.origin}/signup?ref=${handle}`
      : `https://one.nainix.me/signup?ref=${handle}`;
  }, [user.username]);

  const shareText = useMemo(() => {
    return `🔥 Join me on nainixOne for Class 12 Board Exam Prep & AI Mock Tests! Use my invite link to get 50 FREE Gems 💎 to unlock test lives:\n${referralUrl}`;
  }, [referralUrl]);

  const handleCopyInviteLink = () => {
    playButtonClick();
    navigator.clipboard?.writeText(referralUrl);
    setCopiedLink(true);
    playGemDing();
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    playButtonClick();
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleNativeShare = async () => {
    playButtonClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join nainixOne • Class 12 Board Exam Prep',
          text: `Practice Class 12 Mock Tests with me and get 50 Free Gems!`,
          url: referralUrl,
        });
      } catch (err) {
        handleCopyInviteLink();
      }
    } else {
      handleCopyInviteLink();
    }
  };

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
      
      {/* ─── 1. Header Hero (Friends & Connections + Refer Highlight) ─── */}
      <div className="w-full bg-gradient-to-b from-[#ddd6fe] via-[#ede9fe] to-[#f4f5fa] pt-4 pb-4 px-4 sm:px-6">
        <div className="max-w-md mx-auto space-y-3">
          
          {/* Header Title & Status */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#7c3aed] text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  Study Network
                </span>
                <span className="text-[10px] font-black text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full border border-cyan-300 flex items-center gap-1">
                  <span>💎</span>
                  <span>+50 Gems / Referral</span>
                </span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl font-black text-[#1e293b] mt-1 leading-tight">
                Friends & Study Peers
              </h1>
            </div>

            {/* Refer & Earn 50 Gems Main Button */}
            <button
              type="button"
              onClick={() => {
                playButtonClick();
                setIsReferModalOpen(true);
              }}
              className="px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex items-center gap-1.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#0f172a] transition-all cursor-pointer shrink-0 animate-bounce"
              title="Refer friends & get 50 Free Gems!"
            >
              <span className="text-sm">💎</span>
              <span className="text-xs font-black text-slate-950">
                +50 Free
              </span>
            </button>
          </div>

          {/* ─── 💎 Refer & Earn 50 Gems Hero Card ─── */}
          <div className="bg-gradient-to-br from-[#6d28d9] via-[#7c3aed] to-[#9333ea] text-white rounded-3xl p-4 shadow-md border-b-4 border-[#5521b5] relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[9px] font-black uppercase tracking-wider shadow-2xs">
                    🎁 Referral Reward
                  </span>
                  <span className="text-[10px] text-violet-200 font-bold">
                    Unlimited
                  </span>
                </div>
                <h3 className="font-heading text-base font-black text-white leading-tight">
                  Invite Friends, Get 50 Gems! 💎
                </h3>
                <p className="text-[11px] text-violet-100 mt-0.5 leading-relaxed">
                  When a friend registers with your invite link, you instantly earn <b className="text-amber-300">50 Free Gems</b> to refill hearts & streak freeze!
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                💎
              </div>
            </div>

            {/* Quick Share Buttons Bar */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/20">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 backdrop-blur-xs border border-white/30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copiedLink ? 'check' : 'content_copy'}
                </span>
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Segmented Tab Switcher (Friends / Refer / Find / Activity) */}
          <div className="bg-white/90 p-1 rounded-2xl border-2 border-[#e2e8f0] shadow-2xs flex items-center">
            {[
              { id: 'friends', label: `Friends (${myFriends.length})`, icon: 'group' },
              { id: 'refer', label: 'Refer & Earn', icon: 'card_giftcard' },
              { id: 'find', label: 'Find', icon: 'person_search' },
              { id: 'activity', label: 'Feed', icon: 'bolt' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playButtonClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  activeTab === tab.id
                    ? 'bg-[#7c3aed] text-white shadow-xs'
                    : 'text-[#64748b] hover:text-[#1e293b]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
                <span className="hidden xxs:inline">{tab.label}</span>
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
                  Invite your classmates or follow peer scholars to earn gems, send cheers, and compete on leaderboards!
                </p>
                <button
                  type="button"
                  onClick={() => setIsReferModalOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-[#7c3aed] text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Invite Friends & Get 50 Gems 💎
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

        {/* ─── TAB 2: REFER & EARN 50 GEMS DETAILS ─── */}
        {activeTab === 'refer' && (
          <div className="space-y-3">
            
            {/* Referral Stats Summary Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#e2e8f0] shadow-sm">
              <div className="text-center mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Your Referral Rewards
                </span>
                <h4 className="font-heading text-lg font-black text-slate-900 mt-0.5">
                  {(referralCount * 50).toLocaleString()} Gems Earned
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center my-3">
                <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200">
                  <span className="text-[10px] text-cyan-700 uppercase font-black block">Total Joined</span>
                  <span className="text-base font-black text-cyan-950 mt-0.5 block">{referralCount} Friends</span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] text-amber-700 uppercase font-black block">Per Invite</span>
                  <span className="text-base font-black text-amber-950 mt-0.5 block">+50 Gems 💎</span>
                </div>
              </div>

              {/* How it works 3-step guide */}
              <div className="space-y-2.5 mt-4 pt-4 border-t border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  How Refer & Earn Works
                </span>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <h5 className="text-xs font-black text-slate-900">Share your invite link</h5>
                    <p className="text-[11px] text-slate-500">Send your link to Class 12 friends via WhatsApp or Telegram.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <h5 className="text-xs font-black text-slate-900">Friend signs up</h5>
                    <p className="text-[11px] text-slate-500">They create their account using your referral link.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <h5 className="text-xs font-black text-emerald-900">You both get 50 Gems! 💎</h5>
                    <p className="text-[11px] text-slate-500">50 Gems are instantly credited to your study wallet.</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 space-y-2">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>💬</span>
                  <span>Share on WhatsApp (+50 Gems)</span>
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all active:scale-95 border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">share</span>
                  <span>More Share Options</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ─── TAB 3: FIND & DISCOVER FRIENDS ─── */}
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

        {/* ─── TAB 4: FRIEND ACTIVITY FEED ─── */}
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

      {/* ─── Dedicated Refer & Earn 50 Gems Popup Modal ─── */}
      {isReferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5 duration-200 text-center">
            
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] flex items-center justify-center mx-auto text-3xl mb-3">
              💎
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 text-[10px] font-black uppercase tracking-wider">
              Referral Bonus
            </span>

            <h3 className="font-heading font-black text-xl text-slate-900 mt-1">
              Invite & Earn 50 Gems
            </h3>
            
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Share your invite link with your Class 12 friends. When they join, you get <b className="text-[#7c3aed]">50 Gems 💎</b> instantly!
            </p>

            {/* Invite Link Capsule */}
            <div className="my-4 p-2.5 rounded-2xl bg-slate-50 border-2 border-[#e2e8f0] flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-600 truncate text-left flex-1 pl-1">
                {referralUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="px-3 py-1.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-xs shrink-0 transition-all active:scale-95 shadow-xs"
              >
                {copiedLink ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Actions */}
            <div className="space-y-2 mt-2">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>💬</span>
                <span>Share via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playButtonClick();
                  setIsReferModalOpen(false);
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

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
