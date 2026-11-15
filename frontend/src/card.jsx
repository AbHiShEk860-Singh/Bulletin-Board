
import { useState } from "react";

export function Card({ id, title, setstate, content, category }) {
    const [deleting, setdeleting] = useState(false);
    const [error, seterror] = useState("");

    async function handledelete() {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${title}"?`
        );

        if (!confirmed) {
            return;
        }

        setdeleting(true);
        seterror("");

        try {
            const response = await fetch(
                `http://localhost:5000/api/notices/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                const data = await response.json().catch(() => null);

                throw new Error(
                    data?.message || "Unable to delete this notice."
                );
            }

            setstate(prev =>
                prev.filter(item => item.id !== id)
            );

        } catch (err) {
            seterror(err.message || "Something went wrong.");
        } finally {
            setdeleting(false);
        }
    }

    return (
        <article className="notice-card">

            <div className="card-top">
                <span className="category-badge">
                    {category || "General"}
                </span>

                <span className="card-symbol">▤</span>
            </div>

            <div className="card-body">
                <h3 className="notice-title">
                    {title}
                </h3>

                <p className="notice-content">
                    {content}
                </p>
            </div>

            <div className="card-footer">
                {error && (
                    <p className="card-error">{error}</p>
                )}

                <button
                    className="delete-button"
                    onClick={handledelete}
                    disabled={deleting}
                >
                    {deleting ? "Deleting..." : "Delete Notice"}
                </button>
            </div>

        </article>
    );
}
