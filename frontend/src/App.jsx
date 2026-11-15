
import { useState, useEffect, useMemo } from "react";
import { Card } from "./card";
import { Add } from "./Add";

export function App() {
    const [state, setstate] = useState([]);
    const [category, setcategory] = useState("");
    const [search, setsearch] = useState("");
    const [sort, setsort] = useState("newest");
    const [add, showadd] = useState(false);
    const [totalcategory, settotalcategory] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState("");
    const [refresh, setrefresh] = useState(0);

    // Fetch notices whenever the selected category changes.
    useEffect(() => {
        let ignore = false;

        async function fetchNotices() {
            setloading(true);
            seterror("");

            try {
                const response = await fetch(
                    `http://localhost:5000/api/notices?category=${encodeURIComponent(category)}`
                );

                if (!response.ok) {
                    throw new Error("Unable to fetch notices.");
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid response received from server.");
                }

                if (!ignore) {
                    setstate(data);

                    if (category === "") {
                        const categories = data
                            .map(item => item.category)
                            .filter(Boolean);

                        settotalcategory([...new Set(categories)]);
                    }
                }
                /*if (!ignore) {
                    setstate(data);

                    settotalcategory(prev => {
                        const categories = data
                            .map(item => item.category)
                            .filter(Boolean);

                        return [...new Set([...prev, ...categories])];
                    });
                }*/
            } catch (err) {
                if (!ignore) {
                    seterror(err.message || "Something went wrong.");
                }
            } finally {
                if (!ignore) {
                    setloading(false);
                }
            }
        }

        fetchNotices();

        return () => {
            ignore = true;
        };
    }, [category,refresh]);

    // Search and sorting are handled on the frontend.
    const displayedNotices = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        let result = state.filter(notice => {
            const matchesSearch =
                (notice.title || "").toLowerCase().includes(keyword) ||
                (notice.content || "").toLowerCase().includes(keyword) ||
                (notice.category || "").toLowerCase().includes(keyword);

            return matchesSearch;
        });

        result = [...result].sort((a, b) => {
            if (sort === "newest") {
                return Number(b.id) - Number(a.id);
            }

            return Number(a.id) - Number(b.id);
        });

        return result;
    }, [state, search, sort]);

    const handleAdd = () => {
        showadd(true);
    };

    return (
        <div className="dashboard">

            {/* Header */}
            <header className="dashboard-header">
                <div>
                    <div className="brand">
                        <span className="brand-icon">B</span>
                        <span>Bulletin<span className="brand-highlight">Board</span></span>
                    </div>

                    <p className="header-subtitle">
                        Your central place for announcements and updates.
                    </p>
                </div>

                <div className="header-label">
                    <span className="status-dot"></span>
                    Notice Management
                </div>
            </header>

            {/* Page heading */}
            <section className="welcome-section">
                <div>
                    <p className="eyebrow">YOUR WORKSPACE</p>
                    <h1>Notice Dashboard</h1>
                    <p className="welcome-text">
                        Create, organize and manage all your notices in one place.
                    </p>
                </div>

                <button className="add-button" onClick={handleAdd}>
                    <span className="plus-icon">+</span>
                    Add New Notice
                </button>
            </section>

            {/* Statistics */}
            <section className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon purple-icon">▤</div>
                    <div>
                        <p>Total Notices</p>
                        <h2>{state.length}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon blue-icon">▦</div>
                    <div>
                        <p>Total Categories</p>
                        <h2>{totalcategory.length}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green-icon">✓</div>
                    <div>
                        <p>Displayed Notices</p>
                        <h2>{displayedNotices.length}</h2>
                    </div>
                </div>
            </section>

            {/* Notices section */}
            <section className="notice-section">

                <div className="section-heading">
                    <div>
                        <h2>All Notices</h2>
                        <p>Browse and manage your announcements.</p>
                    </div>
                </div>

                {/* Search and filters */}
                <div className="toolbar">

                    <div className="search-box">
                        <span className="search-icon">⌕</span>
                        <input
                            type="text"
                            placeholder="Search notices..."
                            value={search}
                            onChange={e => setsearch(e.target.value)}
                        />

                        {search && (
                            <button
                                className="clear-search"
                                onClick={() => setsearch("")}
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <select
                        className="filter-select"
                        value={category}
                        onChange={e => setcategory(e.target.value)}
                    >
                        <option value="">All Categories</option>

                        {totalcategory.map(cat => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <select
                        className="filter-select sort-select"
                        value={sort}
                        onChange={e => setsort(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>

                </div>

                {/* Notice cards */}
                {loading ? (
                    <div className="message-state">
                        <div className="loader"></div>
                        <p>Loading notices...</p>
                    </div>
                ) : error ? (
                    <div className="message-state error-state">
                        <h3>Something went wrong</h3>
                        <p>{error}</p>
                        <button
                            className="retry-button"
                            onClick={() => setrefresh(prev => prev+1)}
                        >
                            Retry
                        </button>
                    </div>
                ) : displayedNotices.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">▤</div>
                        <h3>No notices found</h3>
                        <p>
                            {search
                                ? "Try another search keyword."
                                : "Start by creating your first notice."}
                        </p>

                        {!search && (
                            <button className="add-button" onClick={handleAdd}>
                                + Create Notice
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="whole">
                        {displayedNotices.map(element => (
                            <Card
                                key={element.id}
                                id={element.id}
                                setstate={setstate}
                                title={element.title}
                                content={element.content}
                                category={element.category}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Add notice modal */}
            {add && (
                <Add
                    setstate={setstate}
                    showadd={showadd}
                    settotalcategory={settotalcategory}
                />
            )}

            {/* Footer */}
            <footer className="dashboard-footer">
                Bulletin Board <span>•</span> Manage your notices efficiently
            </footer>

        </div>
    );
}
