"use client";
import {useState} from "react";
export default function ToolClient({slug}:{slug:string}){
 const [name,setName]=useState("");const [keyword,setKeyword]=useState("");const [details,setDetails]=useState("");const [result,setResult]=useState("");const [price,setPrice]=useState("40");const [cost,setCost]=useState("12");const [discount,setDiscount]=useState("10");const [file,setFile]=useState<File|null>(null);const [imageInfo,setImageInfo]=useState("");
 const label=slug==="product-title"?"Product name":slug==="url-handle"?"Product name":"Product name or details";
 function run(){let out="";
 if(slug==="product-title")out=[keyword.trim(),name.trim()].filter(Boolean).join(" | ");
 else if(slug==="product-description")out=`Meet ${name}.\n\n${details||"Add your product features here."}\n\nDiscover it today.`;
 else if(slug==="meta-helper")out=`${name}${keyword?" — "+keyword:""}. Explore features and options. Shop online today.`.slice(0,160);
 else if(slug==="bullet-builder")out=details.split(/[\n,;]+/).map(x=>x.trim()).filter(Boolean).map(x=>"• "+x).join("\n");
 else if(slug==="alt-text")out=name? `Product image showing ${name}.`:"Describe the product shown in the image.";
 else if(slug==="url-handle")out=name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
 else if(slug==="sku-generator")out=name.toUpperCase().replace(/[^A-Z0-9]+/g,"-").replace(/^-|-$/g,"");
 else if(slug==="duplicate-checker"){const a=details.split(/\n/).map(x=>x.trim()).filter(Boolean);const seen=new Set<string>();const dup=new Set<string>();a.forEach(x=>{const k=x.toLowerCase();if(seen.has(k))dup.add(x);seen.add(k)});out=dup.size?[...dup].join("\n"):"No duplicate entries found.";}
 else if(slug==="profit-calculator"){const p=Number(price)||0,c=Number(cost)||0;out=`Estimated profit: $${(p-c).toFixed(2)}\nMargin: ${p?(100*(p-c)/p).toFixed(1):"0"}%`;}
 else if(slug==="discount-calculator"){const p=Number(price)||0,d=Number(discount)||0;out=`Sale price: $${(p*(1-d/100)).toFixed(2)}\nYou save: $${(p*d/100).toFixed(2)}`;}
 else if(slug==="csv-validator"){out=file? `Selected ${file.name} (${(file.size/1024).toFixed(1)} KB). Full Shopify schema validation is not included yet.`:"Choose a CSV file first.";}
 else if(slug==="image-checker"){out=imageInfo||"Choose an image to inspect.";}
 setResult(out||"Enter some details to generate a result.");
 }
 return <div className="tool-panel"><div className="panel-heading"><span className="eyebrow">FREE TOOL</span><h3>Enter your details</h3><p>Inputs are processed in this browser. Generated copy is a starting point; check accuracy before publishing.</p></div>
 {slug==="csv-validator"?<label className="upload-zone">↑<strong>{file?.name||"Choose CSV file"}</strong><span>CSV · local browser processing</span><input type="file" accept=".csv,text/csv" onChange={e=>setFile(e.target.files?.[0]||null)}/></label>:slug==="image-checker"?<label className="upload-zone">↑<strong>Choose an image</strong><span>Image dimensions and file size</span><input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f){setImageInfo(`${f.name} — ${(f.size/1024).toFixed(1)} KB`);const img=new Image();img.onload=()=>setImageInfo(`${f.name}: ${img.width} × ${img.height}px · ${(f.size/1024).toFixed(1)} KB`);img.src=URL.createObjectURL(f)}}}/></label>:<><label>{label}<input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter product name or details"/></label>{["product-title","meta-helper"].includes(slug)&&<label>Target keyword (optional)<input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="e.g. reusable water bottle"/></label>}{["product-description","bullet-builder","duplicate-checker"].includes(slug)&&<label>{slug==="duplicate-checker"?"One handle or SKU per line":"Features / details"}<textarea rows={5} value={details} onChange={e=>setDetails(e.target.value)} placeholder={slug==="duplicate-checker"?"SKU-001\nSKU-002\nSKU-001":"Enter features, materials, benefits, or dimensions..."}/></label>}{["profit-calculator","discount-calculator"].includes(slug)&&<div className="input-grid"><label>Price ($)<input type="number" value={price} onChange={e=>setPrice(e.target.value)}/></label>{slug==="profit-calculator"?<label>Total costs ($)<input type="number" value={cost} onChange={e=>setCost(e.target.value)}/></label>:<label>Discount (%)<input type="number" value={discount} onChange={e=>setDiscount(e.target.value)}/></label>}</div>}</>}
 <button className="button button-primary full" onClick={run}>Generate result →</button>{result&&<div className="result-box"><div className="result-top"><strong>Your result</strong><button className="text-button" onClick={()=>navigator.clipboard?.writeText(result)}>Copy</button></div><p>{result}</p></div>}
 </div>
}
