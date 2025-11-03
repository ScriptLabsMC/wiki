import Link from "next/link";

export default function DocCard({ doc }) {
    // Handle icon object
    const renderIcon = () => {
        if (!doc.icon) return "📄";
        
        // If icon is an object with url/alt
        if (typeof doc.icon === 'object' && doc.icon.url) {
            return (
                <img 
                    src={doc.icon.url} 
                    alt={doc.icon.alt || "Document icon"} 
                    style={{ width: "2.5rem", height: "2.5rem" }}
                />
            );
        }
        
        // If icon is a string (emoji or URL)
        if (typeof doc.icon === 'string') {
            // Check if it's a URL or emoji
            if (doc.icon.startsWith('http') || doc.icon.startsWith('/')) {
                return (
                    <img 
                        src={doc.icon} 
                        alt="Document icon" 
                        style={{ width: "2.5rem", height: "2.5rem" }}
                    />
                );
            }
            return doc.icon;
        }
        
        return "📄";
    };

    return (
        <Link
            href={`/docs/${doc.slug}`}
            className="card glass doc-card"
            style={{ textDecoration: "none" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                {renderIcon()}
            </div>
            <h3 style={{ color: "var(--text)" }}>{doc.title}</h3>
            <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
                {doc.description}
            </p>

            {doc.category && (
                <span
                    className="tag"
                    style={{ marginBottom: "0.5rem", display: "inline-block" }}>
                    {doc.category}
                </span>
            )}

            {doc.difficulty && (
                <div style={{ marginTop: "0.5rem" }}>
                    <span className={`meta-value difficulty-${doc.difficulty}`}>
                        {doc.difficulty}
                    </span>
                </div>
            )}
        </Link>
    );
}