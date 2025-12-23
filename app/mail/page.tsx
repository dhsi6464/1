'use client';

import { useState, useMemo, memo } from 'react';
import Link from 'next/link';
import { DOMAINS } from '@/lib/domains';

// 图标组件
const ICON_PATHS: Record<string, React.ReactElement> = {
  search: <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>,
  close: <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>,
  check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
  copy: <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>,
  home: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>,
  inbox: <path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"/>
};

const Icon = memo(({ name, className = "w-6 h-6" }: { name: string; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">{ICON_PATHS[name]}</svg>
));
Icon.displayName = 'Icon';

// 触摸反馈
const haptic = (duration: number = 15) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(duration);
  }
};

// 域名卡片组件
const DomainCard = memo(({ domain, onCopy, isCopied }: {
  domain: string;
  onCopy: () => void;
  isCopied: boolean;
}) => (
  <button
    onClick={onCopy}
    className={`group relative flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] touch-manipulation border ${
      isCopied
        ? 'bg-blue-500/20 border-blue-500/30 shadow-lg'
        : 'bg-black/30 border-white/10 active:bg-white/15'
    }`}
  >
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className={`p-2 rounded-lg shrink-0 ${isCopied ? 'bg-[#007AFF]/20' : 'bg-white/10'}`}>
        <Icon name="inbox" className={`w-4 h-4 ${isCopied ? 'text-[#409CFF]' : 'text-white/50'}`} />
      </div>
      <span className="text-[15px] font-medium text-white tracking-tight text-left truncate drop-shadow-md">
        {domain}
      </span>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      {isCopied ? (
        <div className="flex items-center gap-1.5">
          <div className="bg-[#34C759] rounded-full p-0.5 shadow-[0_0_8px_rgba(52,199,89,0.9)]">
            <Icon name="check" className="w-3 h-3 text-white" />
          </div>
          <span className="text-[13px] font-semibold text-[#34C759] drop-shadow-md">
            已复制
          </span>
        </div>
      ) : (
        <Icon name="copy" className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
      )}
    </div>
  </button>
));
DomainCard.displayName = 'DomainCard';

export default function MailPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  const filteredDomains = useMemo(() => {
    if (!searchQuery) return DOMAINS;
    return DOMAINS.filter(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const copyToClipboard = async (domain: string) => {
    haptic(30);
    try {
      await navigator.clipboard.writeText(domain);
      setCopiedDomain(domain);
      setTimeout(() => setCopiedDomain(null), 1500);
    } catch {
      haptic(50);
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-white pb-10 selection:bg-blue-400/30 overflow-x-hidden">

      {/* 背景层 */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]">
        <img
          src="https://loliapi.com/acg/"
          alt="background"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="eager"
          onLoad={() => setBgLoaded(true)}
        />
      </div>

      {/* 内容层 */}
      <div className="relative z-10">

        {/* 头部 */}
        <header className="fixed top-0 left-0 right-0 h-[52px] z-40 flex items-center justify-between px-4 pt-2 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/90 hover:text-white transition-all active:scale-95 touch-manipulation"
          >
            <Icon name="home" className="w-5 h-5" />
            <span className="text-[15px] font-semibold tracking-tight drop-shadow-md">
              返回首页
            </span>
          </Link>

          <h1 className="text-[17px] font-semibold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            临时邮箱大全
          </h1>

          <div className="w-20" />
        </header>

        {/* 主内容 */}
        <main className="max-w-[420px] mx-auto px-5 pt-20 pb-10 space-y-6">

          {/* 统计信息 */}
          <div className="bg-black/30 rounded-[20px] p-5 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[24px] font-bold text-white mb-1 drop-shadow-md">
                  {DOMAINS.length}
                </h2>
                <p className="text-[13px] text-white/60">
                  个临时邮箱域名
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#007AFF]/20 to-[#0055b3]/20 p-4 rounded-2xl border border-white/10">
                <Icon name="inbox" className="w-8 h-8 text-[#409CFF]" />
              </div>
            </div>
          </div>

          {/* 搜索框 */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="search" className="w-5 h-5 text-white/40" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索域名"
              className="w-full pl-12 pr-12 py-3.5 bg-black/30 border border-white/20 rounded-[16px] text-[16px] text-white placeholder-white/30 focus:ring-2 focus:ring-white/30 focus:bg-black/40 transition-colors caret-[#007AFF] outline-none shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center touch-manipulation active:scale-90 transition-transform"
              >
                <div className="bg-white/20 rounded-full p-1">
                  <Icon name="close" className="w-4 h-4 text-white" />
                </div>
              </button>
            )}
          </div>

          {/* 域名列表 */}
          <div className="space-y-3">
            {filteredDomains.length > 0 ? (
              <>
                <div className="pl-5 mb-2 text-[13px] font-medium text-white/80 uppercase tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {searchQuery ? `找到 ${filteredDomains.length} 个匹配域名` : '全部域名'}
                </div>
                {filteredDomains.map((domain) => (
                  <DomainCard
                    key={domain}
                    domain={domain}
                    onCopy={() => copyToClipboard(domain)}
                    isCopied={copiedDomain === domain}
                  />
                ))}
              </>
            ) : (
              <div className="bg-black/30 rounded-[20px] p-10 border border-white/20 shadow-xl text-center">
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="search" className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-[16px] text-white/60 mb-2">
                  未找到匹配的域名
                </p>
                <p className="text-[13px] text-white/40">
                  尝试使用其他关键词搜索
                </p>
              </div>
            )}
          </div>

          {/* 页脚 */}
          <footer className="pt-4 pb-8 text-center space-y-4">
            <a
              href="https://t.me/fang180"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[14px] text-[#409CFF] hover:text-[#60aeff] font-bold transition-all active:scale-95 py-2 px-4 rounded-full bg-black/40 touch-manipulation shadow-lg border border-white/10"
            >
              <span className="drop-shadow-md">加入 Telegram 频道</span>
            </a>
            <p className="text-[12px] text-white/80 font-medium tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              共收录 {DOMAINS.length} 个临时邮箱域名
            </p>
          </footer>
        </main>
      </div>

      {/* 样式 */}
      <style jsx global>{`
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}
