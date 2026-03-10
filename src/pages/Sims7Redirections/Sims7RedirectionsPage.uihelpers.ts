// UI orchestration helpers for Sims7RedirectionsPage.view.tsx
import { IBreadcrumbLink, NotificationStatus, DialogTemplate } from "@essnextgen/ui-kit";

export function getBreadcrumbs(t: (key: string) => string, homeurl: string): IBreadcrumbLink[] {
    return [
        {
            active: true,
            linkName: `${t("homePage.appTitle")}`,
            path: "/"
        },
        {
            active: false,
            linkName: `${t("breadcrumbsadminconsole")}`,
            path: homeurl
        },
        {
            active: false,
            linkName: `${t("SIMS7Redirects.title")}`,
            path: "/"
        }
    ];
}

export function getNotificationMsgBannerObject(t: (key: string) => string) {
    return [
        {
            isShow: true,
            variant: "warning",
            title: t("SIMS7Redirects.apiFailureMessage"),
            message: t("SIMS7Redirects.apiFailureDescription"),
            autoclose: true
        }
    ];
}

export function getDialogTemplateProps(t: (key: string) => string) {
    return {
             cancelText: t("SIMS7Redirects.cancel"),
             contentText: t("SIMS7Redirects.contentText"),
        isNotificationanner: false,
        notificationStatus: NotificationStatus.SUCCESS,
        okText: t("SIMS7Redirects.okText"),
        onCancel: () => {},
        onConfirm: () => {},
        template: DialogTemplate.Confirmation
    };
}
