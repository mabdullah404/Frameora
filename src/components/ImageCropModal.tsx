"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  UploadCloud,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Trash2,
  Camera,
  Move,
} from "lucide-react";
import UserAvatar from "./UserAvatar";

interface ImageCropModalProps {
  isOpen: boolean;
  currentAvatar?: string | null;
  userName?: string | null;
  onClose: () => void;
  onSave: (croppedDataUrl: string) => void;
  onRemove: () => void;
}

export default function ImageCropModal({
  isOpen,
  currentAvatar,
  userName,
  onClose,
  onSave,
  onRemove,
}: ImageCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize modal state
  useEffect(() => {
    if (isOpen) {
      setImageSrc(null);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setPreviewDataUrl(null);
    }
  }, [isOpen]);

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WebP)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // Mouse / Touch drag handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!imageSrc || e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Export cropped canvas
  const generateCroppedImage = useCallback((): string | null => {
    if (!imageRef.current || !containerRef.current) return null;

    const canvas = document.createElement("canvas");
    const outputSize = 512; // High-resolution output for crisp avatars
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const img = imageRef.current;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const cropSize = containerRect.width; // 280px square mask

    // Calculate crop parameters
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw circular clip path
    ctx.save();
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Map the visible screen area to the 512x512 canvas
    const scaleFactor = outputSize / cropSize;
    const drawWidth = img.naturalWidth * zoom * scaleFactor;
    const drawHeight = img.naturalHeight * zoom * scaleFactor;
    const drawX = (outputSize - drawWidth) / 2 + position.x * scaleFactor;
    const drawY = (outputSize - drawHeight) / 2 + position.y * scaleFactor;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();

    return canvas.toDataURL("image/jpeg", 0.95);
  }, [zoom, position]);

  // Update live preview when controls change
  useEffect(() => {
    if (imageSrc && imageRef.current) {
      const timer = setTimeout(() => {
        const cropped = generateCroppedImage();
        setPreviewDataUrl(cropped);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [imageSrc, zoom, position, generateCroppedImage]);

  const handleConfirm = () => {
    const cropped = generateCroppedImage();
    if (cropped) {
      onSave(cropped);
      onClose();
    }
  };

  const handleResetPosition = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex justify-center items-start sm:items-center pt-8 sm:pt-14 pb-16">
      <div className="relative w-full max-w-xl rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121422] p-5 sm:p-8 shadow-2xl my-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Camera className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Customize Profile Picture</h2>
            <p className="text-xs text-gray-400">
              Drag, zoom, and position your photo to set your perfect avatar
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        {!imageSrc ? (
          /* Step 1: Upload / Drag & Drop Area */
          <div className="space-y-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all flex flex-col items-center justify-center gap-4 ${
                isDragOver
                  ? "border-purple-500 bg-purple-600/10 scale-[1.01]"
                  : "border-white/15 bg-white/[0.02] hover:border-purple-500/50 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 text-purple-400 border border-purple-500/30">
                <UploadCloud className="h-8 w-8" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Drag & Drop your new profile photo here
                </p>
                <p className="text-xs text-purple-400 mt-1 font-medium">
                  or click to browse from device
                </p>
                <p className="text-[11px] text-gray-400 mt-2">
                  Supports JPG, PNG, WebP up to 15MB
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Current Avatar preview & Remove option */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar src={currentAvatar} name={userName} size="md" />
                <div>
                  <p className="text-xs font-semibold text-white">Current Profile Picture</p>
                  <p className="text-[11px] text-gray-400">
                    {currentAvatar ? "Custom uploaded picture active" : "Default initial avatar active"}
                  </p>
                </div>
              </div>

              {currentAvatar && (
                <button
                  type="button"
                  onClick={() => {
                    onRemove();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove Picture</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Step 2: Interactive Cropper with Circular Mask */
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              
              {/* Crop Viewport */}
              <div className="flex flex-col items-center">
                <div
                  ref={containerRef}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  className="relative h-64 w-64 sm:h-72 sm:w-72 rounded-full overflow-hidden border-4 border-purple-500/60 shadow-2xl bg-black/60 cursor-grab active:cursor-grabbing select-none"
                  title="Drag image to reposition"
                >
                  {/* Image being dragged/zoomed */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Crop Target"
                    draggable={false}
                    className="absolute max-w-none origin-center pointer-events-none transition-transform duration-75"
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                      top: "50%",
                      left: "50%",
                      marginLeft: imageRef.current ? -imageRef.current.naturalWidth / 2 : 0,
                      marginTop: imageRef.current ? -imageRef.current.naturalHeight / 2 : 0,
                    }}
                    onLoad={() => {
                      if (imageRef.current) {
                        // Center image initially
                        const containerSize = 280;
                        const scale = Math.max(
                          containerSize / imageRef.current.naturalWidth,
                          containerSize / imageRef.current.naturalHeight
                        );
                        setZoom(scale > 0 ? scale : 1);
                      }
                    }}
                  />

                  {/* Circular Grid overlay */}
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/20 rounded-full flex items-center justify-center">
                    <div className="w-1/3 h-full border-x border-white/15" />
                    <div className="h-1/3 w-full border-y border-white/15 absolute" />
                  </div>
                </div>

                <p className="mt-2 text-[11px] text-gray-400 flex items-center gap-1">
                  <Move className="h-3 w-3 text-purple-400" />
                  <span>Drag photo to adjust position</span>
                </p>
              </div>

              {/* Real-time Preview Pill */}
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-xs font-semibold text-gray-300 mb-3">Live Result</p>
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-lg relative bg-black/40">
                  {previewDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewDataUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <UserAvatar name={userName} size="lg" />
                  )}
                </div>
                <span className="mt-2 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Ready to Apply
                </span>
              </div>
            </div>

            {/* Zoom Slider and Controls */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <ZoomIn className="h-4 w-4 text-purple-400" />
                  <span>Zoom Level: {Math.round(zoom * 100)}%</span>
                </span>
                <button
                  type="button"
                  onClick={handleResetPosition}
                  className="inline-flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Center</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-gray-300 hover:bg-white/10"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <input
                  type="range"
                  min="0.3"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-gray-300 hover:bg-white/10"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setImageSrc(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-white/10"
              >
                Choose Different Photo
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:brightness-110"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Profile Picture</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
