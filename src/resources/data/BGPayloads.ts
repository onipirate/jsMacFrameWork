import * as Chance from 'chance';
const chance = Chance.default();

export const appsPayload = {
  name: `VERIZON${chance.integer()}`
};

export const sessionsPayload = {
  billingProgramId: 'VERIZON-HORIZON-AGENT-US',
  sessionType: 'FORM_ENCRYPTION',
  sourceDetails: {
    paymentAmount: {
      currency: 'USD'
    }
  }
};

export const tokensPayload = {
  paymentData: {
    encryptedCustomerInput:
      'adyenjs_0_1_24$X9cuREG26nsGdzZpmZLIecH87NU3FQwzXNvBqVTh7a3SyQQfIluigTYLdXUqcdV5A+cZqGWQY++ieT5w54YD5Xm4T4MzcGLohBjeFveiCJqDKSojiwnWSkfppAW3a/hQP1atdeT87U5bN8kvU1X1PDEdqELwziEwktgEh0Uen/k8BQwh4XcS7wPiWVtsRmKBTFfj8i97kqYUf1wL/z64tPzbMa6bYCDNoRXY0wV/AznHQy22USfiwColBccRhnL/Fm990fULQ7jSmb/2GG1GNEC8iYAAh9XqtuRk0xnuczCvmdPhbHcBjPDyUUSfuL/QayNoM+YlD7RHiWugZtkx1g==$ak6luMikSyvkiWbj6S9QZ4sungoMa6K0qh90D6EGa1pM0agBBnApwkVllroz326LC69CCzdJRXPsw94IDvu2q3itzzuuHeLeIz9uGGJoE/jF3DOgeooutX9d1S9Agakuypp7Vr3CSOYMMHRlcd946hF8xMbjLXADbdNLxgR6ezSLdRxoHduWe1QFphlPsoyIR4dIE1uxHyswOzUjo3Tfq6kfFoK1WK80I39yl7I6fU1Ece2KTt9VkGEU0VOrJdusxDesRuzjo0QN5+Zx4Di0wdSWyx2UUgPIoKeLk5hh/Q=='
  }
};

export const authsAndPaymentsPayload = {
  currency: 'USD',
  amount: 1000
};

export const refundPayload = {
  appAuthKey: '3bca304bb71f8525f09ad5ae86868133',
  billingProgramId: 'VERIZON-HORIZON-AGENT-US',
  amount: 1000,
  currency: 'USD',
  sourceDetails: {
    application: `${appsPayload.name}`,
    channel: 'AGENT',
    client: 'Verizon',
    culture: 'en-US',
    lineOfBusiness: 'DeviceProtection',
    reference: 'Q5N97X652ZSKGK82',
    userReference: 'qp28a3x8q07we5murw3n9r47w2vxvu'
  }
};

export const cancelPayload = {
  appAuthKey: '3bca304bb71f8525f09ad5ae86868133',
  billingProgramId: 'VERIZON-HORIZON-AGENT-US'
};

export const sessionsEcheckPayload = {
  billingProgramId: 'TEST-INGENICO-US',
  sessionType: 'FORM_ENCRYPTION',
  sourceDetails: {
    paymentAmount: {
      currency: 'USD',
      amount: 1
    },
    cancelAfterMinutes: 180
  }
};

export const tokensEcheckPayload = {
  paymentData: {
    encryptedCustomerInput:
      '{"bankAccountNumber": "123456789","bankRoutingNumber": "1234567","driverLicenseNumber": "987654321","driverLicenseIssuingState": "CA","checkNumber": "1680626591504"}',
    billingContact: {
      name: { first: 'Axel', last: 'Foley' },
      address: {
        address1: 'Beverly Palm Hotel',
        city: 'Beverly Hills',
        state: 'CA',
        country: 'US',
        zip: '90210'
      },
      contactInfo: { phone: '8008675309', email: 'noreply@example.com' }
    },
    userReference: 'userReference134444',
    paymentType: 'ECHECK',
    shopperReference: 'shopperReference134444'
  },
  userReference: 'userReference'
};

export const securityTokenPayload = {
  getSecurityToken: {
    getSecurityTokenRequest: {
      version: '4.5',
      billingProgramId: 'SERVICEBENCH-LICENSE-AGENT-US',
      appAuthKey: '09cca05607d0338d6de58fd4dce1cd89',
      txnAmt: '0',
      currency: 'USD',
      captureDelayMinutes: 480,
      txnType: 'PCITOKEN',
      txnReference: chance.guid(),
      txnComment1: 'SERVICEBENCH-LICENSE-AGENT-US',
      txnComment2: 'PORTAL|WEB|en-US|Retail|Asurion Mobility',
      liveMinutes: 60,
      customerId: null,
      sourceReferenceNumber: null,
      rtnURL: ' '
    }
  }
};

const randNum = () => {
  return chance.integer({ min: 1000000, max: 9999999 });
};
export const collectPaymentPayload = {
  collectPayment: {
    collectPaymentReq: {
      version: '4.5',
      billingProgramId: 'SERVICEBENCH-LICENSE-AGENT-US',
      appAuthKey: '09cca05607d0338d6de58fd4dce1cd89',
      totalAmount: '25.74',
      currency: 'USD',
      payMethod: {
        pciToken: '11ewlzxtphkd1mv0rm16l8stqbjqol',
        cardRef: '1e1vbuu0wmb5vvjdzulug1cve37p11'
      },
      captureAfterMinutes: '0',
      paymentType: 'F',
      sourceOrderNo: `${randNum()}|${randNum()}|PREM`,
      customerId: '175526854',
      flexField1: '0fEue3Hn9mmV9FaA9',
      flexField2: 'PORTAL|WEB|en-US|Retail|Asurion Mobility',
      flexField3: '174860312056'
    }
  }
};

export const refundl7Payload = {
  refund: {
    refundReq: {
      version: '4.5',
      billingProgramId: 'SERVICEBENCH-LICENSE-AGENT-US',
      appAuthKey: '09cca05607d0338d6de58fd4dce1cd89',
      amount: '25.74',
      currency: 'USD',
      origId: 'l541153ciowfhlvp23pneee0k00a7c',
      refundTransId: `${collectPaymentPayload.collectPayment.collectPaymentReq.sourceOrderNo}`,
      flexField1: '883639235804438B',
      flexField2: 'iGlobis|Agent|en-US|Retail|Asurion HomePlus'
    }
  }
};

export const creditCardAuthPayload = {
  creditCardAuth: {
    creditCardAuthReq: {
      version: '4.5',
      billingProgramId: 'SERVICEBENCH-LICENSE-AGENT-US',
      appAuthKey: '09cca05607d0338d6de58fd4dce1cd89',
      currency: 'USD',
      sourceOrderNo: '61234129|2384873|PREM',
      totalAmount: 25.74,
      billingAccountNo: '703487',
      pciToken: '11ewlzxtphkd1mv0rm16l8stqbjqol',
      cardNumber: '4000620000000007',
      cardExpirationDate: '03/2030',
      cardType: 'VISA',
      flexField1: '0fEue3Hn9mmV9FaA9',
      flexField2: 'PORTAL|WEB|en-US|Retail|Asurion Mobility',
      avsFlag: 'false',
      validateCVV: 'false',
      customerId: '175526854',
      billingContact: {
        firstName: 'John',
        middleInitial: 'D',
        lastName: 'Doe',
        companyName: 'Asurion',
        address2: '22894 Pacific Blvd',
        locality: 'Sterling',
        city: 'Sterling',
        state: 'VA',
        zip: '20170',
        country: 'USA'
      },
      order: {}
    }
  }
};

export const getTransactionByIdPayload = {
  getTransactionById: {
    getTransactionByIdReq: {
      version: '4.5',
      billingProgramId: 'CONSUMER_CELLULAR-HORIZON-PORTAL-US',
      appAuthKey: '3bca304bb71f8525f09ad5ae86868133',
      transType: 'pcitoken',
      srcTransactionId: '62807028-d40f-4886-8cfb-8bb2b7fe410b',
      successTxnOnly: 'true',
      flexField1: '1495559098',
      flexField2: 'Horizon|Web|en-US|DeviceProtection|Sprint'
    }
  }
};

export const cancelCreditCardAuthPayload = {
  cancelCreditCardAuth: {
    cancelCreditCardAuthReq: {
      version: '4.5',
      billingProgramId: 'SERVICEBENCH-LICENSE-AGENT-US',
      appAuthKey: '09cca05607d0338d6de58fd4dce1cd89',
      cardAuthTransactionId: '00xnj88nbzyt0s39wbcin47gvpwlro',
      sourceOrderNo: '61234129|2384873|PREM',
      flexField1: '0fEue3Hn9mmV9FaA9',
      flexField2: 'PORTAL|WEB|en-US|Retail|Asurion Mobility',
      flexField3: 'flexField3',
      customerId: '11262020008',
      reasonCode: '0',
      reasonDescription: 'testing'
    }
  }
};

const dateToday = new Date().toISOString().split('T')[0];
export const mdnPayload = {
  CreateEnrollmentParameters: {
    EnrollmentSeverity: 'none',
    TransactionDate: dateToday,
    ClientAccountType: 'INDVL',
    ClientAccountStatus: 'ACTV',
    ClientAccountStartDate: dateToday,
    ClientChannelId: '4ECA222A37B63627E0536138060AB356',
    AccountNumber: '',
    PaymentResp: 'IRU',
    AccountAttributes: {
      StagingPreference: 'XML And DB',
      Mdn: '',
      MdnDigits: '',
      IvrEligibleMdn: false,
      MultiDevicePlan: false,
      Pin: '1234',
      WarrantyDate: '',
      Ssn: '',
      TaxID: ''
    },
    AgreementList: [
      {
        Agreement: {
          AgreementStatus: 'ACTV',
          ClientProductSKUNumber: 'LP1BTIER1',
          SubscriptionNumber: '',
          ExternalReferenceId: '',
          AgreementPurchase: { RetailSKU: 'LP1BTIER1', PurchaseDate: '' },
          Address: {
            BusinessName: '',
            AddressLine1: '5970 Hicks Rd',
            AddressLine2: '',
            AddressLine3: '',
            Country: 'US',
            City: 'Naples',
            State: 'NY',
            PostalCode: '14512',
            AddressUsage: { UsageType: 'BLNG', StartDate: '' }
          },
          CustomerList: [
            {
              Customer: {
                FullName: 'Jessica ATT',
                LastName: 'ATT',
                FirstName: 'Jessica',
                PreferredLanguage: 'en-US',
                CustomerRoleList: [{ CustomerRole: { CustomerRoleType: 'PRMRY', StartDate: '' } }]
              }
            }
          ],
          AssetList: [
            {
              Asset: {
                AssetStatus: 'ACTV',
                AssetCondition: 'NEW',
                AssetStartDate: dateToday,
                PurchaseDate: dateToday,
                AssetSubscriptionNumber: '',
                MobileDeviceNumber: '',
                MobileEquipmentId: '',
                AssetInstance: 'ENROLLED',
                CountryCallingCode: '',
                AssetSKUNumber: '0209TEST_SKU',
                AssetPurchase: {
                  RetailSKU: 'LP1BTIER1',
                  RetailMake: 'Apple',
                  RetailModel: 'iPhone 11 128GB',
                  AssetColor: 'Black',
                  SalesPersonName: 'ASURION',
                  StoreCode: 'Z0066',
                  Region: '',
                  PurchaseDate: ''
                },
                AgreementAssetAssociation: { StartDate: dateToday },
                AssetAttributeList: [
                  {
                    AssetAttribute: {
                      AttributeStartDate: dateToday,
                      AttributeValueId: '',
                      AttributeId: '',
                      AttributeValue: ''
                    }
                  }
                ]
              }
            }
          ],
          ContactPointList: [
            {
              ContactPoint: {
                ContactPointType: 'EMAIL',
                EmailAddress: 'test@test.com',
                ContactPointStatus: 'ACTV',
                CountryCallingCode: '',
                PhoneNumber: '',
                ContactPointUsage: { ReferenceType: 'AGRMNT', UsageType: 'DFLT', IsPrimary: true }
              }
            },
            {
              ContactPoint: {
                ContactPointType: 'MOBILE',
                ContactPointStatus: 'ACTV',
                CountryCallingCode: '',
                PhoneNumber: '',
                ContactPointUsage: { ReferenceType: '', UsageType: '', IsPrimary: false }
              }
            }
          ]
        }
      }
    ]
  }
};
