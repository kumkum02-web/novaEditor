import React, { useState } from 'react';
import { AspectRatio, ProjectMetadata } from '../types';
import { ASSETS } from '../data/initialData';

interface HeaderProps {
  project: ProjectMetadata;
  onUpdateProject: (updates: Partial<ProjectMetadata>) => void;
  onOpenMagicTools: () => void;
  onOpenExport: () => void;
  zoom: number;
  onChangeZoom: (newZoom: number) => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  onUpdateProject,
  onOpenMagicTools,
  onOpenExport,
  zoom,
  onChangeZoom,
  onUndo,
  onRedo,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(project.title);
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [showMagicMenu, setShowMagicMenu] = useState(false);

  const handleTitleSubmit = () => {
    if (tempTitle.trim()) {
      onUpdateProject({ title: tempTitle.trim(), lastSaved: 'Saved just now' });
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSubmit();
    if (e.key === 'Escape') {
      setTempTitle(project.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-3 h-12 bg-[#1a1b23] border-b border-[#4a4455] shrink-0 z-50">
      {/* Left: Brand, Project name & Sync status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#7c3aed]/30 ring-1 ring-[#d2bbff]/40">
            <span className="material-symbols-outlined text-[#3f008e] text-[18px] fill">auto_awesome</span>
          </div>
          <span className="text-base font-bold text-[#e3e1ed] tracking-tight ml-1 font-sans">NovaClip</span>
          <span className="bg-[#7c3aed]/20 text-[#d2bbff] border border-[#d2bbff]/30 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide ml-1">
            PRO
          </span>
        </div>

        <div className="h-4 w-px bg-[#4a4455]"></div>

        {/* Project Title with Quick Rename & Cloud Status */}
        <div className="flex items-center gap-2 group px-2 py-1 rounded transition-colors duration-150 hover:bg-[#292932]">
          {isEditingTitle ? (
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bg-[#1e1f27] text-[#e3e1ed] text-xs font-semibold px-2 py-0.5 rounded border border-[#7c3aed] outline-none"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-semibold text-[#e3e1ed] flex items-center gap-1.5 hover:text-[#d2bbff] transition-colors"
              title="Click to rename project"
            >
              <span>{project.title}</span>
              <span className="material-symbols-outlined text-[#958da1] text-[14px] group-hover:text-[#d2bbff] transition-colors">
                edit
              </span>
            </button>
          )}

          <div className="flex items-center gap-1 text-[#4edea3] text-[11px] font-mono pl-1">
            <span className="material-symbols-outlined text-[#4edea3] text-[14px]">cloud_done</span>
            <span className="font-medium text-[#4edea3]">{project.lastSaved}</span>
          </div>
        </div>
      </div>

      {/* Center: Format Switcher, History, Zoom & AI Credits */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Aspect Ratio Switcher */}
        <div className="bg-[#0d0e15] p-0.5 rounded-lg border border-[#4a4455] flex items-center gap-0.5 shadow-inner">
          {(['16:9', '9:16', '1:1'] as AspectRatio[]).map((ratio) => {
            const isActive = project.aspectRatio === ratio;
            const iconName = ratio === '16:9' ? 'crop_16_9' : ratio === '9:16' ? 'crop_portrait' : 'crop_square';
            return (
              <button
                key={ratio}
                onClick={() => onUpdateProject({ aspectRatio: ratio })}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-[#292932] text-[#d2bbff] font-semibold shadow-sm'
                    : 'text-[#ccc3d8] hover:text-[#e3e1ed] hover:bg-[#1e1f27]'
                }`}
                title={`Switch viewport to ${ratio}`}
              >
                <span className={`material-symbols-outlined text-[14px] ${isActive ? 'fill' : ''}`}>{iconName}</span>
                <span>{ratio}</span>
              </button>
            );
          })}
        </div>

        {/* Undo / Redo & Zoom */}
        <div className="flex items-center gap-1 bg-[#0d0e15] px-2 py-0.5 rounded-lg border border-[#4a4455] relative">
          <button
            onClick={onUndo}
            className="p-1 text-[#ccc3d8] hover:text-[#e3e1ed] rounded hover:bg-[#1e1f27] transition-colors"
            title="Undo (Cmd+Z)"
          >
            <span className="material-symbols-outlined text-[16px]">undo</span>
          </button>
          <button
            onClick={onRedo}
            className="p-1 text-[#ccc3d8] hover:text-[#e3e1ed] rounded hover:bg-[#1e1f27] transition-colors"
            title="Redo (Cmd+Shift+Z)"
          >
            <span className="material-symbols-outlined text-[16px]">redo</span>
          </button>
          <div className="h-3 w-px bg-[#4a4455] mx-1"></div>
          <button
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            className="flex items-center gap-1 text-[#ccc3d8] text-xs font-mono px-1 cursor-pointer hover:text-[#e3e1ed]"
          >
            <span>{zoom}%</span>
            <span className="material-symbols-outlined text-[12px]">expand_more</span>
          </button>

          {showZoomMenu && (
            <div className="absolute top-8 left-12 bg-[#1e1f27] border border-[#4a4455] rounded-lg shadow-xl py-1 z-50 text-xs w-24">
              {[50, 72, 100, 125, 150].map((z) => (
                <button
                  key={z}
                  onClick={() => {
                    onChangeZoom(z);
                    setShowZoomMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1 hover:bg-[#292932] font-mono ${
                    zoom === z ? 'text-[#d2bbff] font-bold' : 'text-[#e3e1ed]'
                  }`}
                >
                  {z}%
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AI Tokens Pill Counter */}
        <div
          onClick={onOpenMagicTools}
          className="flex items-center gap-1.5 bg-[#7c3aed]/15 border border-[#d2bbff]/30 px-2.5 py-1 rounded-full text-[#d2bbff] shadow-sm hover:border-[#d2bbff]/60 cursor-pointer transition-colors"
          title="AI Credits Available (Click to view usage & recharge)"
        >
          <span className="material-symbols-outlined text-[#4cd7f6] text-[14px] fill">bolt</span>
          <span className="font-mono text-xs font-semibold text-[#eaddff]">
            {project.credits.toLocaleString()} credits
          </span>
        </div>
      </div>

      {/* Right: Collab, Magic Tools Dropdown, Export CTA */}
      <div className="flex items-center gap-2.5">
        {/* Team Avatars & Share */}
        <div className="flex items-center -space-x-2 border-r border-[#4a4455] pr-3 mr-1">
          <div className="w-6 h-6 rounded-full ring-2 ring-[#1a1b23] overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Creative director avatar"
              referrerPolicy="no-referrer"
              src={ASSETS.creatorAvatar1}
            />
          </div>
          <div className="w-6 h-6 rounded-full ring-2 ring-[#1a1b23] overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Motion designer avatar"
              referrerPolicy="no-referrer"
              src={ASSETS.creatorAvatar2}
            />
          </div>
          <button
            onClick={() => alert('Invited 3 collaborators to this Cyberpunk Future project.')}
            className="w-6 h-6 rounded-full bg-[#33343d] ring-2 ring-[#1a1b23] text-[#ccc3d8] hover:text-[#e3e1ed] flex items-center justify-center text-[10px] font-bold"
            title="Team members (3 active)"
          >
            +3
          </button>
        </div>

        {/* Secondary Action: AI Magic Tools */}
        <div className="relative">
          <button
            onClick={() => setShowMagicMenu(!showMagicMenu)}
            className="px-3 py-1.5 rounded-lg bg-[#1e1f27] text-[#d2bbff] text-xs font-semibold border border-[#d2bbff]/30 hover:border-[#d2bbff] flex items-center gap-1.5 hover:bg-[#292932] transition-all active:scale-95 duration-100"
          >
            <span className="material-symbols-outlined text-[16px] text-[#d2bbff] fill">magic_button</span>
            <span>Magic Tools</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>

          {showMagicMenu && (
            <div className="absolute right-0 top-10 w-56 bg-[#1e1f27] border border-[#4a4455] rounded-xl shadow-2xl py-1.5 z-50">
              <button
                onClick={() => {
                  setShowMagicMenu(false);
                  onOpenMagicTools();
                }}
                className="w-full px-3 py-2 text-left text-xs text-[#e3e1ed] hover:bg-[#292932] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[#4edea3] text-[16px]">cut</span>
                <span>Auto-Remove Silence (3 cuts)</span>
              </button>
              <button
                onClick={() => {
                  setShowMagicMenu(false);
                  onOpenMagicTools();
                }}
                className="w-full px-3 py-2 text-left text-xs text-[#e3e1ed] hover:bg-[#292932] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">movie_filter</span>
                <span>Generate Matching B-Roll</span>
              </button>
              <button
                onClick={() => {
                  setShowMagicMenu(false);
                  onOpenMagicTools();
                }}
                className="w-full px-3 py-2 text-left text-xs text-[#e3e1ed] hover:bg-[#292932] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[#d2bbff] text-[16px]">translate</span>
                <span>Dub to Spanish / Multilingual</span>
              </button>
              <div className="h-px bg-[#4a4455] my-1"></div>
              <button
                onClick={() => {
                  setShowMagicMenu(false);
                  onOpenMagicTools();
                }}
                className="w-full px-3 py-2 text-left text-xs text-[#d2bbff] font-semibold hover:bg-[#292932] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[#d2bbff] text-[16px]">offline_bolt</span>
                <span>Open Full Magic Suite...</span>
              </button>
            </div>
          )}
        </div>

        {/* Primary Action: Export & Render */}
        <div className="inline-flex rounded-lg shadow-sm">
          <button
            onClick={onOpenExport}
            className="px-3.5 py-1.5 bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-[#ede0ff] text-xs font-semibold rounded-l-lg border-r border-[#d2bbff]/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(124,58,237,0.45)] hover:shadow-[0_0_18px_rgba(124,58,237,0.65)] transition-all active:scale-95 duration-100"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export & Render</span>
          </button>
          <button
            onClick={onOpenExport}
            className="px-2 py-1.5 bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-[#ede0ff] rounded-r-lg flex items-center justify-center transition-colors active:scale-95"
            title="Export Options"
          >
            <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
          </button>
        </div>
      </div>
    </header>
  );
};
