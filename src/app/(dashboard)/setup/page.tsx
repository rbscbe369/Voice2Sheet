"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Database, Image as ImageIcon, UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export default function SetupWizard() {
  const [step, setStep] = useState(1);
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [cloudinaryName, setCloudinaryName] = useState("");
  const [cloudinaryPreset, setCloudinaryPreset] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);

  // Load existing settings on mount so the user doesn't have to retype them
  useEffect(() => {
    const savedUrl = localStorage.getItem("supabaseUrl");
    if (savedUrl) setSupabaseUrl(savedUrl);
    
    const savedKey = localStorage.getItem("supabaseKey");
    if (savedKey) setSupabaseKey(savedKey);
    
    const savedCloudName = localStorage.getItem("cloudinaryName");
    if (savedCloudName) setCloudinaryName(savedCloudName);
    
    const savedCloudPreset = localStorage.getItem("cloudinaryPreset");
    if (savedCloudPreset) setCloudinaryPreset(savedCloudPreset);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (templates.length >= 3) {
      alert("Template limit reached. You can only upload a maximum of 3 templates. Please contact support to upgrade your account.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
        const headers = data[0] as string[];
        if (headers && headers.length > 0) {
          setTemplates(prev => [...prev, { name: file.name, headers }]);
        } else {
          alert("We couldn't find any column headers in the first row of this Excel file. Please ensure row 1 contains your column names.");
        }
      } catch (err) {
        console.error("Error reading file:", err);
        alert("There was an error reading the Excel file. Make sure it is a valid .xlsx or .csv file.");
      }
      
      // Reset input value so the same file can be selected again if needed
      e.target.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const [isSaving, setIsSaving] = useState(false);

  const saveSettings = async () => {
    setIsSaving(true);
    // BYOB Model: We store these settings in local browser storage so the app can communicate directly with their endpoints
    localStorage.setItem("supabaseUrl", supabaseUrl);
    localStorage.setItem("supabaseKey", supabaseKey);
    localStorage.setItem("cloudinaryName", cloudinaryName);
    localStorage.setItem("cloudinaryPreset", cloudinaryPreset);
    localStorage.setItem("templates", JSON.stringify(templates));

    try {
      // Ensure URL is fully qualified to prevent parsing errors
      let validUrl = supabaseUrl.trim();
      if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
        validUrl = 'https://' + validUrl;
      }
      // Remove any trailing paths like /rest/v1/ that the user might have accidentally copied
      validUrl = validUrl.replace(/\/rest\/v1\/?$/, '');
      if (validUrl.endsWith('/')) validUrl = validUrl.slice(0, -1);

      // Connect to the user's Supabase instance
      const supabase = createClient(validUrl, supabaseKey.trim());
      
      // Automatically generate tables for each uploaded template using the RPC we created
      for (const tpl of templates) {
         const tableName = tpl.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_").toLowerCase();
         const { error } = await supabase.rpc("create_dynamic_table", {
           p_table_name: tableName,
           columns_json: tpl.headers
         });
         
         if (error) {
           console.error("Error creating table for", tpl.name, error);
           alert(`Failed to create database table for ${tpl.name}: ${error.message}`);
         }
      }

      alert("Setup Complete! Your database tables have been successfully generated based on your Excel headers.");
      // In a real flow, we'd redirect to /dashboard here
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Error connecting to Supabase. Check your URL and Key.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 py-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Setup Wizard</h1>
        <p className="text-gray-500 mt-2 text-lg">Connect your database and configure your templates to get started.</p>
      </div>

      {/* Step 1: Supabase */}
      <div className={`p-6 border rounded-2xl shadow-sm transition-all duration-300 ${step >= 1 ? 'bg-white border-blue-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Database size={24} /></div>
          <h2 className="text-xl font-bold text-gray-800">1. Connect Database (Supabase)</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
            <input type="text" value={supabaseUrl} onChange={e => setSupabaseUrl(e.target.value)} placeholder="https://xyzcompany.supabase.co" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anon Public Key</label>
            <input type="password" value={supabaseKey} onChange={e => setSupabaseKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          {step === 1 && (
            <button onClick={() => setStep(2)} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition">Next Step</button>
          )}
        </div>
      </div>

      {/* Step 2: Cloudinary */}
      <div className={`p-6 border rounded-2xl shadow-sm transition-all duration-300 ${step >= 2 ? 'bg-white border-blue-200' : 'bg-gray-50 border-gray-200 opacity-50 pointer-events-none'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded-lg text-green-600"><ImageIcon size={24} /></div>
          <h2 className="text-xl font-bold text-gray-800">2. Media Storage (Cloudinary)</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cloud Name</label>
            <input type="text" value={cloudinaryName} onChange={e => setCloudinaryName(e.target.value)} placeholder="dkxy1..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Preset (Unsigned)</label>
            <input type="text" value={cloudinaryPreset} onChange={e => setCloudinaryPreset(e.target.value)} placeholder="ml_default" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
          </div>
          {step === 2 && (
             <div className="flex gap-4">
               <button onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition">Back</button>
               <button onClick={() => setStep(3)} className="w-2/3 bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition">Next Step</button>
             </div>
          )}
        </div>
      </div>

      {/* Step 3: Templates */}
      <div className={`p-6 border rounded-2xl shadow-sm transition-all duration-300 ${step >= 3 ? 'bg-white border-purple-200' : 'bg-gray-50 border-gray-200 opacity-50 pointer-events-none'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><UploadCloud size={24} /></div>
          <h2 className="text-xl font-bold text-gray-800">3. Upload Templates (Max 3)</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Upload your Excel files. We will automatically detect your columns and generate database tables for them.</p>
          
          <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 hover:border-purple-400 transition group bg-white">
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
            <UploadCloud size={48} className="mx-auto text-gray-400 group-hover:text-purple-500 mb-4 transition-colors" />
            <span className="text-gray-600 font-medium group-hover:text-purple-700">Click to upload an Excel file</span>
          </label>

          {templates.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Uploaded Templates ({templates.length}/3)</h3>
              {templates.map((t, idx) => (
                <div key={idx} className="flex flex-col bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2 font-bold text-purple-900">
                    <CheckCircle2 size={18} className="text-green-500" />
                    {t.name}
                  </div>
                  <div className="text-sm text-purple-700 mt-2 pl-6">
                    <span className="font-semibold">Detected Columns:</span> {t.headers.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
             <div className="flex gap-4 pt-4 border-t mt-6">
               <button onClick={() => setStep(2)} className="w-1/3 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition">Back</button>
               <button onClick={saveSettings} disabled={templates.length === 0 || isSaving} className={`w-2/3 text-white font-semibold py-3 flex justify-center items-center gap-2 rounded-lg shadow transition ${templates.length > 0 && !isSaving ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}>
                 {isSaving ? <Loader2 className="animate-spin" size={20} /> : null}
                 {isSaving ? "Configuring Database..." : "Finish & Save"}
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
