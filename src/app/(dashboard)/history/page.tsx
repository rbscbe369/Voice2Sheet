"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { Search, Loader2, RefreshCw, FileText, Calendar, Image as ImageIcon, Download } from "lucide-react";
import * as XLSX from "xlsx";

export default function HistoryPage() {
  const [templates, setTemplates] = useState<{name: string, headers: string[]}[]>([]);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Load templates on mount
    const stored = localStorage.getItem("templates");
    if (stored) {
      const parsed = JSON.parse(stored);
      setTemplates(parsed);
      if (parsed.length > 0) {
        fetchData(parsed[0].name);
      }
    }
  }, []);

  const fetchData = async (templateName: string) => {
    setIsLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const tableName = templateName.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_").toLowerCase();
      
      const { data: tableData, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setData(tableData || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value);
    setSelectedTemplateIndex(idx);
    fetchData(templates[idx].name);
  };

  // Filter data based on search query and dates
  const filteredData = data.filter(row => {
    // 1. Date Range Filter
    if (startDate && new Date(row.created_at) < new Date(startDate)) return false;
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // Include the whole end day
      if (new Date(row.created_at) >= end) return false;
    }

    // 2. Search Query Filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(row).some(val => 
      val && String(val).toLowerCase().includes(query)
    );
  });

  const activeHeaders = templates[selectedTemplateIndex]?.headers || [];

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      alert("No data to export!");
      return;
    }

    const exportData = filteredData.map((row, idx) => {
      const formattedRow: any = {
        "No.": idx + 1,
        "Date Added": new Date(row.created_at).toLocaleString(),
      };
      
      activeHeaders.forEach(header => {
         const colKey = header.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
         formattedRow[header] = row[colKey] || '';
      });
      
      formattedRow["Remarks"] = row.important_remarks || '';
      if (row.receipt_urls) {
        formattedRow["Receipt URLs"] = JSON.parse(row.receipt_urls).join(", ");
      }
      
      return formattedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CRM Data");
    
    const fileName = templates[selectedTemplateIndex].name.replace('.xlsx', '') + '_Export.xlsx';
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <FileText className="text-blue-600" /> CRM History
            </h1>
            <p className="text-gray-500">View and search your saved voice entries.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={exportToExcel}
              disabled={isLoading || filteredData.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-sm transition disabled:opacity-50"
            >
              <Download size={18} />
              Export to Excel
            </button>
            <button 
              onClick={() => templates.length > 0 && fetchData(templates[selectedTemplateIndex].name)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-semibold transition w-fit"
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {templates.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-4 pt-4 border-t">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Select Spreadsheet</label>
              <select 
                className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 font-medium"
                value={selectedTemplateIndex}
                onChange={handleTemplateChange}
              >
                {templates.map((tpl, i) => (
                  <option key={i} value={i}>{tpl.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-[1.5] flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">End Date</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>
            </div>
            
            <div className="flex-[1.5]">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Search Entries</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search any keyword..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
            No spreadsheets configured yet. Please complete the Setup Wizard.
          </div>
        )}
      </div>

      {/* Data Table */}
      {templates.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-16">No.</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-40">Date Added</th>
                  {activeHeaders.map((header, idx) => (
                     <th key={idx} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                       {header}
                     </th>
                  ))}
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Remarks</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Receipts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={activeHeaders.length + 4} className="p-8 text-center text-gray-500">
                      <Loader2 className="animate-spin mx-auto mb-2 text-blue-500" size={32} />
                      Loading your entries...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={activeHeaders.length + 4} className="p-8 text-center text-gray-500">
                      No entries found for this spreadsheet.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-blue-50/50 transition">
                      <td className="p-4 text-gray-400 font-mono text-sm">{idx + 1}</td>
                      <td className="p-4 text-gray-600 text-sm whitespace-nowrap flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(row.created_at).toLocaleDateString()}
                      </td>
                      
                      {activeHeaders.map((header, hIdx) => {
                         // Find the dynamic key we generated (lowercase, underscores)
                         const colKey = header.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
                         return (
                           <td key={hIdx} className="p-4 text-gray-900 font-medium">
                             {row[colKey] || '-'}
                           </td>
                         )
                      })}

                      <td className="p-4">
                        {row.important_remarks ? (
                          <div className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-pre-wrap min-w-[150px]">
                            {row.important_remarks}
                          </div>
                        ) : <span className="text-gray-300">-</span>}
                      </td>

                      <td className="p-4">
                        {row.receipt_urls ? (
                          <div className="flex gap-2">
                            {JSON.parse(row.receipt_urls).map((url: string, i: number) => (
                              <a key={i} href={url} target="_blank" rel="noreferrer" className="block w-10 h-10 rounded shadow-sm border border-gray-200 overflow-hidden hover:scale-110 transition-transform bg-gray-100 flex items-center justify-center">
                                <ImageIcon size={16} className="text-gray-400" />
                              </a>
                            ))}
                          </div>
                        ) : <span className="text-gray-300">-</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
