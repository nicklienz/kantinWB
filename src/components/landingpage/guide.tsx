const stepsOnline = [
	{
		icon: (
			<span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-content rounded-full mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 7h18M3 12h18M3 17h18"
					/>
				</svg>
			</span>
		),
		text: "Pilih menu yang ingin diorder ke dalam keranjang.",
	},
	{
		icon: (
			<span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-content rounded-full mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</span>
		),
		text: "Isi nama, nomor WhatsApp, dan jam pengambilan pesanan.",
	},
	{
		icon: (
			<span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-content rounded-full mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 8v4l3 3"
					/>
				</svg>
			</span>
		),
		text: "Datang ke lokasi sesuai waktu yang dipilih.",
	},
	{
		icon: (
			<span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-content rounded-full mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 17h5m-2.5-2.5V21"
					/>
				</svg>
			</span>
		),
		text: "Cek di web apakah status order sudah siap diambil.",
	},
	{
		icon: (
			<span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-content rounded-full mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z"
					/>
				</svg>
			</span>
		),
		text: "Lakukan pembayaran di kasir dan ambil pesanan Anda.",
	},
];

const stepsOffline = [
	{
		icon: (
			<span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-content rounded-full mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</span>
		),
		text: "Datang langsung ke kasir.",
	},
	{
		icon: (
			<span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-content rounded-full mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.21 0-4-1.79-4-4h8c0 2.21-1.79 4-4 4z"
					/>
				</svg>
			</span>
		),
		text: "Pesan menu yang diinginkan di kasir.",
	},
	{
		icon: (
			<span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-content rounded-full mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</span>
		),
		text: "Lakukan pembayaran dan tunggu pesanan disiapkan.",
	},
	{
		icon: (
			<span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-content rounded-full mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 17h5m-2.5-2.5V21"
					/>
				</svg>
			</span>
		),
		text: "Tunggu notifikasi suara, lalu ambil pesanan Anda di counter.",
	},
];

const Guide = () => {
	return (
		<div
			id="guide"
			className="w-full flex flex-col items-center justify-center p-4"
		>
			<h1 className="text-2xl font-bold mb-4">Panduan Pemesanan</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
				{/* Order Online */}
				<div className="card bg-base-200 shadow-md">
					<div className="card-body">
						<h2 className="card-title mb-4">Order Online</h2>
						<div className="flex flex-col gap-4">
							{stepsOnline.map((step, idx) => (
								<div
									key={idx}
									className="card bg-base-100 shadow flex-row flex items-center gap-4 p-4"
								>
									{step.icon}
									<span className="text-base">{step.text}</span>
								</div>
							))}
						</div>
					</div>
				</div>
				{/* Order On The Spot */}
				<div className="card bg-base-200 shadow-md">
					<div className="card-body">
						<h2 className="card-title mb-4">Order On The Spot</h2>
						<div className="flex flex-col gap-4">
							{stepsOffline.map((step, idx) => (
								<div
									key={idx}
									className="card bg-base-100 shadow flex-row flex items-center gap-4 p-4"
								>
									{step.icon}
									<span className="text-base">{step.text}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Guide;