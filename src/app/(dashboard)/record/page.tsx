"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Camera, UploadCloud, Loader2, Save, X, CheckCircle2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function Record() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  
  // Template state
  const [templates, setTemplates] = useState<{name: string, headers: string[]}[]>([]);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);

  // Cloudinary state
  const [images, setImages] = useState<{ url: string, note: string }[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recognition instance
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Load templates
    const stored = localStorage.getItem("templates");
    if (stored) {
      setTemplates(JSON.parse(stored));
    }

    // Initialize Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-IN'; // Explicitly optimize for Indian English accents and local names

        recognitionRef.current.onresult = (event: any) => {
          let fullTranscript = '';
          // Iterate through all results since the start of the recording session
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript + ' ';
          }
          // Replace the entire transcript state instead of appending to avoid duplicates
          setTranscript(fullTranscript.trim());
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      setExtractedData(null);
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const processTranscript = async () => {
    if (!transcript.trim()) return;
    setIsProcessing(true);

    try {
      let headers = ["Name", "Amount", "Date", "Remarks"]; // Default fallback
      if (templates.length > 0 && templates[selectedTemplateIndex]) {
        headers = templates[selectedTemplateIndex].headers;
      }

      const localDate = new Date().toLocaleDateString('en-CA'); // Gets local YYYY-MM-DD
      
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, templateHeaders: headers, localDate })
      });

      const data = await res.json();
      if (data.data) {
        if (data.note) {
          alert(data.note);
        }
        setExtractedData(data.data);
      } else {
        alert(data.error || "Failed to extract data");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing your voice data.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const cloudName = localStorage.getItem("cloudinaryName");
      const uploadPreset = localStorage.getItem("cloudinaryPreset");

      if (!cloudName || !uploadPreset) {
        alert("Please configure Cloudinary in the Setup Wizard first.");
        setUploadingImage(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setImages(prev => [...prev, { url: data.secure_url, note: "" }]);
      } else {
        alert("Upload failed. Check your Cloudinary settings.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const updateImageNote = (index: number, note: string) => {
    const newImages = [...images];
    newImages[index].note = note;
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const saveToDatabase = async () => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        alert("Database not connected. Please run the Setup Wizard again.");
        return;
      }

      // We need the table name. In SetupWizard we will standardize names to lowercase, 
      // replace spaces with underscores, and remove extensions.
      const currentTemplate = templates[selectedTemplateIndex];
      const tableName = currentTemplate.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_").toLowerCase();

      // Collect all data and normalize keys to match database columns
      const payload: any = {};
      for (const [k, v] of Object.entries(extractedData)) {
        const cleanKey = k.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
        payload[cleanKey] = v;
      }
      
      // Get the remarks text area value
      const remarksTextarea = document.getElementById("important-remarks") as HTMLTextAreaElement;
      if (remarksTextarea && remarksTextarea.value.trim()) {
        payload.important_remarks = remarksTextarea.value.trim();
      }

      // Append image URLs
      if (images.length > 0) {
        payload.receipt_urls = JSON.stringify(images.map(img => img.url));
        payload.image_notes = JSON.stringify(images.map(img => img.note));
      }

      const { data, error } = await supabase.from(tableName).insert([payload]);

      if (error) {
        console.error("Supabase Insert Error:", error);
        alert(`Failed to save to Supabase: ${error.message}\nMake sure you ran the SQL script in your Supabase dashboard and re-uploaded your Excel file in the Setup Wizard!`);
        return;
      }

      alert("Data permanently saved to the cloud successfully!");
      setTranscript("");
      setExtractedData(null);
      setImages([]);
      if (remarksTextarea) remarksTextarea.value = "";
    } catch (err: any) {
      console.error(err);
      alert("An unexpected error occurred while saving to the database.");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 py-6 animate-in fade-in duration-500">
      
      {/* Voice Recording Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center mb-6">
           <img src="/logo.png" alt="Voice2Sheet Logo" className="h-24 md:h-32 object-contain drop-shadow-2xl" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">New Entry</h1>

        {templates.length > 0 && (
          <div className="text-left bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
            <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Target Spreadsheet</label>
            <select 
              className="w-full p-3 border-0 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 font-medium"
              value={selectedTemplateIndex}
              onChange={(e) => setSelectedTemplateIndex(Number(e.target.value))}
            >
              {templates.map((tpl, i) => (
                <option key={i} value={i}>{tpl.name} ({tpl.headers.length} columns)</option>
              ))}
            </select>
          </div>
        )}
        
        <button 
          onClick={toggleRecording}
          className={`relative w-40 h-40 mx-auto rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isRecording ? 'bg-red-500 animate-pulse scale-105' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-20"></div>
          )}
          {isRecording ? <Square size={48} className="text-white" fill="white" /> : <Mic size={56} className="text-white" />}
        </button>
        
        <p className={`font-medium text-lg ${isRecording ? 'text-red-500' : 'text-gray-500'}`}>
          {isRecording ? "Listening... Tap to stop" : "Tap the mic and speak"}
        </p>

        {transcript && (
          <div className="bg-gray-50 p-1 rounded-xl border border-gray-200 text-left shadow-sm">
            <textarea 
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full min-h-[100px] p-3 bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded-lg text-gray-700 italic resize-none"
            />
          </div>
        )}

        {transcript && !isRecording && !extractedData && (
          <button 
            onClick={processTranscript}
            disabled={isProcessing}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : null}
            {isProcessing ? "Extracting Data..." : "Process Voice Data"}
          </button>
        )}
      </div>

      {/* Media Upload Section */}
      <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Camera size={20} className="text-blue-500" /> 
            Attach Bills / Receipts
          </h2>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition flex items-center gap-2 text-sm"
          >
            {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            Upload Photo
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        </div>

        {/* Display Uploaded Images with Notes */}
        {images.length > 0 && (
          <div className="space-y-4 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="flex gap-4 bg-gray-50 p-3 rounded-xl border">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img src={img.url} alt="Receipt" className="w-full h-full object-cover rounded-lg border shadow-sm" />
                  <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600">
                    <X size={14} />
                  </button>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Image Note</label>
                  <textarea 
                    value={img.note} 
                    onChange={(e) => updateImageNote(idx, e.target.value)}
                    placeholder="e.g., Toll receipt for highway 9..."
                    className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-16 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Phase 4: Confirmation UI Preview */}
      {extractedData && (
        <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl shadow-sm space-y-4 animate-in slide-in-from-bottom-4">
          <h2 className="font-extrabold text-green-800 text-xl flex items-center gap-2">
            <CheckCircle2 /> Please Confirm Data
          </h2>
          
          <div className="space-y-3 bg-white p-4 rounded-xl border border-green-100">
            {Object.entries(extractedData).map(([key, val]) => (
              <div key={key} className="flex flex-col border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                <span className="text-xs font-bold text-gray-500 uppercase">{key}</span>
                <input 
                  type="text" 
                  value={val as string} 
                  onChange={(e) => setExtractedData({...extractedData, [key]: e.target.value})}
                  className="font-medium text-gray-900 bg-transparent border-0 p-0 focus:ring-0 w-full"
                />
              </div>
            ))}
          </div>

          <div className="pt-2">
             <label className="block text-sm font-extrabold text-red-600 mb-1 uppercase tracking-wide">Important Remarks</label>
             <textarea 
                id="important-remarks"
                placeholder="Any special remarks or reminders for this entry?"
                className="w-full p-3 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none min-h-[80px]"
             />
          </div>

          <button onClick={saveToDatabase} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-lg mt-4">
            <Save /> Confirm & Save Entry
          </button>
        </div>
      )}

    </div>
  );
}
