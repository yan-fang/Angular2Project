export const successfulPaymentModel = {
 headers: {},
 payment: {
 	confirmationCode: "SDDFGCSART",
 	showMissedOnePaymentLink: true,
 	realTimeFunds: {
 		rtfaApproved: false,
 		otbHold: false,
 		availableCredit: "3000",
 		month: "ease.card.payment.makeapayment.rtfa.month.1",
        date: "24"
 	},
      extendedMessages : [
        "ease.card.payment.makeapayment.step3.label.backontrackcheckmark1.text",
        "ease.card.payment.makeapayment.step3.label.newpurchasescheckmark2.text",
        "ease.card.payment.makeapayment.step3.label.nocreditbureaureportcheckmark3.text",
        "ease.card.payment.makeapayment.step3.label.noaffectonaprcheckmark4.text"
      ]
 }
};
