
import { useState } from "react";

export function Add({ setstate, showadd, settotalcategory }) {
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState("");

    async function handlesubmit(e) {
        e.preventDefault();

        const form = new FormData(e.target);

        const title = form.get("title").trim();
        const category = form.get("category").trim();
        const content = form.get("content").trim();

        if (!title || !category || !content) {
            seterror("Please fill in all the fields.");
            return;
        }

        setloading(true);
        seterror("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/notices",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title,
                        category,
                        content
                    })
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || data?.error || "Unable to create notice."
                );
            }

            setstate(prev => [...prev, data]);

            settotalcategory(prev => {
                if (!prev.includes(category)) {
                    return [...prev, category];
                }

                return prev;
            });

            showadd(false);

        } catch (err) {
            seterror(err.message || "Something went wrong.");
        } finally {
            setloading(false);
        }
    }

    return (
        <div
            className="modal-overlay"
            onMouseDown={e => {
                if (e.target === e.currentTarget && !loading) {
                    showadd(false);
                }
            }}
        >
            <div
                className="modal-container"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >

                <div className="modal-header">
                    <div>
                        <p className="eyebrow">NEW ANNOUNCEMENT</p>
                        <h2 id="modal-title">Create a Notice</h2>
                        <p className="modal-subtitle">
                            Add a new announcement to your bulletin board.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={() => showadd(false)}
                        disabled={loading}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handlesubmit} className="notice-form">

                    <div className="form-group">
                        <label htmlFor="title">Notice Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter notice title"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            placeholder="e.g. Events, Academic, General"
                            maxLength={50}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Notice Content</label>
                        <textarea
                            id="content"
                            name="content"
                            placeholder="Write your announcement here..."
                            rows="5"
                            maxLength={2000}
                            required
                        />
                    </div>

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => showadd(false)}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "+ Create Notice"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
