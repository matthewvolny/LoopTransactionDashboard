import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { NetworkInfo, Obj } from "./models";
import { formatDateTimeFromSeconds } from "./utils/dateTimeConverison";
import { shortenHash } from "./utils/shortenHash";
import { formatSecondsToHrsMinsSecs } from "./utils/secondsToHrsMinsSecs";
import { convertFromSeconds } from "./utils/convertFromSeconds";
import { divideByTokenDecimalPlaces } from "./utils/divideByTokenDecimalPlaces";
import { CollapsibleTable } from "./components/CollapsibleTable";
import { DropdownProcessors } from "./components/DropdownProcessors";
import { DropdownNetworks } from "./components/DropdownNetworks";
import "./App.css";

//hard-coded processors array
const processors: string[] = [
  "0xcbda2f4d091331c5ca4c91ebbf5bd51162edd73e",
  "0x71c56de65f9c0462103c35cc4f64b160a58a9227",
  "0xb7443f7a2333497c7cdca1747a32a9b49160ac11",
  "0x0000000000000000000000000000000000000000",
];

//hard-coded network urls
const networkURLs: NetworkInfo[] = [
  {
    name: "Polygon",
    url: "https://api.thegraph.com/subgraphs/name/loopcrypto/loop-polygon",
  },
  {
    name: "Rinkeby",
    url: "https://api.thegraph.com/subgraphs/name/loopcrypto/loop-rinkeby",
  },
];

//hard-coded token decimal places reference
const tokenDecimalsReference: any = {
  Rinkeby: { "0xeb8f08a975ab53e34d8a0330e0d34de942c95926": 6 }, //USDC
  Polygon: {
    "0x45c32fa6df82ead1e2ef74d17b76547eddfaff89": 18, //FRAX
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": 6, //USDC
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619": 18, //WETH
    "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063": 18, //DAI
    "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6": 8, //"WBTC"
  },
};

function App() {
  const [payments, setPayments] = useState<any>();
  const [processor, setProcessor] = useState<string>(
    "0xcbda2f4d091331c5ca4c91ebbf5bd51162edd73e"
  );
  const [network, setNetwork] = useState<string>(
    "https://api.thegraph.com/subgraphs/name/loopcrypto/loop-polygon"
  );

  // const fetchAlchemyBatchInfo = async (batchId: string) => {
  //   const { ethers } = require("ethers");
  //   const apiKey = "YJ34MEc7XE8whdLnDPRKW1I8e14GGeuB";
  //   const provider = new ethers.providers.AlchemyProvider("matic", apiKey);
  //   // Query the blockchain (for a particular hash)
  //   const receipt = await provider.getTransactionReceipt(batchId);
  //   console.log("RECEIPT:", receipt);
  //   console.log("RECEIPT:", Number(receipt.gasUsed._hex));
  //   let alchemyGasData = {
  //     gasUsed: receipt.gasUsed._hex,
  //     cumulativeGasUsed: receipt.cumulativeGasUsed._hex,
  //     effectiveGasPrice: receipt.effectiveGasPrice._hex,
  //   };
  //   return alchemyGasData;
  // };

  //1
  useEffect(() => {
    console.log("processor: ", processor);
    console.log("network: ", network);
    fetchPaymentInfo(processor, network);
  }, [processor, network]);

  //2
  const fetchPaymentInfo = (processor: string, network: string) => {
    const APIURL = `${network}`;
    const tokensQuery = `
  query {
    successfulPayments (where: {processor: "${processor}"}) {
    transaction
    contractAddress
    processor
    accountProcessed
    processedForDate
    feeAmount
    netAmount
    paymentToken
    createdAt
  }
  failedPayments (where: {processor: "${processor}"}) {
    transaction
    contractAddress
    processor
    accountProcessed
    token
    reason
    createdAt
  }
  subscriptionDetails{
    transaction 
    contractAddress 
    subscriber    
    startDate 
    frequency    
    endDate
    lastPaymentDate
    paymentToken
    paymentTokenSymbol
    subscriptionAmount
  }
  }
`;
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });
    client
      .query({
        query: gql(tokensQuery),
      })
      .then(async (data) => {
        let detailedPaymentData = addSubscriptionDataToPayments(data.data);
        //console.log("detailedPaymentData", detailedPaymentData);
        let paymentBatches = await createPaymentBatchesObject(
          detailedPaymentData
        );
        //console.log("paymentBatches", paymentBatches);
        // console.log(
        //   "formatted for table",
        //   formatPaymentsForTable(paymentBatches, detailedPaymentData)
        // );
        setPayments(
          formatPaymentsForTable(paymentBatches, detailedPaymentData)
        );
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
  };

  //adds subscription data properties to successful and failed payments - used a 'lookup table
  const addSubscriptionDataToPayments = (data: any) => {
    const subscriptions: any = {};

    data.subscriptionDetails.forEach((subscription: any) => {
      subscriptions[
        `${subscription.contractAddress}-${subscription.subscriber}`
      ] = subscription;
    });

    const addSubscriptionDetailsToSuccessfulAndFailedPayments = (
      paymentsArray: any,
      subscriptions: any
    ) => {
      return paymentsArray.map((payment: any) => {
        let subscriptionIdentifier = `${payment.contractAddress}-${payment.accountProcessed}`;

        if (subscriptions[subscriptionIdentifier]) {
          const {
            startDate,
            frequency,
            endDate,
            lastPaymentDate,
            paymentToken,
            paymentTokenSymbol,
            subscriptionAmount,
          } = subscriptions[subscriptionIdentifier];
          return {
            ...payment,
            startDate,
            frequency,
            endDate,
            lastPaymentDate,
            paymentToken,
            paymentTokenSymbol,
            subscriptionAmount,
          };
        } else {
          return payment;
        }
      });
    };

    const detailedSuccessfulPaymentsData =
      addSubscriptionDetailsToSuccessfulAndFailedPayments(
        data.successfulPayments,
        subscriptions
      );
    const detailedFailedPaymentsData =
      addSubscriptionDetailsToSuccessfulAndFailedPayments(
        data.failedPayments,
        subscriptions
      );

    return {
      successfulPayments: detailedSuccessfulPaymentsData,
      failedPayments: detailedFailedPaymentsData,
    };
  };

  //create payment batches array (includes batches with successful and failed payments)
  const createPaymentBatchesObject = async (detailedPaymentData: any) => {
    console.log("detailedpaymentData:", detailedPaymentData);

    let batches: any = [];
    let batchCount: Obj = {};

    const addBatchesToArray = async (payments: any) => {
      for (const payment of payments) {
        // payments.forEach(async (payment: any) => {
        let batchId = payment.transaction;
        // let alchemyGasData = await fetchAlchemyBatchInfo(batchId);
        // console.log(
        //   "alchemygas data: ",
        //   alchemyGasData.gasUsed,
        //   alchemyGasData.cumulativeGasUsed,
        //   alchemyGasData.effectiveGasPrice
        // );
        if (!batchCount[batchId]) {
          batchCount[batchId] = 1;
          batches.push({
            transaction: { label: batchId, value: batchId },
            createdAt: {
              label: formatDateTimeFromSeconds(Number(payment.createdAt)),
              value: payment.createdAt,
            },
            contractAddress: {
              label: payment.contractAddress,
              value: payment.contractAddress,
            },
            // gasUsed: {
            //   label: alchemyGasData.gasUsed,
            //   value: alchemyGasData.gasUsed,
            // },
            // cumulativeGasUsed: {
            //   label: alchemyGasData.cumulativeGasUsed,
            //   value: alchemyGasData.cumulativeGasUsed,
            // },
            // effectiveGasPrice: {
            //   label: alchemyGasData.effectiveGasPrice,
            //   value: alchemyGasData.effectiveGasPrice,
            // },
          });
        }
        // });
      }
      // console.log("batches", batches);
    };

    await addBatchesToArray(detailedPaymentData.successfulPayments);
    await addBatchesToArray(detailedPaymentData.failedPayments);

    console.log("batches", batches);

    return batches;
  };

  //map batches, grouping transactions that match the (transaction id - 'batch id')
  // when transaction found matching batchId, add it to 'transactioninfoarray', and at last iteration, add transactionInfoArray to batch object.
  const formatPaymentsForTable = (batches: any, detailedPaymentData: any) => {
    let batchArray = batches.map((batch: any) => {
      //array of successful transactions for the given batchId
      const foundSuccessfulTransactions =
        detailedPaymentData.successfulPayments.filter(
          ({ transaction }: any) => batch.transaction.value === transaction
        );

      //totals the feeAmount collected from each wallet processed in a batch
      let paymentToken = "";
      const sumOfFees = foundSuccessfulTransactions.reduce(
        (accumulator: number, transaction: any) => {
          let sum = accumulator + Number(transaction.feeAmount);
          paymentToken = transaction.paymentToken;
          return sum;
        },
        0
      );
      console.log(sumOfFees);
      console.log(paymentToken);

      let formattedSumOfFees = divideByTokenDecimalPlaces(
        Number(sumOfFees),
        paymentToken,
        networkURLs,
        tokenDecimalsReference,
        network
      );

      const formattedFoundSuccessfulTransactions =
        foundSuccessfulTransactions.map(
          ({
            accountProcessed,
            endDate,
            feeAmount,
            frequency,
            lastPaymentDate,
            netAmount,
            paymentToken,
            paymentTokenSymbol,
            startDate,
            subscriptionAmount,
            createdAt,
            processedForDate,
          }: any) => {
            return [
              {
                name: "accountProcessed",
                label: shortenHash(accountProcessed),
                value: accountProcessed,
              },
              {
                name: "endDate",
                label: formatDateTimeFromSeconds(Number(endDate)),
              },
              {
                name: "feeAmount",
                label: divideByTokenDecimalPlaces(
                  Number(feeAmount),
                  paymentToken,
                  networkURLs,
                  tokenDecimalsReference,
                  network
                ),
                value: feeAmount,
              },
              {
                name: "frequency",
                label: convertFromSeconds(frequency),
                value: frequency,
              },
              {
                name: "lastPaymentDate",
                label: formatDateTimeFromSeconds(Number(lastPaymentDate)),
                value: lastPaymentDate,
              },
              {
                name: "netAmount",
                label: divideByTokenDecimalPlaces(
                  Number(netAmount),
                  paymentToken,
                  networkURLs,
                  tokenDecimalsReference,
                  network
                ),
                value: netAmount,
              },
              {
                name: "paymentTokenSymbol",
                label: paymentTokenSymbol,
                value: paymentTokenSymbol,
              },
              {
                name: "startDate",
                label: formatDateTimeFromSeconds(Number(startDate)),
                value: startDate,
              },
              {
                name: "subscriptionAmount",
                label: divideByTokenDecimalPlaces(
                  Number(subscriptionAmount),
                  paymentToken,
                  networkURLs,
                  tokenDecimalsReference,
                  network
                ),
                value: subscriptionAmount,
              },
              {
                name: "processedForDate",
                label: formatDateTimeFromSeconds(Number(processedForDate)),
                value: processedForDate,
              },
              {
                name: "timeTakenToProcessTransaction",
                label: formatSecondsToHrsMinsSecs(
                  Number(createdAt - processedForDate)
                ),
                value: createdAt - processedForDate,
              },
            ];
          }
        );

      //find failed transactions for a given batchId
      const foundFailedTransactions = detailedPaymentData.failedPayments.filter(
        ({ transaction }: any) => batch.transaction.value === transaction
      );

      const formattedFoundFailedTransactions = foundFailedTransactions.map(
        ({
          accountProcessed,
          endDate,
          frequency,
          lastPaymentDate,
          token, //!called 'paymentToken' in 'successfulPayment' //use like paymentToken
          paymentTokenSymbol,
          startDate,
          subscriptionAmount,
          reason,
        }: any) => {
          return [
            {
              name: "accountProcessed",
              label: shortenHash(accountProcessed),
              value: accountProcessed,
            },
            {
              name: "endDate",
              label: formatDateTimeFromSeconds(Number(endDate)), //throwing error because value = 0
              value: endDate,
            },
            {
              name: "frequency",
              label: convertFromSeconds(frequency),
              value: frequency,
            },
            {
              name: "lastPaymentDate",
              label: formatDateTimeFromSeconds(Number(lastPaymentDate)),
              value: lastPaymentDate,
            },
            {
              name: "paymentTokenSymbol",
              label: paymentTokenSymbol,
              value: paymentTokenSymbol,
            },
            {
              name: "startDate",
              label: formatDateTimeFromSeconds(Number(startDate)),
              value: startDate,
            },
            {
              name: "subscriptionAmount",
              label: divideByTokenDecimalPlaces(
                Number(subscriptionAmount),
                token,
                networkURLs,
                tokenDecimalsReference,
                network
              ),
              value: subscriptionAmount,
            },
            {
              name: "reason",
              label: shortenHash(reason),
              value: reason,
            },
          ];
        }
      );

      // console.log(formattedFoundFailedTransactions);
      return foundSuccessfulTransactions || foundFailedTransactions
        ? {
            ...batch,
            payments: {
              successfulPayments: {
                count: foundSuccessfulTransactions.length,
                totalFeesCollected: formattedSumOfFees,
                heading: [
                  {
                    name: "accountProcessed",
                    label: "Account Processed",
                    sortable: "y",
                  },
                  { name: "endDate", label: "End Date", sortable: "y" },
                  { name: "feeAmount", label: "Fee", sortable: "y" },
                  { name: "frequency", label: "Frequency", sortable: "y" },
                  {
                    name: "lastPaymentDate",
                    label: "Last Payment Date",
                    sortable: "y",
                  },
                  { name: "netAmount", label: "Net Amount", sortable: "y" },
                  {
                    name: "paymentTokenSymbol",
                    label: "Payment Token Symbol",
                    sortable: "y",
                  },
                  { name: "startDate", label: "Start Date", sortable: "y" },
                  {
                    name: "subscriptionAmount",
                    label: "Subscription Amount",
                    sortable: "y",
                  },
                  {
                    name: "processedForDate",
                    label: "Processed For Date",
                    sortable: "y",
                  },
                  {
                    name: "timeTakenToProcessTransaction",
                    label: "Time To Process Transaction",
                    sortable: "y",
                  },
                ],
                paymentsArray: formattedFoundSuccessfulTransactions,
              },
              failedPayments: {
                count: foundFailedTransactions.length,
                heading: [
                  {
                    name: "accountProcessed",
                    label: "Account Processed",
                    sortable: "y",
                  },
                  { name: "endDate", label: "End Date", sortable: "y" },
                  { name: "frequency", label: "Frequency", sortable: "y" },
                  {
                    name: "lastPaymentDate",
                    label: "Last Payment Date",
                    sortable: "y",
                  },
                  {
                    name: "token",
                    label: "Payment Token Symbol",
                    sortable: "y",
                  }, //!called 'paymentToken' in 'successfulPayment'
                  { name: "startDate", label: "Start Date", sortable: "y" },
                  {
                    name: "subscriptionAmount",
                    label: "Subscription Amount",
                    sortable: "y",
                  },
                  { name: "reason", label: "Reason", sortable: "y" },
                ],
                paymentsArray: formattedFoundFailedTransactions,
              },
            },
          }
        : batch;
    });
    console.log("BATCH-ARRAY", batchArray);

    //add headings
    const dataFormattedForTable = {
      headings: {
        batchHeadings: [
          { name: "transaction", label: "Transaction Hash", sortable: "y" },
          // { name: "processedForDate", label: "Date Processed", sortable: "y" },
          { name: "createdAt", label: "Date (Block Timestamp)", sortable: "y" },
          { name: "contractAddress", label: "Contract Address", sortable: "y" },
          {
            name: "count(successful)",
            label: "Successful Transactions",
            sortable: "y",
          },
          {
            name: "count(failed)",
            label: "Failed Transactions",
            sortable: "y",
          },
          {
            name: "totalFeesCollected",
            label: "Total Fees Collected",
            sortable: "y",
          },
        ],
      },
      batchData: batchArray,
    };
    // console.log("DATAFORMATTEDFORTABLE", dataFormattedForTable);
    return dataFormattedForTable;
  };

  return (
    <div className="app-container">
      <div className="first-dropdown-label">Select Processor</div>
      <DropdownProcessors
        processors={processors}
        processor={processor}
        setProcessor={setProcessor}
      />
      <div className="second-dropdown-label">Select Network</div>
      <DropdownNetworks
        networkURLs={networkURLs}
        network={network}
        setNetwork={setNetwork}
      />
      <CollapsibleTable payments={payments} />
    </div>
  );
}

export default App;
