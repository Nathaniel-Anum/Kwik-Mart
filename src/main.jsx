import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./Pages/AuthContext.jsx";
import { ConfigProvider } from "antd";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#111111",
                colorPrimaryHover: "#333333",
                borderRadius: 8,
                fontFamily: "'Poppins', sans-serif",
                colorBgContainer: "#ffffff",
              },
              components: {
                Button: { primaryShadow: "none" },
                Modal: { borderRadiusLG: 16 },
                Table: { headerBg: "#111111", headerColor: "#ffffff", borderRadius: 12 },
              },
            }}
          >
            <App />
          </ConfigProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
    <Toaster position="top-right" />
  </StrictMode>
);
