
import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const extractReceiptData = async (base64Image: string): Promise<Partial<ReceiptData>> => {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1] || base64Image,
          },
        },
        {
          text: "Extract all information from this service receipt. Convert dates to YYYY-MM-DD format if possible. Map 'Beyond' or 'Returned' checkboxes to the respective fields.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          inwardNo: { type: Type.STRING },
          partyName: { type: Type.STRING },
          materialName: { type: Type.STRING },
          customerFault: { type: Type.STRING },
          materialStatus: { type: Type.STRING, description: "One of: Serviced, Beyond, Returned" },
          reasonFor: { type: Type.STRING, description: "One of: Beyond, Returned" },
          plcHmiVersion: { type: Type.STRING },
          plcHmiBackupStatus: { type: Type.STRING, description: "One of: Yes, No" },
          engName: { type: Type.STRING },
          inwardDate: { type: Type.STRING },
          servicedDate: { type: Type.STRING },
          noOfDays: { type: Type.STRING },
          serviceCost: { type: Type.STRING },
        },
      },
    },
  });

  try {
    const text = response.text;
    return JSON.parse(text) as Partial<ReceiptData>;
  } catch (error) {
    console.error("Failed to parse AI response", error);
    return {};
  }
};
