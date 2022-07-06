import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Payments } from "./models";
import { formatDateTimeFromSeconds } from "./utils/dateTimeConverison";
import { Table } from "./components/Table";
import { Dropdown } from "./components/Dropdown";
import { PaymentTypeSelector } from "./components/PaymentTypeSelector";
import "./App.css";

function App() {
  const [successfulPayments, setSuccessfulPayments] = useState<Payments>();
  const [failedPayments, setFailedPayments] = useState<Payments>();
  const [processor, setProcessor] = useState<string>(
    "0xcbda2f4d091331c5ca4c91ebbf5bd51162edd73e"
  );
  const [network, setNetwork] = useState<string>(
    "https://api.thegraph.com/subgraphs/name/loopcrypto/loop-polygon"
  );

  //1
  useEffect(() => {
    fetchPaymentInfo(processor, network);
  }, [processor]);

  const headings = {
    successfulPaymentHeadings: [
      { label: `transaction`, sortable: true },
      { label: `contractAddress`, sortable: true },
      { label: `processor`, sortable: true },
      { label: `accountProcessed`, sortable: true },
      { label: `processedForDate`, sortable: true },
      { label: `feeAmount`, sortable: true },
      { label: `netAmount`, sortable: true },
      { label: `paymentToken`, sortable: true },
    ],
    failedPaymentHeadings: [
      { label: `transaction`, sortable: true },
      { label: `contractAddress`, sortable: true },
      { label: `processor`, sortable: true },
      { label: `accountProcessed`, sortable: true },
      { label: `token`, sortable: true },
      { label: `reason`, sortable: true },
    ],
  };

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
  }
  failedPayments (where: {processor: "${processor}"}) {
    transaction
    contractAddress
    processor
    accountProcessed
    token
    reason
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
        console.log(data.data); //successful and failed payments
        let successfulPayments = data.data.successfulPayments;
        let failedPayments = data.data.failedPayments;
        setSuccessfulPayments({
          headings: headings.successfulPaymentHeadings,
          records: successfulPayments.map((transaction: any) => {
            return formatSuccessfulPayments(transaction);
          }),
        });
        setFailedPayments({
          headings: headings.failedPaymentHeadings,
          records: failedPayments.map((transaction: any) => {
            return formatFailedPayments(transaction);
          }),
        });
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
  };

  //3
  const formatSuccessfulPayments = (transaction: any) => {
    //formats 'processedForDate' value
    let formattedProcessedForDate = formatDateTimeFromSeconds(
      Number(transaction.processedForDate)
    );

    return {
      id: Math.floor(Math.random() * 1000000000),
      values: [
        {
          label: `transaction`,
          value: transaction.transaction,
        },
        {
          label: `contractAddress`,
          value: transaction.contractAddress,
        },
        {
          label: `processor`,
          value: transaction.processor,
        },
        {
          label: `accountProcessed`,
          value: transaction.accountProcessed,
        },
        {
          label: `processedForDate`,
          value: formattedProcessedForDate,
        },
        {
          label: `feeAmount`,
          value: transaction.feeAmount,
        },
        {
          label: `netAmount`,
          value: transaction.netAmount,
        },
        {
          label: `paymentToken`,
          value: transaction.paymentToken,
        },
      ],
    };
  };

  //4
  const formatFailedPayments = (transaction: any) => {
    //formats 'processedForDate' value
    let formattedProcessedForDate = formatDateTimeFromSeconds(
      Number(transaction.processedForDate)
    );

    return {
      id: Math.floor(Math.random() * 1000000000),
      values: [
        {
          label: `transaction`,
          value: transaction.transaction,
        },
        {
          label: `contractAddress`,
          value: transaction.contractAddress,
        },
        {
          label: `processor`,
          value: transaction.processor,
        },
        {
          label: `accountProcessed`,
          value: transaction.accountProcessed,
        },
        {
          label: `token`,
          value: formattedProcessedForDate,
        },
        {
          label: `reason`,
          value: transaction.feeAmount,
        },
      ],
    };
  };

  return (
    <div>
      <div>
        <div>What would you like to query?</div>
        {/* <PaymentTypeSelector fetchPaymentInfo={fetchPaymentInfo} /> */}
        <span>Choose processor</span>
        <Dropdown setProcessor={setProcessor} />
        <span>from</span>
        <span>Network (Polygon)</span>
      </div>
      {processor ? (
        <Table data={successfulPayments} />
      ) : (
        <div>Enter processor and network</div>
      )}
    </div>
  );
}

export default App;
