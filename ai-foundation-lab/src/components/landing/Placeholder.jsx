// src/components/landing/Placeholder.jsx
import "./Landing.css";

export default function Placeholder({ tag, title, desc, id, height = "auto" }) {
    return (
        <div className="placeholder-block" style={{ minHeight: height }}>
            <span className="placeholder-block__tag">Placeholder · Step 2.1</span>
            {title && <h2 className="placeholder-block__title">{title}</h2>}
            {desc && <p className="placeholder-block__desc">{desc}</p>}
            {id && (
                <span className="placeholder-block__id">
                    &lt;section id="{id}"&gt;
                </span>
            )}
        </div>
    );
}