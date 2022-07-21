export const divideByTokenDecimalPlaces = (
  num: number,
  paymentToken: string,
  networkURLs: any,
  tokenDecimalsReference: any,
  network: string
) => {
  console.log(num);
  console.log(paymentToken);
  //get network name
  let currentNetwork = networkURLs.find((networkObj: any) => {
    return networkObj.url === network;
  });
  if (currentNetwork !== undefined) {
    let networkName = currentNetwork.name;
    let decimalPlaces = tokenDecimalsReference[networkName][paymentToken];

    console.log(decimalPlaces);
    let numDividedByDecimalPlaces = num / 10 ** decimalPlaces;
    console.log(numDividedByDecimalPlaces);
    return numDividedByDecimalPlaces;
  }
};
