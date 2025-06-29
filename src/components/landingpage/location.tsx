const Location = () => {
  return (
    <div id="location" className="w-full bg-base-100 p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-8 text-center">Alamat</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Wisma Barito 1 */}
        <div className="card bg-base-200 shadow-md">
          <div className="card-body items-center">
            <h3 className="card-title mb-2">Wisma Barito Pacific 1</h3>
            <p className="text-center">Jl. Letjen S. Parman Kav. 62-63, Slipi, Jakarta Barat</p>
            <p className="mb-4 text-center">Lantai Basement, arah pintu keluar</p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d991.123456789012!2d106.80000000000001!3d-6.200000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6a1b1b1b1b1%3A0x1b1b1b1b1b1b1b1b!2sWisma%20Barito%20Pacific!5e0!3m2!1sen!2sid!4v1616161616161"
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Wisma Barito 1"
            ></iframe>
          </div>
        </div>
        {/* Wisma Barito 2 */}
        <div className="card bg-base-200 shadow-md">
          <div className="card-body items-center">
            <h3 className="card-title mb-2">Wisma Barito Pacific 2</h3>
            <p className="text-center">Jl. Letjen S. Parman Kav. 62-63, Slipi, Jakarta Barat (Gedung 2)</p>
            <p className="mb-4 text-center">Lantai Basement, seberang parkir motor</p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d991.987654321098!2d106.80111111111112!3d-6.201111111111112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6a2c2c2c2c2%3A0x2c2c2c2c2c2c2c2c!2sWisma%20Barito%20Pacific%202!5e0!3m2!1sen!2sid!4v1616161616162"
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Wisma Barito 2"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Location;