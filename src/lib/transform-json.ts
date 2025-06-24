interface Item {
  id: string;
  price: string;
}

interface TransformJsonInterface {
  dishes?: Item[];
  additional?: Item[];
  chips?: Item[];
  drinks?: Item[];
  sauces?: Item[];
  total: string;
}

export const transformJson = (json: TransformJsonInterface) => {
  const bill = {
    total: json.total,
    created_by: localStorage.getItem('user'),
  };

  const details = [];
  const numDetails = Math.max(
    json.dishes?.length || 0,
    json.additional?.length || 0,
    json.chips?.length || 0,
    json.drinks?.length || 0,
    json.sauces?.length || 0
  );

  for (let i = 0; i < numDetails; i++) {
    let detailTotal = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detail: any = {};

    const dish = json.dishes?.[i];
    if (dish) {
      detail.diches_id = dish.id;
      detailTotal += parseFloat(dish.price);
    }

    const add = json.additional?.[i];
    if (add) {
      detail.add_id = add.id;
      detailTotal += parseFloat(add.price);
    }

    const chip = json.chips?.[i];
    if (chip) {
      detail.chips_id = chip.id;
      detailTotal += parseFloat(chip.price);
    }

    const drink = json.drinks?.[i];
    if (drink) {
      detail.drinks_id = drink.id;
      detailTotal += parseFloat(drink.price);
    }

    const sauce = json.sauces?.[i];
    if (sauce) {
      detail.souces_id = sauce.id;
      detailTotal += parseFloat(sauce.price);
    }

    detail.total = detailTotal.toFixed(2);
    detail.created_by = localStorage.getItem('user');
    details.push(detail);
  }

  return { bill, details };
};
