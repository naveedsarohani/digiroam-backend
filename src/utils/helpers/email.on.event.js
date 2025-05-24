import emailTemplateService from "../../app/services/email.template.service.js";
import settingService from "../../app/services/setting.service.js";
import { application } from "../../config/env.js";
import axiosInstance from "./axios.instance.js";
import email from "./email.js";
import retrieveHtmlTemplate from "./retrieve.html.template.js";

export const retrieveEmailAndPhone = async () => {
    const { contactList } = await settingService.retrieve();

    const phoneObj = contactList.find(item => item.field == "Phone" || item.field == "phone");
    const emailObj = contactList.find(item => item.field == "Email" || item.field == "email");

    const phone = phoneObj ? phoneObj.label.trim() : null;
    const email = emailObj ? emailObj.label.trim() : null;

    return { emailAddress: email, phoneNumber: phone }
}

// security email alerts
const newLogin = async (user) => {
    try {
        const template = await emailTemplateService.retrieveOne({ eventName: "ON_LOGIN" });
        const { emailAddress, phoneNumber } = await retrieveEmailAndPhone();

        let emailOptions;
        if (template) {
            const htmlContent = template.body
                .replaceAll("{{CUSTOMER_NAME}}", user.name);

            emailOptions = {
                subject: template.subject,
                html: await retrieveHtmlTemplate('on.login', {
                    title: template.subject,
                    content: htmlContent,
                    description: "Dear Customer,Thank you for logging in to RoamDigi! Your eSIM service is now active — stay connected anytime, anywhere. We're here if you need any help.",
                    email: emailAddress,
                    phone: phoneNumber
                }),
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
        const { emailAddress, phoneNumber } = await retrieveEmailAndPhone();

        let emailOptions;
        if (template) {
            const htmlContent = template.body
                .replaceAll("{{CUSTOMER_NAME}}", user.name);

            emailOptions = {
                subject: template.subject,
                html: await retrieveHtmlTemplate('on.password.change', {
                    title: template.subject,
                    content: htmlContent,
                    description: "For your protection, we recommend using a strong and unique password for your RoamDigi account.",
                    email: emailAddress,
                    phone: phoneNumber
                }),
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
        const { emailAddress, phoneNumber } = await retrieveEmailAndPhone();

        const emailPromises = profiles.map(async (profile) => {
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
                    html: await retrieveHtmlTemplate('on.purchase', {
                        title: template.subject.replace("{{ORDER_ID}}", orderNo),
                        content: htmlContent,
                        description: "Thank you for purchasing your eSIM from RoamDigi! You're now ready to enjoy seamless connectivity worldwide. If you need any help setting up, our support team is here for you.",
                        email: emailAddress,
                        phone: phoneNumber
                    }),
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
        const { emailAddress, phoneNumber } = await retrieveEmailAndPhone();

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
                html: await retrieveHtmlTemplate('on.cancel', {
                    title: template.subject.replace("{{ICCID}}", iccid),
                    content: htmlContent,
                    description: "Dear Customer, We’ve successfully processed your eSIM cancellation with RoamDigi. If there’s anything we can do to improve your experience or assist in the future, feel free to reach out.",
                    email: emailAddress,
                    phone: phoneNumber
                }),
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
        const { emailAddress, phoneNumber } = await retrieveEmailAndPhone();

        let emailOptions;
        if (template) {
            const htmlContent = template.body
                .replaceAll("{{CUSTOMER_NAME}}", user.name);

            emailOptions = {
                subject: template.subject,
                html: await retrieveHtmlTemplate('on.usage', {
                    title: template.subject,
                    content: htmlContent,
                    description: "Your eSIM service is used 80%. After expiry, you can easily purchase a new eSIM to continue enjoying seamless connectivity.",
                    email: emailAddress,
                    phone: phoneNumber
                }),
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
        const { emailAddress, phoneNumber } = await retrieveEmailAndPhone();

        let emailOptions;
        if (template) {
            const htmlContent = template.body
                .replaceAll("{{CUSTOMER_NAME}}", user.name)
                .replaceAll("{{COUNTRY}}", profile.packageList[0].locationCode);

            emailOptions = {
                subject: template.subject,
                html: await retrieveHtmlTemplate('on.oneday.validity', {
                    title: template.subject,
                    content: htmlContent,
                    description: "You can also purchase a brand new eSIM anytime and stay connected without interruption.",
                    email: emailAddress,
                    phone: phoneNumber
                }),
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
        const { emailAddress, phoneNumber } = await retrieveEmailAndPhone();

        let emailOptions;
        if (template) {
            const htmlContent = template.body
                .replaceAll("{{CUSTOMER_NAME}}", user.name)

            emailOptions = {
                subject: template.subject,
                html: await retrieveHtmlTemplate('on.expired', {
                    title: template.subject,
                    content: htmlContent,
                    description: "Expired eSIMs cannot be reused. Please select a new plan to continue enjoying RoamDigi services.",
                    email: emailAddress,
                    phone: phoneNumber
                }),
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
            pager: { pageNum: 1, pageSize: 50 }
        });

        if (!response.data?.success) return [];
        return response.data.obj?.esimList ?? [];
    } catch (error) {
        throw error;
    }
};

export default { newLogin, passwordChange, orderPurchase, orderCencel, orderUsage, orderValidity, orderExpired }