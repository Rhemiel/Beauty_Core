'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Sparkles, Loader2, ArrowLeft, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConsultationPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: "Hello! I'm your AI Beauty Advisor. Let's design your perfect look today. To get started, what kind of style, color, and design are you looking for? You can also upload a photo of your current look for personalized recommendations!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  
  // State for image generation
  const [style, setStyle] = useState('Modern Minimalist');
  const [color, setColor] = useState('Pastel Pink');
  const [design, setDesign] = useState('Clean & Elegant');
  const [theme, setTheme] = useState('Classic');
  const [event, setEvent] = useState('Everyday Wear');
  
  const [images, setImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // State for image upload
  const [uploadedImage, setUploadedImage] = useState(null); // Base64 string
  const [uploadedImageName, setUploadedImageName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle file upload
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'ai',
        content: "Please upload a valid image file (JPG, PNG, or WebP)."
      }]);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'ai',
        content: "That image is too large. Please upload an image under 10MB."
      }]);
      return;
    }

    setIsUploading(true);
    setUploadedImageName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setUploadedImage(base64);
      setIsUploading(false);

      // Add AI acknowledgment message
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'ai',
        content: `Great, I see you've uploaded "${file.name}"! I'll use this photo as the base for your new designs. Adjust the Style, Color, and Design fields on the right, then click "Generate Previews" to see AI-powered transformations of your image.`
      }]);
    };
    reader.onerror = () => {
      setIsUploading(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'ai',
        content: "Sorry, there was an error reading your image. Please try again."
      }]);
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  // Remove uploaded image
  const removeUploadedImage = () => {
    setUploadedImage(null);
    setUploadedImageName('');
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'ai',
      content: "Image removed. I'll generate fresh designs from scratch based on your text parameters instead."
    }]);
  };

  // Handle Chat Submit
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate AI text model response (Since you mentioned an actual text model will be plugged in later)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        role: 'ai', 
        content: `I've noted that! Once you are happy with our discussion, simply verify the parameters on the right and click "Generate Previews" to see the magic.` 
      }]);
    }, 1000);
  };

  // Handle Image Generation
  const generateImages = async () => {
    setIsGenerating(true);
    setError('');
    
    // Add system message
    const genMsg = uploadedImage
      ? "Transforming your uploaded image with AI based on those parameters..."
      : "Generating your custom previews based on those parameters...";
    setMessages(prev => [...prev, { id: Date.now(), role: 'ai', content: genMsg }]);

    try {
      const payload = { style, color, design, theme, event };
      if (uploadedImage) {
        payload.image = uploadedImage;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate images');
      }

      // If success, update images
      if (data.images && data.images.length > 0) {
        setImages(data.images.map(img => img.imageUrl));
        const resultMsg = uploadedImage
          ? "Here are 3 AI-enhanced variations of your photo! Check the gallery on the right."
          : "Here are your 3 personalized visual previews! Check the gallery on the right.";
        setMessages(prev => [...prev, { id: Date.now(), role: 'ai', content: resultMsg }]);
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', content: `Oops, something went wrong: ${err.message}. Please check your API billing or try again.` }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0a2e] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#7b2fa0] rounded-full mix-blend-screen filter blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#f0a800] rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <ArrowLeft size={20} className="text-[#d060f0]" />
          </a>
          <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d060f0] to-[#f5c040]">
            AI Style Consultation
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Column: Chatbot */}
        <section className="lg:col-span-5 flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm h-[80vh] shadow-2xl">
          {/* Chat Header */}
          <div className="bg-black/20 p-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7b2fa0] to-[#d060f0] flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-[#f9f4ff]">AI Advisor</h2>
              <p className="text-xs text-[#9a7ab8]">Powered by BeautyCore AI</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-md ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#7b2fa0] to-[#b040d8] text-white rounded-tr-none'
                        : 'bg-white/10 border border-white/5 text-[#e0c8f0] rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Uploaded Image Preview (above input) */}
          <AnimatePresence>
            {uploadedImage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pt-3 bg-black/10 border-t border-white/5"
              >
                <div className="flex items-center gap-3 p-2 bg-white/5 border border-white/10 rounded-xl">
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/20">
                    <img
                      src={uploadedImage}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#d060f0] font-semibold truncate">{uploadedImageName}</p>
                    <p className="text-[10px] text-[#9a7ab8] mt-0.5">Ready for AI transformation</p>
                  </div>
                  <button
                    onClick={removeUploadedImage}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-red-500/20 transition-colors group flex-shrink-0"
                    title="Remove image"
                  >
                    <X size={14} className="text-[#9a7ab8] group-hover:text-red-400 transition-colors" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Input */}
          <form onSubmit={handleChatSubmit} className="p-4 bg-black/20 border-t border-white/10">
            <div className="relative flex items-center gap-2">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              {/* Upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-[#7b2fa0]/30 hover:border-[#7b2fa0]/50 disabled:opacity-50 transition-all group flex-shrink-0"
                title="Upload an image"
              >
                {isUploading ? (
                  <Loader2 size={18} className="text-[#d060f0] animate-spin" />
                ) : (
                  <Upload size={18} className="text-[#9a7ab8] group-hover:text-[#d060f0] transition-colors" />
                )}
              </button>
              {/* Text input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe your dream look..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder:text-[#9a7ab8] focus:outline-none focus:ring-2 focus:ring-[#7b2fa0] transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#7b2fa0] hover:bg-[#b040d8] disabled:opacity-50 transition-colors"
                >
                  <Send size={16} className="text-white" />
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Right Column: Generation Controls & Gallery */}
        <section className="lg:col-span-7 flex flex-col gap-6 h-[80vh] overflow-y-auto custom-scrollbar pr-2">
          
          {/* Generation Parameters Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
            <h3 className="text-lg font-serif font-semibold mb-4 text-[#f5c040] flex items-center gap-2">
              <ImageIcon size={18} /> Finalize Your Previews
            </h3>

            {/* Uploaded image indicator in the parameters panel */}
            {uploadedImage && (
              <div className="mb-4 p-3 bg-[#7b2fa0]/10 border border-[#7b2fa0]/30 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-[#7b2fa0]/40">
                  <img src={uploadedImage} alt="Base" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#d060f0] font-semibold">Base Image Loaded</p>
                  <p className="text-[10px] text-[#9a7ab8] truncate">{uploadedImageName}</p>
                </div>
                <span className="text-[10px] bg-[#7b2fa0]/30 text-[#d060f0] px-2 py-1 rounded-full border border-[#7b2fa0]/40 flex-shrink-0">
                  IMG2IMG
                </span>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-xs text-[#9a7ab8] mb-1 uppercase tracking-wider">Style</label>
                <input 
                  type="text" 
                  value={style} 
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#7b2fa0]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9a7ab8] mb-1 uppercase tracking-wider">Color Palette</label>
                <input 
                  type="text" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#7b2fa0]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9a7ab8] mb-1 uppercase tracking-wider">Design Elements</label>
                <input 
                  type="text" 
                  value={design} 
                  onChange={(e) => setDesign(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#7b2fa0]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9a7ab8] mb-1 uppercase tracking-wider">Theme</label>
                <input 
                  type="text" 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#7b2fa0]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9a7ab8] mb-1 uppercase tracking-wider">Event / Occasion</label>
                <input 
                  type="text" 
                  value={event} 
                  onChange={(e) => setEvent(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#7b2fa0]"
                />
              </div>
            </div>

            <button
              onClick={generateImages}
              disabled={isGenerating || !style || !color || !design || !theme || !event}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7b2fa0] to-[#f0a800] hover:opacity-90 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition-opacity shadow-lg shadow-[#7b2fa0]/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Generate Previews
                </>
              )}
            </button>
            
            {error && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                {error}
              </div>
            )}
          </div>

          {/* Image Gallery */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-xl min-h-[300px]">
            <h3 className="text-lg font-serif font-semibold mb-4 text-[#f9f4ff]">Generated Results</h3>
            
            {isGenerating ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 border border-white/10 animate-pulse flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-t from-[#7b2fa0]/20 to-transparent animate-pulse" />
                     <Loader2 size={30} className="text-[#9a7ab8] animate-spin" />
                  </div>
                ))}
              </div>
            ) : images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {images.map((url, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 shadow-lg group relative cursor-pointer"
                  >
                    <img 
                      src={url} 
                      alt={`Generated preview ${i+1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-xs font-semibold bg-[#7b2fa0]/80 px-2 py-1 rounded backdrop-blur-sm border border-white/20">
                        Option {i + 1}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-[#9a7ab8] border-2 border-dashed border-white/10 rounded-xl bg-black/10">
                <ImageIcon size={40} className="mb-3 opacity-50" />
                <p className="text-sm">No images generated yet.</p>
                <p className="text-xs mt-1 opacity-60">Chat with the AI and click Generate Previews.</p>
              </div>
            )}
          </div>

        </section>
      </main>

      {/* Global styles specifically for this page's scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(123, 47, 160, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(123, 47, 160, 0.6); }
      `}} />
    </div>
  );
}
