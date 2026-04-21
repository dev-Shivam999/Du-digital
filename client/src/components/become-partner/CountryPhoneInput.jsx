import { useState, useRef, useEffect } from "react";
import countries from "../../data/countries.json";

const CountryPhoneInput = ({ onChange }) => {
    const wrapperRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [phone, setPhone] = useState("");
    const [selected, setSelected] = useState(
        countries.find(c => c.iso === "IN")
    );

    // Outside click close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 🔥 Send data to parent
    useEffect(() => {
        onChange?.({
            country: selected.name,
            countryCode: selected.code,
            iso: selected.iso,
            phoneNumber: phone,
            fullNumber: `${selected.code}${phone}`
        });
    }, [selected, phone]);

    const filtered = countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.includes(search)
    );

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div
                className="flex items-center border border-gray-400 outline-none rounded-md px-3 py-3 bg-white"
            >
                <button
                    type="button"
                    className="flex items-center mr-2 focus:outline-none"
                    onClick={() => setOpen(!open)}
                    aria-label="Select Country"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                >
                    <span className="mr-2">{selected.flag}</span>
                    <span className="mr-2 text-sm font-medium">{selected.code}</span>
                    <span className="text-gray-500 text-xs">{open ? "▲" : "▼"}</span>
                </button>

                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => setOpen(true)}
                    className="flex-1 outline-none text-sm"
                    aria-label="Phone Number"
                    required
                />
            </div>

            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white border rounded-md ">
                    <div className="p-2 border-b">
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>

                    <ul className="max-h-64 overflow-y-auto">
                        {filtered.map((c, i) => (
                            <li
                                key={i}
                                onClick={() => {
                                    setSelected(c);
                                    setOpen(false);
                                    setSearch("");
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                            >
                                <span>{c.flag}</span>
                                <span className="flex-1">{c.name}</span>
                                <span className="text-gray-500">{c.code}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CountryPhoneInput;
