
import React, { useState, useEffect, useRef } from 'react';
import { ReceiptData, ReceiptViewMode } from './types';
import PhysicalReceipt from './components/PhysicalReceipt';
import { extractReceiptData } from './services/geminiService';
import { 
  FileText, 
  Upload, 
  Plus, 
  Printer, 
  Trash2, 
  ChevronLeft, 
  Loader2,
  Camera,
  History
} from 'lucide-react';

const INITIAL_DATA: ReceiptData = {
  id: '',
  inwardNo: '',
  partyName: '',
  materialName: '',
  serialNo: '',
  customerFault: '',
  materialStatus: '',
  reasonFor: '',
  plcHmiVersion: '',
  plcHmiBackupStatus: '',
  engName: '',
  inwardDate: '',
  servicedDate: '',
  noOfDays: '',
  serviceCost: '',
  createdAt: 0,
};

const App: React.FC = () => {
  const [view, setView] = useState<ReceiptViewMode>('list');
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptData>(INITIAL_DATA);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('scanner_receipts');
    if (saved) {
      setReceipts(JSON.parse(saved));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('scanner_receipts', JSON.stringify(receipts));
  }, [receipts]);

  const handleCreateNew = () => {
    setCurrentReceipt({ ...INITIAL_DATA, id: Date.now().toString(), createdAt: Date.now() });
    setView('edit');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      try {
        const extracted = await extractReceiptData(base64);
        setCurrentReceipt(prev => ({
          ...prev,
          ...extracted,
          id: Date.now().toString(),
          createdAt: Date.now()
        }));
        setView('edit');
      } catch (err) {
        alert("Failed to extract data. Please fill manually.");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!currentReceipt.id) return;
    
    setReceipts(prev => {
      const exists = prev.find(r => r.id === currentReceipt.id);
      if (exists) {
        return prev.map(r => r.id === currentReceipt.id ? currentReceipt : r);
      }
      return [currentReceipt, ...prev];
    });
    setView('list');
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this receipt?")) {
      setReceipts(prev => prev.filter(r => r.id !== id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const inputClasses = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('list')}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Scanner Electro Lab</h1>
          </div>
          
          <div className="flex gap-2">
            {view === 'list' && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  AI Extract
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  New Receipt
                </button>
              </>
            )}
            
            {(view === 'edit' || view === 'preview') && (
              <button
                onClick={() => setView('list')}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to List
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {isProcessing && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[60] flex flex-col items-center justify-center no-print">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-slate-800">Analyzing Receipt Image...</h2>
            <p className="text-slate-500">Gemini is extracting details for you.</p>
          </div>
        )}

        {view === 'list' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="text-slate-400 w-5 h-5" />
                <h2 className="text-lg font-semibold text-slate-800">Recent Receipts</h2>
              </div>
              <span className="text-sm text-slate-500">{receipts.length} entries</span>
            </div>

            {receipts.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-20 flex flex-col items-center justify-center text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <FileText className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No receipts found</h3>
                <p className="text-slate-500 mb-6 max-w-xs">Start by creating a manual receipt or uploading an image for AI extraction.</p>
                <button
                  onClick={handleCreateNew}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                >
                  Create Your First Receipt
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {receipts.map(receipt => (
                  <div key={receipt.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        #{receipt.inwardNo || 'N/A'}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setCurrentReceipt(receipt); setView('edit'); }}
                          className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(receipt.id)}
                          className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1 truncate">{receipt.partyName || 'Untitled Party'}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-1">{receipt.materialName}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                      <span className="text-xs text-slate-400">{new Date(receipt.createdAt).toLocaleDateString()}</span>
                      <button 
                        onClick={() => { setCurrentReceipt(receipt); setView('preview'); }}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'edit' && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Receipt Details</h2>
              <div className="flex gap-3">
                <button 
                   onClick={() => setView('preview')}
                   className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-medium flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Preview
                </button>
                <button 
                   onClick={handleSave}
                   className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Save Entry
                </button>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <label className={labelClasses}>Inward Number</label>
                <input 
                  type="text" 
                  value={currentReceipt.inwardNo} 
                  onChange={e => setCurrentReceipt({...currentReceipt, inwardNo: e.target.value})}
                  className={inputClasses}
                  placeholder="e.g. 1001"
                />
              </div>
              <div className="md:col-span-1">
                <label className={labelClasses}>Inward Date</label>
                <input 
                  type="text" 
                  value={currentReceipt.inwardDate} 
                  onChange={e => setCurrentReceipt({...currentReceipt, inwardDate: e.target.value})}
                  className={inputClasses}
                  placeholder="DD/MM/YY"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClasses}>Party Name</label>
                <input 
                  type="text" 
                  value={currentReceipt.partyName} 
                  onChange={e => setCurrentReceipt({...currentReceipt, partyName: e.target.value})}
                  className={inputClasses}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClasses}>Material Name / Model</label>
                <input 
                  type="text" 
                  value={currentReceipt.materialName} 
                  onChange={e => setCurrentReceipt({...currentReceipt, materialName: e.target.value})}
                  className={inputClasses}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClasses}>Serial Number</label>
                <input 
                  type="text" 
                  value={currentReceipt.serialNo} 
                  onChange={e => setCurrentReceipt({...currentReceipt, serialNo: e.target.value})}
                  className={inputClasses}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClasses}>Customer Reported Fault</label>
                <textarea 
                  value={currentReceipt.customerFault} 
                  onChange={e => setCurrentReceipt({...currentReceipt, customerFault: e.target.value})}
                  className={`${inputClasses} h-20 resize-none`}
                />
              </div>

              <div className="md:col-span-1">
                <label className={labelClasses}>Material Status</label>
                <select 
                  value={currentReceipt.materialStatus} 
                  onChange={e => setCurrentReceipt({...currentReceipt, materialStatus: e.target.value as any})}
                  className={inputClasses}
                >
                  <option value="">Select Status</option>
                  <option value="Serviced">Serviced</option>
                  <option value="Beyond">Beyond</option>
                  <option value="Returned">Returned</option>
                  <option value="Waiting for Spare">Waiting for Spare</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label className={labelClasses}>Reason (if Beyond/Returned)</label>
                <select 
                  value={currentReceipt.reasonFor} 
                  onChange={e => setCurrentReceipt({...currentReceipt, reasonFor: e.target.value as any})}
                  className={inputClasses}
                >
                  <option value="">Select Reason</option>
                  <option value="Beyond">Beyond</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label className={labelClasses}>PLC / HMI Version</label>
                <input 
                  type="text" 
                  value={currentReceipt.plcHmiVersion} 
                  onChange={e => setCurrentReceipt({...currentReceipt, plcHmiVersion: e.target.value})}
                  className={inputClasses}
                />
              </div>

              <div className="md:col-span-1">
                <label className={labelClasses}>Backup Status</label>
                <select 
                  value={currentReceipt.plcHmiBackupStatus} 
                  onChange={e => setCurrentReceipt({...currentReceipt, plcHmiBackupStatus: e.target.value as any})}
                  className={inputClasses}
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label className={labelClasses}>Engineer Name</label>
                <input 
                  type="text" 
                  value={currentReceipt.engName} 
                  onChange={e => setCurrentReceipt({...currentReceipt, engName: e.target.value})}
                  className={inputClasses}
                />
              </div>

              <div className="md:col-span-1">
                <label className={labelClasses}>Service Cost</label>
                <input 
                  type="text" 
                  value={currentReceipt.serviceCost} 
                  onChange={e => setCurrentReceipt({...currentReceipt, serviceCost: e.target.value})}
                  className={inputClasses}
                  placeholder="e.g. 1000/-"
                />
              </div>

              <div className="md:col-span-1">
                <label className={labelClasses}>Serviced Date</label>
                <input 
                  type="text" 
                  value={currentReceipt.servicedDate} 
                  onChange={e => setCurrentReceipt({...currentReceipt, servicedDate: e.target.value})}
                  className={inputClasses}
                />
              </div>

              <div className="md:col-span-1">
                <label className={labelClasses}>Number of Days</label>
                <input 
                  type="text" 
                  value={currentReceipt.noOfDays} 
                  onChange={e => setCurrentReceipt({...currentReceipt, noOfDays: e.target.value})}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        )}

        {view === 'preview' && (
          <div className="flex flex-col gap-8 pb-20">
            <div className="flex justify-center gap-4 no-print">
               <button 
                  onClick={() => setView('edit')}
                  className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
               >
                 Edit Data
               </button>
               <button 
                  onClick={handlePrint}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-black font-medium flex items-center gap-2 shadow-lg"
               >
                 <Printer className="w-4 h-4" /> Print Receipt
               </button>
            </div>
            
            <div className="bg-slate-200 p-8 rounded-2xl print:p-0 print:bg-transparent">
              <PhysicalReceipt data={currentReceipt} />
            </div>

            <div className="text-center text-slate-400 text-sm no-print">
              <p>The above layout mimics the physical pink/red carbon-copy receipts used by the lab.</p>
            </div>
          </div>
        )}
      </main>

      {/* Mobile-only Persistent CTA */}
      {view === 'list' && (
        <div className="md:hidden fixed bottom-6 right-6 no-print">
          <button
            onClick={handleCreateNew}
            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-blue-700 transition-all active:scale-90"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
