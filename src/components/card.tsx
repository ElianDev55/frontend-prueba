import { useState } from "react";
import type { CardInterface } from "../interfaces/card.interface";

export const Card = ({ item }: { item: CardInterface }) => {

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-square overflow-hidden">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-cyan-600">${item.price}</span>
        </div>
        {/* Descripción con botón "Ver más" */}
        {item.products.length > 0 && (
          <DescriptionWithToggle description={item.products.map((product) => product.name).join(", ")} />
        )}
      </div>
    </div>
  );

  // Componente para mostrar la descripción con "Ver más"
  function DescriptionWithToggle({ description }: { description: string }) {
    const [showMore, setShowMore] = useState(false);
    const maxLength = 80;

    const isLong = description.length > maxLength;
    const shortText = description.slice(0, maxLength);

    return (
      <div className="mt-3 text-gray-600 text-sm">
        {showMore || !isLong ? description : shortText + "..."}
        {isLong && (
          <button
            className="ml-2 text-cyan-600 font-semibold hover:underline focus:outline-none"
            onClick={() => setShowMore((v) => !v)}
            type="button"
          >
            {showMore ? "Ver menos" : "Ver más"}
          </button>
        )}
      </div>
    );
  }
};
