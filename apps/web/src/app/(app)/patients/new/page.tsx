"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  UserPlus, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  HeartPulse,
  Info
} from "lucide-react";
import { api } from "@/lib/api-client";
import type { PatientCreate, Patient } from "@vaidyacare/schema";

export default function NewPatientPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Patient | null>(null);

  const [formData, setFormData] = useState<PatientCreate>({
    name: "",
    health_id: "",
    dob: "",
    sex: "male",
    contact: "",
    occupation: "",
    home_region: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Basic validation
    if (!formData.name.trim()) {
      setError("Patient full name is required.");
      setSubmitting(false);
      return;
    }
    if (!formData.dob) {
      setError("Date of birth is required.");
      setSubmitting(false);
      return;
    }

    try {
      const payload: PatientCreate = {
        name: formData.name.trim(),
        dob: formData.dob,
        sex: formData.sex,
        health_id: formData.health_id?.trim() || undefined,
        contact: formData.contact?.trim() || undefined,
        occupation: formData.occupation?.trim() || undefined,
        home_region: formData.home_region?.trim() || undefined,
      };

      const created = await api.post<Patient>("/patients", payload);
      setSuccess(created);
      setTimeout(() => {
        router.push("/patients");
      }, 1500);
    } catch (err: any) {
      console.error("Patient registration error:", err);
      setError(err.message || "Failed to register patient in database.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button and page title */}
      <div className="flex items-center justify-between">
        <Link
          href="/patients"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patient Directory
        </Link>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
          DATA_MODEL.md §patient
        </span>
      </div>

      {/* Registration Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 bg-gradient-to-r from-teal-900 to-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Register New Patient</h2>
              <p className="text-xs text-teal-100/80 mt-1 max-w-lg">
                Create a patient demographic and clinical identity record linked with national ABHA identifiers and classical Ayurvedic geographical attributes.
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="m-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Patient registered successfully in Neon database!</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Record ID: <span className="font-mono">{success.id}</span>. Redirecting to directory...
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="m-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Registration Failed</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Patient Full Name <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Smt. Lakshmi Narayanan"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
              />
            </div>

            {/* ABHA / Health ID */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>National Health ID (ABHA)</span>
                <span className="text-[11px] font-normal text-slate-400">Optional</span>
              </label>
              <input
                type="text"
                name="health_id"
                value={formData.health_id}
                onChange={handleChange}
                placeholder="e.g. ABHA-1234-5678-9012"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
              />
            </div>

            {/* Biological Sex */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Biological Sex <span className="text-red-500">*</span>
              </label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                required
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Contact Number</span>
                <span className="text-[11px] font-normal text-slate-400">Optional</span>
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="e.g. +91 98450 12345"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
              />
            </div>

            {/* Occupation */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Occupation (Vritta)</span>
                <span className="text-[11px] font-normal text-slate-400">Optional</span>
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="e.g. Software Engineer, Farmer, Teacher"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
              />
            </div>

            {/* Home Region (Desha Context) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Home Region (Desha Context)</span>
                <span className="text-[11px] font-normal text-slate-400">Optional</span>
              </label>
              <input
                type="text"
                name="home_region"
                value={formData.home_region}
                onChange={handleChange}
                placeholder="e.g. Coastal Karnataka (Anupa Desha)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/patients"
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-md shadow-teal-700/20 disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving to Database...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Register Patient
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
