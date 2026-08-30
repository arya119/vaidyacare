"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  UserPlus, 
  Search, 
  RefreshCw, 
  ArrowRight, 
  Activity, 
  MapPin, 
  Calendar,
  AlertCircle,
  Stethoscope
} from "lucide-react";
import { api } from "@/lib/api-client";
import type { PatientListItem } from "@vaidyacare/schema";

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPatients = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = query.trim() 
        ? `/patients?q=${encodeURIComponent(query.trim())}` 
        : "/patients";
      const data = await api.get<PatientListItem[]>(endpoint);
      setPatients(data);
    } catch (err: any) {
      console.error("Failed to load patients", err);
      setError(err.message || "Failed to load patient records from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients(searchQuery);
  };

  const calculateAge = (dobString: string) => {
    try {
      const birth = new Date(dobString);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        age--;
      }
      return isNaN(age) ? dobString : `${age} yrs`;
    } catch {
      return dobString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Patient Directory</h2>
          </div>
          <p className="text-xs text-slate-500">
            Search and manage registered patients with ABHA & classical Ayush clinical records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchPatients(searchQuery)}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-teal-600" : ""}`} />
          </button>

          <Link
            href="/patients/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm hover:shadow transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Register New Patient
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, ABHA ID, or region..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <div>
            <p className="font-semibold">Unable to fetch records</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Patients Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600" />
            <p className="text-sm">Querying Neon PostgreSQL database...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 mx-auto flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">No patients found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {searchQuery
                  ? `No patient records match "${searchQuery}". Try a different name or clear the search.`
                  : "Begin case-taking by registering your first patient."}
              </p>
            </div>
            <Link
              href="/patients/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register Patient
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Patient Name</th>
                  <th className="py-3.5 px-6">ABHA Health ID</th>
                  <th className="py-3.5 px-6">Age / Sex</th>
                  <th className="py-3.5 px-6">Home Region (Desha)</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-teal-50/40 transition-colors group">
                    <td className="py-4 px-6 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200 group-hover:border-teal-300 group-hover:bg-teal-100 group-hover:text-teal-900 transition-colors">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{p.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">ID: {p.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-600">
                      {p.health_id ? (
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                          {p.health_id}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Not linked</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      <div className="flex items-center gap-1.5 capitalize text-xs font-medium">
                        <span>{calculateAge(p.dob)}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">{p.sex}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-xs">
                      {p.home_region ? (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{p.home_region}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/patients/${p.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 text-xs font-semibold transition-all"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Case Sheet</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
