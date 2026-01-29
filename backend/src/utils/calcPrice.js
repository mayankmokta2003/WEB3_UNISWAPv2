export function calculatePrices(reserve0, reserve1) {
  const r0 = Number(reserve0);
  const r1 = Number(reserve1);

  if (r0 == 0 || r1 == 0) {
    return {
      priceToken0InToken1: "0",
      priceToken1InToken0: "0",
    };
  }

  return {
    priceToken0InToken1: (r1 / r0).toString(),
    priceToken1InToken0: (r0 / r1).toString(),
  };
}
