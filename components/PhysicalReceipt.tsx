
import React from 'react';
import { ReceiptData } from '../types';

interface PhysicalReceiptProps {
  data: ReceiptData;
}

const PhysicalReceipt: React.FC<PhysicalReceiptProps> = ({ data }) => {
  const redBorder = "border-[#d84343]";
  const redText = "text-[#d84343]";

  return (
    <div className={`max-w-[800px] mx-auto bg-white border-2 ${redBorder} p-8 font-serif relative min-h-[500px] shadow-lg`} id="printable-receipt">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
           <div className={`w-12 h-12 rounded-full border-2 ${redBorder} flex items-center justify-center`}>
              <span className={`text-xl font-bold ${redText}`}>S</span>
           </div>
           <div>
             <h1 className={`text-2xl font-bold tracking-tighter ${redText}`}>SCANNER ELECTRO LAB</h1>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-y-4">
        {/* Row 1 */}
        <div className="col-span-8 flex items-end gap-2">
          <label className={`whitespace-nowrap ${redText} font-semibold`}>Inward No.</label>
          <div className={`flex-1 border-b-2 ${redBorder} min-h-[24px] px-2`}>{data.inwardNo}</div>
        </div>
        <div className="col-span-4 flex items-end gap-2 ml-4">
          <label className={`whitespace-nowrap ${redText} font-semibold`}>Inward Date :</label>
          <div className={`flex-1 border-b-2 ${redBorder} min-h-[24px] px-2`}>{data.inwardDate}</div>
        </div>

        {/* Row 2 */}
        <div className="col-span-8 flex items-end gap-2">
          <label className={`whitespace-nowrap ${redText} font-semibold`}>Party Name :</label>
          <div className={`flex-1 border-b-2 ${redBorder} min-h-[24px] px-2 uppercase`}>{data.partyName}</div>
        </div>
        <div className="col-span-4 flex items-end gap-2 ml-4">
          <label className={`whitespace-nowrap ${redText} font-semibold`}>Serviced Date :</label>
          <div className={`flex-1 border-b-2 ${redBorder} min-h-[24px] px-2`}>{data.servicedDate}</div>
        </div>

        {/* Row 3 */}
        <div className="col-span-8 flex items-end gap-2">
          <label className={`whitespace-nowrap ${redText} font-semibold`}>Material Name :</label>
          <div className={`flex-1 border-b-2 ${redBorder} min-h-[24px] px-2`}>{data.materialName}</div>
        </div>
        <div className="col-span-4 flex items-end gap-2 ml-4">
          <label className={`whitespace-nowrap ${redText} font-semibold`}>No. of Days :</label>
          <div className={`flex-1 border-b-2 ${redBorder} min-h-[24px] px-2`}>{data.noOfDays}</div>
        </div>

        {/* Row 4 */}
        <div className="col-span-8 flex items-end gap-2">
          <label className={`whitespace-nowrap ${redText} font-semibold`}>Customer Fault :</label>
          <div className={`flex-1 border-b-2 ${redBorder} min-h-[24px] px-2`}>{data.customerFault}</div>
        </div>
        <div className="col-span-4 flex items-end gap-2 ml-4">
          <label className={`whitespace-nowrap ${redText} font-semibold`}>Service Cost :</label>
          <div className={`flex-1 border-b-2 ${redBorder} min-h-[24px] px-2`}>{data.serviceCost}</div>
        </div>

        {/* Status Checkboxes */}
        <div className="col-span-12 flex items-center gap-6 mt-4">
          <label className={`${redText} font-semibold`}>Material Status :</label>
          {['Serviced', 'Beyond', 'Returned'].map(status => (
            <div key={status} className="flex items-center gap-2">
              <div className={`w-5 h-5 border-2 ${redBorder} flex items-center justify-center`}>
                {data.materialStatus === status && <span className={redText}>✓</span>}
              </div>
              <span className={redText}>{status}</span>
            </div>
          ))}
        </div>

        {/* Reason For */}
        <div className="col-span-12 flex items-center gap-6">
          <label className={`${redText} font-semibold`}>Reason for :</label>
          {['Beyond', 'Returned'].map(reason => (
            <div key={reason} className="flex items-center gap-2">
              <div className={`w-5 h-5 border-2 ${redBorder} flex items-center justify-center`}>
                {data.reasonFor === reason && <span className={redText}>✓</span>}
              </div>
              <span className={redText}>{reason}</span>
            </div>
          ))}
        </div>

        {/* PLC Section */}
        <div className="col-span-12 flex items-end gap-2 mt-2">
          <label className={`whitespace-nowrap ${redText} font-semibold`}>PLC / HMI Version :</label>
          <div className={`flex-1 border-b-2 ${redBorder} min-h-[24px] px-2`}>{data.plcHmiVersion}</div>
        </div>

        <div className="col-span-12 flex items-center gap-4 mt-2">
          <label className={`${redText} font-semibold`}>PLC / HMI Backup Status : Yes / No</label>
          <div className={`w-24 border-b-2 ${redBorder} min-h-[24px] px-2 text-center`}>{data.plcHmiBackupStatus}</div>
        </div>

        {/* Footer */}
        <div className="col-span-12 grid grid-cols-2 gap-8 mt-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-2">
              <label className={`${redText} font-semibold`}>Eng Name :</label>
              <div className={`flex-1 border-b-2 ${redBorder} min-h-[24px] px-2`}>{data.engName}</div>
            </div>
          </div>
          <div className="flex flex-col justify-end items-center">
            <div className={`w-full border-b-2 ${redBorder} h-12`}></div>
            <label className={`${redText} font-semibold mt-1`}>Signature</label>
          </div>
        </div>
      </div>
      
      {/* Decorative vertical line if needed */}
      <div className={`absolute top-0 bottom-0 left-[66%] w-px border-l ${redBorder} border-opacity-30 pointer-events-none`}></div>
    </div>
  );
};

export default PhysicalReceipt;
