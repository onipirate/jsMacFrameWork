export const bgBillingTokenFields = [
  'billingToken',
  'applicationName',
  'billingProgramId',
  'vendorName',
  'vendorMerchantId',
  'vendorToken',
  'vendorTokenPriority',
  'paymentType',
  'billingContact',
  'customerId',
  'originator',
  'createdAt',
  'updatedAt'
];

export const bgApplicationsSessionsFields = [
  'sessionId',
  'billingToken',
  'applicationName',
  'billingProgramId',
  'vendorName',
  'vendorMerchantId',
  'status',
  'sessionType',
  'expiration',
  'remainingTokenizationAttempts',
  'vendorSessionPayload',
  'sourceDetails',
  'claimId',
  'legacyPayload',
  'createdAt',
  'updatedAt'
];

export const bgAuthsFields = [
  'authId',
  'billingToken',
  'amount',
  'currency',
  'vendorReference',
  'vendorName',
  'vendorMerchantId',
  'userReference',
  'status',
  'cancelAfterMinutes',
  'captureAfterMinutes',
  'sourceDetails',
  'legacyPayload',
  'vendorResultDetails',
  'createdAt',
  'updatedAt',
  'cancelAuthMinutesAt',
  'captureAuthMinutesAt'
];

export const bgPaymentsFields = [
  'paymentId',
  'billingToken',
  'amount',
  'currency',
  'vendorReference',
  'vendorName',
  'vendorMerchantId',
  'userReference',
  'status',
  'isSettled',
  'capturedAuthId',
  'sourceDetails',
  'legacyPayload',
  'vendorResultDetails',
  'createdAt',
  'updatedAt',
  'refundExpiresAt'
];
export const bgCCMetadataFields = [
  'billingToken',
  'vendorName',
  'vendorMerchantId',
  'vendorToken',
  'cardBin',
  'cardSummary',
  'expiryDate',
  'alias',
  'paymentMethod',
  'fundingSource',
  'createdAt',
  'updatedAt'
];
export const bgNetworkTransactionMetadata = ['billingToken', 'networkTransactionReference'];

export const collectPaymentFields = {
  type: 'object',
  additionalproperties: false,
  properties: {
    collectPaymentResponse: {
      type: 'object',
      additionalproperties: false,
      properties: {
        collectPaymentRspn: {
          type: 'object',
          additionalproperties: false,
          properties: {
            returnCode: { type: 'string' },
            returnMsg: { type: 'string' },
            orderNo: { type: 'string' },
            avsResult: { type: 'string' },
            ccFraudResult: { type: 'string' },
            vendorTxnId: { type: 'string' },
            ccFraudCode: { type: 'string' },
            subResponseList: {
              type: 'object',
              additionalproperties: false,
              properties: {
                ArrayOfSubResponseTypeItem: {
                  type: 'object',
                  additionalproperties: false,
                  properties: {
                    subResponseMessage: { type: 'string' },
                    subResponseCode: { type: 'string' }
                  }
                }
              }
            },
            vendorName: { type: 'string' },
            transactionId: { type: 'string' },
            status: { type: 'string' }
          }
        }
      }
    }
  }
};
