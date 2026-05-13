const fs = require('fs');

function updateFile(filePath, sidebarComponent) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Remove old LOOKS const
    content = content.replace(/const LOOKS = \[\s*\{ label:'Look 1.*?\n.*?\n.*?\n\]\n/s, '');
    
    // Add state variables
    const stateVars = 
  const [style, setStyle] = useState('Modern Minimalist')
  const [color, setColor] = useState('Pastel Pink')
  const [design, setDesign] = useState('Clean & Elegant')
  const [genTheme, setGenTheme] = useState('Classic')
  const [event, setEvent] = useState('Everyday Wear')
  const [generatedImages, setGeneratedImages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [uploadedBase64, setUploadedBase64] = useState(null)
;
    content = content.replace(/const \[loading, setLoading\] = useState\(false\)/, 'const [loading, setLoading] = useState(false)' + stateVars);

    // Update handlePhoto
    const handlePhotoUpdated = unction handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhoto(url)

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedBase64(event.target.result);
    };
    reader.readAsDataURL(file);

    const newMessages = [...messages, { role:'user', text:'📸 I uploaded my photo for analysis.', image: url }];
    content = content.replace(/function handlePhoto\(e\) \{\s*const file = e\.target\.files\[0\]\s*if \(!file\) return\s*const url = URL\.createObjectURL\(file\)\s*setPhoto\(url\)\s*const newMessages = \[\.\.\.messages, \{ role:'user', text:'📸 I uploaded my photo for analysis\.', image: url \}\]/, handlePhotoUpdated);

    // Add generateImages function
    const generateImagesFn = 
  const generateImages = async () => {
    setIsGenerating(true);
    setError('');
    
    setMessages(prev => [...prev, { role: 'ai', text: "Generating your custom AI visual previews..." }]);
    scrollToBottom();

    try {
      const payload = { style, color, design, theme: genTheme, event };
      if (uploadedBase64) {
        payload.image = uploadedBase64;
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

      if (data.images && data.images.length > 0) {
        setGeneratedImages(data.images.map(img => img.imageUrl));
        setMessages(prev => [...prev, { role: 'ai', text: "Your custom AI previews are ready! Check them out in the generator panel on the right." }]);
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
      setMessages(prev => [...prev, { role: 'ai', text: \Oops, something went wrong generating the images: \\ }]);
    } finally {
      setIsGenerating(false);
      scrollToBottom();
    }
  };
;
    content = content.replace(/function confirmBook\(svc\) \{/, generateImagesFn + '\n  function confirmBook(svc) {');

    // Remove setLooks(LOOKS)
    content = content.replace(/setLooks\(LOOKS\)\n/g, '');

    // Replace the right panel AI Generated Looks UI
    const rightPanelUI = 
                {/* Advanced AI Generator */}
                <h3 className="font-serif text-[16px] text-white mb-3 tracking-[1px] pt-4 border-t border-[#b040d8]/15">Advanced AI Generator</h3>
                
                <div className="flex flex-col gap-3 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-[#9a7ab8] mb-1 uppercase tracking-wider">Style</label>
                      <input type="text" value={style} onChange={e => setStyle(e.target.value)} className="w-full bg-[#b040d8]/8 border border-[#b040d8]/25 text-white font-sans text-[11px] px-2 py-1.5 outline-none focus:border-[#f0a800]" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#9a7ab8] mb-1 uppercase tracking-wider">Color</label>
                      <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full bg-[#b040d8]/8 border border-[#b040d8]/25 text-white font-sans text-[11px] px-2 py-1.5 outline-none focus:border-[#f0a800]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-[#9a7ab8] mb-1 uppercase tracking-wider">Theme</label>
                      <input type="text" value={genTheme} onChange={e => setGenTheme(e.target.value)} className="w-full bg-[#b040d8]/8 border border-[#b040d8]/25 text-white font-sans text-[11px] px-2 py-1.5 outline-none focus:border-[#f0a800]" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#9a7ab8] mb-1 uppercase tracking-wider">Event</label>
                      <input type="text" value={event} onChange={e => setEvent(e.target.value)} className="w-full bg-[#b040d8]/8 border border-[#b040d8]/25 text-white font-sans text-[11px] px-2 py-1.5 outline-none focus:border-[#f0a800]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] text-[#9a7ab8] mb-1 uppercase tracking-wider">Design Elements</label>
                    <input type="text" value={design} onChange={e => setDesign(e.target.value)} className="w-full bg-[#b040d8]/8 border border-[#b040d8]/25 text-white font-sans text-[11px] px-2 py-1.5 outline-none focus:border-[#f0a800]" />
                  </div>
                  
                  <button onClick={generateImages} disabled={isGenerating} className="w-full py-2.5 mt-2 bg-gradient-to-r from-[#7b2fa0] to-[#f0a800] text-white font-sans text-[10px] font-bold tracking-[1px] uppercase border-none cursor-pointer disabled:opacity-50 hover:opacity-90 shadow-lg shadow-[#7b2fa0]/20 flex items-center justify-center gap-2">
                    {isGenerating ? 'Generating...' : '✨ Generate AI Previews'}
                  </button>
                  {error && <p className="text-red-400 text-[10px]">{error}</p>}
                </div>

                <div className="flex flex-col gap-3">
                  {isGenerating ? (
                    <div className="flex justify-center p-6"><span className="w-6 h-6 border-2 border-[#f0a800] border-t-transparent rounded-full animate-spin"></span></div>
                  ) : generatedImages.length > 0 ? (
                    generatedImages.map((url, i) => (
                      <div key={i} className="border border-[#b040d8]/15 overflow-hidden">
                        <img src={url} alt="Generated" className="w-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <div className="border border-dashed border-[#b040d8]/30 p-6 text-center text-[#9a7ab8] text-[10px]">
                      No images generated yet.<br/>Adjust parameters and click Generate.
                    </div>
                  )}
                </div>
;
    content = content.replace(/<h3 className="font-serif text-\[16px\] text-white mb-3 tracking-\[1px\]">AI Generated Looks<\/h3>.*?(?=<\/div>\s*<\/div>\s*<\/div>\s*<div className="ml-\[240px\] flex-1 flex flex-col">|<div className="fixed inset-0 bg-\[#0a0214\]\/85 z-\[200\])/s, rightPanelUI + '\n              </div>\n            </div>\n          )}\n        </div>\n      </div>\n\n      {/* Book Modal */}');

    fs.writeFileSync(filePath, content, 'utf-8');
}

updateFile('./src/screens/client/AIAdvisor.jsx', 'ClientSidebar');
updateFile('./src/screens/stylist/AIAdvisor.jsx', 'StylistSidebar');
console.log('Update complete');
