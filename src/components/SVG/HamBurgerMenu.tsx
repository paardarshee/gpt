export default function HamBurgerMenu() {
	return (
		<svg
			width="26"
			height="26"
			viewBox="0 0 20 20"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			className="icon"
		>
			{/* longest line - thicker */}
			<path d="M3 4H17C17.5523 4 18 4.44772 18 5C18 5.55228 17.5523 6 17 6H3C2.44772 6 2 5.55228 2 5C2 4.44772 2.44772 4 3 4Z" />
			{/* medium line - thicker */}
			<path d="M3 9H13C13.5523 9 14 9.44772 14 10C14 10.5523 13.5523 11 13 11H3C2.44772 11 2 10.5523 2 10C2 9.44772 2.44772 9 3 9Z" />
			{/* shortest line - thicker */}
			<path d="M3 14H9C9.55228 14 10 14.4477 10 15C10 15.5523 9.55228 16 9 16H3C2.44772 16 2 15.5523 2 15C2 14.4477 2.44772 14 3 14Z" />
		</svg>
	);
}
