use('test');


db.orders.aggregate([
  {$unwind: "$line_items"},
  {
    $group: {
      "_id": "$line_items.name",
      "qtde": { $sum: "$line_items.quantity" },
    }
  }
]).toArray();