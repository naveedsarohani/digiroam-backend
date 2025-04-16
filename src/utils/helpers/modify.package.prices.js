const modifyPackagePrices = (result) => {
  result.packageList.forEach((pkg) => {
    pkg.price = pkg.price / 10000;
    pkg.retailPrice = pkg.retailPrice / 10000;
  });

  return result;
};

export default modifyPackagePrices;