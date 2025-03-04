const dataPackagesResponse = (result) => {
  result.packageList.forEach((pkg) => {
    pkg.price = pkg.price / 1000;
    pkg.retailPrice = pkg.retailPrice / 1000;
  });

  return result;
};

export { dataPackagesResponse };
