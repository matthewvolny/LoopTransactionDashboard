export const divideByTokenDecimalPlaces = (
  num: number,
  paymentToken: string,
  networkURLs: any,
  tokenDecimalsReference: any,
  network: string
) => {
  //get network name
  let currentNetwork = networkURLs.find((networkObj: any) => {
    return networkObj.url === network;
  });
  if (currentNetwork !== undefined) {
    let networkName = currentNetwork.name;
    let decimalPlaces = tokenDecimalsReference[networkName][paymentToken];
    let numDividedByDecimalPlaces = num / 10 ** decimalPlaces;
    return numDividedByDecimalPlaces;
  }
};
