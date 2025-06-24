import Navbar from "../components/navbar";
import { useGetDishes } from "../hooks/useDishes";
import { GridLayout } from "../layouts/grid-layout";

export const Home = () => {
  const { dishes, loading, error } = useGetDishes();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div>
        <GridLayout card={dishes.data} title="Delicious Dishes" />
      </div>
    </>
  );
};
