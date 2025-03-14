import emailTemplateService from "../../app/services/email.template.service.js";
import axiosInstance from "./axios.instance.js";
import email from "./email.js";
import path from "path";

const sendPasswordChangeEmail = async (user) => {
    try {
        // const template = await emailTemplateService.retrieveOne({ eventName: "ON_PASSWORD_CHANGE" });

        let emailOptions;
        if (false) {
            let html = template.body
                .replaceAll("{Customer_Name}", user.name)

            const emailAttachments = template.attachments?.map(filename => ({
                filename,
                path: path.join(process.cwd(), "public/uploads", filename),
            })) ?? [];

            emailOptions = {
                subject: template.subject,
                html,
                attachments: emailAttachments
            };
        } else {
            emailOptions = {
                subject: "RoamDigi - Your Password Has Been Changed",
                customerName: user.name,
                supportEmail: "support@roamdigi.com",
                template: "password.change"
            };
        }

        await email.send(user.email, emailOptions);
    } catch (error) {
        throw error;
    }
};

const sendOrderEmail = async (orderNo, user) => {
    try {
        const profiles = await axiosInstance({
            method: "POST",
            url: "/esim/query",
            data: { orderNo, pager: { pageNum: 1, pageSize: 20 } }
        });

        if (!profiles.data?.success) return;
        const data = profiles.data.obj.esimList;

        // const template = await emailTemplateService.retrieveOne({ eventName: "ON_PURCHASE" });

        let emailOptions;
        if (false) {
            let html = template.body
                .replaceAll("{Customer_Name}", user.name)
                .replaceAll("{Plan_Name}", data[0].packageList[0].packageName)
                .replaceAll("{Country}", data[0].packageList[0].locationCode)
                .replaceAll("{Days}", data[0].totalDuration)
                .replaceAll("{Data_Limit}", (((data[0].totalVolume / 1024) / 1024) / 1024).toFixed(2))

            const emailAttachments = template.attachments?.map(filename => ({
                filename,
                path: path.join(process.cwd(), "public/uploads", filename),
            })) ?? [];

            emailOptions = {
                subject: template.subject,
                html,
                attachments: emailAttachments
            };
        } else {
            emailOptions = {
                subject: `Your Travel eSIM is Ready! Order Confirmation ${orderNo}`,
                customerName: user.name,
                planName: data[0].packageList[0].packageName,
                country: data[0].packageList[0].locationCode,
                days: data[0].totalDuration,
                dataLimit: ((data[0].totalVolume / 1024) / 1024) / 1024,
                supportEmail: "support@roamdigi.com",
                activationGuideLink: "https://roamdigi.com/faqs",
                template: "order.confirm"
            };
        }

        await email.send(user.email, emailOptions);
    } catch (error) {
        throw error;
    }
};


const sendCencelEmail = async (iccid, user) => {
    try {
        const profiles = await axiosInstance({
            method: "POST", url: "/esim/query", data: {
                iccid, pager: { pageNum: 1, pageSize: 20 }
            }
        });

        if (profiles.data?.success === false) return;
        const data = profiles.data.obj.esimList;

        // const template = await emailTemplateService.retrieveOne({ eventName: "ON_PURCHASE" });

        let emailOptions;
        if (false) {
            let html = template.body
                .replaceAll("{Customer_Name}", user.name)
                .replaceAll("{Plan_Name}", data[0].packageList[0].packageName)
                .replaceAll("{Country}", data[0].packageList[0].locationCode)
                .replaceAll("{Days}", data[0].totalDuration)
                .replaceAll("{Data_Limit}", (((data[0].totalVolume / 1024) / 1024) / 1024).toFixed(2))

            const emailAttachments = template.attachments?.map(filename => ({
                filename,
                path: path.join(process.cwd(), "public/uploads", filename),
            })) ?? [];

            emailOptions = {
                subject: template.subject,
                html,
                attachments: emailAttachments
            };
        } else {
            emailOptions = {
                subject: `Your Travel eSIM ICCID ${iccid} Has Been Canceled`,
                customerName: user.name,
                planName: data[0].packageList[0].packageName,
                country: data[0].packageList[0].locationCode,
                days: data[0].totalDuration,
                dataLimit: ((data[0].totalVolume / 1024) / 1024) / 1024,
                orderNo: data[0].orderNo,
                supportEmail: "support@roamdigi.com",
                template: "order.cancel"
            }
        }

        await email.send(user.email, emailOptions);
    } catch (error) {
        throw error;
    }
}

export { sendPasswordChangeEmail, sendOrderEmail, sendCencelEmail }