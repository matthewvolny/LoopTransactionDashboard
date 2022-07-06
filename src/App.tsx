import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import "./App.css";
import { SuccessfulPayments, FormattedSuccessfulPayments } from "./models";
import { formatDateTimeFromSeconds } from "./utils/dateTimeConverison";
import { Table } from "./components/Table";

function App() {
  const [successfulPayments, setSuccessfulPayments] = useState<
    FormattedSuccessfulPayments[]
  >([]);

  //1
  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  //2
  const fetchSubscriptionInfo = () => {
    const APIURL =
      "https://api.thegraph.com/subgraphs/name/loopcrypto/loop-polygon";

    const tokensQuery = `
  query {
    successfulPayments (where: { processor: "0xcbda2f4d091331c5ca4c91ebbf5bd51162edd73e" }) {
    transaction
    contractAddress
    processor
    accountProcessed
    processedForDate
    feeAmount
    netAmount
    paymentToken
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
      .then((data) => {
        console.log(data.data.successfulPayments);
        let successfulPayments = data.data.successfulPayments;
        let formattedSuccessfulPayments = successfulPayments.map(
          (transaction: SuccessfulPayments) => {
            return formatSuccessfulPaymentsData(transaction);
          }
        );
        console.log(formattedSuccessfulPayments);
        setSuccessfulPayments(formattedSuccessfulPayments);
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
  };

  //3
  const formatSuccessfulPaymentsData = (transaction: SuccessfulPayments) => {
    // format 'processedForDate'
    let formattedProcessedForDate = formatDateTimeFromSeconds(
      Number(transaction.processedForDate)
    );

    return {
      accountProcessed: {
        label: "accountProcessed",
        value: transaction.accountProcessed,
      },
      contractAddress: {
        label: "contractAddress",
        value: transaction.contractAddress,
      },
      feeAmount: { label: "feeAmount", value: transaction.feeAmount },
      netAmount: { label: "netAmount", value: transaction.netAmount },
      paymentToken: { label: "paymentToken", value: transaction.paymentToken },
      processedForDate: {
        label: "processedForDate",
        value: formattedProcessedForDate,
      },
      processor: { label: "processor", value: transaction.processor },
      transaction: { label: "transaction", value: transaction.transaction },
    };
  };

  return (
    <div>
      <div>Transaction Data</div>
      <div>Polygon Network</div>
      <Table data={successfulPayments} />
    </div>
  );
}

export default App;
