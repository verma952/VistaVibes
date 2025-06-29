// src/components/ImageCard.jsx
export default function ImageCard({ image }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl overflow-hidden transition-all">
      <img
        src={image.url}
        alt={image.title}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h2 className="font-medium text-lg text-gray-800 truncate">{image.title}</h2>
      </div>
    </div>
  );
}
