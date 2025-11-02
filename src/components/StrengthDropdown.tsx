"use client";

import { Strength, strengthOptions } from "@/app/image-transform/page";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

type StrengthDropdownProps = {
    selected: Strength | undefined;
    setSelected: (selected: Strength | undefined) => void;
}

export default function StrengthDropdown({ selected, setSelected }: StrengthDropdownProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full relative">
            <button
                type="button"
                className={"w-full border bg-white rounded-2xl px-5 py-3 font-bold cursor-pointer flex items-center justify-between select-none " +
                    (selected ? "text-blue-600" : "text-gray-400")
                }
                onClick={() => setOpen((o) => !o)}
            >
                {selected ? selected : "강도"}
                <BiChevronDown className={`ml-2 text-xl transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute w-full mt-2 bg-white rounded-2xl shadow-lg border flex flex-col z-10 overflow-hidden">
                    {strengthOptions.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => {
                                setSelected(option);
                                setOpen(false);
                            }}
                            className={
                                `px-5 py-3 text-gray-900 cursor-pointer text-left hover:bg-indigo-50 font-medium` +
                                (option === selected ? " bg-indigo-100" : "")
                            }
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
