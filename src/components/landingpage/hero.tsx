const Hero = () => {
  return (
    <div id="hero" className="hero min-h-screen relative">
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://raw.githubusercontent.com/nicklienz/kantinWB/main/assets/videos/kantinwb.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="hero-overlay"></div>
      <div className="hero-content absolute left-0 bottom-20 p-8 flex flex-col items-start text-left z-30">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-content mb-2 drop-shadow-lg">
          Nikmati Beragam Kuliner Lezat & Minuman Segar. Mulai dari 10K Saja!
        </h1>
        <p className="text-lg md:text-2xl mb-4 font-semibold text-primary-content drop-shadow">
          Temukan sensasi makan siang yang berbeda setiap hari. Banyak pilihan menu, harga terjangkau, suasana nyaman, dan promo menarik menanti Anda!
        </p>
        <button className="btn btn-primary px-8 text-lg">Pesan Sekarang</button>
      </div>
    </div>
  );
};
export default Hero;