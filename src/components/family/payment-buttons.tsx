import { useState, useEffect, useCallback } from "react";
import GooglePayButton from "@google-pay/button-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import type { BillingCycle } from "./plan-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { Button } from "../ui/button";

interface PaymentButtonsProps {
    billingCycle: BillingCycle;
    onPaymentSuccess: () => void;
}

const planPrices = {
    monthly: 19.9,
    annually: 199.9,
};

export function PaymentButtons({ billingCycle, onPaymentSuccess }: PaymentButtonsProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [canMakeApplePay, setCanMakeApplePay] = useState(false);

    useEffect(() => {
        // if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
        //     setCanMakeApplePay(true);
        // }
    }, []);

    const handleApplePay = () => {
        // const price = planPrices[billingCycle];
        // const request: ApplePayJS.ApplePayPaymentRequest = {
        //     countryCode: "BR",
        //     currencyCode: "BRL",
        //     merchantCapabilities: ["supports3DS"],
        //     supportedNetworks: ["visa", "masterCard", "elo"],
        //     total: {
        //         label: t("plan_form_premium_title"),
        //         amount: price.toFixed(2),
        //     },
        // };

        // const session = new ApplePaySession(1, request);

        // session.onvalidatemerchant = (event: any) => {
        //     // In a real app, you would get a merchant session from your server
        //     console.log("Validating merchant", event.validationURL);
        //     // Simulating a successful merchant session for testing
        //     session.completeMerchantValidation({});
        // };

        // session.onpaymentauthorized = (event: any) => {
        //     console.log("Payment authorized", event.payment);
        //     // Here you would send the payment token to your server for processing

        //     // Simulating a successful payment for testing
        //     // session.completePayment(ApplePaySession.STATUS_SUCCESS);
        //     toast({ title: t("payment_success_title"), description: t("payment_success_desc") });
        //     onPaymentSuccess();
        // };

        // session.oncancel = () => {
        //     console.log("Payment cancelled");
        //     toast({ variant: "destructive", title: t("payment_cancelled_title") });
        // };

        // session.begin();
    };

    const paymentRequest: google.payments.api.PaymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
            {
                type: "CARD",
                parameters: {
                    allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                    allowedCardNetworks: ["MASTERCARD", "VISA"],
                },
                tokenizationSpecification: {
                    type: "PAYMENT_GATEWAY",
                    parameters: {
                        gateway: "example",
                        gatewayMerchantId: "exampleGatewayMerchantId",
                    },
                },
            },
        ],
        merchantInfo: {
            merchantId: "12345678901234567890", // Test Merchant ID
            merchantName: "ShopWise",
        },
        transactionInfo: {
            totalPriceStatus: "FINAL",
            totalPriceLabel: t("total_label"),
            totalPrice: planPrices[billingCycle].toFixed(2),
            currencyCode: "BRL",
            countryCode: "BR",
        },
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            <GooglePayButton
                environment="TEST"
                buttonType="subscribe"
                buttonSizeMode="fill"
                paymentRequest={paymentRequest}
                onLoadPaymentData={(paymentData) => {
                    console.log("Google Pay Success", paymentData.paymentMethodData);
                    toast({ title: t("payment_success_title"), description: t("payment_success_desc") });
                    onPaymentSuccess();
                    return {};
                }}
                onError={(error: any) => {
                    console.error("Google Pay Error", error);
                    toast({ variant: "destructive", title: t("payment_error_title"), description: error.message });
                }}
            />
            {canMakeApplePay && (
                <Button onClick={handleApplePay} className="w-full h-10 bg-black text-white hover:bg-gray-800">
                    <FontAwesomeIcon icon={faApple} className="mr-2 h-5 w-5" />
                    Pay
                </Button>
            )}
        </div>
    );
}
