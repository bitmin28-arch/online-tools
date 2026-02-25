import Link from "next/link";

/**
 * 工具定义 — 每个工具的元数据
 * 首页根据这个列表自动生成卡片
 */
interface ToolItem {
  name: string;
  description: string;
  href: string;
  icon: string;
  tag: string;
  tagClass: string;
}

const TOOL_CATEGORIES: { title: string; id: string; tools: ToolItem[] }[] = [
  {
    title: "🖼️ Image Tools",
    id: "image-tools",
    tools: [
      {
        name: "Image Compressor",
        description: "Reduce image file size while maintaining quality. Supports JPG, PNG, WebP.",
        href: "/image-compressor",
        icon: "📦",
        tag: "Image",
        tagClass: "tag-image",
      },
      {
        name: "Image Converter",
        description: "Convert images between JPG, PNG, WebP, and BMP formats instantly.",
        href: "/image-converter",
        icon: "🔄",
        tag: "Image",
        tagClass: "tag-image",
      },
      {
        name: "Image Resizer",
        description: "Resize images to exact dimensions or by percentage.",
        href: "/image-resizer",
        icon: "📐",
        tag: "Image",
        tagClass: "tag-image",
      },
      {
        name: "Image to ICO",
        description: "Convert any image to ICO format for favicons.",
        href: "/image-to-ico",
        icon: "🌐",
        tag: "Image",
        tagClass: "tag-image",
      },
      {
        name: "SVG to PNG",
        description: "Convert SVG files to high-resolution PNG images.",
        href: "/svg-to-png",
        icon: "🖌️",
        tag: "Image",
        tagClass: "tag-image",
      },
    ],
  },
  {
    title: "📄 PDF Tools",
    id: "pdf-tools",
    tools: [
      {
        name: "PDF Merge",
        description: "Combine multiple PDF files into a single document.",
        href: "/pdf-merge",
        icon: "📑",
        tag: "PDF",
        tagClass: "tag-pdf",
      },
      {
        name: "PDF Split",
        description: "Extract pages or split PDF files into smaller documents.",
        href: "/pdf-split",
        icon: "✂️",
        tag: "PDF",
        tagClass: "tag-pdf",
      },
      {
        name: "Images to PDF",
        description: "Combine images into a single PDF document.",
        href: "/images-to-pdf",
        icon: "🖼️",
        tag: "PDF",
        tagClass: "tag-pdf",
      },
      {
        name: "Word to PDF",
        description: "Convert Word documents (.docx) to PDF in your browser.",
        href: "/word-to-pdf",
        icon: "📝",
        tag: "PDF",
        tagClass: "tag-pdf",
      },
    ],
  },
  {
    title: "🔧 Developer Tools",
    id: "dev-tools",
    tools: [
      {
        name: "JSON Formatter",
        description: "Format, validate, and minify JSON data with syntax highlighting.",
        href: "/json-formatter",
        icon: "{ }",
        tag: "Dev",
        tagClass: "tag-dev",
      },
      {
        name: "Base64 Encoder/Decoder",
        description: "Encode text to Base64 or decode Base64 back to text.",
        href: "/base64",
        icon: "🔐",
        tag: "Dev",
        tagClass: "tag-dev",
      },
      {
        name: "Hash Generator",
        description: "Generate MD5, SHA-1, SHA-256 hashes from text input.",
        href: "/hash-generator",
        icon: "#️⃣",
        tag: "Dev",
        tagClass: "tag-dev",
      },
      {
        name: "URL Encoder/Decoder",
        description: "Encode or decode URL components for web development.",
        href: "/url-codec",
        icon: "🔗",
        tag: "Dev",
        tagClass: "tag-dev",
      },
      {
        name: "JWT Decoder",
        description: "Decode and inspect JSON Web Tokens without verification.",
        href: "/jwt-decoder",
        icon: "🎫",
        tag: "Dev",
        tagClass: "tag-dev",
      },
      {
        name: "Timestamp Converter",
        description: "Convert between Unix timestamps and human-readable dates.",
        href: "/timestamp",
        icon: "⏱️",
        tag: "Dev",
        tagClass: "tag-dev",
      },
      {
        name: "Regex Tester",
        description: "Test and debug regular expressions with real-time matching.",
        href: "/regex-tester",
        icon: "🔍",
        tag: "Dev",
        tagClass: "tag-dev",
      },
      {
        name: "UUID Generator",
        description: "Generate random UUIDs (v4) for your applications.",
        href: "/uuid-generator",
        icon: "🆔",
        tag: "Dev",
        tagClass: "tag-dev",
      },
      {
        name: "JSON ↔ CSV",
        description: "Convert between JSON arrays and CSV format.",
        href: "/json-csv",
        icon: "📊",
        tag: "Dev",
        tagClass: "tag-dev",
      },
      {
        name: "Cron Parser",
        description: "Parse cron expressions and see next run times.",
        href: "/cron-parser",
        icon: "⏰",
        tag: "Dev",
        tagClass: "tag-dev",
      },
      {
        name: "Meta Tag Generator",
        description: "Generate SEO, Open Graph, and Twitter meta tags.",
        href: "/meta-tags",
        icon: "🏷️",
        tag: "Dev",
        tagClass: "tag-dev",
      },
    ],
  },
  {
    title: "📝 Text Tools",
    id: "text-tools",
    tools: [
      {
        name: "Word Counter",
        description: "Count words, characters, sentences, and paragraphs in your text.",
        href: "/word-counter",
        icon: "📊",
        tag: "Text",
        tagClass: "tag-text",
      },
      {
        name: "Text Diff",
        description: "Compare two texts and highlight the differences.",
        href: "/text-diff",
        icon: "📋",
        tag: "Text",
        tagClass: "tag-text",
      },
      {
        name: "Case Converter",
        description: "Convert text to UPPERCASE, lowercase, Title Case, and more.",
        href: "/case-converter",
        icon: "Aa",
        tag: "Text",
        tagClass: "tag-text",
      },
      {
        name: "Markdown Preview",
        description: "Write and preview Markdown with live rendering.",
        href: "/markdown-preview",
        icon: "📝",
        tag: "Text",
        tagClass: "tag-text",
      },
      {
        name: "Lorem Ipsum Generator",
        description: "Generate placeholder text for designs and mockups.",
        href: "/lorem-ipsum",
        icon: "📜",
        tag: "Text",
        tagClass: "tag-text",
      },
    ],
  },
  {
    title: "🎨 Design Tools",
    id: "design-tools",
    tools: [
      {
        name: "Color Picker",
        description: "Pick colors and convert between HEX, RGB, and HSL formats.",
        href: "/color-picker",
        icon: "🎨",
        tag: "Design",
        tagClass: "tag-design",
      },
      {
        name: "Gradient Generator",
        description: "Create beautiful CSS gradients with a visual editor.",
        href: "/gradient-generator",
        icon: "🌈",
        tag: "Design",
        tagClass: "tag-design",
      },
      {
        name: "Box Shadow Generator",
        description: "Design CSS box shadows with a visual editor.",
        href: "/box-shadow",
        icon: "🔲",
        tag: "Design",
        tagClass: "tag-design",
      },
    ],
  },
  {
    title: "📊 Data Tools",
    id: "data-tools",
    tools: [
      {
        name: "QR Code Generator",
        description: "Generate QR codes from text, URLs, or any data.",
        href: "/qr-generator",
        icon: "📱",
        tag: "Data",
        tagClass: "tag-data",
      },
      {
        name: "Password Generator",
        description: "Generate strong, random passwords with custom length and complexity.",
        href: "/password-generator",
        icon: "🔑",
        tag: "Security",
        tagClass: "tag-security",
      },
      {
        name: "Number Base Converter",
        description: "Convert numbers between binary, octal, decimal, and hexadecimal.",
        href: "/base-converter",
        icon: "🔢",
        tag: "Data",
        tagClass: "tag-data",
      },
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>Free Online Tools</h1>
        <p>
          Fast, private, and free. All tools run entirely in your browser — your
          files never leave your device.
        </p>
      </section>
      <section className="tools-section container">
        {TOOL_CATEGORIES.map((category) => (
          <div key={category.id} id={category.id}>
            <h2 className="section-title">{category.title}</h2>
            <div className="tools-grid">
              {category.tools.map((tool) => (
                <Link href={tool.href} key={tool.href} className="tool-card">
                  <div className="tool-card-icon" style={{ background: 'var(--color-bg-secondary)' }}>
                    {tool.icon}
                  </div>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                  <span className={`tag ${tool.tagClass}`}>{tool.tag}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
