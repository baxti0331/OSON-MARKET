export default function handler(req, res) {
  res.status(200).json([
    {
      category: "Фрукты",
      items: [
        { id: "apple", name: "Яблоки" },
        { id: "banana", name: "Бананы" }
      ]
    },
    {
      category: "Овощи",
      items: [
        { id: "tomato", name: "Помидоры" },
        { id: "cucumber", name: "Огурцы" }
      ]
    }
  ]);
}
