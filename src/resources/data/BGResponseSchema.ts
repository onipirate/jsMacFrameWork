export const applicationsResponseSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    status: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  additionalProperties: false,
  required: ['name', 'status', 'createdAt', 'updatedAt']
};

export const authorizationResponseSchema = {
  type: 'object',
  properties: {
    authId: { type: 'string' },
    status: { type: 'string' },
    vendorReference: { type: 'string' },
    vendorName: { type: 'string' }
  },
  additionalProperties: false,
  required: ['authId', 'status', 'vendorReference', 'vendorName']
};

export const sessionsIdResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    sessionId: { type: 'string' },
    vendorName: { type: 'string' },
    vendorMerchantId: { type: 'string' },
    vendorSessionPayload: { type: 'string' },
    applicationPaymentTokenId: { type: 'string' },
    billingToken: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' },
    status: { type: 'string' }
  },
  required: [
    'id',
    'sessionId',
    'vendorName',
    'vendorMerchantId',
    'vendorSessionPayload',
    'applicationPaymentTokenId',
    'billingToken',
    'timestamp',
    'status'
  ],
  additionalProperties: false
};

export const sessionsIdResponseDeletedSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' }
  },
  required: ['status'],
  additionalProperties: false
};

export const sessionsResponseSchema = {
  type: 'object',
  properties: {
    applicationSessions: { type: 'array' }
  },
  required: ['applicationSessions'],
  additionalProperties: false
};

export const applicationSessionsSchema = {
  type: 'object',
  properties: {
    sessionId: { type: 'string' },
    billingToken: { type: 'string' },
    applicationName: { type: 'string' },
    billingProgramId: { type: 'string' },
    vendorName: { type: 'string' },
    vendorMerchantId: { type: 'string' },
    status: { type: 'string' },
    sessionType: { type: 'string' },
    expiration: { type: 'string', format: 'date-time' },
    vendorSessionPayload: { type: 'object' },
    sourceDetails: { type: 'object' },
    claimId: { type: ['string', 'null'] },
    legacyPayload: { type: ['string', 'null'] },
    remainingTokenizationAttempts: { type: ['integer', 'null'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: [
    'sessionId',
    'claimId',
    'billingToken',
    'applicationName',
    'billingProgramId',
    'vendorName',
    'vendorMerchantId',
    'status',
    'sessionType',
    'expiration',
    'vendorSessionPayload',
    'sourceDetails',
    'legacyPayload',
    'remainingTokenizationAttempts',
    'createdAt',
    'updatedAt'
  ],
  additionalProperties: false
};
export const getTransactionByIDResponseSchema = {
  type: 'object',
  properties: {
    getTransactionByIdResponse: {
      type: 'object',
      properties: {
        getTransactionByIdRspn: {
          type: 'object',
          properties: {
            response_code: { type: 'string' },
            transactionDetailList: {
              type: 'object',
              properties: {
                ArrayOfBillingTransactionDetailItem: {
                  type: 'object',
                  properties: {
                    order_no: { type: 'string' },
                    transaction_id: { type: 'string' },
                    transaction_date: { type: 'string' },
                    response_code: { type: 'string' },
                    avsResult: { type: 'string' },
                    cardSaved: { type: 'boolean' },
                    transaction_amount: { type: 'string' },
                    cardType: { type: 'string' },
                    bankAcctType: { anyOf: [{ type: 'string' }, { type: 'null' }] },
                    cardExpDate: { type: 'string' },
                    ccFraudCode: { type: 'string' },
                    cardFirstName: { type: 'string' },
                    pciToken: { type: 'string' },
                    billing_account_no: { type: 'string' },
                    cardLastFourDigit: { type: 'string' },
                    paymentCardType: { type: 'string' },
                    cvvResult: { type: 'string' },
                    response_message: { type: 'string' },
                    cardLastName: { type: 'string' },
                    ccFraudResult: { type: 'string' },
                    vendorTransactionId: { anyOf: [{ type: 'string' }, { type: 'null' }] },
                    status: { type: 'string' }
                  },
                  additionalProperties: false,
                  required: [
                    'order_no',
                    'transaction_id',
                    'transaction_date',
                    'response_code',
                    'avsResult',
                    'cardSaved',
                    'transaction_amount',
                    'cardType',
                    'bankAcctType',
                    'cardExpDate',
                    'ccFraudCode',
                    'cardFirstName',
                    'pciToken',
                    'billing_account_no',
                    'cardLastFourDigit',
                    'paymentCardType',
                    'cvvResult',
                    'response_message',
                    'cardLastName',
                    'ccFraudResult',
                    'vendorTransactionId',
                    'status'
                  ]
                }
              },
              additionalProperties: false,
              required: ['ArrayOfBillingTransactionDetailItem']
            },
            response_message: { type: 'string' },
            status: { type: 'string' }
          },
          additionalProperties: false,
          required: ['response_code', 'transactionDetailList', 'response_message', 'status']
        }
      },
      additionalProperties: false,
      required: ['getTransactionByIdRspn']
    }
  },
  additionalProperties: false,
  required: ['getTransactionByIdResponse']
};

export const getSecurityTokenResponseSchema = {
  type: 'object',
  properties: {
    getSecurityTokenResponse: {
      type: 'object',
      properties: {
        getSecurityTokenResponse: {
          type: 'object',
          properties: {
            returnCode: {
              type: 'string'
            },
            returnMsg: {
              type: 'string'
            },
            encryptionKey: {
              type: 'string'
            },
            status: {
              type: 'string'
            },
            token: {
              type: 'string'
            }
          },
          additionalProperties: false,
          required: ['returnCode', 'returnMsg', 'encryptionKey', 'status', 'token']
        }
      },
      additionalProperties: false,
      required: ['getSecurityTokenResponse']
    }
  },
  additionalProperties: false,
  required: ['getSecurityTokenResponse']
};

export const collectPaymentResponseSchema = {
  type: 'object',
  properties: {
    collectPaymentResponse: {
      type: 'object',
      properties: {
        collectPaymentRspn: {
          type: 'object',
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
              properties: {
                ArrayOfSubResponseTypeItem: {
                  type: 'object',
                  properties: {
                    subResponseMessage: { type: 'string' },
                    subResponseCode: { type: 'string' }
                  },
                  required: ['subResponseMessage', 'subResponseCode'],
                  additionalProperties: false
                }
              },
              required: ['ArrayOfSubResponseTypeItem'],
              additionalProperties: false
            },
            vendorName: { type: 'string' },
            transactionId: { type: 'string' },
            status: { type: 'string' }
          },
          additionalProperties: false,
          required: [
            'returnCode',
            'returnMsg',
            'orderNo',
            'avsResult',
            'ccFraudResult',
            'vendorTxnId',
            'ccFraudCode',
            'subResponseList',
            'vendorName',
            'transactionId',
            'status'
          ]
        }
      },
      additionalProperties: false,
      required: ['collectPaymentRspn']
    }
  },
  additionalProperties: false,
  required: ['collectPaymentResponse']
};
