type MenuItemProps = {
    label: string;
    href: string;
    icon: React.ReactElement;
    isActive: boolean;
    onClick: () => void;
};

export default function MenuItem({
    label,
    icon,
    isActive,
    onClick,
}: MenuItemProps) {
    return (
        <button
            className={`w-full py-3 px-4 rounded-xl font-semibold text-base transition text-left flex items-center gap-2 ${isActive
                ? "bg-white text-gray-900 shadow-md"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            onClick={onClick}
        >
            {icon}
            {label}
        </button>
    );
}
