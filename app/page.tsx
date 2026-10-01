"use client";

import { useMemo, useState } from "react";

type Tool = { name: string; description: string; category: string; icon: string; status: "Ready" | "Coming soon"; featured?: boolean };
const tools: Tool[] = [
  { name: "Product title generator", description: "Draft clear, keyword-aware product titles from your product details.", category: "Product SEO", icon: "✳", status: "Ready", featured: true },
  { name: "Product description writer", description: "Turn product features into structured, customer-friendly copy.", category: "Product SEO", icon: "✎", status: "Ready", featured: true },
  { name: "Meta title & description helper", description: "Draft search snippets and check character counts before publishing.", category: "Product SEO", icon: "⌕", status: "Ready", featured: true },
  { name: "Shopify CSV validator", description: "Preview a CSV, check required headers, and flag blank cells.", category: "CSV & data", icon: "▦", status: "Ready", featured: true },
  { name: "Profit & margin calculator", description: "Estimate profit, margin, and break-even return on ad spend.", category: "Calculators", icon: "％", status: "Ready", featured: true },
  { name: "Product bullet point builder", description: "Organize product features into scannable benefit-led bullets.", category: "Product SEO", icon: "☷", status: "Coming soon" },
  { name: "Image alt text assistant", description: "Create descriptive alt text that supports accessibility.", category: "Image tools", icon: "▧", status: "Coming soon" },
  { name: "Product URL handle generator", description: "Convert product names into clean, readable URL handles.", category: "SEO utilities", icon: "↗", status: "Coming soon" },
  { name: "SKU pattern generator", description: "Build consistent SKU codes for a growing catalog.", category: "Store utilities", icon: "⌗", status: "Coming soon" },
  { name: "Duplicate product checker", description: "Identify repeated handles or SKUs in a product export.", category: "CSV & data", icon: "◎", status: "Coming soon" },
  { name: "Image size checker", description: "Inspect image dimensions and file sizes before uploading.", category: "Image tools", icon: "▣", status: "Coming soon" },
  { name: "Discount calculator", description: "Calculate sale prices and savings at a glance.", category: "Calculators", icon: "−", status: "Coming soon" },
];
const categories = ["All tools", "Product SEO", "CSV & data", "Calculators", "Image tools", "SEO utilities", "Store utilities"];

function DraftTool({ mode }: { mode: "title" | "description" | "meta" }) {
  const [product, setProduct] = useState("");
  const [keyword, setKeyword] = useState("");
  const [details, setDetails] = useState("");
  const [result, setResult] = useState("");
  const title = mode === "title" ? "Product title generator" : mode === "description" ? "Product description writer" : "Meta title & description helper";
  function generate() {
    const name = product.trim();
    if (!name) { setResult("Add a product name to create a draft."); return; }
    const kw = keyword.trim();
    const info = details.trim();
    if (mode === "title") setResult([kw, name].filter(Boolean).join(" | "));
    else if (mode === "meta") setResult(`${name}${kw ? " — " + kw : ""}. Explore details, features, and options. Shop online today.`.slice(0, 160));
    else setResult(`Meet ${name}${kw ? ", thoughtfully selected for " + kw : ""}.\n\nHighlights\n${info || "• Designed for everyday use\n• Made with care\n• A practical addition to your routine"}\n\nAdd this product to your collection today.`);
  }
  return <section className="tool-panel" aria-label={title}>
    <div className="panel-heading"><span className="eyebrow">QUICK TOOL</span><h3>{title}</h3><p>Enter your product details to create an editable starting draft. Review all claims before publishing.</p></div>
    <label>Product name<input value={product} onChange={e=>setProduct(e.target.value)} placeholder="e.g. Insulated stainless steel water bottle" /></label>
    <label>Target keyword (optional)<input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="e.g. reusable water bottle" /></label>
    {mode !== "title" && <label>Features or product details<textarea value={details} onChange={e=>setDetails(e.target.value)} placeholder="Materials, dimensions, benefits, audience..." rows={3}/></label>}
    <button className="button button-primary full" onClick={generate}>Create draft <span>→</span></button>
    {result && <div className="result-box"><div className="result-top"><strong>Your draft</strong><button className="text-button" onClick={()=>navigator.clipboard?.writeText(result)}>Copy</button></div><p>{result}</p><small>Template-based draft. Confirm accuracy and add your brand voice before use.</small></div>}
  </section>;
}

function ProfitCalculator() {
 const [price,setPrice]=useState("40"); const [cost,setCost]=useState("12"); const [shipping,setShipping]=useState("4"); const [fees,setFees]=useState("3"); const [ad,setAd]=useState("5");
 const n=(v:string)=>Math.max(0,Number(v)||0); const profit=n(price)-n(cost)-n(shipping)-n(fees)-n(ad); const margin=n(price)>0?profit/n(price)*100:0; const roas=n(price)>0?n(price)/Math.max(0.01,n(ad)):0;
 return <section className="tool-panel"><div className="panel-heading"><span className="eyebrow">QUICK TOOL</span><h3>Profit & margin calculator</h3><p>Estimate per-order contribution after the costs you enter.</p></div>
 <div className="input-grid">{[["Selling price",price,setPrice],["Product cost",cost,setCost],["Shipping cost",shipping,setShipping],["Payment & other fees",fees,setFees],["Ad spend per order",ad,setAd]].map(([label,value,setter])=><label key={label as string}>{label as string}<div className="money-input"><span>$</span><input type="number" min="0" step="0.01" value={value as string} onChange={e=>(setter as (s:string)=>void)(e.target.value)}/></div></label>)}</div>
 <div className="metrics"><div><span>Estimated profit</span><strong className={profit<0?"negative":""}>${profit.toFixed(2)}</strong></div><div><span>Profit margin</span><strong>{margin.toFixed(1)}%</strong></div><div><span>Break-even ROAS*</span><strong>{n(price)>0?(n(price)/(n(price)-n(cost)-n(shipping)-n(fees)||1)).toFixed(2)+"×":"—"}</strong></div></div><p className="fine-print">*This simplified estimate excludes taxes, refunds, overhead, and other costs not entered. ROAS is shown as a planning aid, not a guarantee.</p>
 </section>;
}

function CsvValidator() {
 const [fileName,setFileName]=useState(""); const [headers,setHeaders]=useState<string[]>([]); const [rows,setRows]=useState<string[][]>([]); const [error,setError]=useState("");
 function parse(text:string) {
   const lines=text.replace(/\r/g,"").split("\n").filter(line=>line.trim().length>0);
   const parseLine=(line:string)=>{const out:string[]=[];let cur="";let quoted=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){if(quoted&&line[i+1]==='"'){cur+='"';i++;}else quoted=!quoted;}else if(c===","&&!quoted){out.push(cur);cur="";}else cur+=c;}out.push(cur);return out;};
   const parsed=lines.map(parseLine);setHeaders(parsed[0]||[]);setRows(parsed.slice(1,101));setError("");
 }
 return <section className="tool-panel"><div className="panel-heading"><span className="eyebrow">BROWSER-ONLY PROCESSING</span><h3>Shopify CSV validator</h3><p>Preview a CSV and spot common formatting issues. Your file is read locally in this browser in this demo.</p></div>
 <label className="upload-zone"> <span className="upload-icon">↑</span><strong>{fileName||"Choose a CSV file"}</strong><span>CSV format · preview up to 100 data rows</span><input type="file" accept=".csv,text/csv" onChange={e=>{const f=e.target.files?.[0];if(f){setFileName(f.name);const reader=new FileReader();reader.onload=()=>parse(String(reader.result||""));reader.onerror=()=>setError("Unable to read this file.");reader.readAsText(f);}}}/></label>
 {error&&<p className="error">{error}</p>}{headers.length>0&&<><div className="csv-summary"><strong>{headers.length} columns</strong><span>{rows.length} preview rows</span><span>{headers.some(h=>!h.trim())?"Blank header detected":"Headers present"}</span></div><div className="table-scroll"><table><thead><tr>{headers.map((h,i)=><th key={i}>{h||"(blank header)"}</th>)}</tr></thead><tbody>{rows.slice(0,8).map((row,i)=><tr key={i}>{headers.map((_,j)=><td key={j}>{row[j]||<em>empty</em>}</td>)}</tr>)}</tbody></table></div><p className="fine-print">Basic CSV preview only. This is not yet a complete Shopify import-schema validator. Always keep an original backup.</p></>}
 </section>;
}

export default function Home() {
 const [query,setQuery]=useState(""); const [active,setActive]=useState("All tools");
 const filtered=useMemo(()=>tools.filter(t=>(active==="All tools"||t.category===active)&&(`${t.name} ${t.description} ${t.category}`.toLowerCase().includes(query.toLowerCase()))),[query,active]);
 return <main>
  <header className="site-header"><a className="brand" href="#"><span className="brand-mark">S</span><span>shopify<span className="brand-light">toolkit</span><small>TOOLS FOR BETTER STORES</small></span></a><nav><a href="#tools">Explore tools</a><a href="#how-it-works">How it works</a><a className="nav-cta" href="#tools">Get started <span>↗</span></a></nav><a className="mobile-nav" href="#tools">Tools ↓</a></header>
  <section className="hero"><div className="hero-glow"></div><div className="hero-content"><div className="hero-pill"><span className="pulse"></span> A practical workspace for Shopify merchants</div><h1>Less busywork.<br/><span>More store growth.</span></h1><p className="hero-copy">Thoughtful, free tools to optimize product listings, clean catalog data, and understand your margins — without the spreadsheet headaches.</p><div className="hero-actions"><a className="button button-primary" href="#tools">Explore free tools <span>→</span></a><a className="button button-secondary" href="#how-it-works">See how it works</a></div><div className="hero-proof"><span>✓ No account needed</span><span>✓ Simple and practical</span><span>✓ Built for merchants</span></div></div><div className="hero-art" aria-hidden="true"><div className="art-card art-main"><div className="art-top"><span className="mini-dot"></span><span>Store snapshot</span><span className="art-menu">•••</span></div><div className="art-product"><div className="product-illustration">◈</div><div><strong>Everyday essentials</strong><small>Product listing · Draft</small></div><span className="status-chip">Ready</span></div><div className="art-lines"><i></i><i></i><i></i></div><div className="art-stat"><span>Listing quality</span><strong>Looking good <b>↗</b></strong></div><div className="art-progress"><i></i></div><div className="art-foot"><span>Title</span><span>Description</span><span>Metadata</span></div></div><div className="floating-card floating-top"><span className="float-icon">✳</span><div><strong>SEO draft</strong><small>Ready to review</small></div><span className="float-check">✓</span></div><div className="floating-card floating-bottom"><span className="float-icon green">↗</span><div><strong>Profit estimate</strong><small>Know your numbers</small></div></div></div></section>
  <section className="trust-strip"><div><strong>Built for real workflows</strong><span>Useful utilities, not empty dashboards</span></div><div><strong>Privacy-minded</strong><span>Local processing where possible</span></div><div><strong>Easy to use</strong><span>Clear inputs and practical outputs</span></div></section>
  <section className="tools-section" id="tools"><div className="section-heading"><div><span className="eyebrow">THE TOOLBOX</span><h2>Everything you need,<br/><em>all in one place.</em></h2></div><p>Start with a task. Get a useful result. Get back to running your store.</p></div><div className="tool-search"><span>⌕</span><input aria-label="Search tools" placeholder="Search tools..." value={query} onChange={e=>setQuery(e.target.value)}/><kbd>⌘ K</kbd></div><div className="category-row">{categories.map(c=><button key={c} className={active===c?"category active":"category"} onClick={()=>setActive(c)}>{c}</button>)}</div><div className="tool-grid">{filtered.map((tool,i)=><article className={tool.featured?"tool-card featured":"tool-card"} key={tool.name}><div className="tool-card-top"><span className="tool-icon">{tool.icon}</span><span className={tool.status==="Ready"?"tool-status ready":"tool-status"}>{tool.status}</span></div><h3>{tool.name}</h3><p>{tool.description}</p><a href={tool.status==="Ready"?(tool.name.startsWith("Product title")?"#title-tool":tool.name.startsWith("Product description")?"#description-tool":tool.name.startsWith("Meta")?"#meta-tool":tool.name.startsWith("Shopify CSV")?"#csv-tool":"#profit-tool"):"#contact"}>{tool.status==="Ready"?"Open tool →":"Planned tool →"}</a></article>)}</div>{filtered.length===0&&<div className="empty-state">No tools match that search. Try another keyword.</div>}</section>
  <section className="workspace-section" id="workspace"><div className="workspace-intro"><span className="eyebrow">TRY THE TOOLS</span><h2>Make your next move<br/><em>a little easier.</em></h2><p>These starter tools work right here. Use the output as a draft, then review it for your brand and product accuracy.</p></div><div className="workspace-grid"><div id="title-tool"><DraftTool mode="title"/></div><div id="description-tool"><DraftTool mode="description"/></div><div id="meta-tool"><DraftTool mode="meta"/></div><div id="profit-tool"><ProfitCalculator/></div><div id="csv-tool" className="wide-panel"><CsvValidator/></div></div></section>
  <section className="how-section" id="how-it-works"><span className="eyebrow">A SIMPLER WORKFLOW</span><h2>From task to done<br/><em>in three steps.</em></h2><div className="steps"><div><span>01</span><h3>Choose a tool</h3><p>Find the utility that matches the job in front of you.</p></div><div><span>02</span><h3>Add your details</h3><p>Use clear inputs and examples to get a useful starting point.</p></div><div><span>03</span><h3>Review and use</h3><p>Copy, refine, or download your result and get back to business.</p></div></div></section>
  <footer id="contact"><div className="footer-brand"><a className="brand" href="#"><span className="brand-mark">S</span><span>shopify<span className="brand-light">toolkit</span><small>TOOLS FOR BETTER STORES</small></span></a><p>Practical tools for the people building online businesses.</p></div><div className="footer-links"><a href="#tools">All tools</a><a href="#how-it-works">How it works</a><a href="mailto:hello@yourdomain.com">Contact</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Shopify Toolkit. Independent project; not affiliated with Shopify Inc.</span><span>Made for merchants, everywhere.</span></div></footer>
 </main>;
}
