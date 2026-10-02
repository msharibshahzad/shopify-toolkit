import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import ToolClient from "./tool-client";
const toolMap: Record<string,{title:string;category:string;description:string;intro:string}> = {
 "product-title":{title:"Product title generator",category:"Product SEO",description:"Draft clear, keyword-aware product titles from your product details.",intro:"Create a concise product title that combines your product name and target keyword."},
 "product-description":{title:"Product description writer",category:"Product SEO",description:"Turn product features into structured, customer-friendly copy.",intro:"Turn your product details into an editable description draft."},
 "meta-helper":{title:"Meta title & description helper",category:"Product SEO",description:"Draft search snippets and check character counts before publishing.",intro:"Prepare a search-friendly meta description and review its length."},
 "csv-validator":{title:"Shopify CSV validator",category:"CSV & data",description:"Preview a CSV, check headers, and flag blank cells.",intro:"Choose a CSV file to preview its headers and first rows. Processing stays in your browser."},
 "profit-calculator":{title:"Profit & margin calculator",category:"Calculators",description:"Estimate profit, margin, and break-even return on ad spend.",intro:"Enter your selling price and costs to estimate per-order profitability."},
 "bullet-builder":{title:"Product bullet point builder",category:"Product SEO",description:"Organize product features into scannable benefit-led bullets.",intro:"Turn a list of product features into readable bullet points."},
 "alt-text":{title:"Image alt text assistant",category:"Store utilities",description:"Create descriptive alt text that supports accessibility.",intro:"Draft descriptive alt text based on what your product image shows."},
 "url-handle":{title:"Product URL handle generator",category:"SEO utilities",description:"Convert product names into clean, readable URL handles.",intro:"Convert a product name into a simple, lowercase URL handle."},
 "sku-generator":{title:"SKU pattern generator",category:"Store utilities",description:"Build consistent SKU codes for a growing catalog.",intro:"Create a repeatable SKU from a product code, category, and variant."},
 "duplicate-checker":{title:"Duplicate product checker",category:"CSV & data",description:"Identify repeated handles or SKUs in a product export.",intro:"Paste one handle or SKU per line to find duplicates."},
 "image-checker":{title:"Image size checker",category:"Image tools",description:"Inspect image dimensions and file sizes before uploading.",intro:"Select an image to inspect its dimensions and file size."},
 "discount-calculator":{title:"Discount calculator",category:"Calculators",description:"Calculate sale prices and savings at a glance.",intro:"Enter an original price and discount percentage to calculate the sale price."}
};
export function generateStaticParams(){return Object.keys(toolMap).map(slug=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const t=toolMap[slug];return {title:t?.title??"Tool not found",description:t?.description};}
export default async function ToolPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const tool=toolMap[slug];if(!tool)return <main><SiteHeader/><section className="single-tool"><h1>Tool not found</h1><Link href="/">Back to all tools</Link></section></main>;
return <main><SiteHeader/><section className="single-tool"><div className="breadcrumbs"><Link href="/">Home</Link> / <Link href="/#tools">Tools</Link> / {tool.title}</div><span className="eyebrow">{tool.category.toUpperCase()}</span><h1>{tool.title}</h1><p className="single-lead">{tool.intro}</p><ToolWorkspace slug={slug}/><div className="single-note">Free to use · No account required · Review generated content for accuracy before publishing.</div></section><footer className="single-footer"><span>© {new Date().getFullYear()} Shopify Toolkit. Independent project; not affiliated with Shopify Inc.</span><Link href="/">← Browse all tools</Link></footer></main>}
function ToolWorkspace({slug}:{slug:string}){return <div className="single-workspace"><ToolForm key={slug} slug={slug}/></div>}
function ToolForm({slug}:{slug:string}){ return <ToolClient slug={slug}/> }
