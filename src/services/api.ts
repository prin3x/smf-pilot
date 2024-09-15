import axios from "axios";
import {
  HumidityResponse,
  RelayStatusResponse,
  SoilMoistureResponse,
} from "../types/api";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTemperature = async (): Promise<{ temperature: number }> => {
  const response = await api.get<{ temperature: number }>("/temperature");
  return response.data;
};

export const getSoilMoisture = async (): Promise<SoilMoistureResponse> => {
  const response = await api.get<SoilMoistureResponse>("/soil-moisture");
  return response.data;
};

export const getHumidity = async (): Promise<HumidityResponse> => {
  const response = await api.get<HumidityResponse>("/humidity");
  return response.data;
};

export const getRelayStatus = async (): Promise<RelayStatusResponse> => {
  const response = await api.get<RelayStatusResponse>("/relay-status");
  return response.data;
};

export const turnRelayOn = async (): Promise<void> => {
  await api.post("/relay/on");
};

export const turnRelayOff = async (): Promise<void> => {
  await api.post("/relay/off");
};
