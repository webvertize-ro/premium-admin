import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Requests from "./pages/Requests";
import AppLayout from "./components/AppLayout";
import ChatAdmin from "./pages/ChatAdmin";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminBlog from "./pages/AdminBlog";
import Admin from "./pages/Admin";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" />
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/requests" element={<Requests />} />
              <Route path="/blog" element={<AdminBlog />} />
              <Route path="/chat" element={<ChatAdmin />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
