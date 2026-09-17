export const ORDER_STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered'];

export const statusStyles = {
  Delivered: 'bg-accent/10 text-accent',
  Shipped: 'bg-primary/10 text-primary',
  Processing: 'bg-secondary/10 text-amber-600',
  Placed: 'bg-gray-200 text-gray-600',
};

export const getOrderStatus = (order) => {
  if (order.status && ORDER_STATUSES.includes(order.status)) return order.status;
  const dayMs = 24 * 60 * 60 * 1000;
  const ageDays = (Date.now() - new Date(order.date).getTime()) / dayMs;
  if (ageDays >= 3) return 'Delivered';
  if (ageDays >= 2) return 'Shipped';
  if (ageDays >= 1) return 'Processing';
  return 'Placed';
};