'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useUser, LEAGUES, getLeagueByXP } from '@/context/UserContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { playButtonClick, playGemDing, playLevelUpFanfare } from '@/lib/soundEffects';

interface FriendUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarUrl?: string;
  board: string;
  boardKey: string;
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

export function FriendsClient() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'friends' | 'refer' | 'find' | 'activity'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [dbUsers, setDbUsers] = useState<FriendUser[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState<FriendUser | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);
  const [referralCount, setReferralCount] = useState(0);

  // ─── 1. Restore local following IDs & referral count ───
  useEffect(() => {
    try {
      const storedCount = localStorage.getItem('edustride_referral_count');
      if (storedCount) setReferralCount(parseInt(storedCount, 10));

      const savedFollowing = localStorage.getItem('edustride_following_ids');
      if (savedFollowing) {
        setFollowingIds(JSON.parse(savedFollowing));
      }
    } catch (e) {
      console.warn('Failed to load friends state:', e);
    }
  }, []);

  // ─── 2. Fetch Real Users from Supabase (Zero Dummy Accounts) ───
  useEffect(() => {
    let isMounted = true;

    async function fetchRealScholars() {
      setLoading(true);
      try {
        if (!isSupabaseConfigured) {
          if (isMounted) setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, username, avatar_url, target_board, class_level, streak_days, xp_points, completed_nodes')
          .order('xp_points', { ascending: false })
          .limit(50);

        if (error) {
          console.warn('[Friends] Supabase fetch error:', error.message);
        } else if (data && isMounted) {
          // Exclude the current logged-in user from friend suggestions
          const filtered = data.filter((p: any) => p.id !== user.id);

          const mapped: FriendUser[] = filtered.map((p: any) => {
            const rawName = p.name || 'Scholar';
            const rawUser = p.username || `scholar_${p.id.slice(0, 4)}`;
            const initials = rawName
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'SC';

            const boardRaw = (p.target_board || 'cbse').toLowerCase();
            let boardLabel = 'CBSE Class 12';
            let bKey = 'cbse';
            if (boardRaw.includes('bseb') || boardRaw.includes('bihar')) {
              boardLabel = 'Bihar Board (BSEB)';
              bKey = 'bseb';
            } else if (boardRaw.includes('up')) {
              boardLabel = 'UP Board';
              bKey = 'up';
            } else if (boardRaw.includes('icse') || boardRaw.includes('isc')) {
              boardLabel = 'ICSE / ISC';
              bKey = 'icse';
            } else {
              boardLabel = `CBSE ${p.class_level || 'Class 12'}`;
              bKey = 'cbse';
            }

            const xpVal = Number(p.xp_points) || 0;
            const userLeague = getLeagueByXP(xpVal);

            return {
              id: p.id,
              name: rawName,
              username: rawUser,
              avatar: initials,
              avatarUrl: p.avatar_url || '',
              board: boardLabel,
              boardKey: bKey,
              specialization: p.class_level ? `${p.class_level} Scholar` : 'Board Prep',
              xp: xpVal,
              streak: Number(p.streak_days) || 0,
              league: userLeague.name,
              leagueEmoji: userLeague.emoji,
              isOnline: false,
              isFollowing: followingIds.includes(p.id),
            };
          });

          setDbUsers(mapped);
        }
      } catch (err) {
        console.warn('[Friends] Failed to load real scholars:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchRealScholars();

    return () => {
      isMounted = false;
    };
  }, [user.id, followingIds]);

  // Sync isFollowing state when followingIds change
  const allScholars = useMemo(() => {
    return dbUsers.map((u) => ({
      ...u,
      isFollowing: followingIds.includes(u.id),
    }));
  }, [dbUsers, followingIds]);

  // ─── Referral Links ───
  const referralUrl = useMemo(() => {
    const handle = user.username || 'scholar_12';
    return `https://one.nainix.me/signup?ref=${handle}`;
  }, [user.username]);

  const shareText = useMemo(() => {
    const academicLevel = user.classLevel || 'Board & Exam';
    return `🔥 Join me on nainixOne for ${academicLevel} Prep & AI Mock Tests! Use my invite link to get 50 FREE Gems 💎 to refill test lives:\n${referralUrl}`;
  }, [referralUrl, user.classLevel]);

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
    const academicLevel = user.classLevel || 'School & Board';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join nainixOne • ${academicLevel} Exam Prep`,
          text: `Practice Mock Tests with me and get 50 Free Gems!`,
          url: referralUrl,
        });
      } catch (err) {
        handleCopyInviteLink();
      }
    } else {
      handleCopyInviteLink();
    }
  };

  // ─── Toggle Follow / Unfollow (Saved in LocalStorage) ───
  const toggleFollow = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    playButtonClick();

    setFollowingIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('edustride_following_ids', JSON.stringify(next));
      if (!prev.includes(id)) {
        playGemDing();
      }
      return next;
    });
  };

  const handleHighFive = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    playLevelUpFanfare();

    setDbUsers((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return { ...f, highFived: true };
        }
        return f;
      })
    );
  };

  // ─── Filter Lists ───
  const myFriends = useMemo(() => {
    return allScholars.filter((f) => f.isFollowing);
  }, [allScholars]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim().replace(/^@/, '');
    return allScholars.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.username.toLowerCase().includes(q) ||
        f.board.toLowerCase().includes(q) ||
        f.specialization.toLowerCase().includes(q)
    );
  }, [allScholars, searchQuery]);

  // Dynamic real activities based on followed friends' achievements
  const realActivities: FriendActivity[] = useMemo(() => {
    const list: FriendActivity[] = [];
    myFriends.forEach((f) => {
      if (f.xp > 0) {
        list.push({
          id: `act-xp-${f.id}`,
          userId: f.id,
          userName: f.name,
          userHandle: f.username,
          avatar: f.avatar,
          avatarUrl: f.avatarUrl,
          action: `Earned ${f.xp.toLocaleString()} XP on nainixOne`,
          detail: `${f.league} • ${f.board}`,
          timeAgo: 'Recently',
          icon: 'military_tech',
          color: '#7c3aed',
        });
      }
      if (f.streak > 0) {
        list.push({
          id: `act-strk-${f.id}`,
          userId: f.id,
          userName: f.name,
          userHandle: f.username,
          avatar: f.avatar,
          avatarUrl: f.avatarUrl,
          action: `Maintains a ${f.streak}-Day Study Streak! 🔥`,
          detail: `Consistent daily practice in ${f.board}`,
          timeAgo: 'Active',
          icon: 'local_fire_department',
          color: '#f97316',
        });
      }
    });
    return list;
  }, [myFriends]);

  return (
    <main className="w-full min-h-screen bg-[#f4f5fa] pb-32 font-sans select-none overflow-x-hidden">
      
      {/* ─── 1. Header Hero ─── */}
      <div className="w-full bg-gradient-to-b from-[#ddd6fe] via-[#ede9fe] to-[#f4f5fa] pt-4 pb-3 px-4 sm:px-6">
        <div className="max-w-md mx-auto space-y-3">
          
          {/* Header Title & Top Badges */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#7c3aed] text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  Study Network
                </span>
                <span className="text-[10px] font-black text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full border border-cyan-300 flex items-center gap-1">
                  <span>💎</span>
                  <span>+50 Gems / Invite</span>
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
              className="px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] flex items-center gap-1.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#0f172a] transition-all cursor-pointer shrink-0"
              title="Refer friends & get 50 Free Gems!"
            >
              <span className="text-sm">💎</span>
              <span className="text-xs font-black text-slate-950">
                +50 Free
              </span>
            </button>
          </div>

          {/* ─── Global Universal Search Bar (Real Registered Scholars) ─── */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search real scholars by name, @handle, board..."
              className="w-full pl-10 pr-10 py-2.5 bg-white rounded-2xl border-2 border-[#c4b5fd] text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:border-[#7c3aed] focus:ring-4 focus:ring-purple-500/10 outline-none shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* ─── 🐱 Study Friends Mascot & Referral Banner ─── */}
          {!searchQuery && (
            <div className="bg-white rounded-3xl p-3.5 sm:p-4 border-2 border-b-4 border-[#e2e8f0] shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between gap-3">
                
                {/* Left Content */}
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-[#7c3aed] text-[9px] font-black uppercase tracking-wider mb-1">
                    <span>✨</span>
                    <span>Study Together</span>
                  </div>
                  <h3 className="font-heading text-sm sm:text-base font-black text-slate-900 leading-tight">
                    Invite Classmates & Get 50 Gems! 💎
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Connect with real scholars, track streaks, compare mock test scores, and earn study wallet gems.
                  </p>

                  {/* Quick 1-Tap Action */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      type="button"
                      onClick={handleWhatsAppShare}
                      className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] transition-all active:scale-95 flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <span>💬</span>
                      <span>Invite</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyInviteLink}
                      className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-all active:scale-95 flex items-center gap-1 border border-slate-200 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {copiedLink ? 'check' : 'content_copy'}
                      </span>
                      <span>{copiedLink ? 'Copied' : 'Link'}</span>
                    </button>
                  </div>
                </div>

                {/* Right Study Friends Cat Illustration */}
                <div className="w-24 sm:w-28 shrink-0 flex items-center justify-center">
                  <img
                    src="/images/study_friends.png"
                    alt="Study Friends Cat Scholars"
                    className="w-full h-auto object-contain drop-shadow-md hover:scale-105 transition-transform"
                  />
                </div>

              </div>
            </div>
          )}

          {/* Segmented Tab Switcher (Only when not searching) */}
          {!searchQuery && (
            <div className="bg-white/90 p-1 rounded-2xl border-2 border-[#e2e8f0] shadow-2xs flex items-center">
              {[
                { id: 'friends', label: `Friends (${myFriends.length})`, icon: 'group' },
                { id: 'find', label: `Discover (${allScholars.length})`, icon: 'person_search' },
                { id: 'refer', label: 'Refer & Earn', icon: 'card_giftcard' },
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
          )}

        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 space-y-3 mt-1">

        {/* ─── LIVE SEARCH RESULTS VIEW (When query active) ─── */}
        {searchQuery.trim() !== '' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Search Results ({searchResults.length})
              </span>
              <span className="text-[10px] text-slate-400">
                Searching for &quot;{searchQuery}&quot;
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 text-center border-2 border-[#e2e8f0] space-y-2">
                <span className="text-3xl">🔍</span>
                <h4 className="font-heading font-black text-slate-900 text-sm">
                  No Scholars Found
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  No registered student matches &quot;{searchQuery}&quot;. Share your invite link to bring your classmates here!
                </p>
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="px-4 py-2 mt-2 rounded-2xl bg-[#7c3aed] text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Invite Friends via WhatsApp 💬
                </button>
              </div>
            ) : (
              searchResults.map((peer) => (
                <div
                  key={peer.id}
                  onClick={() => {
                    playButtonClick();
                    setSelectedFriend(peer);
                  }}
                  className="bg-white rounded-2xl p-3 border-2 border-[#e2e8f0] hover:border-slate-300 shadow-2xs flex items-center justify-between gap-3 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 text-violet-800 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
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
                        <span className="text-[10px]" title={peer.league}>{peer.leagueEmoji}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-[#7c3aed] truncate">
                          @{peer.username}
                        </span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] text-slate-500 truncate">
                          {peer.board}
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
                        ? 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-rose-50 hover:text-rose-600'
                        : 'bg-[#7c3aed] text-white shadow-xs hover:bg-[#6d28d9]'
                    }`}
                  >
                    {peer.isFollowing ? 'Following' : '+ Follow'}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && !searchQuery && (
          <div className="py-8 flex flex-col items-center justify-center gap-2 bg-white rounded-3xl border-2 border-[#e2e8f0]">
            <div className="w-8 h-8 rounded-full border-3 border-violet-200 border-t-[#7c3aed] animate-spin" />
            <p className="text-xs font-bold text-slate-500">Loading verified scholars...</p>
          </div>
        )}

        {/* ─── TAB 1: MY FRIENDS / FOLLOWING LIST ─── */}
        {!searchQuery && !loading && activeTab === 'friends' && (
          <div className="space-y-2.5">
            {myFriends.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 text-center border-2 border-[#e2e8f0] space-y-3">
                <div className="w-20 h-20 mx-auto mb-1">
                  <img
                    src="/images/study_friends.png"
                    alt="Study Friends"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-heading font-black text-slate-800 text-base">
                  No Study Friends Added Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Use the search bar above to find registered classmates or invite your peers to study and compete together!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('find')}
                    className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all active:scale-95 cursor-pointer"
                  >
                    Browse Scholars ({allScholars.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReferModalOpen(true)}
                    className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-[#7c3aed] text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Invite Friends (+50 Gems 💎)
                  </button>
                </div>
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
                  {/* Avatar */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 border-2 border-violet-200 text-violet-900 font-black text-sm flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                        {friend.avatarUrl ? (
                          <img src={friend.avatarUrl} alt={friend.name} className="w-full h-full object-cover" />
                        ) : (
                          friend.avatar
                        )}
                      </div>
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
                      <span className="text-[9px] text-slate-400 font-semibold block truncate max-w-[90px]">
                        {friend.board.replace(' Class 12', '')}
                      </span>
                    </div>

                    {/* Cheer Button */}
                    <button
                      type="button"
                      onClick={(e) => handleHighFive(friend.id, e)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-90 flex items-center gap-1 border ${
                        friend.highFived
                          ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      }`}
                      title="Send cheer"
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

        {/* ─── TAB 2: FIND & DISCOVER REAL SCHOLARS ─── */}
        {!searchQuery && !loading && activeTab === 'find' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Registered Scholars ({allScholars.length})
              </span>
              <span className="text-[10px] text-[#7c3aed] font-bold">
                Live Community
              </span>
            </div>

            {allScholars.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 text-center border-2 border-[#e2e8f0] space-y-3">
                <span className="text-3xl">🌱</span>
                <h4 className="font-heading font-black text-slate-900 text-sm">
                  You are the first scholar here!
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Share your link with your school & coaching classmates to form the first study squad and earn gems!
                </p>
                <button
                  type="button"
                  onClick={() => setIsReferModalOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-[#7c3aed] text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Invite Friends via WhatsApp 💬
                </button>
              </div>
            ) : (
              allScholars.map((peer) => (
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
                        <span className="text-[10px] text-slate-500 truncate">
                          {peer.board}
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
                        ? 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-rose-50 hover:text-rose-600'
                        : 'bg-[#7c3aed] text-white shadow-xs hover:bg-[#6d28d9]'
                    }`}
                  >
                    {peer.isFollowing ? 'Following' : '+ Follow'}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── TAB 3: REFER & EARN 50 GEMS ─── */}
        {!searchQuery && !loading && activeTab === 'refer' && (
          <div className="space-y-3">
            
            {/* Referral Stats Summary Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#e2e8f0] shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Your Referral Rewards
                  </span>
                  <h4 className="font-heading text-lg font-black text-slate-900 mt-0.5">
                    {(referralCount * 50).toLocaleString()} Gems Earned
                  </h4>
                </div>

                <div className="w-14 h-14">
                  <img
                    src="/images/study_friends.png"
                    alt="Study Group"
                    className="w-full h-full object-contain"
                  />
                </div>
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
                    <p className="text-[11px] text-slate-500">Send your link to friends & classmates via WhatsApp or Telegram.</p>
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
                    <p className="text-[11px] text-slate-500">50 Gems are instantly credited to your study wallet to refill test lives.</p>
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

        {/* ─── TAB 4: REAL FRIEND ACTIVITY FEED ─── */}
        {!searchQuery && !loading && activeTab === 'activity' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Live Peer Milestones
              </span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified
              </span>
            </div>

            {realActivities.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 text-center border-2 border-[#e2e8f0] space-y-2">
                <span className="text-3xl">⚡</span>
                <h4 className="font-heading font-black text-slate-900 text-sm">
                  No Friend Activity Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Follow your study peers to see their test scores, daily streak milestones, and league promotions in real time!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('find')}
                  className="px-4 py-2 mt-1 rounded-2xl bg-[#7c3aed] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Find Scholars to Follow
                </button>
              </div>
            ) : (
              realActivities.map((act) => (
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
              ))
            )}
          </div>
        )}

      </div>

      {/* ─── Dedicated Refer & Earn 50 Gems Popup Modal ─── */}
      {isReferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5 duration-200 text-center">
            
            {/* Header Study Cats Mascot */}
            <div className="w-32 h-20 mx-auto mb-2 flex items-center justify-center">
              <img
                src="/images/study_friends.png"
                alt="Study Friends Cat Mascot"
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 text-[10px] font-black uppercase tracking-wider">
              Referral Bonus
            </span>

            <h3 className="font-heading font-black text-xl text-slate-900 mt-1">
              Invite & Earn 50 Gems
            </h3>
            
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Share your invite link with your classmates and study friends. When they join, you get <b className="text-[#7c3aed]">50 Gems 💎</b> instantly!
            </p>

            {/* Invite Link Capsule */}
            <div className="my-4 p-2.5 rounded-2xl bg-slate-50 border-2 border-[#e2e8f0] flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-600 truncate text-left flex-1 pl-1">
                {referralUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="px-3 py-1.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-xs shrink-0 transition-all active:scale-95 shadow-xs cursor-pointer"
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
                Class / Field
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
