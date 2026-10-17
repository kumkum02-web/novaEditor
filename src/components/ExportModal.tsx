import React, { useState } from 'react';
import { ProjectMetadata } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectMetadata;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, project }) => {
  const [resolution, setResolution] = useState(project.resolution);
  const [format, setFormat] = useState('MP4 (H.264)');
  const [framerate, setFramerate] = useState('23.976 fps (Cinematic)');
  const [bitrate, setBitrate] = useState('45 Mbps (High Quality)');
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleStartRender = () => {
    setIsRendering(true);
    setProgress(0);
    setIsDone(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          setIsDone(true);
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  const handleDownload = () => {
    // Generate mock video blob download
    const element = document.createElement('a');
    const file = new Blob([`Mock Render Data for ${project.title}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${project.title.replace(/\s+/g, '_')}_rendered.mp4`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
      <div className="bg-[#1a1b23] border border-[#4a4455] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-[#4a4455] flex items-center justify-between bg-[#1e1f27]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d2bbff] text-[20px]">file_download</span>
            <h3 className="text-sm font-semibold text-[#e3e1ed]">Export &amp; Render Video</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#958da1] hover:text-[#e3e1ed] p-1 rounded hover:bg-[#292932] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-mono text-[#958da1] block mb-1">Project Output</label>
            <div className="text-sm font-semibold text-[#e3e1ed]">{project.title}</div>
            <div className="text-[11px] font-mono text-[#4edea3]">Aspect Ratio: {project.aspectRatio} • Duration: 01:30.00</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#958da1] block mb-1">Resolution</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full bg-[#0d0e15] border border-[#4a4455] rounded p-2 text-[#e3e1ed] outline-none"
              >
                <option value="1080p High">1080p Full HD (1920x1080)</option>
                <option value="4K Cinema">4K UHD Cinema (3840x2160)</option>
                <option value="720p Fast">720p Fast Web (1280x720)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#958da1] block mb-1">Video Codec</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-[#0d0e15] border border-[#4a4455] rounded p-2 text-[#e3e1ed] outline-none"
              >
                <option value="MP4 (H.264)">MP4 (H.264 / AAC)</option>
                <option value="ProRes 422">Apple ProRes 422 HQ</option>
                <option value="WebM VP9">WebM (VP9 / Opus)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#958da1] block mb-1">Framerate</label>
              <select
                value={framerate}
                onChange={(e) => setFramerate(e.target.value)}
                className="w-full bg-[#0d0e15] border border-[#4a4455] rounded p-2 text-[#e3e1ed] outline-none"
              >
                <option value="23.976 fps (Cinematic)">23.976 fps (Cinematic Film)</option>
                <option value="30 fps">30 fps (Broadcast)</option>
                <option value="60 fps (Smooth)">60 fps (Smooth Motion)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#958da1] block mb-1">Target Bitrate</label>
              <select
                value={bitrate}
                onChange={(e) => setBitrate(e.target.value)}
                className="w-full bg-[#0d0e15] border border-[#4a4455] rounded p-2 text-[#e3e1ed] outline-none"
              >
                <option value="45 Mbps (High Quality)">45 Mbps (High Quality)</option>
                <option value="80 Mbps (Master)">80 Mbps (Master Archive)</option>
                <option value="20 Mbps (Web)">20 Mbps (Web Optimized)</option>
              </select>
            </div>
          </div>

          {/* Progress or Render Status */}
          {isRendering && (
            <div className="p-3 bg-[#0d0e15] rounded-lg border border-[#7c3aed] space-y-2">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-[#d2bbff] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7c3aed] animate-ping"></span>
                  Encoding Frames via WebCodecs GPU...
                </span>
                <span className="text-[#e3e1ed]">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#33343d] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7c3aed] to-[#4cd7f6] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {isDone && (
            <div className="p-3 bg-[#007650]/20 rounded-lg border border-[#4edea3]/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#4edea3]">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span className="font-semibold text-xs">Render Completed Successfully!</span>
              </div>
              <button
                onClick={handleDownload}
                className="px-3 py-1 bg-[#4edea3] text-[#002113] rounded font-semibold text-xs hover:bg-[#4edea3]/90 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span>Download File</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1e1f27] border-t border-[#4a4455] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#292932] text-[#ccc3d8] hover:text-[#e3e1ed] font-medium text-xs transition-colors"
          >
            Cancel
          </button>
          {!isDone ? (
            <button
              onClick={handleStartRender}
              disabled={isRendering}
              className="px-4 py-2 rounded-lg bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-[#ede0ff] font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-[#7c3aed]/40 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>{isRendering ? 'Rendering...' : 'Start Render'}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#7c3aed] text-[#ede0ff] font-semibold text-xs"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
