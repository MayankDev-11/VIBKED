import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import AppShell from "./components/layout/AppShell"

import Chat from "./pages/Chat"
import Documents from "./pages/Documents"

function Memory() {
  return <div className="p-8">Memory</div>
}

function Settings() {
  return <div className="p-8">Settings</div>
}

function App() {
  return (
    <BrowserRouter>

      <AppShell>

        <Routes>

          {/* Default route */}
          <Route
            path="/"
            element={
              <Navigate
                to="/chat"
                replace
              />
            }
          />


          {/* Chat */}
          <Route
            path="/chat"
            element={<Chat />}
          />


          {/* Documents */}
          <Route
            path="/documents"
            element={<Documents />}
          />


          {/* Memory */}
          <Route
            path="/memory"
            element={<Memory />}
          />


          {/* Settings */}
          <Route
            path="/settings"
            element={<Settings />}
          />

        </Routes>

      </AppShell>

    </BrowserRouter>
  )
}

export default App
