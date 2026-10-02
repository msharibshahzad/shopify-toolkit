"use client";

import { useState } from "react";

const aiTools = new Set(["product-title", "product-description", "meta-helper", "bullet-builder", "alt-text"]);

export default function ToolClient({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [details, setDetails] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState("40");
  const [cost, setCost] = useState("12");
  const [discount, setDiscount] = useState("10");
  const [file, setFile] = useState<File | null>(null);
  const [imageInfo, setImageInfo] = useState("");

  const label = slug === "product-title" || slug === "url-handle" ? "Product name" : "Product name or details";

  async function run() {
    setError("");
    if (aiTools.has(slug)) {
      if (!name.trim() && !details.trim()) {
        setError("Please enter product information first.");
        return;
      }
      setLoading(true);
      setResult("");
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, name, keyword, details }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Generation failed. Please try again.");
        setResult(data.result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    let out = "";
    if (slug === "url-handle") out = name.toLowerCase().trim().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    else if (slug === "sku-generator") out = name.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "");
    else if (slug === "duplicate-checker") {
      const entries = details.split(/\\n/).map(x => x.trim()).filter(Boolean);
      const seen = new Set<string>();
      const duplicates = new Set<string>();
      entries.forEach(x => { const key = x.toLowerCase(); if (seen.has(key)) duplicates.add(x); seen.add(key); });
      out = duplicates.size ? [...duplicates].join("\\n") : "No duplicate entries found.";
    } else if (slug === "profit-calculator") {
      const p = Number(price) || 0; const c = Number(cost) || 0;
      out = `Estimated profit: $${(p - c).toFixed(2)}\\nMargin: ${p ? (100 * (p - c) / p).toFixed(1) : "0"}%`;
    } else if (slug === "discount-calculator") {
      const p = Number(price) || 0; const d = Number(discount) || 0;
      out = `Sale price: $${(p * (1 - d / 100)).toFixed(2)}\\nYou save: $${(p * d / 100).toFixed(2)}`;
    } else if (slug === "csv-validator") {
      out = file ? `Selected ${file.name} (${(file.size / 1024).toFixed(1)} KB). Full Shopify schema validation is not included yet.` : "Choose a CSV file first.";
    } else if (slug === "image-checker") out = imageInfo || "Choose an image to inspect.";
    setResult(out || "Enter some details to generate a result.");
  }

  return (
    <div className="tool-panel">
      <div className="panel-heading">
        <span className="eyebrow">FREE TOOL</span>
        <h3>Enter your details</h3>
        <p>{aiTools.has(slug) ? "AI-generated drafts are returned securely from our server. Review every detail before publishing." : "Inputs are processed in this browser. Check results before making store changes."}</p>
      </div>
      {slug === "csv-validator" ? (
        <label className="upload-zone">↑<strong>{file?.name || "Choose CSV file"}</strong><span>CSV · local browser processing</span><input type="file" accept=".csv,text/csv" onChange={e => setFile(e.target.files?.[0] || null)} /></label>
      ) : slug === "image-checker" ? (
        <label className="upload-zone">↑<strong>Choose an image</strong><span>Image dimensions and file size</span><input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setImageInfo(`${f.name} — ${(f.size / 1024).toFixed(1)} KB`); const img = new Image(); img.onload = () => setImageInfo(`${f.name}: ${img.width} × ${img.height}px · ${(f.size / 1024).toFixed(1)} KB`); img.src = URL.createObjectURL(f); } }} /></label>
      ) : (
        <>
          <label>{label}<input value={name} onChange={e => setName(e.target.value)} placeholder="Enter product name or details" /></label>
          {["product-title", "meta-helper"].includes(slug) && <label>Target keyword (optional)<input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. reusable water bottle" /></label>}
          {["product-description", "bullet-builder", "duplicate-checker"].includes(slug) && <label>{slug === "duplicate-checker" ? "One handle or SKU per line" : "Features / details"}<textarea rows={5} value={details} onChange={e => setDetails(e.target.value)} placeholder={slug === "duplicate-checker" ? "SKU-001\\nSKU-002\\nSKU-001" : "Enter features, materials, benefits, or dimensions..."} /></label>}
          {["profit-calculator", "discount-calculator"].includes(slug) && <div className="input-grid"><label>Price ($)<input type="number" value={price} onChange={e => setPrice(e.target.value)} /></label>{slug === "profit-calculator" ? <label>Total costs ($)<input type="number" value={cost} onChange={e => setCost(e.target.value)} /></label> : <label>Discount (%)<input type="number" value={discount} onChange={e => setDiscount(e.target.value)} /></label>}</div>}
        </>
      )}
      <button className="button button-primary full" onClick={run} disabled={loading}>{loading ? "Generating with Gemini…" : "Generate result →"}</button>
      {error && <p role="alert" className="tool-error">{error}</p>}
      {result && <div className="result-box"><div className="result-top"><strong>Your result</strong><button className="text-button" onClick={() => navigator.clipboard?.writeText(result)}>Copy</button></div><p style={{ whiteSpace: "pre-wrap" }}>{result}</p></div>}
    </div>
  );
}
