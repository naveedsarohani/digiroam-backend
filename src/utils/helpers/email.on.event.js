import emailTemplateService from "../../app/services/email.template.service.js";
import { application } from "../../config/env.js";
import axiosInstance from "./axios.instance.js";
import email from "./email.js";

// security email alerts
const newLogin = async (user) => {
    try {
        const template = await emailTemplateService.retrieveOne({ eventName: "ON_LOGIN" });

        let emailOptions;
        if (template) {
            const htmlContent = template.body
                .replaceAll("{{CUSTOMER_NAME}}", user.name);

            emailOptions = {
                subject: template.subject,
                html: htmlContent,
            };
        } else {
            emailOptions = {
                subject: "New Login Detected - Was This You?",
                CUSTOMER_NAME: user.name,
                SUPPORT_EMAIL: application.supportEmail,
                template: "email_templates/login.attempt"
            };
        }

        await email.send(user.email, emailOptions);
    } catch (error) {
        throw error;
    }
};

const passwordChange = async (user) => {
    try {
        const template = await emailTemplateService.retrieveOne({ eventName: "ON_PASSWORD_CHANGE" });

        let emailOptions;
        if (template) {
            const htmlContent = template.body
                .replaceAll("{{CUSTOMER_NAME}}", user.name);

            emailOptions = {
                subject: template.subject,
                html: htmlContent,
            };
        } else {
            emailOptions = {
                subject: "Account Password Changed – Was This You?",
                CUSTOMER_NAME: user.name,
                SUPPORT_EMAIL: application.supportEmail,
                template: "email_templates/password.change"
            };
        }

        await email.send(user.email, emailOptions);
    } catch (error) {
        throw error;
    }
};

const orderPurchase = async (orderNo, user) => {
    try {
        const profiles = await retrieveProfiles({ orderNo });
        const template = await emailTemplateService.retrieveOne({ eventName: "ON_PURCHASE" });

        const emailPromises = profiles.map((profile) => {
            let emailOptions;
            if (template) {
                const htmlContent = template.body
                    .replaceAll("{{CUSTOMER_NAME}}", user.name)
                    .replaceAll("{{PLAN_NAME}}", profile.packageList[0].packageName)
                    .replaceAll("{{COUNTRY}}", profile.packageList[0].locationCode)
                    .replaceAll("{{DAYS}}", profile.totalDuration)
                    .replaceAll("{{DATA_LIMIT}}", (((profile.totalVolume / 1024) / 1024) / 1024));

                emailOptions = {
                    subject: template.subject.replace("{{ORDER_ID}}", orderNo),
                    html: htmlContent,
                };
            } else {
                emailOptions = {
                    subject: `Your Travel eSIM is Ready! Order Confirmation #${orderNo}`,
                    CUSTOMER_NAME: user.name,
                    PLAN_NAME: profile.packageList[0].packageName,
                    COUNTRY: profile.packageList[0].locationCode,
                    DAYS: profile.totalDuration,
                    DATA_LIMIT: ((profile.totalVolume / 1024) / 1024) / 1024,
                    SUPPORT_EMAIL: application.supportEmail,
                    template: "email_templates/order.confirm"
                };
            }

            return email.send(user.email, emailOptions);
        });

        await Promise.all(emailPromises);
    } catch (error) {
        throw error;
    }
};

const orderCencel = async (iccid, user) => {
    try {
        const profile = (await retrieveProfiles({ iccid })).at(0);
        const template = await emailTemplateService.retrieveOne({ eventName: "ON_CANCEL" });

        let emailOptions;
        if (template) {
            const htmlContent = template.body
                .replaceAll("{{CUSTOMER_NAME}}", user.name)
                .replaceAll("{{PLAN_NAME}}", profile.packageList[0].packageName)
                .replaceAll("{{COUNTRY}}", profile.packageList[0].locationCode)
                .replaceAll("{{DAYS}}", profile.totalDuration)
                .replaceAll("{{DATA_LIMIT}}", (((profile.totalVolume / 1024) / 1024) / 1024))
                .replaceAll("{{ICCID}}", iccid);

            emailOptions = {
                subject: template.subject.replace("{{ICCID}}", iccid),
                html: htmlContent,
            };
        } else {
            emailOptions = {
                subject: `Your Travel eSIM #${iccid} Has Been Canceled`,
                CUSTOMER_NAME: user.name,
                ICCID: iccid,
                PLAN_NAME: profile.packageList[0].packageName,
                COUNTRY: profile.packageList[0].locationCode,
                DAYS: profile.totalDuration,
                DATA_LIMIT: ((profile.totalVolume / 1024) / 1024) / 1024,
                SUPPORT_EMAIL: application.supportEmail,
                template: "email_templates/order.cancel"
            };
        }

        await email.send(user.email, emailOptions);
    } catch (error) {
        throw error;
    }
};

const orderUsage = async (user) => {
    try {
        const template = await emailTemplateService.retrieveOne({ eventName: "ON_USAGE_80" });

        let emailOptions;
        if (template) {
            const htmlContent = template.body
                .replaceAll("{{CUSTOMER_NAME}}", user.name);

            emailOptions = {
                subject: template.subject,
                html: htmlContent,
            };
        } else {
            emailOptions = {
                subject: "You’ve Used 80% of Your Data – Top Up Now!",
                CUSTOMER_NAME: user.name,
                SUPPORT_EMAIL: application.supportEmail,
                template: "email_templates/order.usage"
            };
        }

        await email.send(user.email, emailOptions);
    } catch (error) {
        throw error;
    }
};

const orderValidity = async (content, user) => {
    try {
        const profile = (await retrieveProfiles({ iccid: content.iccid })).at(0);
        const template = await emailTemplateService.retrieveOne({ eventName: "ON_1D_VALIDITY" });

        let emailOptions;
        if (template) {
            const htmlContent = template.body
                .replaceAll("{{CUSTOMER_NAME}}", user.name)
                .replaceAll("{{COUNTRY}}", profile.packageList[0].locationCode);

            emailOptions = {
                subject: template.subject,
                html: htmlContent,
            };
        } else {
            emailOptions = {
                subject: "Your eSIM Plan is Expiring Soon!",
                CUSTOMER_NAME: user.name,
                COUNTRY: profile.packageList[0].locationCode,
                template: "email_templates/order.validity"
            };
        }

        await email.send(user.email, emailOptions);
    } catch (error) {
        throw error;
    }
};

const orderExpired = async (user) => {
    try {
        const template = await emailTemplateService.retrieveOne({ eventName: "ON_EXPIRED" });

        let emailOptions;
        if (template) {
            const htmlContent = template.body
                .replaceAll("{{CUSTOMER_NAME}}", user.name)

            emailOptions = {
                subject: template.subject,
                html: htmlContent,
            };
        } else {
            emailOptions = {
                subject: "Your eSIM Has Expired – Stay Connected!",
                CUSTOMER_NAME: user.name,
                SUPPORT_EMAIL: application.supportEmail,
                template: "email_templates/order.validity"
            };
        }

        await email.send(user.email, emailOptions);
    } catch (error) {
        throw error;
    }
};

// eSim email alerts
export const retrieveProfiles = async ({ orderNo = null, iccid = null }) => {
    try {
        const response = await axiosInstance.post("/esim/query", {
            ...(orderNo && { orderNo }),
            ...(iccid && { iccid }),
            pager: { pageNum: 1, pageSize: 20 }
        });

        if (!response.data?.success) return [];
        return response.data.obj?.esimList ?? [];
    } catch (error) {
        throw error;
    }
};

export default { newLogin, passwordChange, orderPurchase, orderCencel, orderUsage, orderValidity, orderExpired }