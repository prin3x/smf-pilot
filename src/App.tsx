import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  createTheme,
  FormControlLabel,
  Switch,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import {
  getHumidity,
  getRelayStatus,
  turnRelayOn,
  turnRelayOff,
  getSoilMoisture,
  getTemperature,
} from "./services/api";
import { RelayStatus } from "./types/api";
import LineChart from "./components/LineChart";
import { ThemeProvider } from "@mui/material/styles";
import BarChart from "./components/BarChart";

const App: React.FC = () => {
  const [humidity, setHumidity] = useState<number | null>(null);
  const [humidityHistory, setHumidityHistory] = useState<number[]>([]);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [temperatureHistory, setTemperatureHistory] = useState<number[]>([]);
  const [soilMoisture, setSoilMoisture] = useState<number | null>(null);
  const [soilMoistureHistory, setSoilMoistureHistory] = useState<number[]>([]);
  const [relayStatus, setRelayStatus] = useState<RelayStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [darkMode, setDarkMode] = useState(false);

  const fetchData = async (retryCount = 3) => {
    try {
      const [humidityData, relayData, soilMoistureData, temperatureData] = await Promise.all([
        getHumidity(),
        getRelayStatus(),
        getSoilMoisture(),
        getTemperature(),
      ]);
      setHumidity(humidityData.humidity);
      setHumidityHistory((prev) => {
        const newHistory = [...prev, humidityData.humidity];
        return newHistory.slice(-60); // Keep only the last 60 entries
      });
      setRelayStatus(relayData.status);
      setTemperature(temperatureData.temperature);
      setTemperatureHistory((prev) => {
        const newHistory = [...prev, temperatureData.temperature];
        return newHistory.slice(-60); // Keep only the last 60 entries
      });
      setSoilMoisture(soilMoistureData.soilMoisture);
      setSoilMoistureHistory((prev) => {
        const newHistory = [...prev, soilMoistureData.soilMoisture];
        return newHistory.slice(-60); // Keep only the last 60 entries
      });
      setLoading(false);
    } catch (err) {
      if (retryCount > 0) {
        setTimeout(() => fetchData(retryCount - 1), 2000); // Retry after 2 seconds
      } else {
        setError("Failed to fetch data from the server.");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleRelay = async (action: "on" | "off") => {
    try {
      if (action === "on") {
        await turnRelayOn();
      } else {
        await turnRelayOff();
      }
      setRelayStatus(action === "on" ? "ON" : "OFF");
      setSnackbar({
        open: true,
        message: `Relay turned ${action.toUpperCase()}`,
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update relay status.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container
          maxWidth="sm"
          style={{ textAlign: "center", marginTop: "50px" }}
        >
          <CircularProgress />
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Loading data...
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Container
          maxWidth="sm"
          style={{ textAlign: "center", marginTop: "50px" }}
        >
          <Alert severity="error">{error}</Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: darkMode ? "#121212" : "#ffffff",
          },
        }}
      />
      <Container maxWidth="lg" style={{ marginTop: "50px" }}>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              name="darkModeSwitch"
              color="primary"
            />
          }
          label="Dark Mode"
          style={{ marginBottom: "20px" }}
        />
        <Card style={{ marginBottom: "20px" }}>
          <CardContent>
            <Typography variant="h6">Relay Status: {relayStatus}</Typography>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleRelay("on")}
                disabled={relayStatus === "ON"}
                style={{ marginRight: "10px" }}
              >
                Turn Relay ON
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRelay("off")}
                disabled={relayStatus === "OFF"}
              >
                Turn Relay OFF
              </Button>
            </div>
          </CardContent>
        </Card>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Card style={{ flex: 1, margin: "0 10px" }}>
            <CardContent>
              <Typography variant="h6">Current Humidity: {humidity}%</Typography>
              <LineChart
                title="Humidity Over Time"
                data={humidityHistory}
                label="Humidity"
                backgroundColor="rgba(75,192,192,0.4)"
                borderColor="rgba(75,192,192,1)"
              />
            </CardContent>
          </Card>
          <Card style={{ flex: 1, margin: "0 10px" }}>
            <CardContent>
              <Typography variant="h6">Soil Moisture: {soilMoisture}%</Typography>
              <LineChart
                title="Soil Moisture Over Time"
                data={soilMoistureHistory}
                label="Soil Moisture"
                backgroundColor="rgba(255,99,132,0.4)"
                borderColor="rgba(255,99,132,1)"
              />
            </CardContent>
          </Card>
          <Card style={{ flex: 1, margin: "0 10px" }}>
            <CardContent>
              <Typography variant="h6">Temperature</Typography>
              <BarChart
                title="Temperature Over Time"
                data={temperatureHistory}
                label="Temperature"
                backgroundColor="rgba(54,162,235,0.4)"
                borderColor="rgba(54,162,235,1)"
              />
            </CardContent>
          </Card>
        </div>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default App;