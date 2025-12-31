import api from "./axios";

export interface LeadData {
  full_name: string;
  email: string;
  phone: string;
}

export const submitLead = async (data: LeadData) => {
  try {
    const response = await api.post("/leads", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Função legada mantida para compatibilidade
export const sendLead = submitLead;
