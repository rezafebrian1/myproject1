import React, { useState, useEffect } from 'react';
import { Header, Container } from './components/Layout';
import { Card, Button, FileUpload } from './components/Components';
import { 
  Coffee, Shirt, Sliders, CheckCircle2, Download, AlertCircle, RefreshCw, 
  ChevronRight, Sparkles, Image as ImageIcon, Camera, User
} from 'lucide-react';
import { 
  FOOD_STYLES, FASHION_STYLES, ASPECT_RATIOS, 
  FOOD_ANGLES, FASHION_ANGLES, ETHNICITIES, POSES 
} from './constants';
import { 
  WorkflowMode, StyleOption, AspectRatio, GeneratedImage, 
  GenerationRequest, FashionModelOptions 
} from './types';
import { generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<WorkflowMode>(null);

  // Form State
  const [uploadedImages, setUploadedImages] = useState<(string | null)[]>([null, null, null]);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [background, setBackground] = useState<string>('');
  const [bokehLevel, setBokehLevel] = useState<number>(50);
  const [instructions, setInstructions] = useState<string>('');
  
  // Fashion Specific State
  const [fashionOpts, setFashionOpts] = useState<FashionModelOptions>({
    gender: 'Female',
    ethnicity: 'Southeast Asian',
    pose: 'Standing Casual',
    isHijab: false,
    referenceImage: null
  });

  // Results State
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Theme Toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newImages = [...uploadedImages];
      newImages[index] = reader.result as string;
      setUploadedImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setStep(1);
    setMode(null);
    setUploadedImages([null, null, null]);
    setResults([]);
    setSelectedStyle(null);
  };

  const startGeneration = async () => {
    if (!uploadedImages[0] || !selectedStyle) return;

    setStep(3);
    setIsGenerating(true);

    const angles = mode === 'FOOD_DRINK' ? FOOD_ANGLES : FASHION_ANGLES;
    
    // Initialize placeholders
    const initialResults: GeneratedImage[] = angles.map(angle => ({
      angleId: angle.id,
      angleName: angle.name,
      imageUrl: null,
      status: 'pending',
      retryCount: 0
    }));
    setResults(initialResults);

    const validImages = uploadedImages.filter((img): img is string => img !== null);

    const request: GenerationRequest = {
      images: validImages,
      mode,
      style: selectedStyle,
      aspectRatio,
      background,
      bokehLevel: mode === 'FOOD_DRINK' ? bokehLevel : undefined,
      fashionOptions: mode === 'FASHION' ? fashionOpts : undefined,
      instructions
    };

    // Process all angles
    // We do this in parallel but detached so UI updates
    const promises = angles.map(async (angle, index) => {
      // Update status to processing
      setResults(prev => prev.map((item, i) => i === index ? { ...item, status: 'processing' } : item));

      try {
        const imageUrl = await generateImage(request, angle);
        setResults(prev => prev.map((item, i) => i === index ? { ...item, status: 'success', imageUrl } : item));
      } catch (error) {
         setResults(prev => prev.map((item, i) => i === index ? { 
           ...item, 
           status: 'error', 
           error: error instanceof Error ? error.message : 'Failed' 
         } : item));
      }
    });

    await Promise.allSettled(promises);
    setIsGenerating(false);
  };

  // --- Step 1: Mode Selection ---
  const renderModeSelection = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
          RezAI Product Studio
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Ubah foto produk biasa menjadi gambar berkualitas studio dalam hitungan detik.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div 
          onClick={() => { setMode('FOOD_DRINK'); setStep(2); }}
          className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer shadow-xl hover:shadow-2xl h-64 flex flex-col items-center justify-center gap-4"
        >
          <div className="p-4 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 group-hover:scale-110 transition-transform">
            <Coffee className="w-12 h-12" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Food & Drink</h3>
            <p className="text-gray-500 mt-2">Plating, Texture, Freshness</p>
          </div>
        </div>

        <div 
          onClick={() => { setMode('FASHION'); setStep(2); }}
          className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer shadow-xl hover:shadow-2xl h-64 flex flex-col items-center justify-center gap-4"
        >
          <div className="p-4 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 group-hover:scale-110 transition-transform">
            <Shirt className="w-12 h-12" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Fashion</h3>
            <p className="text-gray-500 mt-2">Models, Street, Editorial</p>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Step 2: Configuration ---
  const renderConfig = () => {
    const styles = mode === 'FOOD_DRINK' ? FOOD_STYLES : FASHION_STYLES;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Uploads & Settings */}
        <div className="lg:col-span-4 space-y-6">
          <Card title="1. Upload Photos" className="border-l-4 border-l-blue-600">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-3">
                <FileUpload 
                  label="Main Product (Required)" 
                  image={uploadedImages[0]} 
                  onUpload={(f) => handleImageUpload(0, f)}
                  onRemove={() => {const n = [...uploadedImages]; n[0]=null; setUploadedImages(n)}}
                />
              </div>
              <div className="col-span-1">
                 <FileUpload optional label="Angle 2" image={uploadedImages[1]} onUpload={(f) => handleImageUpload(1, f)} onRemove={() => {const n = [...uploadedImages]; n[1]=null; setUploadedImages(n)}}/>
              </div>
              <div className="col-span-1">
                 <FileUpload optional label="Angle 3" image={uploadedImages[2]} onUpload={(f) => handleImageUpload(2, f)} onRemove={() => {const n = [...uploadedImages]; n[2]=null; setUploadedImages(n)}}/>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Max 10MB per file. Supports PNG, JPG.</p>
          </Card>

          <Card title="2. Aspect Ratio" className="border-l-4 border-l-blue-600">
            <div className="flex gap-2">
              {ASPECT_RATIOS.map(ratio => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.value as AspectRatio)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    aspectRatio === ratio.value 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  {ratio.id}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {ASPECT_RATIOS.find(r => r.value === aspectRatio)?.label}
            </p>
          </Card>

           <Card title="3. Style & Mood" className="border-l-4 border-l-blue-600">
             <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Choose a preset:</p>
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2">
                  {styles.map(style => (
                    <div 
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                        selectedStyle?.id === style.id 
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-md ${style.previewColor} flex-shrink-0`} />
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{style.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{style.description}</p>
                      </div>
                      {selectedStyle?.id === style.id && <CheckCircle2 className="ml-auto text-blue-600 w-5 h-5" />}
                    </div>
                  ))}
                </div>
             </div>
          </Card>

        </div>

        {/* Right Column: Advanced Options & Actions */}
        <div className="lg:col-span-8 space-y-6">
          <Card title="4. Composition Details" className="border-l-4 border-l-blue-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Background Preference</label>
                   <input 
                      type="text" 
                      placeholder="e.g. Marble table, Busy street, Solid Beige..."
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   />
                   <p className="text-xs text-gray-500">Leave empty for AI-generated background matching the style.</p>
                 </div>

                 {mode === 'FOOD_DRINK' && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bokeh (Blur) Level</label>
                         <span className="text-sm font-bold text-blue-600">{bokehLevel}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={bokehLevel} 
                        onChange={(e) => setBokehLevel(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                      />
                    </div>
                 )}

                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Extra Instructions</label>
                   <textarea 
                      rows={3}
                      placeholder="e.g. Add some lemon slices, Make lighting warmer..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   />
                 </div>
              </div>

              {mode === 'FASHION' && (
                <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                    <User className="w-4 h-4" /> Model Settings
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <select 
                      className="p-2 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm"
                      value={fashionOpts.gender}
                      onChange={(e) => setFashionOpts({...fashionOpts, gender: e.target.value as any})}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>

                    <select 
                      className="p-2 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm"
                      value={fashionOpts.ethnicity}
                      onChange={(e) => setFashionOpts({...fashionOpts, ethnicity: e.target.value as any})}
                    >
                      {ETHNICITIES.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>

                     <select 
                      className="p-2 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm col-span-2"
                      value={fashionOpts.pose}
                      onChange={(e) => setFashionOpts({...fashionOpts, pose: e.target.value as any})}
                    >
                      {POSES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  {fashionOpts.gender === 'Female' && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={fashionOpts.isHijab}
                        onChange={(e) => setFashionOpts({...fashionOpts, isHijab: e.target.checked})}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Wear Hijab</span>
                    </label>
                  )}

                  <div className="pt-2">
                     <p className="text-xs font-medium mb-1">Own Model Reference (Optional)</p>
                     <FileUpload 
                        optional 
                        label="Model Photo"
                        image={fashionOpts.referenceImage}
                        onUpload={(f) => {
                          const reader = new FileReader();
                          reader.onload = () => setFashionOpts({...fashionOpts, referenceImage: reader.result as string});
                          reader.readAsDataURL(f);
                        }}
                        onRemove={() => setFashionOpts({...fashionOpts, referenceImage: null})}
                     />
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="pt-4">
             <Button 
                fullWidth 
                onClick={startGeneration} 
                disabled={!uploadedImages[0] || !selectedStyle}
                className="h-14 text-lg shadow-blue-500/20 shadow-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate {mode === 'FOOD_DRINK' ? 'Delicious' : 'Stunning'} Shots
             </Button>
          </div>
        </div>
      </div>
    );
  };

  // --- Step 3: Results ---
  const renderResults = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="text-green-500" /> Generation Complete
          </h2>
          <p className="text-gray-500">6 {mode === 'FOOD_DRINK' ? 'Angles' : 'Views'} generated in {aspectRatio} ratio.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" onClick={() => setStep(2)}>
             <Sliders className="w-4 h-4 mr-2" /> Adjust Settings
           </Button>
           <Button variant="primary" onClick={handleReset}>
             <RefreshCw className="w-4 h-4 mr-2" /> New Project
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <Card key={result.angleId} className="group relative" title={result.angleName}>
            <div className={`
               w-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden
               ${aspectRatio === '9:16' ? 'aspect-[9/16]' : aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-video'}
            `}>
              {result.status === 'processing' && (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-xs text-blue-600 animate-pulse">Designing...</span>
                </div>
              )}
              
              {result.status === 'error' && (
                 <div className="text-center p-4">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-xs text-red-500">{result.error}</p>
                 </div>
              )}

              {result.status === 'success' && result.imageUrl && (
                <>
                  <img src={result.imageUrl} alt={result.angleName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                    <a 
                      href={result.imageUrl} 
                      download={`rezai-${mode}-${result.angleId}.png`}
                      className="p-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans">
      <Header 
        toggleTheme={() => setIsDark(!isDark)} 
        isDark={isDark} 
        onReset={handleReset}
      />
      
      <Container>
        {step === 1 && renderModeSelection()}
        
        {step > 1 && (
          <div className="mb-6 flex items-center text-sm text-gray-500">
            <span className="cursor-pointer hover:text-blue-600" onClick={handleReset}>Home</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className={`font-medium ${step === 2 ? 'text-blue-600' : ''}`}>Configuration</span>
            {step === 3 && (
              <>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="font-medium text-blue-600">Results</span>
              </>
            )}
          </div>
        )}

        {step === 2 && renderConfig()}
        {step === 3 && renderResults()}
      </Container>
    </div>
  );
};

export default App;