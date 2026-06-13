const { useState, useEffect } = React;

function App() {

const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("lostFoundItems");
    return saved ? JSON.parse(saved) : [];
});

const [filter, setFilter] = useState("All");

const [search, setSearch] = useState("");

const [form, setForm] = useState({
    type: "Lost",
    title: "",
    description: "",
    location: "",
    contact: "",
    image: ""
});

useEffect(() => {
    localStorage.setItem(
        "lostFoundItems",
        JSON.stringify(items)
    );
}, [items]);

const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    });
};

const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
        setForm(prev => ({
            ...prev,
            image: reader.result
        }));
    };

    reader.readAsDataURL(file);
};

const addItem = (e) => {

    e.preventDefault();

    if (
        !form.title ||
        !form.description ||
        !form.location ||
        !form.contact
    ) {
        alert("Please fill all fields");
        return;
    }

    const item = {
        id: Date.now(),
        ...form,
        claimed: false,
        claimant: null
    };

    setItems([item, ...items]);

    setForm({
        type: "Lost",
        title: "",
        description: "",
        location: "",
        contact: "",
        image: ""
    });
};

const deleteItem = (id) => {
    setItems(
        items.filter(item => item.id !== id)
    );
};

const claimItem = (id) => {

    const name = prompt("Enter claimant name");

    if (!name) return;

    const phone = prompt("Enter phone number");

    if (!phone) return;

    const updated = items.map(item => {

        if (item.id === id) {

            return {
                ...item,
                claimed: true,
                claimant: {
                    name,
                    phone
                }
            };
        }

        return item;
    });

    setItems(updated);
};
const filteredItems = items.filter(item => {

    const matchSearch =
        item.title
            .toLowerCase()
            .includes(search.toLowerCase());

    const matchFilter =
        filter === "All"
            ? true
            : filter === "Claimed"
            ? item.claimed
            : item.type === filter;

    return matchSearch && matchFilter;
});

const totalLost =
    items.filter(i => i.type === "Lost").length;

const totalFound =
    items.filter(i => i.type === "Found").length;

const totalClaimed =
    items.filter(i => i.claimed).length;

return (
<>
    <div className="navbar">
        Lost & Found Portal
    </div>

    <div className="hero">
        <h1>Lost Something? Found Something?</h1>
        <p>
            Report lost items, post found items,
            and help people recover belongings.
        </p>
    </div>

    <div className="container">

        <div className="stats">

            <div className="stat-card">
                <h3>Total Lost</h3>
                <h2>{totalLost}</h2>
            </div>

            <div className="stat-card">
                <h3>Total Found</h3>
                <h2>{totalFound}</h2>
            </div>

            <div className="stat-card">
                <h3>Claimed</h3>
                <h2>{totalClaimed}</h2>
            </div>

        </div>

        <div className="form-section">

            <h2>Add Item</h2>

            <form onSubmit={addItem}>

                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                >
                    <option value="Lost">
                        Lost Item
                    </option>

                    <option value="Found">
                        Found Item
                    </option>
                </select>

                <input
                    type="text"
                    name="title"
                    placeholder="Item Name"
                    value={form.title}
                    onChange={handleChange}
                />

                <textarea
                    rows="4"
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                ></textarea>

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="contact"
                    placeholder="Contact Number"
                    value={form.contact}
                    onChange={handleChange}
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                />

                <button
                    className="submit-btn"
                    type="submit"
                >
                    Add Item
                </button>

            </form>

        </div>

        <div className="search-box">

            <input
                type="text"
                placeholder="Search item..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

        </div>

        <div className="filters">

            {[
                "All",
                "Lost",
                "Found",
                "Claimed"
            ].map(btn => (

                <button
                    key={btn}
                    className={
                        filter === btn
                        ? "filter-btn active"
                        : "filter-btn"
                    }
                    onClick={() =>
                        setFilter(btn)
                    }
                >
                    {btn}
                </button>

            ))}

        </div>

        <div className="cards">

            {filteredItems.map(item => (

                <div
                    className="card"
                    key={item.id}
                >

                    {item.image ? (

                        <img
                            src={item.image}
                            alt={item.title}
                        />

                    ) : (

                        <div className="placeholder">
                            No Image
                        </div>

                    )}

                    <div className="card-body">

                        <span
                            className={`badge ${
                                item.claimed
                                ? "claimed"
                                : item.type === "Lost"
                                ? "lost"
                                : "found"
                            }`}
                        >
                            {item.claimed
                                ? "Claimed"
                                : item.type}
                        </span>

                        <h3>{item.title}</h3>

                        <p>
                            {item.description}
                        </p>

                        <p>
                            <strong>
                                Location:
                            </strong>{" "}
                            {item.location}
                        </p>

                        <p>
                            <strong>
                                Contact:
                            </strong>{" "}
                            {item.contact}
                        </p>

                        {item.claimed &&
                        item.claimant ? (

                            <div className="claim-box">

                                <h4>
                                    Claimed By
                                </h4>

                                <p>
                                    {item.claimant.name}
                                </p>

                                <p>
                                    {
                                        item.claimant.phone
                                    }
                                </p>

                            </div>

                        ) : (

                            <button
                                className="claim-btn"
                                onClick={() =>
                                    claimItem(
                                        item.id
                                    )
                                }
                            >
                                Claim Item
                            </button>

                        )}

                        <button
                            className="delete-btn"
                            onClick={() =>
                                deleteItem(
                                    item.id
                                )
                            }
                        >
                            Delete
                        </button>

                    </div>

                </div>

            ))}

        </div>

    </div>

    <div className="footer">
        © 2026 Lost & Found Portal
    </div>

</>
);

}

ReactDOM.createRoot(
    document.getElementById("root")
).render(<App />);
