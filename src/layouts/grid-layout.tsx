import { Card } from "../components/card";
import type { CardInterface } from "../interfaces/card.interface";

export const GridLayout = ({ card, title = ""}: { card: CardInterface[], title: string }) => {
  return  (
  <div className="bg-gray-50 min-h-screen">
      {/* Container principal */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{title}</h1>

        {/* Grid responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {card.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
