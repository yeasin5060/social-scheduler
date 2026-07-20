import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Accounts from "./pages/dashboard/Accounts";
import AIComposer from "./pages/dashboard/AIComposer";
import Scheduler from "./pages/dashboard/Scheduler";
import { Toaster } from "react-hot-toast";

export default function App() {
    return (
        <>
            <Toaster position="top-right"/>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route element = {<Layout/>}>
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/accounts" element={<Accounts/>} />
                    <Route path="/schedule" element={<Scheduler/>} />
                    <Route path="/ai-composer" element={<AIComposer/>} />
                </Route>
            </Routes>
        </>
    );
}