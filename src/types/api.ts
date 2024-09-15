export interface HumidityResponse {
  humidity: number;
}

export type RelayStatus = "ON" | "OFF";

export interface RelayStatusResponse {
  status: RelayStatus;
}


export interface SoilMoistureResponse {
  soilMoisture: number;
}